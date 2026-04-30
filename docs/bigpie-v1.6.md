# bigpie 1.6 — pickedby.ai Growth Platform Strategy
> 작성일: 2026-04-29 | 상태: CEO 승인 완료
> 계승: bigpie 1.5 (측정 완성) → **1.6 (처방 + 선순환)**
> CEO 핵심 인사이트: "BMI 수치만 보여주면 안 돼. 처방전을 써줘야 해."
> "우리도 성장하고 그들도 성장하는 선순환을 만들고 싶다."

---

## 변경 요약 (1.5 → 1.6)

| 영역 | 1.5 | 1.6 |
|---|---|---|
| 제품 정체성 | 측정 도구 (Search Console) | **성장 코치 (Growth Platform)** |
| 핵심 기능 | 점수 + 차트 (BMI 수치) | **진단 + 처방 + 추적 (의사)** |
| 리텐션 전략 | MLP 7훅 (게이미피케이션) | **6-Stage Growth Loop (선순환)** |
| Phase 2 정의 | MINE-STORY + NARRATIVE | **처방 엔진 + 이행 추적 + 바이럴** |
| Moat 핵심 | probe_logs 누적 | **probe_logs + 처방 효과 데이터** |
| 타겟 통찰 | 크리에이터 시작 | **"없는 자"에게 더 많은 인사이트** |
| 유저 여정 | 체크 → 점수 → 끝 | **체크 → 진단 → 처방 → 실행 → 성장 → 공유** |

---

## 1. 제품 정의 (1.6 재정의)

### "The AI Growth Coach"

**체중계가 아닌 퍼스널 트레이너.**

pickedby.ai는 단순히 "AI에서 보이는지"를 측정하는 도구가 아닙니다.
**AI 추천 시대에 제품·콘텐츠가 발견되도록 성장시키는 코치**입니다.

```
체중계: "85kg입니다" → 유저: "그래서?" → 이탈
퍼스널 트레이너: "85kg → 목표 75kg → 이번 주: 유산소 30분×3회" → 실행 → 체중 감소 → 자랑 → 친구도 가입
```

### 한 줄 정의 (v1.6)
**"AI 추천 시대의 성장 코치 — 5대 AI가 내 제품을 추천하는지 측정하고, 왜 안 되는지 진단하고, 어떻게 하면 되는지 처방하는 플랫폼"**

### 핵심 전환
- v1.5: "**측정** → 분석 → 최적화" (Search Console → GA4 → Ads)
- v1.6: "**측정** → **진단** → **처방** → **추적** → **보상** → **바이럴**" (Growth Loop)

### 타겟 통찰 (2026-04-29 CEO)

> "엔터프라이즈 고객이 많이 쓸 거 같니? 아니. 소상공인들이 많이 쓸 거야."
> "있는 놈들에게 정보 정리해줘봤자 의미 없다. 가지지 못한 자들에게 처방이 필요하다."

| 유저 유형 | 점수대 | 필요한 것 | v1.5 제공 | v1.6 제공 |
|----------|--------|---------|----------|----------|
| Notion (엔터프라이즈) | 87.5 | 대시보드 정리 | O | O |
| 신생 SaaS | 15~40 | "왜 AI가 날 모르지?" | X | **진단 리포트** |
| 1인 크리에이터 | 0~20 | "뭘 해야 AI가 알게 돼?" | X | **처방 3가지** |
| pickedby.ai 자체 | 27.5 | "PH 런치해, Reddit 달아" | X | **구체 액션 + 효과 예측** |

**점수가 낮을수록 우리 서비스의 가치가 높아진다.** 이것이 v1.6의 핵심입니다.

### 기존 정의 유지 (불변)
- 5대 AI(GPT·Gemini·Claude·Grok·Perplexity) 전체 커버 포지셔닝
- 측정 단위: 제품 + 콘텐츠 + 퍼스널 브랜드
- 카테고리 야망: AI Visibility Platform 카테고리 리더
- "The Google Stack for AI Recommendations" 비전 유지

---

## 2. 6-Stage Growth Loop (v1.6 핵심)

### v1.5의 3단계 로드맵 → v1.6의 순환 루프

```
v1.5 (선형):  Measure ──→ Analyze ──→ Optimize
v1.6 (순환):

    ┌──────────────────────────────────────────┐
    │                                          │
    v                                          │
 [1. MEASURE]                            [6. ORGANIC]
 점수 27.5                             남들이 언급 시작
 4차원 분해                            점수 자동 상승
    │                                          ^
    v                                          │
 [2. DIAGNOSE]                           [5. VIRAL]
 "Gemini가 널 모른다"                  "3주만에 27→68!"
 "경쟁사가 대신 추천됨"                LinkedIn/Reddit 공유
    │                                          ^
    v                                          │
 [3. PRESCRIBE]                          [4. REWARD]
 "PH에 런치해"                         배지 획득
 "Reddit 댓글 달아"                    Streak 달성
 "llms.txt 추가해"                     성장 리포트 생성
    │                                          ^
    v                                          │
 [3.5 TRACK]─────────────────────────────────┘
 "처방 이행 ✓"
 "다음 체크: +12점!"
```

### Stage 상세

#### Stage 1: MEASURE (v1.5 완료)
- 4차원 스코어 (Recognition 35 + Category 35 + CoRec 20 + Web 10)
- Pass Indicator + Engine Grades + 2D Quadrant
- Volume Metrics 7지표
- Daily Pulse + Trend 3탭 + Journey
- **상태: Phase 1 프로덕션 라이브**

#### Stage 2: DIAGNOSE (v1.6 신규)
- 4차원별 **"왜 이 점수인지"** 진단 리포트
- 엔진별 인식 상태: "Gemini가 당신을 모릅니다"
- 경쟁사 대비: "{경쟁사}가 대신 추천되고 있습니다"
- 원인 분석: "AI 학습 데이터에 충분한 언급이 없습니다"
- **구현: 규칙 기반 (LLM 미사용, 비용 $0)**

#### Stage 3: PRESCRIBE (v1.6 신규)
- 이번 주 **처방 3가지** (우선순위 + 난이도 + 예상 효과)
- 점수대별 차등 처방 (5레벨 × 4차원 = 20규칙)
- 경쟁사 벤치마크: "1위는 이걸 했다"
- 다음 티어까지 Gap 시각화
- **구현: prescriptionEngine.ts (규칙 기반, 비용 $0)**

#### Stage 3.5: TRACK (v1.6 신규)
- 처방 이행 체크리스트 ("PH 런치했습니다" ✓)
- 다음 자동 체크 시 점수 변화 비교
- "이 처방이 +12점 효과를 냈습니다" 피드백
- **처방 효과 데이터 = 복제 불가 moat**

#### Stage 4: REWARD (v1.6 확장)
- 배지: "첫 Gemini 인식", "Top 10 진입", "STRONG 달성"
- Streak: 7일 연속 처방 이행
- 성장 리포트: "3주간 27→68 (+41점) 성장"
- 다음 처방 난이도 상향

#### Stage 5: VIRAL (v1.6 신규)
- "내 AI Visibility 성장 리포트" 1-click 공유 카드
- LinkedIn/Reddit 공유 템플릿 자동 생성
- 공유 카드에 pickedby.ai 로고 + "Measure yours free"
- 친구 가입 → 또 처방 → Growth Loop 재진입

#### Stage 6: ORGANIC (v1.6 신규)
- 유저가 처방대로 PH/Reddit/블로그를 했더니
- 진짜로 다른 사람들이 그 제품을 언급 시작
- AI가 크롤링 → 학습 → 자동 점수 상승
- "처방 없이도 올라가요!" = 성공 사례 = 최강 마케팅 소재

---

## 3. 처방 엔진 설계 (Prescription Engine)

### 3-1. 데이터 원천 (추가 비용 $0)

이미 존재하는 데이터만으로 처방 생성:

| 데이터 | 출처 | 처방에 쓰이는 방식 |
|--------|------|-------------------|
| Gemini/Perplexity 인식 상태 | unified_v15.dimensions[0].breakdown | 엔진별 처방 차등화 |
| 카테고리명 + 순위 | probeRedesign.category + rankings | "이 카테고리를 노려봐" |
| 함께 추천되는 경쟁사 | breakdown.top_5, coRecommendations | "이들이 너 대신 추천돼" |
| Use-case 추천 여부 | useCaseRecommended | "실사용에서도 추천 안 됨" |
| Engine Grade A~F | engine_grades | "F등급 엔진 집중 공략" |
| Web Tier-1/2 수 | tier1_count, tier2_count | "주요 사이트 언급 0건" |
| Tier T1~T4 | DAnswerResult.tier | 인지도 수준별 처방 |

### 3-2. 처방 규칙 매트릭스 (5레벨 × 4차원)

```
INVISIBLE (0~20점):
  recognition → "AI가 전혀 모름" → [PH 런치, HN Show, llms.txt, 위키]
  category   → "순위권 밖" → [카테고리 블로그, 비교 글, 메타 태그]
  corec      → "추천 0건" → [AlternativeTo, vs 비교 글, 대안 스레드]
  web        → "언급 0건" → [HN, Reddit, PH, G2, Capterra]

EMERGING (21~40점):
  recognition → "일부 AI만 인식" → [미인식 엔진 타겟 콘텐츠]
  category   → "순위 낮음" → [틈새 카테고리 공략]
  corec      → "1~3개만" → [크로스 프로모션, 비교 리뷰]
  web        → "2차만" → [TechCrunch 피치, 업계 미디어]

GROWING (41~60점):
  → 차별화 + 경쟁사 대비 전략 처방

STRONG (61~80점):
  → Top 3 노리기 + 방어 전략 처방

PERFECT (81~100점):
  → 유지 + 모니터링 + 새 카테고리 확장 처방
```

> **[참고] Claude-Ads 차용 검토 (2026-04-30 CEO 승인)** — github.com/AgriciDaniel/claude-ads (MIT). 7 광고 플랫폼 250+ 감사를 Score+Prescription 모델로 다룸. 우리 처방 엔진과 구조 동형. **PRESCRIPTION-03(D3) 착수 전 30분 정독 필수**: ① 19 sub-skills 디렉토리 분리 패턴 → `prescriptionEngine.ts` 모듈화 ② 가중치 multiplier(Critical 5.0x / High 3.0x / Medium 1.5x / Low 0.5x) → 처방 우선순위 정렬 알고리즘 ③ Quick Win(15분 내) 라벨링 → 난이도1(30분) UX 강조. 코드 의존성 0, 시간 30분, 위험 0. 직접 사용(광고 감사)은 광고비 $0이므로 PH 런칭 후 재검토(`ADS-CHECK-01` backlog 등록).

### 3-3. 처방 출력 구조

```typescript
interface PrescriptionResult {
  overall: {
    level: 'invisible'|'emerging'|'growing'|'strong'|'perfect'
    summary: string    // "AI가 알기 시작했지만, 추천까진 갈 길이 멉니다"
    gap_to_next: { target: string, points_needed: number }
  }
  diagnoses: Diagnosis[]      // 4차원별 진단
  prescriptions: Action[]     // 이번 주 Top 3 처방
  benchmark: {
    category: string
    your_rank: number|null
    leaders: string[]         // CoRec top_5에서
  }
}
```

### 3-4. 원칙
1. **규칙 기반** — LLM 미사용, 비용 $0
2. **점수 = 코드, 처방 = 규칙, LLM = 해석만** (불변 원칙 확장)
3. **처방 효과 데이터 축적** — "어떤 처방이 어떤 제품에 효과 있었나" = 복제 불가 moat
4. **점수가 낮을수록 처방이 더 구체적** — 소상공인 최적화

---

## 4. 스코어 시스템 (v1.5에서 불변)

4차원 단일 체계:

| # | 차원 | 만점 | 측정 방식 |
|---|---|---|---|
| 1 | Direct Recognition | 35 | Gemini + Perplexity "Know & Recommend" |
| 2 | Category Ranking | 35 | `best {category}` Top-10 등장 + 순위 |
| 3 | Co-Recommendation | 20 | probe_logs 누적 파싱 |
| 4 | Web Authority | 10 | Tavily Tier-1/2 citation |
| **합계** | | **100** | **sum == final (수학 보장)** |

Pass Indicator: PERFECT(81+) / STRONG(61~80) / EMERGING(36~60) / INVISIBLE(0~35)
Volume Metrics (1.5.1): probe_logs 기반 7지표

---

## 5. Moat 전략 (v1.6 확장)

### v1.5 Moat
```
Layer 1: Score Tracker (시계열 Lock-in)
Layer 2: SDK (코드 임베딩 전환비용)
Layer 3: Creator Graph (네트워크 벤치마크)
```

### v1.6 Moat 추가: Layer 0 — Prescription Effectiveness Data

```
probe_logs (v1.5): "어떤 AI가 어떤 제품을 알고 있는가" 축적
prescription_logs (v1.6): "어떤 처방이 어떤 제품에 효과가 있었는가" 축적

→ 두 데이터가 합쳐지면:
  "category='AI tools' + score=15~30인 제품에게 PH 런치 처방 → 평균 +18점 효과"
  "이 데이터를 가진 경쟁사는 세상에 없다"
```

### Moat Flywheel (v1.6 확장)

```
유저 가입 → 점수 측정
→ 처방 생성 (규칙 기반)
→ 유저가 처방 실행 (PH 런치, Reddit 댓글...)
→ 다음 체크 시 점수 변화 기록
→ "이 처방이 효과 있었다" 데이터 축적
→ 더 정확한 처방 → 더 높은 성공률
→ 더 강한 입소문 → 더 많은 유저
→ 더 많은 처방 효과 데이터
→ ... (자기 강화 루프)
```

**이것이 경쟁사가 절대 따라올 수 없는 이유:**
Otterly/trysight가 점수를 복제할 수는 있다.
하지만 "PH 런치가 AI visibility +18점 효과가 있었다"는 데이터는
**수천 명의 유저가 실제로 처방을 실행하고 결과를 기록해야만** 쌓인다.

---

## 6. 선순환 비전 (CEO 원문)

> "우리 서비스를 시작으로 서비스 순환을 만들고 싶다. 우리도 성장하고 그들도 성장하는 선순환."

```
[유저의 성장]
  처방대로 PH 런치 → Reddit 활동 → llms.txt 추가
  → AI가 인식 시작 → 점수 상승 → 성공 사례
  → "pickedby.ai 덕분에 AI 추천 1위!" = 최강 소셜 프루프

[pickedby.ai의 성장]
  처방 효과 데이터 축적 → 더 정확한 처방
  → 유저 성공률 상승 → 입소문
  → 더 많은 유저 → 더 많은 데이터
  → 카테고리 벤치마크 독점 → 방어선 완성

[궁극적 자생]
  유저 제품이 실제로 유명해짐
  → 다른 사람들이 자연스럽게 언급
  → AI가 크롤링해서 학습
  → 점수가 자동으로 올라감 (처방 없이도)
  → "서비스를 쓴 보람" = 극대화
```

---

## 7. 대시보드 구조 (v1.6)

```
pickedby.ai Dashboard (v1.6)
|
+-- Overview (v1.5 유지)
|   +-- Score Ring + Pass Indicator
|   +-- Daily Pulse
|   +-- 4차원 카드
|   +-- Engine Grades + 2D Quadrant
|
+-- Trend (v1.5 유지)
|   +-- Score 3탭 (Daily/Weekly/Monthly)
|   +-- Volume 3탭
|
+-- Actions (v1.6 핵심 변경)           <-- 처방 엔진
|   +-- 진단 리포트 (4차원별 "왜")
|   +-- 처방 Top 3 (구체적 to-do)
|   +-- 경쟁사 벤치마크
|   +-- Gap 시각화 (다음 티어까지)
|   +-- 처방 이행 체크리스트
|   +-- 처방 효과 히스토리
|
+-- Journey (v1.5 유지 + 확장)
|   +-- Hero's Arc 4단계
|   +-- Timeline (처방 이행 이벤트 추가)
|   +-- Milestones 배지
|   +-- Streak
|
+-- Rivals (v1.5 유지)
|   +-- Co-Mentioned Tools
|   +-- AI Visibility Map
|
+-- Tools (v1.5 유지)
|   +-- Badge Embed
|   +-- Settings
|   +-- Share (v1.6 신규 - 성장 리포트 공유)
```

---

## 8. Phase 2 실행 계획 (v1.6 재정의)

### Phase 2a: 처방 엔진 (Week 1, 4일)

| Day | ID | 작업 | 시간 |
|-----|-----|------|------|
| D1 | PRESCRIPTION-01 | `prescriptionEngine.ts` — 20규칙 세트 + generatePrescription() | 4h |
| D2 | PRESCRIPTION-02 | /v1/check 응답에 prescription 필드 추가 | 2h |
| D3 | PRESCRIPTION-03 | Actions Pane UI — 진단 리포트 + 처방 3개 + 벤치마크 | 4h |
| D4 | GAP-01 | Gap 시각화 + QA | 3h |

### Phase 2b: 추적 + 이메일 + Sources (Week 2, 4일)

| Day | ID | 작업 | 시간 |
|-----|-----|------|------|
| D5 | TRACKING-01 | /v1/events 활성화 + 처방 이행 체크리스트 UI | 3h |
| D6 | SOURCES-PREVIEW-01 | Sources 프리뷰 — `/v1/sources/diagnose` + Actions pane Sources 카드 + Overview 미니 인디케이터 | 2h |
| D7 | PULSE-EMAIL-01 | Daily Pulse 이메일 + 처방 Top 1 포함 (Brevo) | 3h |
| D8 | PHASE2B-QA-01 | GT 검증 + 스테이징 배포 + CEO 검증 | 2h |

> **SOURCES-PREVIEW-01**: 처방에서 "llms.txt 추가해"→Sources 카드에서 상태 확인+생성 CTA 연결.
> 5항목 진단 (sitemap/robots/llms.txt/rss/SDK). 설계: `docs/outputs/sources_preview_design_20260422.md`
> CEO 04-22 피드백: "SDK활용과 llms.txt 딥링크도 포함시켜야"

### Phase 2c: 보상 + 바이럴 (Week 3, 3일)

| Day | ID | 작업 | 시간 |
|-----|-----|------|------|
| D9 | REWARD-01 | Milestones 배지 10종 + Streak 시스템 | 4h |
| D10 | GROWTH-REPORT-01 | 성장 리포트 생성 + 공유 카드 디자인 + **페르소나 라벨** (GAP-1) | 4h |
| D11 | VIRAL-01 | LinkedIn/Reddit 공유 템플릿 + 1-click 공유 + **Wordle식 복사 포맷** (GAP-2) | 3h |

> **GAP-1 페르소나 라벨**: 처방 엔진의 `level`(invisible/emerging/growing/strong/perfect)에
> 이모지+별명 매핑 (AI Ghost 👻 → AI Rising 🌱 → AI Contender ⚔️ → AI Champion 👑 → AI Legend 🏆).
> 성장 리포트·공유 카드에 자연 통합. 16personalities식 정체성 부여 → 바이럴 드라이버.
>
> **GAP-2 Wordle식 복사 포맷**: 결과를 1줄 텍스트로 압축 + COPY 버튼.
> 예: `pickedby.ai | Notion 🏆87.5 | 🟢Gemini 🟢Perplexity | #AIVisibility`
> 공유 마찰 최소화. VIRAL-01 공유 템플릿과 함께 구현.

### Phase 2d: 처방 정확도 (Week 4, 2일)

| Day | ID | 작업 | 시간 |
|-----|-----|------|------|
| D12 | EFFECT-01 | 처방 효과 데이터 분석 로직 | 3h |
| D13 | PHASE2-DEPLOY | DEPLOY-GATE-02 + CEO 검증 + 프로덕션 배포 | 2h |

### Phase 2 이후 백로그 (Phase 3 또는 마케팅 채널 확장)

| ID | 작업 | 근거 | 선행 조건 |
|----|------|------|----------|
| GAP-3 | 공개 결과 페이지 SEO (Glassdoor 모델) | strategy-sync §8 비자발적 노출 | 처방 엔진 안정화 후. SEO 효과 3~6개월 소요 |
| BOT-MKT-01 | GPT Store 봇 배포 (AI Visibility Checker) | strategy-sync §12 backlog-ai-bot-marketing | 처방 엔진 완성 후 CTA 강화: "점수+처방 3개 받기" |
| BOT-MKT-02 | Poe + Coze 확장 배포 | BOT-MKT-01 효과 검증 후 | BOT-MKT-01 UTM 데이터 확보 |
| NETWORK-01 | Creator Network (상호 추천 생태계) | strategy-sync §6 경쟁사 0곳이 하는 것 | Verified Owner 100명+ 달성 후 |

### 제외 (명시 — v1.5 구형 계획)
- ~~DB-MIG-01~~ → 이미 D1에서 완료
- ~~MINE-STORY-01~~ → 처방 리포트로 대체
- ~~NARRATIVE-01~~ → 처방 엔진 진단으로 대체
- ~~CONTEXT-AWARE-01~~ → 처방 엔진이 자동 분기 (점수 레벨별)

---

## 9. 비용·리소스 제약 (v1.5에서 불변)

| 항목 | 한도 | 현재 |
|---|---|---|
| Gemini Relay | 일 1,500 요청 | 여유 |
| Perplexity API | 월 $10 | ~$8 |
| Tavily | 기존 예산 | cron lite |
| **처방 엔진** | **$0** | **규칙 기반, API 호출 없음** |
| **월 외부 API 증가분** | **$0** | **절대 준수** |

---

## 10. 리스크 & 대응 (v1.6 추가)

| 리스크 | 심각도 | 대응 |
|---|---|---|
| v1.5 리스크 전부 유지 | — | — |
| **처방이 효과 없을 때** | 🔴 | 규칙 템플릿 A/B 테스트 + 효과 데이터 피드백 루프 |
| **유저가 처방을 실행 안 할 때** | 🟡 | 난이도 1(30분) 처방부터 시작 + Streak 동기부여 |
| **처방 템플릿 품질 부족** | 🟡 | Phase 2d에서 효과 데이터 기반 정교화 |
| **경쟁사가 처방 기능 복제** | 🟢 | 처방 효과 데이터 = 선점 moat. 규칙은 복제 가능하나 데이터 불가 |

---

## 11. 영구 교훈 (v1.5 #1~15 유지 + v1.6 추가)

v1.5 교훈 #1~15 전부 유지.

16. **"BMI 수치만 보여주면 안 돼, 처방전을 써줘야 해"** — CEO 2026-04-29. 측정 도구의 함정은 "점수 보여주고 끝"이다. 진짜 가치는 "다음에 뭘 해야 하는지"에 있다.
17. **"있는 놈들에게 정보 정리해줘봤자 의미 없다"** — CEO 2026-04-29. 엔터프라이즈(Notion 87.5점)보다 신생기업(pickedby.ai 27.5점)에게 더 많은 인사이트를 제공해야 한다. 점수가 낮을수록 서비스 가치가 높아지는 구조.
18. **"우리도 성장하고 그들도 성장하는 선순환"** — CEO 2026-04-29. 유저의 성공이 우리의 성공 사례가 되고, 우리의 데이터가 더 정확한 처방이 되는 플라이휠.

---

## 12. 다음 체크포인트

- **05-01 (목)**: Phase 2a 착수 — PRESCRIPTION-01 처방 엔진 구현
- **05-04 (일)**: Phase 2a 완료 — Actions Pane 처방 UI + 스테이징 배포
- **05-07 (수)**: Phase 2b 완료 — 이행 추적 + Daily Pulse 이메일
- **05-10 (토)**: Phase 2c 완료 — 배지 + 성장 리포트 + 공유
- **05-12 (월)**: Phase 2d — 처방 효과 분석 + DEPLOY-GATE-02
- **05-15 (목)**: 모두의 창업 결과 통보 예정
- **05-31**: 이메일 1,000개 / Product Hunt 런칭 게이트

---

## 13. 용어 정리

| 용어 | 정의 |
|------|------|
| Growth Loop | 6-Stage 순환 (Measure→Diagnose→Prescribe→Track→Reward→Viral→Organic) |
| Prescription Engine | 규칙 기반 처방 생성기 (prescriptionEngine.ts) |
| Diagnosis | 4차원별 "왜 이 점수인지" 분석 |
| Prescription | "뭘 해야 하는지" 구체적 행동 가이드 |
| Gap Visualization | 다음 티어까지 필요 점수 시각화 |
| Growth Report | 기간별 성장 요약 (공유용) |
| Prescription Effectiveness Data | 처방 이행 후 점수 변화 데이터 (복제 불가 moat) |

---

*bigpie 1.6 — 2026-04-29 CEO·CPO 전략 세션 기록*
*계승: bigpie 1.0 → 1.5 (측정 완성) → **1.6 (처방 + 선순환)** → 2.0 (정식 릴리스 + 5엔진)*
*v1.5 전체 내용은 `docs/bigpie-v1.5.md`에 보존 (아카이브)*
