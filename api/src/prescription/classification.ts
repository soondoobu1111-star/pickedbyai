// ─────────────────────────────────────────────────────────────
// prescription/classification.ts — 레벨 분류 + 임계값
// ─────────────────────────────────────────────────────────────

import type { PrescriptionLevel } from './types'

export const LEVEL_THRESHOLDS: Array<{ level: PrescriptionLevel; min: number }> = [
  { level: 'perfect', min: 81 },
  { level: 'strong', min: 61 },
  { level: 'growing', min: 41 },
  { level: 'emerging', min: 21 },
  { level: 'invisible', min: 0 },
]

export const LEVEL_SUMMARIES: Record<PrescriptionLevel, string> = {
  invisible: "AI doesn't know your product yet. Now is the time to start.",
  emerging: 'AI is starting to notice you, but recommendations are still far off.',
  growing: "You're growing. Differentiation is the key to the next level.",
  strong: 'Strong presence! Focus on cracking the top 3 and defending position.',
  perfect: 'Top-tier AI visibility. Focus on maintaining and expanding.',
}

export function classifyLevel(score: number): PrescriptionLevel {
  if (score >= 81) return 'perfect'
  if (score >= 61) return 'strong'
  if (score >= 41) return 'growing'
  if (score >= 21) return 'emerging'
  return 'invisible'
}

export function classifyDimensionLevel(score: number, max: number): PrescriptionLevel {
  const normalized = max > 0 ? (score / max) * 100 : 0
  return classifyLevel(normalized)
}
