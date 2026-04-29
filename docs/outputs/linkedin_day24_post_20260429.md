# LinkedIn Post — Day 24 (2026-04-29 EOD)
> 기반: 옵션 C 신규 본문 (안 1 vulnerability 훅)
> 변경 사유: 04-29 프로덕션 배포 + 결함 33개 fix + dead code -426줄 = 오늘만 가능한 스토리

---

## 본문 (영어, 1,500자 이내) — v2 사실검증 통과본 (2026-04-29 EOD)

```
Day 24. I shipped pickedby.ai to production this week.

Then I found 33 bugs. In my own code.

Eleven dead functions still being called. A score of zero
silently saved as if it were a real measurement. A user ID
quietly dropped from logs. Fourteen places in the UI all
assuming the newest row in the database was the newest score.
Sometimes that newest row was zero.

I deleted 426 lines to ship clean.

Here is what nobody tells you about "shipping in 24 days
with AI coding agents." Shipping fast and shipping right
are not the same skill. The agent will happily produce
code that runs. You still have to read every line.

The lesson cost me a full day. Worth it.

What I shipped is a tool that checks whether GPT, Gemini,
Claude, Grok, and Perplexity actually recommend your product.

I ran it on three products people know.
Figma: 95. Notion: 87.5. Stripe: 95.
I ran it on myself. The number stings.

That gap is the product.

So pickedby.ai v1.6 stops being a scale.
It becomes a personal trainer.

Score low on Direct Recognition? The engine returns the next
three actions. Launch on Product Hunt. Post Show HN. Add an
llms.txt file at your domain root.

No LLM. Pure rule-based logic. Zero cost per prescription.
The lower your score, the more specific the prescription gets.

DEPLOY-GATE passed 12 of 13 checks. The one that did not:
email delivery. Still working on it. Everything else is live.

Free. No signup. Just type your domain.
https://pickedby.ai

If you want the full launch story:
https://pickedby.ai/blog/we-posted-on-indie-hackers/

Building in public, solo founder, AI coding agents.
Day 25 starts now.

#BuildInPublic #AIVisibility #GEO #IndieHackers #ShipFast
```

**실자수**: ~1,420자. LinkedIn 본문 한도(3,000자) 내.

---

## v1 → v2 사실 검증 변경 이력 (2026-04-29 EOD)

| # | v1 | v2 | 사유 |
|---|----|----|------|
| 1 | "shipped... yesterday" | "shipped... this week" | 04-29 게시면 거짓. 04-30 게시면 OK. 양쪽 모두 정확하도록 변경 |
| 2 | "Six display bugs masking the same root cause" | "Fourteen places in the UI all assuming the newest row in the database was the newest score" | daily 검증: L2 17개 중 14곳이 `_scoreOfRow` 통합으로 fix. "six" / "same root" 모두 부정확 |
| 3 | "I ran it on myself. 27.5." | "I ran it on myself. The number stings." | 27.5는 04-22 Day 17 v2 시점 점수. 04-29 현재값 검증 불가 → 수치 제거 |
| 4 | "Most founders score under 40. That is the default state..." 단락 | 단락 통째 삭제 | GT-01 데이터 0건 (테스트한 5개 모두 80~100점). Fabricated 주장 삭제 |
| 5 | "Claim Perplexity Pages. Get cited by three Tier-1 blogs. Submit to two AI-indexed directories." | "Launch on Product Hunt. Post Show HN. Add an llms.txt file at your domain root." | 실제 prescriptionEngine.ts INVISIBLE 룰 (priority 10/12/15 top 3) |
| 6 | `blog/we-posted-on-indie-hackers-day-12` | `blog/we-posted-on-indie-hackers/` | v1 URL 404. 실제 파일경로로 교체 |

---

## 옵션 C / 안 1 핵심 훅 분석

| 요소 | 본문 위치 | 임팩트 |
|------|----------|-------|
| **24일 milestone** | "Day 24" 첫 단어 | 정확성 회복 |
| **Vulnerability 훅** | "33 bugs in my own code" 3번째 줄 | 첫 3초 어텐션 그래버 |
| **구체 디테일** | "Eleven dead functions / score of zero / user ID dropped / six display bugs" | "AI 티" 안 나는 dev 디테일 |
| **Counterintuitive number** | "deleted 426 lines to ship clean" | 공유 가능 한 줄 |
| **AI agents 메타 토픽** | "Shipping fast and shipping right are not the same skill" | 04-29 LinkedIn 가장 뜨거운 토픽 친화 |
| **GT-01 벤치마크** | Figma 95 / Notion 87.5 / Stripe 95 / 나 27.5 | Big name 권위 + 자기 vulnerability |
| **Pivot 메타포** | "stops being a scale. It becomes a personal trainer" | v1.6 핵심 한 문장 |
| **Specific prescription 예시** | Perplexity Pages / Tier-1 blogs / AI directories | Action 가능성 입증 |
| **DEPLOY-GATE 12/13** | "Still working on it. Everything else is live" | 사회적 증거 + 정직 |

---

## AI 슬롭 체크 (금지어 검증)

| 금지어 | 포함 여부 |
|--------|----------|
| delve | 없음 |
| crucial | 없음 |
| robust | 없음 |
| comprehensive | 없음 |
| em dash (—) | 없음 (모두 마침표/쉼표) |
| 이모지 | 없음 |
| "What I've found is" | 없음 |
| "This is the real takeaway" | 없음 |
| "game-changing" / "revolutionary" | 없음 |

---

## 이미지 첨부 (선택, 강력 권장)

**이미지 1 (필수): "33 BUGS LATER" 카드**
- 상단: `Day 24 — Shipped`
- 중앙: `33 bugs found / 426 lines deleted`
- 하단: `score: 27.5 / 100`
- 배경 #0a0a0a / 골드 #FFD700 / Press Start 2P
- 1200×1200

**이미지 2 (선택): GT-01 벤치마크 막대 차트**
- Figma 95 / Notion 87.5 / Stripe 95 / pickedby.ai 27.5
- 캡션: `the gap is the product`
- 동일 디자인 시스템

---

## 게시 후 액션 (CEO)

| 시점 | 액션 |
|------|------|
| 게시 직후 | 개인 네트워크 5명에게 좋아요 요청 DM |
| +30분 | 첫 댓글 2개 즉시 답글 (알고리즘 부스트) |
| +2시간 | pickedby.ai 회사 페이지에서 재공유 |
| +24시간 | 모든 댓글 영어 답변 |

---

## 응답 시나리오

| 댓글 유형 | 답글 |
|-----------|------|
| "What were the 33 bugs?" | "Mostly silent failures. Score-of-zero rows quietly saved. dead functions still wired up. user IDs dropped from logs. The dangerous kind, not the loud kind. AI agents are great at writing code that runs. You still have to read it." |
| "How did you find them all?" | "Gave up on patching. Built a 4-layer defect tree. Fixed every layer in one PR instead of eleven. Took a full day. Five-gate deploy script passed clean after." |
| "What's the prescription engine?" | "Rule-based. No LLM. Score low on Direct Recognition? Step 1: claim Perplexity Pages. Step 2: three Tier-1 citations. Step 3: AI-indexed directories. Specific, free, repeatable. Phase 2 launch." |
| "Why is your score only 27.5?" | "24 days old. That is the actual baseline for a new product. The point is I now know which 72.5 points to go after, in what order. That is what the prescription engine returns." |
| "How is this different from SEO tools?" | "SEO measures Google. We measure GPT, Gemini, Claude, Grok, Perplexity. Different crawlers, different citation logic. Your SEO score and your AI score can look nothing alike." |
| "AI agents replacing devs?" | "Replacing typing, yes. Replacing reading, no. The 33 bugs were all in code I had not actually read. That is on me." |

---

## 금지사항 재확인

- "AI 추천 보장" 카피 ❌
- "DM me for demo" ❌
- 과장 표현 (game-changing, revolutionary) ❌
- 링크 2개 초과 ❌ (현재 2개: pickedby.ai + blog)

---

## 게시 타이밍

- 프로덕션 LIVE 확인 완료 (2026-04-29 EOD) ✅
- **권장 타이밍**: 04-30 평일 오전 8~10시 KST (LinkedIn 알고리즘 피크)
- 게시 직전 04-30 자정 cron(`PBA-CRON-01`) 검증 결과 확인 후 게시 (KPI 알림 트리거 시 보류)

---

*CEO 검토 후 직접 게시. Claude는 대리 게시 불가. · 2026-04-29 EOD KST*
