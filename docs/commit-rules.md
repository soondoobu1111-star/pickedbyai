# Commit Rules — Vision-Tagged Commit Messages

> **Every single commit must include a vision tag. No exceptions.**
> **This rule exists so Claude Code cannot drift without leaving a visible trail.**

---

## The Rule

Every commit message MUST follow this format:

```
[<vision_tag>] <short description>

<optional longer body>

Vision-Layer: <phase_1 | phase_2 | phase_3 | all | moat_data | moat_brand>
Serves-Priority: <P0-xx | P1-xx | P2-xx | P3-xx | B-xx | none>
```

### Valid vision tags

| Tag | Meaning | Example |
|-----|---------|---------|
| `[p1]` | Phase 1 — Search Console work | `[p1] Add llms.txt generator to dashboard` |
| `[p2]` | Phase 2 — Analytics work | `[p2] Create probe_logs table schema` |
| `[p3]` | Phase 3 — Ads work | `[p3] Prototype placement optimization API` |
| `[all]` | Platform-wide (vision, positioning, trust) | `[all] Replace hero H1 with AI Visibility Platform` |
| `[moat-data]` | Building the data moat | `[moat-data] Backfill probe results into probe_logs` |
| `[moat-brand]` | Building narrative/brand moat | `[moat-brand] Publish /manifesto page` |
| `[chore]` | Internal maintenance, no behavior change | `[chore] Bump hono dependency to 4.9.1` |
| `[fix]` | Bug fix with no vision implication | `[fix] Probe timeout on long product names` |

### Invalid (rejected) examples

```
❌ "update landing page"           → no tag, rejected
❌ "[feat] new dashboard tab"      → 'feat' is not a valid vision tag
❌ "[p1] quick fix"                 → too vague, no Vision-Layer footer
❌ "[all] not for agencies clearer" → narrows audience, violates prohibition
```

### Valid examples

```
✅ [all] Replace "Not for agencies" with "Starting with creators"

   Removes audience-narrowing phrase from landing and 3 blog posts.
   Part of P0-02.

   Vision-Layer: all
   Serves-Priority: P0-02
```

```
✅ [moat-data] Record every probe result in probe_logs table

   Schema: product_id, query_template, ai_source, result_text,
   detected_rank, co_recommendations, timestamp.
   This is the raw material for Phase 2 Analytics and Phase 3 Ads.

   Vision-Layer: moat_data
   Serves-Priority: P1-02
```

```
✅ [p2] Add "Analytics (Coming Soon)" tab to dashboard

   Tab powered by real probe_logs data, not mock. Shows early
   adopters that Phase 2 is real, not marketing.

   Vision-Layer: phase_2
   Serves-Priority: P3-01
```

---

## How to enforce this (optional but recommended)

### Option A: Git commit-msg hook (automated rejection)

Create `.git/hooks/commit-msg` with this content, then `chmod +x`:

```bash
#!/usr/bin/env bash
# Reject commits without a valid vision tag.

msg_file="$1"
first_line="$(head -n1 "$msg_file")"

if ! grep -qE '^\[(p1|p2|p3|all|moat-data|moat-brand|chore|fix)\] ' <<< "$first_line"; then
  echo "❌ Commit rejected: missing or invalid vision tag."
  echo "   First line must start with one of:"
  echo "   [p1] [p2] [p3] [all] [moat-data] [moat-brand] [chore] [fix]"
  echo "   See /docs/commit-rules.md"
  exit 1
fi

# Non-chore/fix commits also require Vision-Layer footer
if grep -qE '^\[(p1|p2|p3|all|moat-data|moat-brand)\]' <<< "$first_line"; then
  if ! grep -q '^Vision-Layer:' "$msg_file"; then
    echo "❌ Commit rejected: missing 'Vision-Layer:' footer."
    echo "   See /docs/commit-rules.md"
    exit 1
  fi
fi

exit 0
```

### Option B: Honor system (Claude Code self-enforces)

Claude Code must read this file at session start and self-enforce. Every commit Claude Code makes must follow the rule, and the founder may reject any commit that breaks it.

---

## Why this matters

1. **Trail of breadcrumbs.** Every commit leaves a vision-layer tag in git history. You can run `git log --grep="^\[p2\]"` and see exactly how much Phase 2 work has happened. No more guessing.

2. **Forces thinking.** Claude Code cannot finish a task without answering "which layer did I just serve?" This is a 5-second speed bump with compound benefits.

3. **Detection of drift.** If a week goes by and 90% of commits are `[chore]` or `[fix]`, the vision is stalled. The tag count is a canary.

4. **Resistance to future Claude sessions.** Even when a new session forgets the vision, it will see the tag format in recent commits and mirror it, preserving the discipline.

---

## One rule above all

**If Claude Code cannot decide which tag to use, STOP and ask the founder.** An uncertain commit is a sign the task itself may not be aligned. The gate is there to catch exactly that.

---

*Related files: `/CLAUDE.md`, `/docs/vision-brief-v2.md`, `/docs/vision-rules.json`, `/docs/vision-gate.md`, `/docs/weekly-vision-audit.md`*
