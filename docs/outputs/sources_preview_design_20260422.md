# Sources 프리뷰 설계 문서
> 작성: 2026-04-22 23:32 KST · CPO
> 승인: CEO 2026-04-22 "승인한다" (PROPOSAL 3)
> 대상: 다음 세션 구현 (2h 예상)
> 배경: 빅파이 1.5.2 Sources 풀셋은 05-01 이후 · 프리뷰만 먼저

---

## 0. CEO 피드백 핵심
> "이전에 얘기했던 sitemap, robots.txt, rss 도 구현 설계에 포함 시켜야하는거 아닌가? 기존에 SDK활용과 llms.txt 딥링크도 마찬가지고."

---

## 1. 프리뷰 범위 (v1.5.1 - 2h)

### 포함 (프리뷰)
- Actions pane 하단 **"Your Sources" 상태 카드** — 5항목 진단
- Overview 헤더 **"Sources: N/5"** 미니 인디케이터
- 항목별 **진단 결과** + **"Connect now"** CTA (외부 링크)

### 제외 (빅파이 1.5.2 풀셋 · 05-01 이후)
- sitemap.xml 자동 파싱 + 페이지별 Recognition
- rss.xml 24h/7d/30d 신규 콘텐츠 인식 추적
- robots.txt 9개 AI 봇 상세 진단
- llms.txt Validator + A/B Probe + 자동 생성
- SDK npm 패키지 실제 이벤트 수집

---

## 2. 5항목 진단 (프리뷰)

| # | 항목 | 체크 방법 (프리뷰) | UI 상태 |
|---|------|-------------------|---------|
| 1 | sitemap.xml | HEAD /sitemap.xml → 200? | ✅ detected / ❌ missing |
| 2 | robots.txt | HEAD /robots.txt → 200 + 텍스트 "GPTBot" 포함? | ✅ AI-friendly / ⚠️ needs review / ❌ blocking |
| 3 | llms.txt | HEAD /llms.txt → 200? | ✅ detected / ❌ missing → "Generate" CTA |
| 4 | rss feed | HEAD /rss.xml OR /feed.xml → 200? | ✅ detected / ❌ missing |
| 5 | pickedby SDK | (정적 안내만) | "Install pickedbyai SDK" CTA |

**진단 트리거:**
- 유저가 Actions pane 진입 시 자동 실행 (caching 1h)
- 결과: `domains.sources_status JSONB` 컬럼에 저장

---

## 3. API 변경

### 신규
- `GET /v1/sources/diagnose?domain=X` — 5항목 HEAD 요청 + 진단 결과 반환
  - Response: `{ sitemap: 'detected'|'missing', robots: 'ai-friendly'|'needs-review'|'blocking'|'missing', llms: 'detected'|'missing', rss: 'detected'|'missing', sdk: 'not-installed', count_ok: 0~5, last_checked: ISO }`
  - Caching: 1시간 (cloudflare KV 또는 domains 테이블)

### 기존 활용
- `domains` 테이블 — `sources_status JSONB` 컬럼 추가

---

## 4. FE 구현

### Actions pane 하단 Sources 카드
```html
<div class="card" id="actions-sources-card">
  <div class="sources-header">
    <span>YOUR SOURCES</span>
    <span>3 / 5 connected</span>
  </div>
  <div class="sources-grid">
    <!-- 5 rows: icon + label + status + CTA -->
  </div>
</div>
```

### Overview 헤더 미니 인디케이터
```html
<div id="d5-sources-mini" style="display:inline-block;">
  <span>SOURCES: 3/5</span>
</div>
```
- 클릭 → Actions pane 이동 + Sources 카드 스크롤

---

## 5. 구현 순서 (2h)

| # | 작업 | 예상 |
|---|------|------|
| 1 | `/v1/sources/diagnose` API 엔드포인트 (5 HEAD 요청) | 45m |
| 2 | domains.sources_status 컬럼 추가 (마이그레이션) | 15m |
| 3 | Actions pane Sources 카드 FE | 30m |
| 4 | Overview 미니 인디케이터 FE | 15m |
| 5 | QA + 스테이징 배포 | 15m |

---

## 6. 리스크

| 리스크 | 심각도 | 대응 |
|--------|--------|------|
| HEAD 요청 CORS | 🟢 | CF Worker가 프록시 (클라이언트 직접 호출 안 함) |
| 외부 도메인 타임아웃 | 🟢 | 5s timeout, fallback to unknown |
| 동일 도메인 과도 요청 | 🟢 | 1h cache + daily cron aggregation |

---

## 7. 빅파이 1.5.2 풀셋과의 관계

프리뷰는 **상태 진단까지만**. 풀셋에서는:
- sitemap 페이지별 Recognition 측정 (Page Coverage Report)
- rss 신규 콘텐츠 Freshness Score
- robots 9개 AI 봇별 Allow/Disallow 매트릭스
- llms.txt Validator + Quality Score
- SDK 실제 이벤트 수집 파이프라인

프리뷰는 유저 **인식과 동기 유발** 목적. "내 도메인이 AI에 얼마나 노출되고 있는지" 자각 → SDK 설치·llms.txt 생성 등 행동 유도.

---

*설계 완료 · 다음 세션 구현 대기 · 2026-04-22 23:35 KST*
