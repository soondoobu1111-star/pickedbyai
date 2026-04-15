# Weekly Vision Audit — Self-Check Report

> **Every Sunday, Claude Code must produce this report without being asked.**
> **If Sunday passes with no audit, the founder should assume vision drift is happening.**

---

## Trigger

- **When:** Every Sunday evening, or at the end of the last session of the week (whichever comes first).
- **Who:** Claude Code, self-initiated. If Claude Code forgets, the founder pastes: `Run weekly vision audit now.`
- **Where:** Posted in chat AND appended to `/docs/audit-log.md` (create if missing).

---

## The Audit Format

```
=== WEEKLY VISION AUDIT — Week of [YYYY-MM-DD] ===

## 1. Commit Distribution (run: git log --since="7 days ago" --pretty=format:"%s")

Total commits this week: ___

By vision tag:
  [p1] Phase 1:        ___ commits
  [p2] Phase 2:        ___ commits
  [p3] Phase 3:        ___ commits
  [all] Platform-wide: ___ commits
  [moat-data]:         ___ commits
  [moat-brand]:        ___ commits
  [chore]:             ___ commits
  [fix]:               ___ commits
  (no tag — ERROR):    ___ commits  ⚠️ should be 0

Health check:
  [ ] At least 60% of commits carry a vision tag (not chore/fix)
  [ ] At least one commit in [moat-data] or [moat-brand]
  [ ] Zero untagged commits

## 2. Priority Progress

P0 (today) — was: ___ tasks, now: ___ tasks, closed this week: ___
P1 (this week) — was: ___ tasks, now: ___ tasks, closed this week: ___
P2 (next week) — closed this week: ___
P3 (within 2 weeks) — closed this week: ___

⚠️ RED FLAG if: any P1 task has been open for more than 7 days without progress
⚠️ RED FLAG if: any P3 task was closed before all P0 tasks were done

## 3. Vision Drift Check

Questions I must answer honestly:

Q1. Did I write any copy this week that narrowed the audience to "creators only"?
→ [yes/no] — if yes, list commits: ___

Q2. Did I build any feature that is NOT on the P0-P3 list or backlog?
→ [yes/no] — if yes, list commits: ___

Q3. Did I pay for or propose paying for any directory/service without approval?
→ [yes/no] — if yes, list: ___

Q4. Did I create or propose creating any automation bot for social platforms?
→ [yes/no] — if yes, list: ___

Q5. How many new entries landed in probe_logs this week?
→ ___ rows (target: growing steadily toward 10,000 by Day 30)

Q6. Did the manifesto page exist at the end of this week?
→ [yes/no]

Q7. Did the roadmap diagram exist under the hero at the end of this week?
→ [yes/no]

## 4. Distribution Scoreboard (if the founder is running Track A/B)

Track A — Creators:
  Emails captured this week: ___
  Calls completed: ___
  Gift-reports sent: ___

Track B — Vision audience (LinkedIn):
  DMs sent: ___
  Responses: ___
  Pilot conversations: ___
  Investor conversations: ___

## 5. Blockers Needing Founder Input

List any decisions where Claude Code is stuck or needs approval:
1. ___
2. ___
3. ___

## 6. Proposed Focus for Next Week

Based on the above, here is what I propose for next week:
- Continue P__ tasks: ___
- Start P__ tasks: ___
- Flag for founder discussion: ___

## 7. Honest Self-Assessment

One question, one answer:

"If a stranger looked at this week's commits, would they see 'a platform being built in layers' or 'a collection of small features'?"
→ ___

If the answer is "small features," I am drifting. Flag it to the founder in red.

=== END AUDIT ===
```

---

## How to run the audit mechanically

Claude Code can generate most of section 1 automatically with:

```bash
# Commit count by tag this week
git log --since="7 days ago" --pretty=format:"%s" \
  | grep -oE '^\[[a-z0-9-]+\]' \
  | sort | uniq -c | sort -rn

# Untagged commits (should be 0)
git log --since="7 days ago" --pretty=format:"%s" \
  | grep -vE '^\[(p1|p2|p3|all|moat-data|moat-brand|chore|fix)\]' \
  | wc -l
```

Section 2 requires reading `vision-rules.json` and comparing against completed tasks.

Sections 3–7 require honest judgment from Claude Code. Do not skip them — they are the point.

---

## What the founder does with the audit

The founder reads the audit and decides:

| Audit signal | Founder action |
|---|---|
| All sections healthy | "Good week. Continue P__." |
| Q1 = yes (narrowing copy) | "Stop and revert. Fill Vision Gate before any new work." |
| Q2 = yes (unlisted feature) | "Remove it or justify it. Update backlog if justified." |
| Commits 90% chore/fix | "Vision stalled. Halt all chore work. Focus on P0/P1 only." |
| probe_logs rows = 0 | "Moat not being built. This is the #1 failure mode." |
| Red flag in Q7 | "Drift confirmed. Stop. Re-read vision-brief-v2.md together." |

---

## Why this exists

The other three layers (Vision Gate, Commit Rules, Session Opener) catch drift at the moment it happens. The Weekly Audit catches drift that slipped past all of them.

Think of it as the smoke detector in a house that already has a sprinkler system. Redundant by design. That's the point.

If the audit is ever skipped, **assume the worst.** Vision drift is silent and compounding. A single week of drift doesn't look like much. Four weeks of drift is a different company.

---

*Related files: `/CLAUDE.md`, `/docs/vision-brief-v2.md`, `/docs/vision-rules.json`, `/docs/vision-gate.md`, `/docs/commit-rules.md`, `/docs/session-opener.md`*
