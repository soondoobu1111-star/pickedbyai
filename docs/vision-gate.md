# Vision Gate — A+B 혼합형 Pre-Task Gate

> **This file exists to force Claude Code to think about the vision BEFORE touching any code.**
> **Claude Code MUST complete the appropriate Gate type and paste it back to the founder BEFORE making any changes.**

---

## ⛔ HARD RULE

**No code, no file edits, no commits may happen until the applicable Vision Gate is filled out and acknowledged by the founder.**

If Claude Code is tempted to skip this ("it's just a small change"), that is exactly when this gate matters most. Small changes accumulate into vision drift.

---

## Gate 유형 선택 기준

| 상황 | Gate 유형 | 문항 수 |
|------|-----------|---------|
| 우선순위 전환 (P0→P1, P1→P2 등) | **Full Gate (A형)** | 7문항 |
| 같은 우선순위 내 첫 작업 또는 배치 시작 | **Batch Gate (B형)** | 3문항 |
| 배치 승인 후 동일 우선순위 내 연속 작업 | **승인 불필요** — 커밋 태그만 필수 | 0문항 |
| 3작업 누적 완료 | **Mini Audit (감사)** | 1문항 |

---

## A형: Full Gate — 7문항 (우선순위 전환 시 필수)

우선순위가 바뀔 때만 실행한다. P0 작업을 마치고 P1으로 넘어갈 때, P1을 마치고 P2로 넘어갈 때 등.

Copy this block, fill it in, paste it in the chat BEFORE doing the task:

```
=== FULL VISION GATE (A형) — [task name] ===

전환: P__ → P__

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

=== END FULL VISION GATE ===

Founder acknowledgment: [ ] received   [ ] not yet
```

---

## B형: Batch Gate — 3문항 (같은 우선순위 내 배치 시작 시)

같은 우선순위 안에서 여러 작업을 연속 실행할 때, 한 번만 작성한다. 승인되면 해당 우선순위의 모든 작업을 연속 실행할 수 있다.

```
=== BATCH VISION GATE (B형) — [priority level] 배치 ===

Q1. 이 배치의 우선순위와 포함 작업 목록:
   우선순위: P__
   작업 목록:
   - [ ]
   - [ ]
   - [ ]

Q2. Which roadmap layer does this batch serve?
   [ ] Phase 1 — Search Console (measure)
   [ ] Phase 2 — Analytics (analyze)
   [ ] Phase 3 — Ads (optimize)
   [ ] Platform-wide (vision, trust, positioning)
   [ ] Moat — data accumulation
   [ ] Moat — brand/narrative

Q3. Does this batch expand or narrow the audience?
   [ ] Expands (or neutral) — OK to proceed
   [ ] Narrows — ⚠️ STOP and reconsider

=== END BATCH VISION GATE ===

Founder acknowledgment: [ ] received   [ ] not yet
```

Batch Gate가 승인되면, 목록에 포함된 작업은 추가 Gate 없이 연속 실행 가능하다. 단, 커밋 태그는 매 커밋마다 반드시 포함해야 한다.

---

## Mini Audit — 3작업 완료마다 drift 체크

3개의 작업(커밋)이 완료될 때마다, 다음 작업을 시작하기 전에 1문항 감사를 실행한다.

```
=== MINI AUDIT — 커밋 3건 감사 ===

대상 커밋:
1. [commit hash or tag] — [task summary]
2. [commit hash or tag] — [task summary]
3. [commit hash or tag] — [task summary]

Q1. 이 3개 커밋이 비전에 정렬되어 있는가?
   [ ] Yes — 모두 정렬됨. 계속 진행.
   [ ] Partial — 일부 drift 감지:
   [ ] No — ⚠️ STOP. Founder에게 보고 후 방향 재설정.

=== END MINI AUDIT ===
```

drift가 감지되면 즉시 멈추고 founder에게 보고한다. "Partial"인 경우에도 어떤 커밋이 어떻게 벗어났는지 구체적으로 기술한다.

---

## 커밋 태그 — 항상 필수

Gate 유형과 무관하게, **모든 커밋에는 vision tag를 반드시 포함한다.** Full Gate, Batch Gate, 배치 연속 실행, 어떤 상황이든 예외 없음.

형식은 `/docs/commit-rules.md`를 따른다.

---

## When to fill this out

- **Full Gate (A형):** 우선순위가 전환될 때 (P0→P1, P1→P2 등)
- **Batch Gate (B형):** 같은 우선순위 내에서 첫 작업을 시작할 때, 또는 새 배치를 시작할 때
- **Mini Audit:** 3개 커밋이 누적될 때마다
- **커밋 태그:** 매 커밋마다 항상

## When it is OK to skip

- Typo fixes in comments (not in user-facing copy)
- Dependency version bumps with no behavior change
- Internal code refactors that don't touch behavior or copy

이 skip 조건은 Gate 작성만 면제한다. **커밋 태그는 skip 조건에서도 필수이다.**

## Why this exists

Claude Code is a coding agent, optimized to finish small tasks quickly. That optimization is exactly what makes it drift away from large visions. 기존 7문항 Full Gate는 필요하지만, 같은 우선순위 안에서 매 작업마다 반복하면 속도가 떨어진다. A+B 혼합형은 **전환점에서는 엄격하게, 연속 실행에서는 빠르게** 움직이되, 3작업마다 Mini Audit으로 drift를 잡는다.

If Claude Code finds itself annoyed by filling this out, that is the gate working. Do not remove it.

---

*Related files: `/CLAUDE.md`, `/docs/vision-brief-v2.md`, `/docs/vision-rules.json`, `/docs/commit-rules.md`, `/docs/weekly-vision-audit.md`*
