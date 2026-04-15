# Session Opener — Copy/Paste at the Start of Every New Claude Code Session

> **Purpose:** Force Claude Code to reload the vision before doing anything else.
> **How to use:** Copy the block below and paste it as your FIRST message in every new Claude Code session. Takes 5 seconds.

---

## 📋 Copy this block and paste it as your first message

```
Before we start, execute this session opener protocol:

1. Read /CLAUDE.md in full.
2. Read /docs/vision-brief-v2.md in full.
3. Read /docs/vision-rules.json in full.
4. Read /docs/vision-gate.md in full.
5. Read /docs/commit-rules.md in full.

Then reply with EXACTLY this format, filling in the blanks:

=== SESSION OPENER ACK ===
Vision loaded: [yes/no]
One-line vision (in my own words): ___
Current P0 tasks remaining: ___
Current P1 tasks remaining: ___
Hard prohibitions I will respect today: ___
Commit tag format I will use: ___
I understand I must fill out Vision Gate before any task: [yes/no]
=== END ACK ===

Do NOT start any work until I confirm the ack. If you cannot find any of the files above, stop and tell me.
```

---

## Why this exists

Claude Code forgets. Every new session, it is a new instance with zero memory of previous conversations. The only things that persist are files on disk. But even files are not enough — Claude Code might skim them or skip them for small tasks.

This opener **forces Claude Code to prove it has loaded the vision by writing it back in its own words.** Repetition burns the vision into the working memory of the session before any work begins.

## Why this is 60 seconds, not 5 minutes

- You copy one block (5 sec)
- Claude Code reads 5 files (~30 sec in a fast session)
- Claude Code fills out the ack (~20 sec)
- You read the ack and say "confirmed" (~5 sec)

Total: ~60 seconds per new session. Cheap insurance.

## When you can skip it

Never. Even if the session is just "fix this typo." Especially then. The moment you start skipping, vision drift begins.

## Variant for quick tasks

If you genuinely only have 30 seconds and just need a one-off fix, use this minimal version:

```
Minimal opener: read /CLAUDE.md and /docs/vision-rules.json, then tell me in 3 lines:
(1) which phase are we in,
(2) what is the #1 hard prohibition,
(3) what commit tag you will use for this task.
Do not start until I confirm.
```

---

## Session opener failure mode (watch for this)

If Claude Code responds with something like:

- "Sure, I've read them!" (no actual ack fields) → **Not loaded. Repeat the opener.**
- "I don't see /docs/vision-brief-v2.md" → **Something is broken. Check file paths. Stop.**
- Starts doing work immediately without the ack → **Interrupt. Repeat the opener. Do not proceed.**

The ack is not optional. The point is the proof of loading, not the convenience.

---

## Bonus: Use this in the middle of a long session too

If a long session (more than ~2 hours) starts feeling like Claude Code is drifting toward small features, paste this mid-session refresher:

```
Mid-session vision refresh — reply with:
(a) which phase does the last commit serve?
(b) which P0 or P1 task are we currently on?
(c) what am I NOT allowed to build right now?
Do not continue coding until you answer.
```

---

*Related files: `/CLAUDE.md`, `/docs/vision-brief-v2.md`, `/docs/vision-rules.json`, `/docs/vision-gate.md`, `/docs/commit-rules.md`, `/docs/weekly-vision-audit.md`*
