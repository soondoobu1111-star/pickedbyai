# D7 PROBE-REDESIGN-01 — D안 역방향 스무고개 코드 스펙
> 작성: 2026-04-22 22:32 KST · CPO
> 대상: 2026-04-24 (금) D7 착수
> 참조: `daily_20260418.md §D안 최종 설계` (CEO 확정)

---

## 0. D안 설계 복기 (CEO 2026-04-18 승인)

```
Phase 1 — 카테고리 확정 (1콜, 24h 캐시)
  "What is {name}? One sentence + primary category + primary use_case"
  → category · sub_category · primary_use_case

Phase 2 — 역방향 스무고개 (1~3콜)
  Step 1: "Tell me about {name}. Is it a {category} tool?"
    → 모름 → T4 확정, 끝 (총 2콜)
    → 앎  → Step 2
  Step 2: "Notable emerging {category} tools beyond top 10?"
    → 포함 → T3/T2 확정 (총 3콜)
    → 미포함 → Step 3
  Step 3: "Top 10 {category} tools 2026?"
    → 포함 → T1 확정 (총 4콜)
    → 미포함 → T2 (총 4콜)

Phase 3 — Use-case 실전 테스트 (1콜)
  "I need to {primary_use_case}. Recommend tools."
  → {name} 언급 여부 = 실제 구매 의사결정 시 노출 여부
```

### 티어별 비용 구조 (역전 효과)
| 티어 | 콜 수 | 유저 세그먼트 |
|------|------|-------------|
| T4 완전 신규 | 2콜 | 무료 ✅ |
| T3/T2 미들급 | 3콜 | Basic |
| T1 유명 | 4~5콜 | Pro (돈 있음) ✅ |

### 4차원 연결
| 차원 | 새 소스 | 만점 |
|------|--------|------|
| Recognition | Phase 2 티어 (T1=35/T2=25/T3=15/T4=5) | 35 |
| Category | Phase 2 Step 3 랭크 위치 (1위=35 / 2-3위=25 / 4-10위=15 / 미포함=0) | 35 |
| CoRec | Phase 2/3 언급된 연관 제품 자동 추출 | 20 |
| Web | Tavily (변경 없음) | 10 |

---

## 1. 신규 파일 구조

```
api/src/
├── probeRedesign.ts  (신규, ~500줄)
│   ├── inferCategoryAndUseCase()        # Phase 1
│   ├── twentyQuestionsTier()             # Phase 2
│   ├── useCaseProbe()                    # Phase 3
│   └── computeDimensionsFromDAsn()       # 4차원 계산
├── probeCache.ts     (신규, ~100줄)
│   ├── getCategoryCache(name)            # Phase 1 24h 캐시
│   └── setCategoryCache(name, category)
└── unifiedScoreAdapter.ts  (수정)
    └── buildDimensionContext()           # D안 결과 → DimensionContext 변환
```

---

## 2. Phase 1: 카테고리 확정

### 2-1. API 호출
- **모델:** Perplexity sonar (가장 경제적, 카테고리 분류 정확)
- **쿼리:** `What is {name}? In 50 words or less, give me: (1) one-sentence description, (2) primary category (e.g., "note-taking", "design tool"), (3) primary use_case (verb + object, e.g., "organize meeting notes").`
- **온도:** 0.1 (결정적)

### 2-2. Response 파싱
```ts
interface Phase1Result {
  description: string
  category: string          // e.g., "note-taking app"
  sub_category?: string     // optional
  primary_use_case: string  // e.g., "organize meeting notes"
}
```

### 2-3. 24h 캐시 (비용 0)
- Cloudflare KV or Supabase `category_cache` 테이블
- Key: `probe_cat:{name_normalized}` (lowercase + trim)
- TTL: 86400s (24h)
- Cache hit 시 Phase 1 건너뛰기 → 비용 1/n

---

## 3. Phase 2: 역방향 스무고개

### 3-1. Step 1 — 모름 여부 (T4 탈락 검사)
- **쿼리:** `Tell me about {name}. Is it a {category} tool? Reply with one of: YES_IT_IS_{CATEGORY} / NO_NEVER_HEARD / KNOWN_BUT_DIFFERENT`
- **결과:**
  - `NO_NEVER_HEARD` → T4 (Recognition=5)
  - 그 외 → Step 2 진입

### 3-2. Step 2 — Emerging 여부 (T3/T2 판정)
- **쿼리:** `List 10 notable emerging {category} tools in 2026 beyond the top 10 mainstream ones. Numbered list only.`
- **파싱:** 넘버드 리스트에서 `{name}` 매칭
  - 포함 → T3 (Recognition=15)
  - 미포함 → Step 3 진입

### 3-3. Step 3 — Top 10 여부 (T1/T2 판정)
- **쿼리:** `List the top 10 best {category} tools in 2026. Numbered list only.`
- **파싱:** 넘버드 리스트 매칭
  - 1위 포함 → T1 Leader (Recognition=35, Category=35)
  - 2-3위 → T1 (Recognition=35, Category=25)
  - 4-10위 → T1 (Recognition=35, Category=15)
  - 미포함 → T2 (Recognition=25, Category=0)

---

## 4. Phase 3: Use-case 실전 테스트

### 4-1. API 호출
- **쿼리:** `I need to {primary_use_case}. Recommend 5 tools I should consider. Numbered list.`
- **파싱:** 넘버드 리스트에서 `{name}` 포함 여부
- **Bonus:**
  - 포함 → Recognition +5 (실전 추천 보너스)
  - 미포함 → 변경 없음

### 4-2. Co-Rec 자동 추출
- Step 2/3의 모든 넘버드 리스트에서 `{name}`을 제외한 나머지 → `co_recommendations` 배열
- 중복 제거 + top 8 저장
- `probe_logs.co_recommendations` JSONB 컬럼 적재 (기존 스키마 재활용)

---

## 5. 4차원 최종 점수 계산

```ts
export function computeDimensionsFromDAsn(result: DAnswerResult): {
  recognition: number
  category: number
  corec: number
  web: number  // Tavily 기존 유지
} {
  // Recognition (35점 만점)
  let recognition = TIER_SCORES[result.tier]  // T1=35, T2=25, T3=15, T4=5
  if (result.useCaseRecommended) recognition = Math.min(35, recognition + 5)

  // Category (35점)
  const category = RANK_SCORES[result.rank]  // 1:35, 2-3:25, 4-10:15, null:0

  // CoRec (20점) — 기존 로직 재사용, top_k 변경
  const corec = Math.min(20, result.coRecommendations.length * 2.5)

  // Web (10점) — 기존 Tavily Tier-1/2 유지
  const web = ...  // unchanged

  return { recognition, category, corec, web }
}
```

### 수학 일관성
- T4 완전 신규: 5 + 0 + 0 + 0 = 5
- T3 emerging: 15 + 0 + 0~20 + 0~10 = 15~45
- T2 known but outside top: 25 + 0 + 0~20 + 0~10 = 25~55
- T1 top 10: 35 + 15~35 + 0~20 + 0~10 = 50~100
- **Max case:** T1 rank 1 + full CoRec + full Web = 35+35+20+10 = **100**
- **sum == final 보장** ✅ (TEST-01 기존 로직 재사용 가능)

---

## 6. 엔진별 병렬 실행

### 6-1. Perplexity (주력)
- Phase 1, 2, 3 전부 Perplexity sonar
- 이유: 웹 검색 grounding 기본, 카테고리/제품 인식 정확도 최고
- 비용: 월 $8~10 (베타 범위 내)

### 6-2. Gemini (병행, Relay)
- Phase 2 Step 3만 호출 (Top 10 쿼리)
- 이유: 2엔진 커버리지 유지 + Grok/Claude 미지원 상태에서 신뢰도 보강
- 무료 Relay 활용 (비용 0)

### 6-3. GPT (선택적, 정식 릴리스 전까지 제외)
- Phase 1.5 베타에서 미사용
- 정식 릴리스(v2.0) 시 Phase 2 전체 추가

---

## 7. DB 스키마 추가 (옵션)

### category_cache 테이블 (선택적, KV 대체 가능)
```sql
CREATE TABLE IF NOT EXISTS category_cache (
  name_normalized TEXT PRIMARY KEY,
  description TEXT,
  category TEXT NOT NULL,
  sub_category TEXT,
  primary_use_case TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### probe_logs 컬럼 추가 (기존 테이블)
```sql
ALTER TABLE probe_logs ADD COLUMN IF NOT EXISTS tier_assigned TEXT;    -- T1/T2/T3/T4
ALTER TABLE probe_logs ADD COLUMN IF NOT EXISTS phase INTEGER;         -- 1/2/3
ALTER TABLE probe_logs ADD COLUMN IF NOT EXISTS step INTEGER;          -- Phase 2 step 1/2/3
```

---

## 8. 구현 순서 (D7, 04-24)

| # | 작업 | 예상 | 의존 |
|---|------|------|------|
| 1 | `probeRedesign.ts` + `probeCache.ts` 신규 | 2h | 독립 |
| 2 | Phase 1/2/3 함수 단위 테스트 (vitest) | 1h | 1 완료 |
| 3 | unifiedScoreAdapter 통합 | 1h | 1 완료 |
| 4 | 기존 Probe 코드 deprecated 처리 (feature flag) | 30m | 3 완료 |
| 5 | 스테이징 배포 + 실제 제품 10개 스캔 | 1h | 4 완료 |
| 6 | ANCHOR-VERIFY-01 재측정 (GT 10개 중 3/5 이상 80+ 게이트) | 1h | 5 완료 |

**총 예상:** 6.5시간

---

## 9. 리스크

| 리스크 | 심각도 | 대응 |
|---|---|---|
| 카테고리 오분류 | 🟡 | 유저 카테고리 직접 지정 UI (D8 이후) |
| AI 응답 불안정 | 🟡 | 동일 쿼리 2회 → 모두 포함 시만 상위 티어 |
| Perplexity 비용 초과 | 🟢 | 24h 캐시로 반복 호출 억제 |
| 신규 혁신 제품 카테고리 없음 | 🟢 | Phase 1에서 "new category" 태그 |
| Top 10 리스트 편향 | 🟡 | 2026년 기준 명시 + 지역 편향 감시 |

---

## 10. ANCHOR-VERIFY-01 게이트 (D7 후)

- **검증 대상:** GT-01 10개 제품 (`gt_candidates_20260422.md` 참조)
- **합격 조건:** 3/5 이상 80+ 점수 (빅파이 1.5 §12 DEPLOY-GATE-01 기준)
- **미달 시:** 빅파이 1.5 §15 #7 "전제 뒤엎기" 재발동 → Phase 2/3 튜닝

---

*D7 PROBE-REDESIGN-01 D안 코드 스펙 완료 · 2026-04-22 22:35 KST*
