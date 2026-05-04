# Code Sync Audit — pickedby.ai (2026-05-04)

> Dev 역할 분석 전용 세션. 코드 직접 수정 0건. 모든 변경은 CEO 승인 후 별도 세션에서 진행합니다.

---

## 1. 요약

**한 줄**: 빅파이 v1.5 → v1.6 전환이 표면적으로는 끝났지만, FE에 5차원 fallback 렌더러 + BE 2개 어댑터의 supabase 헬퍼 우회가 잔존합니다. Quick Win 5건은 즉시 적용 가능, 나머지 7건은 별도 세션 필요.

**스캔 범위**:
- API: 11 파일 / 5,785 lines (`api/src/**/*.ts`)
- Landing: 14 HTML / ~13,500 lines (dashboard.html 7,713 + index.html 1,507 + onboarding.html 809 등)
- Migrations: 12 SQL (모두 적용 완료 또는 백업)
- Total: 133 source files

**우선순위 표**:

| 우선순위 | 항목 | Impact | Effort |
|---------|------|--------|--------|
| P0 | `probeCache.ts` / `unifiedScoreAdapter.ts` 의 `DEFAULT_SUPABASE_URL` 하드코딩 (staging 분기 버그) | High | Low |
| P0 | `landing-v2.html` 1,072 lines 고아 파일 (참조 0건) | Medium | Low |
| P1 | `loadVolumePane()` 단순 delegator 함수 (loadTrendPane으로 통합) | Low | Low |
| P1 | `renderDimRowV5` (5차원) 폐기 후 `renderDimRowV15` 단일화 | Medium | Medium |
| P1 | `score`/`probe_score` 이원 시스템 잔존 (FE legacy fallback 5곳) | Medium | High |
| P2 | `as any` 타입 캐스팅 28건 | Medium | High |
| P2 | dashboard.html inline hex 739건 → CSS 변수화 | Low | High |

---

## 2. 카테고리별 발견 사항

### 2.1 사문서·deprecated 코드

**A. v1.5 5차원 잔존 (FE)**
- `landing/dashboard.html:3484` `renderDimRowV5(d)` — 5차원 fallback 전용
- `landing/dashboard.html:3401` 분기 `dimensions.map(d => renderDimRowV5(d))`
- `landing/dashboard.html:6543` 또 다른 5차원 fallback 분기
- `landing/dashboard.html:1551` `<div id="d5-dimensions" class="ov-dims">` 5차원 컨테이너 ID 잔존
- `landing/dashboard.html:1554` `<b id="d5-dim-sum">` (sum=100 검증용, 4차원에서도 동작하나 명명만 5차원)
- 빅파이 v1.6 §11 폐기 항목 명시: 5차원 → 4차원으로 통합 완료

**B. probe_score / score 이원 시스템 잔존**
- `api/src/index.ts:976` `interface { probe_score: number }` 타입 정의
- `api/src/index.ts:1303~1307` 인서트 시 probe_score 분기
- `api/src/index.ts:1612` 이메일 카피에 "5-dimension breakdown" 문구 (HTML 인라인)
- `api/src/score.test.ts` `probe_score` 테스트 잔존 (회귀 방지용 보존 OK)
- `landing/dashboard.html:3320` 주석 "probe_score/score 이원 폐기"인데 코드는 여전히 양쪽 읽음

**C. 폐기된 ID 패턴**: `MINE-STORY-01` / `NARRATIVE-01` / `CONTEXT-AWARE-01` — 코드(ts/html)에는 0건 ✅. `docs/bigpie-v1.6.md`에만 폐기 표시 후 보존 (정상).

**D. 고아 파일 (참조 0건)**
- `landing/landing-v2.html` (1,072 lines) — `index.html`만 "DESIGN SYSTEM (landing-v2 variables)" 주석 1건. 실제 inbound 링크 0
- `landing/dashboard-overview.html` (880 lines) — `dashboard.html:365` 주석 1건만 존재. inbound 링크 0
- `docs/designs/Dashboard Shell (3-panel)/*.html` — 디자인 mockup 보존, 빌드 미포함 (정상)

**E. legacy 주석 영역 (DOM 보존됨)**
- `landing/dashboard.html` `legacy` 키워드 14건 — 대부분 "backward-compat hidden DOM" 표시. 의도적 보존. **CEO 결정 필요**: 제거 vs 영구 보존

### 2.2 중복 코드

**A. Supabase URL 하드코딩 중복 (P0 — 실 버그)**
- `api/src/supabaseEnv.ts` 가 `getSbUrl(env)` / `getAnonKey(env)` 단일 진입점 제공
- 그러나 다음 두 파일은 helper 우회:
  - `api/src/probeCache.ts:26,48,91` `const DEFAULT_SUPABASE_URL = 'https://pfrcppgecqsbnhkkjkbd.supabase.co'` + `env.SUPABASE_URL || DEFAULT_SUPABASE_URL`
  - `api/src/unifiedScoreAdapter.ts:60,493` 동일 패턴
- **버그 영향**: `ENVIRONMENT === 'staging'` 일 때도 prod Supabase URL 사용. staging 분기 자체가 작동하지 않음.
- `api/src/retryAdapter.ts:56` 는 `getSbUrl as supaUrl` 정상 사용 (모범)

**B. 3개 dimension row 렌더러**
- `renderDimRow(r, compact)` (line 6958) — 원본 (results 사용)
- `renderDimRowV5(d)` (line 3484) — v1.5 5차원 fallback
- `renderDimRowV15(d)` (line 3512) — v1.6 4차원 (현행)
- 3-way fallback chain: `unified ? V15 : (dimensions ? V5 : results.map(renderDimRow))`
- DB에서 unified_v15가 가장 오래된 row를 제외하고는 모두 채워져 있음 (cron baseline 가드 포함). V5/base는 사실상 dead path.

**C. loadVolumePane 단순 delegator**
- `landing/dashboard.html:5435` 함수가 8줄 중 핵심 로직은 `loadTrendPane(product, tab)` 위임만. `volumeCurrentTab/Product` 두 변수 갱신 외 기능 0
- DOM `#volume-chart`는 Trend pane 안으로 통합됨. `loadVolumePane`은 호출 1곳(line 7481)만 남음

**D. localStorage 키 일관성**
- `pba_*` prefix 사용: `pba_timezone` `pba_marketing_consent` `pba_consent_shown` `pba_mine` `pba_verified_<name>` `pba_rl_<product>_<date>` `pba_penalty_<product>` `pba_rx_done_v1::<product>::<aid>` ✅ 모두 prefix 일관
- `cookie_consent` (line 19) — 단일 예외. 표준 GDPR 키이므로 유지 권장

### 2.3 개선 필요

**A. 매직 넘버**
- `api/src/prescription/selection.ts:11` `SEVERITY_MULTIPLIER = { critical: 5.0, high: 3.0, medium: 1.5, low: 0.5 }` ✅ 명시 상수화 완료 (D2.5 PRESCRIPTION-MODULAR-01)
- `api/src/prescription/selection.ts:36` `(0.5 + urgency)` — `0.5` 매직. urgency floor 의미. 상수화 후보
- `api/src/prescription/selection.ts:19` `QUICK_WIN_TIME_PATTERN = /^(10|15|20|30)\s*min/i` — 30분 기준 정규식. 상수 명시 완료
- `api/src/index.ts:2147` `ALLOWED_EVENT_TYPES` 16종 ✅ 명시 Set
- `api/src/index.ts:1303` `validProbes.length >= 3` — probe 최소 개수 매직 (3건 동일 임계값 산재)

**B. 타입 안정성**
- `as any` 캐스팅: API 28건 (대부분 `index.ts`)
- 핵심 위반:
  - `index.ts:1185~1187` `(engineResult as any).dimensions ?? null` — engineResult 타입 미정의
  - `index.ts:2371` `(d?.breakdown as any)?.status` — breakdown 타입 미정의
  - `index.ts:2261` `as Array<{ ...; unified_v15: any; ... }>` unified_v15 자체가 any
- `unifiedScore.ts:UnifiedScoreResult` 인터페이스 존재 → `index.ts` row 매핑에 활용 가능하나 미사용

**C. 에러 핸들링**
- `try/catch` 102 사이트 / `fetch` 호출 10곳 (낮은 비율은 정상, 대부분 helper 안에 있음)
- `index.ts:1160 / 1217 / 1418` `catch (err: any)` — error 타입 unknown 권장 (TS 4.4+)
- `console.error` 만 호출하고 4xx/5xx 분기 없는 구간: probe insert 실패 시 `error: 'insert_failed_${insertRes.status}'` 문자열만 저장 (모니터링/알림 미연결)

**D. 테스트 커버리지**
- `prescription.test.ts` 27 vitest ✅ (D2.5 commit `4aa35e3`)
- `score.test.ts` + `scoreConsistency.test.ts` 21 vitest
- 누락: `unifiedScore.ts` (393 lines, 핵심 4차원 계산) 단위테스트 0건. 이 모듈이 v1.6의 심장
- 누락: `probeCache.ts` 캐시 만료 테스트 0건 (24h boundary)

**E. 디자인 시스템 위반**
- `landing/dashboard.html` inline hex 739건 (8.6% 라인 비율)
- 검정 9단계 + 골드 + tier 색상 외 발견:
  - `#3DDC84` (line 4579, PERFECT tier 색) — green tier 정의이므로 의도적
  - `#00E676` (line 223 var, 2017 banner) — pba-green 변수. 디자인 시스템 추가 요망
  - `#4ade80` (line 5460 Citations) — Tailwind green-400 직접 사용. 디자인 시스템 위반
- `--pba-green: #00E676` 변수와 `#3DDC84` (PERFECT tier)와 `#4ade80` (Citations)가 모두 다른 녹색 — **CEO 결정 필요**: 단일 골드/녹색 토큰 통합 vs 현행 유지

### 2.4 영구 룰 위반 검사

**`feedback_score_consistency` (3중 방어)**:
- ✅ BE cron baseline 가드 (`api/src/index.ts` 1303~1307)
- ✅ `scores.flagged` 컬럼 (`docs/migrations/scores_flagged_column_20260502.sql`)
- ✅ FE `isValidScoreRow(row, baselineScore)` (line 2699 dashboard.html)
- ✅ 27 + 21 vitest PASS

**`feedback_heros_arc_regression_gate`** (`.jr-*` CSS 검증):
- 자동 회귀 검사 0건. 시각 검증은 사람이 4컬럼×4뷰포트로 수동 (룰 명시)
- **개선 후보**: Playwright snapshot 자동화 추가 가능 (별도 세션 작업)

**`feedback_root_cause_first`**:
- 위반 사례 없음. 04차+05차 배포 모두 근본 원인 fix 후 정착

**`reference_keychain_structure`**:
- `./kw-key.sh` 직접 사용 검증 못 함 (분석만 모드)

---

## 3. 우선순위 매트릭스 (Impact × Effort)

```
                        Effort →
              Low                     Medium                  High
       ┌────────────────────────┬─────────────────────────┬───────────────────┐
  High │ P0-1 supabaseEnv 우회  │                         │ P1-3 score/probe  │
  Imp  │ P0-2 landing-v2 삭제   │                         │  이원 fallback 제거│
  ↓    ├────────────────────────┼─────────────────────────┼───────────────────┤
  Med  │ P1-1 loadVolumePane 통합│ P1-2 renderDimRowV5 폐기│ P2-1 as any 28건  │
       ├────────────────────────┼─────────────────────────┼───────────────────┤
  Low  │ P3-1 dashboard-overview │ P2-2 unifiedScore 테스트│ P2-3 hex 변수화   │
       └────────────────────────┴─────────────────────────┴───────────────────┘
```

---

## 4. 즉시 개선 (Quick Win 5건, 30분 이내)

**QW1**: `probeCache.ts` line 26/48/91 → `getSbUrl(env)` 사용. `DEFAULT_SUPABASE_URL` 상수 제거. (5분)
- 영향: staging 환경에서 처음으로 staging Supabase 사용. **prod 영향 0** (env.ENVIRONMENT 미설정 시 prod fallback 동일).

**QW2**: `unifiedScoreAdapter.ts` line 60/493 → 동일 패턴 적용. (5분)

**QW3**: `landing/landing-v2.html` 삭제 (1,072 lines 제거). (2분)
- inbound 링크 0건 검증 완료. `index.html` 주석 1줄만 잔존 (정리 가능)

**QW4**: `landing/dashboard-overview.html` 삭제 (880 lines 제거). (2분)
- inbound 링크 0건 검증 완료. dashboard.html line 365 주석 1줄만 잔존

**QW5**: `loadVolumePane` 함수 인라인화 — 호출자 1곳(line 7481)을 `loadTrendPane(name, volumeCurrentTab || 'daily')` 직접 호출로 교체. `loadVolumePane` 함수 정의 제거. (10분)

**QW6 (옵션)**: `api/src/index.ts:18` `SUPABASE_ANON_KEY?: string  // deprecated` 환경변수 타입 제거 (3분)

**총 절감**: 코드 -2,200 lines, staging 환경 분기 정상화, dimension 렌더 분기 -1단

---

## 5. 다음 세션 권고 (3건, 1시간+)

**NS1**: **5차원 fallback 제거** (예상 2시간)
- `renderDimRowV5` 정의 + 호출 2곳 제거
- `id="d5-dimensions"` `id="d5-dim-sum"` → `id="d4-*"` 리네임
- DB row 중 `unified_v15 IS NULL` 인 row 카운트 확인 후 진행 (prod에서 0이면 안전)
- 영향: dashboard.html -150 lines, 분기 1단 축소

**NS2**: **probe_score / score 이원 시스템 정리** (예상 2시간)
- `api/src/index.ts:976` interface 폐기
- 1303~1307 분기 단일화
- 이메일 카피 line 1612 "5-dimension breakdown" → "4-dimension"
- 회귀 테스트: `score.test.ts:188~195` `probe_score` 케이스는 보존 (regression guard)

**NS3**: **`unifiedScore.ts` 단위테스트 추가** (예상 1.5시간)
- 4차원 계산 (Recognition 35 / Category 35 / CoRec 20 / Web 10) 각각 boundary
- engine_grades 누락/부분 케이스
- sum == final invariant 검증 (이미 score.test.ts에 부분 있음, 모듈 자체에 직속)

---

## 6. CEO 결정 필요 사항

**D1**: **landing-v2.html / dashboard-overview.html 삭제 vs 보존**
- 삭제 안: 1,952 lines 제거. inbound 0. git history에서 복원 가능
- 보존 안: 디자인 reference로 보존 (현재 docs/designs/와 중복)
- **권장**: 삭제 (이미 `docs/designs/Dashboard Shell (3-panel)/`에 mockup 보존됨)

**D2**: **legacy DOM 보존 정책**
- `landing/dashboard.html`에 "legacy hidden DOM" 14곳 (`display:none`)
- backward-compat 목적이라 명시되어 있으나 실제 caller가 없을 가능성
- **권장**: 별도 세션에서 caller grep 후 caller 0이면 삭제, 있으면 보존

**D3**: **녹색 토큰 통합** (`--pba-green` `#3DDC84` `#4ade80` 3종)
- 통합 안: `--pba-green: #FFD700`(골드)로 단일화 또는 디자인 시스템에 추가 명시
- 보존 안: tier(`#3DDC84`) + accent(`#00E676`) + chart(`#4ade80`) 의도적 분리
- **권장**: CEO 디자인 시스템 룰 재확인 필요

---

## 부록: 파일별 라인 수

```
api/src/
  index.ts                  3,056  ← 단일 파일 비대 (분리 후보)
  unifiedScoreAdapter.ts      513
  unifiedScore.ts             393
  probeRedesign.ts            426
  retryAdapter.ts             226
  scoreConsistency.test.ts    186
  prescription.test.ts        153
  probeCache.ts               115
  supabaseEnv.ts               52
  turnstile.ts                 28
  prescription/  (D2.5 모듈) 400 (8 files)

landing/
  dashboard.html            7,713  ← 단일 파일 비대 (장기 분리 후보)
  index.html                1,507
  landing-v2.html           1,072  ← 삭제 후보
  dashboard-overview.html     880  ← 삭제 후보
  onboarding.html             809
```

---

*작성: Dev 에이전트 / 2026-05-04 / 분석 only, 코드 변경 0*
