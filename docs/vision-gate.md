# Vision Gate — Mandatory Pre-Task Questionnaire

> **This file exists to force Claude Code to think about the vision BEFORE touching any code.**
> **Claude Code MUST fill this out at the start of every new task and paste it back to the founder BEFORE making any changes.**

---

## ⛔ HARD RULE

**No code, no file edits, no commits may happen until Vision Gate is filled out and acknowledged by the founder.**

If Claude Code is tempted to skip this ("it's just a small change"), that is exactly when this gate matters most. Small changes accumulate into vision drift.

---

## The 7 Questions (answer all, in order)

Copy this block, fill it in, paste it in the chat BEFORE doing the task:

```
=== VISION GATE — [task name] ===

Q1. One-sentence description of the task I'm about to do:
→ 

Q2. Which roadmap layer does this serve?
   [ ] Phase 1 — Search Console (measure)
   [ ] Phase 2 — Analytics (analyze)
   [ ] Phase 3 — Ads (optimize)
   [ ] Platform-wide (vision, trust, positioning)
   [ ] Moat — data accumulation
   [ ] Moat — brand/narrative
   [ ] NONE — ⚠️ STOP and ask founder

Q3. Does this task expand or narrow the audience?
   [ ] Expands (or neutral) — OK to proceed
   [ ] Narrows ("creator only" vibe) — ⚠️ STOP and reconsider

Q4. If I do this task, which future phase does it make easier?
→ 

Q5. Could this task be delayed without blocking the vision? If yes, why am I doing it now instead of a higher-priority item?
→ 

Q6. Does this task match the current priority level (P0 first, then P1, etc.)?
   [ ] Yes, it is the current priority
   [ ] No, but here is why I am doing it anyway: 

Q7. After this task, which vision-aligned metric will measurably change?
   (examples: probe_logs rows, manifesto page exists, audience-narrowing phrases removed, etc.)
→ 

=== END VISION GATE ===

Founder acknowledgment: [ ] received   [ ] not yet
```

---

## When to fill this out

- **Always:** before any new task, even tiny ones
- **Always:** before any copy change that touches the landing page or blogs
- **Always:** before any new file creation
- **Always:** before any new database migration or schema change

## When it is OK to skip

- Typo fixes in comments (not in user-facing copy)
- Dependency version bumps with no behavior change
- Internal code refactors that don't touch behavior or copy

## Why this exists

Claude Code is a coding agent, optimized to finish small tasks quickly. That optimization is exactly what makes it drift away from large visions. Every Vision Gate answer is a 30-second speed bump that reminds Claude Code: **"this project is not a collection of features, it is a platform being built in layers."**

If Claude Code finds itself annoyed by filling this out, that is the gate working. Do not remove it.

---

*Related files: `/CLAUDE.md`, `/docs/vision-brief-v2.md`, `/docs/vision-rules.json`, `/docs/commit-rules.md`, `/docs/weekly-vision-audit.md`*
