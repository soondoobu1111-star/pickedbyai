# 빅파이 1.5 — pickedby.ai 제품 전략 마스터 문서
> 작성일: 2026-04-17 | **최종 업데이트: 2026-04-23 (빅파이 1.5.1 Volume Metrics 통합)** | 상태: CEO 승인 완료
> 근거: 2026-04-17 CPO·CEO 재설계 세션 (스코어 버그 발견 → 전면 재설계)
> **1.5.1 추가 (2026-04-22):** Volume Metrics 누적 체계 · probe_logs 7지표 · D6~D11 스프린트 완성
> 이 문서는 빅파이 1.0을 계승·확장하며, 1.0의 미흡 실행을 빈틈없이 구체화합니다.

---

## 변경 요약 (1.0 → 1.5)

| 영역 | 1.0 | 1.5 |
|---|---|---|
| 스코어 구조 | Tavily 5차원 + Probe 병렬 (이원) | **4차원 단일 체계** (수학적 일관성 보장) |
| Probe 전환 | P0 목표만 명시 | **Recognition 35 + Category 35 = 70점 Probe 기반** |
| Co-Rec | P0 "파싱 시작" | **점수 20점 직접 반영** |
| 리텐션 | §8 루프만 개념 | **MLP 훅 7개 + 3탭 차트 구체 설계** |
| 대시보드 | §7 구조 정의 | **섹션 1:1 매칭 구현 로드맵** |
| 비용 원칙 | 무료 3쿼리 상한 | **월 외부 API 비용 증가 $0** 보장 |
| 버전 철학 | "추가식 진화" | **"교체식 진화" (일론 법칙 Step 2)** |

---

## 1. 제품 정의 (2026-04-21 CEO 범위 확장 반영)

**"The Google Stack for AI Recommendations"**

AI 추천 시대의 인프라. **제품과 콘텐츠 모두** AI에서 얼마나 보이는지를
측정(Search Console) → 분석(GA4) → 최적화(Ads) 하는 3단계 플랫폼.

### 측정 단위 (2026-04-21 확장)
- **제품**: SaaS · Gumroad 템플릿 · Etsy 제품 · 모바일 앱 · 브랜드
- **콘텐츠**: 블로그 글 · YouTube 채널/영상 · 뉴스레터(Substack) · 뉴스 기사 · 팟캐스트
- **존재**: 퍼스널 브랜드 · 전문가 프로필 · 크리에이터 정체성

> "Google Search Console이 웹 페이지를 위한 것이라면, pickedby.ai는 **AI 답변에서 발견되기를 원하는 모든 것**을 위한 것이다."

### 한 줄 정의 (KR — 2026-04-21 5대 AI 커버 포지셔닝 반영)
**"AI 추천 시대의 서치콘솔 — 5대 AI(GPT·Gemini·Claude·Grok·Perplexity)가 내 제품·콘텐츠를 추천하는지 측정·분석·최적화하는 플랫폼"**

### 커버리지 원칙 (2026-04-21 CEO 확정)
pickedby.ai는 **5대 AI(GPT·Gemini·Claude·Grok·Perplexity) 모두를 커버**하는 것을 표준 포지셔닝으로 삼습니다. 단일 AI(예: Gemini만) 혹은 2엔진(Gemini+Perplexity만)에 한정된 측정 도구가 아닙니다. 경쟁사가 "Claude 미지원" "GPT 학습데이터 한계" 같은 공백을 갖는 순간, 우리는 5대 전체 커버로 유일한 전체 시야를 제공합니다.

### 카테고리 야망
GSC/GA4가 구글 검색의 측정·분석 표준이듯, pickedby.ai는 **AI 답변 영역의 카테고리 리더**가 되는 것이 목표. 2028년까지 "AI Visibility Platform = pickedby.ai" 인식 형성.

---

## 2. 3단계 로드맵 (1.0에서 불변)

```
┌─────────────────────────────────────────────────────────────┐
│            The Google Stack for AI Recommendations          │
├────────────────────┬────────────────────┬───────────────────┤
│   ✅ Phase 1.5     │   🔜 Phase 2       │   🔮 Phase 3      │
│   MEASURE (완성)   │   ANALYZE          │   OPTIMIZE        │
│                    │                    │                   │
│  Search Console    │  GA4               │  Ads              │
└────────────────────┴────────────────────┴───────────────────┘
```

**Phase 1.5 정의 (신규):** Phase 1의 실질 완성 + MLP 리텐션 확보 단계. 본 1.5 문서의 핵심.

---

## 3. 왜 빅파이 1.5가 필요한가 (버그 발견)

### 빅파이 1.0 P0 "ENGINE-06: Probe → 메인 스코어 전환"의 미흡
- 백엔드에서 Probe 점수 계산은 구현됨 ✅
- **그러나** Tavily 5차원 시스템도 계속 작동 → 두 시스템 공존
- FE(`dashboard.html:1151`)가 조건부로 표시 전환 → **수학적 모순 발생**
- 결과: Notion 42점 / perceptdot 서브스코어 0인데 최종 33점 버그

### 2026-04-17 CEO 직관 포착
> "Notion 점수가 너무 낮은거 같은데 맞는건가;"

이 한 마디가 재설계를 트리거했습니다. CEO 감각이 측정 도구의 본질(**신뢰**)을 지켰습니다.

### 교훈: 추가하지 말고 교체하라
빅파이 1.0에서 Probe를 "추가"한 것이 문제의 근원이었습니다. 1.5는 **"교체"**를 원칙으로 합니다.

---

## 4. 새 스코어 시스템 (4차원 단일)

### 4-1. 구조

| # | 차원 | 만점 | 측정 방식 |
|---|---|---|---|
| 1 | **Direct Recognition** | 35 | Gemini + Perplexity "Know & Recommend" 이분법 |
| 2 | **Category Ranking** | 35 | `best {category}` 쿼리 Top-10 등장 + 순위 |
| 3 | **Co-Recommendation Graph** | 20 | `probe_logs` 누적 파싱 (빅파이 1.0 P0 실현) |
| 4 | **Web Authority Proxy** | 10 | Tavily Tier-1/2 citation (SEO→AI 전환 지표) |
| **합계** | | **100** | 수학적 보장: sum == final |

### 4-2. 원칙 5가지
1. **단일 시스템** — 이원 시스템 금지
2. **Probe 중심** — 70점이 AI 직접 측정
3. **공식 공개** — `/methodology` 페이지 신설
4. **이진 지표 병기** — Pass Indicator + 2D Quadrant + Engine Grades
5. **골든 케이스 테스트** — `score.test.ts` 재발 방지

### 4-3. 보조 시각화 (점수 미관여)
- **Pass Indicator**: 🏆 PERFECT / 🟢 STRONG / 🟡 EMERGING / 🔴 INVISIBLE
- **2D Quadrant**: X=Recognition, Y=Category Position
- **Engine Grades**: Gemini A, Perplexity B 개별 배지

---

## 4-4. Volume Metrics 누적 체계 (빅파이 1.5.1, 2026-04-22 추가)

> probe_logs 기반 절대 볼륨 측정 — 점수(상대)와 볼륨(절대) 이원 시스템

### 볼륨 지표 7개

| 지표 | 정의 | 집계 단위 |
|------|------|-----------|
| `mentions` | AI 답변에서 제품 언급 횟수 | probe_logs row 수 |
| `recognition_rate` | 전체 probe 중 인식된 비율 | % |
| `category_hits` | 카테고리 쿼리 Top-10 등장 횟수 | 회 |
| `citation_count` | Web Authority 인용 사이트 수 | 개 |
| `source_diversity` | 인용 소스 다양성 | 고유 도메인 수 |
| `corec_degree` | Co-Recommendation 연결 제품 수 | 개 |
| `total_probes` | 총 probe 실행 횟수 | 회 |

### Volume vs Score 구분

```
Score (상대): Recognition 35 + Category 35 + CoRec 20 + Web 10 = 0~100
Volume (절대): mentions/recognition_rate/category_hits/citation_count/... 누적값

"내 점수가 70이고, 지난 7일간 AI 멘션이 23회다" = 상대+절대 양면 진단
```

### Volume Trend 3탭

| 탭 | 집계 | 시각화 |
|----|------|--------|
| Daily | 1일 bucket × 30 | Chart.js 4 layer overlay |
| Weekly | 7일 bucket × 12 | 12주 추이 |
| Monthly | 30일 bucket × 12 | 12개월 장기 |

**설계 상세**: `docs/outputs/volume_metrics_design_20260422.md`

---

## 5. 측정 AI 플랫폼 — 5대 AI 커버 (2026-04-21 CEO 확정)

### 최종 표준: 5대 AI 전체 커버
GPT · Gemini · Claude · Grok · Perplexity 5대 AI **전체**를 측정 대상으로 삼는 것이 pickedby.ai의 표준 포지셔닝입니다. 부분 커버(2~3엔진)는 단계적 실행 경로일 뿐, 최종 제품 정의는 5대 전체입니다.

### Phase 1.5 베타 (현재, 무료 범위 내 운영)
| AI | 방식 | 비용 |
|---|---|---|
| Gemini | Relay Worker | 무료 (자체 운영) |
| Perplexity | 공식 API | $10 기존 예산 내 |

### 빅파이 2.0 정식 릴리스 (5대 AI 전체 가동, 자체 부담)
| AI | 방식 | 추가 시점 |
|---|---|---|
| GPT (OpenAI 4o) | 공식 API | 정식 런칭 |
| Claude (Anthropic) | 공식 API | 정식 런칭 |
| Grok (xAI) | 공식 API | 2주 후 검증 후 |

### 메시징 규칙
- **외부 카피(랜딩·지원서·마케팅)**: 항상 "5대 AI(GPT·Gemini·Claude·Grok·Perplexity) 커버" 표기. 단일·2엔진 한정 서술 금지.
- **기술 문서·내부 세션 기록**: 현 단계 실제 가동 엔진 명시 허용 (예: "베타 2엔진 Gemini+Perplexity").
- **무료 / 유료 분리 (v2.0 이후)**: 무료 티어 = Gemini+Perplexity 2엔진. 유료 티어 = 5대 AI 전체.

### 엔진 추가 시 점수 호환성
정식 v2.0 런칭 = **명시적 버전 전환 이벤트**. 전체 재계산 + 공지. 유저 혼란 방지를 위해 버전 단절을 의도적 마일스톤으로 처리.

---

## 6. MLP 리텐션 7훅 (빅파이 1.0 §8·§9 구체화)

### Hook 1: Daily Pulse 카드
- 매일 AI 자동 생성 한 줄 스토리
- 예: "Your score moved +3 overnight. Gemini started recommending you for best Next.js boilerplate queries."
- 아침 8시 이메일 자동 전송 (Brevo)

### Hook 2: 3탭 차트
- **Daily**: 최근 14일 라인
- **Weekly**: 최근 12주 이동평균 (AI 비결정성 흡수)
- **Monthly**: 최근 12개월 장기 트렌드
- 엔진별 오버레이 토글

### Hook 3: Movement Feed
- 타임라인형 서사
- "Day 17 — Entered Top 10 for 'productivity app'"
- 각 항목 스크린샷·트윗 재료

### Hook 4: Action Items (빅파이 1.0 §8 액션 구성요소)
- AI 자동 생성 "오늘 할 일" 3개
- 유료 전환 훅으로 기능 (더 깊은 Action은 Pro 기능)

### Hook 5: Streak 시스템
- 연속 측정 / 점수 상승 / Trifecta 달성
- 🔥 이모지 + 숫자

### Hook 6: Milestones 배지
- "First Gemini Recommendation" / "Score 50 Crossed"
- 영구 수집 → 돌아올 이유 축적

### Hook 7: Weekly Digest Email
- 월요일 8시 자동 발송
- 지난주 하이라이트 3줄 + 이번주 Top Action 3

---

## 7. 대시보드 구조 (빅파이 1.0 §7 구현)

1.0 §7의 7개 섹션과 **1:1 매칭**:

```
pickedby.ai Dashboard (v1.5)
│
├── 📌 개요 (Overview)
│   ├── Daily Pulse 카드 (Hook 1)
│   ├── 4차원 점수 카드 (Recognition 35 / Category 35 / CoRec 20 / Web 10)
│   └── Pass Indicator + Quadrant + Engine Grades
│
├── 📈 실적 (Performance)
│   ├── 3탭 차트 (Daily / Weekly / Monthly) (Hook 2)
│   └── 엔진별 오버레이 (Gemini / Perplexity)
│
├── 🎯 AI 커버리지 (Coverage)
│   ├── 플랫폼별 인식 ✅❌
│   ├── 쿼리 카테고리별 커버리지
│   └── 미발견 쿼리 → 개선 포인트
│
├── 🌊 트래픽 (Direct Traffic) [Phase 2 SDK]
│   └── 현재: "Install SDK for deeper data" CTA
│
├── ⚔️ 경쟁사 (Competitors)
│   ├── Co-Recommendation Graph 시각화
│   └── 2D Quadrant 카테고리 내 랭킹
│
├── 🔗 소스 (Sources)
│   ├── Tier-1/2/3 언급 사이트
│   └── AI 인용 vs 일반 소스 구분
│
├── 📣 Movement Feed (Hook 3)
│
├── 🎬 개선 가이드 (Improvements) — Action Items (Hook 4)
│
└── 🏆 Milestones & Streak (Hook 5, 6)
```

---

## 8. 인사이트 → 액션 루프 (빅파이 1.0 §8 구체화)

```
[측정]      Today's score: 62 (↓3 overnight)
            Gemini dropped you from "best note apps" list
    ↓
[인사이트]  Daily Pulse: "Gemini no longer recognizes you.
            Last known recommendation: 3 days ago."
    ↓
[액션]      Action Items (Hook 4):
            1. Publish a Gemini-optimized FAQ page
            2. Get mentioned on HN this week (Web Authority +3)
            3. Reply to 5 Reddit threads in your category
    ↓
[재측정]    Tomorrow's cron runs automatically
    ↓
[결과]      Movement Feed: "Day 19 — Gemini re-recognized you.
            Score recovered to 67."
    ↓
[Streak]    🔥 3-day recovery streak activated
```

이 루프가 **재방문 훅이자 유료 전환 동기**입니다.

---

## 9. MLP Aha Moment (빅파이 1.0 §9 확장)

### 1.0 정의
> "Perplexity에서 'best AI tools' 검색 시 상위 5개에 포함되지 않습니다.
>  경쟁사 Figma는 포함됩니다. 이렇게 바꾸면 됩니다: [3가지 액션]"

### 1.5 확장 구현
- **Daily Pulse 카드** = 매일 갱신되는 Aha Moment
- **Action Items** = 3가지 액션 자동 생성
- **Category Ranking** = "Top 5 포함 여부" 측정 (35점)
- **Co-Recommendation Graph** = "경쟁사 Figma 포함" 증거

빅파이 1.0의 문장이 1.5에서 **실제 UI로 구현**됩니다.

---

## 10. 실행 우선순위 (2026-04-23 최신화)

### ✅ Phase 1 완료 (D1~D6, 04-18~04-23)
| ID | 작업 | 완료 |
|---|---|---|
| **SCORE-UNIFY-01~03** | 4차원 단일 함수 · score_snapshots · FE 이원 제거 | ✅ 04-18 |
| **CHART-01** | 3탭 차트 (일/주/월) = D6 TREND-01로 구현 완료 | ✅ 04-22 |
| **PULSE-01** | Daily Pulse 카드 (Overview §1) | ✅ 04-22 |
| **TEST-01** | `score.test.ts` 14테스트 전수 PASS | ✅ 04-22 |
| **D6 TREND-01** | `/v1/scores/trend` 3탭 + Trend Pane UI | ✅ 04-22 |
| **D6 JOURNEY-01** | Hero's Arc 4단계 + Timeline | ✅ 04-22 |
| **D6 VOLUME-01** | `/v1/scores/volume` 7지표 + Volume Pane | ✅ 04-22 (1.5.1) |
| **D5 OVERVIEW 12FULL** | 12개 섹션 풀셋 | ✅ 04-21 |
| **ONBOARD-01** | 온보딩 3스텝 + 자동체크 + 5회 재시도 | ✅ 04-18 |
| **TAVILY-CRON-LITE-01** | cron 3→1쿼리 (크레딧 보호) | ✅ 04-23 |

**스테이징 최종 버전:** API `4fc2f190` · FE `e61011c3` (BUG-PULSE-DELTA-01 포함)
**프로덕션 버전:** API `1e52e42b` (TAVILY-CRON-LITE-01 예외 선반영) · FE 변경 없음

---

### 🔄 진행 중 / 예정 스프린트 (D7~D11)

| Day | ID | 작업 | 날짜 |
|-----|---|---|---|
| **D7** | **PROBE-REDESIGN-01** | D안 역방향 스무고개 · `probeRedesign.ts` + `probeCache.ts` | 04-24 |
| **D8** | **RIVALS-01 + GT-01** | Rivals 탭 + Sankey 시각화 + Fallback + GT 10개 실측 | 04-25 |
| **D9a/b** | **LAND-SHIFT-01~07** | 랜딩 리뉴얼 + Turnstile + /changelog | 04-26~27 |
| **D10** | **MOBILE-01** | 모바일 반응형 전수 | 04-28 |
| **D11** | **DEPLOY-GATE-01** | 13개 기준 + CEO 검증 → 프로덕션 배포 🔴 | 04-29 |

**상세 스펙:** `docs/outputs/d7_probe_redesign_spec_20260422.md`

---

### DEPLOY-GATE-01 — 배포 전 13개 기준 (D11 게이트)

> 이 기준을 모두 통과하기 전까지 프로덕션 배포 금지 (CEO 확정 2026-04-21)

| # | 기준 | 확인 방법 |
|---|------|----------|
| 1 | sum(dimensions) === finalScore (수학 일관성) | `score.test.ts` Math 테스트 |
| 2 | Pass Indicator B안 공식 검증 | `score.test.ts` 6 Pass 테스트 |
| 3 | 14/14 vitest PASS | `npx vitest run` |
| 4 | tsc 에러 0 | `npx tsc --noEmit` |
| 5 | Trend 3탭 렌더링 정상 | Playwright DOM 확인 |
| 6 | Journey 4단계 렌더링 정상 | Playwright DOM |
| 7 | Volume 3탭 렌더링 정상 | Playwright DOM |
| 8 | Overview 12섹션 렌더링 정상 | Playwright DOM |
| 9 | GT-01: T1 3/3 제품 점수 80+ | 수동 실측 |
| 10 | API 401 인증 가드 정상 | curl 검증 |
| 11 | cron KST 00:01 자동 실행 증거 | Supabase scores row 확인 |
| 12 | CEO 직접 3개 제품 검증 PASS | CEO 스크린샷 승인 |
| 13 | Rivals 탭 기본 동작 | D8 완료 후 확인 |

---

### 📋 P2 (Phase 2 연결 — 빅파이 1.0 계승)
| ID | 작업 |
|---|---|
| **FEED-01** | Movement Feed 타임라인 (Hook 3) |
| **ACTION-01** | Action Items AI 생성 (Hook 4) |
| **STREAK-01** | Streak 시스템 (Hook 5) |
| **BADGE-01** | Milestones 배지 (Hook 6) |
| **EMAIL-DIGEST-01** | Weekly Digest Email (Hook 7) |
| **METHOD-01** | `/methodology` 공개 페이지 |
| SDK-01 | AI 레퍼러 감지 경량 스크립트 |
| GA4-01 | GA4 OAuth 연동 |

---

## 11. 비용·리소스 제약 (엄격)

### 무료 범위 내 운영 (베타 기간)
| 항목 | 한도 | 현재 |
|---|---|---|
| Gemini Relay | 일 1,500 요청 | 일 ~400 예상 (여유) |
| Perplexity API | 월 $10 | 월 ~$8 예상 |
| Tavily | 기존 예산 | 유지 |
| **월 외부 API 증가분** | **$0** | ✅ **절대 준수** |

### 정식 릴리스 후
- ChatGPT/Claude/Grok 추가 → 회사 자체 부담
- 유료 티어 가격이 API 비용 pass-through 커버
- 무료 유저는 계속 Gemini + Perplexity만

---

## 12. 리스크 & 대응 (1.5 업데이트)

| 리스크 | 심각도 | 대응 |
|---|---|---|
| **AI 비결정성 점수 변동 ±10** | 🔴 | 7일 이동평균 기본 탭 |
| **Ground Truth 가정 오류** | 🟡 | 수동 실측 우선, 가정 조정 가능 |
| **구현 시간 초과 (20h → 30h)** | 🟡 | Phase별 게이트 엄격 |
| **베타 100명 점수 급변 컴플레인** | 🟡 | 전환 공지 + 이력 유지 |
| Co-Rec 신규 제품 0점 | 🟢 | 신규 7일 가중치 동적 조정 |
| Probe API 단일 실패점 | 🟢 | 24h 캐시 폴백 |

---

## 13. 재발 방지 3중 장치

### 13-1. 단위 테스트 (`score.test.ts`)
```typescript
it('서브스코어 합은 최종 점수와 정확히 일치한다', () => {
  const r = computeUnifiedScore(...)
  expect(r.dimensions.reduce((a,d)=>a+d.score,0)).toBe(r.score)
})
```

### 13-2. 배포 전 훅
- `scripts/pre-deploy-score-check.sh`
- 테스트 실패 시 배포 차단

### 13-3. 프로덕션 모니터링
```typescript
if (Math.abs(sumOfDims - finalScore) > 0.1) {
  console.error(`[SCORE_MISMATCH] ...`)
}
```

---

## 14. 네이밍

- 이 문서: **빅파이 1.5**
- 스코어 엔진: **ENGINE-07 (UnifiedScore)** — ENGINE-06의 실질 완성
- SDK: **PBA SDK v1** (Phase 2)
- GA4 연동: **Analytics Bridge** (Phase 2)
- 정식 릴리스: **빅파이 2.0** (SDK + GA4 + 5엔진 유료)

---

## 15. 영구 교훈 (재발 방지 원칙)

1. **추가하지 말고 교체하라** (일론 법칙 Step 2)
2. **업계 베끼기 전에 본질을 찾아라** (Otterly 2축 vs HubSpot 5축)
3. **"덜 측정"이 "더 정확"일 수 있다** (저품질 차원 = 노이즈)
4. **보유 무료 자산을 먼저 조사하라** (Gemini Relay 과소평가 방지)
5. **시작점 은유가 최종 설계를 결정한다** (Search Console 은유 → Tavily 중력)
6. **CEO 직관이 수학보다 빠른 순간이 있다** (Notion 42점 의심)
7. **모든 전제를 뒤엎는 검증을 반복하라** (5개 극단 대안 → 1개 보조 채택)
8. **근본 수정 기준 = "컴포넌트 존재 이유 유지"** — signal AND score 양쪽 증거 일관성 (BUG-PASS-INDICATOR-01)
9. **테스트 인프라는 복리 자산이다** — 14 테스트가 이후 모든 수정의 안전망이 됨
10. **probe_logs는 이미 쌓고 있었음** — 추가 API 비용 $0으로 Volume Metrics 구현. "무료 자산 먼저" #4 재확장
11. **GSC impression+CTR 모델** — Volume(절대)과 Score(상대) 이원 시스템은 GSC의 impression/CTR과 같은 구조
12. **0점은 "안 측정"과 다르다** — `breakdown.status` 메타를 버리지 말 것. 측정 실패는 측정 실패로 표현
13. **무료 인프라 두 번 쓰기** — Gemini Relay를 Probe + Category Hint Rescue 양쪽 재활용, 비용 $0
14. **외부 API 사용량 알림은 과금 전조** — PAYGO 확인 먼저. Tavily 83% 경고 → cron lite 전환으로 $0 과금 회피
15. **Cron 표현식 간 1분 이상 오프셋 필수** — BUG-CRON-CONFLICT-01: 두 cron이 정각 동시 매칭 시 event.cron 오염. 1분 오프셋으로 회피

---

## 16. 다음 체크포인트 (2026-04-23 업데이트)

- ~~04-19 (토): Phase 1 스테이징 배포 + CEO 검증~~ → ✅ **D1~D6 전 완료 (04-18~04-23)**
- **04-24 (목)**: D7 PROBE-REDESIGN-01 (역방향 스무고개 BE)
- **04-25 (토)**: D8 Rivals + GT-01 10개 실측 (T1 3/3 80+ 기준)
- **04-26~27 (일~월)**: D9 랜딩 리뉴얼 (LAND-SHIFT + Turnstile + /changelog)
- **04-28 (화)**: D10 모바일 전수
- **04-29 (수)**: D11 DEPLOY-GATE-01 13개 기준 + CEO 검증 → **프로덕션 배포 🔴**
- **05-01~**: 빅파이 1.5.2 Sources 스프린트 (sitemap/rss/robots/llms.txt 풀셋)
- **05-15 (목)**: 모두의 창업 2026 지원서 마감 (현재 설계가 핵심 재료)
- **05-31**: 이메일 1,000개 목표 / Product Hunt 런칭 게이트
- **마케팅 재개 조건**: GT T1 3/3 80+ + 수학검증 + DEPLOY-GATE-01 통과 + CEO 직접 검증

---

*빅파이 1.5 — 2026-04-17 CPO·CEO 재설계 세션 기록*
*계승: 빅파이 1.0 / 다음 버전: 빅파이 2.0 (정식 릴리스 + 5엔진)*
*백업 태그: stable-20260417-pre-redesign*
