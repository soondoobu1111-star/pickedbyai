# pickedby.ai — PRODUCT (현재 상태 단일 소스)
> **TIER 1 파일** | 최종 갱신: 2026-04-29 | 300줄 제한
> CEO가 이 파일 하나로 현재 상태 전부 파악 가능해야 한다.
> **상세 전략**: `docs/bigpie-v1.6.md` | **투자자용**: `docs/whitepaper.md`

---

## 1. 한 줄 정의 (v1.6 — 2026-04-29)

**"AI 추천 시대의 성장 코치 — 5대 AI(GPT·Gemini·Claude·Grok·Perplexity)가 내 제품·콘텐츠를 추천하는지 측정하고, 왜 안 되는지 진단하고, 어떻게 하면 되는지 처방하는 플랫폼"**

- **정체성**: 체중계(BMI)가 아닌 퍼스널 트레이너(성장 코치)
- **측정 단위**: 제품 + 콘텐츠 + 퍼스널 브랜드
- **핵심 전환**: 점수가 낮을수록 서비스 가치가 높아지는 구조 (소상공인/신생기업 최적화)
- **비전**: "The Google Stack for AI Recommendations" + **6-Stage Growth Loop**

---

## 2. 현재 Phase

```
✅ Phase 1 (Measure): 완성 + 프로덕션 라이브 (2026-04-29)
   → 4차원 스코어 + Daily Pulse + Trend/Journey/Volume/Overview
✅ Phase 1.5 (DEPLOY-GATE-01 12/13 PASS): 프로덕션 배포 완료
   → API a5364d01 / FE 08eaf258 / Gemini 8492488f
🔄 Phase 2 (Growth Loop): 빅파이 1.6 — 진행 예정 (05-01~)
   → 처방 엔진 + 이행 추적 + 보상 + 바이럴 (6-Stage Loop)
🔮 Phase 3 (Optimize): 2027
```

---

## 3. 핵심 스코어 시스템 (빅파이 1.5, 2026-04-17 확정)

| 차원 | 점수 | 측정 방식 |
|------|------|---------|
| Direct Recognition | 35 | Gemini+Perplexity "아는가?" |
| Category Ranking | 35 | `best {category}` Top-10 등장 |
| Co-Recommendation | 20 | probe_logs 누적 파싱 |
| Web Authority | 10 | Tavily Tier-1/2 citation |
| **합계** | **100** | **sum == final (수학 보장)** |

**Pass Indicator**: 🏆 PERFECT / 🟢 STRONG / 🟡 EMERGING / 🔴 INVISIBLE
**Volume Metrics (1.5.1)**: probe_logs 기반 7지표 — 점수(상대) + 볼륨(절대) 이원 진단

---

## 4. 기술 스택 (확정)

| 레이어 | 기술 |
|--------|------|
| FE | 정적 HTML + Tailwind CDN → CF Pages |
| BE | TypeScript + Hono → CF Workers |
| DB | Supabase PostgreSQL (`emails` + `scores` + `probe_logs`) |
| AI Probe (베타) | Gemini Relay(무료) + Perplexity API($10/월) |
| 스코어 엔진 | CF Workers AI llama-3.1-8b + Tavily (cron 1쿼리 / manual 3쿼리) |
| 이메일 | Brevo (무료 300통/일) |
| 결제 | Paddle (Phase 2, PAY-PB-01) |

**월 운영비**: ~$10 (Perplexity API)

---

## 5. 배지 시스템 (V2-C 확정)

| 점수 | 티어 | 문구 |
|------|------|------|
| 81-100 | Gold | PICKED BY AI |
| 61-80 | Silver | SEEN BY AI |
| 36-60 | Bronze | NOTICED BY AI |
| 0-35 | 없음 | — |

---

## 6. 수익 구조 (확정)

| 플랜 | 가격 | AI 커버 | 핵심 기능 |
|------|------|---------|---------|
| Founding Creator 100 | $9/월 (평생) | 2엔진 | Creator 전체 (베타 선착순 100명) |
| Free | $0 | 2엔진 | 1회 체크, 배지 |
| Creator | $19/월 | 2엔진 | 무제한 체크, 추이, Volume, llms.txt |
| Pro | $49/월 | **5대 AI** | 경쟁사 추적, API, 다국어 |
| Agency | $99+/월 | **5대 AI** | 화이트라벨, 10클라이언트 |

> **무료/유료 티어 분리**: Free·Creator = 2엔진, Pro·Agency = 5대 AI 전체
> **선점 전 무료 유지 원칙** — 무료 한도 절대 축소 금지

---

## 7. 배포 현황

| 환경 | API | FE | Gemini |
|------|------|------|--------|
| 프로덕션 | `a5364d01` | `08eaf258` | `8492488f` |
| 스테이징 | `30f38fdf` | `c1689d12` | — |

**✅ DEPLOY-GATE-01 12/13 PASS (2026-04-29)** — #4 이메일 보류 → Phase 2
**🔖 복구포인트**: `stable-20260429-pre-prod-deploy` (`d1ca6e7`)

---

## 8. 경쟁사 요약

| 경쟁사 | 가격 | 우리와 차이 |
|--------|------|-----------|
| Otterly AI | $29-989/월 | 기업/마케터 타겟, Claude 미지원 |
| Profound | $500+/월 | Fortune 500 전용 |
| trysight.ai | 유료 | "AI Visibility Score" SEO 장악 중 🔴 |
| Durable | 무료 | 로컬 비즈니스만 |
| amivisibleonai.com | 무료 | 가짜 결과, 신뢰 낮음 |

**우리의 유일한 차별점**:
1. 크리에이터부터 시작하는 유일한 GEO 플랫폼 (24개 중 유일)
2. 10초 무료, 가입 불필요
3. "안 하면 확실히 안 보인다"

---

## 9. 핵심 채널 현황

| 채널 | 상태 | 비고 |
|------|------|------|
| X/Twitter | 🔴 **영구 포기** | 2026-04-21 CEO 최종. 항소·우회 금지 |
| LinkedIn | 🟡 Day 17 포스트 대기 | D11 후 CEO 게시 |
| Reddit | 🟡 카르마 59 → 200+ 목표 | 인터셉트 댓글 계속 |
| IH | ✅ 포스팅 완료 | 04-16 |
| 블로그 | ✅ 18편 배포 | SEO Wave 1 완료 |
| 모두의 창업 | ✅ **지원 완료** | 2026-04-23 CEO 직접 제출 |

**마케팅 재개 조건**: DEPLOY-GATE-01 통과 + CEO 검증 완료 (04-29 예정)

---

## 10. Moat 전략 요약 (v1.6)

```
Layer 0: Prescription Effectiveness Data — 처방 효과 데이터 (복제 불가)
Layer 1: Score Tracker — 추이 데이터 쌓으면 떠날 수 없다
Layer 2: SDK — 코드 심으면 제거가 두렵다
Layer 3: Creator Graph — 카테고리 벤치마크 = 돈으로 못 삼

Growth Flywheel: 측정 → 처방 → 실행 → 점수상승 → 공유 → 친구가입 → ...
+ 처방 효과 데이터 축적 → 더 정확한 처방 → 선순환

🔴 진짜 Moat = probe_logs + prescription_effectiveness (유저가 많을수록 강해짐)
```

---

## 11. 주요 결정 이력 (역대 CEO 확정 사항)

| 날짜 | 결정 | 번복 불가 |
|------|------|---------|
| 2026-04-06 | 배지 V2-C (Gold/Silver/Bronze) | ✅ |
| 2026-04-14 | LinkedIn 채널 전환 (X → LinkedIn) | ✅ |
| 2026-04-17 | 빅파이 1.5 (4차원 단일 스코어) | ✅ |
| 2026-04-21 | 범위 확장 (제품→제품+콘텐츠) | ✅ |
| 2026-04-21 | 5대 AI 커버 포지셔닝 확정 | ✅ |
| 2026-04-21 | X 채널 영구 포기 | ✅ |
| 2026-04-21 | DEPLOY-GATE-01 (프로덕션 배포 게이트) | ✅ |
| 2026-04-22 | probe_logs + Volume Metrics (빅파이 1.5.1) | ✅ |
| 2026-04-23 | 모두의 창업 2026 지원 완료 | ✅ |
| 2026-04-29 | D11 DEPLOY-GATE-01 12/13 PASS + 프로덕션 배포 | ✅ |
| 2026-04-29 | **빅파이 1.6 Growth Loop** (측정→처방→선순환) | ✅ |

---

*PRODUCT.md — TIER 1 파일. 세션마다 POST_TASK에서 갱신. 300줄 초과 시 해당 섹션 bigpie-v1.5.md로 이동.*
*[CPO] 최초 작성 2026-04-23 (데스크탑 Claude)*
