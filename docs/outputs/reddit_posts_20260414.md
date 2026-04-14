# Reddit 테스트 포스트 초안 — IH 전 반응 테스트
> 2026-04-14 | 게시: CEO 직접 | 계정: u/perceptdot (karma 59)

---

## 실행 순서 (안전 → 공격적)

| # | 서브레딧 | 밴위험 | 게시일 | 목적 |
|---|---------|--------|--------|------|
| 1 | r/AlphaAndBetaUsers | 거의 없음 | 4/15 (화) | 직접 도구 소개, 이메일 수집 |
| 2 | r/startups (Share Your Startup) | 낮음 | 4/15 (화) | 스타트업 커뮤니티 반응 |
| 3 | r/NotionTemplates | 낮음 | 4/15 (화) | 타겟 크리에이터 직접 접근 |
| 4 | r/InternetIsBeautiful | 중간 | 4/16 (수) | 대규모 노출 (17M 구독자) |
| 5 | r/SEO | 높음(간접) | 4/17 (목) | GEO 토론 → 간접 언급 |

---

## Post 1: r/AlphaAndBetaUsers (직접 홍보 100% 허용)

**Title:**
```
[Free Tool] Check if ChatGPT and Perplexity recommend your product — AI Visibility Score in 10 seconds
```

**Body:**
```
Hey everyone,

I'm a solo founder building pickedby.ai — a free tool that checks if AI chatbots know about and recommend your product.

**How it works:**
Enter any product name → get an AI Visibility Score (0-100) in 10 seconds. No signup needed.

It checks 5 things:
- Are you mentioned on the web?
- Do high-authority sites cover you?
- Are you in "best of" lists?
- Do real communities discuss you?
- How do you compare to competitors?

Plus it directly asks ChatGPT and Perplexity: "Do you know this product?"

**Why I built it:**
I typed my own product into ChatGPT and it had no idea it existed. Looked for a tool to check — found 24 enterprise tools ($300+/month). Nothing for indie creators. So I built one.

**What I need:**
- Try it: https://pickedby.ai (free, no signup)
- Tell me: Was the score accurate? Was it useful?
- If you leave your email on the result page, you'll get the full breakdown in your inbox.

Brutally honest feedback welcome. This is day 10 and I have zero paying customers, so I need to know if this solves a real problem or not.
```

---

## Post 2: r/startups (Share Your Startup 스레드 댓글)

```
**pickedby.ai** — Free AI Visibility Score for digital creators

Does ChatGPT recommend your product? Enter any product name → score (0-100) in 10 seconds. No signup.

Built by solo founder + AI coding agents in 10 days. Zero funding. Targeting Gumroad/Etsy/Notion creators who don't know they're invisible to AI search.

Day 10 update: 0 paying customers. Good product, wrong channels. Now testing if the problem resonates with actual creators.

https://pickedby.ai
```

---

## Post 3: r/NotionTemplates (타겟 크리에이터 직접 접근)

**Title:**
```
I checked if ChatGPT recommends popular Notion templates — most are completely invisible to AI
```

**Body:**
```
I've been researching how AI chatbots (ChatGPT, Perplexity) recommend products when people ask "what's the best Notion template for X?"

Tested a bunch of templates:
- Well-known ones with strong web presence → Score 60-70+
- Great templates with only Notion marketplace listings → Score 5-20
- Brand new templates → Score 0

The pattern: AI recommends products it can find mentioned across multiple independent sources (blogs, reviews, roundups). Just being on the Notion marketplace isn't enough.

37% of people now start product searches in AI tools instead of Google. If ChatGPT doesn't know your template exists, that's a growing chunk of potential buyers you're missing.

I built a free tool to check this: pickedby.ai — enter your template name, get a score in 10 seconds. No signup.

Has anyone else noticed AI search affecting their template sales? Curious if this is something Notion creators are thinking about.
```

---

## Post 4: r/InternetIsBeautiful (대규모 노출)

**Title:**
```
I built a free tool that shows if ChatGPT and Perplexity recommend your product
```

**Body:**
```
https://pickedby.ai

Enter any product name → get an AI Visibility Score (0-100) in 10 seconds.

It checks if AI chatbots know about your product and would recommend it when someone asks. No signup required, completely free.

Some interesting findings:
- Figma → 100/100 (every AI recommends it)
- A random well-SEO'd Notion template → 70/100
- Most small digital products → under 25/100

37% of people now start searches in AI instead of Google, so if AI doesn't know about you, you're invisible to a growing audience.

Built as a solo founder with AI coding agents in 10 days.
```

---

## Post 5: r/SEO (간접 접근 — 토론형, 링크 없음)

**Title:**
```
GEO (Generative Engine Optimization) — is anyone actually tracking their AI visibility?
```

**Body:**
```
With 37% of searches now starting in AI tools, I've been digging into how ChatGPT and Perplexity decide which products/tools to recommend.

Some patterns I've noticed:
1. **Multiple independent mentions matter** — being on just your own site isn't enough
2. **"Best of" roundup articles** are heavily weighted
3. **Community discussions** (Reddit, forums) seem to influence AI recommendations
4. **Comparison content** ("X vs Y") boosts visibility significantly

For context, I've been scoring products on 5 dimensions (web presence, source authority, recommendation signals, community validation, competitive context) and the gap between "AI knows you" and "AI has no idea" is massive.

Questions for the SEO community:
- Are any of you actively optimizing for AI recommendation engines?
- Have you seen AI referral traffic in your analytics yet?
- What's your take on GEO vs traditional SEO prioritization?

Would love to hear from people who are actually tracking this.
```

**(댓글에서 누군가 "어떻게 측정해?" 물으면 → pickedby.ai 자연스럽게 언급)**

---

## 게시 전 체크리스트 (CEO용)

- [ ] 각 서브레딧 사이드바 규칙 최종 확인 (규칙 수시 변경)
- [ ] 게시 시간: 한국 시간 밤 9-11시 (미국 동부 오전 8-10시)
- [ ] 게시 후 1시간 내 모든 댓글 응대
- [ ] 링크 클릭 추적: GA4에서 reddit referral 확인
- [ ] 이메일 수집 확인: Supabase emails 테이블 모니터링

## 댓글 응대 규칙

- 긍정 → "감사 + 체크해볼까요?" 제안
- 부정 → "맞는 말입니다. 어떻게 바꾸면 좋을까요?" (방어 금지)
- "어떻게 만들었어?" → "Claude Code로. 코딩 0. 솔로 파운더"
- "왜 무료야?" → "아직 검증 단계. 진짜 도움이 되는지 확인 중"
- 제품명 드롭 → 직접 체크해서 스크린샷으로 답변
