# UI-SHELL-INTEGRATE-01 · DOM ID 매핑표 (B2 선작성)

> **작성일**: 2026-04-19 (일)
> **목적**: Dashboard Shell(724줄, docs/designs/Dashboard Shell (3-panel)/Dashboard Shell.html) ↔ 기존 dashboard.html(2719줄) 통합 설계
> **원칙**: Shell은 레이아웃만 교체. 비즈니스 로직 60+ DOM ID와 80+ 함수는 전부 보존.
> **롤백 포인트**: `stable-20260418-pre-landing-redesign` (c77ec40)
> **출력**: dashboard.html v2 (단일 파일 유지)

---

## 0. 통합 아키텍처 한 줄 요약

```
[새 Shell 레이아웃] + [기존 비즈니스 로직 전체]
  = 사이드바/상단바/크럼/Main 컨테이너 Shell 채택
  + 기존 #screen-login / #screen-dashboard 내부 콘텐츠를 <main class="main-inner"> 안으로 이식
  + 사이드바 data-nav 6개로 섹션 전환 (SPA 내부 라우팅)
```

---

## 1. Shell 신규 DOM ID (13개) — 채택 대상

| # | ID / Class | 역할 | 기존 대응 | 비고 |
|---|---|---|---|---|
| 1 | `#sidebar` (aside) | 사이드바 루트 | (신설) | 로고+6메뉴 컨테이너 |
| 2 | `#scrim` | 모바일 드로어 백드롭 | (신설) | 햄버거 오픈 시 표시 |
| 3 | `#menuBtn` | 모바일 햄버거 | (신설) | <820px 노출 |
| 4 | `.sb-item[data-nav="overview"]` | Overview 버튼 | `#tab-mine` 확장 | D5에서 12섹션 확정 |
| 5 | `.sb-item[data-nav="trend"]` | Trend 버튼 | `#trend-chart-wrap` 이동 | D6 구현 |
| 6 | `.sb-item[data-nav="rivals"]` | Rivals 버튼 | (신설) | D8 Sankey |
| 7 | `.sb-item[data-nav="journey"]` | Journey 버튼 | (신설) | D6 타임라인 |
| 8 | `.sb-item[data-nav="actions"]` | Actions 버튼 | `#mlp-track-cta` + `#feedback-cta` 재배치 | D9 |
| 9 | `.sb-item[data-nav="tools"]` | Tools 버튼 | `#tab-tools` 이동 | 기존 유지 |
| 10 | `#domainPicker` | 상단바 도메인 셀렉터 | `loadVerifiedDomains()` 재활용 | D3에서 확장 |
| 11 | `#avatarBtn` | 상단바 아바타 버튼 | `#nav-avatar-btn` (교체) | 아래 §2에서 상세 |
| 12 | `#avatarMenu` | 아바타 드롭다운 | `#nav-dropdown` (교체) | 같은 아래 |
| 13 | `.ph-card / .ph-inner` | Main placeholder | 각 탭 콘텐츠 이식 자리 | `data-nav`로 토글 |

---

## 2. 기존 DOM ID 처리 매트릭스 (60+개)

범례: 🟢 그대로 유지 · 🟡 Shell 내부로 이동 · 🔴 Shell 구조로 교체 · ⚪ 유지하지만 숨김

### 2.1 인증 / 스크린 루트 (8개)

| ID | 처리 | 매핑 전략 |
|---|---|---|
| `#screen-login` | 🟢 유지 | `main.main-inner` 바깥에 배치 + Shell은 `display:none` 처리 |
| `#screen-dashboard` | 🟢 유지 | Shell `<main class="main">` 가 이 역할을 흡수. 기존 div는 제거하고 내부 콘텐츠만 이식 |
| `#nav-user` | 🔴 교체 | Shell `#avatarWrap` 으로 교체 |
| `#nav-avatar-btn` | 🔴 교체 | Shell `#avatarBtn` (onclick 그대로 `toggleDropdown()`) |
| `#nav-avatar` | 🟡 이동 | `img` → Shell의 S 이니셜 영역에 삽입 또는 유지 |
| `#nav-dropdown` | 🔴 교체 | Shell `#avatarMenu` (class `.avatar-menu`) |
| `#nav-dropdown-email` | 🔴 교체 | Shell `.avatar-menu-email` |
| `#nav-account-label` | 🔴 제거 | Shell은 avatar 단독 표시 |

### 2.2 Check Form + Result (13개) → Overview 탭 안

| ID | 처리 | 메모 |
|---|---|---|
| `#input-product`, `#input-url`, `#btn-check` | 🟡 이동 | Overview 상단 Check 위젯 블록 (D4-INT 임시) |
| `#check-result` | 🟡 이동 | Overview 본문 카드 |
| `#result-product`, `#result-badge`, `#result-score`, `#result-bar` | 🟢 그대로 | DOM 계층만 이동, `showResult()` 무변경 |
| `#result-daily-pulse`, `#result-dimensions`, `#result-v15-extras` | 🟢 그대로 | 빅파이 1.5 4차원 렌더 경로 보존 |
| `#result-ai-probe`, `#result-grounded-note` | 🟢 그대로 | 플래그 off fallback 용 |

### 2.3 Sharing + Feedback + CTA (14개) → Actions 탭 안 (D9)

| ID | 처리 | 이동 시점 |
|---|---|---|
| `#btn-copy-link`, `#btn-copy-image`, `#btn-share-linkedin` | 🟢 유지 | 일단 Overview result 하단 유지. Shift 10 UTM Share Kit 때 Actions로 이동 |
| `#feedback-cta`, `#feedback-ask`, `#feedback-comment`, `#feedback-text`, `#feedback-thanks` | 🟢 유지 | result 내부 유지. 현재 위치 그대로 |
| `#result-owner-lock` | 🟡 이동 | D4-INT 때 Actions 탭 빈 상태 placeholder |
| `#mlp-track-cta`, `#result-email-cta`, `#result-email-input`, `#result-email-btn`, `#result-email-ok` | 🟡 이동 | Actions 탭 (D9) — Retention Hook 3종 중 하나 |
| `#guide-email-cta`, `#guide-consent`, `#guide-email-input`, `#guide-email-btn`, `#guide-email-ok` | 🟢 유지 | 현재 flow 유지, D9 재배치 |

### 2.4 Beta 배너 + Settings Beta (11개)

| ID | 처리 | 메모 |
|---|---|---|
| `#beta-banner`, `#beta-spots-badge` | 🟡 이동 | Overview 최상단 "Announcement strip"로 이동 (D5) |
| `#beta-cta-section`, `#beta-terms-check`, `#beta-join-btn`, `#beta-joined-msg` | 🟢 유지 | banner 내부 그대로 |
| `#settings-beta-section`, `#settings-beta-joined`, `#beta-cancel-warning`, `#beta-cancel-trigger`, `#settings-beta-not-joined` | 🟢 유지 | Settings Overlay 내부 그대로 (Shell 영향 없음) |

### 2.5 Mine / Trend / Tools 탭 구조 (17개)

| ID | 처리 | 매핑 |
|---|---|---|
| `#tab-mine` | 🔴 교체 | Shell `data-nav="overview"` 패널로 흡수 |
| `#mine-slot-count` | ⚪ 숨김 유지 | `display:none` 그대로 (어제 확정) |
| `#mine-loading`, `#mine-empty`, `#mine-table`, `#mine-rows` | 🟢 유지 | Overview 탭 내부로 이동 |
| `#trend-chart-wrap`, `#trend-chart` | 🟡 이동 | Trend 탭 (`data-nav="trend"`) — D6에서 3탭 차트로 확장 |
| `#tab-tools` | 🔴 교체 | Tools 탭 (`data-nav="tools"`)로 흡수 |
| `#tool-tab-badge`, `#tool-tab-llms`, `#tool-panel-badge`, `#tool-panel-llms` | 🟢 유지 | Tools 탭 내부 서브탭 그대로 |
| `#badge-*` (7개) | 🟢 유지 | 배지 생성 로직 무변경 |
| `#lt-*` (8개) | 🟢 유지 | llms.txt 생성 로직 무변경 |

### 2.6 Settings Overlay + Modals (12개)

| ID | 처리 | 메모 |
|---|---|---|
| `#settings-overlay` | 🟢 유지 | Shell과 무관한 전체 오버레이 (z-index 유지) |
| `#settings-email`, `#settings-timezone`, `#settings-marketing-toggle`, `#settings-marketing-label` | 🟢 유지 | 내부 구성 그대로 |
| `#delete-confirm-wrap`, `#delete-confirm-input`, `#delete-final-btn` | 🟢 유지 | 탈퇴 플로우 그대로 |
| `#consent-modal`, `#consent-checkbox` | 🟢 유지 | 별도 z-index 9999 |
| `#verify-popup`, `#verify-popup-token-code`, `#verify-popup-copy-btn`, `#verify-popup-product-name` | 🟢 유지 | 별도 z-index 9000 |

---

## 3. JS 함수 처리 매트릭스 (80개)

범례: 🟢 변경 없음 · 🟡 호출부만 조정 · 🔴 교체/리라이트 필요 · ⚪ 제거 후보

### 3.1 🟢 데이터·비즈니스 로직 (무변경, ~40개)
`getUserTimezone` · `formatDate` · `isSameDay` · `signInWithGoogle` · `signOut` · `deleteAccount` · `initTimezoneSelect` · `saveTimezone` · `openSettings` · `showBetaCancelWarning` · `hideBetaCancelWarning` · `settingsBetaCancel` · `settingsBetaJoin` · `closeSettings` · `toggleMarketing` · `exportCSV` · `showDeleteConfirm` · `checkDeleteInput` · `confirmDeleteAccount` · `loadVerifiedDomains` · `isOwnedDomain` · `maskEmail` · `loadBetaStatus` · `renderBetaBanner` · `betaJoin` · `betaDecline` · `betaUnjoin` · `checkRateLimit` · `updateCheckBtn` · `runCheck` · `runCheckForce` · `resetSaveButtons` · `getMineSet` · `saveMineSet` · `saveHistory` · `autoSave` · `deleteProduct` · `refreshProduct` · `genVerifyToken` · `runVerify`

### 3.2 🟡 호출부만 조정 (~20개)
| 함수 | 조정 내용 |
|---|---|
| `showLogin` | `#screen-login` 표시 + Shell 사이드바/상단바 `display:none` |
| `showDashboard` | `#screen-login` 숨김 + Shell 사이드바/상단바 표시 + `#avatarBtn` 이니셜 텍스트 세팅 |
| `toggleDropdown` | `#nav-dropdown` → `#avatarMenu.open` 클래스 토글 (Shell 패턴) |
| `switchTab` | `data-nav` 기반으로 재작성 (§4 참조) |
| `showResult` | DOM 존재 체크. 이동된 위치에서도 `querySelector` 유지 |
| `buildDailyPulseHtml` · `buildUnifiedExtrasHtml` · `renderUnifiedExtras` · `renderDimRowV15` · `renderDimRowV5` | 내부 HTML 무변경. 부모 컨테이너만 바뀜 |
| `renderMineTab` · `buildRowHtml` · `runCheckFromList` | Overview 탭 내부 렌더 위치 확인 |
| `renderTrendChart` | Trend 탭 활성 시에만 호출 (lazy mount) |
| `switchTool` · `generateLlmsTool` · `copyLlmsTool` · `downloadLlmsTool` · `updateBadgePreview` · `copyBadgeEmbed` · `copyBadgeHtml` · `buildBadgeSnippet` | Tools 탭 활성 시 mount |
| `copyLink` · `shareLinkedIn` · `copyScoreImage` · `copyLinkProduct` · `shareLinkedInProduct` | 버튼 위치 이동 대응 |
| `showVerifyPopup` · `closeVerifyPopup` · `copyVerifyPopupToken` · `copyVerifyTag` | 모달 무변경 |
| `showConsentModal` · `handleConsentSubmit` · `handleConsentSkip` | 모달 무변경 |
| `submitFeedback` · `submitFeedbackComment` · `submitResultEmail` · `toggleGuideBtn` · `submitGuideEmail` | 위치 이동 대응 |
| `loadHistory` | Overview 탭 mount 시 호출 |
| `toggleDetail` | 확장 패널 로직 유지 |

### 3.3 🔴 신규 작성 필요 (Shell 통합 전용, ~6개)
- `initShell()` — Shell DOM 부팅 (사이드바 토글/아바타 드롭다운 리스너)
- `navigateTo(navKey)` — `data-nav` → 해당 섹션 표시/숨김 + URL hash 업데이트
- `mountOverview()` · `mountTrend()` · `mountRivals()` · `mountJourney()` · `mountActions()` · `mountTools()` — 각 탭 초기화 게으른 로드
- `setActiveNav(key)` — `.sb-item.on` 토글 + 크럼 텍스트 갱신
- `syncAvatar(user)` — Shell `#avatarBtn` 이니셜 + `.avatar-menu-email` + `.avatar-menu-plan` 동기화

### 3.4 ⚪ 제거 후보 (~3개)
- 기존 nav-user 전용 이벤트 바인딩 중복분 — Shell 이벤트와 병존 방지

---

## 4. SPA 내부 라우팅 전략 (data-nav)

```js
// Pseudo
const NAV = {
  overview: { mount: mountOverview, crumb: 'Overview' },
  trend:    { mount: mountTrend,    crumb: 'Trend',    lazy: true },
  rivals:   { mount: mountRivals,   crumb: 'Rivals',   lazy: true },
  journey:  { mount: mountJourney,  crumb: 'Journey',  lazy: true },
  actions:  { mount: mountActions,  crumb: 'Actions',  lazy: true },
  tools:    { mount: mountTools,    crumb: 'Tools',    lazy: true },
};

function navigateTo(key) {
  if (!NAV[key]) return;
  document.querySelectorAll('[data-pane]').forEach(el => el.style.display = 'none');
  const pane = document.querySelector(`[data-pane="${key}"]`);
  if (pane) pane.style.display = '';
  setActiveNav(key);
  if (NAV[key].lazy && !NAV[key].mounted) { NAV[key].mount(); NAV[key].mounted = true; }
  history.replaceState(null, '', `#${key}`);
}

// boot
document.querySelectorAll('.sb-item[data-nav]').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.nav));
});
const initial = (location.hash || '#overview').slice(1);
navigateTo(initial in NAV ? initial : 'overview');
```

**각 탭 DOM 구조:**
```html
<div data-pane="overview">  <!-- 기존 #tab-mine + check form + result -->
<div data-pane="trend" style="display:none;">  <!-- #trend-chart-wrap 이식 -->
<div data-pane="rivals" style="display:none;"><!-- placeholder (D8) --></div>
<div data-pane="journey" style="display:none;"><!-- placeholder (D6) --></div>
<div data-pane="actions" style="display:none;"><!-- CTA 재배치 (D9) --></div>
<div data-pane="tools" style="display:none;">  <!-- 기존 #tab-tools 이식 -->
```

---

## 5. 크럼 갱신 로직

```js
function setActiveNav(key) {
  document.querySelectorAll('.sb-item').forEach(b => b.classList.remove('on'));
  document.querySelector(`.sb-item[data-nav="${key}"]`)?.classList.add('on');

  const crumb = document.querySelector('.crumbs .cur');
  if (crumb) crumb.textContent = NAV[key]?.crumb || '';

  const h1 = document.querySelector('h1.page-h1');
  if (h1) h1.textContent = NAV[key]?.crumb || '';
}
```

---

## 6. CSS 병합 전략

- Shell CSS (`--pba-*` CSS 변수 37개) **우선 이식** — body 전역
- 기존 dashboard.html `<style>` 블록 → Shell `<style>` 뒤에 append
- 충돌 가능 셀렉터: `.card`, `.btn-primary`, `.btn-ghost`, `.input-field`, `.nav-*`
- 해결: 기존 `.nav-*` 클래스는 `#screen-login` 안에서만 사용되므로 영향 없음. `.card / .btn-primary / .input-field`는 그대로 유지 (Overview 내부 재사용)

---

## 7. 통합 단계 체크리스트 (D4-INT 작업 흐름)

- [ ] 7-1. 롤백 태그 생성: `stable-20260419-pre-shell-integrate`
- [ ] 7-2. Shell HTML을 dashboard.html 상단에 병합 (head·sidebar·topbar·main 껍데기)
- [ ] 7-3. 기존 `#screen-dashboard` 내부 콘텐츠를 `<div data-pane="overview">`로 감싸서 `main-inner` 안으로 이식
- [ ] 7-4. `#tab-tools` 섹션을 `<div data-pane="tools">`로 옮김
- [ ] 7-5. `#trend-chart-wrap`을 `<div data-pane="trend">`로 이동 (lazy mount)
- [ ] 7-6. 빈 패널 3개 생성: rivals/journey/actions (placeholder)
- [ ] 7-7. `navigateTo()` + `setActiveNav()` 신규 JS 추가
- [ ] 7-8. `showDashboard()` 내부에 `syncAvatar(user)` 호출 추가
- [ ] 7-9. `toggleDropdown()` → Shell `.avatar-menu` 토글 변경
- [ ] 7-10. 기존 `#nav-user` 삭제 (Shell `#avatarWrap`이 대체)
- [ ] 7-11. 모바일 햄버거 동작 + scrim 테스트
- [ ] 7-12. 스테이징 배포 + 시각 회귀 테스트 (기존 5개 제품 Check 정상 흐름 확인)
- [ ] 7-13. Console 에러 0건 확인
- [ ] 7-14. 로그인→Dashboard / 새 Check / Settings 열기 / 탈퇴 확인 / 공유 버튼 / Badge 생성 / llms.txt 생성 전부 정상 동작 확인

---

## 8. 리스크 & 대응

| 리스크 | 대응 |
|---|---|
| 대규모 DOM 이동 → `querySelector`/`getElementById` 레거시 호출 깨짐 | §2 매트릭스 전수 체크. 🟢 대상은 위치만 이동, 🔴 대상만 코드 수정 |
| Settings overlay CSS 겹침 | z-index 확인 (Shell=60, overlay=9999 이상) |
| 모바일 드로어 충돌 | `#screen-login` 표시 시 `#sidebar/#topbar` 강제 숨김 (`showLogin()`) |
| 크럼 + h1 중복 문구 | D5 Overview 도입 전엔 동일 텍스트 유지 |
| 탭 미운트 상태에서 `document.getElementById` 호출 | lazy mount 구조로 해결. 없는 DOM 접근 시 `if(!el) return;` 가드 일괄 추가 |

---

## 9. D4-INT 이후 예상 산출물 구조

```
dashboard.html (v2, 단일 파일 유지, ~3100줄 예상)
├─ <head> … meta/title/fonts/css vars 병합
├─ <style> … Shell + 기존 스타일 결합
├─ <aside#sidebar> … 6메뉴
├─ <div#scrim>
├─ <header.topbar> … domainPicker + avatarWrap
├─ <main.main>
│   └─ <div.main-inner>
│       ├─ <nav.crumbs>
│       ├─ <h1.page-h1>
│       ├─ <div data-pane="overview"> … 기존 check form + result + mine-table
│       ├─ <div data-pane="trend">    … trend-chart-wrap (lazy)
│       ├─ <div data-pane="rivals">   … placeholder
│       ├─ <div data-pane="journey">  … placeholder
│       ├─ <div data-pane="actions">  … placeholder
│       └─ <div data-pane="tools">    … tool-panel-badge + tool-panel-llms (lazy)
├─ <div#screen-login> (로그인 전용 화면, Shell 숨김)
├─ <div#settings-overlay>
├─ <div#consent-modal>
├─ <div#verify-popup>
└─ <script> … 기존 80개 + Shell 통합 6개 신규
```

---

## 10. QA 체크 포인트 (D4-INT 완료 기준)

- [ ] 로그인 화면 → Google 로그인 → Dashboard 정상 전환
- [ ] 사이드바 6메뉴 클릭 시 패널 전환 (overview/trend/rivals/journey/actions/tools)
- [ ] 아바타 클릭 → 드롭다운 (Settings/Sign out) 동작
- [ ] 모바일 햄버거 → 드로어 오픈/스크림 클릭 닫기
- [ ] Check Form 입력 → Check 버튼 → Result 표시 (unified_v15 분기)
- [ ] `#mine-table` rendering 정상 (verified 제품만)
- [ ] Tools 탭 → Badge 생성 + llms.txt 생성
- [ ] Settings Overlay 열기 → Timezone / Marketing / Beta / Delete 전부 동작
- [ ] Console 에러 0건
- [ ] 기존 DOM ID 60+개 중 🟢 분류 전체 동일 위치/이름 유지

---

*DOM 매핑표 끝. 이 문서를 기반으로 D4-INT 착수. 예상 공수 3~4시간.*
