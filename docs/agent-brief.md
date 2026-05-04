# pickedby.ai — Agent Brief (외부 AI 에이전트 종합 브리프)
> 작성: 2026-05-04 | 작성자: CPO | 갱신 주기: 주 1회 또는 주요 결정 시
> **목적**: 외부 AI 에이전트(ChatGPT/Gemini/Claude/Grok/Perplexity 등)가 이 문서 하나로 pickedby.ai의 정체성·현재·맥락을 동기화하기 위함.
> **민감 정보 제외**: 점수 계산식 세부 로직, API 키, 코드 내부 구조, 프롬프트 엔지니어링 디테일.

---

## 0. 한 문장 정의

> **"AI 추천 시대의 성장 코치 — 5대 AI(GPT·Gemini·Claude·Grok·Perplexity)가 내 제품·콘텐츠를 추천하는지 측정하고, 왜 안 되는지 진단하고, 어떻게 하면 되는지 처방하는 플랫폼."**

체중계가 아닌 퍼스널 트레이너. 점수가 낮을수록 우리 서비스의 가치가 높아진다.

---

## 1. 정체성 (Who we are)

| 항목 | 내용 |
|------|------|
| 서비스명 | **pickedby.ai** (항상 소문자, 띄어쓰기 없음, `.ai` TLD 일체형) |
| 회사명 | THUNOVA (대문자) |
| 도메인 | https://pickedby.ai |
| 태그라인 | "Get Picked by AI" |
| 카테고리 | AI Visibility Platform / GEO (Generative Engine Optimization) / AEO (Answer Engine Optimization) |
| 비전 | "The Google Stack for AI Recommendations" — Search Console + GA4 + Ads의 AI 추천 시대 버전 |
| 팀 구조 | **1인 창업자 (CEO/Founder, Sorina Lee) + AI 에이전트 (CPO·Dev·Growth·QA 역할)** |
| 운영국 | 대한민국 (성수, 용인) — 글로벌 영문 서비스 |
| 시작일 | 2026-03 (사업자 등록 THUNOVA), 본격 개발 2026-04~ |

---

## 2. 무엇을 해결하는가 (Problem · Why now)

### 2.1 시장 변화 (2024~2026)
- **AI 레퍼럴 트래픽 +527% YoY** (Semrush 2025)
- **Claude 전환율 16.8%** (구글 검색 1.76~2.8% 대비 ~10배)
- **ChatGPT 일일 쇼핑 쿼리 5,000만 건**
- **70%의 디지털 제품이 Product 스키마 없음** → AI 답변에서 보이지 않음
- GEO/AEO 도구 시장 **CAGR 40.6%**, 2034년 $171.5억 전망

### 2.2 진짜 문제
GPT/Gemini/Claude/Grok/Perplexity가 추천 채널의 핵심으로 자리잡았으나, **Gumroad 셀러·Notion 템플릿 작가·1인 SaaS·블로거·뉴스레터 운영자**는 자기 제품/콘텐츠가 AI 답변에 추천되는지 **확인 방법도, 최적화 방법도 모른다**.

### 2.3 시장 갭
GEO/AEO 도구 24개를 직접 전수 조사한 결과: **크리에이터·콘텐츠·1인 SaaS를 동시에 포괄하는 플랫폼은 전 세계에 0개**. 모두 엔터프라이즈/마케터/SEO팀 타겟.

---

## 3. 무엇을 만드는가 (What we build)

### 3.1 핵심 사용자 흐름 (Phase 1 — 라이브)
1. **10초 무료 측정**: URL 또는 제품명 입력 → 가입 불필요 → 즉각 4차원 스코어
2. **배지 발급**: Pass Indicator (PERFECT/STRONG/EMERGING/INVISIBLE) + Gold/Silver/Bronze 배지
3. **대시보드**: 가입 시 일일 자동 측정 + Trend(30일) + Journey(Hero's Arc) + Volume(probe_logs 7지표)
4. **Daily Pulse 이메일**: cron KST 00:00 자동 측정 → 한 줄 변화 메시지

### 3.2 Phase 2 — 진행 중 (빅파이 1.6 Growth Loop)
**6-Stage Growth Loop**: Measure → **Diagnose** → **Prescribe** → **Track** → **Reward** → **Viral** → Organic

- **Diagnose**: "Gemini가 당신을 모릅니다 / 경쟁사 X가 대신 추천됩니다" — 4차원 분해 진단
- **Prescribe**: "PH에 런치하세요(+15점 예상) / Reddit r/SaaS 댓글 5개(+8점) / llms.txt 추가(+5점)" — 우선순위·난이도·예상 효과 포함
- **Track**: "처방 이행 ✓" → 다음 체크 시 "+12점! 효과 확인"
- **Reward**: Milestones 배지 10종 + Streak
- **Viral**: "3주만에 27→68!" 1-click 공유 카드 → LinkedIn/Reddit/Twitter
- **Organic**: 친구 가입 → Loop 재시작

### 3.3 측정 지표 (공개 가능 수준)
- **점수**: 0-100 (Recognition + Category + CoRec + Web 4차원, 합 100. 세부 가중치는 비공개)
- **Pass Tier**: PERFECT 81+ / STRONG 61-80 / EMERGING 36-60 / INVISIBLE 0-35
- **Volume Metrics**: probe_logs 기반 7지표 (mentions, citations, sources, co-recommendations 등) — 점수(상대) + 볼륨(절대) 이원 진단
- **AI 커버**: 무료/Creator = 2엔진(Gemini+Perplexity) / Pro·Agency = 5대 AI 전체

---

## 4. 누구를 위한 서비스인가 (Target — ICP)

### 4.1 1차 타겟 (Phase 1~2, 지금~6개월)
**인디 크리에이터 / 1인 창업자 / Indie Hacker**
- Gumroad·Etsy·Notion 템플릿 셀러
- Substack 뉴스레터 운영자, 개인 블로거, YouTube 채널
- Bootstrapped Micro-SaaS (~10K MRR 이하)
- 1인 founder + AI 에이전트로 운영하는 lean 팀

**왜 이들인가** (CEO 인사이트, 2026-04-29):
> "엔터프라이즈가 많이 쓸 거 같니? 아니. 소상공인들이 많이 쓸 거야. 있는 놈들에게 정보 정리해줘봤자 의미 없다. **가지지 못한 자들에게 처방이 필요하다.**"

| 점수대 | 유저 유형 | 우리 가치 |
|--------|----------|---------|
| 87.5 | Notion (엔터프라이즈) | 대시보드 정리 (낮은 가치) |
| 15~40 | 신생 SaaS | "왜 AI가 날 모르지?" 진단 (높은 가치) |
| 0~20 | 1인 크리에이터 | "뭘 해야 AI가 알게 돼?" 처방 (최고 가치) |

### 4.2 2차 타겟 (Phase 2~3, 6~12개월)
- 부트스트랩 마이크로 SaaS, indie hacker 커뮤니티 (ARPU $19~49)

### 4.3 3차 타겟 (12개월+)
- SMB / SEO Agency (ARPU $99~299, 화이트라벨)

### 4.4 절대 타겟하지 않는 것
- **Enterprise** (Fortune 500급) — Profound($500+) 영역. 시장 래더 침범 금지.

---

## 5. 가격 (Public)

| 플랜 | 가격 | AI 커버 | 포지셔닝 |
|------|------|---------|---------|
| Free | $0 | 2엔진 | 1회 체크, 가입 불필요, 배지 발급 |
| **Founding Creator 100** | **$9/월 평생** | 2엔진 | **베타 선착순 100명** (모두의 창업 "유료 유저" 근거) |
| Creator | $19/월 | 2엔진 | 무제한 체크 + 추이 + Volume + llms.txt + 처방 |
| Pro | $49/월 | **5대 AI 전체** | 경쟁사 추적 + API + 다국어 |
| Agency | $99+/월 | **5대 AI 전체** | 화이트라벨 리포트 + 10 클라이언트 |

**원칙**: 무료 한도 절대 축소 금지. 선점 전엔 돈보다 깔기.
**결제**: Paddle (Phase 2 PAY-PB-01에서 활성)

---

## 6. 차별점 (확정, 번복 불가)

### 6.1 ① 크리에이터·콘텐츠부터 시작하는 유일한 GEO 플랫폼
24개 GEO/AEO 도구 전수 조사 결과, 제품·콘텐츠 둘 다 포괄하는 **유일한** 플랫폼. 경쟁사는 전부 브랜드명 기반(카테고리 개념 부재) + 엔터프라이즈 타겟.

### 6.2 ② 10초 무료, 가입 불필요
입력 → 즉시 결과. 경쟁사 전부 "가입 → 설정 → 대기" 구조.

### 6.3 ③ "안 하면 확실히 안 보인다" 카피 원칙
**AI 추천을 보장하지 않는다.** 하지만 인프라(llms.txt·구조화 데이터·co-recommendation)를 갖추지 않으면 확실히 안 보인다. → SEO가 "1위 보장 못 하는데" $1,070억 시장인 것과 동일 구조.

### 6.4 ④ "체중계 아닌 퍼스널 트레이너" (v1.6 Growth Loop)
경쟁사: 점수만 제공 → 유저 이탈
우리: 점수 + 진단 + 처방 + 효과 추적 + 보상 → Loop 형성

### 6.5 ⑤ "5대 AI 전체 커버" 포지셔닝
경쟁사 다수가 Claude 미지원/특정 AI만 측정. 우리는 5대 AI 전체 = 유일한 전체 시야.

---

## 7. 경쟁 환경 (요약)

| 경쟁사 | 가격 | 타겟 | 우리와 차이 |
|--------|------|------|-----------|
| Otterly AI | $29-989/월 | 마케터/SEO | 기업용 UX, Claude 미지원, 가입 필수. **Gartner Cool Vendor**, 20K+ 유저 |
| Profound | $500+/월 | Fortune 500 | 대기업 전용 |
| trysight.ai | 유료 | SEO/마케터 | "AI Visibility Score" 키워드 SEO 장악 중 🔴 직접 위협 |
| amivisibleonai.com | 무료 | 일반 | 가짜 결과 이슈로 신뢰 낮음 |
| llmclicks.ai | 무료 | 일반 | 단순 체커 |
| amionai.com | 무료 | 일반 | 단순 가시성 진단 |
| Durable Discoverability | 무료 | 로컬 비즈니스 | 배관공/레스토랑 한정 |
| Goodie AI | 유료 | 인디 SaaS | B2B SaaS 한정 |
| Ahrefs / Semrush / HubSpot | 엔터프라이즈 | SEO팀 | 2026-04 AEO 진입 가속 — 우리 차별점=처방, 모트 보존 |

**혁신자의 딜레마**: 기존 경쟁사는 더 높은 마진의 기업/마케터 고객 집중 → 크리에이터 시장에 안 내려옴.

---

## 8. 기술 스택 (공개 가능 수준)

| 레이어 | 기술 | 비고 |
|--------|------|------|
| Frontend | 정적 HTML + Tailwind CDN → CF Pages | 단순·고성능·무료 |
| Backend | TypeScript + Hono → Cloudflare Workers | 글로벌 엣지, 서버리스 |
| DB | Supabase PostgreSQL | RLS 적용 (security_invoker views) |
| AI Probe (베타) | Gemini Relay (무료 티어) + Perplexity API | 월 ~$10 운영비 |
| 웹검색 | Tavily API (Researcher Plan 1,000 크레딧/월) | cron lite 1쿼리 / manual 3쿼리 |
| 이메일 | Brevo (무료 300통/일) | Daily Pulse |
| 결제 | Paddle (Phase 2 활성) | 글로벌 결제 + VAT 자동 |

**월 운영비 ~$10**, 1인 운영 가능한 서버리스 구조.

---

## 9. Moat (방어 자산)

```
Layer 0: Prescription Effectiveness Data — 처방 효과 데이터 (복제 불가, v1.6 핵심)
Layer 1: Score Tracker — 추이 데이터 누적 (전환 비용)
Layer 2: SDK — 코드 심으면 제거 두려움
Layer 3: Creator Graph — 카테고리 벤치마크 (돈으로 못 사는 데이터)

Growth Flywheel:
  측정 → 진단 → 처방 → 실행 → 점수상승 → 공유 → 친구가입 → 측정 ...
  + 처방 효과 데이터 축적 → 더 정확한 처방 → 선순환
```

**진짜 Moat**: probe_logs + prescription_effectiveness DB. 유저가 많을수록 강해지는 데이터 자산.

---

## 10. 마케팅 이력 (싱크 필수 — 솔직하게)

### 10.1 시도한 것 + 결과

| 시점 | 채널 | 활동 | 결과 |
|------|------|------|------|
| 2026-04-06 | Reddit r/SideProject | 런칭 포스트 | **5.3K 뷰** ✅ |
| 2026-04-10 | 제품 | ENGINE-05 AI Probe 배포 (Perplexity+Gemini) | 라이브 |
| 2026-04-13 | 분석 | strategy_20260413_distribution.md (배포 전략) | 문서화 |
| 2026-04-14 | **X/Twitter** | **@pickedbyAI 자동 포스팅 데몬** | 🔴 **계정 영구 정지** |
| 2026-04-14 | Indie Hackers | IH 포스팅 (`ih_post_final_20260414.md`) | 게시 ✅ |
| 2026-04-14~ | Reddit | 인터셉트 댓글 (r/buildinpublic, r/microsaas) | 진행 |
| 2026-04-16 | Reddit r/ChatGPT | 게시 (`reddit_chatgpt_20260416.md`) | 게시 |
| 2026-04-16 | 블로그 | day-12 배포 (Velog @tthunder) | 배포 |
| 2026-04-17~22 | LinkedIn | Day 12, 17, 17v2 포스트 작성 | CEO 게시 대기 |
| 2026-04-21 | 결정 | **X 채널 영구 포기 + 항소 포기** (CEO 최종) | 채널 1개 사망 |
| 2026-04-22 | 모두의 창업 | 2026 지원서 제출 | **결과 05-15 예정** |
| 2026-04-29 | 제품 | DEPLOY-GATE-01 12/13 PASS + 프로덕션 배포 | LIVE |
| 2026-04-29 | LinkedIn Day 24 | CEO 직접 게시 (08:00 KST) | 게시 (반응 0) |
| 2026-04-30 | Reddit | 댓글 9개 게시 (도메인 0 룰 준수) | 카르마 59 → 106 |
| 2026-04-30 | 블로그 | Day 25 (Refactoring UI 회고) | 배포 |
| 2026-04-30 | 결정 | BOT-MKT-01 AEO Doctor (4봇 + Anthropic Skills) 마스터플랜 승인 | W3 (05-17) 라이브 예정 |
| 2026-05-04 | 진단 | MARKETING-CHANNEL-01 진단 — LinkedIn/Reddit 동결 결정 | 채널 재배분 |

### 10.2 ⚠️ X/Twitter 영구 정지 사건 (반드시 기록)
- **시점**: 2026-04-14
- **계정**: @pickedbyAI
- **원인**: 자동 포스팅 데몬 운영 → X 정책 위반 → 영구 정지
- **CEO 결정 (2026-04-21)**: **항소 포기 + 신규계정 + 우회 모두 영구 금지**
- **교훈 (영구 룰)**:
  - SNS 자동 포스팅 절대 금지
  - "되돌릴 수 없는 행동"의 대표 사례로 메모리에 영구 기록
  - X 채널 의존도 0으로 재설계 → LinkedIn/Reddit/IH/HN으로 재분배

### 10.3 채널 진단 결과 (2026-05-04 MARKETING-CHANNEL-01)
**marketing-psychology 7개 mental model 적용 결과:**

| 채널 | 진단 | 결정 |
|------|------|------|
| LinkedIn | 5게시 24일 / 반응 0 / followers 0 / 시간당 ROI 0 — Theory of Constraints 위반 (병목=네트워크인데 콘텐츠만 다듬음) | ⏸ **동결** |
| Reddit | 카르마 59 → 106 정체 / 댓글 휘발성 / mimetic 자산 0 / link-post 자격 임계점 미달 | ⏸ **동결** |
| Indie Hackers | ICP 농도 50%+ / Building in Public 컬쳐 / 신규 계정 친화 | 🥇 **W1 진입 1순위** |
| 블로그 SEO + Dev.to | 18편 누적 / compounding 자산 / 모트 자산화 | 🥈 **W2 강화** |
| HN Show HN | 개발자 풀 / 1발성 / 카르마 필요 | 🥉 **W7 (PH 동시) 단발** |
| BOT-MKT-01 4봇 | GPT Store + Gemini Gems + Perplexity Space + Poe (AEO Doctor) | 🚀 **W3 (05-17) 라이브 (당김)** |

### 10.4 관통하는 마케팅 원칙 (확정)
1. **SNS 자동 포스팅 절대 금지** (X 정지 트라우마)
2. **Reddit 도메인 0 룰** (본문 + 댓글 모두 도메인 박지 않음)
3. **"AI 추천 보장" 카피 절대 금지** (법적·신뢰 리스크)
4. **모든 메시지 사실 검증 필수** (LinkedIn Day 24에서 6 거짓 발견·수정)
5. **CEO 직접 게시** (자동화된 발송 신뢰 0)

---

## 11. 현재 (2026-05-04 기준)

| 항목 | 수치 |
|------|------|
| Phase | Phase 2a (W1 처방 엔진) 진행 중 |
| 프로덕션 배포 | **13차** (2026-05-04 10:18 KST) |
| pickedby.ai 자체 점수 | **45/100 (EMERGING)** — Day 11 12점 → Day 25 45점 (+33점 누적) |
| Reddit 카르마 | 106 (목표 200+) |
| LinkedIn followers | 0 (동결) |
| 블로그 누적 | 18편 (Velog @tthunder) |
| 베타 가입자 (이메일) | (비공개, 1,000 목표) |
| 월 운영비 | ~$10 |
| 보안 상태 | Supabase Critical 0건 (2026-04-30 fix) |

---

## 12. 향후 일정 (8주 재계획, 2026-05-04 CEO 확정)

```
W1 (05-03~09): Phase 2a 마감 — D4 GAP-01 잔여 / 채널 진단 ✅
W2 (05-10~16): Phase 2b 마감 — D6 FE 잔여 / D7 PULSE-EMAIL-01 / D8 QA / IH milestone post 1
W3 (05-17~23): 🚀 BOT-MKT-01 4봇 라이브 + Phase 2c (D9~D11)
W4 (05-24~30): Phase 2d (D12~D13 DEPLOY-GATE-02)
W5~W8 (05-31~06-27): 데이터 누적 + 채널 compounding + PH 다듬기
🚀 2026-07월 첫째 주: Product Hunt + Show HN 동시 런칭
2026-09월: Founding Creator 100 마감 / Pro 플랜 공개
2026-12월: MRR $1,900 (Phase 2 목표)
2027-Q2: MRR $19,000+ / 시드 펀딩 준비
```

---

## 13. 외부 AI 에이전트가 이 브리프로 무엇을 알 수 없는가 (의도적 제외)

### 13.1 영업 비밀 (외부 공개 금지)
- 4차원 점수 계산식의 정확한 수식·가중치 분배
- AI Probe 프롬프트 엔지니어링 디테일
- 처방 엔진(prescriptionEngine.ts) 20규칙의 정확한 룰
- API 키, 환경변수, 인프라 비밀
- 베타 유저 식별 정보 (이메일, 도메인)

### 13.2 비공개 결정 메모
- CEO 개인 신원·재무 정보 (CLAUDE.local.md)
- 모두의 창업 지원서 본문
- 미발표 가격 변동 계획

### 13.3 외부 에이전트 활용 시 주의
- "점수 계산 방법 알려줘" 요청에는 4차원 카테고리만 답하고 가중치/공식은 답하지 않을 것
- "AI Probe 프롬프트는 어떻게 설계됐어?" 요청에는 정책상 공개 불가 답할 것
- 마케팅 메시지 작성 시 "AI 추천 보장" 표현 절대 사용 금지

---

## 14. 외부 에이전트가 이 브리프로 할 수 있는 일 (의도된 활용)

1. **시장 조사**: 우리와 유사한 1인 창업 SaaS / GEO / AEO 분야 레퍼런스 회사 찾기
2. **마케팅 성공 케이스**: 비슷한 ICP·예산·팀 규모로 성공한 사례 발굴
3. **채널 전략**: Indie Hackers · Dev.to · Hacker News · Product Hunt 모범 사례 분석
4. **콘텐츠 카피 비평**: 우리 LinkedIn 게시물·블로그가 ICP에 맞는지 외부 시각 점검
5. **경쟁사 모니터링**: Otterly·Profound·trysight·Ahrefs AEO 진입 동향 추적
6. **PR 사이드**: 모두의 창업·시드 펀딩 시 메시지 톤 검증
7. **bot 채널 카피 검수**: AEO Doctor 4봇 카피 v2 (이미 emoji/em-dash 0건 검증 완료) 추가 검토

---

## 15. 빠른 참조 (한 줄 요약)

| 질문 | 답 |
|------|----|
| 뭐 만드는 회사? | AI 추천 시대의 성장 코치 (GEO/AEO 플랫폼) |
| 누구를 위한? | 인디 크리에이터·1인 SaaS·콘텐츠 운영자 (엔터프라이즈 X) |
| 차별점? | 5대 AI 전체 + 처방까지 (경쟁사: 점수만) + 10초 무료 가입 불필요 |
| 가격? | Free / $9 평생 100명 / $19 / $49 / $99+ |
| 팀? | 1인 + AI 에이전트 |
| 현재? | Phase 2a 진행 / 13차 프로덕션 배포 / 자체 점수 45/100 |
| 다음? | W3 4봇 라이브 → 7월 첫째 주 PH+HN 런칭 |
| X 채널? | 영구 포기 (2026-04-14 자동 포스팅 정지) |
| 활성 채널? | Indie Hackers(1순위) / 블로그(2순위) / HN(3순위) / BOT-MKT-01(W3) |
| 운영비? | ~$10/월 |
| Moat? | probe_logs + 처방 효과 데이터 (복제 불가) |

---

*본 브리프는 외부 AI 에이전트가 pickedby.ai 컨텍스트를 한 번에 동기화하기 위한 단일 진실 소스입니다. 민감 정보 제외, 공개 가능 수준만 포함. 갱신은 CPO 책임.*

*— 2026-05-04 CPO 작성 (데스크탑 Claude, Opus 4.7 1M context)*
