# Score System 재설계 — 긴급 진단 및 개편안
**작성자:** CPO/PO (Claude)
**날짜:** 2026-04-17
**트리거:** Notion 42점 / perceptdot 서브스코어 0인데 최종 33점 — CEO 직관이 버그 포착
**상태:** 전면 마케팅 보류, 측정 시스템 재설계 최우선
**Phase 정렬:** phase_1 (Search Console) · moat_data 핵심

---

## 1. 결론부터 (TL;DR)

### 발견한 버그 3건

1. **서브스코어 합 ≠ 최종 점수** (Fatal) — perceptdot: dim 5개 모두 0인데 최종 33으로 표시
2. **Notion 저평가** (Severe) — 실제 AI 인식률보다 낮게 측정 (42/100)
3. **두 스코어 시스템 조건부 전환** (Architectural) — Tavily-기반 vs Probe-기반이 UI에서 뒤섞임

### 근본 원인

**ENGINE-06 전환이 절반만 수행되었습니다.**
- 백엔드: `score`(Tavily 5차원 합계) + `probe_score`(Probe 인식률) **양쪽 모두 계산**
- FE: `probe_count >= 3`이면 `probe_score`로 **표시만 교체**
- 서브스코어 분해(dimensions)는 **언제나 Tavily 것**
- → 사용자 눈에는 "부분 합이 최종과 안 맞는 이상한 제품"으로 보임

### 해결 방향 (권고)

**단일 통합 스코어 시스템 + 서브스코어와 최종 점수의 수학적 일관성 보장** — 자세한 설계는 §4.

---

## 2. 현재 시스템 해부

### 2-1. 백엔드: 두 시스템 병렬 계산

**`api/src/index.ts` line 821-828:**
```typescript
const [engineResult, probeData, coRecs] = await Promise.all([
  runEngine(c.env, name, url),           // Tavily 기반 5차원 점수
  getProbeScore(c.env, name),             // Probe 인식률 (0-100%)
  getCoRecommendations(c.env, name),
])
return c.json({ ...engineResult, ...probeData, co_recommendations_top: coRecs })
```

반환 객체에 **`score`**(Tavily)와 **`probe_score`**(Probe) 두 필드 공존.

### 2-2. FE: 조건부 선택 (버그의 근원)

**`landing/dashboard.html` line 1151-1152:**
```javascript
const useProbe = probe_count >= 3 && probe_score >= 0
const displayScore = useProbe ? probe_score : score
```

→ probe 3회 이상이면 **probe_score만 표시**. 하지만 아래 서브스코어 카드는:

**line 1253:**
```javascript
const pct = Math.round(d.score / max * 100)  // d.score는 Tavily 기반 dimensions
```

→ **서브스코어는 Tavily 값 그대로**. 결과적으로 두 시스템이 UI에 뒤섞입니다.

### 2-3. Tavily 기반 5차원 (`scoreFromTavilyV5`, line 158-307)

| 차원 | 만점 | 로직 | 문제 |
|---|---|---|---|
| Web Presence | 25 | 고유 도메인 수 × 5 | 도메인 수만 세기 → **콘텐츠 질 무시** |
| Source Authority | 20 | Tier-1/2/3 가중치 | Tier 분류 로직의 사각지대 존재 |
| Recommendation Signals | 20 | regex `/recommend\|must-have/` | **매우 엄격** → Notion 같은 진짜 추천 제품도 7/20 |
| Community Validation | 20 | G2/Capterra/Reddit 키워드 | 키워드 존재만 체크, 실제 평판 미반영 |
| Competitive Context | 15 | 비교 콘텐츠 개수 | 비교 당하는 것만으로 점수 — 인과 불명 |

### 2-4. Probe 기반 (`getProbeScore`, line 710-747)

```typescript
const probe_score = Math.round((recognized / valid.length) * 100)
```

- 단순 "인식된 Probe 수 / 전체 Probe 수"
- **"Recognized"는 AI가 이름을 안다는 뜻일 뿐**, 추천 여부는 아님
- 3 AI × N쿼리 = 평균 인식률 → 0~100 스케일
- 프롬프트는 `Product name: Notion. Do you know this?` 단순형 (line 635)

### 2-5. 구조적 결함 요약

```
┌──────────────────────────────────────────────┐
│  BACKEND: 2개 시스템 독립 계산                │
│  - score (Tavily 5차원 합)                   │
│  - probe_score (Probe 인식률)                │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  FRONTEND: 조건부 선택                        │
│  - 최종 점수: probe_score OR score 선택      │
│  - 서브스코어 카드: 언제나 Tavily dims       │
└──────────────────────────────────────────────┘
                    ↓
          ❌ 합과 최종이 안 맞음
          ❌ 사용자 신뢰 박살
          ❌ 마케팅 불가
```

---

## 3. 경쟁사 스코어링 방식 (벤치마크)

### 핵심 발견 (리서치 에이전트 결과 발췌)

| 제품 | 스케일 | 구성 공개 | 방식 | 차별점 |
|---|---|---|---|---|
| **HubSpot AEO Grader** | 0-100 | ✅ (40/20/20/10/10) | 3엔진 API 쿼리 | Sentiment 40% 비중 |
| **Atomic AGI** | 비공개 | ❌ 블랙박스 | 5엔진 연속 트래킹 | "스냅샷 아닌 추적" |
| **Profound** ($499+) | Visibility + trend | ⚠️ 부분 | 엔터프라이즈 | Conversation Explorer (AI 검색량) |
| **Peec AI** (€89~) | Opportunity Score | ✅ | **UI 스크래핑** (API 아님) | 실사용자 관점 |
| **Otterly.AI** | BVI 2D 쿼드런트 | ✅ | 6플랫폼 연속 | Coverage × Position |

### 업계 표준 5개

1. **Brand Mentions + Share of Voice + Sentiment** 삼각 구도
2. 3엔진 이상 교차 검증 (ChatGPT/Perplexity/Gemini는 필수)
3. 가중치와 공식 **공개** (투명성 = 신뢰)
4. 경쟁사 벤치마크 **반드시** 동반
5. 연속 트래킹 (1회 진단은 재방문 유도 실패)

### pickedby.ai가 이길 수 있는 3축

1. **"3엔진 동시 통과" 바이너리 지표** — 가중평균 말고 AND 조건 통과율 전면화
2. **AI Probe 공개 실험 투명성** — 쿼리 원문·결과 로그 공개 (Probe Log 자산이 이미 있음)
3. **인디해커 가격대** — Free + $20 범위 (Profound $499 vs HubSpot 무료 사이의 공백)

---

## 4. 새 스코어 체계 설계 (PROPOSAL)

### 4-1. 원칙 5개

1. **단일 시스템** — 두 스코어 병렬 금지. 하나로 통합, 최종점수 = Σ서브스코어 **수학적으로 일치 보장**
2. **Probe 중심** — AI 직접 측정이 **사실의 근거**. Tavily는 **예측 보조지표**
3. **공개 공식** — 가중치와 계산식을 공개 페이지에 배치 (HubSpot 모범)
4. **바이너리 통과 지표 병기** — 0-100 점수 + "3엔진 동시 통과 여부"(✅/⚠️/❌) 두 가지 병행 표시
5. **모든 변경에 골든 케이스 테스트** — 재발 방지 (§6)

### 4-2. 새 5차원 구조 (제안)

| # | 차원 | 만점 | 계산 | 측정 방식 |
|---|---|---|---|---|
| 1 | **Direct AI Recognition** | 30 | ChatGPT·Perplexity·Gemini 각 3쿼리 × 10점 | Probe 직접 |
| 2 | **Category Ranking** | 25 | "best {category}" 쿼리에서 top-10 등장 순위 반영 | best_in_category 템플릿 |
| 3 | **Co-Recommendation Graph** | 20 | 경쟁 제품과 함께 언급되는 빈도 (graph centrality) | probe_logs 파싱 |
| 4 | **Web Authority Signal** | 15 | Tier-1/2 citation 수 (기존 Tavily 재활용) | Tavily |
| 5 | **Sentiment & Context** | 10 | 긍정/중립/부정 분류 | AI 감성 분석 |
| **합계** | | **100** | — | — |

**핵심 차이:**
- 직접 AI 측정이 **30점**으로 최대 비중
- 카테고리 쿼리(`best {category}`)가 **25점**으로 등장 — Notion 같은 잘 알려진 제품이 정확히 잡힘
- Tavily는 15점으로 **강등** (보조 지표)
- 합계가 정확히 100점 — **서브스코어 합 == 최종 점수 수학적 보장**

### 4-3. 병기 지표: Trifecta Pass

```
Trifecta: ChatGPT ✅ AND Perplexity ✅ AND Gemini ✅
```

- 3엔진 모두 "recommended" 상태면 🏆 **TRIFECTA**
- 2/3이면 🟢 **STRONG**
- 1/3이면 🟡 **EMERGING**
- 0/3이면 🔴 **INVISIBLE**

→ 점수는 gradient, 패스 지표는 binary. **바이럴 스크린샷에 강함**.

### 4-4. 재측정 루프

- 일일 크론: 등록 제품 전체 자동 재측정
- 주간 트렌드 차트: 점수 변화 추적
- Momentum 지표: ↑N pts vs last week

---

## 5. 캘리브레이션 벤치마크 (Ground Truth)

새 시스템 검증용 Ground Truth 10개 제품. 수동 측정 기준 점수가 아래 범위를 벗어나면 **시스템 결함**으로 판정:

| 제품 | 예상 점수 | Trifecta | 근거 |
|---|---|---|---|
| Notion | 85~95 | 🏆 | 8년 축적, AI 학습 데이터 최고 수준 |
| Figma | 85~95 | 🏆 | 디자인 카테고리 지배 |
| Linear | 70~80 | 🏆 | 인디해커 커뮤니티 표준 |
| Vercel | 70~85 | 🏆 | 개발자 표준 |
| ShipFast | 55~70 | 🟢 | 크리에이터 SaaS, Perplexity 강 |
| TypingMind | 55~70 | 🟢 | 니치 강자 |
| Airtable | 70~85 | 🏆 | 업계 표준 |
| **perceptdot** | 15~30 | 🟡/🔴 | **자사**, 5주 제품 |
| **pickedby.ai** | 20~35 | 🟡/🔴 | **자사**, Day 12 |
| 가짜 제품명 | 0~5 | 🔴 | 허위 탐지 검증 |

**검수 프로토콜:**
1. 구현 후 10개 제품 전부 측정
2. 예상 범위 벗어나는 제품 있으면 **배포 금지**
3. 벗어난 원인 분석 → 공식 재조정 → 재측정

---

## 6. 재발 방지 (Auto-Test)

### 6-1. 단위 테스트 (신규)

```typescript
// api/src/score.test.ts (신규 작성)

describe('scoreIntegrity', () => {
  it('서브스코어 합은 최종 점수와 정확히 일치한다', async () => {
    const result = await runEngine(env, 'Notion', 'https://notion.so')
    const sum = result.dimensions.reduce((a, d) => a + d.score, 0)
    expect(sum).toBe(result.score)  // 🔴 반드시 통과
  })

  it('Ground Truth 10개가 예상 범위 내에 있다', async () => {
    for (const gt of GROUND_TRUTH) {
      const r = await runEngine(env, gt.name, gt.url)
      expect(r.score).toBeGreaterThanOrEqual(gt.min)
      expect(r.score).toBeLessThanOrEqual(gt.max)
    }
  })
})
```

### 6-2. 배포 전 체크리스트 (훅)

```bash
# scripts/pre-deploy-score-check.sh
npm test -- score.test.ts
if [ $? -ne 0 ]; then
  echo "❌ Score integrity check failed. Deploy blocked."
  exit 1
fi
```

→ `scripts/deploy-staging.sh`와 `deploy-prod.sh`에 자동 실행 연결.

### 6-3. 프로덕션 모니터링

- 매 `/v1/check` 응답에 **불일치 감지 로그**:
```typescript
if (Math.abs(sumOfDims - finalScore) > 0.1) {
  console.error(`[SCORE_MISMATCH] product=${name} dims=${sumOfDims} final=${finalScore}`)
}
```
- Sentry 알림 연결

---

## 7. 구현 계획 (7단계)

| # | 작업 | 소요 | 우선순위 |
|---|---|---|---|
| 1 | 단일 스코어 함수 `computeUnifiedScore()` 작성 | 3h | P0 |
| 2 | 5차원 새 계산 로직 (§4-2) 구현 | 4h | P0 |
| 3 | FE dashboard.html 이원 표시 로직 제거 | 1h | P0 |
| 4 | Trifecta 뱃지 컴포넌트 추가 | 1h | P0 |
| 5 | Ground Truth 10개 자동 테스트 구축 | 2h | P0 |
| 6 | 공식 공개 페이지 `/methodology` 신설 | 2h | P1 |
| 7 | 기존 probe_logs 기반 재계산 배치 | 1h | P1 |

**총 소요:** 1일 (10~12시간 실작업) — **오늘 ~ 내일**

### 단계별 게이트

- 단계 1~5 완료 → **스테이징 배포 + Ground Truth 통과 확인** → CEO 리뷰
- CEO 승인 → 단계 6~7 → 프로덕션 배포
- 프로덕션 배포 후 → 자체 재측정 → **그때 마케팅 재개**

---

## 8. 마케팅 재개 조건 (명확한 게이트)

마케팅(LinkedIn/DM/뉴스레터)은 아래 **4개 조건 전부 충족** 시에만 재개:

- [ ] Ground Truth 10개 전부 예상 범위 내
- [ ] `sum(dims) === finalScore` 단위 테스트 통과
- [ ] Notion 85+ / perceptdot 20±10 재측정 확인
- [ ] CEO가 재측정 결과 직접 확인 + 승인

조건 미충족 시 마케팅 무기한 연기. **신뢰가 제품의 유일한 자산**입니다.

---

## 9. 위험 및 대안

### 위험
- 재설계 과정에서 더 많은 버그 발견 가능성
- Ground Truth 예상이 틀릴 수 있음 (Notion이 실제로 AI에게 덜 알려져 있을 수도)
- 1일 예상이 2~3일로 늘어날 가능성

### 대안
- Ground Truth 실측과 기대가 크게 벗어나면 **기대를 조정** (맹목적 교정 금지)
- 1일 넘기면 마케팅 보류 연장 + CEO 보고

---

## 10. 빅파이 1.0 정렬

이 작업은 **빅파이 1.0 P0 ENGINE-06의 사실상 완성**입니다.
- "Probe 등장률 → 메인 스코어 전환" 목표의 실질 구현
- 데이터 모트 강화: Probe 로그 + co_recommendations 그래프가 **실제로 점수를 움직임**
- 경쟁자 복제 불가: 우리의 `probe_logs` 누적 데이터가 시계열 자산으로 작동

**자문 통과:**
- ✅ 데이터 모트 강화: Probe 30점 + CoRec 20점 = **50점**이 자사 데이터에서 나옴
- ✅ 플라이휠: 측정 정확도 ↑ → 유저 신뢰 ↑ → 등록 ↑ → Probe 누적 ↑ → 정확도 ↑

---

## 11. 최종 권고

**전면 중단된 마케팅은 이 재설계가 끝날 때까지 유지합니다.** 오늘 작성한 5개 마케팅 산출물은 아카이브만 하고 발송 안 합니다. 재설계 완료 후, 새 점수로 다시 Notion + perceptdot를 측정하면 **더 강력한 스토리**가 나옵니다 (예: "우리는 버그를 찾았고, 재설계했고, 이제 Notion은 정확히 92점입니다").

이 **과정 자체가 더 강한 빌드인퍼블릭 콘텐츠**가 됩니다.

---

## 12. 즉시 결정 요청

CEO 승인 부탁드립니다:

1. **§4 5차원 재설계안** 방향 동의하십니까?
2. **§5 Ground Truth 10개 제품 선정** 동의하십니까? (수정 원하시면 말씀해 주십시오)
3. **§7 구현 계획 1일** 착수 승인하십니까?
4. **§8 마케팅 재개 4개 조건** 동의하십니까?

승인 주시면 Step 1(`computeUnifiedScore` 설계)부터 바로 착수하겠습니다.

---

*End of score redesign document.*
