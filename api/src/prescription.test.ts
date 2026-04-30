// ─────────────────────────────────────────────────────────────
// prescription.test.ts — D2.5 PRESCRIPTION-MODULAR-01 검증
// 차용: severity / SEVERITY_MULTIPLIER / Quick Win / priorityScore
// ─────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest'
import {
  SEVERITY_MULTIPLIER,
  isQuickWin,
  attachQuickWin,
  computePriorityScore,
  selectTop3,
  classifyLevel,
  classifyDimensionLevel,
  generatePrescription,
} from './prescription'
import { RECOGNITION_RULES } from './prescription/rules/recognition'
import { CATEGORY_RULES } from './prescription/rules/category'
import { COREC_RULES } from './prescription/rules/corec'
import { WEB_RULES } from './prescription/rules/web'
import type { ActionRule } from './prescription/types'

const ALL_RULES: ActionRule[] = [
  ...Object.values(RECOGNITION_RULES).flat(),
  ...Object.values(CATEGORY_RULES).flat(),
  ...Object.values(COREC_RULES).flat(),
  ...Object.values(WEB_RULES).flat(),
]

describe('Severity multiplier (Claude-Ads 차용)', () => {
  it('SEVERITY_MULTIPLIER 4단 값 정확', () => {
    expect(SEVERITY_MULTIPLIER.critical).toBe(5.0)
    expect(SEVERITY_MULTIPLIER.high).toBe(3.0)
    expect(SEVERITY_MULTIPLIER.medium).toBe(1.5)
    expect(SEVERITY_MULTIPLIER.low).toBe(0.5)
  })

  it('모든 35 actions에 severity 4단 중 하나 명시', () => {
    expect(ALL_RULES.length).toBe(35)
    for (const r of ALL_RULES) {
      expect(['critical', 'high', 'medium', 'low']).toContain(r.severity)
    }
  })

  it('perfect 레벨 처방은 모두 low severity', () => {
    const perfectRules = [
      ...RECOGNITION_RULES.perfect,
      ...CATEGORY_RULES.perfect,
      ...COREC_RULES.perfect,
      ...WEB_RULES.perfect,
    ]
    for (const r of perfectRules) {
      expect(r.severity).toBe('low')
    }
  })
})

describe('Quick Win 자동 라벨', () => {
  it('difficulty=1 + 30min → quickWin=true', () => {
    const r = ALL_RULES.find(a => a.id === 'rx-rec-inv-02')!  // llms.txt
    expect(r.timeToComplete).toBe('30 min')
    expect(r.difficulty).toBe(1)
    expect(isQuickWin(r)).toBe(true)
  })

  it('difficulty=2 → quickWin=false (시간 무관)', () => {
    const r = ALL_RULES.find(a => a.id === 'rx-rec-inv-01')!  // PH 런치
    expect(r.difficulty).toBe(2)
    expect(isQuickWin(r)).toBe(false)
  })

  it('difficulty=1 + 1 hour → quickWin=false (시간 초과)', () => {
    const r = ALL_RULES.find(a => a.id === 'rx-cor-inv-03')!  // Reddit alt threads
    expect(r.timeToComplete).toBe('1 hour')
    expect(r.difficulty).toBe(1)
    expect(isQuickWin(r)).toBe(false)
  })

  it('attachQuickWin은 rule을 Action으로 변환 + quickWin 자동 부착', () => {
    const r = ALL_RULES.find(a => a.id === 'rx-cor-inv-01')!  // AlternativeTo
    const action = attachQuickWin(r)
    expect(action.quickWin).toBe(true)
    expect(action.id).toBe(r.id)
    expect(action.severity).toBe(r.severity)
  })

  it('Quick Win 카운트 = 7개 (invisible 3 + perfect 4)', () => {
    const quickWins = ALL_RULES.filter(isQuickWin)
    expect(quickWins.length).toBe(7)
  })
})

describe('priorityScore 정렬 (severity × impact × urgency)', () => {
  it('동일 impact·urgency에서 high(3x) > medium(1.5x)', () => {
    const a = { id: 'a', dimension: 'recognition', title: '', description: '', difficulty: 1 as const, estimatedImpact: 5, timeToComplete: '', priority: 1, severity: 'high' as const }
    const b = { ...a, id: 'b', severity: 'medium' as const }
    expect(computePriorityScore(a, 0)).toBeGreaterThan(computePriorityScore(b, 0))
  })

  it('dimUrgency가 높을수록 점수 상승 (달성률 0 vs 1)', () => {
    const a = { id: 'a', dimension: 'recognition', title: '', description: '', difficulty: 1 as const, estimatedImpact: 5, timeToComplete: '', priority: 1, severity: 'high' as const }
    expect(computePriorityScore(a, 0)).toBeGreaterThan(computePriorityScore(a, 1))
  })
})

describe('selectTop3 + generatePrescription E2E', () => {
  it('invisible 점수 시나리오 → Top 3 반환', () => {
    const unified = {
      score: 27.5,
      dimensions: [
        { id: 'recognition' as const, label: 'Recognition', score: 12, max: 35, breakdown: {} },
        { id: 'category' as const, label: 'Category', score: 10, max: 35, breakdown: { rankings: [] } },
        { id: 'corec' as const, label: 'Co-Rec', score: 4, max: 20, breakdown: { unique_count: 0, top_5: [] } },
        { id: 'web' as const, label: 'Web', score: 1, max: 10, breakdown: { tier1_count: 0, tier2_count: 0 } },
      ],
      engine_grades: [],
      pass_indicator: 'invisible' as const,
    } as any

    const result = generatePrescription(unified)
    expect(result.prescriptions.length).toBe(3)
    expect(result.diagnoses.length).toBe(4)
    expect(result.allActions.length).toBeGreaterThan(0)
    // 모든 처방에 quickWin 필드 존재
    for (const p of result.prescriptions) {
      expect(typeof p.quickWin).toBe('boolean')
      expect(['critical', 'high', 'medium', 'low']).toContain(p.severity)
    }
    // overall.level invisible 매칭
    expect(result.overall.level).toBe(classifyLevel(27.5))
  })
})

describe('classification 보존', () => {
  it('classifyLevel 5단 임계값 정확', () => {
    expect(classifyLevel(0)).toBe('invisible')
    expect(classifyLevel(20)).toBe('invisible')
    expect(classifyLevel(21)).toBe('emerging')
    expect(classifyLevel(40)).toBe('emerging')
    expect(classifyLevel(41)).toBe('growing')
    expect(classifyLevel(60)).toBe('growing')
    expect(classifyLevel(61)).toBe('strong')
    expect(classifyLevel(80)).toBe('strong')
    expect(classifyLevel(81)).toBe('perfect')
    expect(classifyLevel(100)).toBe('perfect')
  })

  it('classifyDimensionLevel — score/max 비율 기준', () => {
    expect(classifyDimensionLevel(0, 35)).toBe('invisible')
    expect(classifyDimensionLevel(35, 35)).toBe('perfect')
    expect(classifyDimensionLevel(15, 20)).toBe('strong')  // 75%
  })
})
