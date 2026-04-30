// ─────────────────────────────────────────────────────────────
// prescription/benchmark.ts — 카테고리 + 순위 + Co-Rec 리더 추출
// ─────────────────────────────────────────────────────────────

import type { UnifiedScoreResult } from '../unifiedScore'
import type { BenchmarkInfo } from './types'

export function extractBenchmark(unified: UnifiedScoreResult): BenchmarkInfo {
  const catDim = unified.dimensions.find(d => d.id === 'category')
  const corecDim = unified.dimensions.find(d => d.id === 'corec')

  const category = (catDim?.breakdown?.category as string) ?? null

  const rankings = catDim?.breakdown?.rankings as Array<{ rank: number | null }> | undefined
  const yourRank = rankings?.reduce((best: number | null, r) => {
    if (r.rank == null) return best
    return best == null ? r.rank : Math.min(best, r.rank)
  }, null) ?? null

  const leaders = (corecDim?.breakdown?.top_5 as string[]) ?? []

  return { category, yourRank, leaders }
}
