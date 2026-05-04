# pickedby.ai White Paper
> **버전:** 1.5 | **작성일:** 2026-04-07 | **최종 갱신:** 2026-04-29 (빅파이 1.6 Growth Loop · 처방 엔진 · 선순환 Moat · Phase 2 재정의)
> **갱신 주기:** 매 Phase 전환 시 + 전략적 피벗 시
> **목적:** 사업 방향성의 단일 진실 소스. 왜 이 사업을 하는가, 어디로 가는가, 어떻게 방어하는가.
> **전략 마스터 문서:** `docs/bigpie-v1.6.md` (v1.6 Growth Loop + 처방 엔진)

---

## 🔴 핵심 포지셔닝 규칙 (2026-04-21 CEO 확정)

1. **범위**: 측정 단위는 **제품 + 콘텐츠** 모두. "AI 답변에서 발견되기를 원하는 모든 것." 단순 제품 계산기가 아님.
2. **AI 커버**: **5대 AI(GPT · Gemini · Claude · Grok · Perplexity) 전체 커버**가 표준 포지셔닝. 외부 카피에서 단일·2엔진 한정 표기 금지. 베타 2엔진은 단계적 실행 경로일 뿐, 제품 정의는 5대 전체.
3. **카테고리 야망**: GSC/GA4가 구글에 그러하듯, pickedby.ai는 **AI 답변 영역의 #1 Visibility Platform**이 되는 것이 목표.

---

## 1. 핵심 테제 (Core Thesis)

**"AI가 추천하지 않으면, 존재하지 않는다."**

2026년 현재, 소비자 검색의 패러다임이 전환되고 있다.
- AI 레퍼럴 트래픽 YoY +527% (Semrush, 2025)
- Claude 전환율 16.8% — 구글 대비 10배
- ChatGPT 일일 쇼핑 쿼리 5,000만 건
- GEO 시장 CAGR 40.6%, 2034년 $171.5억 전망

그런데 **글로벌 도메인 가진 수천만 명** — Indie/B2B SaaS · Marketing/Design Agencies · Consultants/Coaches · Newsletter operators · D2C brands · Online course creators · Authors · Professional services · Personal brands — 자기 제품/콘텐츠/도메인이 AI에 보이는지조차 확인할 수 없다. 24개 GEO 도구 전부 Fortune 500/엔터프라이즈 타겟이다. **누구나 시작할 수 있는 도구는 0개**다.

Phase 1 진입점(인디 크리에이터·Indie SaaS 시드 세그먼트)이며, **최종 타겟은 anyone discoverable by AI** — Phase 2 D2C/Agency/SaaS 확장, Phase 3 글로벌 영어 시장 모든 도메인 보유자. (vision-brief-v2.md §1 변경 없음, 2026-04-14 이후 동일)

> **타겟 영구 룰 (2026-05-04 CEO 재확인)**: 글로벌 영어 시장 only · 한국 시장 X · "creators only" 단독 표기 금지 (진입점 맥락에서만 허용) · 5대 AI(GPT·Gemini·Claude·Grok·Perplexity) 전체 커버 불변

pickedby.ai는 이 공백을 채운다 — Search Console for AI, for any website owner.

---

## 2. 전략적 위치 평가 (2026-04-07 기준)

### 외부 AI 5개 동시 평가 결과

| AI | 종합 점수 | 판정 | 핵심 키워드 |
|-----|-----------|------|-----------|
| 제미나 | 정성 우수 | 게임체인저 가능 | "진단→처방 전환" |
| GPT | 6/10 | 기능 수준 | "Agency SaaS 확장" |
| 젠스파크 | 3.6/10 | PASS | "수익모델 부재" |
| 마누스 | 6.8/10 | Hold | "Real-time API 필요" |
| 그록 | 3.5/10 | PASS | "Moat 전무" |

### 전원 합의 (부정할 수 없는 사실)

1. **타이밍은 완벽하다** (8~9/10) — 2005년 SEO 시장과 동일. 카테고리 리더 부재.
2. **PLG/UX 구조는 정석이다** — 10초, 무가입, 즉각 결과. 건드리지 않는다.
3. **배지가 유일한 네트워크 효과다** — 성장 엔진이자 방어선의 시작점.
4. **"진단→처방" 전환이 필수다** — 점수만으로는 재방문·유료전환 불가.
5. **기술 moat는 없다** — 기술 대신 데이터·배지·브랜드로 방어선 구축.

### AI들이 틀린 것 (내부 사실과 괴리)

| AI 지적 | 실제 | 교정 |
|---------|------|------|
| "수익 모델 없음" | Free/$19/$49 확정, Paddle 결제 인프라 완료 | 가격 페이지 외부 노출 필요 |
| "Training data only" | Tavily 실시간 웹검색 기반 | 기술 아키텍처 커뮤니케이션 필요 |
| "트랙션 제로" | Reddit 4.7K뷰, PH 제출, 디렉토리 4개 | 스테이징 URL 노출이 오해 원인 |

---

## 3. Moat 전략 (핵심 — 가장 중요한 장)

### 진단: 왜 Moat가 없는가

현재 구조:
```
체크 → 점수 → 나감 → 끝
```
이건 계산기다. 계산기는 대체 가능하다.

### 처방: 4단계 Moat 전략

#### Layer 0. Prescription Effectiveness Data — 처방 효과 복제 불가 자산 (v1.6 신규)

**무엇:** 유저가 처방(PH 런치, Reddit 댓글 등)을 실행한 후 점수 변화를 기록 → "어떤 처방이 어떤 유형 제품에 효과가 있었는지" 축적
**왜 Moat:** 처방 규칙은 복제 가능하지만, "PH 런치가 AI visibility 평균 +18점 효과"라는 데이터는 수천 명의 실행 데이터가 필요. 경쟁사가 규칙을 베껴도 효과 데이터는 없음.
**비유:** Google Ads가 20년간 축적한 클릭 로그가 진짜 moat인 것과 동일. probe_logs + prescription_effectiveness = pickedby.ai의 클릭 로그.

```
실행:
- prescription_logs: { user_id, prescription_id, action_type, completed_at, score_before, score_after }
- 처방별 효과 통계: avg_delta, success_rate, category별 분포
- 유저가 많아질수록 처방이 정확해지는 자기 강화 루프
```

#### Layer 1. Score Tracker — 시계열 Lock-in

**무엇:** 1회 체크 → 주간 자동 체크 + 점수 추이 그래프
**왜 Moat:** 3개월 치 추이 데이터를 쌓은 사용자는 경쟁사로 못 간다. 데이터 0부터 시작해야 하니까.
**비유:** Google Analytics가 정확히 이 구조로 시장 80%를 먹었다. GA4를 Semrush로 대체하는 사람은 없다.

```
실행:
- Supabase scores 테이블에 weekly auto-check 추가
- Dashboard에 추이 차트 (30일/90일)
- Creator $19의 핵심 유료 기능 = "추이 데이터 보관 + 주간 리포트"
```

#### Layer 2. pickedby.ai SDK — 코드 임베딩 전환비용

**무엇:** 정적 배지 이미지 → JavaScript SDK embed
**왜 Moat:** 코드를 심은 사용자는 제거가 두렵다. SDK가 수집하는 데이터(impression, 클릭, 전환)는 우리만 가진 유일한 데이터셋이 된다.

```javascript
// 정적 배지 (현재)
<img src="pickedby.ai/badge/my-product.svg" />

// SDK (Layer 2)
<script src="pickedby.ai/sdk.js"></script>
<div data-pickedby="my-product" data-style="full"></div>
```

| 구분 | 정적 배지 | SDK |
|------|-----------|-----|
| 전환 비용 | URL 교체 = 쉬움 | 코드 제거 = 두려움 |
| 데이터 | 없음 | impression, 클릭, 전환 |
| 가치 증명 | 예쁜 스티커 | "배지가 전환율 23% 올렸다" |
| 업데이트 | 수동 | 실시간 점수 자동 반영 |

#### Layer 3. Creator Graph — 네트워크 벤치마크

**무엇:** SDK 설치 사이트들의 익명 집계 데이터 → 카테고리 벤치마크
**왜 Moat:** "Notion 템플릿 카테고리 평균 AI 점수: 42점, 상위 10%: 78점+" — 이 데이터는 돈으로 살 수 없다.

```
실행:
- SDK impression/클릭 데이터 익명 집계
- 카테고리별 벤치마크 리포트 분기 발행
- "2026 Q3 Creator AI Visibility Report" → 브랜드 권위
```

#### Layer 4. Creator Network — 상호 추천 해자 (Gemini G2, 신규 추가)

**무엇:** 같은 카테고리 Verified Owner 크리에이터끼리 상호 리뷰/백링크 교환 매칭
**왜 Moat:** 경쟁사가 절대 복제 못 하는 커뮤니티 효과. 크리에이터 간 연결망이 쌓이면 이탈 불가.

```
작동 원리:
Notion 템플릿 A 작가 ↔ B 작가 → 서로 블로그/소개글에서 언급
→ 둘 다 AI 가시성 상승 (더 많은 곳에서 언급됨)
→ pickedby.ai = 크리에이터 AI 발견의 허브
→ G2처럼 "여기 올라가야 신뢰 있음" 인식 형성

구현:
- Dashboard "Creator Network" 탭: 카테고리별 크리에이터 디렉토리
- "상호 추천 매칭" 기능: 같은 카테고리 내 백링크 교환 제안
- AI Citation Tracker (출처 역추적): AI가 자주 인용하는 사이트 → 그 사이트에 올리면 AI 가시성 상승
```

**비유:** Verisign SSL = "이 배지 없으면 신뢰 없음". Creator Network = "여기 없으면 AI 크리에이터 아님"

### 12개월 Moat 성장 타임라인 (VC 피칭용)

> "현재 moat 없음"이 아니라 "12개월 moat 로드맵"으로 대응

| 시기 | Moat 수준 | 근거 |
|------|-----------|------|
| 0~3개월 | 3/10 | 측정 완성(v1.5) + **처방 엔진(v1.6)** + probe_logs 축적 |
| 3~6개월 | 5/10 | **처방 효과 데이터 축적** + 배지 네트워크 + 성공 사례 |
| 6~12개월 | 7/10 | SDK 전환비용 + **처방 정확도 차별화** + 배지 500개+ |
| 12개월+ | 9/10 | 용어 표준화 + Creator Network + **처방 효과 DB 독점 = 복제 불가** |

---

### 경쟁사가 따라올 수 없는 이유

```
Semrush가 배지를 만든다고 치자:
→ $99/월 Semrush 사용자 = 대기업 SEO 담당자
→ Gumroad 크리에이터가 Semrush 배지를 다는가? 0명
→ 크리에이터 생태계에 Semrush가 침투할 채널 없음

Otterly가 SDK를 만든다고 치자:
→ 우리가 먼저 1,000개 배지를 깔면 전환 비용 발생
→ 코드 교체 + 추이 데이터 포기 = 이탈 장벽
→ 선점 = Moat
```

### Moat Flywheel (자기 강화 루프 — v1.6 Growth Loop 확장)

```
v1.5 Flywheel (배지 중심):
배지 embed → AI 크롤링 → 학습 데이터 포함 → 더 많은 배지

v1.6 Flywheel (처방 중심 — 이중 루프):
유저 가입 → 점수 측정 → 처방 생성
→ 유저가 처방 실행 (PH 런치, Reddit 댓글...)
→ 다음 체크 시 점수 변화 기록
→ "이 처방이 효과 있었다" 데이터 축적
→ 더 정확한 처방 → 더 높은 성공률 → 더 강한 입소문
→ 더 많은 유저 → 더 많은 처방 효과 데이터 → ...

+ 성공 유저의 바이럴:
"pickedby.ai로 3주만에 27→68점!" → LinkedIn/Reddit 공유
→ 친구 가입 → Growth Loop 재진입
→ 유저 제품이 실제 유명해짐 → 남들이 언급 → AI 학습 → 자동 점수 상승
→ "서비스 쓴 보람" = 최강 소셜 프루프
```

**결론:** v1.5의 배지 Flywheel은 여전히 유효하되, v1.6의 **처방 효과 데이터 Flywheel**이 핵심 moat로 추가된다. 배지 = 외부 확산, 처방 = 내부 Lock-in + 데이터 축적. 이중 방어선.

---

## 4. 시장 래더 전략

### 현재 함정: "인디 크리에이터만" = 천장 자초

5개 AI 중 4개가 "시장이 너무 좁다"고 지적. 맞는 말이다.
하지만 **시작점**과 **종착점**은 다르다.

### 3단계 시장 확장

| 단계 | 시기 | 타겟 | ARPU | 목적 |
|------|------|------|------|------|
| **1단계** | 지금~6개월 | 인디 크리에이터 | $0~19 | PMF 증명 + 배지 네트워크 씨앗 |
| **2단계** | 6~12개월 | Micro-SaaS / Indie Hacker | $19~49 | "AI에 안 보이면 생존 불가" = 높은 지불의향 |
| **3단계** | 12개월+ | SMB / SEO Agency | $99~299 | 화이트라벨 + 클라이언트 관리 → ARPU 폭발 |

**Phase 1 집중:** 인디 크리에이터 시드 확보. Phase 2부터 D2C·에이전시·SMB 확장.
**핵심:** "디지털 제품을 만드는 사람"에서 시작하되, 로드맵은 모든 온라인 셀러까지 확장.

### 시장별 가치 제안

```
1단계 크리에이터: "내 Notion 템플릿이 AI에 보이는지 확인하세요"
2단계 Micro-SaaS: "경쟁 SaaS 대비 AI 가시성이 떨어지면 사용자를 뺏깁니다"
3단계 Agency: "클라이언트에게 GEO 리포트를 화이트라벨로 제공하세요"
```

---

## 5. 선점 전 무료 전략 (Open Source Ethos)

### 원칙 (CEO 확정)

```
선점 전까지 최대 무료 유지.
서버 운영비 범위 내에서 최대한 제공.
무료 범위는 절대 축소하지 않는다 (신뢰 자본).
```

### 비용 구조가 이 전략을 지지한다

```
CF Workers + Supabase 무료 티어 → Phase 1 ~$0/월
10만 체크까지 월 $50 이하 버틸 수 있다
Cloudflare가 수백만 사이트에 깔린 후 유료 플랜 출시 — 동일 구조
```

### 선점 달성 기준 (6개 지표 — 매월 1일 체크)

| ID | 지표 | 목표 | Moat 의미 |
|----|------|------|-----------|
| **A** | 누적 스캔 수 | 100,000 | 데이터 복리 임계점 (Cloudflare식) |
| **B** | Verified Owner 수 | 1,000 | "이미 쓰고 있는 툴" 인식 형성 |
| **C** | 활성 임베드 배지 | 500 | 브랜드 확산 외부 500곳 |
| **D** | Google "AI visibility score" Top 10 | 1페이지 | 용어 표준화 달성 (Moz DA 전략) |
| **E** | MRR | $2,000 | 인프라 비용 자립 경계 |
| **F** | 외부 인용/언급 | 20건 | TechCrunch/Medium/Newsletter |

```
느슨한 선점: A or C 달성 → 데이터/네트워크 해자 완성
완전한 선점: A + B + E 동시 달성 → 시장/수익/데이터 3박자
```

### 유료 전환 방식

```
선점 전 무료를 유지하되, Founding Creator 100 브릿지 병행:
- 선착순 100명 대상 Creator 플랜 평생 $9 (정가 $19)
- 이건 페이월이 아님 — "원하는 사람만" 자발적 구조
- 목적: 결제 의향 데이터 + Paddle 인프라 테스트 + 모두의 창업 "초기 유료 유저" 기재
```

### 선점 후 약속 (신뢰 자본 유지)

```
1. 기존 무료 한도 절대 축소 금지
2. Founding Creator 100명 평생 $9 유지
3. "기본 기능 영구 무료" 블로그 공개 선언
4. 익명 로깅 데이터로 연간 "크리에이터 AI 추천 리포트" 무료 발행
```

---

## 6. 포지셔닝 원칙

### Anti-Enterprise 메시지 (ChatGPT 2번 B2B 오분류 → 랜딩에 명시 필수)

```
AI가 우리를 B2B로 오분류 = 사람도 헷갈린다는 신호.
랜딩 Hero에 명확히:

"Starting with digital creators. Built for the entire AI economy."
<!-- Legacy v1.0 copy removed: "Not for agencies" / "No enterprise plans" — v2.0 빅파이 전환 (2026-04-15) -->

타겟 페르소나 구체적 명시:
"For Gumroad sellers · Notion creators · Course builders"
```

### Yahoo 패러독스 (2026-04-08 CEO 인사이트)

```
Yahoo는 웹 존재감 만점이지만 "검색엔진 추천해줘"에 답하는 AI는 없다.
유명함 ≠ AI 추천. 웹 존재감만으로 점수 매기면 틀린다.

→ Tavily(웹 근거)만으로는 부족. AI Probe(직접 쿼리)가 필수.
→ 실증: ENGINE-04가 Typefully(82) > Notion(70) → 현실 괴리 확인.
```

### AI Pulse — 점수에서 맥박으로 (2026-04-08 CEO 확정)

```
점수 = 첫 만남의 훅 (10초 무료 체크)
Pulse = 두 번째 방문의 이유 (살아있는 데이터)

GA4에 "사이트 점수 73점"은 없다. 그래프가 있다.
Search Console에 "SEO 점수 81점"은 없다. 추이가 있다.
pickedby.ai도 동일 — 점수는 입구, Pulse가 거실.

AI Pulse 구성:
  - 방향: ↑ rising / → stable / ↓ declining
  - AI별 인지: GPT ○ / Perplexity ● / Gemini ◐
  - 멘션 피드: NEW / SEEN / LOST
  - 30일 추이 그래프
```

### 점수 변동성 커뮤니케이션

```
AI 답변은 확률적 → 절대값보다 추세(trend) 강조
"72 ± 8 (30일 평균)" 표시 → 변동성을 숨기지 않고 설계에 녹임
"지난주 대비 +12" = 변동 내 상승의 의미
```

---

## 7. 수익화 시나리오

### 확정 가격 구조

| 플랜 | 가격 | 핵심 기능 | 전환 포인트 |
|------|------|-----------|-----------|
| Free | $0 | 1회 체크, 배지 | 즉각 Aha moment |
| Creator | $19/월 | 무제한 체크, 추이 차트, llms.txt, 주간 리포트 | "추이가 보고 싶다" |
| Pro | $49/월 | 경쟁사 추적, API, 다국어 최적화 | "경쟁사보다 앞서고 싶다" |
| Agency | $99+/월 (신규) | 화이트라벨 리포트, 10 클라이언트 | "이걸 고객에게 팔고 싶다" |

### 유료 전환 핵심 후크 (v1.6 업데이트)

1. **처방 엔진** — "점수 27? PH 런치하세요, +15점 예상" = 즉시 행동 유도 → 효과 확인 → 더 깊은 처방은 유료
2. **성장 리포트 + 공유 카드** — "3주만에 27→68!" 공유 → 바이럴 + 유료 전환 ("더 자세한 분석은 Creator 플랜")
3. **처방 이행 추적** — 체크리스트 + 효과 히스토리 = 시계열 Lock-in. "내 처방 기록이 여기 있으니 못 떠남"
4. **경쟁사 벤치마크** — "1위 Semrush는 PH+HN+Reddit 활동. 당신은 0건" = 위기감 → 결제

### 6개월 MRR 시나리오

| 시나리오 | 6개월 MRR | 12개월 MRR | 조건 |
|---------|-----------|-----------|------|
| 보수적 (Creator만) | $1,900 | $9,500 | 전환율 5%, 2,000 무료 사용자 |
| 중립 (하이브리드) | $3,800 | $19,000 | Creator + Agency 동시 |
| 낙관 (PH 대박) | $8,000+ | $30,000+ | PH Top 5 + 바이럴 |

---

## 8. 경쟁 지형과 대응

### 직접 경쟁

| 경쟁사 | 가격/월 | 위협도 | 우리 대응 |
|--------|---------|--------|-----------|
| Otterly AI | $29~989 | 높음 | 크리에이터 전용 포지셔닝 + 무료 진입 |
| Profound | $500+ | 낮음 | 시장 분리 (Fortune 500 vs 크리에이터) |
| Goodie AI | TBD | 중간 | Micro-SaaS 래더 2단계에서 경합 |
| Durable | 무료 | 낮음 | 로컬 비즈니스 vs 디지털 제품 |

### 간접 경쟁 (가장 위험)

| 경쟁사 | 시나리오 | 대응 |
|--------|---------|------|
| Semrush | GEO 기능 통합 | 크리에이터 채널 없음. 우리 배지가 이미 깔려있으면 침투 불가 |
| Ahrefs | AI 벤치마크 | 가격 $129+. 인디 크리에이터 접점 없음 |

### 방어 원칙

```
속도 > 기술. 먼저 1,000개 배지를 까는 자가 승리한다.
크리에이터 생태계 안에서의 브랜드 = 기술보다 강한 Moat.
```

---

## 9. 기술 방향

### 현재 (Phase 1.5, ENGINE-07 UnifiedScore 가동 중)
```
Tavily 웹검색(1~3쿼리) + Gemini Relay + Perplexity API → 4차원 단일 점수
월 비용: ~$10 (Perplexity $10 · Tavily 기존 예산 · Gemini Relay 무료)
```

**스코어 구조 — ENGINE-07 UnifiedScore (빅파이 1.5, 2026-04-17 CEO 확정)**
```
4차원 단일 체계 (수학적 일관성 보장: sum == final):
  Direct Recognition  35점 — Gemini+Perplexity "Know & Recommend" 이분법
  Category Ranking    35점 — "best {category}" 쿼리 Top-10 등장 + 순위
  Co-Recommendation   20점 — probe_logs 누적 파싱 + 연결 제품 수
  Web Authority Proxy 10점 — Tavily Tier-1/2 citation (SEO→AI 전환 지표)
  ─────────────────────────────────────────────
  합계                100점 (수학적 보장)

Pass Indicator (보조):
  🏆 PERFECT: signal 4+ AND score ≥60
  🟢 STRONG:  signal 2+ AND score ≥35
  🟡 EMERGING: signal 1+ AND score ≥15
  🔴 INVISIBLE: 나머지

Tavily 크레딧 관리 (TAVILY-CRON-LITE-01, 2026-04-23):
  cron 자동 경로: 1쿼리/제품 (크레딧 보호)
  manual /v1/check: 3쿼리/제품 (UX 우선)
```

**Volume Metrics — 빅파이 1.5.1 (2026-04-22 추가)**
```
probe_logs 테이블 기반 7지표 누적 (추가 비용 $0):
  mentions · recognition_rate · category_hits · citation_count
  source_diversity · corec_degree · total_probes

→ Score(상대) + Volume(절대) 이원 진단 = GSC impression+CTR 구조
→ Moat 핵심: probe_logs 누적 데이터는 복제 불가 자산
```

**AI Probe — 5대 AI 전체 커버 (2026-04-21 CEO 확정 포지셔닝)**
```
표준 커버: GPT · Gemini · Claude · Grok · Perplexity 5대 AI

[베타 가동 (무료 범위 내)]
Gemini: Relay Worker (자체 운영, 무료)
Perplexity Sonar: 공식 API (기존 $10 예산 내)

[빅파이 2.0 정식 (유료 자체 부담)]
GPT (OpenAI 4o): 공식 API
Claude (Anthropic): 공식 API
Grok (xAI): 공식 API

실험 결과 (2026-04-08, 2엔진 기준):
- Perplexity: pickedby.ai 상세 인지 (점수체계·5차원·타겟까지 정확 설명)
- GPT: pickedby.ai 모름 (학습데이터 cutoff 한계)
- 카테고리 추천: GPT=전통SEO, Perplexity=GEO전문도구 (겹침 0%)
→ "어떤 AI에서 보이고 어떤 AI에서 안 보이는지"를 5대 전체에서 비교하는 것 자체가 핵심 가치
```

**아키텍처 (ENGINE-05 + AI Probe)**
```
병렬 실행:
  Tavily → Web Presence Score (웹 근거 분석)
  Perplexity Probe → AI Knowledge Check (실시간 AI 인지 + citations)
  GPT Probe → Training Data Check (학습 데이터 인지)

결합 → AI Visibility Score + Mention Feed
```

**멘션 피드 (제품 핵심 전환)**
```
AS-IS: 점수 계산기 (체크→점수→끝)
TO-BE: AI Search Console (멘션 피드→추이→행동→결과 루프)

- Tavily URL + Perplexity citations → mentions 테이블 저장
- 주간 diff: NEW / SEEN / LOST 감지
- Dashboard: 피드 + 추이 차트 + AI별 인지 현황
- 이메일: "이번 주 새 멘션 N건" → 재방문 트리거
```

**배지 디자인 (2026-04-07 개편)**
```
크라운 아이콘 + 티어 라벨 + 스코어 숫자 + pickedby.ai 브랜딩
배지는 Verified Owner(소유권 인증)한 제품에만 잠금 해제
```

**Dashboard 3탭 구조 (2026-04-07 확정)**
```
Tab 1: My Products  — 최대 5개, Refresh 48h 쿨다운, 소유권 인증
Tab 2: Competitors  — 하루 100회 검색 카운터
Tab 3: Tools        — Badge Embed + llms.txt Generator (인라인)
(Phase 2 추가: Mention Feed 탭 or My Products 내 피드 섹션)
```

### Phase 2 추가
```
+ 멘션 피드 (Tavily + Perplexity citations 기반)
+ 주간 자동 체크 (Cron Worker) + 멘션 diff
+ llms.txt 자동생성 (LLM-03)
+ SDK v0.1 (dynamic badge + impression 카운트)
+ 점수 변동 사유 = 멘션 diff 기반 (LLM 해석 불필요)
```

### Phase 3 추가
```
+ ~~직접 AI API 쿼리~~ → Phase 1.5로 앞당김 완료
+ Gumroad/LemonSqueezy API 연동
+ 카테고리 벤치마크 DB
+ Agency 화이트라벨
```

### 기술 원칙 (불변)
```
점수 = 코드 (증거 기반, 결정적)
LLM = 해석 · 조언 · 생성만
AI Probe = ground truth 보조 (프록시가 아닌 직접 확인)
```

---

## 10. 핵심 가설과 검증 방법

| # | 가설 | 검증 방법 | 성공 기준 | 시기 |
|---|------|-----------|-----------|------|
| H1 | 크리에이터는 AI 가시성을 걱정한다 | Reddit/PH 반응 | 1,000+ 무료 체크 | ✅ 검증 중 |
| H2 | 배지가 바이럴을 만든다 | 배지 embed → GA4 referral 추적 | 100+ 배지 embed | 4~5월 |
| H3 | 점수 추이가 리텐션을 만든다 | Creator 플랜 30일 retention | 30일 retention 60%+ | 6~7월 |
| H4 | llms.txt가 유료 전환을 만든다 | Free→Creator 전환율 | 전환율 5%+ | 6~7월 |
| H5 | SDK가 전환비용을 만든다 | SDK 설치 후 이탈률 | 이탈률 < 10%/월 | 8~9월 |
| H6 | Agency가 ARPU를 올린다 | Agency 플랜 매출 | ARPU $99+ | 10~12월 |

---

## 11. 리스크 매트릭스

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| Semrush/Ahrefs GEO 기능 출시 | 높음 | 높음 | 배지 네트워크 선점 속도 경쟁 |
| 크리에이터 지불의향 낮음 | 중간 | 높음 | Agency 래더로 ARPU 확보 |
| AI 알고리즘 변동 | 높음 | 중간 | 다중 소스(Tavily+LLM) 구조 |
| 유료 전환율 < 2% | 중간 | 높음 | llms.txt 가치 강화 + 점수 0 사용자 타겟 |
| 팀 규모 한계 | 확실 | 중간 | AI 코딩 에이전트 최대 활용 |

---

## 12. 로드맵 (이 문서가 관리하는 최상위 타임라인)

| 시기 | 마일스톤 | Moat 기여 |
|------|---------|-----------|
| **2026-04 W1~2** | ✅ 빅파이 1.5 ENGINE-07 + 4차원 스코어 안정화 | 측정 신뢰성 |
| **2026-04 W2** | ✅ BLOG-SEO 블로그 18편 + IH/Reddit 런칭 | SEO 트래픽 기반 |
| **2026-04 W2~3** | ✅ D1~D6 Trend·Journey·Volume·Overview 12FULL 구현 | Layer 1: 시계열 Lock-in |
| **2026-04-29** | ✅ D11 DEPLOY-GATE-01 12/13 PASS + **프로덕션 배포 완료** | 제품 완성도 |
| **2026-05 W1~2** | **빅파이 1.6 처방 엔진 (Phase 2a/b)** — 진단+처방+이행추적+이메일 | **Growth Loop 핵심** |
| **2026-05 W3** | **Phase 2c** — 배지+성장리포트+바이럴 공유 | Moat Layer 0 |
| **2026-05-15** | 모두의 창업 결과 통보 | 외부 검증 |
| **2026-05** | 빅파이 1.5.2 Sources 스프린트 (sitemap/rss/robots/llms 풀셋) | 처방 완성도 |
| **2026-06** | Creator $19 + Paddle 결제 공개 | 수익화 정식 |
| **2026-06~07** | SDK v0.1 (dynamic badge + impression) | Layer 2: 코드 임베딩 |
| **2026-07** | Agency $99 화이트라벨 + 경쟁사 비교 | 시장 래더 3단계 |
| **2026-08** | SDK v0.2 (클릭 추적 + 전환 correlation) | 데이터 Moat 시작 |
| **2026-09** | 카테고리 벤치마크 리포트 v1 | Layer 3: Creator Graph |
| **2026-10** | 빅파이 2.0 정식 릴리스 (5대 AI 전체 가동) | 제품 완성도 |
| **2026-12** | 시드 펀딩 준비 or 수익성 달성 | 생존 확정 |

---

## 13. 성공과 실패의 기준

### 6개월 후 성공 (2026-10):
```
✅ MRR $5,000+
✅ 배지 embed 1,000개+
✅ 월간 스캔 10,000+
✅ Creator + Agency 두 세그먼트에서 매출
```

### 6개월 후 실패 → 피벗:
```
❌ MRR < $500
❌ 배지 embed < 100개
❌ 유료 전환율 < 2%
→ 피벗 옵션: Agency 전용 전환 / Semrush acqui-hire 타겟
```

---

## 14. 이 문서의 갱신 원칙

```
1. 매 Phase 전환 시 전체 검토
2. 전략적 피벗 시 즉시 갱신
3. 분기 1회 외부 피드백(VC/멘토) 반영
4. Moat 가설 검증 결과에 따라 Layer 우선순위 재조정
5. 로드맵 달성률 매월 체크
```

---

*[CPO] 작성 — 2026-04-07 (데스크탑 Claude)*
*기반: 5AI 피드백 종합 분석 + CEO Moat 전략 토론*
*[PO] v1.2 갱신 — 2026-04-08: 스코어 max 82·등급 임계값·Dashboard 3탭·llms.txt 출시·BLOG-SEO Wave 1·Paddle 전환 (데스크탑 Claude)*
