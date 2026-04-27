# pickedby.ai — COMPASS (문서 포털)
> **버전:** 1.1 | **최종 갱신:** 2026-04-23 (고아 파일 10개 정리, CLAUDE.md 통합)
> **목적:** 모든 문서의 단일 입구. 여기서 찾지 못하면 존재하지 않는 것으로 간주.
> **열람 시간:** 2분 (읽기 전용, 편집 자주 하지 않음)

---

## 🗺️ 이 파일의 사용법

```
뭔가를 찾고 싶다 → 아래 지도에서 티어 찾기 → 해당 파일로 이동
뭔가를 기록해야 한다 → "어느 티어?"를 자문 → 규칙대로 배치
```

---

## TIER 1 — 라이브 (항상 최신, CEO 매일 참조)

| 파일 | 내용 | 최대 줄수 |
|------|------|---------|
| [`PRODUCT.md`](PRODUCT.md) | 제품 정의 · 현재 상태 · 핵심 결정 · 수익 구조 | 300줄 |
| [`SPRINT.md`](SPRINT.md) | 현재 스프린트만 · 게이트 · 블로커 | 150줄 |

> 🔴 **TIER 1 규칙**: 세션이 끝날 때마다 POST_TASK에서 이 두 파일을 업데이트한다.
> 300줄 초과 시 해당 섹션을 TIER 2로 분리하고 링크만 남긴다.

---

## TIER 2 — 레퍼런스 (상세·안정·월 1회 검토)

| 파일 | 내용 | 변경 조건 |
|------|------|---------|
| [`docs/bigpie-v1.6.md`](docs/bigpie-v1.6.md) | 제품 전략 마스터 · Growth Loop · 처방 엔진 · 선순환 | 주요 전략 변경 시 |
| [`docs/whitepaper.md`](docs/whitepaper.md) | 투자자·외부용 · Moat 전략 · 시장 래더 | Phase 전환 시 |
| [`docs/bizplan.md`](docs/bizplan.md) | 사업계획서 · 마일스톤 · 경쟁사 | 분기 1회 |
| [`docs/vision-brief-v2.md`](docs/vision-brief-v2.md) | 비전 v2.0 · 배포 전략 · 랜딩 카피 방향 | 피벗 시만 |
| [`docs/brand-guide.md`](docs/brand-guide.md) | 브랜드 가이드 · 색상 · 로고 | 디자인 변경 시 |

> 🟢 **TIER 2 현재: 5/6** (한도 6개)
> 🟡 **TIER 2 규칙**: PRODUCT.md에 요약이 있고, 여기엔 상세만 있다. 중복 금지.
> PRODUCT.md에 없는 내용만 여기에 있어야 한다.

---

## TIER 3 — 아카이브 (세션 산출물, 읽기 전용)

```
docs/outputs/daily_YYYYMMDD.md    — 세션 기록 (POST_TASK 자동)
docs/outputs/design_*.md          — 설계 탐색
docs/outputs/strategy_*.md        — 전략 산출물
docs/outputs/d*_*.md              — 스프린트별 스펙
docs/outputs/gt_*.md              — GT 실측 기록
docs/bugs/                        — 버그 리포트
```

> ⚫ **TIER 3 규칙**: 한 번 생성되면 편집 금지 (역사 기록). PRODUCT.md / SPRINT.md에 반영됐으면 끝.
> COMPASS에서 링크하지 않음. 필요시 직접 탐색.

---

## 📐 문서 배치 결정 트리

```
새 정보가 생겼다 → 이게 지금 당장 CEO가 알아야 할 핵심인가?
                         ↓ YES                    ↓ NO
               TIER 1 (PRODUCT.md)       상세 기술·전략 스펙인가?
                                               ↓ YES           ↓ NO
                                          TIER 2           TIER 3 (archive)
```

---

## ⚠️ 금지 사항

```
❌ COMPASS에 등록 안 된 새 비즈니스 문서 생성 (PRODUCT.md에 넣거나 TIER 2 승인 후 등록)
❌ TIER 3 파일 편집 (새 daily 파일 생성이 원칙)
❌ TIER 1과 TIER 2에 동일 내용 중복 기록
❌ TIER 2 파일이 6개 초과 (초과 시 기존 파일과 합치거나 TIER 3으로)
```

---

## 📅 관리 루틴

| 주기 | 작업 | 담당 |
|------|------|------|
| **매 세션 후** | TIER 1 (PRODUCT.md + SPRINT.md) 업데이트 | POST_TASK Hook |
| **주 1회 (월요일)** | SPRINT.md 갱신 (완료 항목 → TIER 3) | CPO |
| **월 1회** | TIER 2 파일 검토 (줄수·중복·현행성) | CPO |
| **분기 1회** | COMPASS 전체 검토 | CEO + CPO |

---

*Compass v1.0 — 2026-04-23 CPO 설계 (데스크탑 Claude)*
