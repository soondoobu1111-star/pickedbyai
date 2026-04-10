# MLP-Slim 로드맵 — pickedby.ai Score Redesign
> CEO 승인: 2026-04-10 | 상태: KICKOFF
> 근거: 4-LLM 종합 분석 + 에이전트 4명 의견 수렴 → CPO 종합 판단

---

## 배경

4개 외부 LLM(Perplexity/Grok/Gemini/ChatGPT) + 내부 에이전트 4명(Dev/PM/Growth/QA) 분석 결과:
- **전원 합의**: 스냅샷 → 시계열 전환 필수
- **CEO 결정**: Growth 관점 채택. "매력 있는 제품은 한 명만 모아도 바이럴 탄다"
- **CPO 판단**: "자동화 없는 MLP" — 크론 빼고, 수동 재체크 시 추이 축적

---

## 원칙

```
1. 크론 자동체크 안 넣는다 (비용 0, 인프라 리스크 0)
2. 유저가 수동 재체크할 때마다 히스토리 쌓인다
3. 차트와 모멘텀은 보인다 (재방문 동기)
4. 프롬프트별 분해 → V1.7 (엔진 리팩 필요, Dev 권고)
5. 이메일 알림 → V1.7 (유저 30명+ 후)
```

---

## 스프린트 일정

### Phase 0: DB 기반공사 (Day 1)
- [ ] **MLP-DB-01** Supabase `score_history` 테이블 생성
  - `id`, `email`, `product_name`, `score`, `dimensions` (JSONB), `ai_probe` (JSONB), `sources` (JSONB), `checked_at`
  - 인덱스: `(email, product_name, checked_at DESC)`
  - RLS: authenticated + anon insert 정책
- [ ] **MLP-DB-02** `/v1/check` 결과를 `score_history`에 자동 저장
  - 기존 `scores` 테이블과 별도 (히스토리 전용)
  - 같은 제품 같은 날 중복 방지 (UNIQUE email+product+date)

### Phase 1: 5차원 분해 UI (Day 2)
- [ ] **MLP-UI-01** 스코어 결과에 5차원 카드형 breakdown 표시
  - Web Presence / Source Authority / Recommendation Signals / Community Validation / Competitive Context
  - 각 차원 점수 + 최대점 + 프로그레스 바
  - 대시보드 expand 패널에도 동일 표시
- [ ] **MLP-UI-02** "What drives your score" 설명 섹션

### Phase 2: 모멘텀 표시 (Day 3)
- [ ] **MLP-MOM-01** 히스토리 2회 이상 시 모멘텀 배지 표시
  - ↑15% / ↓5% / → stable (이전 체크 대비)
  - 히스토리 1회면 "First check" 표시
  - 색상: 초록(상승) / 빨강(하락) / 회색(안정)
- [ ] **MLP-MOM-02** 대시보드 제품 목록에 미니 모멘텀 표시

### Phase 3: 30일 추이 미니 차트 (Day 4)
- [ ] **MLP-CHART-01** Dashboard expand 패널에 Chart.js 라인 차트
  - X축: 날짜 (최대 30일)
  - Y축: 0-100 점수
  - 데이터 < 2포인트: "Check again to see your trend" 메시지
  - 단일 포인트: 도트만 표시
- [ ] **MLP-CHART-02** 스파크라인 (제품 목록 행 내 미니 차트)

### Phase 4: CTA + 마무리 (Day 5)
- [ ] **MLP-CTA-01** "Track your AI visibility weekly" CTA + 이메일 수집
  - 기존 이메일 퍼널(EMAIL-01)과 통합
  - "Get notified when your score changes" 메시지
- [ ] **MLP-QA-01** QA 게이트
  - 5차원 분해 정확성 (합산 = 총점)
  - 모멘텀 계산 정확성
  - 차트 엣지케이스 (0점, 1회, 30회)
  - 스테이징 검증 → CEO 승인 → 프로덕션
- [ ] **MLP-DEPLOY** 스테이징 배포 → 프로덕션 배포

---

## 완료 기준

```
1. 스코어 결과에 5차원 카드 표시됨
2. 재체크 시 모멘텀 ↑↓ 표시됨
3. 히스토리 2회+ 시 추이 차트 렌더링됨
4. score_history 테이블에 데이터 정상 적재
5. QA PASS (P0 버그 0개)
```

---

## MLP-Full 트리거 (V1.7, PH 런치 후)

| 기능 | 트리거 조건 |
|------|-----------|
| Cron 주간 자동체크 | 등록 제품 10개+ |
| 프롬프트별 상세 분해 | 유저 요청 or PH 피드백 |
| 점수 변동 이메일 알림 | 이메일 유저 30명+ |
| 경쟁사 비교 (Advantage 축) | V2, 유저 50+ |
| 시간 감쇠 누적 모델 | V2, 히스토리 데이터 90일+ |

---

## 참고 자료
- 4-LLM 종합 분석: `docs/research/score_redesign_4llm_analysis.md`
- 제품 컨텍스트: `agents/products/pickedbyai.md`
- 기존 백로그: `memory/backlog.md`
