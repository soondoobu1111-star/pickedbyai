# pickedby.ai (PBA) — Strategy Sync v1.7
> Last updated: 2026-05-10 | Version: v1.7 Service-led Audit Factory | CEO 승인 완료

---

## 1. 한 줄 정의 (v1.7)

> **"AI가 내 제품을 추천하지 않는 이유와 고칠 작업을 24시간 안에 알려주는 No-call 진단 도구."**

이전: "AI 시대의 Google Search Console — 크리에이터 전용" → **폐기**
현재: Service-led Audit Factory. 6개월 단일 미션: **100 Public Audit 데이터셋**.

---

## 2. 비즈니스 모델 (v1.7)

### 가격 (원타임, 구독 아님)
| 티어 | 가격 | 내용 |
|------|------|------|
| Free Snapshot | $0 | 4차원 점수 + Top 3 fixes + raw evidence 2개 |
| Mini | $19 | 2엔진/3프롬프트/요약 3 fixes (PDF X, raw X, competitor X) |
| Audit ★주력 | $99 | 5엔진/10프롬프트/경쟁사 3/raw evidence 전체/PDF/retest 1회 |
| Deep (invite) | $299 | 20프롬프트/경쟁사 5/agency-ready PDF |

- $19→$99 업그레이드 시 7일 내 결제하면 $19 credit
- No calls. Async report only.
- 이전 구독 모델 ($0/$19/$49) → **폐기**

### Kill Gate (6개월)
| 날짜 | 기준 | Flag |
|------|------|------|
| 2026-06-10 | paid 3건 | yellow |
| 2026-07-05 | paid 5건 + Public URL 50개 | yellow |
| 2026-08-10 | 누적 10건 paid OR $2k 30-day revenue | red |
| 2026-11-10 | 20 paying / $5k 30-day revenue | **PBA 종료/축소** |

미달 시 → SEO/portfolio 자산으로 전환 (사업 X).

---

## 3. 기술 스택 (v1.7)

| 레이어 | 기술 |
|--------|------|
| FE | 정적 HTML + Tailwind CDN + CF Pages |
| BE | TypeScript + Hono + CF Workers |
| DB | Supabase PostgreSQL |
| AI | 5엔진 (GPT/Gemini/Claude/Grok/Perplexity) |
| 결제 | Stripe (원타임 Checkout) |
| 큐 | CF Queue (paid_audits_queue + Consumer worker) |
| 이메일 | Brevo |
| 분석 | Google Analytics + Contentsquare(Hotjar) |
| 배포 | CF Pages + CF Workers |

### 신규 인프라 (v1.7)
- Stripe Webhook → 빠른 200 → CF Queue → Consumer worker (30s 제한 회피)
- `stripe_events` 테이블 idempotency
- `public_audits` DB Trigger (Constitution 강제)

### 운영비: ~$10/월 + Stripe transaction fee

---

## 4. 현재 구현 상태 (main 브랜치)

### 페이지
- `landing/index.html` (2,596줄) — 메인 랜딩+체크+결과
- `landing/dashboard.html` (2,296줄) — 유저 대시보드 (Supabase+Chart.js)
- `landing/manifesto/` — "Why We're Building This"
- `landing/methodology/` — 점수 산출 방법론 공개
- `landing/llms-generator.html` — llms.txt 자동 생성
- `landing/badge-preview.html` — 배지 미리보기
- `landing/llms.txt` — 자체 llms.txt
- `landing/blog/` — **15개 SEO 블로그 글**
- `landing/privacy.html`, `terms.html`, `unsubscribe.html`
- `landing/robots.txt`, `sitemap.xml`

### API (80줄, v1.7에서 7개 추가 예정)
- `GET /v1/gemini-key` — Gemini API 키 프록시
- `POST /v1/subscribe` — Brevo 이메일 구독

### v1.7에서 추가될 것 (Phase 1 Day 1-14)
- **신규 페이지 5개**: `/audit/{product}`, `/compare/{a}-vs-{b}`, `/constitution`, `/methodology` v2, `/correction-log`
- **신규 API 7개**: audit, compare, checkout, webhook, correction, owner-claim, takedown
- **신규 DB 5개**: public_audits, paid_audits, corrections, stripe_events, daily_processing_state

---

## 5. PBA Constitution v1

### 8 원칙
1. 사용자 이익 > 광고/제휴/클릭률
2. 모르는 정보 추측 X, 불확실성 명시
3. 추천 근거 검증 가능 (raw evidence 노출)
4. 조작/가짜/과장 금지
5. AI 응답 출처 표시
6. Affiliate / Referral / Sponsored 없음 선언
7. Audit 방법론 공개 (`/methodology`)
8. 틀린 추천 정정 로그 매주 공개 (`/correction-log`)

### 6 제품 메커니즘 (코드에 강제, 카피 아님)
1. Raw Evidence 노출 — API 응답에 `raw_responses` 필드
2. Confidence Indicator — "Last 7-day average / AI varies ±5"
3. Source URL Tracking — `probe_logs.source_urls`
4. No Affiliate Declaration — 모든 페이지 footer
5. `/methodology` 공개
6. `/correction-log` 매주 공개

---

## 6. 검증 결과 요약

### 승률: 40% ± 5% (4라운드 검증, ~$2.50/344K tokens)

| 라운드 | 도구 | 결과 |
|--------|------|------|
| 1 | Codex v3 | 단일 추천 γ, 32-38% |
| 2 | GTM 리서치 | ConvertKit 70% + Plausible 20% + Ahrefs 10% 벤치마크 |
| 3 | Codex v4 | 5 fix 적용 후 36-44% |
| 4 | Design 검증 | Gemini GO Y / Codex GO N → 5 fix 즉시 적용 → 40%±5% |

### 가장 위험한 단일 가정 (Codex 직접 인용)
> "Solo founder가 AI visibility 문제를 지금 당장 $99로 살 만큼 고통스럽고, PBA audit이 매출/성장과 연결된다고 믿는다."
> → 06-10 Kill gate (paid 3건) = 이 가정의 첫 검증.

---

## 7. 경쟁 환경 (유효 — 변동 없음)

### 시장 4개 세그먼트
1. **Enterprise 모니터링** — Profound ($1B), Otterly, GrackerAI, Peec, Scrunch → 다른 시장
2. **URL 기술 감사** — amivisibleonai, Foglift, Ahrefs/Semrush 무료 → 실제 AI 쿼리 안 함
3. **브랜드명 체커** — WebTrek, Omnia, SearchScore → "회사/브랜드" 타겟
4. **유료 AI Audit 서비스 (async, no-call)** → **PBA만 여기 있음**

### "무료"는 차별점 아님 (Semrush/Ahrefs도 무료)
→ v1.7의 차별점: **raw evidence 공개 + Constitution 강제 + 5엔진 유료 audit**

---

## 8. 시장 구조 (유효 — 변동 없음)

- **TAM**: GEO 시장 $1.5B (2026) → $33.7B (2034), CAGR 45-50%
- **SAM**: AI 가시성 관심 디지털 제품 셀러 $15-50M
- **SOM**: 12개월 현실 매출 $12-57K
- AI 리퍼럴 전환율 Google 대비 4-5배
- GEO 예산 배분 12%→32% 급등 중

---

## 9. 해자 전략 (v1.7 맥락 업데이트)

| 해자 | v1.7 진행 상태 |
|------|---------------|
| 데이터 복리 (100 Public Audit) | ✅ 핵심 미션으로 격상 |
| 배지 네트워크 | ⏸️ Phase 3 이후 |
| Creator Network | ⏸️ Phase 3 이후 |
| 용어 표준화 (AI Vitals) | ⏸️ 보류 |
| 혁신자의 딜레마 | ✅ 유효 ($99 vs Profound $499+) |
| Constitution 투명성 | ✅ 신규 해자 — 경쟁사 0곳이 이것 함 |
| Probe logging | ✅ 착수됨 (probe_logs 테이블) |

---

## 10. 바이럴 원리 (보류 — Phase 3+)

v1.6에서 도출한 5가지 원리는 유효하지만 v1.7에서는 **Service-led** 우선:
1. 정체성 라벨 (16personalities) → 보류
2. 복사 가능한 포맷 (Wordle) → 보류
3. 혼자 못 쓰는 구조 (Calendly) → `/compare/` 페이지로 Phase 2
4. 시간 이벤트 (Spotify Wrapped) → 보류
5. 비자발적 노출 (Glassdoor) → ✅ `/audit/{product}` 공개 페이지 = 이것

---

## 11. Anthropic "Teaching Claude Why" 적용

### "What보다 Why" 원칙 → Audit 리포트에 반영
- 현재: "Schema 추가하세요" (what만)
- v1.7: "AI가 당신을 무시하는 이유 3가지 + raw evidence" (why 먼저)
- Constitution 원칙 3번: "추천 근거 검증 가능 (raw evidence 노출)"

### PBA Constitution = Anthropic Constitution의 제품 버전
- Anthropic: 모델에게 원칙을 심어서 행동 일반화
- PBA: 제품에 원칙을 심어서 신뢰 일반화

---

## 12. 폐기/변경된 전략

| 항목 | 상태 |
|------|------|
| "AI Search Console" 카피 | 폐기 (내부 비유로만) |
| "creators only" 포지셔닝 | 폐기 (빅파이 전환) |
| 구독 가격 $0/$19/$49 | 폐기 → 원타임 $0/$19/$99/$299 |
| "선점까지 최대 무료" 오픈소스 전략 | 폐기 → Kill Gate 기반 생존 검증 |
| "Founding 100 프로모션" | 변경 → "Free Snapshot 신청자 100명" |
| 페르소나 라벨 (AI Ghost/Champion) | 보류 (known gap 아님) |
| 배지 바이럴 / Creator Network | Phase 3+ 보류 |
| Reddit/PH/HN 동시 발사 | Phase 4-5 보류 |
| GPT Store 봇 4개 동시 | Phase 3 보류 |

---

## 13. Phase 1 P0 작업 요약 (Day 1-14, 현실 21-28일)

| Day | 작업 |
|-----|------|
| 1-3 | Constitution + Methodology + Correction Log 페이지 |
| 4-6 | `/audit/{product}` SSR + public_audits DB |
| 7-9 | Stripe + CF Queue + paid_audits |
| 10-11 | GPT 봇 카피 갱신 + Founding 100 재정의 |
| 12-14 | Manifesto v2 + Pricing 페이지 + QA |

---

## 14. 불변 룰
- API 키 출력 X
- 배포 CEO 승인 필수
- 글로벌 영어 only (한국 시장 X)
- 5엔진 명시 (GPT/Gemini/Claude/Grok/Perplexity)
- Constitution Affiliate X 영구
- SNS 자동 포스팅 X

---

## 15. 관련 문서 (이 레포)

### 유효
| 파일 | 내용 |
|------|------|
| competitor-analysis.json | 경쟁사 심층 분석 (시장 세그먼트 유효) |
| market-analysis.json | TAM/SAM/SOM + 트렌드 (유효) |
| gemini-analysis-feedback.json | Gemini 피드백 (Creator Network 인사이트 유효) |
| chatgpt-analysis-feedback.json | ChatGPT #1 (포지셔닝 갭 발견 — 빅파이로 해결) |
| chatgpt-vc-analysis-feedback.json | ChatGPT VC (Feature vs Company — v1.7로 해결 중) |

### 부분 유효 / 보류
| 파일 | 상태 |
|------|------|
| p0-leaky-bucket-fixes.json | 양동이 구멍 인사이트 유효, 구체 fix는 v1.7에서 대체 |
| viral-strategies-master.json | 원리 유효, 실행은 Phase 3+ |
| backlog-ai-bot-marketing.json | Phase 3 보류 |
| mobile-ui-fixes.json | 코드 기반 다름 (Windsurf 작업물) |

### 무효
| 파일 | 이유 |
|------|------|
| plan-sleek-inspired.json | 구독 모델 + 크리에이터 전용 전제 → v1.7과 충돌 |
| bizplan.md | v1.6 기준 → 대폭 업데이트 필요 |

---

## 16. 로컬 문서 (이 레포에 없음, 로컬에만 존재)
- `docs/bigpie-v1.7.md`
- `docs/PBA_CONSTITUTION_v1.md`
- `docs/designs/option-a-plus-plus/` (4개 설계 문서)
- `CLAUDE.md` (v1.7 업데이트)
- `memory/backlog.md`, `MEMORY.md`
- 검증 산출물 5개
