// Gemini Relay Worker
// Runs with Smart Placement → routes to Japan/US DC where Gemini API is accessible
// Called by pickedbyai-api when running in HKG (Gemini blocked)

export interface Env {
  GEMINI_API_KEY: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/relay') {
      return new Response('Not found', { status: 404 })
    }

    let body: { prompt?: string }
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
    }

    if (!body.prompt) {
      return new Response(JSON.stringify({ error: 'prompt required' }), { status: 400 })
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`
    const geminiBody = {
      contents: [{ role: 'user', parts: [{ text: body.prompt }] }],
      tools: [{ google_search: {} }],
      generationConfig: { maxOutputTokens: 150, temperature: 0.1, thinkingConfig: { thinkingBudget: 0 } },
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
      signal: AbortSignal.timeout(9000),
    })

    if (!res.ok) {
      const err = await res.text()
      return new Response(
        JSON.stringify({ error: `Gemini ${res.status}`, detail: err.slice(0, 200) }),
        { status: res.status }
      )
    }

    const json = await res.json() as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> }
        groundingMetadata?: { webSearchQueries?: string[] }
      }>
    }

    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const grounded = (json.candidates?.[0]?.groundingMetadata?.webSearchQueries?.length ?? 0) > 0

    const colo = (request as Request & { cf?: { colo?: string } }).cf?.colo ?? 'unknown'
    console.log(`[relay] colo=${colo} grounded=${grounded}`)

    return new Response(JSON.stringify({ text, grounded }), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}
