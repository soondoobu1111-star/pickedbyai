import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  GEMINI_API_KEY: string
  BREVO_API_KEY: string
}

type CheckQuery = {
  label: string
  prompt: string
}

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

// Extract rank from Gemini response text
function findRank(text: string, name: string): number | null {
  const lower = text.toLowerCase()
  const nameLower = name.toLowerCase()
  const lines = lower.split('\n')
  for (const line of lines) {
    if (!line.includes(nameLower)) continue
    const m = line.match(/(\d+)/)
    if (m) return parseInt(m[1], 10)
  }
  return null
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
// Runs 3 Gemini queries server-side, returns AI visibility results
app.post('/v1/check', async (c) => {
  let body: { product?: string; category?: string; keywords?: string; url?: string }

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
  }

  const { product, category, keywords, url } = body

  if (!product || product.trim().length < 1) {
    return c.json({ error: 'product is required' }, 400)
  }

  if (url && isBlockedUrl(url)) {
    return c.json({ error: 'Invalid URL' }, 400)
  }

  const name = product.trim()
  const cat = category ? category.trim() : ''
  const kw = keywords ? keywords.trim() : ''

  const queries: CheckQuery[] = [
    {
      label: 'Direct name search',
      prompt: `List the top 10 ${cat || 'digital'} products or creators named or similar to "${name}"${kw ? ` related to ${kw}` : ''}. Number each item. Be concise.`,
    },
    {
      label: 'Best-of recommendation',
      prompt: `What are the best ${cat || 'digital'} products${kw ? ` for ${kw}` : ''} recommended by AI assistants in 2024-2025? List top 10 with numbers. Include "${name}" if relevant.`,
    },
    {
      label: 'Problem-solution search',
      prompt: `Someone is looking for a ${cat || 'digital'} product${kw ? ` to help with ${kw}` : ''}. What are the top 10 recommendations? List with numbers. Include "${name}" if it fits.`,
    },
  ]

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${c.env.GEMINI_API_KEY}`

  const fetchQuery = async (q: CheckQuery): Promise<CheckResult> => {
    try {
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: q.prompt }] }],
          generationConfig: { maxOutputTokens: 600 },
        }),
      })

      if (!res.ok) {
        return { label: q.label, found: false, rank: null, grounded: false }
      }

      const data = await res.json() as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string; thought?: boolean }> }
          groundingMetadata?: { webSearchQueries?: string[] }
        }>
      }

      // 2.5-flash returns thinking blocks first — filter them out
      const parts = data.candidates?.[0]?.content?.parts ?? []
      const text = parts.filter(p => !p.thought).map(p => p.text ?? '').join('\n')
      const grounded = false // googleSearch disabled (CF Workers geo-restriction)
      const rank = findRank(text, name)
      const found = rank !== null || text.toLowerCase().includes(name.toLowerCase())

      return { label: q.label, found, rank, grounded }
    } catch {
      return { label: q.label, found: false, rank: null, grounded: false }
    }
  }

  const results = await Promise.all(queries.map(fetchQuery))

  // Compute AI Visibility Score (0-100)
  let score = 0
  const foundCount = results.filter(r => r.found).length
  score += foundCount * 20 // up to 60 for presence
  const bestRank = results.reduce((best: number | null, r) => {
    if (r.rank === null) return best
    if (best === null) return r.rank
    return Math.min(best, r.rank)
  }, null)
  if (bestRank !== null) {
    if (bestRank <= 3) score += 40
    else if (bestRank <= 5) score += 25
    else if (bestRank <= 10) score += 15
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

  return c.json({ ok: true })
})

export default app
