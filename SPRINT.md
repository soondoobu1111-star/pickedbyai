# pickedby.ai — SPRINT (현재 스프린트 단일 소스)
> **TIER 1 파일** | 최종 갱신: 2026-04-23 | 150줄 제한
> **현재 스프린트**: D7~D11 (04-24~04-29) | **게이트**: DEPLOY-GATE-01
> **과거 스프린트**: `docs/bigpie-v1.5.md §10` 참조

---

## 1. 스프린트 현황

```
✅ D1 DB 마이그레이션 (04-18)
✅ D2 온보딩 + 자동체크 + 5회 재시도 (04-18)
✅ D3 도메인 드롭다운 (04-21)
✅ D4 Shell 설계 + 통합 (04-18~19)
✅ D5 Overview 12섹션 풀셋 (04-21~22)
✅ D6 Trend + Journey + Volume (04-22~23)
✅ D7 PROBE-REDESIGN-01 (04-24)
✅ D8 RIVALS-01 + GT-01 실측 (04-25)
✅ D9a 랜딩 리뉴얼 1차 (04-26)
✅ D9b LAND-TURNSTILE + /changelog.html (04-27)
✅ D10 모바일 (04-28)
✅ D11 DEPLOY-GATE-01 12/13 PASS + 프로덕션 배포 (04-29) (#4 이메일 보류)
```

---

## 2. D7~D11 상세

| Day | 날짜 | 작업 | 스펙 파일 | 예상 시간 |
|-----|------|------|----------|---------|
| D7 | 04-24(목) | PROBE-REDESIGN-01 D안 역방향 스무고개 | `d7_probe_redesign_spec_20260422.md` | 4h |
| D8 | 04-25(토) | Rivals 탭 + Sankey + Fallback + GT-01 10개 실측 | `gt_candidates_20260422.md` | 6h |
| D9a | 04-26(일) | LAND-SHIFT-1/2/6/7 랜딩 리뉴얼 | — | 4h |
| D9b | 04-27(월) | LAND-TURNSTILE + /changelog 페이지 | — | 3h |
| D10 | 04-28(화) | 전체 모바일 반응형 | — | 4h |
| D11 | 04-29(수) | DEPLOY-GATE-01 체크 + CEO 검증 + 프로덕션 배포 | 아래 체크리스트 | 2h |

---

## 3. DEPLOY-GATE-01 체크리스트 (D11 기준)

> 🔴 13개 전부 PASS 해야 CEO 배포 승인 가능 (2026-04-21 CEO 확정)

### 기능 (7개)
- [ ] 1. 도메인 입력 → 점수 정상 반환 (≥1초 내)
- [ ] 2. Pass Indicator 4단계 정상 표기 (🏆/🟢/🟡/🔴)
- [ ] 3. 4차원 합산 = finalScore (sum === final 수학 검증)
- [ ] 4. Daily Pulse 수신 (이메일 발송 확인)
- [ ] 5. Trend 3탭 (30d/12w/12mo) 차트 렌더링
- [ ] 6. Journey 4스테이지 타임라인 표시
- [ ] 7. Volume Metrics 7지표 카드 정상

### 품질 (3개)
- [ ] 8. Lighthouse Performance ≥70
- [ ] 9. Lighthouse Accessibility ≥85
- [ ] 10. Lighthouse SEO ≥95

### 비즈니스 (3개)
- [ ] 11. GT-01 T1 3/3 제품 → 80점+ (실측)
- [ ] 12. CEO 직접 3개 제품 체험 검증
- [ ] 13. 콘솔 에러 0 (프로덕션 환경)

---

## 4. 현재 블로커

| 블로커 | 상태 | 해결 조건 |
|--------|------|---------|
| CEO 스테이징 실데이터 검증 | 🔴 미완료 | CEO 로그인 → Trend/Journey/12FULL 시각 확인 |
| cron 04-23 자동 실행 확인 | 🔴 미완료 | scores row 생성 여부 확인 (D11 전) |
| DEPLOY-GATE-01 전 프로덕션 배포 금지 | 🔴 CEO 잠금 | D11 PASS 후만 해제 |

---

## 5. 마케팅 게이트 조건

> DEPLOY-GATE-01 통과 + CEO 검증 완료 후 마케팅 재개

- [ ] GT T1 3/3 → 80점+ 실측 (D8 04-25)
- [ ] sum(dims) === finalScore 수학 검증 ✅ (TEST-01 통과)
- [ ] DEPLOY-GATE-01 13개 전부 PASS (D11)
- [ ] CEO 3개 제품 직접 체험 (D11)
- ⏳ LinkedIn Day 17 v2 → D11 후 CEO 게시
- ⏳ Reddit 카르마 59 → 200+ 빌딩 중

---

## 6. 인프라 완료 사항 (2026-04-23)

| 작업 | 상태 | 효과 |
|------|------|------|
| Compass 문서 체계 구축 | ✅ | PRODUCT.md+SPRINT.md TIER 1 |
| 고아 파일 정리 (11개) | ✅ | docs/*.md 15→5개 |
| pickedbyAI/CLAUDE.md 재작성 | ✅ | 250줄+→97줄, 7단계→3단계 |
| Pull 모델 전환 (agent-protocol.md) | ✅ | 세션 시작 비용 -58% (~38K→~16K 토큰) |
| MEMORY.md 앵커화 (MEMORY_full.md 분리) | ✅ | 17KB→2.8KB (-83%) |
| D7 PROBE-REDESIGN-01 (04-24) | ✅ | probeCache.ts + probeRedesign.ts 신규. tsc+14test PASS. Notion 97.5/T1, pickedby.ai 55/T2 실측 |
| D8 RIVALS-01 + GT-01 (04-25) | ✅ | /v1/rivals API + Rivals 탭(Sankey+Peers+Quadrant). GT-01 T1 3/3 80+ PASS. LH 91/89/100 |
| D9a 랜딩 리뉴얼 1차 (04-26) | ✅ | LAND-SHIFT 1/2/6/7. Under The Hood 제거. Demo 4차원(55/87.5). Newsletter 섹션. FAQ 4차원. LH 96/90/100 |
| D9b LAND-TURNSTILE + /changelog.html (04-27) | ✅ | turnstile.ts 신규. /v1/check Turnstile 검증 삽입(BYPASS=1). dashboard.html 위젯+CSP. changelog.html LH 100/90/100 |

---

## 7. 스테이징 / 프로덕션 버전

| 환경 | API | FE |
|------|------|----|
| 스테이징 | `8f161dab` (KST 버킷 + 디버그) | `d909c850` (D10 + CEO 피드백) |
| 프로덕션 | `a5364d01` (D11 전체 배포) | `08eaf258` (D11 전체 배포) |

---

## 8. GT-01 실측 요약 (2026-04-25)

> ANCHOR-VERIFY-01 결과 — **T1 3/3 80+ PASS** (DEPLOY-GATE-01 기준 #11 충족)

| T1 제품 | 실측 | 기준 |
|---------|------|------|
| Figma | 95 | 80+ ✅ |
| Notion | 87.5 | 80+ ✅ |
| Stripe | 95 | 80+ ✅ |

⚠️ CEO 검토: Supabase 100 / ShipFast 90 (예상 대비 +35점, 과대평가 여부 판단 필요)

---

*SPRINT.md — TIER 1 파일. 매 세션 후 POST_TASK에서 갱신. 150줄 초과 시 완료 항목 bigpie-v1.5.md §10으로 이동.*
*[CPO] 최초 작성 2026-04-23 | 2026-04-25 D8 완료 업데이트 (데스크탑 Claude)*
