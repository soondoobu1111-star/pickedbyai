// ─────────────────────────────────────────────────────────────
// probeRedesign.ts — D7 PROBE-REDESIGN-01 D안 역방향 스무고개
//
// Phase 1: 카테고리 확정 (Perplexity sonar, 24h 캐시)
// Phase 2: 역방향 스무고개 티어 판정 (T1~T4)
//   Step 1 — T4 탈락 검사 (모름 여부)
//   Step 2 — T3 Emerging 판정
//   Step 3 — T1/T2 Top-10 판정 (Perplexity + Gemini 병렬)
// Phase 3 — Use-case 실전 테스트 (+5 보너스)
//
// 티어별 Recognition 기본값: T1=35, T2=25, T3=15, T4=5
// Category 점수 (T1 전용): rank1=35, rank2-3=25, rank4-10=15, null=0
// CoRec: Step 2/3/Phase3 넘버드 리스트에서 자동 추출 (최대 8개, 2.5pt/개)
//
// 작성: 2026-04-24 (D7 PROBE-REDESIGN-01)
// ─────────────────────────────────────────────────────────────

import { getCategoryCache, setCategoryCache } from './probeCache'
import type { CategoryCacheEntry } from './probeCache'
import type { AdapterEnv } from './unifiedScoreAdapter'
import type { DimensionContext } from './unifiedScore'

// ── 티어 정의 ────────────────────────────────────────────────

export type Tier = 'T1' | 'T2' | 'T3' | 'T4'

const TIER_RECOGNITION: Record<Tier, number> = {
  T1: 35, T2: 25, T3: 15, T4: 5,
}

function rankToCategory(rank: number | null): number {
  if (rank === null) return 0
  if (rank === 1) return 35
  if (rank <= 3) return 25
  if (rank <= 10) return 15
  return 0
}

// ── 결과 타입 ────────────────────────────────────────────────

export type DAnswerResult = {
  tier: Tier
  rank: number | null           // T1=1~10, T2/T3/T4=null
  category: string
  sub_category?: string
  primary_use_case: string
  useCaseRecommended: boolean   // Phase 3 보너스 여부
  coRecommendations: string[]   // Step 2/3/Phase3에서 추출, max 8
  phase1FromCache: boolean
}

// ── API 헬퍼 ────────────────────────────────────────────────

async function callPerplexity(
  env: AdapterEnv,
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 400,
): Promise<string> {
  if (!env.PERPLEXITY_API_KEY) throw new Error('[probeRedesign] PERPLEXITY_API_KEY missing')
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.1,
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`[probeRedesign] Perplexity ${res.status}`)
  const json = (await res.json()) as { choices: Array<{ message: { content: string } }> }
  return json.choices?.[0]?.message?.content ?? ''
}

const DEFAULT_GEMINI_RELAY_URL = 'https://pickedbyai-gemini-relay.perceptdot.workers.dev/relay'

async function callGemini(env: AdapterEnv, prompt: string): Promise<string> {
  const body = JSON.stringify({ prompt, useSearch: true })
  try {
    if (env.GEMINI_RELAY) {
      const res = await env.GEMINI_RELAY.fetch(
        new Request('https://relay/relay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        }),
      )
      if (!res.ok) return ''
      const json = (await res.json()) as { text?: string }
      return json.text ?? ''
    }
    const relayUrl = env.GEMINI_RELAY_URL || DEFAULT_GEMINI_RELAY_URL
    const res = await fetch(relayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) return ''
    const json = (await res.json()) as { text?: string }
    return json.text ?? ''
  } catch {
    return ''
  }
}

// ── 리스트 파싱 헬퍼 ─────────────────────────────────────────

type ListItem = { rank: number; name: string }

/** 넘버드 리스트 파싱. "1. Name — desc" → {rank:1, name:"Name"} */
function parseNumberedList(text: string): ListItem[] {
  const items: ListItem[] = []
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*(\d+)[\.\)]\s+(.+)/.exec(line)
    if (!m) continue
    const rank = parseInt(m[1], 10)
    if (rank < 1 || rank > 20) continue
    // 이름만 추출: "—", "-", ":", "," 앞까지
    const rawName = m[2].split(/\s+[–\-—:,]|,\s/)[0].trim()
    if (rawName.length > 0) items.push({ rank, name: rawName })
  }
  return items
}

/** 넘버드 리스트에서 제품 랭크 찾기. 미발견 → null. */
function findInList(items: ListItem[], productName: string): number | null {
  const target = productName.toLowerCase()
  for (const item of items) {
    const n = item.name.toLowerCase()
    if (n.includes(target) || target.includes(n)) return item.rank
  }
  return null
}

/** 제품명 제외 co-recs 추출 (max 8). */
function extractCoRecs(items: ListItem[], productName: string): string[] {
  const target = productName.toLowerCase()
  return items
    .filter(item => {
      const n = item.name.toLowerCase()
      return !n.includes(target) && !target.includes(n)
    })
    .map(item => item.name)
    .slice(0, 8)
}

// ── Phase 1: 카테고리 확정 ────────────────────────────────────

async function inferCategoryAndUseCase(
  env: AdapterEnv,
  productName: string,
): Promise<CategoryCacheEntry & { fromCache: boolean }> {
  // 캐시 우선
  const cached = await getCategoryCache(env, productName)
  if (cached) {
    console.log(`[PROBE_D7] Phase1 cache hit: ${productName} → ${cached.category}`)
    return { ...cached, fromCache: true }
  }

  const system = 'You are a concise product analyst. Respond in plain structured text only. No markdown.'
  const user =
    `What is ${productName}? In 50 words or less, answer exactly:\n` +
    `DESCRIPTION: <one sentence>\n` +
    `CATEGORY: <2-4 lowercase words, e.g. "note-taking app", "ai search engine">\n` +
    `USE_CASE: <verb + object, e.g. "organize meeting notes">`

  let text = ''
  try {
    text = await callPerplexity(env, system, user, 200)
  } catch (err) {
    console.error('[PROBE_D7] Phase1 error:', err)
    return {
      category: 'software tool',
      primary_use_case: `use ${productName}`,
      fromCache: false,
    }
  }

  const descMatch = /DESCRIPTION:\s*(.+)/i.exec(text)
  const catMatch = /CATEGORY:\s*(.+)/i.exec(text)
  const useCaseMatch = /USE_CASE:\s*(.+)/i.exec(text)

  const rawCat = catMatch?.[1]?.trim().toLowerCase() ?? ''
  // 유효하지 않은 카테고리 폴백
  const category = rawCat.length >= 3 && rawCat.length <= 60 ? rawCat : 'software tool'

  const entry: CategoryCacheEntry = {
    description: descMatch?.[1]?.trim(),
    category,
    primary_use_case: useCaseMatch?.[1]?.trim() || `use ${productName}`,
  }

  console.log(`[PROBE_D7] Phase1 fresh: ${productName} → ${entry.category}`)

  // 캐시 저장 (non-blocking)
  setCategoryCache(env, productName, entry).catch(() => {})

  return { ...entry, fromCache: false }
}

// ── Phase 2: 역방향 스무고개 ─────────────────────────────────

type Phase2Result = {
  tier: Tier
  rank: number | null
  coRecommendations: string[]
}

async function twentyQuestionsTier(
  env: AdapterEnv,
  productName: string,
  category: string,
): Promise<Phase2Result> {
  const allCoRecs: string[] = []

  // ── Step 1: T4 탈락 검사 ──
  const step1System = 'Reply with ONLY one of the three tokens. No other text whatsoever.'
  const step1User =
    `Do you know ${productName}? Is it a ${category}?\n` +
    `Reply with exactly one token: YES_KNOWN / NO_NEVER_HEARD / KNOWN_BUT_DIFFERENT`

  let step1Text = ''
  try {
    step1Text = await callPerplexity(env, step1System, step1User, 20)
  } catch (err) {
    console.error('[PROBE_D7] Phase2 Step1 error:', err)
    return { tier: 'T4', rank: null, coRecommendations: [] }
  }

  const s1Upper = step1Text.toUpperCase()
  if (s1Upper.includes('NO_NEVER_HEARD') || s1Upper.includes('NEVER_HEARD')) {
    console.log(`[PROBE_D7] ${productName} → T4 (never heard)`)
    return { tier: 'T4', rank: null, coRecommendations: [] }
  }

  // ── Step 2: T3 Emerging 판정 ──
  const listSystem = 'List REAL products only. Numbered list, no markdown, under 200 words.'
  const step2User = `List 10 notable emerging ${category} tools in 2026 beyond the top 10 mainstream ones. Numbered list only.`

  let step2Items: ListItem[] = []
  try {
    const step2Text = await callPerplexity(env, listSystem, step2User, 300)
    step2Items = parseNumberedList(step2Text)
    allCoRecs.push(...extractCoRecs(step2Items, productName))
  } catch (err) {
    console.error('[PROBE_D7] Phase2 Step2 error (continuing):', err)
  }

  const foundEmerging = findInList(step2Items, productName)
  if (foundEmerging !== null) {
    console.log(`[PROBE_D7] ${productName} → T3 (emerging list rank ${foundEmerging})`)
    return { tier: 'T3', rank: null, coRecommendations: [...new Set(allCoRecs)].slice(0, 8) }
  }

  // ── Step 3: T1/T2 Top-10 판정 (Perplexity + Gemini 병렬) ──
  const step3Query = `List the top 10 best ${category} tools in 2026. Numbered list only.`

  const [resP, resG] = await Promise.allSettled([
    callPerplexity(env, listSystem, step3Query, 300),
    callGemini(env, `${step3Query} Numbered list, no markdown, under 150 words.`),
  ])

  const itemsP = resP.status === 'fulfilled' ? parseNumberedList(resP.value) : []
  const itemsG = resG.status === 'fulfilled' ? parseNumberedList(resG.value) : []

  allCoRecs.push(...extractCoRecs(itemsP, productName))
  allCoRecs.push(...extractCoRecs(itemsG, productName))
  const uniqueCoRecs = [...new Set(allCoRecs)].slice(0, 8)

  const rankP = findInList(itemsP, productName)
  const rankG = findInList(itemsG, productName)

  // 두 엔진 중 최선 랭크 채택 (낮을수록 좋음)
  const bestRank =
    rankP !== null && rankG !== null
      ? Math.min(rankP, rankG)
      : rankP ?? rankG

  if (bestRank !== null && bestRank <= 10) {
    console.log(`[PROBE_D7] ${productName} → T1 rank=${bestRank} (P=${rankP} G=${rankG})`)
    return { tier: 'T1', rank: bestRank, coRecommendations: uniqueCoRecs }
  }

  console.log(`[PROBE_D7] ${productName} → T2 (not in top10, P=${rankP} G=${rankG})`)
  return { tier: 'T2', rank: null, coRecommendations: uniqueCoRecs }
}

// ── Phase 3: Use-case 실전 테스트 ────────────────────────────

async function useCaseProbe(
  env: AdapterEnv,
  productName: string,
  primaryUseCase: string,
): Promise<{ recommended: boolean; additionalCoRecs: string[] }> {
  const system = 'Recommend REAL products only. Numbered list, no markdown, under 150 words.'
  const user = `I need to ${primaryUseCase}. Recommend 5 tools I should consider. Numbered list.`

  try {
    const text = await callPerplexity(env, system, user, 250)
    const items = parseNumberedList(text)
    const found = findInList(items, productName)
    console.log(`[PROBE_D7] Phase3 use-case: ${found !== null ? `RECOMMENDED rank${found}` : 'not mentioned'}`)
    return { recommended: found !== null, additionalCoRecs: extractCoRecs(items, productName) }
  } catch (err) {
    console.error('[PROBE_D7] Phase3 error:', err)
    return { recommended: false, additionalCoRecs: [] }
  }
}

// ── 메인 오케스트레이터 ──────────────────────────────────────

/** D-answer 전체 플로우 실행. Phase 1 → 2 → 3 (T4 시 Phase 3 스킵). */
export async function runProbeRedesign(
  env: AdapterEnv,
  productName: string,
): Promise<DAnswerResult> {
  console.log(`[PROBE_D7] === Starting D-answer: ${productName} ===`)

  const phase1 = await inferCategoryAndUseCase(env, productName)
  const phase2 = await twentyQuestionsTier(env, productName, phase1.category)

  let useCaseRecommended = false
  const allCoRecs = [...phase2.coRecommendations]

  // T4는 AI가 제품을 모름 → Phase 3 생략 (비용 절약)
  if (phase2.tier !== 'T4') {
    const phase3 = await useCaseProbe(env, productName, phase1.primary_use_case)
    useCaseRecommended = phase3.recommended
    allCoRecs.push(...phase3.additionalCoRecs)
  }

  const result: DAnswerResult = {
    tier: phase2.tier,
    rank: phase2.rank,
    category: phase1.category,
    sub_category: phase1.sub_category,
    primary_use_case: phase1.primary_use_case,
    useCaseRecommended,
    coRecommendations: [...new Set(allCoRecs)].slice(0, 8),
    phase1FromCache: phase1.fromCache,
  }

  console.log(
    `[PROBE_D7] Done: tier=${result.tier} rank=${result.rank ?? 'N/A'} ` +
    `useCaseRec=${result.useCaseRecommended} coRecs=${result.coRecommendations.length}`,
  )

  return result
}

// ── 4차원 점수 계산 ──────────────────────────────────────────

/**
 * D-answer 결과로 4차원 점수를 직접 계산.
 * recognition: TIER_RECOGNITION[tier] + useCaseBonus(+5, max 35)
 * category:    rankToCategory(rank) — T1 전용
 * corec:       coRecommendations.length × 2.5 (max 20)
 * web:         기존 Tavily 점수 그대로 전달
 */
export function computeDimensionsFromDAsn(
  result: DAnswerResult,
  tavilyWebScore: number,
): { recognition: number; category: number; corec: number; web: number } {
  let recognition = TIER_RECOGNITION[result.tier]
  if (result.useCaseRecommended) recognition = Math.min(35, recognition + 5)

  const category = rankToCategory(result.rank)
  const corec = Math.min(20, result.coRecommendations.length * 2.5)
  const web = Math.min(10, tavilyWebScore)

  return { recognition, category, corec, web }
}

// ── 합성 DimensionContext (PassIndicator / EngineGrades용) ───

/**
 * D-answer 티어를 gemini/perplexity recognized+recommended 신호로 변환.
 * 기존 assembleUnifiedScore가 이 컨텍스트를 읽어 PassIndicator / EngineGrades 생성.
 *
 * 매핑:
 *   T1 → gemini: rec+rec, perplexity: rec+rec  (perfect 가능)
 *   T2 → gemini: recognized, perplexity: recognized
 *   T3 → gemini: recognized, perplexity: not
 *   T4 → gemini: not, perplexity: not
 */
export function buildSyntheticContextFromDAsn(
  result: DAnswerResult,
  productName: string,
  productUrl: string | undefined,
  probeLogs: Array<{ co_recommendations: string[] | null; created_at?: string }>,
  tavilySources: Array<{ url: string; tier: number; isOwn: boolean }>,
  categoryRankings: Array<{ engine: string; rank: number | null; query: string }>,
): DimensionContext {
  const t = result.tier
  const syntheticText =
    `[D7] tier=${t} rank=${result.rank ?? 'N/A'} category=${result.category} ` +
    `useCaseRec=${result.useCaseRecommended}`

  return {
    productName,
    productUrl,
    geminiResponse: {
      recognized: t === 'T1' || t === 'T2' || t === 'T3',
      recommended: t === 'T1',
      text: syntheticText,
    },
    perplexityResponse: {
      recognized: t === 'T1' || t === 'T2',
      recommended: t === 'T1',
      text: syntheticText,
      citations: [],
    },
    categoryRankings,
    probeLogs,
    tavilySources,
  }
}
