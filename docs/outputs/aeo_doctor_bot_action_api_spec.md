# AEO Doctor: Bot Action API Spec

> **상태**: 코드 작성 완료, 05-01 09:00 KST 배포 예정
> **목적**: 4 봇 (GPT Store / Gemini Gems / Perplexity / Poe)가 호출하는 read-only AI visibility check API
> **작성**: 2026-04-30 22:30 KST

---

## 1. 설계 결정 (왜 별도 엔드포인트가 아닌 dual-auth 방식인가)

### 옵션 비교

| 옵션 | 장점 | 단점 |
|------|------|------|
| (A) 새 endpoint `/v1/bot/check` | 격리, 명확 | 코드 중복, 유지보수 ↑ |
| (B) **기존 `/v1/check` dual-auth** ✅ | 코드 재사용, 유지보수 ↓ | 인증 로직 분기 필요 |

**채택: B** — 기존 scoring 로직 그대로 + 헤더 기반 분기. ~30줄 추가로 끝.

### 인증 분기 로직

```
헤더 `Authorization: Bearer <BOT_API_KEY>` 있음 → 봇 모드
  - Turnstile 우회
  - rate limit: 60/min/api-key (기존 IP 기반 10/min과 별도)
  - 응답: score + top 3 prescriptions만 (lite version)

헤더 없음 → 기존 사용자 모드 (변경 없음)
  - Turnstile 필수
  - rate limit: 10/min/IP
  - 응답: 전체 unifiedScore (기존 그대로)
```

---

## 2. 코드 변경 (api/src/index.ts)

### 2-1. 새 환경변수
```typescript
// types에 추가
type Env = {
  // ... 기존 환경변수
  BOT_API_KEY: string  // 봇 인증용 (각 봇별로 다른 키 발급 권장)
}
```

### 2-2. 새 헬퍼 함수 (line 130 근처)
```typescript
// Bot rate limit: per-API-key, 60/min
const botRateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkBotRateLimit(apiKey: string): boolean {
  const now = Date.now()
  const limit = botRateLimitMap.get(apiKey)
  if (!limit || now > limit.resetAt) {
    botRateLimitMap.set(apiKey, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (limit.count >= 60) return true
  limit.count++
  return false
}

function isBotRequest(c: any): { isBot: boolean; apiKey?: string } {
  const auth = c.req.header('authorization') || c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return { isBot: false }
  const apiKey = auth.slice(7).trim()
  if (!apiKey || apiKey !== c.env.BOT_API_KEY) return { isBot: false }
  return { isBot: true, apiKey }
}
```

### 2-3. `/v1/check` 분기 추가 (line 892 위에 인서트)
```typescript
// Bot 모드: GET 지원 (?domain= 쿼리)
app.get('/v1/check', async (c) => {
  const { isBot } = isBotRequest(c)
  if (!isBot) {
    return c.json({ error: 'GET /v1/check requires bot authentication. Use POST with Turnstile for user requests.' }, 401)
  }

  const apiKey = c.req.header('authorization')!.slice(7).trim()
  if (checkBotRateLimit(apiKey)) {
    return c.json({ error: 'Bot rate limit exceeded. Max 60/min/key.' }, 429)
  }

  const domain = c.req.query('domain')?.trim()
  if (!domain) return c.json({ error: 'domain query param is required' }, 400)
  if (domain.length > 200) return c.json({ error: 'domain too long' }, 400)

  // Normalize domain to URL
  let url = domain
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`
  if (isBlockedUrl(url)) return c.json({ error: 'Invalid domain' }, 400)

  // Reuse the same scoring engine
  const product = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  
  // Call existing scoring logic (refactored from POST handler)
  try {
    const result = await runVisibilityCheck(c, product, url)
    
    // Lite response for bots (score + top 3 prescriptions only)
    return c.json({
      domain,
      score: result.final,
      tier: getScoreTier(result.final),  // INVISIBLE/EMERGING/STRONG/PERFECT
      tier_description: getTierDescription(result.final),
      top_prescriptions: (result.prescriptions || []).slice(0, 3).map(p => ({
        title: p.title,
        action: p.action,
        impact: p.impact || p.priority || 0,
      })),
      full_report_url: 'https://pickedby.ai',
    })
  } catch (err) {
    console.error('[Bot /v1/check]', err)
    return c.json({ error: 'Score engine error. Try again in 30 seconds.' }, 500)
  }
})

// 헬퍼: score → tier 변환
function getScoreTier(score: number): string {
  if (score >= 81) return 'PERFECT'
  if (score >= 61) return 'STRONG'
  if (score >= 36) return 'EMERGING'
  return 'INVISIBLE'
}

function getTierDescription(score: number): string {
  if (score >= 81) return 'All engines consistently recommend you.'
  if (score >= 61) return 'Most engines recommend you. Optimization phase.'
  if (score >= 36) return 'Some engines see you. Patchy coverage.'
  return 'AI engines mostly do not know your product yet.'
}
```

### 2-4. 기존 POST `/v1/check` 리팩토링 (line 892)
```typescript
// 기존 핸들러 내부 scoring 로직을 별도 함수로 추출
async function runVisibilityCheck(c: any, product: string, url?: string) {
  // ... 기존 line 928 ~ end의 scoring 로직 그대로 이동
}

// POST handler는 그대로 유지하되 마지막에 runVisibilityCheck 호출하도록 정리
app.post('/v1/check', async (c) => {
  // ... 기존 IP rate limit + Turnstile 검증 그대로
  // 끝에서:
  const result = await runVisibilityCheck(c, name, url)
  return c.json(result)
})
```

> ⚠️ **리팩토링 범위**: 약 100줄 (기존 scoring 로직). diff 작을 때 한 번에 처리.

---

## 3. GPT Store Action OpenAPI 스펙

```yaml
openapi: 3.1.0
info:
  title: pickedby.ai AEO Score API
  description: AI visibility score and prescriptions across 5 major AI engines.
  version: v1
servers:
  - url: https://api.pickedby.ai
security:
  - BearerAuth: []
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
paths:
  /v1/check:
    get:
      operationId: getAIVisibilityScore
      summary: Get AI visibility score and top 3 prescriptions for a domain
      description: |
        Returns a 0-100 visibility score across ChatGPT, Perplexity, Gemini, Claude, and Grok,
        plus the top 3 prescriptions to improve based on the pickedby.ai prescription engine.
      parameters:
        - name: domain
          in: query
          required: true
          schema:
            type: string
            example: stripe.com
          description: Domain or URL to check (e.g., "stripe.com" or "https://stripe.com")
      responses:
        '200':
          description: Score and prescriptions
          content:
            application/json:
              schema:
                type: object
                properties:
                  domain: { type: string }
                  score: { type: integer, minimum: 0, maximum: 100 }
                  tier:
                    type: string
                    enum: [INVISIBLE, EMERGING, STRONG, PERFECT]
                  tier_description: { type: string }
                  top_prescriptions:
                    type: array
                    items:
                      type: object
                      properties:
                        title: { type: string }
                        action: { type: string }
                        impact: { type: integer }
                  full_report_url: { type: string }
        '400': { description: Invalid domain }
        '401': { description: Authentication required }
        '429': { description: Rate limit exceeded }
        '500': { description: Score engine error }
```

---

## 4. 환경변수 + 시크릿 (Cloudflare Workers)

### 4-1. 새 시크릿 등록
```bash
cd pickedbyAI/api
npx wrangler secret put BOT_API_KEY
# 입력: 32자 랜덤 문자열 (예: openssl rand -hex 16)
```

### 4-2. 봇별 API 키 발급 전략 (보안 강화)

```
옵션 1 (단순): 단일 BOT_API_KEY 모든 봇 공유
  - 장점: 셋업 간단
  - 단점: 키 노출 시 전 봇 영향

옵션 2 (권장): 봇별 키 (BOT_API_KEY_GPT / _GEMINI / _PERPLEXITY / _POE)
  - 장점: 격리, 봇별 사용량 추적
  - 단점: 시크릿 4개

→ 채택: 옵션 1 (단순) — 첫 라이브 후 트래픽 보고 옵션 2 마이그레이션
```

---

## 5. 보안 검토

| 위험 | 대비책 |
|------|------|
| API 키 노출 (GPT Store에 저장) | rate limit 60/min/key + 키 로테이션 (월 1회) |
| 무차별 도메인 탐색 | rate limit + isBlockedUrl 검증 (기존) |
| 스코어 소비 폭주 | bot mode는 캐시 우선 (기존 cache_score 활용) |
| 경쟁사 키 탈취 | 응답에 bot 호출 마킹 → 트래픽 모니터링 |

---

## 6. 배포 순서 (05-01 09:00 KST)

```
1. wrangler secret put BOT_API_KEY     # CEO 직접 입력 (CEO만 알아야 함)
2. api/src/index.ts 코드 수정 (위 2-1~2-4)
3. 로컬 테스트:
   curl -H "Authorization: Bearer <KEY>" \
     "http://localhost:8787/v1/check?domain=stripe.com"
4. 스테이징 배포: bash scripts/deploy-staging.sh
5. 스테이징 검증:
   curl -H "Authorization: Bearer <KEY>" \
     "https://pickedbyai-api-staging.perceptdot.workers.dev/v1/check?domain=stripe.com"
6. 프로덕션 배포: bash scripts/deploy-prod.sh
7. 프로덕션 검증
8. GPT Store Action 등록 (OpenAPI URL: https://api.pickedby.ai/openapi.yaml + Bearer key)
```

---

## 7. UTM 추적 통합 (옵션 B와 연계)

GPT Store 봇이 사용자에게 보여주는 CTA `pickedby.ai`는 텍스트만 노출. 사용자가 실제 URL 입력 시 `pickedby.ai/?utm_source=chatgpt-bot&utm_medium=gpt&utm_campaign=aeo-doctor-v1` 자동 변환은 별도 redirect 페이지(`/from-bot`)에서 처리. 다음 작업 (옵션 B)에서 처리.

---

## 8. 다음 단계

- [ ] CEO BOT_API_KEY 결정 (32자 hex 권장: `openssl rand -hex 16`)
- [ ] CEO Keychain에 추가: `./kw-key.sh add pickedbyai BOT_API_KEY <key>`
- [ ] api/src/index.ts 코드 수정 (05-01 09:00 KST)
- [ ] 스테이징 → 프로덕션 배포
- [ ] GPT Store Action 등록 시 OpenAPI URL + Bearer key 입력

---

*[CPO + Cloudflare] AEO Doctor Bot Action API spec v1 — 2026-04-30 22:30 KST 작성. 05-01 09:00 KST 코드 적용 예정. 데스크탑 Claude.*
