# Journey + Actions 보강 설계 문서
> 작성: 2026-04-22 23:28 KST · CPO
> 승인: CEO 2026-04-22 "승인한다" (PROPOSAL 1)
> 대상: 다음 세션 구현 (6h 예상)
> 배경: D6 MVP 버전이 Overview와 중복. 디테일·실행성 부족.

---

## 0. CEO 피드백 핵심
> "Journey+Actions: 너무 내용이 없어. 오버뷰에서 봤던 내용이 중복으로 그대로임. 뭔가 더 디테일하게 보여줘주던가 했으면좋겠는데 방법이 없겠니? 해결방법도 빈약해. 보여주는 내용도 빈약해."

---

## 1. 현재 D6 MVP 한계

| pane | 현재 보여주는 것 | 빈약한 이유 |
|------|------------------|------------|
| Journey | Hero's Arc 4 stage + 타임라인 | scores transition만 = Overview Score 카드 재탕 |
| Actions | Top 1 (worst dimension) 규칙 템플릿 1문장 | 구체 실행 스텝 없음 · 블로그 링크 없음 · 진척 트래킹 없음 |

---

## 2. 보강 설계

### 2-1. Journey pane 확장

**이미 인프라 있음:** `/v1/events` 테이블 + `ALLOWED_EVENT_TYPES` 12종 정의됨 (index.ts:1671~).
```
first_check · first_tier1_source · first_tier2_source
emerging_reached · strong_reached · picked_reached
perplexity_recognized · gemini_recognized · category_ranked
co_mention_peer_5 · score_delta · check_run
```

**신규 3개 섹션:**

#### A. Milestones 배지 벽 (10종)
| 배지 | 이벤트 | 조건 |
|------|--------|------|
| 🥇 First Check | first_check | 첫 체크 실행 |
| 🎯 First Recognition | perplexity_recognized OR gemini_recognized | 첫 "know it" |
| 📈 Emerging Reached | emerging_reached | pass_indicator emerging 첫 도달 |
| 🟢 Strong Reached | strong_reached | pass_indicator strong 첫 도달 |
| 🏆 Picked Reached | picked_reached | pass_indicator perfect 첫 도달 |
| 📚 First Tier-1 Source | first_tier1_source | Tier-1 domain citation 첫 획득 |
| 🏅 First Tier-2 Source | first_tier2_source | Tier-2 domain citation 첫 획득 |
| 🔥 Streak 7 | (신규 streak_7) | 연속 7일 cron 성공 |
| 🔥 Streak 30 | (신규 streak_30) | 연속 30일 |
| 👥 Co-Mention Peer 5 | co_mention_peer_5 | co-rec peers 5명 도달 |

**규칙 엔진:** 매일 cron dailyRefresh 뒤 trigger → 조건 만족 시 user_events insert (dedupe=true)

#### B. Streak 카운터
- **연속 체크 일수** (대문자 "N DAYS")
- 스코어 variance 무관, 단순 cron 성공 카운트
- 타임존: user 설정 (기본 Asia/Seoul)
- 리셋 조건: 24시간 이상 미체크

#### C. Weekly Narrative
5 템플릿 기반 자동 생성:
| 템플릿 | 트리거 조건 |
|--------|-------------|
| 🚀 Big Mover | 7일 내 score Δ ≥ +10 |
| 😴 Stagnant | 7일 내 score Δ = 0 (±1) |
| 📉 Regression | 7일 내 score Δ ≤ -5 |
| ⚡ Breakthrough | pass_indicator 1단 상승 |
| 👋 First Week | 생성 후 7일 이내 |

서사 카드 + recommended next step 1개

#### D. Projection (예상)
"현재 상승 추세라면 STRONG까지 약 12일"
- 14일 평균 delta/day × (target - current)
- delta ≤ 0 → "Stay consistent to avoid regression"

### 2-2. Actions pane 확장

#### A. Top 3 (기존 Top 1 → Top 3)
- 4차원 worst 3 선정
- 각 action에:
  - 구체 실행 스텝 3개
  - Playbook 딥링크 (블로그 URL, 현재 작성한 13편 재활용)
  - "Expected score boost: +N pts if completed"

#### B. "I did this" 체크박스
- 클릭 시 `/v1/events` POST event_type=check_run + event_data={action_id, dim, timestamp}
- Journey Timeline에 즉시 반영
- 체크 후 Action 카드 녹색 음영 + "Completed X days ago"

#### C. Weekly Narrative 통합 (Journey와 공유 데이터)
- 상단에 narrative 카드 노출
- "Next week's focus: Category Ranking" 안내

#### D. Progress Gauge
```
[EMERGING] ●●●○○○○○○ [STRONG]
    ▲ You are here (28)     Target (35, +7 to go)
    + need 1 more recognition signal
```

---

## 3. API 변경 사항

### 신규
- `GET /v1/milestones?product=X` — 유저 제품 milestone 진척 상태 (완료/미완료 10 배지)
- `GET /v1/narrative?product=X` — Weekly narrative 템플릿 선택 + 텍스트

### 기존 활용
- `POST /v1/events` — ALLOWED_EVENT_TYPES 그대로 사용 (이미 구현됨)
- `GET /v1/events?product=X` — Timeline 렌더용 (이미 구현됨)

### 인프라 추가
- cron 내부에 Milestone 규칙 엔진 호출 (dailyRefresh 끝에서 /v1/events POST)
- streak_7 / streak_30 이벤트 추가 (ALLOWED_EVENT_TYPES 확장)

---

## 4. FE 구현

### Journey pane (D6 확장)
- Hero's Arc 유지 (현재 완료)
- Milestones 배지 벽 **신규** — 10 아이콘 grid, 미완료 회색
- Streak 카운터 **신규** — 상단 배지
- Weekly Narrative 카드 **신규**
- Projection 차트 **신규**

### Actions pane (현재 Top 1 → Top 3 + 상호작용)
- Weekly Narrative 카드 (상단)
- Top 3 Action 카드 (4차원 worst 3)
- Progress Gauge (하단)
- Completed actions 로그

---

## 5. 구현 순서 (6h)

| # | 작업 | 예상 |
|---|------|------|
| 1 | Milestone 규칙 엔진 (cron 통합) | 1h |
| 2 | streak_7/streak_30 이벤트 추가 + ALLOWED_EVENT_TYPES 확장 | 30m |
| 3 | `/v1/milestones` + `/v1/narrative` API | 1h |
| 4 | Journey Milestones 배지 벽 FE | 1h |
| 5 | Journey Streak + Weekly Narrative + Projection FE | 1h |
| 6 | Actions Top 3 + Playbook 딥링크 + 체크박스 + Progress Gauge | 1h |
| 7 | Playwright QA + vitest 추가 + 스테이징 배포 | 30m |

---

## 6. 데이터 의존성

| 의존성 | 상태 |
|--------|------|
| user_events 테이블 | ✅ 스키마 존재 |
| ALLOWED_EVENT_TYPES 12종 | ✅ 정의됨 |
| /v1/events POST/GET | ✅ 구현됨 |
| scores 시계열 | ✅ 쌓임 |
| pass_indicator B안 | ✅ 04-21 확정 |
| Tavily citations Tier 분류 | ✅ engineScore.ts 존재 |
| co-rec peer count | ✅ probe_logs 쌓음 |

---

## 7. 리스크

| 리스크 | 심각도 | 대응 |
|--------|--------|------|
| user_events 신규 유저 empty 상태 | 🟢 | "Start your journey" CTA |
| 규칙 엔진 false positive (double-fire) | 🟡 | dedupe=true 기본값 |
| Playbook 딥링크 깨짐 (블로그 URL 변경) | 🟢 | 중앙 정적 매핑 테이블 (PLAYBOOK_LINKS) |

---

## 8. 검증 기준 (DEPLOY-GATE-01 추가)

- [ ] 신규 유저: "Start your journey" empty state 노출
- [ ] pickedby.ai 자기 제품: first_check + perplexity_recognized + emerging_reached 배지 활성
- [ ] Weekly narrative: 'Stagnant' 템플릿 선택 확인 (Δ < 2)
- [ ] Action Top 3: Recognition 최하 가정 시 해당 action 1위
- [ ] "I did this" 체크 → 2초 내 Journey Timeline 반영
- [ ] console 에러 0

---

*설계 완료 · 다음 세션 구현 대기 · 2026-04-22 23:30 KST*
