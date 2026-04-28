// ─────────────────────────────────────────────────────────────
// prescriptionEngine.ts — 빅파이 1.6 처방 엔진
//
// 원칙: 규칙 기반, LLM 미사용, 비용 $0
// 근거: pickedbyAI/docs/bigpie-v1.6.md SS3
// 스펙: docs/outputs/d1_prescription_engine_spec_20260427.md
// 작성: 2026-04-27 (Phase 2a Day 1)
// ─────────────────────────────────────────────────────────────

import type { DimensionId, DimensionScore, UnifiedScoreResult, EngineGradeInfo } from './unifiedScore'

// ===== 타입 정의 =====

export type PrescriptionLevel = 'invisible' | 'emerging' | 'growing' | 'strong' | 'perfect'

export interface Diagnosis {
  dimension: DimensionId
  label: string
  score: number
  max: number
  level: PrescriptionLevel
  summary: string
  detail: string
}

export interface Action {
  id: string
  dimension: DimensionId
  title: string
  description: string
  difficulty: 1 | 2 | 3
  estimatedImpact: number
  timeToComplete: string
  externalUrl?: string
  priority: number
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

// ===== 레벨 분류 =====

export function classifyLevel(score: number): PrescriptionLevel {
  if (score >= 81) return 'perfect'
  if (score >= 61) return 'strong'
  if (score >= 41) return 'growing'
  if (score >= 21) return 'emerging'
  return 'invisible'
}

function classifyDimensionLevel(score: number, max: number): PrescriptionLevel {
  const normalized = max > 0 ? (score / max) * 100 : 0
  return classifyLevel(normalized)
}

// ===== 레벨 요약 텍스트 =====

const LEVEL_SUMMARIES: Record<PrescriptionLevel, string> = {
  invisible: "AI doesn't know your product yet. Now is the time to start.",
  emerging: 'AI is starting to notice you, but recommendations are still far off.',
  growing: "You're growing. Differentiation is the key to the next level.",
  strong: 'Strong presence! Focus on cracking the top 3 and defending position.',
  perfect: 'Top-tier AI visibility. Focus on maintaining and expanding.',
}

// ===== 20규칙 룰셋 =====

const PRESCRIPTION_RULES: Record<DimensionId, Record<PrescriptionLevel, Action[]>> = {
  // ── Recognition (max=35) ───────────────────────────────────
  recognition: {
    invisible: [
      {
        id: 'rx-rec-inv-01',
        dimension: 'recognition',
        title: 'Launch on Product Hunt',
        description: 'For AI training data to include your product, you need presence on major platforms. A Product Hunt launch is a core source AI crawlers ingest.',
        difficulty: 2,
        estimatedImpact: 8,
        timeToComplete: 'Half day',
        externalUrl: 'https://www.producthunt.com/posts/new',
        priority: 10,
      },
      {
        id: 'rx-rec-inv-02',
        dimension: 'recognition',
        title: 'Add an llms.txt file at your domain root',
        description: 'llms.txt is a standard that helps AI accurately understand your product. Structure your product name, description, and key features and publish at /llms.txt.',
        difficulty: 1,
        estimatedImpact: 5,
        timeToComplete: '30 min',
        externalUrl: 'https://llmstxt.org',
        priority: 15,
      },
      {
        id: 'rx-rec-inv-03',
        dimension: 'recognition',
        title: 'Post your product on Hacker News Show HN',
        description: 'HN is a core source for AI training data. Posting in the "Show HN: {product} - {one-liner}" format significantly raises the odds AI will recognize you.',
        difficulty: 2,
        estimatedImpact: 7,
        timeToComplete: '2 hours',
        externalUrl: 'https://news.ycombinator.com/showhn.html',
        priority: 12,
      },
      {
        id: 'rx-rec-inv-04',
        dimension: 'recognition',
        title: 'Create an English Wikipedia article for your product',
        description: 'Wikipedia is in nearly every AI training set. If your product meets notability, a Wikipedia article is the surest route to AI recognition.',
        difficulty: 3,
        estimatedImpact: 10,
        timeToComplete: '1+ day',
        externalUrl: 'https://en.wikipedia.org/wiki/Wikipedia:Your_first_article',
        priority: 20,
      },
    ],
    emerging: [
      {
        id: 'rx-rec-emg-01',
        dimension: 'recognition',
        title: 'Create content targeting AI engines that miss you',
        description: 'Check which engines have an F grade in Engine Grades. Publish product content on the platforms that AI primarily crawls (Gemini=YouTube/Reddit, Perplexity=fresh web).',
        difficulty: 2,
        estimatedImpact: 6,
        timeToComplete: 'Half day',
        priority: 10,
      },
      {
        id: 'rx-rec-emg-02',
        dimension: 'recognition',
        title: 'Write product use-case posts on tech blogs',
        description: 'Publish "How to use {product} for {use-case}" posts on Medium, Dev.to, and your own blog. For AI to recommend a product, it needs concrete use-case text.',
        difficulty: 2,
        estimatedImpact: 5,
        timeToComplete: '3 hours',
        priority: 15,
      },
    ],
    growing: [
      {
        id: 'rx-rec-grw-01',
        dimension: 'recognition',
        title: 'Tighten official docs so AI recommendations describe you accurately',
        description: "You're recognized, but inaccurate info may surface. Update meta tags, product descriptions, and FAQs on your official site so the messaging is unambiguous.",
        difficulty: 2,
        estimatedImpact: 4,
        timeToComplete: 'Half day',
        priority: 10,
      },
      {
        id: 'rx-rec-grw-02',
        dimension: 'recognition',
        title: 'Appear on industry podcasts and interviews',
        description: 'Podcast transcripts end up in AI training data. An interview that clearly explains your differentiation is what flips AI from "knows you" to "recommends you".',
        difficulty: 3,
        estimatedImpact: 5,
        timeToComplete: '1 day',
        priority: 15,
      },
    ],
    strong: [
      {
        id: 'rx-rec-str-01',
        dimension: 'recognition',
        title: 'Reach "recommended" grade on both AI engines',
        description: 'If any engine sits at grade C (recognition only), ask that AI directly to recommend your product and see what context is missing. Differentiation content vs. competitors is the lever.',
        difficulty: 2,
        estimatedImpact: 4,
        timeToComplete: 'Half day',
        priority: 10,
      },
      {
        id: 'rx-rec-str-02',
        dimension: 'recognition',
        title: 'Strengthen content so comparison posts list you #1',
        description: 'Being mentioned first in "Best {category}" comparisons is a core signal for AI recommendations. Beyond your own blog, ask third-party reviewers to publish comparisons.',
        difficulty: 3,
        estimatedImpact: 5,
        timeToComplete: '1 day',
        priority: 15,
      },
    ],
    perfect: [
      {
        id: 'rx-rec-prf-01',
        dimension: 'recognition',
        title: 'Monitor AI recognition weekly',
        description: "You're already in great shape. Use pickedby.ai Daily Pulse to track weekly changes and stay ahead of rank shifts from new entrants or AI model updates.",
        difficulty: 1,
        estimatedImpact: 1,
        timeToComplete: '10 min/week',
        priority: 50,
      },
      {
        id: 'rx-rec-prf-02',
        dimension: 'recognition',
        title: 'Expand coverage to new AI engines (Claude, Grok)',
        description: 'Beyond the two engines we currently measure, check recognition on new AIs like Claude and Grok. Being recommended across many AIs is your long-term moat.',
        difficulty: 2,
        estimatedImpact: 2,
        timeToComplete: '2 hours',
        priority: 55,
      },
    ],
  },

  // ── Category (max=35) ──────────────────────────────────────
  category: {
    invisible: [
      {
        id: 'rx-cat-inv-01',
        dimension: 'category',
        title: 'Publish a "Best {category}" blog post',
        description: 'When AI is asked "best {your category}" you don\'t show up. Write a "Best {category} tools in 2026" comparison post to anchor your product in category context.',
        difficulty: 2,
        estimatedImpact: 7,
        timeToComplete: '3 hours',
        priority: 10,
      },
      {
        id: 'rx-cat-inv-02',
        dimension: 'category',
        title: 'Include category keywords in meta tags and titles',
        description: 'Put the "{category} tool" keyword explicitly in your site title, meta description, and h1. AI uses these tags during crawling to classify category.',
        difficulty: 1,
        estimatedImpact: 4,
        timeToComplete: '30 min',
        priority: 15,
      },
    ],
    emerging: [
      {
        id: 'rx-cat-emg-01',
        dimension: 'category',
        title: 'Claim a niche sub-category',
        description: 'If the broad category is too competitive, target a narrower sub-category. Example: aim for #1 in "AI visibility checker" instead of "AI tool".',
        difficulty: 2,
        estimatedImpact: 6,
        timeToComplete: 'Half day',
        priority: 10,
      },
      {
        id: 'rx-cat-emg-02',
        dimension: 'category',
        title: 'List your product on G2 and Capterra',
        description: 'AI relies on software directories like G2 and Capterra as core sources for category rankings. Complete your product profile and seed initial reviews.',
        difficulty: 2,
        estimatedImpact: 6,
        timeToComplete: '2 hours',
        externalUrl: 'https://www.g2.com/products/new',
        priority: 12,
      },
    ],
    growing: [
      {
        id: 'rx-cat-grw-01',
        dimension: 'category',
        title: 'Earn top mentions in third-party comparison reviews',
        description: 'To climb the category rank, you need top placement in comparison posts written by third parties. Reach out to reviewers and bloggers to cover your product.',
        difficulty: 3,
        estimatedImpact: 5,
        timeToComplete: '1 day',
        priority: 10,
      },
      {
        id: 'rx-cat-grw-02',
        dimension: 'category',
        title: 'Sharpen your differentiation vs. competitors',
        description: 'When AI answers "best {category}" it picks products with a clear reason to stand out. Build "vs {competitor}" comparison pages that structure your differentiation.',
        difficulty: 2,
        estimatedImpact: 5,
        timeToComplete: 'Half day',
        priority: 12,
      },
    ],
    strong: [
      {
        id: 'rx-cat-str-01',
        dimension: 'category',
        title: 'Concentrate on user reviews to crack the Top 3',
        description: 'Volume and quality of reviews are decisive at the top of a category. Ask real users to leave reviews on Product Hunt and G2.',
        difficulty: 2,
        estimatedImpact: 4,
        timeToComplete: 'Half day',
        priority: 10,
      },
      {
        id: 'rx-cat-str-02',
        dimension: 'category',
        title: 'Expand into adjacent categories',
        description: "If you're strong in your current category, build awareness in adjacent ones too. Presence across multiple categories raises your AI recommendation odds.",
        difficulty: 3,
        estimatedImpact: 4,
        timeToComplete: '1 day',
        priority: 15,
      },
    ],
    perfect: [
      {
        id: 'rx-cat-prf-01',
        dimension: 'category',
        title: 'Build a defense plan for your #1 category position',
        description: "Congrats — you're at the top of the category. Monitor rank shifts weekly and respond immediately when new competitors enter.",
        difficulty: 1,
        estimatedImpact: 1,
        timeToComplete: '10 min/week',
        priority: 50,
      },
    ],
  },

  // ── Co-Recommendation (max=20) ─────────────────────────────
  corec: {
    invisible: [
      {
        id: 'rx-cor-inv-01',
        dimension: 'corec',
        title: 'List your product on AlternativeTo',
        description: 'AI references AlternativeTo data when recommending "alternatives to X". Listing yourself as an alternative to competitors raises the odds you get co-recommended.',
        difficulty: 1,
        estimatedImpact: 5,
        timeToComplete: '30 min',
        externalUrl: 'https://alternativeto.net/submit/',
        priority: 10,
      },
      {
        id: 'rx-cor-inv-02',
        dimension: 'corec',
        title: 'Write "vs {competitor}" comparison posts',
        description: 'When AI recommends a product, it looks for alternatives to mention alongside. "{your product} vs {competitor}" comparison content sharply raises your co-recommendation odds.',
        difficulty: 2,
        estimatedImpact: 5,
        timeToComplete: '2 hours',
        priority: 12,
      },
      {
        id: 'rx-cor-inv-03',
        dimension: 'corec',
        title: 'Join Reddit "alternative recommendation" threads',
        description: 'Find "looking for {category} alternative" threads and introduce your product naturally. Reddit is a core source for AI training data.',
        difficulty: 1,
        estimatedImpact: 4,
        timeToComplete: '1 hour',
        priority: 15,
      },
    ],
    emerging: [
      {
        id: 'rx-cor-emg-01',
        dimension: 'corec',
        title: 'Try cross-promotion partnerships',
        description: 'Build mutual link/mention partnerships with products that get recommended alongside you. "Pairs well with {partner}" phrasing helps you co-appear in AI recommendations.',
        difficulty: 2,
        estimatedImpact: 4,
        timeToComplete: 'Half day',
        priority: 10,
      },
      {
        id: 'rx-cor-emg-02',
        dimension: 'corec',
        title: 'Collect reviews on comparison platforms',
        description: 'The more reviews you have on G2, Capterra, TrustRadius, etc., the more likely AI is to mention you alongside same-category competitors.',
        difficulty: 2,
        estimatedImpact: 4,
        timeToComplete: 'Half day',
        priority: 12,
      },
    ],
    growing: [
      {
        id: 'rx-cor-grw-01',
        dimension: 'corec',
        title: 'List on integration marketplaces',
        description: 'Listing on Zapier, Make.com, and similar integration platforms creates connective context with other tools, lifting co-recommendation naturally.',
        difficulty: 3,
        estimatedImpact: 4,
        timeToComplete: '1 day',
        priority: 10,
      },
    ],
    strong: [
      {
        id: 'rx-cor-str-01',
        dimension: 'corec',
        title: 'Benchmark top peers and double down on differentiation',
        description: 'Analyze the top products that get co-recommended with you on the CoRec leaderboard. Acknowledge their strengths, then publish content that sharpens your unique edge.',
        difficulty: 2,
        estimatedImpact: 3,
        timeToComplete: 'Half day',
        priority: 10,
      },
    ],
    perfect: [
      {
        id: 'rx-cor-prf-01',
        dimension: 'corec',
        title: 'Monitor your Co-Recommendation network',
        description: 'Great work — you get co-recommended with a wide range of products. Check weekly for new entrants and maintain your existing partnerships.',
        difficulty: 1,
        estimatedImpact: 1,
        timeToComplete: '10 min/week',
        priority: 50,
      },
    ],
  },

  // ── Web Authority (max=10) ─────────────────────────────────
  web: {
    invisible: [
      {
        id: 'rx-web-inv-01',
        dimension: 'web',
        title: 'Post on Hacker News, Reddit, and Product Hunt',
        description: 'Your product has zero mentions on Tier-1 sites (HN, Reddit, PH, G2, Capterra). Introducing your product on these platforms is the first step toward Web Authority.',
        difficulty: 2,
        estimatedImpact: 4,
        timeToComplete: '2 hours',
        priority: 10,
      },
      {
        id: 'rx-web-inv-02',
        dimension: 'web',
        title: 'Distribute press releases to industry media',
        description: 'Pitch press releases to Tier-1 media like TechCrunch and The Verge. If that feels out of reach, start with Tier-2 outlets like IndieHackers and BetaList.',
        difficulty: 3,
        estimatedImpact: 5,
        timeToComplete: '1 day',
        priority: 15,
      },
    ],
    emerging: [
      {
        id: 'rx-web-emg-01',
        dimension: 'web',
        title: 'Secure mentions on Tier-1 sites',
        description: "You're only mentioned on Tier-2 sites today. Pitch Tier-1 media like TechCrunch and Wired, or earn Tier-1 coverage through industry conference talks.",
        difficulty: 3,
        estimatedImpact: 4,
        timeToComplete: '1 day',
        priority: 10,
      },
    ],
    growing: [
      {
        id: 'rx-web-grw-01',
        dimension: 'web',
        title: 'Increase guest posts and outside contributions',
        description: 'Write guest posts for industry blogs and media. Natural backlinks lift Web Authority and signal to AI that you are a trustworthy source.',
        difficulty: 2,
        estimatedImpact: 3,
        timeToComplete: 'Half day',
        priority: 10,
      },
    ],
    strong: [
      {
        id: 'rx-web-str-01',
        dimension: 'web',
        title: 'Set up a regular media presence cadence',
        description: 'Create a steady media routine — quarterly press releases, monthly blog contributions. Continuous presence, not one-off hits, is the key to sustaining Web Authority.',
        difficulty: 2,
        estimatedImpact: 2,
        timeToComplete: 'Half day',
        priority: 10,
      },
    ],
    perfect: [
      {
        id: 'rx-web-prf-01',
        dimension: 'web',
        title: 'Maintain Web Authority while exploring new channels',
        description: "You've reached top-tier web authority. Keep your existing channels healthy and diversify into new media platforms and podcasts.",
        difficulty: 1,
        estimatedImpact: 1,
        timeToComplete: '10 min/week',
        priority: 50,
      },
    ],
  },
}

// ===== 진단 생성 =====

function buildDiagnosis(
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
        ? `Category Top ${bestRank}! You\'re anchored at the top.`
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

// ===== Top 3 선정 =====

function selectTop3(actions: Action[], dimensions: DimensionScore[]): Action[] {
  const dimAchievement: Record<string, number> = {}
  for (const dim of dimensions) {
    dimAchievement[dim.id] = dim.max > 0 ? dim.score / dim.max : 1
  }

  return [...actions]
    .sort((a, b) => {
      // 1차: 달성률 낮은 차원 우선 (점수 낮을수록 처방 가치 높음)
      const achA = dimAchievement[a.dimension] ?? 1
      const achB = dimAchievement[b.dimension] ?? 1
      if (achA !== achB) return achA - achB

      // 2차: 임팩트 큰 것 우선
      if (a.estimatedImpact !== b.estimatedImpact) return b.estimatedImpact - a.estimatedImpact

      // 3차: 난이도 낮은 것 우선 (쉬운 것부터)
      if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty

      // 4차: priority
      return a.priority - b.priority
    })
    .slice(0, 3)
}

// ===== Gap 계산 =====

const LEVEL_THRESHOLDS: Array<{ level: PrescriptionLevel; min: number }> = [
  { level: 'perfect', min: 81 },
  { level: 'strong', min: 61 },
  { level: 'growing', min: 41 },
  { level: 'emerging', min: 21 },
  { level: 'invisible', min: 0 },
]

function computeGap(unified: UnifiedScoreResult): GapInfo {
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

// ===== 벤치마크 추출 =====

function extractBenchmark(unified: UnifiedScoreResult): BenchmarkInfo {
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

// ===== 메인 함수 =====

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

  // 현재 레벨 처방 후보 수집
  const allActions = unified.dimensions.flatMap(dim => {
    const dimLevel = classifyDimensionLevel(dim.score, dim.max)
    return PRESCRIPTION_RULES[dim.id]?.[dimLevel] ?? []
  })

  // Top 3 선정
  const prescriptions = selectTop3(allActions, unified.dimensions)

  // Gap 계산
  const gap = computeGap(unified)

  // 벤치마크 추출
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
