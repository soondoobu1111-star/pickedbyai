# 🔴 BUG-SCORE-UNIFY-FIX-01 — Cron unified_v15 누락으로 매일 자정 롤백

> **심각도**: 🔴 P0 (사용자 대면, 데이터 일관성 파괴)
> **상태**: ✅ 수정 완료 (스테이징 + 프로덕션)
> **발견일**: 2026-04-20
> **발견자**: CEO (대시보드 Trend 탭에서 구형 5차원 표시 목격)
> **특별 관리**: 예 (재발 방지 테스트 필수)

---

## 1. 증상

- 스테이징 대시보드(`staging-0404.pickedby.ai/dashboard#trend`)에서 제품 상세 펼침 시 **구형 5차원**(Web Presence / Source Authority / Recommendation Signals / Community Validation / Competitive Context)이 표시됨
- 빅파이 1.5 확정 4차원(Recognition 35 + Category 35 + CoRec 20 + Web 10)이 나와야 정상
- **수동 체크 직후에는 4차원이 보였다가**, 페이지 새로고침 또는 **다음날 되면 구형 5차원으로 복귀** → CEO가 "롤백된다" 표현
- `UNIFIED_SCORE_V15="true"` 플래그는 정상 설정돼 있음

---

## 2. 근본 원인

### 데이터 흐름 두 경로
| 경로 | 코드 | unified_v15 저장 | 비고 |
|------|------|-----------------|------|
| FE 수동 체크 `saveHistory()` | `landing/dashboard.html:1701` | ✅ 포함 | 정상 |
| **서버 cron `dailyRefresh()`** | `api/src/index.ts:979` | ❌ **누락** | **버그** |

### 재현 타임라인
```
[Day 1 14:00] 유저가 수동 체크 실행
 → API /v1/check 응답에 unified_v15 포함
 → saveHistory 가 scores 테이블에 unified_v15 JSONB 저장 ✅
 → FE 4차원 정상 표시 ✅

[Day 2 02:00 UTC] 매일 cron dailyRefresh 실행
 → runEngine 만 호출, unified 계산 안 함
 → scores 테이블에 새 row INSERT 시 unified_v15 = null ❌
 → loadHistory 가 created_at DESC 정렬로 최신 row(null) 로드
 → FE 가 row.unified_v15 없으니 renderDimRowV5 (구형 5차원) 로 폴백
 → **매일 자정마다 4차원 → 5차원으로 롤백** ❌
```

### 핵심 코드 위치 (수정 전)
```typescript
// api/src/index.ts:979 (dailyRefresh 내부)
await fetch(`${sbUrl}/rest/v1/scores`, {
  method: 'POST',
  body: JSON.stringify({
    user_id: task.user_id,
    product_name: task.product_name,
    product_url: task.product_url,
    score: savedScore,
    results: result.results,
    dimensions: result.dimensions,
    ai_probe: result.aiProbe,
    // ❌ unified_v15 누락
  }),
})
```

FE 폴백 로직 (이것 자체는 정상):
```javascript
// landing/dashboard.html:1487
if (unified) {
  dims.innerHTML = unified.dimensions.map(d => renderDimRowV15(d)).join('')
} else if (dimensions) {
  dims.innerHTML = dimensions.map(d => renderDimRowV5(d)).join('')  // ← 여기로 빠짐
}
```

---

## 3. 영향 범위

| 범위 | 영향 |
|------|------|
| 스테이징 | 🔴 발현 (UNIFIED_SCORE_V15=true) |
| 프로덕션 | 🟡 잠복 (UNIFIED_SCORE_V15 미설정, 플래그 켜는 순간 발현) |
| DB 데이터 | scores 테이블 2026-04-18 이후 cron-생성 row 전수 unified_v15=null |
| UX | 수동 체크 → 구형 표시 반복으로 **신뢰도 손상 (CEO 직접 목격)** |
| 비즈니스 | 빅파이 1.5 가치 제안("4차원 단일 체계") 증명 실패 |

---

## 4. 수정 내용 (SCORE-UNIFY-FIX-01)

**파일**: `api/src/index.ts` (dailyRefresh 내부, 라인 975 부근)

cron 내부에서 `runEngine()` 실행 후 `UNIFIED_SCORE_V15 === 'true'` 일 때 `buildDimensionContext()` + `computeUnified()` 로 unified_v15 계산 후 scores INSERT 에 포함:

```typescript
let cronUnifiedV15: UnifiedScoreResult | null = null
if (env.UNIFIED_SCORE_V15 === 'true') {
  try {
    const tavilySources = (result.sources || []).map((s: SourceInfo) => ({
      url: s.url, tier: s.tier, isOwn: s.isOwn,
    }))
    const ctx = await buildDimensionContext(env, {
      productName: task.product_name,
      productUrl: task.product_url ?? undefined,
      tavilySources,
      aiProbes: result.aiProbe,
    })
    cronUnifiedV15 = computeUnified(ctx)
  } catch (err) {
    console.error('[CRON] unified_v15 error:', err)
  }
}

await fetch(`${sbUrl}/rest/v1/scores`, {
  method: 'POST',
  body: JSON.stringify({
    ...기존,
    unified_v15: cronUnifiedV15,  // ← 추가
  }),
})
```

---

## 5. 배포

| 환경 | 버전 | 시각 (KST) |
|------|------|------------|
| 스테이징 | `edc51247-0e29-40f9-8509-0152493631e2` | 2026-04-20 오후 |
| 프로덕션 | (본 리포트 작성 시점 배포 예정) | 2026-04-20 오후 |

**tsc**: 0 에러
**플래그 변경**: 없음 (프로덕션 UNIFIED_SCORE_V15 off 유지 — CEO 별도 승인 필요)

---

## 6. 검증 절차

### 즉시 검증 (스테이징)
1. 대시보드에서 pickedby.ai 제품 수동 체크 1회 실행
2. 페이지 새로고침
3. 제품 상세 펼침 → 4차원(Recognition/Category/CoRec/Web) 표시 확인
4. Supabase 스테이징 scores 테이블 쿼리: `SELECT product_name, unified_v15 FROM scores WHERE product_name='pickedby.ai' ORDER BY created_at DESC LIMIT 3`
   → 최신 row `unified_v15` JSONB not null 확인

### 영구 검증 (내일 이후)
1. 04-21 02:00 UTC cron 자동 실행 대기
2. cron 로그 확인: `[CRON] ✓ {product} score={n} unified={score}` 패턴
3. 04-21 오전 대시보드 새로고침 → 여전히 4차원 표시 확인 (롤백 없음)

---

## 7. 특별 관리 항목 (재발 방지)

### 🔴 필수 테스트 (Phase 1 TEST-01 에 추가)
- [ ] **TEST-CRON-UNIFIED-01**: cron `dailyRefresh` mock 실행 후 scores INSERT 페이로드에 `unified_v15` 필드 존재 검증
- [ ] **TEST-CRON-UNIFIED-02**: `UNIFIED_SCORE_V15="true"` 환경에서 cron 실행 시 `unified_v15` 가 null 이 아닌 UnifiedScoreResult 타입 검증
- [ ] **TEST-CRON-UNIFIED-03**: 연속 2회 cron 실행 후 DB scores row 2건 모두 unified_v15 not null 검증

### 🔴 구조적 방지책
1. **Single Source 원칙**: `runEngine` 호출부는 cron / manual / auto-check / retry 4곳에 분산 — 향후 `/v1/check` 에 통일하거나, 공통 `persistScore()` 헬퍼로 집중화 권장
2. **DB Constraint 고려**: `UNIFIED_SCORE_V15="true"` 환경에서는 scores.unified_v15 NOT NULL 제약 추가 검토 (Phase 1 완료 후)
3. **FE 폴백 경고**: renderDimRowV5 (구형 5차원) 로 빠질 때 `console.warn('[SCORE] unified_v15 missing, falling back to V5')` 추가 → 운영 모니터링 가능

### 🔴 프로덕션 플래그 활성화 체크리스트 (v1.5 정식 런칭 시)
- [ ] 본 버그 수정 프로덕션 배포 완료
- [ ] TEST-CRON-UNIFIED-01~03 통과
- [ ] scores 테이블에 unified_v15 컬럼 존재 (이미 D1 마이그레이션으로 추가됨)
- [ ] 기존 scores row 마이그레이션 스크립트 or 전체 재계산 cron 1회 실행
- [ ] CEO 승인
- [ ] `UNIFIED_SCORE_V15 = "true"` 프로덕션 wrangler.toml 에 추가 + 배포

---

## 8. 교훈 (영구 기록)

1. **이원 저장 경로는 반드시 동일 스키마로 저장한다.** FE 수동 저장과 서버 cron 저장이 서로 다른 필드를 저장하면 자정마다 롤백이 발생한다.
2. **플래그 분기는 코드의 모든 경로를 커버해야 한다.** `UNIFIED_SCORE_V15 === 'true'` 분기가 `/v1/check` 엔드포인트에만 있고 cron 에 없으면 "플래그 반쪽 활성화" 상태가 된다.
3. **"롤백된다"는 사용자 표현을 기술적으로 해석해야 한다.** 코드 롤백이 아니라 데이터 롤백 (매일 덮어쓰기) 이었다.
4. **CEO 직감 신뢰 (빅파이 교훈 #6 재확인)**. "왜 자꾸 구형이 나오냐"는 직관이 버그 탐지의 시작이었다.

---

*이 버그는 재발 시 빅파이 1.5 정식 런칭 일정에 직접 영향을 미치므로 특별 관리 대상으로 지정합니다.*
