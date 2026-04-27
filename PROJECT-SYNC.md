# pickedby.ai — PROJECT SYNC
> 이 파일 1개를 읽으면 프로젝트의 시작부터 현재까지 전부 파악 가능합니다.
> 최종 갱신: 2026-04-29 | 유지: 매 Phase 전환 시 업데이트

---

## 1. 뭘 만드는가

**"AI 추천 시대의 성장 코치"** — 5대 AI(GPT·Gemini·Claude·Grok·Perplexity)가 내 제품을 추천하는지 **측정**하고, 왜 안 되는지 **진단**하고, 어떻게 하면 되는지 **처방**하는 플랫폼.

- URL: https://pickedby.ai (프로덕션 라이브)
- 비전: "The Google Stack for AI Recommendations"
- 타겟: 소상공인·신생기업·1인 크리에이터 (엔터프라이즈 아님)
- 핵심 통찰: **점수가 낮을수록 서비스 가치가 높다** (Notion 87점보다 신생 SaaS 27점에게 더 많은 인사이트 제공)

---

## 2. 지금까지 뭘 했는가 (타임라인)

| 날짜 | 사건 | 의미 |
|------|------|------|
| 04-05 | pickedby.ai 도메인 구매 + HTTPS 라이브 | 시작 |
| 04-06 | 배지 시스템 V2-C + Reddit r/SideProject 런치 (5.3K뷰) | 첫 외부 노출 |
| 04-08 | 블로그 18편 + Vision Brief v2.0 | SEO 기반 + "Google Stack" 비전 확립 |
| 04-10 | ENGINE-05 AI Probe (Perplexity+Gemini) 프로덕션 배포 | AI 직접 측정 시작 |
| 04-14 | @pickedbyAI X 계정 영구 정지 (자동화 봇) | 교훈: SNS 자동화 절대 금지 |
| 04-17 | **빅파이 1.5 설계** — 4차원 단일 스코어 (CEO "Notion 42점 이상한데?") | 측정 신뢰성 확보 |
| 04-18~22 | D1~D6 스프린트: DB·Shell·Overview·Trend·Journey·Volume | 대시보드 완성 |
| 04-22 | **빅파이 1.5.1** — Volume Metrics 7지표 + probe_logs Moat | 이원 진단 체계 |
| 04-23 | 모두의 창업 2026 지원서 제출 | 외부 검증 |
| 04-24 | D7 PROBE-REDESIGN-01 — 역방향 스무고개 프로브 | AI 측정 정확도 도약 |
| 04-25 | D8 GT-01 실측: Figma 95 / Notion 87.5 / Stripe 95 (T1 3/3 80+ PASS) | 점수 신뢰성 증명 |
| 04-26~28 | D9~D10: 랜딩 리뉴얼 + Turnstile + 모바일 반응형 + CEO 피드백 | 제품 품질 완성 |
| 04-29 | **D11 DEPLOY-GATE-01 12/13 PASS → 프로덕션 배포 완료** | Phase 1 완성 |
| 04-29 | **빅파이 1.6 확정** — BMI→처방 전환, 6-Stage Growth Loop | Phase 2 방향 확정 |

---

## 3. 현재 상태

```
Phase 1 (측정): ✅ 프로덕션 라이브
Phase 2 (처방 + 선순환): 🔄 05-01 착수 예정 — bigpie 1.6

프로덕션: API a5364d01 / FE 08eaf258 / Gemini Relay 8492488f
복구포인트: stable-20260429-pre-prod-deploy (d1ca6e7)
Turnstile: 활성화 (BYPASS=0)
cron: KST 00:00 자동 실행 (dailyRefresh)
```

---

## 4. 스코어 시스템 (4차원 단일)

```
Direct Recognition  35점 — Gemini+Perplexity가 "아는가? 추천하는가?"
Category Ranking    35점 — "best {category}" Top-10 등장 + 순위
Co-Recommendation   20점 — probe_logs 누적: 함께 추천되는 제품 수
Web Authority       10점 — Tavily Tier-1/2 사이트 인용 수
────────────────────────
합계               100점   (sum == final 수학 보장, score.test.ts 14테스트)

Pass Indicator: PERFECT(81+) / STRONG(61~80) / EMERGING(36~60) / INVISIBLE(0~35)
Volume Metrics: 7지표 (mentions·recognition_rate·category_hits·citation_count·source_diversity·corec_degree·total_probes)
```

---

## 5. 6-Stage Growth Loop (빅파이 1.6 — 핵심)

```
[1.MEASURE] 점수 측정 (완료)
    ↓
[2.DIAGNOSE] "Gemini가 널 모른다. 경쟁사 Semrush가 대신 추천됨" (Phase 2a)
    ↓
[3.PRESCRIBE] "PH 런치해(+15점) / Reddit 댓글(+8점) / llms.txt(+5점)" (Phase 2a)
    ↓
[3.5.TRACK] "PH 런치 완료 ✓ → 다음 체크: +12점! 효과 확인" (Phase 2b)
    ↓
[4.REWARD] 배지 획득 + Streak + 성장 리포트 (Phase 2c)
    ↓
[5.VIRAL] "3주만에 27→68!" 공유 카드 → 친구 가입 (Phase 2c)
    ↓
[6.ORGANIC] 남들이 언급 시작 → 점수 자동 상승 → 선순환 완성
```

**처방 엔진**: 규칙 기반 (LLM 미사용, 비용 $0). 5레벨 × 4차원 = 20규칙 세트.
**Moat**: probe_logs + 처방 효과 데이터 = 유저가 많을수록 처방이 정확해지는 복제 불가 자산.

---

## 6. 기술 스택

```
FE: 정적 HTML + Tailwind CDN → Cloudflare Pages (pickedby.ai)
BE: TypeScript + Hono → Cloudflare Workers (api.pickedby.ai)
DB: Supabase PostgreSQL (emails · scores · probe_logs · domains · user_events · category_cache)
AI Probe: Gemini Relay(무료) + Perplexity Sonar API($10/월)
스코어: CF Workers AI llama-3.1-8b + Tavily (temp=0, 결정적)
이메일: Brevo (무료 300통/일)
결제: Paddle (Phase 2)
월 운영비: ~$10
```

---

## 7. 핵심 결정 (번복 불가)

1. **4차원 단일 스코어** — 이원 시스템 금지 (v1.5)
2. **5대 AI 전체 커버** — 외부 카피는 항상 5대 AI 표기 (v1.5)
3. **점수 = 코드, LLM = 해석만** — 측정의 결정론적 무결성
4. **처방 = 규칙 기반, 비용 $0** — LLM 처방 금지 (v1.6)
5. **X 채널 영구 포기** — SNS 자동 포스팅 절대 금지 (교훈)
6. **선점 전 무료 유지** — 무료 한도 절대 축소 금지
7. **베타 100명 평생무료** — 신뢰 자본
8. **probe_logs = 진짜 Moat** — 매일 쌓이는 복제 불가 자산
9. **점수 낮을수록 서비스 가치 높음** — 소상공인 최적화 (v1.6)
10. **선순환** — 우리도 성장, 유저도 성장 (v1.6)

---

## 8. 수익 구조

| 플랜 | 가격 | AI 커버 |
|------|------|---------|
| Founding Creator 100 | $9/월 평생 | 2엔진 |
| Free | $0 | 2엔진 (1회 체크, 배지) |
| Creator | $19/월 | 2엔진 (무제한, 추이, 처방) |
| Pro | $49/월 | 5대 AI (경쟁사, API) |
| Agency | $99+/월 | 5대 AI (화이트라벨) |

---

## 9. 경쟁 환경

24개 GEO 도구 전부 기업/브랜드 타겟. 크리에이터용 = **0개** (우리만).
- Otterly AI ($29~989): 마케터 타겟, Claude 미지원
- Profound ($500+): Fortune 500 전용
- trysight.ai: "AI Visibility Score" SEO 장악 중 (직접 위협)
- 차별점: 10초 무료 + 가입 불필요 + **처방 엔진** (경쟁사 없음)

---

## 10. 다음 할 일 (Phase 2)

```
05-01: PRESCRIPTION-01 — prescriptionEngine.ts 20규칙 세트 구현
05-04: Actions Pane UI — 진단 리포트 + 처방 3개 + 벤치마크
05-07: 이행 추적 + Daily Pulse 이메일 (Brevo)
05-10: 배지 + 성장 리포트 + 바이럴 공유
05-12: DEPLOY-GATE-02 + 프로덕션 배포
05-15: 모두의 창업 결과 통보
```

---

## 11. 상세 문서 포인터

| 더 알고 싶은 것 | 파일 |
|----------------|------|
| 전략 마스터 | `pickedbyAI/docs/bigpie-v1.6.md` |
| 이전 전략 (v1.5) | `pickedbyAI/docs/bigpie-v1.5.md` |
| 투자자/외부용 | `pickedbyAI/docs/whitepaper.md` |
| 사업계획서 | `pickedbyAI/docs/bizplan.md` |
| 브랜드 가이드 | `pickedbyAI/docs/brand-guide.md` |
| 비전 v2.0 | `pickedbyAI/docs/vision-brief-v2.md` |
| 현재 상태 | `pickedbyAI/PRODUCT.md` |
| 현재 스프린트 | `pickedbyAI/SPRINT.md` |
| 디자인 시스템 | `pickedbyAI/docs/designs/` |
| 세션 기록 | `pickedbyAI/docs/outputs/daily_*.md` |
| 코드 | `pickedbyAI/api/src/` (BE) · `pickedbyAI/landing/` (FE) |

---

## 12. 창업자

- **Cheonkyu Jang** (장천규) — UX/서비스기획 출신, 1인 창업
- **pickedby.ai** (사업자등록 미완료)
- Claude Code로 전체 빌드 (바이브코딩)
- 한국인, 얼굴 비공개, 마케팅은 AI 생성 이미지 전용

---

*이 파일은 어떤 AI에게든 붙여넣기만 하면 pickedby.ai 프로젝트의 전체 맥락을 전달합니다.*
*최초 작성: 2026-04-29 (CPO, Opus)*
