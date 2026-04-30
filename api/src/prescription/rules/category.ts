// ─────────────────────────────────────────────────────────────
// prescription/rules/category.ts — Category 차원 (max=35)
// 9 actions × 5 levels.
// ─────────────────────────────────────────────────────────────

import type { ActionRule, PrescriptionLevel } from '../types'

export const CATEGORY_RULES: Record<PrescriptionLevel, ActionRule[]> = {
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
      severity: 'high',
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
      severity: 'high',
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
      severity: 'high',
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
      severity: 'high',
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
      severity: 'medium',
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
      severity: 'medium',
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
      severity: 'medium',
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
      severity: 'medium',
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
      severity: 'low',
    },
  ],
}
