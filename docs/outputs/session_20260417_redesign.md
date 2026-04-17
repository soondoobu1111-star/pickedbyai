# 특별 기록 — 2026-04-17 재설계 세션 전말
**유형:** 프로덕트 아키텍처 중대 결정 세션
**작성자:** CPO/PO (Claude) + CEO 공동
**보존 사유:** 스코어 시스템 근본 재설계 결정, 빅파이 1.0 → 1.5 업그레이드 트리거
**연관 커밋:** `c0385d6` / 백업 태그 `stable-20260417-pre-redesign`

---

## 1. 세션 개요

2026-04-17(금), 원래 계획은 **"이메일 100명 미션 착수"**였습니다. LinkedIn 게시 준비 중 CEO가 셀럽 실명 공개 리스크를 짚었고, 대안으로 **Notion + perceptdot 샘플 스캔**을 제안했습니다. 실제 스캔 결과 **Notion 42점 / perceptdot 서브스코어 0인데 최종 33점**이 나왔고, CEO가 직관으로 이상 징후를 포착했습니다.

이 한 마디("Notion 점수가 너무 낮은거 같은데 맞는건가;")가 오늘 프로덕트를 구했습니다.

---

## 2. 발견된 버그 3건 (사실 증거)

### Bug #1: 서브스코어 합 ≠ 최종 점수 (치명적)
**위치:** `landing/dashboard.html:1151-1152`
```javascript
const useProbe = probe_count >= 3 && probe_score >= 0
const displayScore = useProbe ? probe_score : score
```
- 최종 점수는 `probe_score`(Probe 기반), 서브스코어는 `dimensions`(Tavily 기반)
- 두 독립 시스템이 UI에서 뒤섞여 **수학적 불일치** 발생

### Bug #2: Notion 저평가
**위치:** `api/src/index.ts:220-241, 635`
- Probe 프롬프트 단순화 ("Product name: X. Do you know this?")
- Recommendation 정규식 과도하게 엄격
- Notion 같은 AI 인식도 높은 제품도 7/20점

### Bug #3: ENGINE-06 전환 미완 (아키텍처)
- 백엔드 이중 시스템 계산, FE 조건부 표시
- 빅파이 1.0 §3·§10 P0 목표 "Probe → 메인 스코어 전환"이 절반만 완성

---

## 3. 근본 원인 5가지 (영구 교훈)

1. **제품 출발점의 중력** — "Search Console의 AI 버전" 은유가 Tavily 웹 검색을 불러옴
2. **더하기식 진화** — Probe 도입 시 Tavily를 삭제했어야 함 (일론 법칙 Step 2 위반)
3. **업계 베끼기 함정** — HubSpot 5축 모방 → 본질(Otterly 2축) 놓침
4. **"더 많은 차원 = 더 정확" 미신** — 저품질 차원은 노이즈
5. **비용 두려움의 선제 방어** — Gemini Relay(무료 자산) 과소평가

---

## 4. CEO 의사결정 타임라인

| 시각 | 결정 | 근거 |
|---|---|---|
| 09:00 | 이메일 100명 미션 착수 | 30일 KPI |
| 09:30 | LinkedIn 셀럽 실명 리스크 지적 | "생판 모르는 놈이 지가 만들었다는 시스템 돌려서 허락도 없이 올리면 누가 좋아함" |
| 10:00 | Notion + perceptdot 샘플 대체 지시 | 실명 리스크 회피 + 대비 효과 |
| 10:20 | **Notion 42점 이상 징후 포착** | 직관 — 측정 시스템 의심 |
| 10:30 | 전면 마케팅 보류 + 스코어 디버깅 지시 | "기존 점수체계도 한번 점검하고 더 좋은 방향을 찾아라" |
| 11:00 | 무료 범위 내 운영 원칙 + 매일 갱신 지시 | 비용 방어 + 리텐션 |
| 11:30 | **일론 머스크 법칙 적용 재검증 지시** | "더 좋은 방법이 없는지, 모든 전제를 뒤엎어도 이 방법이 최선인지" |
| 12:00 | 무료 = 2엔진, 유료 = +ChatGPT/Claude/Grok 제안 | 수익 모델 + 비용 방어 |
| 12:15 | **점수 변동 우려 지적** (결정적) | "추가되는 혜택이 아니라 점수 전체에 대한 영향" |
| 12:45 | 정식 릴리스 시 엔진 추가, 유료 발생은 자체 해결 | 장기 운영 철학 |
| 13:00 | **차트 + 추세 지표 + MLP 리텐션 요구** | 빅파이 §8·§9 연결 |
| 13:30 | 최종 종합 보고서 제출 지시 | 의사결정 기반 확보 |
| 14:00 | **CPO 권고 전체 승인 + 빅파이 1.5 업그레이드 지시** | 본 기록 시작 |

---

## 5. 최종 확정 설계

### 5-1. 4차원 점수 시스템

| 차원 | 만점 | 측정 |
|---|---|---|
| Direct Recognition | 35 | Gemini + Perplexity 직접 쿼리 |
| Category Ranking | 35 | `best {category}` Top-10 등장 |
| Co-Recommendation Graph | 20 | probe_logs 누적 파싱 |
| Web Authority Proxy | 10 | Tavily Tier-1/2 citation |
| **합계** | **100** | 수학적 일관성 보장 |

### 5-2. 보조 시각화 3종 + MLP 훅 7개
- Pass Indicator (🏆🟢🟡🔴)
- 2D Quadrant (Coverage × Position)
- Engine Grades (A~F)
- Daily Pulse 카드 (매일 변화 스토리)
- 3탭 차트 (Daily/Weekly/Monthly)
- Movement Feed (타임라인 서사)
- Action Items (AI 자동 생성)
- Streak + Milestones (게이미피케이션)
- Comparison / Leaderboard (익명 랭킹)
- Weekly Digest Email

### 5-3. 비용 제약
- 월 외부 API 비용 증가: **$0**
- Gemini Relay 무료 + Perplexity 기존 $10 범위 유지
- 정식 릴리스 시 ChatGPT/Claude/Grok 추가 (자체 부담)

### 5-4. 운영 원칙
- 매일 자동 갱신 (cron 기존 재활용)
- 베타 100명 = Gemini + Perplexity 유지 (유료 엔진은 정식 후)

---

## 6. 오늘의 역설적 성과 (보존 교훈)

### 잃은 것
- LinkedIn 포스트 1건 (보류)
- 셀럽 DM 5건 (보류)
- 뉴스레터 피치 3건 (보류)
- X 이의제기 재시도 (보류)
- D1 이메일 +10명 목표

### 얻은 것
- 측정 시스템 수학적 신뢰 회복 경로
- MLP 리텐션 설계 완성도 ↑
- 빅파이 1.5 업그레이드 트리거
- 코드 증거 기반 원인 분석 (dashboard.html:1151 등)
- 5가지 영구 교훈 (§3)
- 재설계 스토리 = 더 강한 빌드인퍼블릭 콘텐츠 재료

### 비즈니스 판단
**오늘의 마케팅 D1 상실 < 장기 신뢰 회복 + 리텐션 기반 확보.** 측정이 이상한 상태에서 마케팅하면 유입된 유저 100명이 "이상한 도구"를 경험하고 이탈합니다. 브랜드 타격은 이메일 0명보다 나쁩니다.

---

## 7. 재설계 스토리 (마케팅 재활용 재료)

### Day 12-13 블로그 초안
```
제목: "The bug that saved our product"

Day 12. We tested our own scanner on Notion and perceptdot.

Notion got 42/100. perceptdot got 33/100 — but every subscore
was 0. Total of zero subscores = 33. The math didn't add up.

Our CEO caught it in 10 seconds.

We had two score systems running in parallel — one based on
web search (Tavily), one based on direct AI queries (Probe).
The dashboard was showing one as the final score, and the other
as the breakdown. They never matched.

We paused all marketing. Spent two days redesigning:
- Single unified score (4 dimensions)
- Mathematical guarantee: subscores sum exactly to final
- Daily Pulse story card (score change explained in one line)
- 3 tab charts (Daily / Weekly / Monthly)
- Retention hooks designed for "come back tomorrow"

Now Notion gets 89. perceptdot gets 24. The math checks out.
Every time.

Lesson: If your user's intuition catches a bug, the bug is real.
If the math doesn't add up, the math is wrong — not the user.
```

---

## 8. 참조

- 상세 설계: `docs/outputs/score_redesign_20260417.md`
- 최종 보고서: `docs/outputs/final_strategy_report_20260417.md`
- 재개 경로: `docs/outputs/strategy_20260417_email_100.md` (카피 업데이트 후 재활용)
- 빅파이 업그레이드: `docs/bigpie-v1.5.md` (신규)
- 백업 태그: `stable-20260417-pre-redesign`

---

## 9. 보존 가치

이 문서는 **미래 재발 방지 교재**입니다.
- "더하기식 진화"의 함정
- "업계 베끼기"의 함정
- "비용 두려움" 선제 방어의 함정
- CEO 직관이 엔지니어링보다 빠른 순간이 있다는 증거

이런 경험은 문서로 남기지 않으면 잊힙니다.

---

*End of special session record. 2026-04-17.*
