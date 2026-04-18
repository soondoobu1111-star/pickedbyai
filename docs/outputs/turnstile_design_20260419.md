# LAND-TURNSTILE · 인프라 설계 문서 (B1 선작성)

> **작성일**: 2026-04-19 (일)
> **대상 작업**: LAND-TURNSTILE (D9b 착수 전 선결 블로커)
> **관련 블로커**: 4-Agent 평가에서 Dev(6.5/10) 하드 블로커로 지목
> **근거 문서**: `pickedbyAI/docs/outputs/research_landing_20260418.md`
> **스프린트 일정**: D9b = 2026-04-27 (월), 본 설계는 D9b 진입 전 완료
> **롤백 포인트**: `stable-20260418-pre-landing-redesign` (c77ec40)

---

## 1. 왜 Turnstile인가 (1줄 요약)

Shift 1 Hero Live Widget + `/v1/check` 오픈 엔드포인트 → **로그인 없이 무제한 호출 가능** → LLM API 비용 폭증 리스크.  
Cloudflare Turnstile = 무료, 쿠키리스, 개인정보 불수집, CF Workers 네이티브 호환 → **최소 비용·최소 UX 마찰**로 악성 호출 차단.

---

## 2. 공급자 선택 — Turnstile 고정

| 옵션 | 가격 | UX | CF Workers 연동 | 선택 |
|---|---|---|---|---|
| Cloudflare Turnstile | 무료, 무제한 | Invisible + Managed 지원 | 네이티브 | ✅ |
| hCaptcha | 무료(조건부) | 퍼즐 | HTTP fetch | ❌ (마찰↑) |
| reCAPTCHA v3 | 무료 1M/월 | 점수 기반 | Google 종속 | ❌ (개인정보) |
| Arkose | 유료 | 다양 | 별도 계약 | ❌ (비용) |

근거: (a) 무료, (b) CF 스택에 이미 진입, (c) Managed 모드 = 신뢰 유저 **자동 통과**, (d) 의심 트래픽만 챌린지 → Shift 1 Hero의 "10초 무가입" 약속 훼손 없음.

---

## 3. 위젯 모드 선택 — Managed

| 모드 | 설명 | 사용처 |
|---|---|---|
| **managed** (선택) | CF가 알아서 invisible / non-interactive / interactive 중 선택 | ✅ Hero Check, Dashboard Check |
| non-interactive | 항상 체크박스 없이 투명 | ⚠️ 봇 판정 어려운 경우 실패율↑ |
| invisible | 완전 은닉 | ⚠️ 낮은 신뢰 세션에서 통과율↓ |

→ **managed**로 통일. CF가 트래픽 신호 기반으로 invisible / 간단 challenge 자동 전환.

---

## 4. 배포 대상 엔드포인트

| 엔드포인트 | 현재 위치 | Turnstile 적용 | 비고 |
|---|---|---|---|
| `POST /v1/check` | `api/src/index.ts` | ✅ 필수 | LLM 호출 트리거 (비용 발생) |
| `POST /v1/subscribe` | Brevo relay | ⚠️ 선택 | 이메일 1건당 비용 미약, rate-limit만으로 가능 |
| `POST /v1/events` (Phase 2 예정) | 미구현 | ❌ 불필요 | 로그인 유저 전용 |
| `POST /v1/beta/*` | 기존 | ❌ 불필요 | 이미 Supabase RLS 보호 |
| `POST /v1/feedback` | 기존 | ⚠️ 선택 | 폭주 방지 정도면 충분, Turnstile 미적용 |

**결론: `/v1/check`만 필수. 나머지는 Phase 2 평가 후 결정.**

---

## 5. 프론트엔드 통합 지점 (3곳)

| 위치 | 파일 | 라인 | 변경 내용 |
|---|---|---|---|
| Hero Widget (Shift 1) | `landing/index.html` | ~2404 | Turnstile 위젯 + 토큰 POST body 포함 |
| Dashboard Check | `landing/dashboard.html` | 1108 | `runCheck` / `runCheckForce` 내부 토큰 획득 후 호출 |
| Dashboard 재체크 | `landing/dashboard.html` | 1513 | `runCheckFromList` 내부 |

### 5.1 Hero Widget Markup (관리형 invisible)

```html
<!-- landing/index.html hero 섹션 내 -->
<form id="heroCheckForm" onsubmit="return false;">
  <div class="cf-turnstile"
       data-sitekey="0x4AAAAAAA_TURNSTILE_SITEKEY_HERO"
       data-callback="onTurnstileReady"
       data-theme="dark"
       data-size="flexible"
       data-retry="auto"
       data-refresh-expired="auto"></div>

  <input id="heroProduct" placeholder="Your product name" required>
  <button id="heroCheckBtn" disabled>Check</button>
</form>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

### 5.2 JS 통합 패턴

```js
let turnstileToken = null;
function onTurnstileReady(token) {
  turnstileToken = token;
  document.getElementById('heroCheckBtn').disabled = false;
}

async function heroCheck() {
  if (!turnstileToken) return;
  const res = await fetch(`${API_BASE}/v1/check`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      product_name: heroProduct.value.trim(),
      cf_turnstile_token: turnstileToken,   // ← 핵심 필드
    }),
  });
  // 성공/실패 처리...
  // 재사용 금지 — 토큰 1회용
  try { turnstile.reset(); } catch (_) {}
  turnstileToken = null;
}
```

### 5.3 Dashboard Check 통합 (인증 유저)

- **원칙**: 로그인 유저도 위젯 렌더 (Managed → 대부분 invisible 통과)
- 봇 대량 계정 생성 후 무제한 호출 시나리오 방어 목적

---

## 6. 백엔드 검증 로직 (api/src)

### 6.1 validateTurnstile 헬퍼

```ts
// api/src/turnstile.ts (신규)
export async function validateTurnstile(
  token: string,
  secret: string,
  clientIp?: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!token) return { ok: false, reason: 'missing_token' };

  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  if (clientIp) form.set('remoteip', clientIp);

  const r = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: form }
  );
  const data: any = await r.json().catch(() => ({}));
  if (data?.success === true) return { ok: true };
  return { ok: false, reason: (data?.['error-codes'] || ['unknown']).join(',') };
}
```

### 6.2 `/v1/check` 라우트 삽입 위치

```ts
// api/src/index.ts `/v1/check` 핸들러 맨 앞
const clientIp = c.req.header('cf-connecting-ip') || undefined;
const { cf_turnstile_token } = body;
const secret = c.env.TURNSTILE_SECRET;

// 로컬 개발 시 우회 (ENVIRONMENT=dev 또는 TURNSTILE_BYPASS=1)
if (c.env.ENVIRONMENT !== 'dev' && c.env.TURNSTILE_BYPASS !== '1') {
  const check = await validateTurnstile(cf_turnstile_token, secret, clientIp);
  if (!check.ok) {
    return c.json({ error: 'turnstile_failed', reason: check.reason }, 403);
  }
}
```

### 6.3 에러 응답 계약

| 상태 | body | FE 처리 |
|---|---|---|
| `403 turnstile_failed` | `{ error, reason }` | 위젯 reset + 재시도 안내 |
| `400 missing_token` | `{ error }` | "보안 확인 로드 중, 잠시 후 다시" |
| `200` | 정상 `/v1/check` 응답 | 기존 UI 표시 |

---

## 7. Rate Limit 2차 방어 (Turnstile 보완)

Turnstile만으로는 **정상 유저의 과도한 반복 호출** 방어 불가. CF Workers KV + 토큰 버킷으로 보완.

```ts
// 기존 rate-limit 모듈에 IP + product_name 키로 확장
// 원칙: 로그인 유저 = 유저ID 키, 비로그인 = IP+product_name 키
// 한도:
//   - 비로그인: 10req / 60s / IP
//   - 로그인:   30req / 60s / user_id
//   - 동일 product_name: 3req / 300s (중복 호출 차단)
```

→ Turnstile = 봇 차단, Rate Limit = 정상 유저 남용 차단. **2중 방어**.

---

## 8. 시크릿 / 환경 변수 관리

### 8.1 CF Dashboard 발급 값 (CEO 직접)

| 환경 | Site Key (공개, FE 삽입) | Secret (비공개, Worker 환경변수) |
|---|---|---|
| 프로덕션 | `pickedby.ai` 도메인 등록 → `0x4AAAAAAA...PROD` | `0x4AAAAAAA...PROD_SECRET` |
| 스테이징 | `staging-0404.pickedby.ai` 등록 → `0x4AAAAAAA...STAGING` | `0x4AAAAAAA...STAGING_SECRET` |
| 로컬 개발 | Cloudflare 공식 테스트 키 `1x00000000000000000000AA` (항상 pass) | `1x0000000000000000000000000000000AA` |

### 8.2 Secret 등록 명령

```bash
# 키 값은 CEO 직접 (kw-key.sh add 또는 wrangler secret put)
# 스테이징
cd pickedbyAI/api
npx wrangler secret put TURNSTILE_SECRET --env staging

# 프로덕션
npx wrangler secret put TURNSTILE_SECRET
```

### 8.3 wrangler.toml 추가 (vars, 시크릿 아님)

```toml
# [env.staging.vars]
TURNSTILE_SITE_KEY = "0x4AAAAAAA...STAGING"

# [vars] (프로덕션)
TURNSTILE_SITE_KEY = "0x4AAAAAAA...PROD"
```

→ FE는 `/v1/config` 엔드포인트에서 site_key만 받아쓰거나, build 시 inline. **절대 secret은 FE에 노출 금지**.

---

## 9. 단계별 배포 체크리스트 (D9b 진입 전)

- [ ] 9-1. CEO가 CF Dashboard → Turnstile → Add Site 2건 등록
  - `pickedby.ai` + `www.pickedby.ai` + `staging-0404.pickedby.ai`
- [ ] 9-2. Site Key 2개 + Secret 2개 수령 (kw-key.sh add)
- [ ] 9-3. `api/src/turnstile.ts` 신규 작성 (§6.1)
- [ ] 9-4. `api/src/index.ts` `/v1/check` 검증 삽입 (§6.2)
- [ ] 9-5. `wrangler secret put TURNSTILE_SECRET --env staging`
- [ ] 9-6. `wrangler.toml` `TURNSTILE_SITE_KEY` vars 추가
- [ ] 9-7. FE Hero Widget (`landing/index.html`) Turnstile 스크립트 + 위젯 삽입 (§5.1)
- [ ] 9-8. Dashboard `runCheck` / `runCheckForce` / `runCheckFromList` 3곳 토큰 필드 추가 (§5.3)
- [ ] 9-9. Rate limit 확장 (§7)
- [ ] 9-10. 스테이징 배포
- [ ] 9-11. abuse 시뮬레이션: 10k req/min → 403 반환 확인 (§10)
- [ ] 9-12. 정상 유저 체크 10회 성공 확인
- [ ] 9-13. CEO 검증 후 프로덕션 배포

---

## 10. Abuse 시뮬레이션 테스트 (D11 DEPLOY-GATE 기준)

```bash
# 10,000 요청 (토큰 없이)
for i in $(seq 1 100); do
  for j in $(seq 1 100); do
    curl -sS -X POST https://staging-0404.pickedby.ai/v1/check \
      -H "content-type: application/json" \
      -d '{"product_name":"abuse-test"}' \
      -o /dev/null -w "%{http_code}\n" &
  done
  wait
done | sort | uniq -c
```

**기대 결과:**
- 최소 95% 이상 403 (turnstile_failed)
- 정상 토큰 동반 요청은 200
- LLM API 호출 0건 (검증 실패 시 즉시 반환)

---

## 11. 비용 및 성능 영향

| 항목 | 현재 | Turnstile 적용 후 |
|---|---|---|
| Turnstile 비용 | - | **$0** (무료) |
| 추가 FE 로드 (KB) | 0 | ~30KB (CF CDN, cache) |
| 추가 지연 (invisible 패스) | - | ~80ms (백그라운드) |
| `/v1/check` BE 처리 | N/A | +1 외부 호출 (~60ms p50) |
| 월 LLM API 절감 효과 | 베이스라인 | 봇 트래픽 차단으로 50~80% 절감 추정 |

---

## 12. 롤백 전략

- 문제 발생 시 `wrangler.toml`에 `TURNSTILE_BYPASS = "1"` 추가 후 재배포 → 즉시 우회
- 또는 `git revert` 후 `./scripts/deploy-staging.sh` 재배포
- FE는 위젯 로드 실패 시 버튼 계속 disabled → **비용 0, UX 피해 1 (체크 불가 안내)**

---

## 13. 리스크 매트릭스

| 리스크 | 심각도 | 대응 |
|---|---|---|
| Turnstile CDN 장애 | 🟡 중 | `TURNSTILE_BYPASS=1` 즉시 토글 가능 |
| 봇 Turnstile 우회 | 🟡 중 | Rate Limit 2차 방어 + Challenge 상향 |
| Safari ITP 쿠키 차단 | 🟢 낮 | Turnstile은 cookieless 설계 |
| 지역 차단 (China 등) | 🟢 낮 | 타깃 유저층(영어권) 영향 미미 |
| 오탐(정상 유저 fail) | 🟡 중 | `onUnsupported` 콜백 → 에러 UI + `mailto` 안내 |
| FE/BE 환경 불일치 (site_key ↔ secret) | 🔴 고 | §8 명시된 단계 체크리스트 준수 |

---

## 14. 성공 기준 (DEPLOY-GATE-01 연계)

- [ ] Turnstile 위젯 Hero + Dashboard 3곳 전부 로드 (console 에러 없음)
- [ ] 정상 체크 플로우 100회 연속 성공 (스테이징)
- [ ] 토큰 없는 호출 403 반환
- [ ] `/v1/check` p95 응답시간 증가 200ms 이내
- [ ] abuse 시뮬레이션 10k 요청 중 LLM 호출 0건
- [ ] CEO 직접 제품 3개 체크 정상 + UX 마찰 없음 확인

---

## 15. 오픈 이슈 (CEO 결정 필요)

1. **Hero Widget 로드 타이밍**: defer로 async 로드 할 건지 / LCP 방어 위해 `requestIdleCallback` 지연 로드 할 건지
   → 권고: defer로 async 로드하되, Hero H1은 Turnstile 로드 독립적으로 표시 (UX 우선)
2. **로그인 유저에게도 챌린지를?**: 예 (managed 모드에서 invisible 자동)
3. **Site Key 도메인 scope**: `pickedby.ai` / `www.pickedby.ai` / `staging-0404.pickedby.ai` 3개 한 site에 묶을지 별도 site 2개로 분리할지
   → 권고: site 2개 (prod = pickedby.ai + www / staging 별도). 운영 격리 + 스테이징 실수 방지

---

*Turnstile 설계 끝. CEO 승인 후 D9b 진입 전 §9 체크리스트 1~6번 CEO 직접, 7~13번 Dev 실행.*
