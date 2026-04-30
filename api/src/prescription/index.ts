// ─────────────────────────────────────────────────────────────
// prescription/index.ts — 처방 엔진 오케스트레이터
//
// 빅파이 1.6 §3 처방 엔진. 규칙 기반, LLM 미사용, 비용 $0.
// Claude-Ads 차용 (D2.5 PRESCRIPTION-MODULAR-01, 2026-04-30):
//   - 모듈 분리 (단일 722줄 → 11 파일)
//   - severity multiplier (5x/3x/1.5x/0.5x) 도입
//   - quickWin 자동 라벨 (difficulty=1 + ≤30min)
// ─────────────────────────────────────────────────────────────

import type { UnifiedScoreResult, DimensionId } from '../unifiedScore'
import type { ActionRule, Action, PrescriptionLevel, PrescriptionResult } from './types'
import { classifyLevel, classifyDimensionLevel, LEVEL_SUMMARIES } from './classification'
import { buildDiagnosis } from './diagnosis'
import { computeGap } from './gap'
import { extractBenchmark } from './benchmark'
import { selectTop3, attachQuickWin } from './selection'
import { RECOGNITION_RULES } from './rules/recognition'
import { CATEGORY_RULES } from './rules/category'
import { COREC_RULES } from './rules/corec'
import { WEB_RULES } from './rules/web'

// re-export 공개 타입/유틸
export type {
  PrescriptionResult,
  PrescriptionLevel,
  Severity,
  Diagnosis,
  Action,
  ActionRule,
  GapInfo,
  BenchmarkInfo,
} from './types'
export { classifyLevel, classifyDimensionLevel, LEVEL_THRESHOLDS, LEVEL_SUMMARIES } from './classification'
export { SEVERITY_MULTIPLIER, isQuickWin, attachQuickWin, computePriorityScore, selectTop3 } from './selection'
export { buildDiagnosis } from './diagnosis'
export { computeGap } from './gap'
export { extractBenchmark } from './benchmark'

const PRESCRIPTION_RULES: Record<DimensionId, Record<PrescriptionLevel, ActionRule[]>> = {
  recognition: RECOGNITION_RULES,
  category: CATEGORY_RULES,
  corec: COREC_RULES,
  web: WEB_RULES,
}

/**
 * unified_v15 JSONB 결과를 받아 진단 + 처방 + 벤치마크를 생성한다.
 * 규칙 기반, LLM 미사용, 비용 $0.
 */
export function generatePrescription(unified: UnifiedScoreResult): PrescriptionResult {
  const overallLevel = classifyLevel(unified.score)

  // 4차원별 진단
  const diagnoses = unified.dimensions.map(dim =>
    buildDiagnosis(dim, unified.engine_grades ?? []),
  )

  // 차원별 현재 레벨 처방 후보 수집 + Quick Win 라벨 attach
  const allActions: Action[] = unified.dimensions.flatMap(dim => {
    const dimLevel = classifyDimensionLevel(dim.score, dim.max)
    const rules = PRESCRIPTION_RULES[dim.id]?.[dimLevel] ?? []
    return rules.map(attachQuickWin)
  })

  // priorityScore = severity × impact × (0.5 + dimUrgency)
  const prescriptions = selectTop3(allActions, unified.dimensions)

  const gap = computeGap(unified)
  const benchmark = extractBenchmark(unified)

  return {
    overall: {
      level: overallLevel,
      summary: LEVEL_SUMMARIES[overallLevel],
      gap,
    },
    diagnoses,
    prescriptions,
    allActions,
    benchmark,
    generatedAt: new Date().toISOString(),
  }
}
