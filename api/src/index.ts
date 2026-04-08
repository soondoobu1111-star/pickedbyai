import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  BREVO_API_KEY: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_KEY: string
  TAVILY_API_KEY: string
  AI: Ai
}

const SUPABASE_URL = 'https://pfrcppgecqsbnhkkjkbd.supabase.co'

type CheckResult = {
  label: string
  found: boolean
  rank: number | null
  grounded: boolean
}

type TavilyResult = { title: string; content: string; url: string }

// Block private/metadata IPs (SSRF prevention)
function isBlockedUrl(url: string): boolean {
  try {
    const u = new URL(url)
    const host = u.hostname
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true
    if (host === '169.254.169.254' || host === 'metadata.google.internal') return true
    if (/^10\./.test(host)) return true
    if (/^192\.168\./.test(host)) return true
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true
    if (!['http:', 'https:'].includes(u.protocol)) return true
    return false
  } catch {
    return true
  }
}

// Escape special regex characters in product name
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const GEMINI_RELAY_URL = 'https://pickedbyai-gemini-relay.perceptdot.workers.dev/relay'

// ── Tavily web search (returns raw results) ───────────────────
async function searchTavily(apiKey: string, query: string): Promise<TavilyResult[]> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey, query, search_depth: 'basic', max_results: 7 }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Tavily ${res.status}`)
  const json = await res.json() as { results: TavilyResult[] }
  return json.results
}

// ── ENGINE-04: Pure pattern matching on Tavily results (no LLM) ──
// 100% deterministic, zero LLM cost. Each dimension checked independently.
function scoreFromTavily(results: TavilyResult[], name: string): CheckResult[] {
  const LABELS = [
    'Direct name search',
    'Best-of recommendation',
    'Category ranking',
    'Reviews & mentions',
    'Comparison searches',
  ]

  if (!results.length) {
    return LABELS.map(label => ({ label, found: false, rank: null, grounded: true }))
  }

  const nameLower = name.toLowerCase()
  const escaped = escapeRegex(nameLower)

  // Combined text per result, lowercase
  const texts = results.map(r => (r.title + ' ' + r.content).toLowerCase())
  const urls = results.map(r => r.url.toLowerCase())

  // 1. RECOGNITION — name appears in at least 1 result
  const recognition = texts.some(t => t.includes(nameLower))

  // 2. RECOMMENDATION — name + recommendation signal in same result
  const recKw = /\b(best|top|recommended?|must.?have|popular|leading|great|excellent|award)\b/
  const recommendation = texts.some(t => t.includes(nameLower) && recKw.test(t))

  // 3. CATEGORY_RANK — name in a ranked list; extract position (1-20)
  let rankFound = false
  let rankNum: number | null = null
  const rankCtxKw = /\b(top\s*\d+|best\s+\d+|#\d+|\d+\.\s|\d+\))/
  for (const text of texts) {
    if (!text.includes(nameLower) || !rankCtxKw.test(text)) continue
    rankFound = true
    // "#N ... name" or "name ... #N"
    const m1 = text.match(new RegExp(`#(\\d+)[^\\d]*${escaped}|${escaped}[^\\d]*#(\\d+)`))
    if (m1) {
      const n = parseInt(m1[1] ?? m1[2], 10)
      if (n >= 1 && n <= 20) { rankNum = n; break }
    }
    // "N. name" or "N) name" list position
    const m2 = text.match(new RegExp(`\\b(\\d+)[.\\)][^\\n]{0,60}${escaped}`))
    if (m2) {
      const n = parseInt(m2[1], 10)
      if (n >= 1 && n <= 20) { rankNum = n; break }
    }
    break
  }

  // 4. REVIEWS — review platforms or review language + name
  const reviewKw = /\b(review|rating|rated|testimonial|feedback)\b/
  const reviewUrls = /reddit\.com|producthunt\.com|g2\.com|capterra\.com|trustpilot\.com/
  const reviews = texts.some((t, i) =>
    t.includes(nameLower) && (reviewKw.test(t) || reviewUrls.test(urls[i]))
  )

  // 5. COMPARISONS — vs / alternatives + name
  const compKw = /\b(vs\.?|versus|alternative|compared?\s+to|comparison)\b/
  const comparisons = texts.some(t => t.includes(nameLower) && compKw.test(t))

  return [
    { label: LABELS[0], found: recognition,    rank: null,    grounded: true },
    { label: LABELS[1], found: recommendation, rank: null,    grounded: true },
    { label: LABELS[2], found: rankFound,       rank: rankNum, grounded: true },
    { label: LABELS[3], found: reviews,         rank: null,    grounded: true },
    { label: LABELS[4], found: comparisons,     rank: null,    grounded: true },
  ]
}

// ── Gemini via Relay Worker (Smart Placement → Japan/US DC) ───
async function queryGemini(prompt: string, useSearch = true): Promise<{ text: string; grounded: boolean }> {
  const res = await fetch(GEMINI_RELAY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, useSearch }),
    signal: AbortSignal.timeout(12000),
  })
  if (!res.ok) {
    const err = await res.json() as { error?: string; detail?: string }
    throw new Error(`Relay ${res.status}: ${err.error ?? ''} ${err.detail ?? ''}`)
  }
  const json = await res.json() as { text: string; grounded: boolean }
  return { text: json.text, grounded: json.grounded }
}

const app = new Hono<{ Bindings: Bindings }>()

const ALLOWED_ORIGINS = [
  'https://pickedby.ai',
  'https://www.pickedby.ai',
  'https://staging-0404.pickedby.ai',
]

app.use('*', cors({
  origin: (origin) => ALLOWED_ORIGINS.includes(origin) ? origin : '',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400,
}))

// ── Health check ─────────────────────────────────────────────
app.get('/', (c) => c.json({ ok: true, service: 'pickedbyai-api' }))

// ── POST /v1/check ────────────────────────────────────────────
// Single Workers AI query evaluating 5 dimensions, returns AI visibility results
app.post('/v1/check', async (c) => {
  let body: { product?: string; url?: string; category?: string; keywords?: string }

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
  }

  const { product, url } = body

  if (!product || product.trim().length < 1) {
    return c.json({ error: 'product is required' }, 400)
  }

  if (url && isBlockedUrl(url)) {
    return c.json({ error: 'Invalid URL' }, 400)
  }

  const name = product.trim()
  const urlCtx = url ? ` (website: ${url})` : ''

  const LABELS = [
    'Direct name search',
    'Best-of recommendation',
    'Category ranking',
    'Reviews & mentions',
    'Comparison searches',
  ]

  // LLM fallback prompt (used only when Tavily unavailable — Steps 2b/2c)
  const buildPrompt = () =>
    `Evaluate whether AI systems know the digital product named "${name}"${urlCtx}.\n\n` +
    `"${name}" refers to a specific software product — NOT a generic concept.\n` +
    `Only answer YES if you have direct, specific knowledge of "${name}" as a named product.\n\n` +
    `Reply in EXACTLY this format (5 lines only, no explanation):\n` +
    `1. YES or NO\n2. YES or NO\n3. YES #N or NO\n4. YES or NO\n5. YES or NO\n\n` +
    `Questions:\n` +
    `1. RECOGNITION: Do you have specific knowledge of "${name}" as a real software product?\n` +
    `2. RECOMMENDATION: Is "${name}" recommended by AI tools as a top solution in its category?\n` +
    `3. CATEGORY_RANK: Does "${name}" appear in "best of" or top-10 lists? If YES add " #N".\n` +
    `4. REVIEWS: Does "${name}" have reviews on Product Hunt, Reddit, G2, or tech blogs?\n` +
    `5. COMPARISONS: Has "${name}" appeared in "vs" or "alternatives to" comparison articles?`

  let results: CheckResult[] = LABELS.map(label => ({ label, found: false, rank: null, grounded: false }))
  const colo = (c.req.raw as Request & { cf?: { colo?: string } }).cf?.colo ?? 'unknown'
  console.log(`[DC] ${colo}`)

  // ── Step 1: Tavily web search ─────────────────────────────
  let tavilyResults: TavilyResult[] = []
  if (c.env.TAVILY_API_KEY) {
    try {
      // Enriched query: surfaces best-of lists, reviews, comparisons alongside recognition
      const searchQuery = `${name} review best alternative comparison`
      tavilyResults = await searchTavily(c.env.TAVILY_API_KEY, searchQuery)
      console.log(`[Tavily] ok, ${tavilyResults.length} results`)
    } catch (err) {
      console.error('[Tavily] error:', err)
    }
  }

  // parseLines: used only for LLM fallbacks (Step 2b/2c)
  const parseLines = (text: string, grounded: boolean): CheckResult[] => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => /^\d\./.test(l))
    if (lines.length < 3) return []
    return LABELS.map((label, i) => {
      const line = lines[i] ?? ''
      const found = /yes/i.test(line)
      const rankMatch = line.match(/#(\d+)/)
      const rank = found && rankMatch ? parseInt(rankMatch[1], 10) : null
      return { label, found, rank: rank && rank >= 1 && rank <= 20 ? rank : null, grounded }
    })
  }

  let success = false

  // ── Step 2a: ENGINE-04 — Tavily pattern matching (no LLM) ──
  // 100% deterministic. Runs whenever Tavily results are available.
  if (tavilyResults.length) {
    results = scoreFromTavily(tavilyResults, name)
    console.log(`[ENGINE-04] pattern match: ${results.filter(r => r.found).length}/5 found`)

    // If product not recognized in enriched query, retry targeted for RECOGNITION ONLY.
    // Key: only update dimension[0]. Other 4 dimensions stay from enriched results.
    // Prevents AlternativeTo/Reddit profile from inflating REVIEWS & COMPARISONS scores.
    if (!results[0].found && c.env.TAVILY_API_KEY) {
      try {
        let domain = ''
        if (url) {
          try { domain = new URL(url).hostname.replace(/^www\./, '') } catch {}
        }
        const targetedQuery = domain ? `${name} ${domain}` : `${name} ${name}.com`
        const targetedResults = await searchTavily(c.env.TAVILY_API_KEY, targetedQuery)
        console.log(`[ENGINE-04] targeted retry "${targetedQuery}", ${targetedResults.length} results`)
        const targetedScored = scoreFromTavily(targetedResults, name)
        if (targetedScored[0].found) {
          // Only promote RECOGNITION; keep other 4 dims from enriched (all false = honest)
          results[0] = { ...results[0], found: true }
          console.log(`[ENGINE-04] targeted recognition hit (other dims stay from enriched)`)
        }
      } catch (err) {
        console.error('[ENGINE-04] targeted retry error:', err)
      }
    }

    // Mark success if recognized — unrecognized products fall through to Gemini
    if (results[0].found) {
      success = true
    } else {
      console.log(`[ENGINE-04] not recognized, falling through to Gemini`)
    }
  }

  // ── Step 2b: Gemini + Search Grounding (Tavily unavailable) ─
  if (!success) {
    try {
      const prompt = buildPrompt()
      const { text, grounded } = await queryGemini(prompt, true)
      console.log(`[Gemini] grounded=${grounded} raw="${text.slice(0, 200)}"`)
      const parsed = parseLines(text, grounded)
      if (parsed.length) { results = parsed; success = true }
    } catch (err) {
      console.error('[Gemini] error (falling back to llama):', err)
    }
  }

  // ── Step 2c: llama fallback (last resort) ─────────────────
  if (!success) {
    try {
      const prompt = buildPrompt()
      const response = await c.env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 60,
      }) as { response?: string }
      const text = response.response ?? ''
      console.log(`[llama-fallback] raw="${text.slice(0, 200)}"`)
      const parsed = parseLines(text, false)
      results = parsed.length ? parsed : LABELS.map(label => ({ label, found: false, rank: null, grounded: false }))
    } catch (err) {
      console.error('[llama-fallback] error:', err)
      results = LABELS.map(label => ({ label, found: false, rank: null, grounded: false }))
    }
  }

  // Compute AI Visibility Score (0-82)
  // Per-dimension weights: [direct(20), best-of(20), category(12), reviews(20), comparison(10)]
  // Max = 82 when all 5 pass. direct+reviews = 40 ("Known but not recommended").
  const WEIGHTS = [20, 20, 12, 20, 10]
  const score = results.reduce((sum, r, i) => sum + (r.found ? WEIGHTS[i] : 0), 0)

  return c.json({ results, score, product: name })
})

// ── FEAT-06: Welcome email via Brevo Transactional API ────────
// Requires hello@pickedby.ai sender domain verified in Brevo (DNS: DKIM + SPF)
async function sendWelcomeEmail(apiKey: string, email: string, product: string, score: number): Promise<void> {
  const tier = score >= 66 ? 'Gold 🥇 PICKED BY AI'
    : score >= 50 ? 'Silver 🥈 SEEN BY AI'
    : score >= 30 ? 'Bronze 🥉 NOTICED BY AI'
    : '— Not yet visible'
  const html = `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;color:#f5f5f5;padding:32px 24px;border-radius:8px;">
  <div style="font-size:13px;font-weight:700;color:#FFD700;margin-bottom:20px;letter-spacing:0.05em;">pickedby.ai</div>
  <h2 style="font-size:18px;margin:0 0 8px;color:#fff;">Your AI Visibility Score is in</h2>
  <p style="color:#aaa;margin:0 0 20px;font-size:14px;">You checked <strong style="color:#fff;">${product}</strong>.</p>
  <div style="background:#141414;border:1px solid #2a2a2a;border-radius:8px;padding:20px;text-align:center;margin-bottom:20px;">
    <div style="font-size:48px;font-weight:800;color:#FFD700;">${score}</div>
    <div style="font-size:13px;color:#888;">/ 82 · ${tier}</div>
  </div>
  <p style="font-size:13px;color:#888;margin:0 0 16px;">Sign in to your dashboard to track changes over time and get improvement tips.</p>
  <a href="https://pickedby.ai/dashboard.html" style="display:inline-block;background:#FFD700;color:#0a0a0a;font-weight:700;font-size:14px;padding:10px 24px;border-radius:6px;text-decoration:none;">Open Dashboard →</a>
  <p style="font-size:11px;color:#444;margin-top:24px;">You're receiving this because you checked a product on pickedby.ai. <a href="https://pickedby.ai/unsubscribe.html" style="color:#555;">Unsubscribe</a></p>
</div>`

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({
      sender: { name: 'pickedby.ai', email: 'hello@pickedby.ai' },
      to: [{ email }],
      subject: `Your "${product}" AI Visibility Score: ${score}/82`,
      htmlContent: html,
    }),
  }).then(async r => {
    if (!r.ok) console.error('[Brevo SMTP] error:', r.status, await r.text())
    else console.log('[Brevo SMTP] sent to', email)
  }).catch(err => console.error('[Brevo SMTP] fetch error:', err))
}

// ── POST /v1/subscribe ────────────────────────────────────────
// Adds email to Brevo contact list
app.post('/v1/subscribe', async (c) => {
  let body: { email?: string; product?: string; score?: number; source?: string }

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
  }

  const { email, product, score, source } = body

  if (!email || !email.includes('@')) {
    return c.json({ error: 'Invalid email' }, 400)
  }

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': c.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      email,
      listIds: [4], // pickedby.ai list — create in Brevo dashboard
      attributes: {
        PRODUCT: product ?? '',
        SCORE: score ?? 0,
        SOURCE: source ?? 'pickedby.ai',
      },
      updateEnabled: true,
    }),
  })

  if (!res.ok && res.status !== 204) {
    const text = await res.text()
    console.error('Brevo error:', res.status, text)
    return c.json({ error: 'Subscribe failed' }, 500)
  }

  // Send welcome email (fire-and-forget — don't block response)
  sendWelcomeEmail(c.env.BREVO_API_KEY, email, product ?? '', score ?? 0)

  // Save to Supabase (upsert — no duplicate emails, service key bypasses RLS)
  await fetch(`${SUPABASE_URL}/rest/v1/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': c.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      email,
      product: product ?? null,
      score: score ?? null,
      source: source ?? 'pickedby.ai',
    }),
  }).catch(err => console.error('Supabase error:', err))

  return c.json({ ok: true })
})

// ── POST /v1/verify ───────────────────────────────────────────
// Checks product site for pickedby-site-verification meta tag
app.post('/v1/verify', async (c) => {
  let body: { url?: string; token?: string }
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid JSON' }, 400) }

  const { url, token } = body
  if (!url || !token) return c.json({ error: 'url and token required' }, 400)
  if (isBlockedUrl(url)) return c.json({ error: 'Invalid URL' }, 400)
  if (!/^[a-zA-Z0-9]{8,24}$/.test(token)) return c.json({ error: 'Invalid token' }, 400)

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'pickedbyai-verify/1.0' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return c.json({ verified: false })
    const html = await res.text()
    // Match both attribute orderings
    const escaped = escapeRegex(token)
    const p1 = new RegExp(`<meta[^>]+name=["']pickedby-site-verification["'][^>]+content=["']${escaped}["']`, 'i')
    const p2 = new RegExp(`<meta[^>]+content=["']${escaped}["'][^>]+name=["']pickedby-site-verification["']`, 'i')
    const verified = p1.test(html) || p2.test(html)
    console.log(`[verify] url=${url} verified=${verified}`)
    return c.json({ verified })
  } catch (err) {
    console.error('[verify] error:', err)
    return c.json({ verified: false })
  }
})

// ── POST /v1/unsubscribe ──────────────────────────────────────
// Removes email from Brevo list and marks as unsubscribed
app.post('/v1/unsubscribe', async (c) => {
  let body: { email?: string }

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
  }

  const { email } = body

  if (!email || !email.includes('@')) {
    return c.json({ error: 'Invalid email' }, 400)
  }

  // Brevo: update contact — remove from list 4
  const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'api-key': c.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      unlinkListIds: [4],
    }),
  })

  if (!res.ok && res.status !== 204) {
    const text = await res.text()
    console.error('Brevo unsubscribe error:', res.status, text)
    // Still return ok — user experience shouldn't break on Brevo errors
  }

  return c.json({ ok: true })
})

export default app
