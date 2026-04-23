# pickedby.ai (PBA) 사업계획서
> 최종 업데이트: **2026-04-23** (빅파이 1.5.1 Volume Metrics 반영 · Founding Creator 100 베타 · DEPLOY-GATE-01 현황 · X 채널 영구 포기 반영) | 기반: pickedby_ai_full_report.json + whitepaper.md + vision-brief-v2.md
> **전략 상위 문서**: `pickedbyAI/docs/whitepaper.md` (Moat 전략, 시장 래더, 가설 검증 포함)
> **비전 진실 소스**: `pickedbyAI/docs/vision-brief-v2.md` (v2.0 — Google Stack 비전)

---

## 1. 한 줄 정의 (2026-04-21 최종)

**"AI 추천 시대의 서치콘솔 — 5대 AI(GPT·Gemini·Claude·Grok·Perplexity)가 내 제품·콘텐츠를 추천하는지 측정·분석·최적화하는 플랫폼"**

> 🔴 **5대 AI 커버 원칙 (2026-04-21 CEO 확정)**: 외부 카피는 항상 5대 AI 전체를 표기합니다. 특정 1~2개 엔진만 언급해 "한정 도구"로 오독되는 것을 막기 위함입니다.

- 단순 "제품 점수 계산기"가 아닙니다. 측정 단위는 **제품 + 콘텐츠** 모두입니다.
- SaaS 제품 · Gumroad 템플릿 · 블로그 글 · YouTube 채널 · 뉴스 기사 · 퍼스널 브랜드 · Etsy 스토어 · Substack 뉴스레터 등 **AI 답변에서 발견되기를 원하는 모든 것**이 대상입니다.
- Google Search Console이 "웹의 페이지"를 위한 것이라면, pickedby.ai는 **"AI 답변에서 발견 가능한 모든 것"**을 위한 것입니다.
- 카테고리 야망: AI 가시성 플랫폼의 **카테고리 리더**. GSC/GA4가 구글 검색에 대해 그러하듯이.

---

## 2. 문제

GPT · Gemini · Claude · Grok · Perplexity 등 주요 AI가 쇼핑·콘텐츠 추천의 핵심 채널로 자리잡고 있다.

- AI 레퍼럴 트래픽 YoY **+527%** (Semrush, 2025)
- Claude 전환율 **16.8%** (구글 1.76~2.8% 대비 10배)
- ChatGPT 일일 쇼핑 쿼리 **5,000만 건**
- **70%의 디지털 제품이 Product 스키마 없음** → AI에게 보이지 않음

그런데 Gumroad 셀러, Notion 템플릿 작가, AI 프롬프트 팩 크리에이터는 AI에 자기 제품이 추천되는지조차 모른다. 확인 방법도 없고, 최적화 방법도 모른다.

---

## 3. 솔루션

**pickedby.ai** = 누구나 URL/제품명/콘텐츠 주소를 입력하면:

1. **10초 무료**: AI 추천 여부 + AI Visibility Score (0-100, 4차원 단일 체계)
2. **즉시 진단**: 4개 차원 — Recognition 35 + Category 35 + Co-Recommendation 20 + Web Authority 10 = 100점 (빅파이 1.5 확정)
3. **배지**: Pass Indicator (🏆 PERFECT / 🟢 STRONG / 🟡 EMERGING / 🔴 INVISIBLE) + Gold/Silver/Bronze 배지 발급
4. **일일 자동 측정**: cron KST 00:00 자동 실행 → Daily Pulse 카드 + Movement Feed
5. **원클릭 처방**: llms.txt 자동 생성, 4개 Sources 풀셋 진단 (sitemap/rss/robots/llms — 빅파이 1.5.2)
6. **Volume Metrics (빅파이 1.5.1)**: probe_logs 기반 7지표 누적 (멘션 횟수·인식률·카테고리 등장 횟수·인용 사이트 수·소스 다양성·CoRec 연결도·총 probe 횟수) — 점수(상대)와 볼륨(절대) 이원 진단
7. **알림**: 내 제품·콘텐츠가 AI에서 언급되면 이메일 알림 (Phase 2)

---

## 4. 시장

| 지표 | 수치 | 출처 |
|------|------|------|
| 디지털 제품 셀러 수 | 200-300만 명 | Gumroad/Etsy/LS 합산 추정 |
| 글로벌 콘텐츠 퍼블리셔 | 5,000만+ 블로그 + 5,000만+ 유튜버 + 50만+ 뉴스레터 | Statista/Ahrefs |
| 크리에이터 이코노미 규모 | $1,910-2,540억 (2025) | Goldman Sachs |
| GEO/AEO 도구 시장 CAGR | **40.6%**, 2034년 $171.5억 전망 | 시장 조사 |
| 크리에이터·콘텐츠 타겟 GEO 도구 | **0개** | 직접 조사 (24개 전수 확인) |

**핵심**: 24개 GEO 도구 전부 기업/브랜드 타겟. **제품·콘텐츠 둘 다 포괄하는 플랫폼은 전 세계 0개**.
**확장 가능 시장**: "AI 답변에서 발견되기를 원하는 모든 개인·조직" = 전 세계 수억 명.

---

## 5. 경쟁사

| 경쟁사 | 가격 | 타겟 | 우리와 차이 |
|--------|------|------|-----------|
| Otterly AI | $29-989/월 | 마케터/SEO | 기업용 UX, Claude 미지원, 가입 필수. 20K+ 유저, Gartner Cool Vendor |
| Profound | $500+/월 | Fortune 500 | 대기업 전용 |
| trysight.ai | 유료 | SEO/마케터 | "AI Visibility Score" 키워드 블로그 장악 중. 직접 위협 |
| amivisibleonai.com | 무료 | 일반 | 가짜 결과 이슈로 신뢰 낮음 |
| llmclicks.ai | 무료 | 일반 | 단순 체커, 크리에이터 특화 없음 |
| amionai.com | TBD | 일반 | 단순 가시성 진단 |
| Durable Discoverability | 무료 | 로컬 비즈니스 | 배관공/레스토랑 타겟 |
| Goodie AI | TBD | 인디 SaaS | B2B SaaS 타겟 |
| **pickedby.ai** | **무료/$19** | **크리에이터** | **10초 무료, 가입 불필요, 5차원 분해** |

**혁신자의 딜레마**: 기존 경쟁사는 더 높은 마진의 기업/마케터 고객 집중 → 크리에이터 시장에 안 내려옴.
**⚠️ 2026-04-13 업데이트**: trysight.ai가 "AI Visibility Score" 관련 키워드 블로그 장악 시작. SEO 선점 경쟁 진입 필요.

---

## 6. 차별성 (확정, 번복 불가)

### ① 크리에이터부터 시작하는 유일한 GEO 플랫폼
Notion 템플릿, 전자책, AI 프롬프트, 온라인 강의에서 시작하는 카테고리 기반 모니터링.
경쟁사는 전부 브랜드명 기반 → 제품 카테고리 개념 없음. Phase 2+: D2C·SaaS·에이전시 확장.

### ② 10초 무료, 가입 불필요
URL 또는 제품명 입력 → 즉시 결과.
경쟁사 전부: 가입 → 설정 → 대기 구조.

### ③ "안 하면 확실히 안 보인다"
AI 추천을 보장하지 않는다. 하지만 인프라를 갖추지 않으면 확실히 안 보인다.
SEO가 "1위 보장 못 하는데" $1,070억 시장인 것과 동일 구조.

---

## 7. 수익 모델

| 플랜 | 가격 | 핵심 기능 | AI 커버 | 전환 포인트 |
|------|------|-----------|---------|-----------|
| **Founding Creator 100** | **$9/월 (평생)** | Creator 전체 기능 | 2엔진 | 선착순 100명 베타 — 모두의 창업 "초기 유료 유저" 근거 |
| Free | $0 | 1회 체크, 배지 | 2엔진(Gemini+Perplexity) | 즉각 Aha moment |
| Creator | $19/월 | 무제한 체크, 추이 차트, Volume Metrics, llms.txt, 주간 리포트 | 2엔진 | "추이가 보고 싶다" |
| Pro | $49/월 | **5대 AI 전체**, 경쟁사 추적, API, 다국어 최적화 | **5대 AI 전체** | "경쟁사보다 앞서고 싶다" |
| Agency | $99+/월 | 화이트라벨 리포트, 10 클라이언트 관리 | **5대 AI 전체** | "이걸 고객에게 팔고 싶다" |

> 🔴 **AI 티어 분리 원칙 (2026-04-21 확정)**: 무료·Creator = 2엔진(Gemini+Perplexity). Pro·Agency = 5대 AI 전체(+GPT·Claude·Grok). 외부 카피는 항상 "5대 AI 커버" 표기.

**전략**: 지금은 돈보다 선점. 무료로 깔고, Founding Creator 100으로 결제 의향 데이터 수집.
**유료 전환 핵심 후크**: llms.txt 자동생성 + 점수 추이 차트 + 경쟁사 비교
**결제 인프라**: Paddle (Phase 2, PAY-PB-01 — 글로벌 크리에이터 타겟에 최적. K-사주 DodoPay UPI와 별도)

---

## 8. 성장 전략

> 상세 Moat 전략·시장 래더·가설 검증: `whitepaper.md` 참조

### Phase 1 (0-1개월): 바이럴 훅 ✅ 완료
- 무료 AI Visibility Score 배포 ✅
- 배지 시스템 V2-C (Gold/Silver/Bronze) ✅
- Reddit r/SideProject 런칭 → 5.3K 뷰 (2026-04-06) ✅
- ENGINE-05 AI Probe (Perplexity+Gemini) 배포 (2026-04-10) ✅
- MLP-Slim: 4차원 분해 UI + Pass Indicator + Trend/Journey/Volume/Overview 12FULL 배포 ✅
- BLOG-SEO Wave 1: 블로그 18편 배포 ✅
- ~~@pickedbyAI Twitter/X~~ → **🔴 2026-04-14 영구 정지 · 2026-04-21 항소 포기 (CEO 최종 결정)**
- ~~X 채널~~ → **🔴 영구 포기. 신규계정·우회 모두 금지**
- **LinkedIn 채널 전환 결정** (주력 SNS를 X → LinkedIn으로 변경)
- IH 포스팅 ✅ / Reddit r/ChatGPT ✅ / Reddit 인터셉트 댓글 진행 중

### Phase 1.5 (지금): 빅파이 1.5 스프린트 + 마케팅 준비 ← **현재 단계**

**🔴 마케팅 재개 조건 (DEPLOY-GATE-01 통과 전까지 대기):**
- GT-01: T1 3/3 제품 점수 80+ 실측 (04-25 예정)
- DEPLOY-GATE-01 13개 기준 전수 통과
- CEO 직접 3개 제품 검증

**DEPLOY-GATE-01 이후 재개:**
- **이메일 목표 1,000개** → Product Hunt 런치 게이트 (100개 달성 후)
- LinkedIn Day 17 포스트 게시 (준비 완료, D11 후 CEO 게시)
- Reddit 카르마 빌딩 (현재 59 → 목표 200+)
- r/SideProject 모드 승인 대기
- 셀럽 DM 5건 (Marc Lou, Easlo, Tony Dinh, Arvid Kahl, Pat Walls)
- AlternativeTo 등록 / GEO 디렉토리 등록

### Phase 2 (1-3개월): 핵심 제품 확장 + Moat Layer 1
- **MOAT-01 Score Tracker**: 주간 자동 체크 + 추이 차트 (시계열 Lock-in)
- **MOAT-02 SDK v0.1**: dynamic badge + impression 카운트 (코드 임베딩 전환비용)
- LLM-01~04 인사이트 (점수 해석, 경쟁사 비교, llms.txt 생성, 개선 조언)
- DEEP-01 딥링크 생성/추적 (bit.ly 패턴 — 데이터 해자)
- NOTIF-01 AI 추천 알림 (Linktree 패턴 — 불가능했던 가치)
- GA4-01/02 Google OAuth2 + GA4 AI 채널 트래픽 연동
- FEAT-01/02 llms.txt/Schema.org 자동 생성 (무료)
- FEAT-03 주간 리포트 이메일 (GA4 데이터 포함)
- PAY-01 DodoPay 결제 연동 + Creator $19 플랜 공개
- 목표: MRR $1,900

### Phase 3 (3-12개월): 플랫폼화 + Moat Layer 2~3
- **MOAT-03 SDK v0.2**: 클릭 추적 + 전환 correlation → 벤치마크 데이터
- **MOAT-04 Creator Graph**: 카테고리 벤치마크 리포트 발행
- **AGENCY-01 Agency $99+ 화이트라벨 플랜**
- INT-01~04 Gumroad/LemonSqueezy/Etsy/Shopify API
- INT-05 Zapier/Make 통합
- FEAT-07 직접 AI API 쿼리 (ChatGPT/Claude/Perplexity)
- MCP 서버 (AI 에이전트가 직접 쿼리)
- 다국어 최적화 (영어→일본어/스페인어)
- 목표: MRR $19,000+, 시드 펀딩 준비

### 시장 래더 (확정)
```
1단계 (지금~6개월): 인디 크리에이터 → PMF 증명 + 배지 네트워크 씨앗
2단계 (6~12개월): Micro-SaaS / Indie Hacker → ARPU $19~49
3단계 (12개월+): SMB / SEO Agency → ARPU $99~299
절대 금지: Enterprise (Profound 영역)
```

---

## 9. 기술 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| FE | 정적 HTML + Tailwind CDN | CF Pages 무료 |
| BE | TypeScript + Hono + CF Workers | perceptdot 스택 재활용 |
| DB | Supabase PostgreSQL | `emails` + `scores` + `probe_logs` 테이블 |
| 웹검색 | Tavily API | cron lite 1쿼리 / manual 3쿼리. Researcher Plan 1,000 크레딧/월 |
| AI 스코어 (ENGINE-07) | CF Workers AI (llama-3.1-8b) + Tavily | 4차원 단일 체계, 결정적(temp=0) |
| AI Probe | Gemini Relay (무료) + Perplexity API ($10/월) | 베타 2엔진. 정식 v2.0 + GPT·Claude·Grok |
| Volume Metrics | probe_logs 집계 (추가 비용 $0) | 7지표 누적 체계 (빅파이 1.5.1) |
| 이메일 | Brevo | 무료 300통/일 |
| 결제 | Paddle | Phase 2 (PAY-PB-01). 글로벌 크리에이터 타겟 |
| 배포 | CF Pages + CF Workers | pickedby.ai / api.pickedby.ai / Relay Worker |

**DB 테이블 현황**:
- `emails`: 이메일 수집 (Google OAuth 연동)
- `scores`: 4차원 unified_v15 JSONB + Pass Indicator (KST 00:01 cron 자동 갱신)
- `probe_logs`: Probe 실행 로그 (AI별 응답·인식률·코렉·소스 누적 — Volume Metrics 원천)

**월 운영비**: Phase 1 ~$0, Phase 1.5 ~$10 (Perplexity $10 + Tavily 기존 예산), Phase 2 ~$55

---

## 10. 배지 시스템 (V2-C, 2026-04-06 확정)

| 점수 | 티어 | 문구 | 특이사항 |
|------|------|------|---------|
| 81-100 | Gold | PICKED BY AI | goldPulse 애니메이션, 박스 글로우 |
| 61-80 | Silver | SEEN BY AI | #C0C0C0 |
| 36-60 | Bronze | NOTICED BY AI | #CD7F32 |
| 0-35 | 없음 | — | — |

크라운 로고: V2-C (3피크 + 3젬, x=4/9/14)

---

## 11. 리스크 & 대응

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| ~~Gemini HKG DC 차단~~ | **해결됨** | — | CF Workers AI 전환 (2026-04-06) |
| ~~@pickedbyAI X 계정~~ | **발생** | 중간 | LinkedIn 채널 전환. X 이의제기 2026-04-17 재시도 |
| trysight.ai SEO 장악 | **진행 중** | 높음 | Wave 2 블로그 가속 + GEO 디렉토리 선점 |
| 채널-타겟 미스매치 | **확인됨** | 높음 | 타겟 채널(r/Etsy, Facebook Etsy 그룹) 집중 전환 |
| Semrush/Ahrefs GEO 기능 출시 | 높음 | 높음 | 배지 네트워크 선점 속도 경쟁. 크리에이터 채널 없는 그들의 약점 활용 |
| 크리에이터 지불의향 낮음 | 중간 | 높음 | Agency 래더로 ARPU 확보 + 점수 0 사용자 타겟 전환 |
| AI 알고리즘 변동 | 높음 | 중간 | 다중 소스(Tavily+ENGINE-05 AI Probe) + 결정적 점수 |
| 유료 전환율 < 2% | 중간 | 높음 | llms.txt 가치 강화 + Score Tracker Lock-in |
| Otterly 크리에이터 플랜 출시 | 중간 | 중간 | 속도 선점 + SDK 전환비용 |
| 팀 규모 한계 | 확실 | 중간 | AI 코딩 에이전트 최대 활용 |
| ROI 증명 어려움 | 높음 | 중간 | SDK impression/클릭 데이터 + GA4 연동 |
| "AI Visibility" 개념 미인지 | 높음 | 높음 | Hero 카피 변경 "Does ChatGPT recommend your product?" |

> **5AI 피드백 기반 리스크 재평가 (2026-04-07) + CPO 유통 진단 추가 (2026-04-13)**

---

## 12. 마일스톤

| 날짜 | 마일스톤 | 상태 |
|------|---------|------|
| 2026-04-05 | pickedby.ai 도메인 구매 ($160/2년, Cloudflare) | ✅ |
| 2026-04-05 | HTTPS 라이브 + E2E 정상 | ✅ |
| 2026-04-06 | 배지 시스템 V2-C (Gold/Silver/Bronze) 구현 | ✅ |
| 2026-04-06 | Reddit r/SideProject 런치 → 5.3K 뷰 | ✅ |
| 2026-04-08 | BLOG-SEO Wave 1: 4개 포스트 배포 | ✅ |
| 2026-04-10 | ENGINE-07 UnifiedScore AI Probe (Perplexity+Gemini) 배포 | ✅ |
| 2026-04-14 | @pickedbyAI X 계정 영구 정지 (자동화 정책 위반) | 🔴 |
| 2026-04-14 | IH 포스팅 + Reddit r/ChatGPT 런칭 | ✅ |
| 2026-04-17 | 빅파이 1.5 설계 (4차원 단일 체계) CEO 승인 | ✅ |
| 2026-04-18 | D1 DB 마이그레이션 + D2 온보딩·자동체크·5회재시도 | ✅ |
| 2026-04-21 | D3 도메인 드롭다운 + D5 Overview 12섹션 풀셋 | ✅ |
| 2026-04-21 | CEO 범위 확장 확정 (제품→제품+콘텐츠) + 5대 AI 커버 포지셔닝 | ✅ |
| 2026-04-21 | X 채널 영구 포기 (항소·신규계정·우회 모두 금지) | ✅ (CEO 최종) |
| 2026-04-21 | 모두의 창업 지원서 초안 완성 | ✅ |
| 2026-04-22 | D6 Trend+Journey+Volume 풀셋 구현 (빅파이 1.5.1) | ✅ |
| 2026-04-23 | TAVILY-CRON-LITE-01 프로덕션 예외 선반영 (크레딧 보호) | ✅ |
| **스테이징** | **API `4fc2f190` · FE `e61011c3`** | **현재** |
| **프로덕션** | **API `1e52e42b` · FE 변경 없음** | **현재** |
| 2026-04-24 | D7 PROBE-REDESIGN-01 | 예정 |
| 2026-04-25 | D8 Rivals + GT-01 실측 | 예정 |
| 2026-04-26~27 | D9 랜딩 리뉴얼 | 예정 |
| 2026-04-28 | D10 모바일 | 예정 |
| 2026-04-29 | D11 DEPLOY-GATE-01 + CEO 검증 → **프로덕션 배포 🔴** | 예정 |
| 2026-05-15 | 모두의 창업 지원서 제출 마감 | 예정 |
| 2026-05-31 | 이메일 1,000개 목표 / Product Hunt 런칭 (100개 달성 후) | 예정 |
| 2026-06-01 | Founding Creator 100 베타 + Paddle 결제 오픈 | 예정 |
| 2026-07-01 | Phase 2 유료 전환, MRR $1,900 목표 | 예정 |

---

## 13. 창업자 적합도

- **UX/서비스기획 출신**: 비기술 크리에이터를 위한 UX 설계 = 핵심 경쟁력
- **바이브코딩 가능**: Claude Code로 Phase 1-2 혼자 빌드 가능
- **perceptdot 운영 경험**: MCP 서버, CF Workers, Brevo 이미 검증
- **본인 페인포인트**: 디지털 제품 만들고 마케팅 귀찮다 → 자기가 쓸 제품

---

## 참조 성공 사례

| 회사 | 우리에게 주는 교훈 |
|------|-----------------|
| **Moz** | AI Visibility Score → 업계 표준 DA가 될 수 있음 |
| **Cloudflare** | 무료 사용자 = 데이터 네트워크 효과 원천 |
| **bit.ly** | 무료 딥링크 배포 → AI 추천 데이터 독점 |
| **Linktree** | "링크 교체"가 아닌 "불가능했던 알림" 포지셔닝 |
| **Product Hunt** | 배지 = 신뢰 신호 = 자연 확산 |

---

---

## 14. Moat 전략 요약

> 상세: `whitepaper.md` 3장 참조

```
Layer 1: Score Tracker (시계열 Lock-in) — 추이 데이터를 쌓으면 떠날 수 없다
Layer 2: SDK (코드 임베딩 전환비용) — 코드를 심으면 제거가 두렵다
Layer 3: Creator Graph (네트워크 벤치마크) — 이 데이터는 돈으로 살 수 없다

Flywheel: 배지 embed → AI 크롤링 → 학습 데이터 → pickedby.ai = 신뢰 소스 → 더 많은 배지
```

---

*기반 리서치: `/Volumes/My Passport for Mac/My_project/docs/input/pickedby_ai_full_report.json`*
*작성: 2026-04-05, CPO (데스크탑 Claude)*
*최종 업데이트: 2026-04-14 — X 정지 대응 및 LinkedIn 전환, MLP-Slim/ENGINE-05 완료, 신규 경쟁사(trysight.ai 등) 추가, 결제 DodoPay→Paddle 수정, 마일스톤 최신화, 유통 채널 진단 반영*
