# D6 TREND-01 + JOURNEY-01 API 설계 문서
> 작성: 2026-04-22 22:15 KST · CPO
> 대상: 2026-04-23 (목) D6 착수
> 참조: `bigpie-v1.5.md §6 Hook 2` · `bigpie-v1.5-phase2-plan.md`

---

## 0. 목표

빅파이 1.5 MLP 리텐션 Hook 2 (3탭 차트) + Hook 3 (Movement Feed = Journey Timeline)를 D5 Overview에 이어 **D6 Trend / Journey pane**에 구현.

- 사용자가 **돌아올 이유**를 만든다 (시계열 데이터 누적 가시화)
- D11 DEPLOY-GATE-01 통과 조건: unified_v15 시계열 시각화 + 수학적 일관성 유지

---

## 1. D6 TREND-01 — 3탭 차트

### 1-1. 데이터 소스 (단일 진실)
```
scores 테이블 · unified_v15 JSONB 컬럼
```
- `score_snapshots` 테이블은 아직 미활용 (빅파이 1.5 P0 목록 SCORE-UNIFY-02 완료했으나 데이터 적재 없음)
- D6에서는 **scores 테이블만 사용** (cron이 매일 1 row 저장 보장 → 자연 시계열)
- `score_snapshots` 활용은 후속 스프린트 (빅파이 Phase 2 이후)

### 1-2. API 쿼리 스키마

**신규 엔드포인트:** `GET /v1/scores/trend`

**Query params:**
| param | type | 필수 | 설명 |
|-------|------|------|------|
| `product` | string | ✅ | 제품명 (verified only, OWNER-ONLY-01 적용) |
| `tab` | `daily`\|`weekly`\|`monthly` | ✅ | 탭 선택 |
| `user_id` | string | ✅ | Auth JWT에서 추출 |

**Tab 별 집계 스펙:**
| tab | 기간 | bucket 크기 | 데이터 포인트 수 |
|-----|------|-----------|--------------|
| daily | 최근 14일 | 1일 | 14 |
| weekly | 최근 12주 | 7일 이동평균 | 12 |
| monthly | 최근 12개월 | 30일 이동평균 | 12 |

### 1-3. Response 계약
```ts
{
  product: string,
  tab: 'daily' | 'weekly' | 'monthly',
  series: [
    {
      bucket_start: string,      // ISO date, YYYY-MM-DD
      score: number | null,      // unified_v15.score (null if no data in bucket)
      dimensions: {              // 각 차원 평균 (weekly/monthly = 이동평균)
        recognition: number | null,
        category: number | null,
        corec: number | null,
        web: number | null,
      },
      pass_indicator: 'perfect' | 'strong' | 'emerging' | 'invisible' | null,
      engine_grades: {           // 엔진별 등급 (가장 최근 bucket 내 마지막 row 기준)
        gemini: 'A'|'B'|'C'|'D'|'F' | null,
        perplexity: 'A'|'B'|'C'|'D'|'F' | null,
      },
      data_quality: 'solid' | 'partial' | 'missing',  // missing = cron 실패일
    }
  ],
  stats: {
    min: number,
    max: number,
    avg: number,
    delta_first_last: number,   // 첫 bucket vs 마지막 bucket 점수 차이
    streak_days: number,         // 연속 cron 실행 성공 일수 (missing=0에서 reset)
  }
}
```

### 1-4. SQL 쿼리 (Supabase PostgREST)

**Daily (14일):**
```sql
SELECT
  DATE(created_at AT TIME ZONE 'Asia/Seoul') as bucket_start,
  (unified_v15->>'score')::NUMERIC as score,
  unified_v15->'dimensions' as dimensions,
  unified_v15->>'pass_indicator' as pass_indicator,
  unified_v15->'engine_grades' as engine_grades
FROM scores
WHERE user_id = $1
  AND product_name = $2
  AND unified_v15 IS NOT NULL
  AND created_at >= NOW() - INTERVAL '14 days'
ORDER BY created_at DESC
```
→ JS 단에서 DATE별 groupBy (1일 1 row 가정, missing 날짜 null 채움)

**Weekly (12주 이동평균):**
```sql
-- 최근 84일(12주) scores 조회 → JS 단에서 7일 슬라이딩 윈도우 평균 계산
SELECT created_at, unified_v15
FROM scores
WHERE user_id = $1 AND product_name = $2
  AND unified_v15 IS NOT NULL
  AND created_at >= NOW() - INTERVAL '84 days'
ORDER BY created_at ASC
```

**Monthly (12개월 이동평균):**
```sql
SELECT created_at, unified_v15
FROM scores
WHERE user_id = $1 AND product_name = $2
  AND unified_v15 IS NOT NULL
  AND created_at >= NOW() - INTERVAL '365 days'
ORDER BY created_at ASC
```

### 1-5. FE 바인딩 계약

**DOM 구조** (Trend pane `#shell-pane-trend`):
```html
<div class="trend-tabs">
  <button data-tab="daily" class="active">Daily (14d)</button>
  <button data-tab="weekly">Weekly (12w)</button>
  <button data-tab="monthly">Monthly (12mo)</button>
</div>
<div id="trend-chart-container">
  <canvas id="trend-chart"></canvas>
</div>
<div id="trend-stats"><!-- min/max/avg/delta/streak --></div>
<div id="trend-engine-toggle">
  <label><input type="checkbox" checked data-engine="gemini"> Gemini</label>
  <label><input type="checkbox" checked data-engine="perplexity"> Perplexity</label>
</div>
```

**JS 함수:**
```ts
async function renderTrend(tab: 'daily'|'weekly'|'monthly', product: string) {
  const res = await fetch(`${API_URL}/v1/scores/trend?product=${product}&tab=${tab}`, {
    headers: { Authorization: `Bearer ${session.access_token}` }
  })
  const data = await res.json()
  drawChart(data.series, tab)
  renderStats(data.stats)
}
```

**차트 라이브러리:** Chart.js CDN (Line chart) · 디자인 시스템 골드 #FFD700 + 검정 배경 유지

### 1-6. 구현 최소 단위
- D6 목표: **Daily 탭만 완전 구현** (14일 × 1 row = 쿼리 단순)
- Weekly/Monthly는 "Coming in {n} days" 티저 (데이터 누적 필요)
- 완성 시 data_quality 'missing' 일자는 회색 dot + "cron failed" 툴팁

---

## 2. D6 JOURNEY-01 — Hero's Arc

### 2-1. 빅파이 1.5 Phase 2 의존성 분리
- **원래 계획:** `user_events` 테이블 기반 (Phase 2 DB-MIG-01, 아직 마이그레이션 안 됨)
- **D6 MVP:** `user_events` 없이 `scores` 시계열만으로 축소 구현
- **이유:** Phase 2 미착수 상태 유지 + D6 독립 실행 가능

### 2-2. MVP 설계 (scores 기반)

**4단계 Hero's Arc:**
```
INVISIBLE  →  EMERGING  →  STRONG  →  PERFECT
   🔴          🟡            🟢         🏆
```

**데이터 계산 (FE 단):**
```ts
function computeHerosArc(scores: ScoreRow[]) {
  const sorted = scores.sort((a,b) => a.created_at < b.created_at ? -1 : 1)
  const events = []
  let prevPass = null
  for (const row of sorted) {
    const pass = row.unified_v15?.pass_indicator
    if (pass && pass !== prevPass) {
      events.push({
        date: row.created_at,
        transition: `${prevPass || 'start'} → ${pass}`,
        score: row.unified_v15.score,
        type: rankOf(pass) > rankOf(prevPass) ? 'upgrade' : 'downgrade',
      })
      prevPass = pass
    }
  }
  return { current: prevPass, events, total_transitions: events.length }
}
```

### 2-3. DOM 구조 (Journey pane)
```html
<div id="heros-arc">
  <div class="arc-stage" data-stage="invisible">🔴 Invisible</div>
  <div class="arc-stage" data-stage="emerging">🟡 Emerging</div>
  <div class="arc-stage" data-stage="strong">🟢 Strong</div>
  <div class="arc-stage" data-stage="perfect">🏆 Perfect</div>
  <div class="arc-current-marker" style="left: {percent}%"></div>
</div>
<div id="journey-timeline">
  <!-- events 배열 → 타임라인 렌더 -->
</div>
```

### 2-4. 후속 확장 (Phase 2)
- `user_events` 도입 시 first_check, first_tier1_source 등 Milestone 이벤트 통합
- 공유 가능한 Journey 카드 (SHARE-01 Phase 3)

---

## 3. 구현 순서 (D6, 04-23 목)

| # | 작업 | 예상 | 담당 |
|---|------|------|------|
| 1 | `/v1/scores/trend` Daily 엔드포인트 구현 | 1h | API |
| 2 | Daily 14일 차트 FE 구현 (Chart.js) | 2h | FE |
| 3 | Weekly/Monthly 티저 UI | 30m | FE |
| 4 | Hero's Arc MVP (scores 기반) | 1h | FE |
| 5 | Journey Timeline 간이 버전 | 1h | FE |
| 6 | Playwright QA (6 pane 회귀 + 신규 Trend/Journey) | 45m | QA |
| 7 | 스테이징 배포 | 15m | CPO |

**총 예상:** 6.5시간 (하루 집중 가능 범위)

---

## 4. 비D6 선결 확인 사항

- ✅ cron 자동 실행 (04-23 00:01 검증 필요) — 시계열 데이터 누적 전제
- ✅ unified_v15 저장 일관성 (어제 수정됨)
- ✅ pass_indicator B안 로직 (어제 수정됨)
- ⏳ probe_logs 스테이징 (오늘 생성됨) — D6 직접 영향 없음 (Trend는 scores만 사용)

---

## 5. 리스크

| 리스크 | 심각도 | 대응 |
|---|---|---|
| cron missing 일자 UI 혼란 | 🟡 | `data_quality: 'missing'` 명시 + 회색 dot |
| 데이터 1개 밖에 없는 신규 유저 | 🟡 | Empty state ("Check again tomorrow to see your first trend") |
| Chart.js CDN 로드 실패 | 🟢 | 로컬 fallback + "Refresh" 버튼 |
| unified_v15 null row | 🟡 | SQL WHERE절에서 필터링 (이미 반영) |

---

## 6. 테스트 (D6 QA)

1. Playwright: 6 pane 스위칭 회귀
2. Playwright: Trend Daily 로드 확인 + console 에러 0
3. 실제 pickedby.ai 14일 데이터 시각적 확인 (28-33 범위 점수 라인)
4. 엔진 토글 동작 확인
5. Mobile viewport 체크 (D10 선행)

---

*D6 TREND-01 + JOURNEY-01 API 설계 완료 · 구현 착수 대기 · 2026-04-22 22:15 KST*
