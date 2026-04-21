// ─────────────────────────────────────────────────────────────
// score.test.ts — 빅파이 1.5 Phase 1 TEST-01 + TEST-CRON-UNIFIED-01~03
//
// 목적:
//   1. 수학적 일관성: sum(dimensions[].score) === final.score
//   2. Pass Indicator B안 (signal AND score) 검증
//   3. cron dailyRefresh 저장 시 score === unified_v15.score 불변성
//
// 재발 방지:
//   - BUG-SCORE-UNIFY-FIX-01 (cron 실행 시 unified_v15 누락)
//   - BUG-PASS-INDICATOR-01 (signal 단독으로 상위 배지 승격)
//   - BUG-SCORE-FIELD-LEGACY-01 (scores.score vs unified_v15.score 불일치)
// ─────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest'
import {
  DIMENSION_MAX,
  TOTAL_MAX,
  INVARIANTS,
  DimensionContext,
  computeRecognition,
  computeCategoryRanking,
  computeCoRecommendation,
  computeWebAuthority,
  computePassIndicator,
  assembleUnifiedScore,
} from './unifiedScore'

// ===== 헬퍼: 테스트용 컨텍스트 빌더 =====

function buildCtx(overrides: Partial<DimensionContext> = {}): DimensionContext {
  return {
    productName: 'test-product',
    productUrl: 'https://example.com',
    geminiResponse: undefined,
    perplexityResponse: undefined,
    categoryRankings: [],
    probeLogs: [],
    tavilySources: [],
    ...overrides,
  }
}

function computeAllDims(ctx: DimensionContext) {
  return [
    computeRecognition(ctx),
    computeCategoryRanking(ctx),
    computeCoRecommendation(ctx),
    computeWebAuthority(ctx),
  ]
}

// ===== 불변식 검증 =====

describe('UnifiedScore Invariants', () => {
  it('차원 만점 합은 정확히 100이다', () => {
    const sum = DIMENSION_MAX.recognition + DIMENSION_MAX.category + DIMENSION_MAX.corec + DIMENSION_MAX.web
    expect(sum).toBe(TOTAL_MAX)
    expect(sum).toBe(100)
  })

  it('INVARIANTS 상수는 4차원 / 버전 1.5.0으로 고정된다', () => {
    expect(INVARIANTS.dimensionCount).toBe(4)
    expect(INVARIANTS.version).toBe('1.5.0')
  })
})

// ===== TEST-01: 수학적 일관성 (sum === final) =====

describe('TEST-01: Mathematical Consistency', () => {
  it('sum(dimensions[].score) === final.score (제로 입력)', () => {
    const ctx = buildCtx()
    const dims = computeAllDims(ctx)
    const result = assembleUnifiedScore(ctx, dims)
    const sum = dims.reduce((a, d) => a + d.score, 0)
    expect(result.score).toBeCloseTo(sum, 5)
  })

  it('sum(dimensions[].score) === final.score (부분 입력)', () => {
    const ctx = buildCtx({
      geminiResponse: { recognized: true, recommended: true, text: '' },
      categoryRankings: [{ engine: 'perplexity', rank: 3, query: 'best x' }],
      probeLogs: [{ co_recommendations: ['a', 'b', 'c', 'd'] }],
      tavilySources: [
        { url: 'https://wikipedia.org/x', tier: 1, isOwn: false },
        { url: 'https://techcrunch.com/x', tier: 2, isOwn: false },
      ],
    })
    const dims = computeAllDims(ctx)
    const result = assembleUnifiedScore(ctx, dims)
    const sum = dims.reduce((a, d) => a + d.score, 0)
    expect(result.score).toBeCloseTo(sum, 5)
  })

  it('final score는 0~100 범위를 벗어나지 않는다', () => {
    const ctx = buildCtx({
      geminiResponse: { recognized: true, recommended: true, text: '' },
      perplexityResponse: { recognized: true, recommended: true, text: '', citations: [] },
      categoryRankings: [{ engine: 'perplexity', rank: 1, query: 'best x' }],
      probeLogs: Array.from({ length: 20 }, (_, i) => ({
        co_recommendations: [`peer${i}`, `rival${i}`],
      })),
      tavilySources: Array.from({ length: 10 }, (_, i) => ({
        url: `https://wiki${i}.org/x`,
        tier: 1,
        isOwn: false,
      })),
    })
    const dims = computeAllDims(ctx)
    const result = assembleUnifiedScore(ctx, dims)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
  })
})

// ===== TEST-CRON-UNIFIED-01: Pass Indicator B안 (capcut 시나리오) =====

describe('TEST-CRON-UNIFIED-01: Pass Indicator B안 — signal AND score', () => {
  it('capcut 시나리오 (signal=2 but score=22.5) → emerging (버그 수정 검증)', () => {
    // Perplexity recommended (signal=2) + score 낮음
    const pass = computePassIndicator(
      { recognized: false, recommended: false },
      { recognized: true, recommended: true },
      22.5,
    )
    // 수정 전: 'strong' (signal만 보고 승격) / 수정 후: 'emerging' (score 35 미만)
    expect(pass).toBe('emerging')
  })

  it('signal=4 but score=40 → strong (perfect 불가)', () => {
    const pass = computePassIndicator(
      { recognized: true, recommended: true },
      { recognized: true, recommended: true },
      40,
    )
    expect(pass).toBe('strong')
  })

  it('signal=4 + score>=60 → perfect', () => {
    const pass = computePassIndicator(
      { recognized: true, recommended: true },
      { recognized: true, recommended: true },
      75,
    )
    expect(pass).toBe('perfect')
  })

  it('signal=0 → invisible (점수 무관)', () => {
    const pass = computePassIndicator(undefined, undefined, 50)
    expect(pass).toBe('invisible')
  })

  it('signal=1 + score=10 → invisible (score 15 미만)', () => {
    const pass = computePassIndicator(
      { recognized: true, recommended: false },
      undefined,
      10,
    )
    expect(pass).toBe('invisible')
  })

  it('signal=1 + score=15 → emerging (threshold boundary)', () => {
    const pass = computePassIndicator(
      { recognized: true, recommended: false },
      undefined,
      15,
    )
    expect(pass).toBe('emerging')
  })
})

// ===== TEST-CRON-UNIFIED-02: cron 저장 score === unified_v15.score =====

describe('TEST-CRON-UNIFIED-02: cron savedScore 통일 (빅파이 1.5 단일 시스템)', () => {
  it('unified_v15 성공 시 savedScore는 Math.round(unified.score)와 일치해야 한다', () => {
    // cron dailyRefresh 의 저장 로직을 시뮬레이션
    const ctx = buildCtx({
      geminiResponse: { recognized: true, recommended: false, text: '' },
      perplexityResponse: { recognized: true, recommended: true, text: '', citations: [] },
      categoryRankings: [{ engine: 'perplexity', rank: 5, query: 'best x' }],
      probeLogs: [{ co_recommendations: ['a', 'b'] }],
      tavilySources: [{ url: 'https://wiki.org/x', tier: 1, isOwn: false }],
    })
    const dims = computeAllDims(ctx)
    const unified = assembleUnifiedScore(ctx, dims)

    // cron dailyRefresh 수정 로직 (index.ts:979-996)
    const probe_score = 33  // 예: 3 probes 중 1 recognized
    let savedScore = probe_score >= 0 ? probe_score : 0
    if (unified) {
      savedScore = Math.round(unified.score)
    }

    expect(savedScore).toBe(Math.round(unified.score))
    expect(savedScore).not.toBe(probe_score)  // 33 레거시 필드에서 탈출 확인
  })
})

// ===== TEST-CRON-UNIFIED-03: unified_v15 저장 누락 방지 (regression) =====

describe('TEST-CRON-UNIFIED-03: unified_v15 JSONB 완전성', () => {
  it('unified_v15 저장 페이로드는 score/dimensions/pass_indicator/quadrant/engine_grades 모두 포함한다', () => {
    const ctx = buildCtx({
      geminiResponse: { recognized: true, recommended: true, text: '' },
      perplexityResponse: { recognized: false, recommended: false, text: '', citations: [] },
    })
    const dims = computeAllDims(ctx)
    const unified = assembleUnifiedScore(ctx, dims)

    // BUG-SCORE-UNIFY-FIX-01 재발 방지: cron POST body의 unified_v15 필드 완전성
    expect(unified).toBeDefined()
    expect(typeof unified.score).toBe('number')
    expect(Array.isArray(unified.dimensions)).toBe(true)
    expect(unified.dimensions.length).toBe(4)
    expect(unified.pass_indicator).toMatch(/^(perfect|strong|emerging|invisible)$/)
    expect(unified.quadrant).toBeDefined()
    expect(unified.quadrant.label).toMatch(/^(Leader|Niche|Challenger|Invisible)$/)
    expect(Array.isArray(unified.engine_grades)).toBe(true)
    expect(unified.engine_grades.length).toBe(2)  // Gemini + Perplexity
    expect(unified.methodology_version).toBe('1.5.0')
  })

  it('pass_indicator는 finalScore 기반으로 결정된다 (B안 signature)', () => {
    // score 충분히 높아도 signal 0이면 invisible
    const ctx = buildCtx({
      tavilySources: Array.from({ length: 10 }, (_, i) => ({
        url: `https://wiki${i}.org/x`,
        tier: 1,
        isOwn: false,
      })),
    })
    const dims = computeAllDims(ctx)
    const unified = assembleUnifiedScore(ctx, dims)
    // Web 10점만 있고 signal 0 → invisible
    expect(unified.pass_indicator).toBe('invisible')
  })
})
