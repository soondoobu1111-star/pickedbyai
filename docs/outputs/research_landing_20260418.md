# 랜딩 페이지 리서치 & 개선안 — 2026-04-18

**요청**: CEO — "현재 메인 페이지가 최초 방문자에게 효과적인지 모르겠다. FAQ 너무 길다. MLP 끌어오는가? 기술보다 혜택 직관 전달. 리텐션 훅 있었으면."
**작업자**: CPO/PO (데스크탑 Claude, 15:50~17:00 KST)
**방법**: 3개 병렬 에이전트 웹 리서치 + 현재 index.html 전수 진단

---

## 📊 Executive Summary

| 카테고리 | 현황 | 경쟁 평균 | 판정 |
|---------|------|---------|------|
| FAQ 개수 | **17개** | Otterly 8 / Profound 0 / Peec 0 / Linear 0 / Vercel 0 / Stripe 0 | 🔴 3~∞배 과잉 |
| 주요 섹션 수 | **10개** | Linear/Vercel/Stripe 3~4개 | 🔴 2.5배 과잉 |
| Hero 훅 | CTA 클릭 → 외부 페이지 이동 | Plausible/Fathom = **live demo dashboard 즉시 노출** | 🔴 치명적 공백 |
| 빅파이 1.5 반영 | 5차원/Notion 70/Claude 엔진 | N/A | 🔴 전면 미반영 |
| 리텐션 훅 | 0개 | Fathom = 이메일 리포트 / Duolingo = 스트릭 / Notion = 커뮤니티 | 🔴 전무 |

**결론**: 랜딩 페이지가 **"tour"** (여러 섹션을 보여주는) 형태. 업계 승자는 모두 **"one hook + proof"** 형태. **전면 리뉴얼이 마케팅 재개 게이트의 조건**.

---

## 🔍 Part 1 — 레퍼런스 리서치 결과

### Group A · 직접 경쟁사 (Otterly / Profound / Peec)

| 사이트 | Hero H1 | Primary Hook | FAQ | Retention |
|--------|---------|-------------|-----|-----------|
| Otterly.ai | "We otter know where your brand shows up on AI Search" | Free GEO tools page (6+ utilities) + Adidas sample dashboard | 8-9 | 14-day trial + GEO email course |
| Profound | "Marketing agents to win in" | Interactive AEO FAQ Generator + free AEO brand report (email gate) | 0 | Zero Click 2026 conference |
| Peec.ai | "AI search analytics for marketing teams" | AI-suggested prompts (gated) | 0 | MCP Challenge $5K community prize |

**핵심 발견**:
- **3개 모두 tool을 gate함** — "Book a Demo" 중심
- **self-serve instant value에 공백 존재** → pickedby.ai의 차별화 기회
- **Otterly만 free-tools 페이지 운영** (top-funnel hook) — 우리도 유사 전략 필요

### Group B · B2B SaaS 마스터 (Linear / Vercel / Stripe)

| 원칙 | Linear | Vercel | Stripe |
|------|--------|--------|--------|
| H1 | "The product development system for teams and agents" | "Build and deploy on the AI Cloud." | "Financial infrastructure to grow your revenue." |
| 5초 아하 | Live agent working ENG-2703 | "7m → 40s for Runway" | "from first transaction to your billionth" |
| CTA | "Get started" (1단어) | "Deploy" (1단어) | "Get started" + "Sign up with Google" |
| FAQ | 0 | 0 | 0 |

**3가지 보편 원칙** (모두 공유):
1. **No FAQ above the fold — proof replaces doubt** (모두 FAQ accordion 없음, 대신 정량 proof)
2. **One concrete specific hook beats a feature grid** (한 가지 생생한 구체가 feature matrix를 이김)
3. **Primary CTA: short, low-commitment, repeated** (1-2 단어 반복)

### Group C · 리텐션/애널리틱스 (Plausible / Fathom / Duolingo / Notion)

| 사이트 | 공식 |
|--------|------|
| **Plausible** | 🏆 **공개 라이브 데모 대시보드 (plausible.io/plausible.io)** — 폼 없음, 이메일 없음, 즉시 작동 제품 보여줌 |
| **Fathom** | "Weekly/monthly email reports so you keep track without logging in" = **이메일 리포트를 제품화** (낮은 touch, 지속 가치) |
| **Duolingo** | 변수 보상 + 손실 회피: 스트릭 + XP + Duo 마스코트 (감정) → 인물을 위해 돌아옴 |
| **Notion** | Use-case 캐러셀 4개 구체 작업 + "Forbes Cloud 100 98%" 권위 → 워크스페이스 lock-in |

**애널리틱스 카테고리 공통 공식** (Plausible + Fathom):
> **"One click, zero auth, real data"** — 퍼블릭 라이브 데모 대시보드 + "No credit card" 문구 + 실 숫자 (17k subs / 260B pageviews)

**습관 형성 공통 공식** (Duolingo + Notion):
- Duolingo: 감정적 게이미피케이션 (mascot + streak)
- Notion: 워크플로우 투자 (템플릿 + 커뮤니티)

---

## 🩺 Part 2 — 현재 index.html 진단 (7대 문제)

### 🔴 P0 — 훅 부재 (치명적)
- Hero CTA `"CHECK MY SCORE FREE ▶▶"` 클릭 → `/dashboard.html` 페이지 이동
- **5초 내 가치 경험 실패** (2-click 필요)
- Plausible/Fathom 공식 미적용: live demo, 실시간 입력창, 즉시 결과 없음

### 🔴 P0 — 빅파이 1.5 전면 미반영 (치명적)
- `<meta description>`: "ChatGPT, Claude, and Perplexity" → **실제 서비스는 Perplexity + Gemini** (Claude 없음)
- `schema.org featureList`: 5차원 표시 (Web Presence/Source Authority/Recommendation Signals/Community Validation/Competitive Context) → **4차원 (Recognition 35/Category 35/CoRec 20/Web 10) 미반영**
- Demo Panel 3개: 5차원 점수 / Notion 70점(구식) / "We scored 12"(Day 0 값)
- AI Vitals: "AI PRESENCE / RANK / GROUNDED" 3차원 → 4차원 체계와 불일치

### 🟡 P1 — FAQ 과잉 (17개)
- 업계 비교: Linear/Vercel/Stripe = **0개**, Otterly = **8-9개**, Profound/Peec = **0개**
- Q11 "Who is pickedby.ai for?" / Q14 "Is this just for creators?" → **방어적 질문**. v2.0 마케팅 "전체 AI 경제" 포지셔닝과 충돌
- Q15 "What's coming next?" → 로드맵 섹션과 중복

### 🟡 P1 — 섹션 과잉 (10개 섹션)
현재: Hero → Roadmap → Social Proof → Powered By → VS Row → Score Spectrum → Query Ticker → AI Vitals → How It Works → Under The Hood → Demo → FAQ → Badge → Footer (14개)
마스터 평균: 3~4개 섹션 (Hero + 1-2 proof + CTA)

### 🟡 P1 — Social Proof 약함
- 현재: "5 dimensions / ~10s / 2 probes" = **제품 스펙**, social proof 아님
- 미활용 자산: 베타 100명 SOLD OUT, 블로그 13편, 첫 외부 유저, IH/Reddit 게시
- Badge 3개만 (FoundrList/Dang.ai/본인) vs Otterly 20+ 로고

### 🟢 P2 — 리텐션 훅 전무
- 뉴스레터 CTA 없음 (Fathom 공식 놓침)
- Changelog 미노출 (Linear/Vercel 방식 놓침)
- 커뮤니티 링크 없음 (Discord/Slack 없음 — 아예 없어도 blog/manifesto는 유도 가능)
- 재방문 이유 0개

### 🟢 P2 — MLP 미연결
빅파이 1.5 MLP 훅 7개 (Daily Pulse / 3탭 차트 / Movement Feed / Action Items / Streak / Milestones / Weekly Email) 중 **랜딩에서 소개되는 것 0개** → 로그인 전 방문자는 대시보드 가치를 모름

---

## 💡 Part 3 — 개선 설계 (8 Shift)

### ✨ Shift 1 — Hero: Live Widget 전환 (최우선)

**Before:**
```
eyebrow: ▶ Free AI Visibility Check
h1:      The AI Visibility Platform
sub:     Search Console, Analytics, and (soon) Ads — for the AI era.
CTA:     CHECK MY SCORE FREE ▶▶  (→ /dashboard.html 이동)
```

**After (Plausible + Vercel 공식):**
```
eyebrow:  Try it now — no signup, no credit card
h1:       Does ChatGPT recommend your product?
sub:      Enter your domain. Get your AI Visibility Score in 10 seconds.

┌─────────────────────────────────────┐
│  [ yourproduct.com      ] [ Score ] │ ← 인라인 입력+실행
└─────────────────────────────────────┘
       ↓ 결과가 즉시 하단에 렌더링
       
proof:    Notion scored 89. pickedby.ai scored 42 on Day 12.
          Live result updates below ↓
```

### ✨ Shift 2 — 섹션 대폭 축소 (14 → 5)

**삭제 대상 (7개):**
- Roadmap Diagram → `/methodology`로 이동
- Powered By → 결과 카드 내부에 표시
- VS Row → 중복, 제거
- Score Spectrum → 결과 카드에 자동 포함
- AI Query Ticker → 제거 (산만)
- AI Vitals (Presence/Rank/Grounded) → 4차원 결과로 대체
- Under The Hood → `/methodology`로 이동

**최종 구조 (5섹션):**
1. **Hero + Live Widget** (즉시 가치)
2. **Demo Results 3개** (빅파이 1.5 4차원 반영, 실시간 비교)
3. **Social Proof** (베타 100 SOLD OUT + 로고 + 숫자)
4. **MLP Preview** (Dashboard Shell 스크린샷 + 훅 3개 미리보기)
5. **FAQ 5개 + /faq 링크** + Newsletter CTA + Footer

### ✨ Shift 3 — FAQ 17 → 5 (대표 Q만 유지, 나머지 `/faq`로 분리)

**유지 (5개, 짧게 재작성):**
- Q1 "What is pickedby.ai?" (50자 이내)
- Q4 "Is it really free?"
- Q9 "How do I improve my score?"
- Q13 "Is my data safe?"
- Q17 "How to contact?"

**`/faq`로 분리 (12개):** Q2-3, Q5-8, Q10-12, Q14-16

### ✨ Shift 4 — 빅파이 1.5 전면 반영

**수정 파일:**
- `<meta description>`: "Perplexity + Gemini" (Claude 삭제)
- `schema.org featureList`: 4차원 (Recognition/Category/CoRec/Web) 업데이트
- Demo Panel 재측정: Notion 85+ / pickedby.ai 42 or 재측정값
- AI Vitals → 4차원 Breakdown (Recognition 35 / Category 35 / CoRec 20 / Web 10)

### ✨ Shift 5 — Social Proof 실화 (실제 숫자로)

```
Before: 5 dimensions / ~10s / 2 probes
After:  100 / 100 Beta SOLD OUT · 13 blog posts · Day 42 · Powered by Gemini + Perplexity
```

+ Footer 위 로고 라인: "Checked by creators from Notion, Figma, Obsidian communities" (실측 기반)

### ✨ Shift 6 — Retention Hook 3종 추가

1. **Dashboard Preview 섹션** (MLP 시연)
   - Dashboard Shell 스크린샷 1장
   - 옆에 3개 불릿: "Daily Pulse ✦ Streak tracking ✦ Weekly email"
   - CTA: "Claim your domain to unlock"

2. **Newsletter CTA** (Fathom 공식)
   - "Get a weekly AI visibility report for your domain"
   - 이메일 입력 + 구독 버튼 (Phase 3 Brevo 연결)

3. **Changelog Teaser** (Linear/Vercel 공식)
   - Footer 위 "Built this week" 3줄
   - 최근 3개 빌드 항목 + `/changelog` 링크 (신규 페이지)

### ✨ Shift 7 — CTA 최적화

**Before:** `"CHECK MY SCORE FREE ▶▶"` (4단어 + 이모지, 1회 노출)

**After (마스터 공식 — 짧고 반복):**
- Hero: `"Score my domain"` (inline widget 버튼)
- Demo 하단: `"Try yours"`
- Footer 근처: `"Claim your domain"` (회원가입 유도)

### ✨ Shift 8 — 모바일 우선

- 현재 데스크탑 기준 설계 → 하단 탭바 없음, Hero 입력창 폭 문제 가능
- Shift 1 Live Widget = 모바일에서 **FullScreen Input** 모드 (탭하면 키보드 즉시)

---

## 🎯 Part 4 — 예상 효과

| KPI | Before (추정) | After (목표) | 근거 |
|-----|--------------|-------------|------|
| Hero → 첫 스캔 완료율 | ~5% (2-click + 페이지 이동) | 35%+ (inline widget) | Plausible/Fathom 업계 평균 |
| 평균 체류 시간 | ~45s (10 섹션 훑기) | 90s+ (스캔 후 결과 탐색) | 실제 인터랙션 증가 |
| Newsletter 전환 | 0% (CTA 없음) | 8-12% | Fathom 이메일 리포트 모델 |
| 모바일 이탈률 | 70%+ (추정) | 40% 이하 | Mobile-first Hero |
| SEO: 체류+인터랙션 | 약함 | 강함 | Google E-E-A-T 신호 강화 |

---

## 📋 Part 5 — CEO 승인된 계획과의 통합 판단

### 🟢 통합 가능 — D9 범위 확대 (추천)

**승인된 Wave 1 계획:**
- D4 Shell 통합 (04-19~20) — 대시보드만 해당, 랜딩 영향 없음
- D9 SITE-REFRESH-01 (04-26) — 사이트 홈·FAQ 최신화 + methodology 신규

**제안:** D9 범위를 **"기존 홈 최신화"** → **"전면 리뉴얼"**로 확대

| D9 Before | D9 After |
|-----------|----------|
| index.html 일부 최신화 | 8 Shift 전면 구현 |
| FAQ 최신화 | FAQ 17→5 + /faq 페이지 신설 |
| methodology 신규 | methodology + /changelog 신규 |
| ~4h 작업 | ~8h 작업 (D9+D9.5 = 04-26~27) |

### 🟡 대안 — 스프린트 외 Wave 4 추가

- D12~D13 (04-29~30) 별도 일정 추가
- D11 QA 통과 후 랜딩 리뉴얼
- 스프린트 2일 연장

### 🔴 연기 — 마케팅 재개 후 Phase 2로 이월

- 마케팅 재개(04-20) **전** 랜딩 리뉴얼 못함 → 구식 랜딩으로 트래픽 수용
- 모두의 창업 지원서(05-07) **전** 완료 불확실
- ❌ **비추천**

---

## ❓ Part 6 — CEO 결정 필요 사항

### 결정 1: 범위 확대 옵션
- [ ] **A안 — D9 범위 확대** (04-26~27, 스프린트 내 흡수, 추천)
- [ ] **B안 — Wave 4 신설** (04-29~30, 2일 연장)
- [ ] **C안 — Phase 2 이월** (비추천)

### 결정 2: Shift 우선순위
- [ ] **전부 8개 실행** (권장)
- [ ] **P0만 5개 실행** (Shift 1-5, 훅+빅파이반영+섹션축소+FAQ+Social Proof)
- [ ] **P0 중 핵심 3개만** (Shift 1/2/4 — Hero Widget + 섹션축소 + 빅파이반영)

### 결정 3: 기존 승인 계획과의 관계
- [ ] 기존 Wave 1~3 + 본 리뉴얼 **병렬** (D9 확대 방식)
- [ ] 기존 Wave 1 완료 후 **순차** (UI-SHELL-INTEGRATE-01 우선)

### 결정 4: 추가 승인 요청
- [ ] `/faq` 별도 페이지 신설 (신규 파일 1개 — CLAUDE.md 규칙상 신규 페이지는 승인 필요)
- [ ] `/changelog` 별도 페이지 신설 (신규 파일 1개)

---

## 📎 레퍼런스 소스

- Otterly.ai, tryprofound.com, peec.ai — 직접 경쟁사
- linear.app, vercel.com, stripe.com — B2B SaaS 마스터
- plausible.io, usefathom.com — 애널리틱스 카테고리
- duolingo.com, notion.com — 리텐션 훅 마스터

**원본 에이전트 리포트 저장 위치:** `/private/tmp/claude-501/-Volumes-.../tasks/` (세션 임시)

---

*작성: CPO/PO · 2026-04-18 17:00 KST · 데스크탑 Claude*
*다음 단계: CEO 4개 결정 사항 승인 → 작업 분기 실행*
