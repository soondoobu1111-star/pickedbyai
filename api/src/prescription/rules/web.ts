// ─────────────────────────────────────────────────────────────
// prescription/rules/web.ts — Web Authority 차원 (max=10)
// 6 actions × 5 levels.
// ─────────────────────────────────────────────────────────────

import type { ActionRule, PrescriptionLevel } from '../types'

export const WEB_RULES: Record<PrescriptionLevel, ActionRule[]> = {
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
      severity: 'high',
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
      severity: 'medium',
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
      severity: 'medium',
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
      severity: 'medium',
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
      severity: 'medium',
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
      severity: 'low',
    },
  ],
}
