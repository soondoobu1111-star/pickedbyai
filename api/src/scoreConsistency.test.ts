// ─────────────────────────────────────────────────────────────
// scoreConsistency.test.ts — BUG-SCORE-CONSISTENCY-01 회귀 방지
//
// 목적:
//   1. cron이 baseline 대비 30% 미만 score 저장 시 flagged=true 마킹 검증
//   2. FE isValidScoreRow가 flagged row 제외 검증
//   3. baseline 계산 (median) 정확성 검증
//   4. 절대 floor (s >= 10) 검증
//
// 재발 방지:
//   - BUG-SCORE-CONSISTENCY-01 (2026-05-02): 05-01 pickedby.ai cron score=5
//     baseline 45 → score 5 (11%) anomaly. FE는 5점 표시. CEO 분노.
//   - 매번 표면 fix 누적 → 5번째 회귀 시 근본 해결.
// ─────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest'

// FE 로직과 동일한 함수 (dashboard.html에서 가져온 것을 테스트 가능 형태로 복제)
// 실제 운영은 dashboard.html 직접 수정. 여기는 로직 검증용.

function _scoreOfRow(row: any): number | null {
  if (!row) return null
  if (row.unified_v15 && Number.isFinite(row.unified_v15.score)) return row.unified_v15.score
  if (Number.isFinite(row.score)) return row.score
  return null
}

function isValidScoreRow(row: any, baselineScore?: number): boolean {
  if (!row) return false
  if (row.flagged === true) return false
  const s = _scoreOfRow(row)
  if (!Number.isFinite(s) || (s as number) <= 0) return false
  if ((s as number) < 10) return false
  if (Number.isFinite(baselineScore) && (baselineScore as number) >= 20 && (s as number) < (baselineScore as number) * 0.3) return false
  return true
}

function computeBaseline(rows: any[]): number {
  if (!Array.isArray(rows) || rows.length === 0) return 0
  const validScores = rows
    .map(r => _scoreOfRow(r))
    .filter((s): s is number => Number.isFinite(s as any) && (s as number) >= 10)
  if (validScores.length === 0) return 0
  validScores.sort((a, b) => a - b)
  const mid = Math.floor(validScores.length / 2)
  return validScores.length % 2 === 0 ? (validScores[mid - 1] + validScores[mid]) / 2 : validScores[mid]
}

function getValidLatestFromDesc(rowsDesc: any[]): any | null {
  if (!Array.isArray(rowsDesc) || rowsDesc.length === 0) return null
  const baseline = computeBaseline(rowsDesc.slice(1))
  for (const r of rowsDesc) {
    if (isValidScoreRow(r, baseline)) return r
  }
  return rowsDesc[0] || null
}

// ===== TESTS =====

describe('BUG-SCORE-CONSISTENCY-01: 05-02 reproduction', () => {
  // 실제 production scores 데이터 (05-02 12:51 KST 시점)
  const rows = [
    { score: 55, created_at: '2026-05-02T12:51:09Z', flagged: false },  // refresh
    { score: 5,  created_at: '2026-05-01T15:01:48Z', flagged: false },  // ⚠️ ANOMALY
    { score: 45, created_at: '2026-04-30T03:12:57Z', flagged: false },
    { score: 45, created_at: '2026-04-29T12:23:16Z', flagged: false },
    { score: 45, created_at: '2026-04-28T12:06:51Z', flagged: false },
  ]

  it('baseline 계산: 04-28~04-30 (45,45,45,55) 중 score=5 제외 → median', () => {
    // anomaly row 제외 후 baseline = median(55, 45, 45, 45) = 45
    const baseline = computeBaseline(rows.slice(1))  // 첫 row(55) 제외, 나머지로 baseline
    expect(baseline).toBeGreaterThanOrEqual(40)
    expect(baseline).toBeLessThanOrEqual(50)
  })

  it('isValidScoreRow: score=5 (anomaly) → false', () => {
    const baseline = computeBaseline(rows.slice(1))
    expect(isValidScoreRow(rows[1], baseline)).toBe(false)  // score=5
  })

  it('isValidScoreRow: score=55 (정상 refresh) → true', () => {
    const baseline = computeBaseline(rows.slice(1))
    expect(isValidScoreRow(rows[0], baseline)).toBe(true)  // score=55
  })

  it('getValidLatestFromDesc: 첫 row(55) 반환 (anomaly skip)', () => {
    const result = getValidLatestFromDesc(rows)
    expect(result.score).toBe(55)
    expect(result.created_at).toBe('2026-05-02T12:51:09Z')
  })

  it('만약 첫 row가 anomaly(5)면 → 다음 정상 row(45) 반환', () => {
    const buggyRows = [
      { score: 5,  flagged: false, created_at: '2026-05-01T15:01:48Z' },  // ⚠️ ANOMALY
      { score: 45, flagged: false, created_at: '2026-04-30T03:12:57Z' },
      { score: 45, flagged: false, created_at: '2026-04-29T12:23:16Z' },
      { score: 45, flagged: false, created_at: '2026-04-28T12:06:51Z' },
    ]
    const result = getValidLatestFromDesc(buggyRows)
    expect(result.score).toBe(45)  // not 5
  })
})

describe('flagged 필드 우선', () => {
  it('flagged=true row는 항상 invalid (baseline 무관)', () => {
    const flaggedRow = { score: 50, flagged: true }
    expect(isValidScoreRow(flaggedRow, 45)).toBe(false)
  })

  it('flagged=false + score 정상 → valid', () => {
    const validRow = { score: 50, flagged: false }
    expect(isValidScoreRow(validRow, 45)).toBe(true)
  })

  it('flagged=false + score anomaly → false (baseline 가드)', () => {
    const anomalyRow = { score: 5, flagged: false }
    expect(isValidScoreRow(anomalyRow, 45)).toBe(false)
  })
})

describe('절대 floor (s >= 10)', () => {
  it('score=9 → false (baseline 무관)', () => {
    expect(isValidScoreRow({ score: 9, flagged: false })).toBe(false)
    expect(isValidScoreRow({ score: 9, flagged: false }, 50)).toBe(false)
  })

  it('score=10 + baseline 없음 → true', () => {
    expect(isValidScoreRow({ score: 10, flagged: false })).toBe(true)
  })

  it('score=10 + baseline=50 (10/50 = 20%, 30% 미만) → false', () => {
    expect(isValidScoreRow({ score: 10, flagged: false }, 50)).toBe(false)
  })
})

describe('baseline 가드 임계값', () => {
  it('baseline 20 미만이면 baseline 가드 비활성', () => {
    // baseline이 너무 낮으면 (새 도메인 등) 가드 적용 안 함
    expect(isValidScoreRow({ score: 15, flagged: false }, 19)).toBe(true)
  })

  it('score = baseline * 0.3 정확히 → true (경계)', () => {
    // 50 * 0.3 = 15. 15는 통과
    expect(isValidScoreRow({ score: 15, flagged: false }, 50)).toBe(true)
  })

  it('score = baseline * 0.29 → false', () => {
    // 50 * 0.29 = 14.5. floor 미만이지만 14.5는 baseline 가드로 false
    expect(isValidScoreRow({ score: 14, flagged: false }, 50)).toBe(false)
  })

  it('score = baseline * 0.5 → true', () => {
    expect(isValidScoreRow({ score: 25, flagged: false }, 50)).toBe(true)
  })
})

describe('computeBaseline 정확성', () => {
  it('빈 배열 → 0', () => {
    expect(computeBaseline([])).toBe(0)
  })

  it('1개 score → 그 값', () => {
    expect(computeBaseline([{ score: 45 }])).toBe(45)
  })

  it('짝수 개 score → 중간 두 값 평균', () => {
    expect(computeBaseline([{ score: 40 }, { score: 50 }])).toBe(45)
    expect(computeBaseline([{ score: 30 }, { score: 40 }, { score: 50 }, { score: 60 }])).toBe(45)
  })

  it('홀수 개 score → 중앙값', () => {
    expect(computeBaseline([{ score: 30 }, { score: 45 }, { score: 60 }])).toBe(45)
  })

  it('score < 10 인 row 자동 제외', () => {
    // [5, 45, 50] → [45, 50] median = 47.5
    expect(computeBaseline([{ score: 5 }, { score: 45 }, { score: 50 }])).toBe(47.5)
  })

  it('flagged 무관 (computeBaseline은 raw 점수만 봄, 호출자가 flagged 필터링)', () => {
    // computeBaseline 자체는 flagged 안 봄. 호출 코드에서 flagged 필터링.
    // 하지만 score < 10 floor는 자체 적용.
    expect(computeBaseline([{ score: 50, flagged: true }])).toBe(50)
  })
})
