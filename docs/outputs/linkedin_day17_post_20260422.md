# LinkedIn Post — Day 17 (2026-04-22) · v2
> 기반: `linkedin_day12_post_20260417.md` (Day 12)
> **업데이트 사유:** 2026-04-17 재설계 + 2026-04-22 BUG-PASS-INDICATOR/SCORE-FIELD 수정 반영
> **CEO 2026-04-21 지침 반영:** 외부 카피는 5대 AI (GPT·Gemini·Claude·Grok·Perplexity) 전체 커버 명시

---

## 본문 (영어, 1,300자 이내)

```
17 days ago I built a tool that tests whether the 5 big AI assistants
— GPT, Gemini, Claude, Grok, Perplexity — actually recommend your product.

I ran it on my own product first.

Score: 12/100.

Embarrassing. The tool that measures AI visibility had almost
no AI visibility itself.

So I rebuilt it in public. Every blog post, every commit, every cron run.

Day 12: Score was 32/100.

Then I found a bug in my own scoring system.

Turns out I had two incompatible scoring engines running in parallel.
Sub-scores said 42, the final score said 33. Mathematical nonsense.

I rebuilt the engine from scratch. 4 dimensions (Recognition / Category /
Co-Rec / Web Authority) that sum to exactly the final score. No more
hidden offsets, no more silent contradictions.

Day 17: Score is now 28/100 — honestly recalculated.

That's LOWER than Day 12. But it's REAL. The old 32 was the bug.

Then I ran 5 prominent indie creator products through the new scanner:

▸ ShipFast (Marc Lou): 68 — Perplexity ✅, ChatGPT ❌, Gemini ❌
▸ TypingMind (Tony Dinh): 75 — Perplexity ✅, ChatGPT ❌, Gemini ❌
▸ Starter Story (Pat Walls): 68 — Perplexity ✅, ChatGPT ❌, Gemini ❌
▸ Bootstrapped Founder (Arvid Kahl): 41 — Perplexity ✅, others ❌
▸ Second Brain (Easlo): 45 — Perplexity ✅, ChatGPT ✅, Gemini ✅

Four out of five famous creators are INVISIBLE on ChatGPT.
Only Easlo crosses all three engines.

The pattern holds: SEO winners aren't automatically AI winners.
Perplexity indexes the open web aggressively. ChatGPT/Gemini/Claude/Grok
don't — they need to have seen your brand mentioned, cited, linked.

If you build a product and nobody measures this, you'll wake up
one day with a beautiful Google ranking and zero AI recommendations.
And AI recommendations are already where a growing chunk of
buying decisions happen.

The tool is free. No signup. Just type your domain:
https://pickedby.ai

Day 17 writeup (bug story, rebuild logs, honest numbers):
https://pickedby.ai/blog/we-posted-on-indie-hackers-day-12

— building in public, solo founder + AI coding agents
#BuildInPublic #AIVisibility #GEO #IndieHackers
```

**실자수:** ~1,290자. LinkedIn 본문 한도(3,000자) 내.

---

## v1 대비 변경 요약

| 영역 | v1 (Day 12, 04-17) | v2 (Day 17, 04-22) |
|------|-------------------|--------------------|
| 첫 문장 | "ChatGPT, Perplexity, Gemini" 3개 | **"5 big AI assistants — GPT, Gemini, Claude, Grok, Perplexity"** (CEO 지침) |
| Day 번호 | Day 12 / 32 | Day 17 / 28 (정직 재계산) |
| 중간 추가 | — | **"I found a bug" + 재설계 스토리 (4 dimensions sum to final)** |
| 스토리 톤 | "built → scanning" | "built → bug → honest recalc → lower but real" |
| 브랜드 포지션 | "measures AI visibility" | "measures AI visibility" (유지) |

---

## 카피 전략 포인트

1. **훅 (1~3줄):** 5대 AI 전체 커버 + 12점 공개
2. **자기 비판 (4~12줄):** 버그 발견 + 투명 재설계
3. **정직 (13~14줄):** "LOWER than Day 12. But it's REAL" — 취약성 훅 2차
4. **데이터 (15~20줄):** 셀럽 5명 실제 스캔 (유지)
5. **패턴 인사이트 (21~28줄):** SEO≠AI, 4대 AI 각각 특성
6. **CTA + 블로그:** 무료 스캐너 + Day 17 writeup

---

## 이미지 첨부 (선택, 강력 권장)

**이미지 1 (v2 신규):** Day 12 vs Day 17 점수 비교
- "Day 12: 32 (with bug)" → "Day 17: 28 (honest recalc)"
- 빨간색 × (버그) → 초록색 ✓ (정직)
- 크기: 1200x1200

**이미지 2 (v1 유지):** 셀럽 5명 스캔 결과 표

---

## 태그 사용 (v1 유지)

```
#BuildInPublic · #AIVisibility · #GEO · #IndieHackers
```

---

## 게시 후 액션 (CEO) · v1과 동일

| 시간 | 액션 |
|---|---|
| 게시 직후 | Sorina 개인 네트워크 5명에게 "좋아요" 요청 DM |
| +30분 | 댓글 첫 2개 달리면 즉시 답글 (알고리즘 부스트) |
| +2시간 | pickedby.ai 회사 페이지에서 재공유 |
| +24시간 | 댓글 전부 답변 (영어) |

---

## 응답 시나리오 (추가 2건)

| 댓글 유형 | 답글 |
|---|---|
| "Why lower on Day 17?" | "Old engine double-counted. Found the bug, fixed the math. 28 is honest; 32 was fiction. Full writeup: /blog/we-posted-on-indie-hackers-day-12" |
| "What changed in the rebuild?" | "Replaced 5 Tavily-derived sub-scores with 4 AI-probe dimensions: Recognition (35) + Category (35) + Co-Rec (20) + Web (10) = 100. Math adds up." |

---

## 금지사항 (v1 유지)

- ❌ 과장 ("first ever", "game-changing", "revolutionary")
- ❌ "DM me for demo"
- ❌ 이모지 과용 (1개 이내)
- ❌ 여러 링크 (2개까지만)

---

## ⚠️ 게시 타이밍 권고

- **D11 DEPLOY-GATE-01 통과(04-29) 이후** 게시 권장. 프로덕션 배포 완료 상태에서 "28점" 카피가 살아있는 숫자가 됨.
- 지금(04-22) 게시 시: 스테이징 28점 / 프로덕션 33점(레거시) 불일치로 유저가 방문하면 다른 값을 봄 → **신뢰 손상 리스크**.
- 대안: D11 이후 게시 + 블로그 업데이트 동시.

---

*CEO 검토 후 직접 게시. Claude는 대리 게시 불가. · 2026-04-22 22:20 KST*
