# 빅파이 1.0 — pickedby.ai 제품 전략 마스터 문서
> 작성일: 2026-04-15 | 상태: CEO 승인 대기
> 근거: 2026-04-15 CPO·CEO 전략 세션 (대화 전체 내용 반영)
> 이 문서는 vision-brief-v2.0을 계승하며 구체적 실행 전략을 추가합니다.

---

## 1. 제품 정의 (불변)

**"The Google Stack for AI Recommendations"**

AI 추천 시대의 인프라. 브랜드·스타트업·디지털 제품이 AI에서 얼마나 보이는지를
측정(Search Console) → 분석(GA4) → 최적화(Ads) 하는 3단계 플랫폼.

---

## 2. 3단계 로드맵

```
┌─────────────────────────────────────────────────────────────┐
│            The Google Stack for AI Recommendations          │
├────────────────────┬────────────────────┬───────────────────┤
│   ✅ Phase 1       │   🔜 Phase 2       │   🔮 Phase 3      │
│   MEASURE          │   ANALYZE          │   OPTIMIZE        │
│                    │                    │                   │
│  Search Console    │  GA4               │  Ads              │
│                    │                    │                   │
│  AI가 나를         │  AI가 보낸         │  AI 추천          │
│  추천하는가?       │  트래픽이          │  최적화 + 구매    │
│                    │  전환되는가?       │                   │
│  · Probe 스코어    │  · SDK 트래픽      │  · llms.txt 최적화│
│  · 쿼리 커버리지   │  · GA4 연동        │  · AI 플랫폼 API  │
│  · AI별 인식       │  · 퍼널 분석       │  · 자동 개선 제안 │
│  · 소스 분석       │  · 코호트 분석     │  · 입찰/노출 관리 │
└────────────────────┴────────────────────┴───────────────────┘
```

---

## 3. 핵심 문제 인식 — 현재 정확도 이슈

### 현재 구조의 한계
```
현재: Tavily 웹 신호 → 5차원 계산 → 점수
문제: AI 추천과 직접적 관계 없음. 간접 추정.
```

### 제1원칙 (일론머스크) 적용 결론
```
AI 가시성 = AI에게 직접 물었을 때 내 제품이 언급되는 확률

새 공식: Score = (언급된 Probe 수) ÷ (전체 실행 Probe 수) × 100
```

추정이 아니라 직접 측정. 이것이 ENGINE-06의 방향.

---

## 4. 기술 아키텍처 — 3레이어

### Layer 1: Probe 기반 스코어 (ENGINE-06)
```
즉시 (3초)   → 3개 쿼리 빠른 추정치
백그라운드   → 20개 템플릿 크론 누적
대시보드     → "7/20 쿼리에서 발견 (35%)"
```

현재 20개 쿼리 템플릿 (5개 카테고리 × 4개):
- product_knowledge: AI가 제품을 알고 있는가
- best_in_category: 카테고리 최고 제품 추천 시 등장하는가
- alternative_to: 대안 제품으로 언급되는가
- recommendation: 추천 요청 시 등장하는가
- comparison: 경쟁사 비교 시 언급되는가

### Layer 2: SDK — 직접 AI 트래픽 측정
```html
<script src="https://cdn.pickedby.ai/sdk.js" data-key="PRODUCT_KEY"></script>
```

측정 내용:
- document.referrer에서 AI 플랫폼 감지 (chatgpt.com, perplexity.ai, gemini.google.com...)
- AI 크롤러 User-Agent 감지 (GPTBot, PerplexityBot, ClaudeBot...)
- 실제 AI 유입 트래픽 수치 → 대시보드 전송

### Layer 3: GA4 연동 (Phase 2)
- OAuth로 유저의 GA4 연결
- GA4가 (direct)로 잡는 AI 트래픽을 분리해서 보여줌
- "AI 채널이 전체 트래픽의 8.3%, 전년 대비 +527%"
- AI 스코어 변동과 실제 트래픽 상관관계 증명

---

## 5. AI 측정 가능 플랫폼

### 현재 (3개)
| AI | 방식 |
|----|------|
| Perplexity | 공식 API (메인) |
| ChatGPT (GPT-4o) | 공식 API |
| Gemini | Relay Worker |

### 추가 예정 (유료화 연동)
| AI | 조건 |
|----|------|
| Claude (Anthropic) | 유료 플랜 전용 (API 비용 → 유저 부담) |
| Grok (xAI) | 유료 플랜 전용 |

### 비용 전략
- 무료: 3개 AI 종합 스코어 (현재 유지)
- 유료: AI별 개별 점수 분해 + 더 많은 AI 플랫폼

---

## 6. llms.txt 한계 돌파 — 연구 과제

### 현재 한계
AI는 추론 중 URL을 직접 클릭하지 않음.

### 돌파 방향 3가지

**A. AI 크롤러 감지 (즉시 가능)**
- Perplexity·GPT가 실시간 웹검색 시 알려진 UA로 크롤링
- 우리 SDK로 GPTBot, PerplexityBot 방문 감지
- "PerplexityBot이 이번 주 귀하의 페이지를 3회 크롤했습니다"

**B. SDK 레퍼러 포착 (가장 강력)**
- AI 추천 → 사람이 클릭 → document.referrer = "perplexity.ai"
- 이것이 실제 AI → 사람 → 사이트 경로의 직접 증거

**C. 허니팟 URL (연구 과제, 3주 내 PoC)**
- llms.txt에 외부 어디에도 없는 유니크 URL 심기
- 해당 경로로 오는 트래픽 = AI가 읽고 인용한 증거
- AI 에이전트(browsing 모드)는 실제로 URL fetch 수행

---

## 7. 대시보드 메뉴 구조 (목표 상태)

Google Search Console을 벤치마크한 AI 전용 콘솔:

```
pickedby.ai Dashboard
│
├── 개요 (Overview)
│   └── 종합 AI 스코어 + 주간 변동 + 핵심 인사이트 3줄
│
├── 실적 (Performance)
│   ├── 쿼리별 등장률 (어느 질문에서 보이는가)
│   ├── AI 플랫폼별 성과 (Perplexity: 35% / GPT: 12% / Gemini: 8%)
│   └── 시간대별 트렌드
│
├── AI 커버리지 (Coverage)
│   ├── 플랫폼별 인식 여부 ✅❌
│   ├── 쿼리 카테고리별 커버리지
│   └── 미발견 쿼리 목록 → 개선 포인트
│
├── 트래픽 (Direct Traffic) [SDK 설치 후]
│   ├── AI 레퍼러별 방문자 수
│   ├── AI 크롤러 감지 횟수
│   └── GA4 연동 시 전체 채널 대비 AI 비중
│
├── 경쟁사 (Competitors)
│   ├── 같은 쿼리에서 공동 추천된 제품
│   └── 내 스코어 vs 경쟁사 비교
│
├── 소스 (Sources)
│   ├── 나를 언급하는 사이트 목록
│   └── AI가 인용하는 소스 vs 그렇지 않은 소스
│
└── 개선 가이드 (Improvements)
    ├── 우선순위 TOP 3 액션
    ├── 차원별 상세 개선 방법
    └── "이걸 하면 스코어가 +X점 예상"
```

---

## 8. 인사이트 → 액션 루프 (MLP 핵심)

단순 차트가 아니라 측정 → 인사이트 → 액션 → 재측정 루프:

```
[측정]   Source Authority 3/20 — 2개 도메인만 언급
    ↓
[인사이트] AI는 신뢰 소스가 많은 제품을 우선 추천합니다.
           경쟁사 Figma는 47개 도메인에서 언급됩니다.
    ↓
[액션]   1. Product Hunt 등록 → +2~3 도메인 예상
         2. Indie Hackers 포스팅 → +1 도메인
         3. G2/Capterra 프로필 → +2 도메인
    ↓
[재측정] 2주 후 자동 재측정 후 알림
    ↓
[결과]   "Source Authority 12/20으로 개선. 스코어 +24점"
```

이 루프가 재방문 훅이자 유료 전환 동기입니다.

---

## 9. MLP 정의

**MLP Aha Moment:**
> "Perplexity에서 'best AI tools' 검색 시 상위 5개에 포함되지 않습니다.
>  경쟁사 Figma는 포함됩니다.
>  이렇게 바꾸면 됩니다: [3가지 액션]"

숫자가 아니라 스토리. 이것이 MVP와 MLP의 차이.

---

## 10. 실행 우선순위 (CEO 승인 대기)

| 순서 | ID | 작업 | 근거 |
|------|-----|------|------|
| **P0** | ENGINE-06 | Probe 로그 DB 저장 시작 | 데이터가 모트. 지금 안 하면 영원히 늦음 |
| **P0** | ENGINE-06 | Probe 등장률 → 메인 스코어 전환 | 정확도 = 신뢰 = MLP 기반 |
| **P1** | SDK-01 | AI 레퍼러 감지 경량 스크립트 | GA4 연동의 전제 조건 |
| **P1** | DASH-01 | 쿼리별 커버리지 UI | 인사이트의 시작 |
| **P2** | GA4-01 | GA4 OAuth 연동 | SDK 이후에 의미 있음 |
| **P2** | CRAWLER-01 | AI 크롤러 감지 | 허니팟 URL 연구 병행 |
| **P2** | IMPROVE-01 | 개선 가이드 자동화 | 인사이트 → 액션 루프 |
| **P3** | MENU-01 | 전체 메뉴 구조 확장 | 데이터 쌓인 후 의미 있음 |

---

## 11. 리스크 요약

| 리스크 | 심각도 | 대응 |
|--------|--------|------|
| Probe 스코어 전환 시 기존 점수 급변 | 🔴 | 구/신 병기 + 2주 유예 |
| API 비용 증가 (Probe 확대 시) | 🔴 | 무료 3쿼리 상한 유지 |
| SDK 채택률 저조 | 🟡 | 배지 = 설치 보상으로 동기 설계 |
| 경쟁사 동일 기능 출시 | 🟡 | SDK 데이터 모트가 방어막. 속도 우선 |
| GDPR (제3자 제품 측정) | 🟡 | 공개 제품 범위. Privacy 문서 업데이트 |

---

## 12. 네이밍

- 이 문서: **빅파이 1.0**
- 스코어 엔진 개편: **ENGINE-06**
- SDK: **PBA SDK v1**
- GA4 연동: **Analytics Bridge**

---

*빅파이 1.0 — 2026-04-15 CPO·CEO 전략 세션 기록*
*다음 버전: 빅파이 2.0 (SDK + GA4 연동 완료 후)*
