// ─────────────────────────────────────────────────────────────
// prescription/rules/corec.ts — Co-Recommendation 차원 (max=20)
// 8 actions × 5 levels.
// ─────────────────────────────────────────────────────────────

import type { ActionRule, PrescriptionLevel } from '../types'

export const COREC_RULES: Record<PrescriptionLevel, ActionRule[]> = {
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
      severity: 'high',
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
      severity: 'high',
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
      severity: 'high',
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
      severity: 'high',
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
      severity: 'high',
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
      severity: 'medium',
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
      severity: 'medium',
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
      severity: 'low',
    },
  ],
}
