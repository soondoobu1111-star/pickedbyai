# PBA Score Redesign — 4-LLM 종합 분석 (2026-04-10)

> pickedby.ai 스코어 체계를 스냅샷→시계열 누적 모델로 전환하기 위한 외부 LLM 4곳 분석 + 내부 에이전트 4명 의견 취합 결과

---

## 1. 외부 LLM 분석 요약

### Perplexity — 체계적 프레임워크
- PBA Index = 0.5*Asset + 0.2*Momentum + 0.3*Advantage
- 16개 서브메트릭, 4단계 구현 로드맵
- GA4 연동 플랜 (검증 계층)
- 대시보드 IA: Summary→Context→Action
- **강점**: 구조 완성도 **약점**: 우리 현실(0유저) 모름

### Grok — 방향감 + 실행론
- proxy→real querying + data moat + predictive ML
- 스냅샷→누적/추이 전환 = MLP 전환
- "6개월이면 AEO 업계 표준 플랫폼"
- **강점**: 기술 진화 방향 정확 **약점**: 근거 없는 낙관

### Gemini — 실무적 비판 가장 날카로움
- 시간 감쇠 누적: `Asset_t = Daily_t + (0.95 * Asset_t-1)`
- 경쟁사 미지정 failsafe: 카테고리 평균 대체
- API 비용: 핵심 daily, 롱테일 weekly
- SMA 기반 모멘텀: `(7d SMA - 28d SMA) / 28d SMA`
- **강점**: 구현 가능한 수식 제공 **약점**: 스키마 가벼움

### ChatGPT — 수식 가장 상세
- 지수 감쇠 + 로지스틱 정규화: `exp(-0.03*days) + logistic`
- Momentum 4요소: velocity + 7d + 30d + trend consistency
- 메트릭 사전 제공
- **핵심 인사이트**: "점수가 아니라 프롬프트 기반 가시성 인텔리전스가 진짜 차별점"
- **강점**: 실행 디테일 **약점**: 10주 MVP는 1인팀 비현실

---

## 2. 4-LLM 공통 합의 (100%)

1. 스냅샷 → 시계열 전환 필수
2. 3축 구조 (Asset / Momentum / Advantage) 유지
3. 가중치 50/20/30 동일
4. GA4는 검증 계층 (점수 로직 아님)
5. 경쟁사 비교가 차별점
6. 프롬프트 일관성이 점수 신뢰 핵심

---

## 3. CPO 채택/보류/폐기 판정

### 즉시 채택
- 추이 전환 (스냅샷→시계열)
- Momentum 축 (7d/30d 변화율)
- 자동 주간 체크 (MOAT-01)
- 프롬프트별 breakdown

### V2 채택 (유저 50+ 이후)
- Gemini 시간 감쇠 수식
- 경쟁사 비교 + failsafe
- Advantage 축 활성화
- ChatGPT Momentum 4요소 확장
- GA4 오버레이

### 폐기
- 16개 서브메트릭 (과잉)
- Predictive ML (데이터 없음)
- 10주 MVP 로드맵 (비현실)
- 로지스틱 정규화 (V2 이후)

---

## 4. 내부 에이전트 의견 (2026-04-10)

### Dev
- 현재 stateless 구조 → DB 기반공사(products+score_history) 필수
- 4개 기능 2주 가능, 프롬프트 분해는 엔진 리팩 3일 추가
- API 비용 폭발 리스크 (제품 1000개 = 월 $200)
- CF Workers CPU 50ms 제한 → Queue 필요 가능
- 빌드 순서: DB→차트→크론→모멘텀→이메일→프롬프트

### PM
- 유저 0에서 리텐션 기능은 순서 틀림
- 프롬프트 분해만 MLP 필수 (신뢰도)
- PH 런치 + 이메일 50개가 먼저
- 4-LLM 의견 ≠ 시장 검증

### Growth
- 모멘텀 표시(↑12%)가 바이럴 스크린샷 최강
- 추이 차트가 리텐션 핵심
- MLP 피치: "매주 추적하세요. 무료."
- 2개만 빌드 권장 (모멘텀 + 추이)

### QA
- Cron 비용 폭주 + Brevo 한도가 최대 리스크
- 스테이징 72h 소크 테스트 필요
- 비용 시뮬 없이 배포 블로킹

---

## 5. 참고 수식 (V2 구현 시)

### Gemini 감쇠 누적
```
Asset_t = Daily_Value_t + (0.95 * Asset_t-1)
```

### Gemini SMA 모멘텀
```
Momentum = ((7d_SMA - 28d_SMA) / 28d_SMA) * 100
```

### ChatGPT 지수 감쇠
```
weight = exp(-0.03 * days_since)
AssetScore = 100 * (1 / (1 + exp(-k * (log(V) - μ))))
```

### ChatGPT Momentum 4요소
```
Momentum = 0.35*Velocity + 0.25*Growth7 + 0.25*Growth30 + 0.15*TrendConsistency
```

### 공통 PBA Index
```
PBA Index = 0.5*Asset + 0.2*Momentum + 0.3*Advantage
```

---

## 6. 원본 JSON

원본 핸드오프 JSON 4건은 대화 컨텍스트에 보존.
- Perplexity: `llm_handoff_context` (schema 1.0)
- Grok: `pickedby_ai_score_system_improvement`
- Gemini: `pba_redesign_strategy`
- ChatGPT: `pba_scoring_system_extension` (schema 1.1)
