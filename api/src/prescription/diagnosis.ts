// ─────────────────────────────────────────────────────────────
// prescription/diagnosis.ts — 4차원별 "왜 이 점수인지" 진단
// ─────────────────────────────────────────────────────────────

import type { DimensionScore, EngineGradeInfo } from '../unifiedScore'
import type { Diagnosis } from './types'
import { classifyDimensionLevel } from './classification'

export function buildDiagnosis(
  dim: DimensionScore,
  engineGrades: EngineGradeInfo[],
): Diagnosis {
  const level = classifyDimensionLevel(dim.score, dim.max)
  let summary: string
  let detail: string

  switch (dim.id) {
    case 'recognition': {
      const gemini = engineGrades.find(e => e.engine === 'gemini')
      const perplexity = engineGrades.find(e => e.engine === 'perplexity')
      const recognizedCount = [gemini, perplexity].filter(e => e?.recognized).length
      const recommendedCount = [gemini, perplexity].filter(e => e?.recommended).length
      summary = recognizedCount === 0
        ? '0 of 2 AI engines recognize you.'
        : recommendedCount === 2
        ? 'Every AI engine recommends you!'
        : `${recognizedCount} of 2 AI engines recognize you, ${recommendedCount} recommend you.`
      detail = [
        `Gemini: ${gemini?.recommended ? 'Recommended (Grade A)' : gemini?.recognized ? 'Recognized only (Grade C)' : 'Not recognized (Grade F)'}`,
        `Perplexity: ${perplexity?.recommended ? 'Recommended (Grade A)' : perplexity?.recognized ? 'Recognized only (Grade C)' : 'Not recognized (Grade F)'}`,
      ].join(' / ')
      break
    }
    case 'category': {
      const rankings = dim.breakdown.rankings as Array<{ rank: number | null }> | undefined
      const bestRank = rankings?.reduce((best: number | null, r) => {
        if (r.rank == null) return best
        return best == null ? r.rank : Math.min(best, r.rank)
      }, null) ?? null
      summary = bestRank === null
        ? 'You don\'t appear in category rankings when AI is asked "best" questions.'
        : bestRank <= 3
        ? `Category Top ${bestRank}! You're anchored at the top.`
        : `Ranked #${bestRank} in category. You need to break into the top tier.`
      detail = bestRank === null
        ? 'Not in Top-20 for "best {category}" queries'
        : `Best rank: #${bestRank}`
      break
    }
    case 'corec': {
      const uniqueCount = (dim.breakdown.unique_count as number) ?? 0
      summary = uniqueCount === 0
        ? "You aren't mentioned alongside other products when AI gives recommendations."
        : uniqueCount <= 3
        ? `Co-recommended with ${uniqueCount} products. You need a wider network.`
        : `Co-recommended with ${uniqueCount} products.`
      const top5 = (dim.breakdown.top_5 as string[]) ?? []
      detail = top5.length > 0
        ? `Co-recommended with: ${top5.join(', ')}`
        : 'No co-recommended products'
      break
    }
    case 'web': {
      const tier1 = (dim.breakdown.tier1_count as number) ?? 0
      const tier2 = (dim.breakdown.tier2_count as number) ?? 0
      const total = tier1 + tier2
      summary = total === 0
        ? "You aren't mentioned on any major websites yet."
        : `${tier1} Tier-1 and ${tier2} Tier-2 web mentions.`
      detail = total === 0
        ? '0 Tier-1/2 site mentions'
        : `Tier-1 (TechCrunch, etc.): ${tier1} / Tier-2 (blogs, etc.): ${tier2}`
      break
    }
    default: {
      summary = `Score: ${dim.score}/${dim.max}`
      detail = ''
    }
  }

  return {
    dimension: dim.id,
    label: dim.label,
    score: dim.score,
    max: dim.max,
    level,
    summary,
    detail,
  }
}
