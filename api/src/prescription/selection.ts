// ─────────────────────────────────────────────────────────────
// prescription/selection.ts — 우선순위 정렬 + Quick Win 라벨
// Claude-Ads 차용: SEVERITY_MULTIPLIER (5x/3x/1.5x/0.5x) + Quick Win 룰
// 정렬 = severity_multiplier × estimated_impact × (0.5 + dimUrgency)
// ─────────────────────────────────────────────────────────────

import type { DimensionScore } from '../unifiedScore'
import type { Action, ActionRule, Severity } from './types'

// Claude-Ads 차용 (외부 추정치 5/3/1.5/0.5 — 우리 4단 그대로 적용)
export const SEVERITY_MULTIPLIER: Record<Severity, number> = {
  critical: 5.0,
  high: 3.0,
  medium: 1.5,
  low: 0.5,
}

// Quick Win = difficulty 1 + 30분 이내 완료
const QUICK_WIN_TIME_PATTERN = /^(10|15|20|30)\s*min/i

export function isQuickWin(rule: ActionRule | Action): boolean {
  return rule.difficulty === 1 && QUICK_WIN_TIME_PATTERN.test(rule.timeToComplete)
}

export function attachQuickWin(rule: ActionRule): Action {
  return { ...rule, quickWin: isQuickWin(rule) }
}

// dimAchievement: 0~1 (해당 차원의 score/max 비율).
// dimUrgency = 1 - dimAchievement → 달성률 낮을수록 시급도 높음.
export function computePriorityScore(
  action: Action | ActionRule,
  dimAchievement: number,
): number {
  const urgency = 1 - dimAchievement
  return SEVERITY_MULTIPLIER[action.severity] * action.estimatedImpact * (0.5 + urgency)
}

export function selectTop3(
  actions: Action[],
  dimensions: DimensionScore[],
): Action[] {
  const dimAchievement: Record<string, number> = {}
  for (const dim of dimensions) {
    dimAchievement[dim.id] = dim.max > 0 ? dim.score / dim.max : 1
  }

  return [...actions]
    .map(a => ({
      a,
      score: computePriorityScore(a, dimAchievement[a.dimension] ?? 1),
    }))
    .sort((x, y) => {
      if (y.score !== x.score) return y.score - x.score
      // tie-breaker 1: 난이도 낮은 것 우선
      if (x.a.difficulty !== y.a.difficulty) return x.a.difficulty - y.a.difficulty
      // tie-breaker 2: priority 낮은 숫자 우선
      return x.a.priority - y.a.priority
    })
    .slice(0, 3)
    .map(x => x.a)
}
