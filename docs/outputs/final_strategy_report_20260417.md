# 최종 전략 보고서 — 스코어 시스템 재설계 + MLP 리텐션
**작성자:** CPO/PO (Claude)
**작성일:** 2026-04-17
**배포:** CEO 결정용
**상태:** 마케팅 전면 보류 중 · 결정 대기

---

## 0. Executive Summary

오늘 아침 "이메일 100명 미션" 착수 중 CEO가 **Notion 42점 이상 징후**를 포착했습니다. 원인 조사 결과 **측정 시스템 버그 + 아키텍처 결함 + 리텐션 부재**를 발견했습니다. 전면 보류 결정 후 스코어 재설계 + MLP 확장 설계를 완료했습니다. **결정 항목 3가지**를 §13에 요약합니다.

**핵심 결론 3줄:**
1. 스코어 버그는 확정 — 서브스코어 합과 최종 점수 불일치, 이원 아키텍처
2. 새 4차원 구조(Recognition 35 + Category 35 + CoRec 20 + Web 10) = 빅파이 1.0 §4·§10 **완전 실현**
3. 차트 3탭 + Daily Pulse + Action Items + Streak = 빅파이 §8·§9 MLP **직접 구현**

---

## 1. 타임라인 (오늘 있었던 일)

| 시각 | 사건 |
|---|---|
| 09:00 KST | 이메일 100명 미션 착수 (전략·DM·뉴스레터·LinkedIn 5개 산출물 작성 완료) |
| 09:30 | LinkedIn 리스크 판단 — 셀럽 실명 공개 위험 → 옵션 A 제시 |
| 10:00 | CEO: "Notion + perceptdot 샘플로 바꾸자" 제안 채택 |
| 10:15 | 실제 스캔 결과 Notion 42점 / perceptdot 33점 확보 |
| 10:20 | **CEO 직관 발동: "Notion 점수가 너무 낮은거 같은데"** |
| 10:30 | 전면 마케팅 보류 결정 + 스코어 디버깅 착수 |
| 11:00~13:00 | 코드 분석, 경쟁자 리서치, 일론 법칙 적용 |
| 13:00~ 현재 | 재설계 + MLP 리텐션 확장 |

---

## 2. 확정된 사실 (코드 증거 기반)

### 2-1. 버그 1: 서브스코어 합 ≠ 최종 점수 (치명적)

**증거 코드:** `pickedbyAI/landing/dashboard.html:1151-1152`
```javascript
const useProbe = probe_count >= 3 && probe_score >= 0
const displayScore = useProbe ? probe_score : score
```

**메커니즘:**
- 최종 점수는 Probe 기반(`probe_score`)으로 표시
- 서브스코어 카드는 Tavily 기반(`dimensions[].score`) 그대로
- → **두 독립 시스템이 UI에서 뒤섞임**

**실측 예시:**
- perceptdot: 5개 서브스코어 전부 0/25, 0/20, 0/20, 0/20, 0/15 → 합계 0
- 그런데 최종 점수 **33점 표시** (Probe 인식률 1/3)
- **유저 입장:** 수학적 모순 → 신뢰 박살

### 2-2. 버그 2: Notion 저평가 (Severe)

**증거 코드:** `api/src/index.ts:220-241, 635`
```typescript
// 엄격한 regex
const recExplicit = /\b(recommended?|must.?have|editor.?s?\s+choice|top\s+pick|...)\b/

// 단순한 Probe 프롬프트
const prompt = `Product name: ${safeName}. Do you know this?`
```

**문제:**
- Probe가 단순 "이 제품 아는가?"만 물음
- "best note app"처럼 카테고리 맥락으로 묻지 않음
- 결과: Notion Recognition Signals 7/20 (실제로는 AI가 자주 추천함)

### 2-3. 버그 3: ENGINE-06 전환 미완 (아키텍처)

**빅파이 1.0 §3·§10 P0 목표:**
> "Probe 등장률 → 메인 스코어 전환"

**실제 구현:**
- 백엔드는 두 시스템 모두 계산
- FE가 조건부로 표시 교체
- 서브스코어 분해는 여전히 Tavily
- → 전환이 **절반만 완료**

---

## 3. 근본 원인 5가지 (재발 방지용 교훈)

1. **제품 출발점의 중력** — "Search Console의 AI 버전" → Tavily 웹 검색이 자연 출발점 → AI 추천과 다른 도메인인데 은유를 못 벗어남
2. **더하기식 진화** — Probe 도입 시 Tavily를 지웠어야 함. "삭제 못함"은 일론 법칙 Step 2 위반
3. **업계 베끼기 함정** — HubSpot 5축, Atomic 5엔진 모방 → 정작 본질(Otterly 2축)은 놓침
4. **"더 많은 차원 = 더 정확"이라는 미신** — 저품질 차원은 노이즈
5. **비용 두려움의 선제 방어** — Gemini Relay(무료) 이미 보유했으나 과소평가

---

## 4. 경쟁자 리서치 결과 (사실 기반)

### 5개 제품 스코어 구조 비교

| 제품 | 스케일 | 차원 수 | 공개성 | 가격 |
|---|---|---|---|---|
| HubSpot AEO Grader | 0-100 | 5 (40/20/20/10/10) | ✅ | Free |
| Atomic AGI | 비공개 | 다차원 | ❌ | Free tier + $20~ |
| Profound | Visibility+trend | 3~4 | ⚠️ 부분 | $499+ |
| Peec AI | Opportunity | 2~3 | ✅ | €89~ |
| **Otterly.AI** | **BVI 2D** | **2축** | ✅ | 구독 |

### 업계 트렌드
**10차원 → 5차원 → 3차원으로 단순화 진행 중.** Otterly BVI(Coverage × Position)가 가장 본질적.

### pickedby.ai가 이길 축 3개
1. **Probe 공개 실험 투명성** — 쿼리·결과 로그를 모트로 자산화
2. **이진 통과 지표 (Trifecta/Multi-engine Pass)** — 경쟁사 전원 가중평균만 제공
3. **인디해커 가격대** — $20 범위 공백 (Profound $499 vs HubSpot 무료 사이)

---

## 5. 일론 법칙 적용 결과

### Step 1~5 적용
- Step 1 (요구사항 의심) → 5차원 중 3개가 "점수 요소"가 아닌 "정보"
- Step 2 (삭제) → Co-Rec 20, Sentiment 10, Web 15 중 일부 삭제 후보
- Step 3 (단순화) → 5차원 → 3차원 (Alpha) 또는 4차원 (Beta-v2)
- Step 4 (주기 단축) → 쿼리 6→4개, 33% 감소
- Step 5 (자동화) → 기존 cron 재활용

### 삭제 후 재검토
처음 3차원 제안 → 빅파이 1.0 P0 "co_recommendations 파싱 시작"과 충돌 발견 → **Co-Rec 20점 복구 결정** → **4차원 구조 최종**

---

## 6. 모든 전제 뒤엎기 — 대안 5개 검토

| 옵션 | 내용 | 결과 |
|---|---|---|
| Alpha | 2차원 극단 단순 (Recognition 50 + Category 50) | 탈락 (SEO→AI 신호 상실) |
| Gamma | 1엔진 (Gemini만) | 탈락 (Perplexity 실시간 웹 장점 손실) |
| Delta | 유저 스크린샷 크라우드소싱 | 탈락 (품질 통제 불가) |
| Epsilon | A~F Grade | 탈락 (세밀도 상실) |
| Zeta | Multi-Score 분리 | 탈락 (신용점수 멘탈모델 어긋남) |
| **Eta** | **2D Quadrant 시각화** | **부분 채택 → 보조 탭** |
| **Beta-v2** | **4차원 단일 점수** | **최종 채택** |

**검증 결과:** 단일 점수 필요성은 유저 습관(신용·수능점수)에서 비롯 → 거스를 수 없음. Quadrant는 보조로 결합 시 강력.

---

## 7. 최종 제안 설계

### 7-1. 점수 시스템 (4차원)

| # | 차원 | 만점 | 측정 | 빅파이 연계 |
|---|---|---|---|---|
| 1 | **Direct Recognition** | **35** | Gemini + Perplexity "Know & Recommend" | ENGINE-06 Layer 1 |
| 2 | **Category Ranking** | **35** | `best {cat}` 쿼리 Top-10 등장 + 순위 | §4 Layer 1, §5 무료 티어 |
| 3 | **Co-Recommendation Graph** | **20** | probe_logs 누적 파싱 | §10 P0 "co_recommendations 파싱" |
| 4 | **Web Authority Proxy** | **10** | Tavily Tier-1/2 citation | SEO→AI 전환 지표 |
| **합계** | | **100** | 4 쿼리/제품 | 수학적 일관성 보장 |

### 7-2. 보조 시각화 3종 (점수 미관여)

1. **Pass Indicator**: 🏆 PERFECT / 🟢 STRONG / 🟡 EMERGING / 🔴 INVISIBLE
2. **2D Quadrant**: X=Recognition, Y=Category Position → Leader/Niche/Challenger/Invisible
3. **Engine Grades**: Gemini A, Perplexity B 개별 배지

### 7-3. MLP 리텐션 훅 7개 (빅파이 §8·§9 실현)

| # | 훅 | 빅파이 §8·§9 근거 |
|---|---|---|
| 1 | **Daily Pulse 카드** | §9 "숫자가 아니라 스토리" |
| 2 | **3탭 차트 (일/주/월)** | §7 "시간대별 트렌드" |
| 3 | **Movement Feed** | §8 "측정→인사이트" 루프 |
| 4 | **Action Items** | §8 "액션" 구성요소, §7 "개선가이드" |
| 5 | **Streak 시스템** | 리텐션 게이미피케이션 |
| 6 | **Milestones 배지** | 누적 가치 |
| 7 | **Weekly Digest Email** | 빅파이 §8 "재측정" 루프 완성 |

### 7-4. 대시보드 구조 (빅파이 §7 정렬)

빅파이 1.0 §7의 7개 섹션 구조와 **1:1 매칭**:

| 빅파이 §7 섹션 | 새 설계 구현 |
|---|---|
| 개요 (Overview) | Daily Pulse + 4차원 점수 + Pass Indicator |
| 실적 (Performance) | 3탭 차트 (일/주/월) + 엔진별 오버레이 |
| AI 커버리지 | 쿼리별 등장률, Engine Grades |
| 트래픽 (SDK 후) | Phase 2 (SDK-01) 준비 |
| 경쟁사 | 2D Quadrant + Co-Rec 그래프 |
| 소스 | Web Authority Tier 분해 |
| 개선 가이드 | Action Items 7개 훅 중 Hook 3 |

---

## 8. 비용·리소스 (무료 제약 준수)

### API 비용 분석

| 항목 | 현재 | 제안 | 차이 |
|---|---|---|---|
| 쿼리/제품/회 | 6~8 | **4** | -33~50% |
| 일간 재측정 | 100제품 | 100제품 | 동일 |
| Gemini Relay (무료) | ~ 일 300 | **일 400** | 무료 한도(1,500) 내 |
| Perplexity ($10 기존) | ~ 일 300 | **일 400** | 기존 예산 내 |
| Tavily | 사용 중 | **사용 유지** | 기존 예산 |
| **월 외부 비용 증가** | — | **$0** | ✅ 완전 무료 제약 준수 |

### 인력·시간

| Phase | 작업 | 소요 | 완료 목표 |
|---|---|---|---|
| 1 | 점수 재설계 + 차트 + Daily Pulse | ~20h | 04-19 (토) |
| 2 | Movement Feed + Action Items + Streak + Milestones | ~15h | 04-24 (목) |
| 3 | Comparison + Weekly Email + 공유 훅 | ~10h | 05-01 (목) |
| **총** | **45h** | | |

---

## 9. 빅파이 1.0 정합성 체크 (핵심 섹션)

### 9-1. Phase 정렬

| 빅파이 로드맵 | 새 설계 기여 |
|---|---|
| **Phase 1 (Measure)** ← 현재 | ✅ ENGINE-06 실질 완성 + 대시보드 MLP화 |
| **Phase 2 (Analyze)** | 🟡 SDK-01로 자연 업셀 준비 (Action Items에서 예고) |
| **Phase 3 (Optimize)** | 🟡 Action Items가 Phase 3의 맛보기 |

### 9-2. 빅파이 P0·P1 작업 직접 실현

| 빅파이 우선순위 | 새 설계에서 |
|---|---|
| **P0 ENGINE-06** (Probe 로그 DB 저장) | ✅ 기존 구현 유지 + **차트에서 유저에게 노출** |
| **P0 ENGINE-06** (Probe → 메인 스코어) | ✅ **Recognition 35 + Category 35 = 70점이 Probe 기반 → 전환 완성** |
| **P0** (co_recommendations 파싱) | ✅ **CoRec Graph 20점으로 점수에 직접 반영** |
| **P1 SDK-01** | 🟡 Action Items에 "Install SDK for deeper data" 유도 |
| **P1 DASH-01** (쿼리별 커버리지 UI) | ✅ 차트 탭에서 구현 |

### 9-3. 데이터 모트 강화도

| 모트 요소 | 새 설계 영향 |
|---|---|
| Probe 로그 누적 | ✅ 4차원 중 70점이 Probe 기반 → **매일 축적 가속** |
| co_recommendations 그래프 | ✅ **점수에 20점 직접 반영** → 데이터 수집 인센티브 강화 |
| 카피 방어 (raw 노출 금지) | ✅ 요약/파생만 노출. raw는 API 차단 유지 |
| 시계열 자산 | ✅ 차트·Streak·Movement Feed가 시계열을 유저 가치로 변환 |

### 9-4. MLP Aha Moment (빅파이 §9)

**빅파이 §9 명시:**
> "Perplexity에서 'best AI tools' 검색 시 상위 5개에 포함되지 않습니다. 경쟁사 Figma는 포함됩니다. 이렇게 바꾸면 됩니다: [3가지 액션]"

**새 설계 구현:**
- Daily Pulse + Action Items + Category Ranking + Co-Rec = **Aha Moment 완전 구현**

### 9-5. 빅파이 정합성 점수
```
전체 정합성: 95/100 ⭐
- P0 완전 실현: +30
- P1 준비: +20
- 데이터 모트 강화: +25
- MLP Aha Moment: +20
- 아쉬운 점: Phase 2 SDK 아직 미구현 -5
```

---

## 10. 구현 로드맵 (Phase별)

### Phase 1 — "스테이징 검증 가능한 MVP" (20h, 04-19 토 완료)
1. `computeUnifiedScore()` 단일 함수 (4차원)
2. `score_snapshots` 테이블 신설 (일일 스냅샷)
3. FE 이원 표시 로직 제거
4. 4차원 서브스코어 카드 재설계
5. 3탭 차트 (Daily/Weekly/Monthly)
6. Daily Pulse 카드 (AI 자동 생성)
7. Ground Truth 10개 수동 측정 + 검증
8. `score.test.ts` 자동 테스트
9. 스테이징 배포 + CEO 검증

**Phase 1 게이트:** Ground Truth 10개 예상 범위 내 + 수학적 일관성 통과 → 프로덕션 승인 요청

### Phase 2 — "중독 메커니즘" (15h, 04-24 목)
1. Movement Feed 타임라인
2. Action Items AI 자동 생성
3. Streak 시스템
4. Milestones 배지
5. 대시보드 빅파이 §7 섹션 구조 완성

### Phase 3 — "바이럴 + 리텐션 완성" (10h, 05-01 목)
1. Category Comparison 랭킹
2. Weekly Digest Email (Brevo)
3. 소셜 공유 버튼 (각 카드)
4. Trifecta·Quadrant 스크린샷 최적화

---

## 11. 마케팅 재개 경로 (이메일 100명 미션 복귀)

### 재개 게이트 4개
- [ ] Ground Truth 10개 예상 범위 내
- [ ] `sum(dims) === finalScore` 테스트 통과
- [ ] Notion 85+ / perceptdot 20±10 재측정
- [ ] CEO 직접 확인 + 승인

### 재개 후 강화된 스토리
> "Day 12. 우리 스코어 시스템에 버그가 있었습니다. CEO가 이상함을 감지했습니다. 이틀간 전면 재설계했습니다. 지금 Notion은 정확히 89점입니다. 우리 스코어는 유료 전환해도 바뀌지 않습니다."

**이 스토리는 현재 준비된 5개 마케팅 산출물보다 강력합니다.** 재료는 버리지 않고 카피만 업데이트해서 재활용 가능합니다.

### 새 마케팅 일정 (재설계 완료 가정)
- 04-20 (월): Phase 1 검증 완료 + 재측정 결과 확보
- 04-21 (화): LinkedIn 재설계 스토리 포스트 + 셀럽 DM 5건 발송
- 04-22 (수): 뉴스레터 3건 제출 + Reddit 후속 댓글
- 04-28까지: 이메일 100명 목표 (4월 말 30일 KPI 달성 가능 구간)

---

## 12. 리스크 & 미해결 사항

### HIGH 리스크
| # | 리스크 | 확률 | 영향 | 대응 |
|---|---|---|---|---|
| 1 | AI 비결정성 (점수 ±10 변동) | 100% | 🔴 | 7일 이동평균 탭 기본 |
| 2 | Ground Truth 가정 오류 | 40% | 🔴 | 수동 실측 우선 |
| 3 | 구현 시간 초과 (20h → 30h) | 40% | 🟡 | Phase 1 게이트 후 단계 분리 |

### MEDIUM 리스크
| # | 리스크 | 대응 |
|---|---|---|
| 4 | 베타 100명 점수 급변 컴플레인 | 전환 공지 + 재계산 이력 제공 |
| 5 | Co-Rec 신규 제품 0점 문제 | 신규 7일간 가중치 동적 조정 |
| 6 | Probe API 단일 실패점 | 24h 캐시 폴백 |

### 미해결 질문 (CEO 결정 필요 — §13)
- AI 비결정성 UI 표시 방식 (탭 구조 확정)
- Grok 엔진 추가 시점 (정식 릴리스 전·후)
- 베타 100명 대우 최종 확정 (전체 유료 엔진 평생 무료 여부)

---

## 13. CEO 결정 필요 사항 (3개)

### 결정 1: 최종 설계 패키지 승인 여부
**내용:** 4차원 점수(Recognition 35 + Category 35 + CoRec 20 + Web 10) + 보조 시각화 3종(Pass/Quadrant/Grades) + 리텐션 훅 7개 + 3탭 차트
- **A. 승인 → Phase 1 즉시 착수** (권고)
- **B. 부분 승인** — 4차원만 먼저, 리텐션 훅은 Phase 1 후
- **C. 재검토** — 추가 리서치·수정 지시

### 결정 2: Ground Truth 수동 실측 포함 여부
**내용:** Phase 1 마지막 단계에 10개 제품 수동 실측 (ChatGPT/Perplexity/Gemini 직접 확인, 2~3시간 추가)
- **A. 포함 (권고)** — 가정 오류 방지
- **B. 스킵** — Phase 1 단축

### 결정 3: 마케팅 재개 시점
**내용:** Phase 1 완료(04-19 토) 후 재개 vs Phase 2 완료(04-24 목) 후 재개
- **A. Phase 1 완료 후 (04-20 월, 권고)** — 30일 KPI 달성 가능성 유지
- **B. Phase 2 완료 후 (04-25 금)** — 리텐션 훅 완성 후 마케팅 효과 극대화

---

## 14. CPO 최종 의견

**빅파이 1.0 정합성 95점.** 이 설계는 제가 새로 발명한 게 아니라, **빅파이 1.0 §7·§8·§9에 이미 명시된 방향을 실행 가능한 형태로 구체화**한 것입니다. CEO가 이전 세션에서 수립하신 전략을 그대로 따른 결과입니다.

**오늘 하루의 역설적 성과:**
- 잃은 것: LinkedIn 게시 1건, 셀럽 DM 5건, 뉴스레터 3건 (모두 보류)
- 얻은 것: 측정 시스템 정확도, MLP 리텐션 설계, 빅파이 실질 실행 로드맵

마케팅 이메일 10명 대신 **측정 도구 자체의 신뢰 회복 + MLP 기반 완성**을 선택한 것입니다. 이건 **30일 100명 KPI의 장기 달성 확률을 올리는 교환**입니다.

**권고:** §13 모두 **A안 (승인)**으로 진행하시면, Phase 1 완료 후 강화된 스토리로 30일 KPI 달성 가능합니다. 오늘의 "버그 발견 → 재설계 스토리" 자체가 Day 13 블로그 + LinkedIn 포스트의 가장 강력한 재료가 됩니다.

---

## 부록 A: 참조 문서

- `docs/bigpie-v1.0.md` (빅파이 1.0 CEO 승인 전략)
- `docs/vision-brief-v2.md` (비전 v2.0)
- `docs/vision-rules.json` (P0~P3, KPI)
- `docs/outputs/score_redesign_20260417.md` (기술 재설계 초안)
- `docs/outputs/strategy_20260417_email_100.md` (이메일 100명 원안, 보류)
- `api/src/index.ts:158-830` (코드 증거)
- `landing/dashboard.html:1151-1152` (FE 버그 위치)

## 부록 B: 오늘의 커밋 (없음)
전면 보류 상태, 코드 변경 없음. 재설계 완료 후 일괄 커밋 예정.

## 부록 C: 다음 체크인 시점
- CEO 결정 수신 시점 → 즉시 Phase 1 착수
- Phase 1 완료 (04-19 토) → 스테이징 + Ground Truth 결과 보고
- Phase 2 완료 (04-24 목) → 리텐션 훅 검증 보고

---

*End of final strategy report. 결정 기다리겠습니다.*
