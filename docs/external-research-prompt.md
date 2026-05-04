# pickedby.ai — External AI Research Prompt
> 작성: 2026-05-04 | 작성자: CPO | 대상: ChatGPT Pro / Gemini 2.5 Deep Research / Claude / Perplexity
> **목적**: pickedby.ai와 유사한 1인 창업 + AI 인프라 SaaS의 마케팅 성공 케이스를 발굴하고, 우리가 따라할 수 있는 구체적 플랜을 수립하기 위함.
> **사용법**: 이 파일 전체를 외부 AI 에이전트에게 그대로 붙여넣기. 첨부물로 `docs/agent-brief.md`도 함께 제공.

---

## 0. 사전 준비 (필수 첨부물)

이 프롬프트와 함께 **반드시 첨부할 파일**:
1. `pickedbyAI/docs/agent-brief.md` (15섹션, 우리 회사 종합 브리프)

첨부 없이 답변 받지 말 것 — 외부 에이전트가 우리 컨텍스트 추측하면 결과 품질 절반 이하로 떨어집니다.

---

## 1. 역할 부여 (Role Setup)

당신은 **글로벌 인디 SaaS 마케팅 전문가**입니다. 다음 자격 조건을 갖췄다고 가정하고 답변하십시오:

- 인디 해커 커뮤니티(Indie Hackers, Hacker News, r/SaaS, Product Hunt)에서 **2020~2026년 사이 0→$10K MRR 또는 0→100K UV/월 달성한 1인 창업 SaaS 100개 이상 분석 경험**
- AI/GEO/AEO/SEO 도구 시장(Ahrefs·Semrush·Otterly·Profound·trysight 등) 정확한 포지셔닝·가격·트래픽 데이터 보유
- "Building in Public" 마케팅 + Programmatic SEO + Free Tool 전략 + Product Hunt 런칭 모범사례 정통
- **명백히 검증되지 않은 사실은 "확실하지 않음"으로 표기하는 정직한 분석가**

당신은 컨설턴트가 아니라 **편집자(editor)**처럼 답변합니다. 즉:
- 모호한 답변·일반론 금지 ("마케팅을 잘 하세요" 따위)
- 모든 주장에 **출처 또는 사례 회사명** 첨부
- 우리 컨텍스트(첨부된 agent-brief.md)를 **반드시** 인용해서 답변

---

## 2. 우리 회사 압축 요약 (외부 에이전트가 첨부 파일 못 읽을 때 fallback)

```
이름: pickedby.ai (THUNOVA, 한국 1인 창업)
정체: AI 추천 시대의 성장 코치 — GPT/Gemini/Claude/Grok/Perplexity가 내 제품을 추천하는지
     측정 + 진단 + 처방하는 플랫폼 ("체중계 아닌 퍼스널 트레이너")
타겟: 인디 크리에이터·1인 SaaS·콘텐츠 운영자 (엔터프라이즈 X)
가격: Free / $9 평생 100명 / $19 / $49 / $99+
팀: 1인 founder + AI 에이전트 (CPO·Dev·Growth·QA 역할)
운영비: ~$10/월
현재: Phase 2a (처방 엔진 W1) / 13차 프로덕션 배포 / 자체 점수 45/100 EMERGING
경쟁사: Otterly($29-989, 엔터프라이즈) / Profound($500+, F500) / trysight (직접 위협)
       / amivisibleonai (가짜) / llmclicks (단순) / Ahrefs/Semrush AEO 진입 가속
차별점: 5대 AI 전체 + 처방 + 10초 무료 + 가입 불필요 + 크리에이터 시작 (24개 GEO 도구 중 유일)
가용 채널: Indie Hackers(1순위) / 블로그+Dev.to(2순위) / HN Show HN(3순위) / 봇 4채널(W3)
사망 채널: X/Twitter (2026-04-14 @pickedbyAI 자동포스팅으로 영구정지, 항소포기) /
          LinkedIn 동결 (24일 0반응) / Reddit 댓글 동결 (카르마 정체)
다음 마일스톤: 2026-07월 첫째 주 Product Hunt + Show HN 동시 런칭
모트: probe_logs + 처방 효과 데이터 (복제 불가)
절대 금지: SNS 자동 포스팅 / "AI 추천 보장" 카피 / Reddit 도메인 박기 / 엔터프라이즈 침투
```

---

## 3. 리서치 과제 (3개 태스크 순서대로 답변)

### 🎯 Task 4 — 유사 기업 레퍼런스 발굴

**목표**: pickedby.ai와 **상태가 비슷한** 회사를 최소 10개 찾고, 그들이 어떻게 성공/실패했는지 분석.

**"비슷한 상태"의 정의 (모두 만족해야 함)**:
- ✅ **1인 또는 2-3인 부트스트랩** (외부 투자 0 또는 시드 미만)
- ✅ **AI 인프라/측정/SEO/SEO 분석/Visibility 관련 SaaS** (또는 인접 도메인 — 예: SEO 도구, 분석 도구, free score tool)
- ✅ **0→$10K MRR 또는 0→100K UV/월 달성** (검증 가능한 trajectory)
- ✅ **2020년 이후 런칭** (AI 시장 변화 반영 가능한 시점)
- ❌ **엔터프라이즈 영업 의존 회사 제외** (우리는 self-serve 모델)

**각 회사마다 답변 항목** (반드시 표로 정리):

| 항목 | 내용 |
|------|------|
| 회사명 + URL | |
| 창업 시점 | YYYY-MM |
| 팀 규모 | 1인 / 2인 / 3인+ |
| 도메인 | GEO / AEO / SEO / Visibility / Analytics / Free tool |
| ICP | 누구를 타겟? (구체적으로) |
| 핵심 차별점 | 한 줄 |
| 가격 모델 | Free + Pro $X / Lifetime / Subscription |
| 0→1 채널 | 어떻게 첫 100 유저를 얻었나? (PH? IH? HN? Twitter? SEO?) |
| 1→10 채널 | 어떻게 100→1,000 유저로? (programmatic SEO? 바이럴? 파트너십?) |
| 성공 핵심 | 한 마디로 (예: "Twitter audience 7K → 런칭 시 polled in") |
| 실패 사례라면 원인 | (있다면) |
| **pickedby.ai와 가장 다른 점** | **이 부분 중요** — 우리가 단순 모방하면 위험한 부분 |
| **우리가 차용 가능한 패턴** | 구체 액션 1-3개 |

**최소 10개 사례** 중 다음 카테고리별 **최소 1개씩**:
1. **GEO/AEO 도구**: trysight.ai, llmclicks.ai, amionai.com, Goodie AI 등 + 우리가 모르는 다크호스
2. **Free SEO/Visibility tool**: NeilPatel Ubersuggest 초기, Detailed.com, X-ray.tools 등
3. **인디 SaaS 분석 도구**: Plausible, Fathom Analytics, Simple Analytics 등
4. **AI 시대 free tool 바이럴 케이스**: TheresAnAIForThat, AIToolReport, Insidr.ai 등
5. **Product Hunt 1인 창업 Top 10**: Marc Lou(ShipFast), Pat Walls(Starter Story), Tony Dinh(TypingMind) 등 — 단, 그들의 특정 제품이 우리 도메인과 겹치는 경우

**제외 기준**:
- ❌ 시리즈 A 이상 펀딩 받은 회사 (CrowdStrike·SentinelOne·Datadog 등)
- ❌ AI agent 빌더 도구 (CrewAI·LangChain·n8n) — 우리 도메인 아님
- ❌ 일반 SEO 도구 (Ahrefs·Semrush) — 규모 너무 큼

---

### 🎯 Task 5 — 마케팅 성공 케이스 분석 + 우리가 따라할 플랜

**목표**: Task 4에서 찾은 사례 중 **우리에게 적용 가능한 마케팅 성공 패턴**을 추출하고, **이번 주~7월 첫째 주 PH 런칭까지 8주 행동 플랜** 작성.

#### 5.1 패턴 추출 (Pattern Extraction)
Task 4 사례들에서 다음을 식별:
- **Common Success Patterns** (공통 패턴): 3개 이상 사례에서 반복 등장한 행동
- **Outlier Wins** (예외적 대박): 1개 사례에서만 등장했지만 효과가 매우 컸던 행동
- **Anti-Patterns** (실패 패턴): 우리가 따라하면 위험한 패턴

#### 5.2 우리 상황 매칭 (Match Score)
각 패턴에 대해:
| 패턴 | 사례 회사 | 우리 적용 가능성 (0-10) | 이유 |
|------|----------|---------------------|------|
| 예: Free tool + 결과 페이지 SEO 장악 | NeilPatel, X-ray.tools | 9 | 18편 블로그 + 자체 점수 결과 페이지 활용 가능 |
| 예: Twitter audience 빌드 후 런칭 | Marc Lou, Tony Dinh | **0** | **X 채널 영구 사망** — 적용 불가 |
| 예: programmatic SEO (10K+ 페이지) | UseChatGPT.ai 일부 | 6 | 18편 → 100~500편 확장 가능 |

**적용 가능성 0인 패턴은 명시적으로 "적용 불가"로 표기 후 이유 명시**.

#### 5.3 8주 실행 플랜 (Tactical Plan)
**기간**: 2026-05-05 (W1 시작) ~ 2026-07-04 (PH 런칭 D-day)
**제약**:
- 1인 founder 시간 ~30시간/주 (full-time 아님, 본업 K-사주 병행)
- AI 에이전트 활용 가능 (Claude Opus 4.7, ChatGPT Pro 등)
- 추가 예산 $0 (Tavily $20 ~ Perplexity $10 외)
- 이미 동결: LinkedIn / Reddit (재개 비추천 — 진단 결과 ROI 0)
- 활성 채널: Indie Hackers / 블로그+Dev.to / HN Show HN / BOT-MKT-01 4봇

**산출물 형식** (반드시 표로):

| 주차 | 날짜 | 채널 | 액션 (구체) | 시간 | 예상 결과 (UV / signup / mention) | 출처 사례 |
|------|------|------|------------|------|-----------------------------------|---------|
| W1 | 05-05 ~ 05-09 | Indie Hackers | 계정 생성 + 1주 lurk + 첫 milestone post 초안 | 5h | 첫 5-10 followers | Marc Lou IH journey |
| ... | ... | ... | ... | ... | ... | ... |

**총 30시간/주 × 8주 = 240시간 budget 안에서 답변**.

#### 5.4 PH 런칭 D-day 플랜
2026-07월 첫째 주 토요일 17:01 KST (= PT 00:01) Product Hunt 런칭. 다음을 분 단위 액션으로:

- D-30 ~ D-7: maker 네트워크 + tease 콘텐츠
- D-1: 사전 hunters 접촉 + assets 마무리
- D-day 00:00 PT (17:01 KST): 런칭 즉시 액션
- D-day +6h, +12h, +18h: 시간대별 sustain
- D+1, D+7: post-launch follow-up

각 시점별 **구체적 메시지 템플릿** 1개 이상 포함 (Twitter dead 상태 고려해 LinkedIn/IH/HN 메시지 중심).

---

### 🎯 Task 6 — 성공 보장 분석 (Probability Stack)

**목표**: 우리 8주 플랜 실행 시 **PH 런칭 결과의 성공 확률**을 계산하고, **확률을 90%+로 끌어올리는 추가 행동**을 제안.

#### 6.1 성공의 정의 (Success Definition)
다음 중 적절한 수준 선택 + 근거 제시:
- 🟢 **소박**: PH 런칭 당일 Top 10 / 누적 1,000 UV / 50 signup
- 🟡 **중간**: PH Top 5 / 5,000 UV / 200 signup / 10 paid
- 🔴 **이상**: PH #1 of the day / 20,000 UV / 1,000 signup / 50 paid + Hacker News front page

**우리 상황(team 1인, 채널 X 사망, 자체 점수 45)에 가장 현실적인 목표는?**

#### 6.2 확률 분해 (Probability Tree)

다음 형식으로:
```
P(success) = P(런칭 준비) × P(런칭일 트래픽) × P(전환) × P(retention)

P(런칭 준비) = 0.X
  - 8주 안에 D5~D11 + 봇 4채널 + IH 누적 + 블로그 강화 모두 완료할 확률
  - 리스크: D6 FE 잔여 / D7 PULSE-EMAIL / D8 QA / D11 GAP-1/2

P(런칭일 트래픽 5K+) = 0.X
  - PH Top 10 진입 확률 × Top 5 진입 확률
  - 우리 상황의 base rate (1인 / 0 Twitter / 작은 followers)

P(전환 5%+) = 0.X
  - 우리 페이지의 conversion 가능성 (현재 알려진 industry baseline 대비)

P(7-day retention 30%+) = 0.X
  - 처방 엔진의 user activation 효과
```

**각 P 값에 대해 base rate 출처 명시** (예: "Marc Lou ShipFast PH #1 of the day case study — 1인 + 14K Twitter audience 기준").

#### 6.3 확률 부스터 (Multiplier Actions)

각 P 값을 끌어올리는 **고확률·저비용 행동 5개**:

| 행동 | 영향 받는 P | 부스트 (0.X → 0.X) | 시간 비용 | 출처 사례 |
|------|-----------|-------------------|----------|---------|
| 예: D-30 hunter 사전 outreach 5명 | P(런칭일 트래픽) | 0.4 → 0.55 | 3h | Marc Lou ShipFast |
| 예: Show HN과 PH 동일 W7 동시 런칭 | P(런칭일 트래픽) | 0.55 → 0.65 | 0h (이미 계획) | Plausible Analytics 사례 |
| ... | ... | ... | ... | ... |

#### 6.4 정직한 한계 + Risk Map

다음을 명시적으로 답변:
- "이 플랜으로 90% 성공 보장은 불가능하다 — 마케팅에 보장은 없다"
- "현실적으로 도달 가능한 최고 확률은 X% (근거)"
- "이 확률을 망치는 Top 3 리스크" + 각 mitigation
- "우리가 통제 못하는 외부 변수" (PH 알고리즘 변화, 경쟁 출시 겹침, 지정학적 이벤트 등)

#### 6.5 Plan B / Plan C
PH가 Top 10 진입 실패할 경우의 **회복 플랜**:
- 24h 안에 할 일 (HN 재투입? IH 재포스팅?)
- W+1 ~ W+4 안에 할 일 (programmatic SEO 가속? Founding Creator 100 마감?)
- 6개월 안에 할 일 (시드 fundraise? 또는 부트스트랩 유지?)

---

## 4. 답변 형식 가이드

1. **반드시 한국어로 답변**. 회사명·고유명사는 영문 유지.
2. 모든 표는 마크다운 표로.
3. 모든 출처는 **회사명 + 가능하면 URL** 첨부 (예: `Marc Lou ShipFast (shipfa.st)`).
4. 추측·추정은 명시적 표기 (예: "월 트래픽 ~10K (추정 — 정확 출처 없음)").
5. **모르는 건 "모름"으로 답변**. 환각 금지.
6. 답변 길이 제한 없음. 단, 5,000~15,000 단어가 이상적.
7. Task 4·5·6 순서대로 답변. 섞지 말 것.
8. 답변 마지막에 **"한 줄 핵심 메시지"** + **"우리가 지금 당장(48시간 내) 해야 할 1번 행동"** 한 가지 명시.

---

## 5. 기타 컨텍스트 (필요 시 참조)

### 5.1 우리가 이미 시도하고 실패한 것 (반복 추천 금지)
- ❌ X/Twitter 채널 (계정 정지)
- ❌ LinkedIn 0-network에서 5게시 24일 (반응 0)
- ❌ Reddit 댓글 9건 (카르마 +47, UV 0, DM 0)
- ❌ Fiverr Reddit 외주 영업 받음 (도메인 0 룰 위반 위험으로 거절)

### 5.2 우리가 이미 결정한 것 (재논의 금지)
- ✅ X 채널 영구 포기
- ✅ 무료 한도 절대 축소 금지
- ✅ "AI 추천 보장" 카피 절대 금지
- ✅ Reddit 도메인 0 룰 (본문+댓글)
- ✅ Enterprise 타겟 영구 제외 (Profound 영역)
- ✅ 7월 첫째 주 PH + Show HN 동시 런칭

### 5.3 답변에 절대 포함하지 말 것
- ❌ 점수 계산식 추정 (영업 비밀)
- ❌ "Twitter 활용하라" (채널 사망)
- ❌ "엔터프라이즈 진출" (영구 제외)
- ❌ 일반론 ("좋은 제품을 만드세요" 따위)
- ❌ 2027년 이후 장기 비전 (PH+8주에 집중)

---

## 6. 마무리 — 외부 에이전트가 답변 시작 전 자가 점검

답변 시작 전, 다음 5개 질문에 모두 "예"로 답할 수 있어야 함:

1. agent-brief.md 첨부 파일을 읽었는가?
2. 우리 핵심 제약(1인, X 사망, 7월 PH, 무료 우선)을 정확히 이해했는가?
3. Task 4 → 5 → 6 순서로 답할 준비가 됐는가?
4. 모든 주장에 출처/사례 첨부할 준비가 됐는가?
5. 우리가 못 하는 것(엔터프라이즈, X 채널)을 추천하지 않을 준비가 됐는가?

5개 모두 "예"가 되면 답변 시작.

---

*본 프롬프트는 pickedby.ai CPO가 외부 AI 에이전트에게 명확한 리서치 과제를 부여하기 위해 작성한 단일 문서입니다.*
*첨부물 없이 사용하지 마십시오. 답변 품질은 첨부의 정확성에 비례합니다.*

*— 2026-05-04 작성 (CPO, 데스크탑 Claude Opus 4.7 1M)*
