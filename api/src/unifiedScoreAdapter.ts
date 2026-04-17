// ─────────────────────────────────────────────────────────────
// UnifiedScoreAdapter — 빅파이 1.5 Phase 1 Step 3
//
// 목적: 기존 `runEngine` 결과(Tavily sources + AIProbes)를
//       unifiedScore.ts의 DimensionContext로 변환하고, 부족한 입력
//       (category ranking, probe_logs 누적)을 최소 비용으로 보강.
//
// 설계 원칙:
//   - 기존 `runEngine`은 손대지 않는다 (B안: 병존).
//   - Perplexity 추가 호출은 1쿼리로 제한 (category 추론 + best ranking 통합).
//   - 플래그가 off면 이 모듈은 호출되지 않는다 (비용 0).
//   - 카테고리 힌트가 없으면 Category Ranking = not_measured (0점).
//
// 작성: 2026-04-17 (Phase 1 Step 3)
// ─────────────────────────────────────────────────────────────

import {
  DimensionContext,
  DimensionScore,
  UnifiedScoreResult,
  computeRecognition,
  computeCategoryRanking,
  computeCoRecommendation,
  computeWebAuthority,
  assembleUnifiedScore,
} from './unifiedScore'

// ===== Adapter 전용 타입 (index.ts와 느슨하게 결합) =====

export type AdapterEnv = {
  PERPLEXITY_API_KEY?: string
  SUPABASE_SERVICE_KEY?: string
  SUPABASE_URL?: string
}

export type EngineInputs = {
  productName: string
  productUrl?: string
  tavilySources: Array<{ url: string; tier: number; isOwn: boolean }>
  aiProbes: Array<{
    ai: string
    recognized: boolean
    recommended: boolean
    snippet: string
    citations: string[]
  }>
}

const DEFAULT_SUPABASE_URL = 'https://pfrcppgecqsbnhkkjkbd.supabase.co'

// ===== 메인 빌더 + 합산 =====

/**
 * runEngine 결과를 4차원 단일 스코어 계산 입력으로 변환.
 * 추가 비용: Perplexity 1쿼리 (카테고리 추론 + best ranking 통합).
 */
export async function buildDimensionContext(
  env: AdapterEnv,
  inputs: EngineInputs,
): Promise<DimensionContext> {
  const gemini = inputs.aiProbes.find(p => p.ai === 'gemini')
  const perplexity = inputs.aiProbes.find(p => p.ai === 'perplexity')

  // 카테고리 추론 + Ranking 측정 (병렬 불가: 카테고리 확정 후 쿼리)
  const { rankings } = await inferCategoryAndRank(env, inputs.productName, inputs.aiProbes)

  // Co-Rec 누적 로그 (점수 계산용)
  const dbLogs = await fetchProbeLogsForScoring(env, inputs.productName)

  // logProbes와 병렬 실행으로 현재 체크 결과가 DB에 미반영 → 즉시 합산
  const currentRecs = inputs.aiProbes.map(p => ({
    co_recommendations: extractCoRecsFromSnippet(p.snippet, inputs.productName),
  }))
  const probeLogs = [...dbLogs, ...currentRecs]

  return {
    productName: inputs.productName,
    productUrl: inputs.productUrl,
    geminiResponse: gemini
      ? { recognized: gemini.recognized, recommended: gemini.recommended, text: gemini.snippet }
      : undefined,
    perplexityResponse: perplexity
      ? {
          recognized: perplexity.recognized,
          recommended: perplexity.recommended,
          text: perplexity.snippet,
          citations: perplexity.citations || [],
        }
      : undefined,
    categoryRankings: rankings,
    probeLogs,
    tavilySources: inputs.tavilySources,
  }
}

/** 현재 probe snippet에서 co_recommendations 추출 (index.ts extractCoRecommendations와 동일 로직) */
function extractCoRecsFromSnippet(snippet: string, productName: string): string[] {
  if (!snippet || snippet.length < 10) return []
  const target = productName.toLowerCase()
  const found = new Set<string>()
  const numbered = /^\s*\d+[\.\)]\s+([A-Z][A-Za-z0-9\s.\-]{1,40}?)(?:\s*[-–:,\n]|$)/gm
  let m: RegExpExecArray | null
  while ((m = numbered.exec(snippet)) !== null) {
    const c = m[1].trim()
    if (c.toLowerCase() !== target && c.length > 1 && c.length < 40) found.add(c)
  }
  return [...found].slice(0, 8)
}

/**
 * 4차원 전부 계산 → UnifiedScoreResult 반환.
 * sum(dimensions[].score) === final.score 수학적 보장.
 */
export function computeUnified(ctx: DimensionContext): UnifiedScoreResult {
  const dimensions: DimensionScore[] = [
    computeRecognition(ctx),
    computeCategoryRanking(ctx),
    computeCoRecommendation(ctx),
    computeWebAuthority(ctx),
  ]
  return assembleUnifiedScore(ctx, dimensions)
}

// ===== Category 추론 + Ranking 측정 =====

/**
 * 기존 Probe snippet에서 카테고리 힌트 추출 → 실패 시 null (점수 0).
 * 힌트가 있으면 Perplexity에 `best {category}` 1쿼리로 랭킹 파싱.
 */
async function inferCategoryAndRank(
  env: AdapterEnv,
  productName: string,
  aiProbes: Array<{ ai: string; snippet: string }>,
): Promise<{
  category: string | null
  rankings: Array<{ engine: string; rank: number | null; query: string }>
}> {
  const category = extractCategoryHint(productName, aiProbes)
  if (!category || !env.PERPLEXITY_API_KEY) {
    return { category, rankings: [] }
  }

  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content:
              'You are a product recommendation expert. List REAL products in a numbered list (1. Name — desc). Do not invent. Under 250 words.',
          },
          {
            role: 'user',
            content: `What are the top 10 best ${category} tools in 2026? Numbered list only.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) {
      console.error(`[UNIFIED_V15] category rank perplexity ${res.status}`)
      return { category, rankings: [] }
    }
    const json = (await res.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    const text = json.choices?.[0]?.message?.content ?? ''
    const rank = parseRankFromList(text, productName)
    return {
      category,
      rankings: [{ engine: 'perplexity', rank, query: `best ${category}` }],
    }
  } catch (err) {
    console.error('[UNIFIED_V15] inferCategoryAndRank error:', err)
    return { category, rankings: [] }
  }
}

// 카테고리 수식어로만 쓰이는 단어 — 제거 후 핵심 카테고리만 남김
const CATEGORY_STOP_WORDS = new Set([
  'all-in-one', 'ai-powered', 'ai-assisted', 'versatile', 'advanced', 'popular',
  'leading', 'powerful', 'comprehensive', 'next-generation', 'cloud-based',
  'open-source', 'free', 'paid', 'premium', 'enterprise', 'modern', 'innovative',
  'intuitive', 'robust', 'scalable', 'flexible', 'integrated', 'collaborative',
])

// type 단어 자체를 카테고리로 직접 쓸 수 있는 경우 (수식어만 있고 핵심어 없을 때)
const TYPE_AS_CATEGORY: Record<string, string> = {
  workspace: 'workspace', suite: 'productivity suite', platform: 'platform',
}

/**
 * Probe snippet에서 카테고리 힌트 추출.
 * 1단계: "{name} is a X tool" 패턴 + 수식어 stop words 제거
 * 2단계: stop words 제거 후 빈 경우 type 단어 자체를 카테고리로 사용
 * 마크다운 제거 후 적용. 실패 시 null.
 */
function extractCategoryHint(
  productName: string,
  probes: Array<{ snippet: string }>,
): string | null {
  const nameEsc = escapeRegex(productName)
  const TYPE_WORDS = 'tool|platform|app|software|service|solution|workspace|suite|engine|assistant|model'
  // 최대 4단어 수식어 허용 (stop words 후처리로 제거)
  const pattern = new RegExp(
    `(?:${nameEsc}|[Ii]t|[Tt]his(?:\\s+tool)?|which)\\s+is\\s+(?:an?\\s+)?` +
    `((?:[a-z][a-z\\-]{1,25}\\s+){0,3}[a-z][a-z\\-]{2,25})` +
    `\\s+(?:${TYPE_WORDS})`,
    'i',
  )
  // type 단어도 함께 캡처 (fallback용)
  const typePattern = new RegExp(
    `(?:${nameEsc}|[Ii]t|[Tt]his(?:\\s+tool)?|which)\\s+is\\s+(?:an?\\s+)` +
    `(?:[a-z][a-z\\-\\s]{0,60}\\s+)?(${TYPE_WORDS})`,
    'i',
  )

  for (const p of probes) {
    if (!p.snippet) continue
    const cleaned = p.snippet.replace(/\*{1,3}([^*\n]*)\*{1,3}/g, '$1')

    const m = pattern.exec(cleaned)
    if (m && m[1]) {
      // stop words 제거 후 남은 핵심어
      const words = m[1].trim().toLowerCase().split(/\s+/).filter(w => !CATEGORY_STOP_WORDS.has(w))
      if (words.length > 0) {
        const cat = words.join(' ')
        if (cat.length > 2 && cat.length < 40) return cat
      }
      // 수식어만 있어 핵심어 없으면 type 단어 fallback
      const tm = typePattern.exec(cleaned)
      if (tm && tm[1]) {
        const typeFallback = TYPE_AS_CATEGORY[tm[1].toLowerCase()]
        if (typeFallback) return typeFallback
      }
    }
  }
  return null
}

/**
 * Perplexity 응답의 넘버드 리스트에서 제품명 랭크 파싱.
 * 반환: 1~20 또는 null(미등장).
 */
function parseRankFromList(text: string, name: string): number | null {
  if (!text) return null
  const nameLower = name.toLowerCase()
  const lines = text.split(/\r?\n/)
  for (const line of lines) {
    const m = /^\s*(\d+)[\.\)]\s+(.+)/.exec(line)
    if (!m) continue
    const rank = parseInt(m[1], 10)
    if (rank < 1 || rank > 20) continue
    if (m[2].toLowerCase().includes(nameLower)) return rank
  }
  return null
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ===== Probe Logs 조회 (Co-Rec Graph 점수 계산용) =====

/**
 * probe_logs에서 co_recommendations 배열을 최신순 200건 조회.
 * unifiedScore.computeCoRecommendation이 Set으로 dedupe.
 */
async function fetchProbeLogsForScoring(
  env: AdapterEnv,
  productName: string,
): Promise<Array<{ co_recommendations: string[] | null; created_at?: string }>> {
  if (!env.SUPABASE_SERVICE_KEY) return []
  const sbUrl = env.SUPABASE_URL || DEFAULT_SUPABASE_URL
  try {
    const res = await fetch(
      `${sbUrl}/rest/v1/probe_logs?product_id=eq.${encodeURIComponent(productName)}&select=co_recommendations,created_at&order=created_at.desc&limit=200`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
      },
    )
    if (!res.ok) return []
    return (await res.json()) as Array<{
      co_recommendations: string[] | null
      created_at?: string
    }>
  } catch (err) {
    console.error('[UNIFIED_V15] fetchProbeLogsForScoring error:', err)
    return []
  }
}
