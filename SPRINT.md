# pickedby.ai — SPRINT (현재 스프린트 단일 소스)
> **TIER 1 파일** | 최종 갱신: 2026-04-29 | 150줄 제한
> **완료 스프린트**: Phase 1 D1~D11 (04-18~04-29) | **현재**: Phase 2 착수 (05-01~)
> **과거 스프린트**: `docs/bigpie-v1.5.md §10` 참조

---

## 1. Phase 1 완료 현황 (D1~D11)

```
✅ D1  DB 마이그레이션 (04-18)
✅ D2  온보딩 + 자동체크 + 5회 재시도 (04-18)
✅ D3  도메인 드롭다운 (04-21)
✅ D4  Shell 설계 + 통합 (04-18~19)
✅ D5  Overview 12섹션 풀셋 (04-21~22)
✅ D6  Trend + Journey + Volume (04-22~23)
✅ D7  PROBE-REDESIGN-01 (04-24)
✅ D8  RIVALS-01 + GT-01 실측 (04-25)
✅ D9a 랜딩 리뉴얼 1차 (04-26)
✅ D9b LAND-TURNSTILE + /changelog.html (04-27)
✅ D10 모바일 (04-28)
✅ D11 DEPLOY-GATE-01 12/13 PASS + 프로덕션 배포 (04-29)
```

**프로덕션**: API `a5364d01` / FE `08eaf258` / Gemini `8492488f` ✅ LIVE
**복구포인트**: `stable-20260429-pre-prod-deploy` (`d1ca6e7`)

---

## 2. DEPLOY-GATE-01 최종 결과 (D11, 2026-04-29)

| # | 항목 | 결과 |
|---|------|------|
| 1 | 도메인 입력 → 점수 정상 반환 | ✅ |
| 2 | Pass Indicator 4단계 정상 표기 | ✅ |
| 3 | sum(dims) === finalScore 수학 검증 | ✅ |
| 4 | Daily Pulse 이메일 발송 | ⏳ Phase 2b 이전 |
| 5 | Trend 3탭 차트 렌더링 | ✅ |
| 6 | Journey 4스테이지 타임라인 | ✅ |
| 7 | Volume Metrics 7지표 카드 | ✅ |
| 8 | Lighthouse Performance ≥70 | ✅ 96 |
| 9 | Lighthouse Accessibility ≥85 | ✅ 90 |
| 10 | Lighthouse SEO ≥95 | ✅ 100 |
| 11 | GT T1 3/3 → 80+ 실측 | ✅ Figma 95 / Notion 87.5 / Stripe 95 |
| 12 | CEO 직접 3개 제품 체험 | ✅ |
| 13 | 콘솔 에러 0 (프로덕션) | ✅ |

**결과**: **12/13 PASS** (#4 이메일 보류 → Phase 2b)

---

## 3. Phase 2 (Growth Loop) — 빅파이 1.6

> **CEO 확정 (2026-04-29)**: 측정 → 처방 → 추적 → 선순환

```
Phase 2a (W1, 05-01~05-07): 처방 엔진
  PRESCRIPTION-01: prescriptionEngine.ts 20규칙 세트
  PRESCRIPTION-02: /v1/check prescription 필드 추가
  PRESCRIPTION-03: Actions Pane UI 재설계

Phase 2b (W2, 05-08~05-14): 추적 + Sources + 이메일
  Daily Pulse 이메일 (DEPLOY-GATE-01 #4 해소)
  처방 실행 체크 + Before/After 재측정
  Sources 프리뷰

Phase 2c (W3, 05-15~05-21): 보상 + 바이럴 + GAP 흡수
  배지 + 성장 리포트
  GAP-1 페르소나 라벨 (AI Ghost/Champion)
  GAP-2 Wordle식 복사 포맷

Phase 2d (W4, 05-22~05-28): 정확도 + 배포
  처방 효과 분석 + DEPLOY-GATE-02
```

---

## 4. 마케팅 현황

| 항목 | 상태 |
|------|------|
| GT T1 3/3 80+ 실측 | ✅ 완료 (04-25) |
| DEPLOY-GATE-01 PASS | ✅ 12/13 PASS (04-29) |
| CEO 직접 체험 검증 | ✅ 완료 (04-29) |
| LinkedIn Day 17 v2 | ⏳ CEO 게시 대기 |
| Reddit 카르마 | ⏳ 59 → 200+ 빌딩 중 |
| X/Twitter | ❌ 영구 포기 (2026-04-21) |

---

## 5. Phase 2a 착수 현황 (2026-04-27 선행 구현)

| 작업 | 상태 |
|------|------|
| `prescriptionEngine.ts` 20규칙 세트 | ✅ tsc PASS |
| `/v1/check` prescription 필드 추가 | ✅ |
| BUG-DOMAINS-01/02 수정 | ✅ staging 검증 완료 |
| PRESCRIPTION-03 Actions Pane UI | ⏳ 미착수 |

---

*SPRINT.md — TIER 1 파일. 매 세션 후 POST_TASK에서 갱신. 150줄 초과 시 완료 항목 bigpie-v1.5.md §10으로 이동.*
*[CPO] 2026-04-29 D11 완료 + Phase 2 전환 기준 전면 갱신 (데스크탑 Claude)*
