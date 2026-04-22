# Volume Metrics (누적체계) 설계 문서
> 작성: 2026-04-22 23:05 KST · CPO
> 승인: CEO 2026-04-22 23:00 "승인한다. 누적체계 역시 추세 차트로 표현"
> 대상: 빅파이 1.5 → 1.5.1 버전업 · 점수+볼륨 이원 시스템
> 구현: 2026-04-22 당일 착수

---

## 0. 목표

점수(Score)만으로는 Notion·Figma 같은 대형 기업 스케일이 안 보입니다. **절대량(Volume)** 을 병행 측정·시각화하여 GSC의 "impression count" 역할을 수행합니다.

**핵심 가치:**
- "Notion은 하루 1400 mentions, 당신은 7" — 규모 격차 가시화
- "당신은 Notion 볼륨의 2.5%에 위치" — 벤치마크 비율 제공
- "7일간 mentions 12→58로 증가" — 성장 추세 시각화
- Google Search Console의 impression count + CTR 이원 구조와 동일 원리

---

## 1. 7개 누적 지표

| 지표 | 원천 | 계산 | Notion 예상 | pickedby.ai 예상 |
|------|------|------|-------------|------------------|
| **Total Mentions** | probe_logs | COUNT(recognized=true) | 1400+/7d | 5~10/7d |
| **Recognition Rate** | probe_logs | SUM(recognized)/COUNT × 100 | 95%+ | 15% |
| **Category Hits** | probe_logs | COUNT(detected_rank NOT NULL AND query_template LIKE 'best_%' or 'top_%') | 300+/7d | 0~2/7d |
| **Co-Rec Degree** | probe_logs.co_recommendations | DISTINCT peer count | 50+ | 1~3 |
| **Citation Count** | probe_logs.citations | SUM(jsonb_array_length(citations)) | 500+/7d | 3~5/7d |
| **Source Diversity** | probe_logs.citations | DISTINCT host(url) | 80+/7d | 2~3/7d |
| **Total Probes** | probe_logs | COUNT(*) (분모 가시화) | 1500+/7d | 35/7d |

**파생 지표:**
- **Volume Ratio** = 내 지표 ÷ category_benchmarks 평균 × 100 (%)
- **Peak Day** = 기간 내 최대 mentions 일자
- **Growth Rate** = (last - first) ÷ first × 100 (7d/30d)

---

## 2. API 엔드포인트 스펙

### `GET /v1/scores/volume`

**Query params:**
| param | type | 필수 | 설명 |
|-------|------|------|------|
| `product` | string | ✅ | 제품명 (verified only) |
| `tab` | `daily`\|`weekly`\|`monthly` | ✅ | 버킷 크기 |

**Auth:** Bearer JWT (verifyToken 재활용)

**Tab별 집계:**
| tab | 기간 | bucket × 크기 | 포인트 수 |
|-----|------|--------------|-----------|
| daily | 30일 | 1일 × 30 | 30 |
| weekly | 12주 | 7일 × 12 | 12 |
| monthly | 12개월 | 30일 × 12 | 12 |

> Score Trend는 14d/12w/12mo였으나, Volume은 Daily 30d로 확장 (누적은 더 긴 구간 의미있음).

**Response 계약:**
```ts
{
  product: string,
  tab: 'daily' | 'weekly' | 'monthly',
  series: [
    {
      bucket_start: string,           // ISO date YYYY-MM-DD (KST)
      mentions: number,               // recognized=true count
      recognition_rate: number,       // 0-100
      category_hits: number,
      citation_count: number,
      source_diversity: number,
      corec_degree: number,
      total_probes: number,
    }
  ],
  stats: {
    mentions_total: number,
    mentions_peak: number,
    mentions_peak_day: string | null,
    recognition_rate_avg: number,
    citation_count_total: number,
    source_diversity_total: number,
    corec_degree_max: number,
    delta_first_last: number,        // 첫 bucket vs 마지막 bucket (mentions)
    growth_pct: number,              // delta ÷ first × 100
  },
  benchmark: {
    category_avg_mentions_period: number | null,
    ratio_pct: number | null,        // 내 mentions_total ÷ category_avg × 100
  }
}
```

### SQL 쿼리 (Supabase PostgREST)

```sql
-- Daily 30d, product_id = user's verified product
SELECT
  ai_source,
  recognized,
  recommended,
  detected_rank,
  query_template,
  co_recommendations,
  citations,
  created_at
FROM probe_logs
WHERE user_id = $user_id
  AND product_id = $product
  AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at ASC
```

JS 단에서 bucketing + aggregation (이미 trend 엔드포인트 패턴 재활용).

---

## 3. FE 통합 설계

### 3-1. Overview — Volume 카드 신설 (Section 1.5)

**위치:** 점수 링 카드 바로 아래 (Section 1 Score + Section 1.5 Volume + Section 2 Pulse)

**DOM:**
```html
<div class="card" id="d5-volume-card">
  <div class="volume-header">
    <span>AI MENTIONS · 7D</span>
    <span id="d5-vol-ratio">—</span> <!-- "2.5% of Notion" -->
  </div>
  <div class="volume-big-number" id="d5-vol-total">—</div>
  <canvas id="d5-vol-sparkline"></canvas>
  <div class="volume-delta" id="d5-vol-delta">—</div>
</div>
```

### 3-2. Trend pane — Volume 섹션 (Score 섹션 아래)

**위치:** Trend pane에 Score 차트 아래 독립 Volume 섹션 추가. 각자 3탭 동기화.

**DOM:**
```html
<!-- 기존 Score Trend 유지 -->
<div class="volume-trend-wrap">
  <h3>Volume Trend — How much are you mentioned?</h3>
  <div id="volume-tabs">
    <!-- daily / weekly / monthly 3탭 (Score 탭과 동기화) -->
  </div>
  <div id="volume-chart-wrap">
    <canvas id="volume-chart"></canvas>
  </div>
  <div id="volume-stats">
    <!-- mentions_total / peak_day / delta / growth% / ratio% -->
  </div>
  <div id="volume-layers">
    <!-- overlay checkboxes: Mentions / Citations / Sources / Co-Rec -->
  </div>
</div>
```

**차트 라이브러리:** Chart.js (기존 활용). 멀티 라인 dataset으로 4개 레이어 overlay.

### 3-3. Rivals pane 준비 (D8)

Volume 지표가 Rivals pane에서:
- "You are at 2.5% of Notion's volume" 비율 표시
- Top 10 AI Competitors Volume 비교 막대
- Co-Rec Degree 그래프 노드 크기에 반영

---

## 4. 데이터 의존성

| 의존성 | 상태 | 비고 |
|--------|------|------|
| probe_logs 누적 | ✅ | 스테이징 3 row 확인 (notion probe 04-22) |
| probe_logs 스키마 프로덕션 적용 | ✅ | 2026-04-15 적용 완료 |
| co_recommendations 컬럼 JSONB | ✅ | 기본값 `[]` |
| citations 컬럼 JSONB | ✅ | 기본값 `[]` |
| category_benchmarks 테이블 | ✅ | D1 시딩 완료 (5×5) |
| category_benchmarks mention_count 컬럼 | ⏳ | 현재 스키마에 없을 수 있음 — 확인 후 placeholder로 fallback |

---

## 5. 구현 순서 (오늘 착수)

| # | 작업 | 예상 |
|---|------|------|
| 1 | API `/v1/scores/volume` + buildVolumeSeries + computeVolumeStats | 1.5h |
| 2 | FE Overview Volume 카드 + sparkline canvas | 1h |
| 3 | FE Trend pane Volume 섹션 (Chart.js 4 layer) | 2h |
| 4 | renderD5Overview 확장 + shellNavigateTo Volume 연결 | 30m |
| 5 | tsc + vitest + Playwright QA | 45m |
| 6 | 스테이징 배포 | 15m |
| **총** | | **6h** (설계 포함 시 7h) |

---

## 6. 빅파이 1.5 → 1.5.1 명시

**변경:**
- 측정 체계: **점수(Score) + 볼륨(Volume) 이원 시스템**
- Score = 상대적 위치 (0-100)
- Volume = 절대적 규모 (mentions/citations/sources counts)
- 두 지표는 독립적으로 의미가 있음 (Score 높은데 Volume 적을 수도, 반대도)

**유지:**
- 4차원 분해 (Recognition 35 + Category 35 + CoRec 20 + Web 10)
- sum(dimensions) === final.score 수학적 일관성
- Pass Indicator B안 (signal AND score)
- 무료 범위 (probe_logs 이미 쌓는 중 → 추가 API 비용 $0)

---

## 7. 리스크

| 리스크 | 심각도 | 대응 |
|--------|--------|------|
| probe_logs 적재량 부족 (신규 유저) | 🟡 | "Start daily probes" empty state + 첫 cron 대기 |
| category_benchmarks mention 컬럼 부재 | 🟢 | Phase 1 placeholder 50 → Phase 2 실제 측정 |
| 쿼리 성능 (30d × 5 engines) | 🟢 | 제품당 최대 ~150 rows/30d · 인덱스 사용 |
| Volume 지표 다중성으로 인한 UX 혼란 | 🟡 | Mentions 단일 지표를 기본 표시 · 나머지는 overlay toggle |

---

## 8. 테스트 케이스 (vitest 추가 예정)

```ts
describe('Volume aggregation', () => {
  it('mentions counts only recognized=true rows', ...)
  it('source_diversity extracts hostname from citations', ...)
  it('corec_degree counts unique peers', ...)
  it('empty period returns zeros, not NaN', ...)
  it('growth_pct handles first=0 edge case (returns null)', ...)
})
```

---

*설계 완료 · 구현 착수 · 2026-04-22 23:10 KST*
