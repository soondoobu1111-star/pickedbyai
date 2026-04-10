# MLP-Slim 로드맵 — pickedby.ai Score Redesign
> CEO 승인: 2026-04-10 | 상태: 9/11 완료 — 프로덕션 배포됨
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

### Phase 0: DB 기반공사 ✅ Day 1 완료
- [x] **MLP-DB-01** scores 테이블 dimensions + ai_probe 컬럼 추가 (prod + staging SQL)
- [x] **MLP-DB-02** saveHistory / autoSave / refreshProduct → dimensions + ai_probe 저장

### Phase 1: 5차원 분해 UI ✅ Day 1 완료
- [x] **MLP-UI-01** 대시보드 expand 패널 → V5 5차원 분해 (dimensions 있으면 V5, legacy 폴백)
- [ ] **MLP-UI-02** "What drives your score" 설명 섹션 → **V1.7 보류**

### Phase 2: 모멘텀 표시 ✅ Day 1 완료
- [x] **MLP-MOM-01** 모멘텀 배지 ↑↓% — 제품 목록 행 표시
- [x] **MLP-MOM-02** expand 패널 "vs last check" 레이블

### Phase 3: 추이 차트 ✅ Day 1 완료
- [x] **MLP-CHART-01** 데이터 1포인트 시 "Check again tomorrow" 안내 / 2포인트+ 시 차트 자동 표시
- [ ] **MLP-CHART-02** 스파크라인 → **V1.7 보류**

### Phase 4: CTA + 배포 ✅ Day 1 완료
- [x] **MLP-CTA-01** 비로그인 시 "Track score over time" CTA 표시
- [x] **MLP-QA-01** 프로덕션 200 OK + 코드 배포 검증 완료
- [x] **MLP-DEPLOY** 스테이징 + 프로덕션 배포 완료 (2026-04-10)

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
