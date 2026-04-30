// ─────────────────────────────────────────────────────────────
// prescription/types.ts — 처방 엔진 타입 정의
// 빅파이 1.6 §3-2 매트릭스 + Claude-Ads 차용 (severity, quickWin)
// ─────────────────────────────────────────────────────────────

import type { DimensionId } from '../unifiedScore'

export type PrescriptionLevel = 'invisible' | 'emerging' | 'growing' | 'strong' | 'perfect'

export type Severity = 'critical' | 'high' | 'medium' | 'low'

export interface Diagnosis {
  dimension: DimensionId
  label: string
  score: number
  max: number
  level: PrescriptionLevel
  summary: string
  detail: string
}

// ActionRule = 룰셋이 선언하는 형태 (quickWin은 자동 계산되므로 제외)
export interface ActionRule {
  id: string
  dimension: DimensionId
  title: string
  description: string
  difficulty: 1 | 2 | 3
  estimatedImpact: number
  timeToComplete: string
  externalUrl?: string
  priority: number
  severity: Severity
}

// Action = ActionRule + 자동 계산된 quickWin 플래그
export interface Action extends ActionRule {
  quickWin: boolean
}

export interface GapInfo {
  currentLevel: PrescriptionLevel
  currentScore: number
  nextLevel: PrescriptionLevel | null
  nextThreshold: number | null
  pointsNeeded: number
  dimensionGaps: Array<{
    dimension: DimensionId
    currentScore: number
    maxScore: number
    potentialGain: number
    normalizedAchievement: number
  }>
}

export interface BenchmarkInfo {
  category: string | null
  yourRank: number | null
  leaders: string[]
}

export interface PrescriptionResult {
  overall: {
    level: PrescriptionLevel
    summary: string
    gap: GapInfo
  }
  diagnoses: Diagnosis[]
  prescriptions: Action[]
  allActions: Action[]
  benchmark: BenchmarkInfo
  generatedAt: string
}
