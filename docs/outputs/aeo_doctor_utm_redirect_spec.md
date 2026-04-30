# AEO Doctor: UTM Redirect Page Spec

> **상태**: 사양 작성 완료, 05-01 09:00 KST 배포 예정
> **목적**: 4 봇이 텍스트로 노출하는 `pickedby.ai`를 사용자가 실제 입력 시 UTM 자동 추가
> **작성**: 2026-04-30 23:00 KST

---

## 1. 문제와 해법

### 문제
봇 응답 CTA: `For full report: visit pickedby.ai`  
사용자가 직접 URL 입력 → UTM 추적 불가 → 봇 출처 분석 불가능

### 해법
간단한 redirect 페이지: `pickedby.ai/from?b=<bot_id>` → UTM 자동 추가 + main으로 redirect

봇 응답 CTA를 다음과 같이 변경:
- GPT Store: `visit pickedby.ai/g/aeo-doctor` (간결, 기억 가능)
- Gemini: `visit pickedby.ai/g/aeo-doctor`
- Perplexity: `visit pickedby.ai/g/aeo-doctor`
- Poe: `visit pickedby.ai/g/aeo-doctor`

> 같은 short URL이지만, 사용자 referrer 헤더 분석 + 봇 ID 쿼리로 출처 분기 가능. 또는 봇별 다른 short:
> - `pickedby.ai/g/gpt`
> - `pickedby.ai/g/gemini`
> - `pickedby.ai/g/px` (perplexity)
> - `pickedby.ai/g/poe`

**채택: 봇별 다른 short URL** — 단순, 명확, UTM 충돌 0.

---

## 2. 페이지 구현

### 2-1. 파일 위치
`pickedbyAI/landing/from/index.html` (또는 Workers 라우트)

### 2-2. URL 매핑

| short URL | UTM source | UTM medium | UTM campaign |
|-----------|-----------|-----------|------------|
| `/g/gpt` | chatgpt | bot | aeo-doctor-v1 |
| `/g/gemini` | gemini | gem | aeo-doctor-v1 |
| `/g/px` | perplexity | space | aeo-doctor-v1 |
| `/g/poe` | poe | bot | aeo-doctor-v1 |
| `/g/skill` | claude | skill | aeo-doctor-v1 |
| `/g/llms` | grok | llmstxt | aeo-doctor-v1 |

### 2-3. Cloudflare Workers Route (가장 가벼움)

```javascript
// pickedbyAI/landing/_routes.json (또는 wrangler.toml route 추가)
// /g/* 경로를 redirect 핸들러로

const BOT_MAP = {
  'gpt': { source: 'chatgpt', medium: 'bot' },
  'gemini': { source: 'gemini', medium: 'gem' },
  'px': { source: 'perplexity', medium: 'space' },
  'poe': { source: 'poe', medium: 'bot' },
  'skill': { source: 'claude', medium: 'skill' },
  'llms': { source: 'grok', medium: 'llmstxt' },
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const match = url.pathname.match(/^\/g\/([a-z]+)\/?$/)
    if (!match) return new Response('Not Found', { status: 404 })
    
    const botId = match[1]
    const bot = BOT_MAP[botId]
    if (!bot) return Response.redirect('https://pickedby.ai', 302)
    
    const target = new URL('https://pickedby.ai/')
    target.searchParams.set('utm_source', bot.source)
    target.searchParams.set('utm_medium', bot.medium)
    target.searchParams.set('utm_campaign', 'aeo-doctor-v1')
    target.searchParams.set('utm_content', botId)
    
    // GA4 + 서버 로그 동시 기록
    console.log(`[BOT_REFERRAL] bot=${botId} ts=${Date.now()}`)
    
    return Response.redirect(target.toString(), 302)
  }
}
```

### 2-4. 정적 HTML 대안 (Workers 못 쓸 때)

`pickedbyAI/landing/g/gpt/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=https://pickedby.ai/?utm_source=chatgpt&utm_medium=bot&utm_campaign=aeo-doctor-v1&utm_content=gpt">
<script>
  location.replace('https://pickedby.ai/?utm_source=chatgpt&utm_medium=bot&utm_campaign=aeo-doctor-v1&utm_content=gpt');
</script>
<title>Redirecting to pickedby.ai...</title>
</head>
<body>
  <p>Redirecting to <a href="https://pickedby.ai/?utm_source=chatgpt&utm_medium=bot&utm_campaign=aeo-doctor-v1&utm_content=gpt">pickedby.ai</a>...</p>
</body>
</html>
```

각 봇별 6개 디렉토리:
- `landing/g/gpt/index.html`
- `landing/g/gemini/index.html`
- `landing/g/px/index.html`
- `landing/g/poe/index.html`
- `landing/g/skill/index.html`
- `landing/g/llms/index.html`

---

## 3. GA4 통합 (자동 추적)

GA4는 UTM 파라미터 자동 인식. 별도 설정 불필요.

### 3-1. 봇 출처 트래픽 추적 dashboard
```
Acquisition > Traffic acquisition
- Filter: source = chatgpt | gemini | perplexity | poe | claude | grok
- Group by: source, medium, campaign
- Metrics: Users, New users, Sessions, Avg engagement, Bounce
```

### 3-2. 봇별 conversion funnel
```
Path Exploration:
Step 1: /g/{bot_id}
Step 2: / (랜딩)
Step 3: /check or /dashboard
Step 4: signup or /v1/check call
```

### 3-3. KPI 게이트 (W2 런칭 후 측정)
- **D5+1 (05-02)**: 첫 봇 referral 1+
- **D5+3 (05-04)**: 누적 봇 referral 50+
- **W2 끝 (05-14)**: 누적 봇 referral 1,000+
- **W3 끝 (05-21)**: 누적 봇 referral 5,000+

---

## 4. 봇 시스템 프롬프트 CTA 업데이트 (v3)

기존 (v2): `For full report: visit pickedby.ai`  
신규 (v3): `For full report: visit pickedby.ai/g/<bot>`

| 봇 | CTA 변경 |
|---|----------|
| GPT Store | `visit pickedby.ai/g/gpt` |
| Gemini Gems | `visit pickedby.ai/g/gemini` |
| Perplexity Space | `visit pickedby.ai/g/px` |
| Poe | `visit pickedby.ai/g/poe` |

> ⚠️ **봇 카피 v1 → v3 업그레이드** — `aeo_doctor_bot_copy_v1.md` 다음 세션에서 v3로 업데이트 필요.

---

## 5. 배포 순서 (05-01 ~ 09:30 KST)

```
1. landing/g/ 디렉토리 생성 (6 봇 ID)
2. 각 봇별 index.html 작성 (또는 Workers 라우트 단일 파일)
3. wrangler.toml route 추가: pickedby.ai/g/*
4. 스테이징 배포
5. 검증:
   curl -I https://staging-0404.pickedby.ai/g/gpt
   → expect: 302, Location: https://pickedby.ai/?utm_source=chatgpt&...
6. 프로덕션 배포
7. 검증: 모든 6개 short URL → 정상 redirect
8. 봇 카피 v3 업데이트 (각 봇 시스템 프롬프트 CTA 변경)
```

---

## 6. 보안

- **Open redirect 위험**: ❌ — 우리 도메인 (`pickedby.ai`)으로만 redirect. Open redirect 아님.
- **봇 ID 검증**: ✅ — BOT_MAP에 없으면 root로 redirect
- **rate limit**: 불필요 (정적 redirect, 비용 0)

---

## 7. 다음 단계

- [ ] 05-01 09:00 KST: landing/g/ 6 디렉토리 + index.html 6개 작성
- [ ] 05-01 09:15 KST: 스테이징 배포 + 검증
- [ ] 05-01 09:25 KST: 프로덕션 배포 + 검증
- [ ] 05-01 09:30 KST: 봇 카피 v1 → v3 업데이트 (CTA short URL 적용)
- [ ] 05-01 10:00 KST: GPT Store / Gemini Gems / Poe 봇에 v3 시스템 프롬프트 입력 + 라이브
- [ ] 05-02 09:00 KST: 첫 봇 referral 트래픽 GA4 확인 (D5+1 게이트)

---

*[CPO + Cloudflare] AEO Doctor UTM Redirect Page spec v1 — 2026-04-30 23:00 KST 작성. 05-01 09:00 KST 배포 예정. 데스크탑 Claude.*
