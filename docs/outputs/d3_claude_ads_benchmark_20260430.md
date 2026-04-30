# D3 PRESCRIPTION-03 — Claude-Ads 벤치마크 차용 청사진
> 작성: 2026-04-30 22:15 KST · 정독 30분 완료
> 출처: github.com/AgriciDaniel/claude-ads (MIT)
> 목적: PRESCRIPTION-03 (Actions Pane UI) 착수 시 즉시 참조

---

## 1. Claude-Ads 핵심 구조 (확정)

### 1-1. 3-Tier 아키텍처
```
Directive   ← CLAUDE.md (프로젝트 지시)
Orchestration ← ads/SKILL.md + 19 sub-skills (각 ads-*/SKILL.md)
Execution   ← 10 agents (audit-*.md) + Python scripts JSON output
```

### 1-2. 19 sub-skills 디렉토리 전수 (확정)
**플랫폼 7**: apple, google, linkedin, meta, microsoft, tiktok, youtube
**횡단 12**: audit(오케스트레이터), budget, competitor, create, creative, dna, generate, landing, math, photoshoot, plan, test

각 디렉토리 = `SKILL.md` 단일 파일. `Task tool with context: fork` 패턴 (병렬 실행, never Bash).

### 1-3. 등급/Quick Win/정렬 (확정)
```
Grade 임계값: A(90~100) / B(75~89) / C(60~74) / D(40~59) / F(<40)

Severity 분류 (multiplier 미공개):
- Critical: Revenue/data loss risk (즉시)
- High: Significant performance drag (7일)
- Medium: Optimization opportunity (30일)
- Low: Best practice (backlog)

Quick Win 룰:
  IF severity ∈ {Critical, High} AND estimated_fix_time < 15min
  THEN flag as Quick Win

정렬:
  SORT BY (severity_multiplier × estimated_impact) DESC

Aggregate:
  Aggregate = Sum(Platform_Score × Platform_Budget_Share)
```

---

## 2. 우리 `prescriptionEngine.ts` 현황 (722줄, 단일 파일)

### 2-1. 모듈 구조 (현재)
- 단일 파일 722줄
- `PRESCRIPTION_RULES: Record<DimensionId, Record<PrescriptionLevel, Action[]>>` 인라인 객체 (4차원 × 5레벨)
- `selectTop3()` 정렬 (현재):
  ```
  1차: 달성률 (낮은 차원 우선) — score/max 기준
  2차: 임팩트 (높은 것 우선)
  3차: 난이도 (낮은 것 우선)
  4차: priority
  ```
- `Action.priority` 필드 있음 / `severity` 필드 없음 / `quickWin` 플래그 없음

### 2-2. 차원별 룰 분포
- recognition (max=35): 4+2+2+2+2 = 12 actions
- category (max=35): 2+2+2+2+1 = 9 actions
- corec (max=20): 3+2+1+1+1 = 8 actions
- web (max=10): 2+1+1+1+1 = 6 actions
- **총 35 actions** (5레벨 × 4차원 = 20룰셋 슬롯)

---

## 3. 차용 4 패턴 — D3 작업 시 즉시 적용

### 패턴 A. 모듈 분리 (★ 강추)

**현재**: 722줄 단일 파일
**목표 구조**:
```
api/src/prescription/
├── index.ts          (오케스트레이터, generatePrescription export만)
├── types.ts          (Diagnosis, Action, GapInfo, BenchmarkInfo, PrescriptionResult)
├── classification.ts (classifyLevel, classifyDimensionLevel, LEVEL_THRESHOLDS)
├── rules/
│   ├── recognition.ts  (12 actions × 5 levels)
│   ├── category.ts     (9 actions)
│   ├── corec.ts        (8 actions)
│   └── web.ts          (6 actions)
├── diagnosis.ts      (buildDiagnosis)
├── gap.ts            (computeGap)
├── benchmark.ts      (extractBenchmark)
└── selection.ts      (selectTop3)
```

**효과**:
- 룰 추가/수정 시 영향 범위 최소화 (현재는 한 줄 수정도 722줄 파일 전체 diff)
- 차원별 룰셋 PR 분리 가능
- 단위 테스트 분할 (`score.test.ts`도 분리 가능)
- D3 Actions Pane UI 작업 시 import 라인이 명확

**작업량**: 1.5시간 (코드 이동 + import 경로 수정 + 기존 테스트 14건 PASS 검증)

---

### 패턴 B. Severity 도입 → 정렬 단순화 (★ 강추)

**현재 selectTop3 4단 정렬** → **단일 priorityScore**:
```typescript
// 신규 Action 필드
severity: 'critical' | 'high' | 'medium' | 'low'

const SEVERITY_MULTIPLIER = {
  critical: 5.0,  // Claude-Ads 차용
  high:     3.0,
  medium:   1.5,
  low:      0.5,
}

function computePriorityScore(action: Action, dimAchievement: number): number {
  const dimUrgency = 1 - dimAchievement  // 달성률 낮을수록 시급
  return SEVERITY_MULTIPLIER[action.severity] * action.estimatedImpact * (0.5 + dimUrgency)
}

// selectTop3 → SORT BY priorityScore DESC, slice(0,3)
```

**현 35 actions에 severity 매핑** (제안):
- `priority ≤ 12 + difficulty ≤ 2` → high (PH 런치, llms.txt, AlternativeTo, "vs" 글)
- `priority ≤ 15` → medium
- `perfect 레벨 처방 (priority ≥ 50)` → low
- 신규 critical 슬롯 비워둠 (예: "도메인 만료", "사이트 다운" 같은 P0 발견 시)

**효과**: 1차 정렬에 4단 if 사라지고 단일 비교. CEO 빅파이 1.6 §3-2 "점수가 낮을수록 처방이 더 구체적" 원칙 = `dimUrgency`에 자연스럽게 반영.

**작업량**: 1시간 (Action 타입 확장 + 35 actions severity 매핑 + selectTop3 재작성 + 테스트 보강)

---

### 패턴 C. Quick Win 라벨 (★ 즉시)

**Claude-Ads 룰**: `severity ∈ {critical, high} AND fix_time < 15min`
**우리 변형 룰**:
```typescript
quickWin: action.difficulty === 1 && /^(10|15|20|30) min/i.test(action.timeToComplete)
```

현재 35 actions 중 difficulty=1 + 30min 이하:
- `rx-rec-inv-02` llms.txt 추가 (30min)
- `rx-cat-inv-02` 카테고리 키워드 메타태그 (30min)
- `rx-cor-inv-01` AlternativeTo 등록 (30min)
- `rx-cor-inv-03` Reddit 추천 스레드 (1hr — 경계, 제외)
- perfect 레벨 모니터링 4건 (10min/week)

→ **약 5~7개 Quick Win 자동 라벨링 가능**.

**UX 적용 (D3 PRESCRIPTION-03)**: Quick Win 카드는 노란색 ⚡ 배지 + "⏱ 30분 안에 완료" 강조 → 사용자 첫 액션 진입장벽 제거.

**작업량**: 30분 (Action 필드 추가 + 라벨 매핑 + UI 배지)

---

### 패턴 D. 5등급화 — 보류

**Claude-Ads**: A/B/C/D/F (5등급, 점수 임계값)
**현재 우리 EngineGrade**: A(recommended) / C(recognized only) / F(unknown) — 3등급

**평가**:
- 현재 3등급은 binary signal(recognized/recommended)에 자연 매핑 — 점수 임계값 X
- 5등급으로 늘리려면 부분 점수 신호 필요 (probe 응답 길이/확신도) → 신규 측정 인프라 필요
- **빅파이 1.6 §3-2 처방 매트릭스에 영향 없음** — D3 범위 밖

**결정**: 보류. Phase 3 이후 GT-AUTO-01 자체 호스팅 시 재검토.

---

## 4. D3 PRESCRIPTION-03 작업 권장 순서

```
Step 1 (1.5h) — 패턴 A 모듈 분리 ⭐
  ├─ 파일 9개 분리
  ├─ import 경로 수정 (index.ts 1곳, score.test.ts 1곳)
  └─ tsc + vitest 14 PASS 검증

Step 2 (1h) — 패턴 B Severity 도입 ⭐
  ├─ Action 타입에 severity 필드 추가
  ├─ 35 actions 매핑 (critical 0 / high ~12 / medium ~18 / low ~5)
  ├─ selectTop3 → SORT BY priorityScore DESC
  └─ 신규 테스트 3건 (severity 매핑 / priorityScore / Top 3 안정성)

Step 3 (30min) — 패턴 C Quick Win ⭐
  ├─ Action.quickWin 자동 계산
  ├─ Actions Pane 배지 UI (노란 ⚡)
  └─ 처방 카드 첫 화면 노출 시 Quick Win 우선

Step 4 (4h, 기존 D3 spec) — Actions Pane UI 본 작업
  ├─ 진단 4섹션 (4차원 × Diagnosis 카드)
  ├─ 처방 Top 3 카드 (severity 색상 + Quick Win 배지)
  └─ 벤치마크 미니 카드

총: 약 7시간 (기존 D3 spec 4h + 차용 3h)
```

**원래 D3 4h → 7h 증가**. 하지만 모듈 분리(A)는 향후 Phase 2c/2d 작업 속도 회복.
**대안**: A+B+C 분리 → D2.5(0.5일 신설) 처리 후 D3 본 작업.

---

## 5. 차용하지 않는 것 (명시)

- **multi-platform aggregate** (`Sum(Platform × Budget_Share)`) → 우리는 단일 제품/도메인 측정. 무관.
- **MCP 페어링** (Google Ads/Adspirer/GrowthSpree) → 광고 API 미사용.
- **Python scripts JSON output** → 우리는 TS 단일 스택. 변환 불필요.
- **5등급 grade** → 측정 인프라 부족. 보류 (위 패턴 D).
- **12 industry templates** → Phase 3+ 카테고리별 처방 분기 시 재검토.
- **창작 agents** (creative/photoshoot/dna) → 도메인 외.

---

## 6. 즉시 vs 보류 (CEO 결정 요청)

| 패턴 | 즉시 적용 | 보류 |
|------|----------|------|
| A. 모듈 분리 | ⭐ D3 직전 또는 D2.5 신설 | — |
| B. Severity multiplier | ⭐ D3 내 통합 | — |
| C. Quick Win 라벨 | ⭐ D3 내 통합 | — |
| D. 5등급화 | — | Phase 3+ |
| Multi-platform aggregate | — | 영구 (도메인 무관) |
| MCP ads 페어링 | — | 영구 (광고 미집행) |
| 12 industry templates | — | Phase 3+ |

---

## 7. 라이선스 / 코드 의존성

- 라이선스: MIT — 차용 자유
- 코드 의존성: **0** (구조 학습만, import 없음)
- 외부 API 호출 추가: **0**
- 비용 증가: **$0** (빅파이 1.6 §9 외부 API 증가분 0 원칙 준수)
- moat 영향: **+** (처방 엔진 모듈성 강화 → 향후 효과 데이터 분기 처리 용이)

---

*[CPO 승인 받은 옵션 🅑 정독 완료. D3 작업 직전 이 문서 1회 더 정독 → Step 1~3 순차 적용 권장 — 2026-04-30 22:15 KST]*
