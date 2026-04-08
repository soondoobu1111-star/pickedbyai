# pickedby.ai (PBA) 사업계획서
> 최종 업데이트: 2026-04-07 (5AI 피드백 + Moat 전략 반영) | 기반: pickedby_ai_full_report.json + whitepaper.md
> **전략 상위 문서**: `pickedbyAI/docs/whitepaper.md` (Moat 전략, 시장 래더, 가설 검증 포함)

---

## 1. 한 줄 정의

**"AI 시대의 구글 서치콘솔 — 디지털 제품 크리에이터 전용"**

AI가 내 제품을 추천하는지 확인하고, 추천받을 준비를 자동으로 해주는 플랫폼.

---

## 2. 문제

ChatGPT, Claude, Perplexity가 쇼핑 추천의 주요 채널이 되고 있다.

- AI 레퍼럴 트래픽 YoY **+527%** (Semrush, 2025)
- Claude 전환율 **16.8%** (구글 1.76~2.8% 대비 10배)
- ChatGPT 일일 쇼핑 쿼리 **5,000만 건**
- **70%의 디지털 제품이 Product 스키마 없음** → AI에게 보이지 않음

그런데 Gumroad 셀러, Notion 템플릿 작가, AI 프롬프트 팩 크리에이터는 AI에 자기 제품이 추천되는지조차 모른다. 확인 방법도 없고, 최적화 방법도 모른다.

---

## 3. 솔루션

**pickedby.ai** = 크리에이터가 URL/제품명을 입력하면:

1. **10초 무료**: AI 추천 여부 + AI Visibility Score (0-100)
2. **즉시 진단**: 5개 차원(인지도/추천도/카테고리 순위/리뷰/비교 언급) 시각화
3. **배지**: Score별 "Picked by AI" Gold/Silver/Bronze 배지 발급
4. **원클릭 처방**: llms.txt 자동 생성, Schema.org JSON-LD 자동 생성 (Phase 2)
5. **알림**: 내 제품이 AI에서 언급되면 이메일 알림 (Phase 2)

---

## 4. 시장

| 지표 | 수치 | 출처 |
|------|------|------|
| 디지털 제품 셀러 수 | 200-300만 명 | Gumroad/Etsy/LS 합산 추정 |
| 크리에이터 이코노미 규모 | $1,910-2,540억 (2025) | Goldman Sachs |
| GEO/AEO 도구 시장 투자 | $3억+ | 24개 도구 합산 |
| 크리에이터 타겟 GEO 도구 | **0개** | 직접 조사 |

**핵심**: 24개 GEO 도구 전부 기업/브랜드 타겟. 크리에이터 세그먼트 완전 공백.

---

## 5. 경쟁사

| 경쟁사 | 가격 | 타겟 | 우리와 차이 |
|--------|------|------|-----------|
| Otterly AI | $29-989/월 | 마케터/SEO | 기업용 UX, Claude 미지원, 가입 필수 |
| Profound | $500+/월 | Fortune 500 | 대기업 전용 |
| Durable Discoverability | 무료 | 로컬 비즈니스 | 배관공/레스토랑 타겟 |
| Goodie AI | TBD | 인디 SaaS | B2B SaaS 타겟 |
| **pickedby.ai** | **무료/$19** | **크리에이터** | **10초 무료, 가입 불필요** |

**혁신자의 딜레마**: 기존 경쟁사는 더 높은 마진의 기업 고객 집중 → 크리에이터 시장에 안 내려옴.

---

## 6. 차별성 (확정, 번복 불가)

### ① 디지털 크리에이터 전용
Notion 템플릿, 전자책, AI 프롬프트, 온라인 강의에 특화된 카테고리 기반 모니터링.
경쟁사는 전부 브랜드명 기반 → 제품 카테고리 개념 없음.

### ② 10초 무료, 가입 불필요
URL 또는 제품명 입력 → 즉시 결과.
경쟁사 전부: 가입 → 설정 → 대기 구조.

### ③ "안 하면 확실히 안 보인다"
AI 추천을 보장하지 않는다. 하지만 인프라를 갖추지 않으면 확실히 안 보인다.
SEO가 "1위 보장 못 하는데" $1,070억 시장인 것과 동일 구조.

---

## 7. 수익 모델

| 플랜 | 가격 | 핵심 기능 | 전환 포인트 |
|------|------|-----------|-----------|
| Free | $0 | 1회 체크, 배지 | 즉각 Aha moment |
| Creator | $19/월 | 무제한 체크, 추이 차트, llms.txt, 주간 리포트 | "추이가 보고 싶다" |
| Pro | $49/월 | 경쟁사 추적, API, 다국어 최적화 | "경쟁사보다 앞서고 싶다" |
| Agency | $99+/월 | 화이트라벨 리포트, 10 클라이언트 관리 | "이걸 고객에게 팔고 싶다" |

**전략**: 지금은 돈보다 선점. 무료로 깔고, 유료는 가치 증명 후.
**유료 전환 핵심 후크**: llms.txt 자동생성 + 점수 추이 차트 + 경쟁사 비교
**결제 인프라**: DodoPay + Wise USD 계좌 (Bank Verification 승인 대기, 2026-04-06 제출)

---

## 8. 성장 전략

> 상세 Moat 전략·시장 래더·가설 검증: `whitepaper.md` 참조

### Phase 1 (0-1개월): 바이럴 훅 ✅ 완료
- 무료 AI Visibility Score 배포 ✅
- 배지 시스템 V2-C (Gold/Silver/Bronze) ✅
- @pickedbyAI Twitter/X 개설 + 런칭 스레드 ✅

### Phase 1.5 (지금): 마케팅 런칭 ← 현재 단계
- Product Hunt 출시 (목표: 2026-04-14)
- 내부 /blog 구현 + 첫 글 작성
- Reddit: r/Gumroad, r/Etsy, r/NotionTemplates
- Indie Hackers 빌딩 인 퍼블릭
- 목표: 이메일 1,000개

### Phase 2 (1-3개월): 핵심 제품 확장 + Moat Layer 1
- **MOAT-01 Score Tracker**: 주간 자동 체크 + 추이 차트 (시계열 Lock-in)
- **MOAT-02 SDK v0.1**: dynamic badge + impression 카운트 (코드 임베딩 전환비용)
- LLM-01~04 인사이트 (점수 해석, 경쟁사 비교, llms.txt 생성, 개선 조언)
- DEEP-01 딥링크 생성/추적 (bit.ly 패턴 — 데이터 해자)
- NOTIF-01 AI 추천 알림 (Linktree 패턴 — 불가능했던 가치)
- GA4-01/02 Google OAuth2 + GA4 AI 채널 트래픽 연동
- FEAT-01/02 llms.txt/Schema.org 자동 생성 (무료)
- FEAT-03 주간 리포트 이메일 (GA4 데이터 포함)
- PAY-01 DodoPay 결제 연동 + Creator $19 플랜 공개
- 목표: MRR $1,900

### Phase 3 (3-12개월): 플랫폼화 + Moat Layer 2~3
- **MOAT-03 SDK v0.2**: 클릭 추적 + 전환 correlation → 벤치마크 데이터
- **MOAT-04 Creator Graph**: 카테고리 벤치마크 리포트 발행
- **AGENCY-01 Agency $99+ 화이트라벨 플랜**
- INT-01~04 Gumroad/LemonSqueezy/Etsy/Shopify API
- INT-05 Zapier/Make 통합
- FEAT-07 직접 AI API 쿼리 (ChatGPT/Claude/Perplexity)
- MCP 서버 (AI 에이전트가 직접 쿼리)
- 다국어 최적화 (영어→일본어/스페인어)
- 목표: MRR $19,000+, 시드 펀딩 준비

### 시장 래더 (확정)
```
1단계 (지금~6개월): 인디 크리에이터 → PMF 증명 + 배지 네트워크 씨앗
2단계 (6~12개월): Micro-SaaS / Indie Hacker → ARPU $19~49
3단계 (12개월+): SMB / SEO Agency → ARPU $99~299
절대 금지: Enterprise (Profound 영역)
```

---

## 9. 기술 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| FE | 정적 HTML + Tailwind CDN | CF Pages 무료 |
| BE | TypeScript + Hono + CF Workers | perceptdot 스택 재활용 |
| DB | Supabase PostgreSQL | 이메일/스코어 저장, 무료 티어 |
| AI (ENGINE-04) | CF Workers AI (llama-3.2-3b) + Tavily 웹검색 | 패턴매칭, ~4초 |
| AI Probe (ENGINE-05) | **Perplexity Sonar + GPT-4o-mini + Gemini** | **직접 AI 쿼리, 2026-04-08 실증** |
| 이메일 | Brevo | 무료 300통/일 |
| 결제 | DodoPay | Phase 2, Wise USD 계좌 연결 완료 |
| 배포 | CF Pages + CF Workers | pickedby.ai / api.pickedby.ai |

**월 운영비**: Phase 1 ~$0, Phase 1.5 ~$5 (Perplexity/GPT API), Phase 2 ~$55

---

## 10. 배지 시스템 (V2-C, 2026-04-06 확정)

| 점수 | 티어 | 문구 | 특이사항 |
|------|------|------|---------|
| 81-100 | Gold | PICKED BY AI | goldPulse 애니메이션, 박스 글로우 |
| 61-80 | Silver | SEEN BY AI | #C0C0C0 |
| 36-60 | Bronze | NOTICED BY AI | #CD7F32 |
| 0-35 | 없음 | — | — |

크라운 로고: V2-C (3피크 + 3젬, x=4/9/14)

---

## 11. 리스크 & 대응

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| ~~Gemini HKG DC 차단~~ | **해결됨** | — | CF Workers AI 전환 (2026-04-06) |
| Semrush/Ahrefs GEO 기능 출시 | 높음 | 높음 | 배지 네트워크 선점 속도 경쟁. 크리에이터 채널 없는 그들의 약점 활용 |
| 크리에이터 지불의향 낮음 | 중간 | 높음 | Agency 래더로 ARPU 확보 + 점수 0 사용자 타겟 전환 |
| AI 알고리즘 변동 | 높음 | 중간 | 다중 소스(Tavily+LLM) + ENGINE-04 결정적 점수 |
| 유료 전환율 < 2% | 중간 | 높음 | llms.txt 가치 강화 + Score Tracker Lock-in |
| Otterly 크리에이터 플랜 출시 | 중간 | 중간 | 속도 선점 + SDK 전환비용 |
| 팀 규모 한계 | 확실 | 중간 | AI 코딩 에이전트 최대 활용 |
| ROI 증명 어려움 | 높음 | 중간 | SDK impression/클릭 데이터 + GA4 연동 |

> **5AI 피드백 기반 리스크 재평가 (2026-04-07)**

---

## 12. 마일스톤

| 날짜 | 마일스톤 | 상태 |
|------|---------|------|
| 2026-04-05 | pickedby.ai 도메인 구매 ($160/2년, Cloudflare) | ✅ |
| 2026-04-05 | HTTPS 라이브 + E2E 정상 (Notion Planner 10점, ChatGPT 53점) | ✅ |
| 2026-04-05 | Supabase 이메일 수집 DB 연동 | ✅ |
| 2026-04-06 | API 안정화 (Gemini → CF Workers AI, 4초) | ✅ |
| 2026-04-06 | 배지 시스템 V2-C (Gold/Silver/Bronze) 구현 | ✅ |
| 2026-04-06 | DodoPay + Wise USD 결제 인프라 구축 | ✅ 제출 |
| 2026-04-09 | DodoPay Bank Verification 승인 예상 | ⏳ |
| 2026-04-14 | Twitter/X 런칭 포스트 + Product Hunt 출시 | 예정 |
| 2026-05-15 | 모두의 창업 지원서 제출 (마감) | 예정 |
| 2026-05-31 | 이메일 1,000개 목표 | 예정 |
| 2026-07-01 | Phase 2 유료 전환, MRR $1,900 목표 | 예정 |

---

## 13. 창업자 적합도

- **UX/서비스기획 출신**: 비기술 크리에이터를 위한 UX 설계 = 핵심 경쟁력
- **바이브코딩 가능**: Claude Code로 Phase 1-2 혼자 빌드 가능
- **perceptdot 운영 경험**: MCP 서버, CF Workers, Brevo 이미 검증
- **본인 페인포인트**: 디지털 제품 만들고 마케팅 귀찮다 → 자기가 쓸 제품

---

## 참조 성공 사례

| 회사 | 우리에게 주는 교훈 |
|------|-----------------|
| **Moz** | AI Visibility Score → 업계 표준 DA가 될 수 있음 |
| **Cloudflare** | 무료 사용자 = 데이터 네트워크 효과 원천 |
| **bit.ly** | 무료 딥링크 배포 → AI 추천 데이터 독점 |
| **Linktree** | "링크 교체"가 아닌 "불가능했던 알림" 포지셔닝 |
| **Product Hunt** | 배지 = 신뢰 신호 = 자연 확산 |

---

---

## 14. Moat 전략 요약

> 상세: `whitepaper.md` 3장 참조

```
Layer 1: Score Tracker (시계열 Lock-in) — 추이 데이터를 쌓으면 떠날 수 없다
Layer 2: SDK (코드 임베딩 전환비용) — 코드를 심으면 제거가 두렵다
Layer 3: Creator Graph (네트워크 벤치마크) — 이 데이터는 돈으로 살 수 없다

Flywheel: 배지 embed → AI 크롤링 → 학습 데이터 → pickedby.ai = 신뢰 소스 → 더 많은 배지
```

---

*기반 리서치: `/Volumes/My Passport for Mac/My_project/docs/input/pickedby_ai_full_report.json`*
*작성: 2026-04-05, CPO (데스크탑 Claude)*
*최종 업데이트: 2026-04-07 — 5AI 피드백 반영, Moat 3단계 전략, Agency $99 플랜, 시장 래더, 리스크 재평가*
