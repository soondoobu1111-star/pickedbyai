# Reddit r/ChatGPT 포스트 — 2026-04-16

---

## 제목
```
I typed my own product into ChatGPT. It recommended my 5 competitors instead.
```

---

## 본문 (Reddit 마크다운)

Late night. Laptop. Bad idea.

I typed my own product name into ChatGPT and asked: *"What are the best tools for checking AI visibility?"*

It confidently gave me a list of 5 competitors.

Mine wasn't on it.

I stared at the screen for a solid 10 seconds. Then I tried rephrasing. Then I tried being more specific. Then I tried just... typing my product name directly and asking if ChatGPT had heard of it.

**It had not.**

Here's the thing — I have Google rankings. Real users. Backlinks. The site isn't invisible. But to ChatGPT, I simply do not exist as a recommendation-worthy product. My competitors — some of which charge more and do less — were being confidently recommended to anyone who asked.

That felt personal.

---

So I went down a rabbit hole trying to understand how ChatGPT actually *learns* what products to recommend. And I found out it's not SEO. It's not even close.

ChatGPT's recommendations come from what it saw during training: forum discussions, "best of" roundups, review sites, community mentions. If nobody wrote about you in those places before the training cutoff — you're a ghost.

I had none of that. I had a website and a dream.

---

I ended up building a tool to measure this (AI Visibility Score, 0–100) and ran it on myself.

**12 out of 100.**

For reference:
- Figma → 100
- Notion → 95
- Some random Notion template with decent SEO → 70
- Me → **12**

The most painful dimension was **Recommendation Signals: 0/20** — that's whether "best of" articles mention you. Exactly the content ChatGPT uses for recommendations. I had written zero of it and nobody had written it about me either.

Cool cool cool.

---

So I spent the next 11 days doing the unglamorous stuff.

13 blog posts. Directory submissions. A Reddit thread that got 5K views. Some `llms.txt` stuff that I'm still not sure actually matters.

Score went from **12 → 32.**

Perplexity now recognizes us 8 out of 10 times. That part felt genuinely good.

ChatGPT? Still nothing. Turns out training cutoffs are real and brutal — even if you become famous tomorrow, GPT won't know for months.

---

Anyway. Curious if anyone else has gone down this rabbit hole or noticed the same gap between "Google knows me" and "AI has no idea I exist."

*(Checker is free, no account — [pickedby.ai](https://pickedby.ai). Fair warning: it might ruin your evening. Also onboarding 100 founders into beta if you want to track this over time — first 100 get lifetime free access.)*

---

## 게시 가이드
- Group/Flair: 없음 (일반 포스트)
- 계정: u/perceptdot
- 주의: 규칙 3 — ChatGPT 직접 관련 콘텐츠로 포지셔닝 (광고 아님)
- 댓글 전략: "어떻게 측정했냐" 질문 오면 도구 설명 자연스럽게 / 방어 금지
