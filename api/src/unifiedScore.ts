// ─────────────────────────────────────────────────────────────
// UnifiedScore — 빅파이 1.5 4차원 단일 스코어 시스템
//
// 목표: 기존 이원(Tavily 5차원 + Probe 병렬) 시스템을 4차원 단일 체계로 교체.
// 수학적 보장: sum(dimensions[].score) === final.score (0-100)
//
// 4차원:
//   1. Direct Recognition (35) — Gemini + Perplexity "Know & Recommend"
//   2. Category Ranking (35) — `best {category}` Top-10 등장 + 순위
//   3. Co-Recommendation Graph (20) — probe_logs 누적 파싱
//   4. Web Authority Proxy (10) — Tavily Tier-1/2 citation
//
// 근거: pickedbyAI/docs/bigpie-v1.5.md §4
// 작성: 2026-04-17 (Phase 1 Step 1)
// ─────────────────────────────────────────────────────────────

// ===== 타입 정의 =====

export type DimensionId = 'recognition' | 'category' | 'corec' | 'web'

export interface DimensionScore {
  id: DimensionId
  label: string
  score: number
  max: number
  breakdown: Record<string, unknown>
}

export type PassIndicator = 'perfect' | 'strong' | 'emerging' | 'invisible'
export type QuadrantLabel = 'Leader' | 'Niche' | 'Challenger' | 'Invisible'
export type EngineGrade = 'A' | 'B' | 'C' | 'D' | 'F'

export interface QuadrantPosition {
  x: number  // Recognition rate (0-1)
  y: number  // Category position (0-1)
  label: QuadrantLabel
}

export interface EngineGradeInfo {
  engine: 'gemini' | 'perplexity'
  grade: EngineGrade
  description: string
  recognized: boolean
  recommended: boolean
}

export interface UnifiedScoreResult {
  score: number
  max_score: 100
  dimensions: DimensionScore[]
  pass_indicator: PassIndicator
  quadrant: QuadrantPosition
  engine_grades: EngineGradeInfo[]
  product: string
  product_url: string | null
  timestamp: string
  methodology_version: '1.5.0'
  // 디버그·인사이트용 보조 필드
  insights: {
    daily_pulse: string          // Daily Pulse 카드용 한 줄 스토리
    top_issue: string | null     // 가장 큰 개선 기회
  }
}

// ===== 차원별 만점 상수 (v1.5 §4) =====

export const DIMENSION_MAX = {
  recognition: 35,
  category: 35,
  corec: 20,
  web: 10,
} as const

export const TOTAL_MAX = 100 as const // DIMENSION_MAX 전체 합

// ===== 차원별 계산 함수 (Step 3에서 실제 로직 구현) =====

export interface DimensionContext {
  productName: string
  productUrl?: string
  // 차원별 계산에 필요한 외부 조회 결과는 호출 전에 미리 수집
  geminiResponse?: { recognized: boolean; recommended: boolean; text: string }
  perplexityResponse?: { recognized: boolean; recommended: boolean; text: string; citations: string[] }
  categoryRankings?: Array<{ engine: string; rank: number | null; query: string }>
  probeLogs?: Array<{ co_recommendations: string[] | null; created_at?: string }>
  tavilySources?: Array<{ url: string; tier: number; isOwn: boolean }>
}

export function computeRecognition(ctx: DimensionContext): DimensionScore {
  // Direct Recognition (35점) = Gemini 17.5 + Perplexity 17.5
  //   각 엔진: Known(5) + Recommended(+12.5) 이분법
  //   정확히는 Known = 5, Recommended = Known + 12.5 = 17.5
  //   추후 Step 3에서 실측 튜닝
  let score = 0
  const breakdown: Record<string, unknown> = {}

  const engines = [
    { id: 'gemini' as const, resp: ctx.geminiResponse },
    { id: 'perplexity' as const, resp: ctx.perplexityResponse },
  ]
  const perEngineMax = DIMENSION_MAX.recognition / engines.length  // 17.5

  for (const { id, resp } of engines) {
    if (!resp) {
      breakdown[id] = { status: 'not_measured', points: 0 }
      continue
    }
    let pts = 0
    let status = 'unknown'
    if (resp.recognized) {
      pts = perEngineMax * (5 / 17.5)  // 5 out of 17.5 = "known"
      status = 'known'
    }
    if (resp.recommended) {
      pts = perEngineMax  // 17.5 full
      status = 'recommended'
    }
    score += pts
    breakdown[id] = { status, points: Math.round(pts * 10) / 10 }
  }

  return {
    id: 'recognition',
    label: 'Direct Recognition',
    score: Math.round(score * 10) / 10,
    max: DIMENSION_MAX.recognition,
    breakdown,
  }
}

export function computeCategoryRanking(ctx: DimensionContext): DimensionScore {
  // Category Ranking (35점) = "best {cat}" 쿼리에서 Top-10 등장 + 순위
  //   rank 1 = 35, rank 2-3 = 25, rank 4-10 = 15, 11-20 = 8, 미등장 = 0
  //   여러 쿼리 결과 평균
  if (!ctx.categoryRankings || ctx.categoryRankings.length === 0) {
    return {
      id: 'category',
      label: 'Category Ranking',
      score: 0,
      max: DIMENSION_MAX.category,
      breakdown: { status: 'not_measured', rankings: [] },
    }
  }

  const rankScores = ctx.categoryRankings.map(r => {
    if (r.rank == null) return 0
    if (r.rank === 1) return DIMENSION_MAX.category
    if (r.rank <= 3) return DIMENSION_MAX.category * (25 / 35)
    if (r.rank <= 10) return DIMENSION_MAX.category * (15 / 35)
    if (r.rank <= 20) return DIMENSION_MAX.category * (8 / 35)
    return 0
  })
  const avg = rankScores.reduce((a, b) => a + b, 0) / rankScores.length

  return {
    id: 'category',
    label: 'Category Ranking',
    score: Math.round(avg * 10) / 10,
    max: DIMENSION_MAX.category,
    breakdown: {
      rankings: ctx.categoryRankings,
      avg_score: avg,
    },
  }
}

export function computeCoRecommendation(ctx: DimensionContext): DimensionScore {
  // Co-Recommendation Graph (20점)
  //   유니크 co_recommendation 수 × 가중치
  //   0개 = 0, 1-3개 = 5, 4-7개 = 12, 8+ = 20
  //   신규 제품(데이터 없음) 페널티: 가중치 동적 조정 (Step 3에서 구현)
  if (!ctx.probeLogs || ctx.probeLogs.length === 0) {
    return {
      id: 'corec',
      label: 'Co-Recommendation Graph',
      score: 0,
      max: DIMENSION_MAX.corec,
      breakdown: { status: 'insufficient_data', unique_count: 0 },
    }
  }

  const unique = new Set<string>()
  for (const log of ctx.probeLogs) {
    for (const name of log.co_recommendations || []) {
      unique.add(name.trim().toLowerCase())
    }
  }
  const count = unique.size
  let score = 0
  if (count >= 8) score = DIMENSION_MAX.corec
  else if (count >= 4) score = DIMENSION_MAX.corec * (12 / 20)
  else if (count >= 1) score = DIMENSION_MAX.corec * (5 / 20)

  return {
    id: 'corec',
    label: 'Co-Recommendation Graph',
    score: Math.round(score * 10) / 10,
    max: DIMENSION_MAX.corec,
    breakdown: {
      unique_count: count,
      top_5: [...unique].slice(0, 5),
    },
  }
}

export function computeWebAuthority(ctx: DimensionContext): DimensionScore {
  // Web Authority Proxy (10점) — Tavily Tier-1/2 citation 근거
  //   Tier-1 × 2 = 10점, Tier-2 × 4 = 10점
  //   Tier-1 1개 = 5, Tier-2 1개 = 2.5
  if (!ctx.tavilySources) {
    return {
      id: 'web',
      label: 'Web Authority Proxy',
      score: 0,
      max: DIMENSION_MAX.web,
      breakdown: { status: 'not_measured' },
    }
  }

  let points = 0
  const tier1 = ctx.tavilySources.filter(s => s.tier === 1 && !s.isOwn).length
  const tier2 = ctx.tavilySources.filter(s => s.tier === 2 && !s.isOwn).length
  points += Math.min(tier1 * 5, 10)         // Tier-1 최대 10점
  points += Math.min(tier2 * 2.5, 10 - points)  // 잔여 한도 내 Tier-2
  points = Math.min(points, DIMENSION_MAX.web)

  return {
    id: 'web',
    label: 'Web Authority Proxy',
    score: Math.round(points * 10) / 10,
    max: DIMENSION_MAX.web,
    breakdown: { tier1_count: tier1, tier2_count: tier2 },
  }
}

// ===== 보조 시각화 계산 =====

export function computePassIndicator(
  gemini?: { recognized: boolean; recommended: boolean },
  perplexity?: { recognized: boolean; recommended: boolean },
): PassIndicator {
  const g = gemini?.recommended ? 2 : gemini?.recognized ? 1 : 0
  const p = perplexity?.recommended ? 2 : perplexity?.recognized ? 1 : 0
  const total = g + p
  // max total = 4 (both recommended)
  if (total >= 4) return 'perfect'
  if (total >= 2) return 'strong'
  if (total >= 1) return 'emerging'
  return 'invisible'
}

export function computeQuadrant(
  recognitionScore: number,
  categoryScore: number,
): QuadrantPosition {
  const x = recognitionScore / DIMENSION_MAX.recognition   // 0-1
  const y = categoryScore / DIMENSION_MAX.category         // 0-1
  let label: QuadrantLabel
  if (x >= 0.5 && y >= 0.5) label = 'Leader'
  else if (x < 0.5 && y >= 0.5) label = 'Niche'
  else if (x >= 0.5 && y < 0.5) label = 'Challenger'
  else label = 'Invisible'
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, label }
}

export function computeEngineGrades(ctx: DimensionContext): EngineGradeInfo[] {
  const grades: EngineGradeInfo[] = []
  const toGrade = (resp?: { recognized: boolean; recommended: boolean }): EngineGrade => {
    if (!resp) return 'F'
    if (resp.recommended) return 'A'
    if (resp.recognized) return 'C'
    return 'F'
  }
  const describe = (g: EngineGrade): string => {
    switch (g) {
      case 'A': return 'Recommends you actively'
      case 'B': return 'Knows you and mentions positively'
      case 'C': return 'Knows you but does not recommend'
      case 'D': return 'Marginal awareness'
      case 'F': return 'Unaware of your product'
    }
  }
  const entries: Array<{ engine: 'gemini' | 'perplexity'; resp?: { recognized: boolean; recommended: boolean } }> = [
    { engine: 'gemini', resp: ctx.geminiResponse },
    { engine: 'perplexity', resp: ctx.perplexityResponse },
  ]
  for (const { engine, resp } of entries) {
    const grade = toGrade(resp)
    grades.push({
      engine,
      grade,
      description: describe(grade),
      recognized: !!resp?.recognized,
      recommended: !!resp?.recommended,
    })
  }
  return grades
}

// ===== 메인 합산 함수 =====

/**
 * 4차원을 단일 점수로 합산. 수학적 일관성 보장.
 * sum(dimensions[].score) === final.score
 */
export function assembleUnifiedScore(
  ctx: DimensionContext,
  dimensions: DimensionScore[],
): UnifiedScoreResult {
  const finalScore = dimensions.reduce((sum, d) => sum + d.score, 0)

  // 수학적 일관성 검증 (개발 중 assertion)
  const maxSum = dimensions.reduce((sum, d) => sum + d.max, 0)
  if (maxSum !== TOTAL_MAX) {
    console.error(`[UnifiedScore] INVARIANT VIOLATION: sum of max = ${maxSum}, expected ${TOTAL_MAX}`)
  }
  if (finalScore > TOTAL_MAX + 0.01) {
    console.error(`[UnifiedScore] INVARIANT VIOLATION: final score ${finalScore} > ${TOTAL_MAX}`)
  }

  const pass = computePassIndicator(ctx.geminiResponse, ctx.perplexityResponse)

  const recognitionDim = dimensions.find(d => d.id === 'recognition')
  const categoryDim = dimensions.find(d => d.id === 'category')
  const quadrant = computeQuadrant(
    recognitionDim?.score ?? 0,
    categoryDim?.score ?? 0,
  )

  const engineGrades = computeEngineGrades(ctx)

  // Daily Pulse 한 줄 (상세 로직은 Step 6)
  const dailyPulse = generateDailyPulse(ctx, dimensions, finalScore)
  const topIssue = identifyTopIssue(dimensions)

  return {
    score: Math.round(finalScore * 10) / 10,
    max_score: 100,
    dimensions,
    pass_indicator: pass,
    quadrant,
    engine_grades: engineGrades,
    product: ctx.productName,
    product_url: ctx.productUrl ?? null,
    timestamp: new Date().toISOString(),
    methodology_version: '1.5.0',
    insights: {
      daily_pulse: dailyPulse,
      top_issue: topIssue,
    },
  }
}

// ===== 인사이트 생성 (Step 6에서 AI 자동 생성으로 대체) =====

function generateDailyPulse(
  ctx: DimensionContext,
  dimensions: DimensionScore[],
  finalScore: number,
): string {
  // Step 6에서 Gemini Relay 호출로 교체 예정. 지금은 규칙 기반.
  if (finalScore >= 70) return `Strong AI visibility. Score ${finalScore}/100.`
  if (finalScore >= 40) return `Making progress. Score ${finalScore}/100. Room to grow.`
  if (finalScore >= 10) return `Early days. Score ${finalScore}/100. Focus on fundamentals.`
  return `No AI visibility detected yet. Score ${finalScore}/100.`
}

function identifyTopIssue(dimensions: DimensionScore[]): string | null {
  // 가장 큰 비중 × 가장 낮은 달성률인 차원
  let worst: { dim: DimensionScore; gap: number } | null = null
  for (const dim of dimensions) {
    const achievement = dim.max > 0 ? dim.score / dim.max : 0
    const gap = dim.max * (1 - achievement)  // 잃은 점수
    if (!worst || gap > worst.gap) worst = { dim, gap }
  }
  if (!worst || worst.gap < 5) return null
  return `Lowest performing dimension: ${worst.dim.label} (${worst.dim.score}/${worst.dim.max})`
}

// ===== 수학적 일관성 검증 상수 (테스트용 export) =====

export const INVARIANTS = {
  totalMax: TOTAL_MAX,
  dimensionMaxes: DIMENSION_MAX,
  dimensionCount: 4,
  version: '1.5.0' as const,
}
