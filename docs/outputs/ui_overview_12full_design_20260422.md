# UI-OVERVIEW-12FULL — Overview 잔여 6섹션 설계 문서
> 작성: 2026-04-22 22:30 KST · CPO
> 대상: D6 병행 작업 (04-23~24)
> 참조: D5 핵심 6섹션 완료(`daily_20260421.md` 세션 2) + 빅파이 1.5 §7 대시보드 구조

---

## 0. 목표

D5 Overview의 "지금 내 상태"를 **정적 스냅샷 → 동적 스토리**로 확장. 사용자가 **7초 안에** 현재 상태·방향성·다음 액션을 파악.

---

## 1. 현재 D5 핵심 6섹션 (완료 상태)

| # | 섹션 | 데이터 소스 |
|---|------|-----------|
| 1 | 큰 점수 링 + Pass Indicator | unified_v15.score + pass_indicator |
| 2 | Daily Pulse 카드 | unified_v15.insights.daily_pulse |
| 3 | 4차원 Breakdown grid | unified_v15.dimensions[] |
| 4 | Engine Grades | unified_v15.engine_grades[] |
| 5 | 2D Quadrant | unified_v15.quadrant |
| 6 | 카테고리 벤치마크 바 | category_benchmarks (아직 미연결) |

---

## 2. 잔여 6섹션 설계 (12FULL 완성)

### Section 7 — **7일 미니차트** (Trend pane 축약)
- **목적:** 전체 Trend pane 들어가기 전 "한눈 모멘텀" 제공
- **크기:** 세로 80px · 가로 full width
- **데이터:** 최근 7일 scores.unified_v15.score (null = 회색 dot)
- **색상:** 상승 구간 골드 #FFD700 / 하락 구간 적색 #e05252 / 평행 회색
- **Click 이벤트:** "View full trend" → `shellNavigateTo('trend', 'daily')`
- **Empty state:** 데이터 1개만 있으면 "Come back tomorrow for your first trend"

### Section 8 — **다음 마일스톤 진행도**
- **목적:** "지금 점수 → 다음 단계까지 얼마나 남았나"
- **계산 로직 (FE):**
  ```ts
  const nextThreshold =
    score >= 60 ? { label: 'PERFECT', target: 75, gap: 75 - score }
    : score >= 35 ? { label: 'STRONG', target: 60, gap: 60 - score }
    : score >= 15 ? { label: 'EMERGING', target: 35, gap: 35 - score }
    : { label: 'EMERGING', target: 15, gap: 15 - score }
  ```
- **UI:** 프로그레스바 `[현재 tier] ─●─────○ [next tier]`
- **텍스트:** "{gap} points to {nextLabel}" (signal 조건 추가 시 "+ at least 1 more AI recognition")
- **B안 로직 (Pass Indicator)과 일관성 유지** — score 단독이 아닌 signal+score 동시 조건 안내

### Section 9 — **Last 24h 변화**
- **목적:** Daily Pulse와 차별화된 **숫자 기반 변화량**
- **데이터:** `scores` 최근 2 row 차이
  ```ts
  const deltas = {
    score: today.unified_v15.score - yesterday.unified_v15.score,
    recognition: today.dimensions.recognition - yesterday.dimensions.recognition,
    category: ...,
    corec: ...,
    web: ...,
  }
  ```
- **UI:** 4차원 × 화살표 (↑ 초록 · ↓ 적색 · ↔ 회색)
- **Edge case:** yesterday 없음 (첫날) → "First data point captured"

### Section 10 — **Actions Top 1 티저**
- **목적:** 풀 Actions pane 가기 전 "오늘의 한 가지" 안내
- **계산 로직:** `unified_v15.insights.top_issue` 기반 + 템플릿
  ```ts
  const top = unified.insights.top_issue  // "Lowest performing dimension: Category Ranking (0/35)"
  const action = generateActionFromTopIssue(top)
  // 예: "Category Ranking is your biggest gap. Try publishing a comparison article."
  ```
- **UI:** 박스 + "Do this today" CTA → `shellNavigateTo('actions')`
- **제약:** 규칙 기반 정적 템플릿 (Phase 2 LLM 생성 제외 원칙 준수)

### Section 11 — **Verified 상태 배지**
- **목적:** "내 도메인 인증" 상태 명시 (OWNER-ONLY-01 연계)
- **데이터 소스:** `domains` 테이블 `status` 컬럼
- **UI:**
  - verified ✅ → "Verified · DNS TXT" 녹색 배지
  - pending ⏳ → "Verification pending" + Retry 버튼
  - unverified ❌ → "Register your domain" CTA
- **위치:** D5 Header 오른쪽 (representative domain 라벨 옆)

### Section 12 — **Recently Added 미니 버전**
- **이미 구현됨** (UI-B-REBUILD-01 2026-04-21). 상위 5개 + "+ Check" 버튼.
- **12FULL에서는 변경 없음** — 완성 섹션으로 인정
- **선택적 개선:** 각 행에 7일 mini-sparkline 추가 (데이터 2개 이상일 때만)

---

## 3. 구현 순서 (D6 병행, 04-23~24)

| # | 작업 | 예상 | 의존 |
|---|------|------|------|
| 1 | Section 7 (7일 미니차트) | 1h | Trend API 완료 후 |
| 2 | Section 8 (다음 마일스톤) | 30m | 독립 |
| 3 | Section 9 (Last 24h 변화) | 45m | 독립 |
| 4 | Section 10 (Actions Top 1) | 45m | 템플릿 사전 작성 |
| 5 | Section 11 (Verified 배지) | 30m | domains 테이블 조회 |
| 6 | QA + 스테이징 배포 | 30m | — |

**총 예상:** 4시간 — D6 TREND-01(6.5h)과 병행하면 D6 마지막 1시간 + D7 2시간 = 완료

---

## 4. 데이터 의존성 매트릭스

| 섹션 | scores | domains | user_events | category_benchmarks |
|------|:---:|:---:|:---:|:---:|
| 7 미니차트 | ✅ | | | |
| 8 마일스톤 | ✅ | | | |
| 9 Last 24h | ✅ (2 row) | | | |
| 10 Actions Top 1 | ✅ (insights) | | | |
| 11 Verified | | ✅ | | |
| 12 Recently | ✅ | ✅ (필터) | | |

- **user_events 불필요** — Phase 2 DB-MIG-01 대기 없이 즉시 구현 가능
- **category_benchmarks** 실데이터 연결은 D7 PROBE-REDESIGN-01 후 (미니 바 fallback: 평균 50 placeholder)

---

## 5. 디자인 시스템 준수

- 검정 #0a0a0a + 골드 #FFD700 + 9단계 회색 외 금지
- 상승/하락 색상: 초록 #4ade80 / 적색 #e05252 (점수 티어 전용)
- 코너 radius: 6/8/12px only
- Press Start 2P 작게 (0.35–0.85rem 의도적)
- 아이콘: 유니코드 + 픽셀 크라운만

---

## 6. QA 체크리스트

- [ ] 6 pane 스위칭 회귀 정상
- [ ] D5 핵심 6섹션 (기존) 변경 없음 (sum==final 유지)
- [ ] 12FULL 추가 6섹션 렌더 정상 (신규 유저 · 오너 · 미인증 3 상태)
- [ ] console 에러 0건
- [ ] Mobile viewport 체크 (D10 선행)
- [ ] 빈 상태 (데이터 0건) 처리 — "Check your first product" CTA

---

*UI-OVERVIEW-12FULL 설계 완료 · D6 병행 구현 대기 · 2026-04-22 22:32 KST*
