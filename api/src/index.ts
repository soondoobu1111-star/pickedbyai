import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  BREVO_API_KEY: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_KEY: string
  GEMINI_API_KEY: string
  AI: Ai
}

const SUPABASE_URL = 'https://pfrcppgecqsbnhkkjkbd.supabase.co'

type CheckResult = {
  label: string
  found: boolean
  rank: number | null
  grounded: boolean
}

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

// Extract rank from AI response text (1-20 only, avoids years/large numbers)
function findRank(text: string, name: string): number | null {
  const lower = text.toLowerCase()
  const nameLower = name.toLowerCase()
  const lines = lower.split('\n')
  for (const line of lines) {
    if (!line.includes(nameLower)) continue
    const m = line.match(/(\d+)/)
    if (m) {
      const n = parseInt(m[1], 10)
      if (n >= 1 && n <= 20) return n
    }
  }
  return null
}

const GEMINI_RELAY_URL = 'https://pickedbyai-gemini-relay.perceptdot.workers.dev/relay'

// ── Gemini via Relay Worker (Smart Placement → Japan/US DC) ───
// Relay Worker bypasses HKG Gemini block by running in accessible DC
async function queryGemini(_apiKey: string, prompt: string): Promise<{ text: string; grounded: boolean }> {
  const res = await fetch(GEMINI_RELAY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal: AbortSignal.timeout(4000),
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

  const prompt = `Evaluate whether AI systems know the digital product named "${name}"${urlCtx}.

"${name}" refers to a specific software product or SaaS tool — NOT a generic concept or phrase.
Only answer YES if you have direct, specific knowledge of "${name}" as a named product.

Reply in EXACTLY this format (5 lines only, no explanation):
1. YES or NO
2. YES or NO
3. YES #N or NO
4. YES or NO
5. YES or NO

Questions:
1. RECOGNITION: Do you have specific knowledge of "${name}" as a real software product (not just the words)?
2. RECOMMENDATION: Is "${name}" the product recommended by AI tools as a top solution in its category?
3. CATEGORY_RANK: Does the product "${name}" appear in "best of" or top-10 lists? If YES add " #N" for rank.
4. REVIEWS: Does the product "${name}" have reviews on Product Hunt, Reddit, G2, or tech blogs?
5. COMPARISONS: Has the product "${name}" appeared in "vs" or "alternatives to" comparison articles?`

  let results: CheckResult[]
  const colo = (c.req.raw as Request & { cf?: { colo?: string } }).cf?.colo ?? 'unknown'
  console.log(`[DC] ${colo}`)

  // ── Primary: Gemini 2.5 Flash + Search Grounding ──────────
  let geminiSuccess = false
  if (c.env.GEMINI_API_KEY) {
    try {
      const { text, grounded } = await queryGemini(c.env.GEMINI_API_KEY, prompt)
      console.log(`[Gemini] grounded=${grounded} raw="${text.slice(0, 200)}"`)

      const lines = text.split('\n').map(l => l.trim()).filter(l => /^\d\./.test(l))
      if (lines.length >= 3) {
        results = LABELS.map((label, i) => {
          const line = lines[i] ?? ''
          const found = /yes/i.test(line)
          const rankMatch = line.match(/#(\d+)/)
          const rank = found && rankMatch ? parseInt(rankMatch[1], 10) : null
          return { label, found, rank: rank && rank >= 1 && rank <= 20 ? rank : null, grounded }
        })
        geminiSuccess = true
      }
    } catch (err) {
      console.error('[Gemini] error (falling back to llama):', err)
    }
  }

  // ── Fallback: CF Workers AI (llama-3.2-3b) ───────────────
  if (!geminiSuccess) {
    try {
      const response = await c.env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 60,
      }) as { response?: string }

      const text = response.response ?? ''
      console.log(`[llama] raw="${text.slice(0, 200)}"`)

      const lines = text.split('\n').map(l => l.trim()).filter(l => /^\d\./.test(l))
      results = LABELS.map((label, i) => {
        const line = lines[i] ?? ''
        const found = /yes/i.test(line)
        const rankMatch = line.match(/#(\d+)/)
        const rank = found && rankMatch ? parseInt(rankMatch[1], 10) : null
        return { label, found, rank: rank && rank >= 1 && rank <= 20 ? rank : null, grounded: false }
      })
    } catch (err) {
      console.error('[llama] error:', err)
      results = LABELS.map(label => ({ label, found: false, rank: null, grounded: false }))
    }
  }

  // Compute AI Visibility Score (0-100)
  // Each YES = 20 points. Rank bonus if category rank is high.
  const totalFound = results.filter(r => r.found).length
  let score = totalFound * 20

  const rankResult = results[2] // CATEGORY_RANK
  if (rankResult?.found && rankResult.rank !== null) {
    if (rankResult.rank <= 3) score = Math.min(100, score + 10)
    else if (rankResult.rank <= 5) score = Math.min(100, score + 5)
  }
  score = Math.min(100, score)

  return c.json({ results, score, product: name })
})

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
