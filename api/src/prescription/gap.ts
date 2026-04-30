// ─────────────────────────────────────────────────────────────
// prescription/gap.ts — 다음 티어까지 필요 점수 시각화
// ─────────────────────────────────────────────────────────────

import type { UnifiedScoreResult, DimensionId } from '../unifiedScore'
import type { GapInfo } from './types'
import { classifyLevel, LEVEL_THRESHOLDS } from './classification'

export function computeGap(unified: UnifiedScoreResult): GapInfo {
  const currentLevel = classifyLevel(unified.score)
  const currentIdx = LEVEL_THRESHOLDS.findIndex(t => t.level === currentLevel)
  const nextIdx = currentIdx - 1

  const nextLevel = nextIdx >= 0 ? LEVEL_THRESHOLDS[nextIdx].level : null
  const nextThreshold = nextIdx >= 0 ? LEVEL_THRESHOLDS[nextIdx].min : null
  const pointsNeeded = nextThreshold !== null ? Math.max(0, nextThreshold - unified.score) : 0

  const dimensionGaps = unified.dimensions.map(dim => ({
    dimension: dim.id as DimensionId,
    currentScore: dim.score,
    maxScore: dim.max,
    potentialGain: Math.round((dim.max - dim.score) * 10) / 10,
    normalizedAchievement: dim.max > 0 ? Math.round((dim.score / dim.max) * 100) / 100 : 0,
  }))

  return {
    currentLevel,
    currentScore: unified.score,
    nextLevel,
    nextThreshold,
    pointsNeeded,
    dimensionGaps,
  }
}
