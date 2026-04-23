// turnstile.ts — Cloudflare Turnstile 서버사이드 검증 (D9b LAND-TURNSTILE-01)
// 설계 문서: pickedbyAI/docs/outputs/turnstile_design_20260419.md

export async function validateTurnstile(
  token: string | undefined,
  secret: string | undefined,
  clientIp?: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!token) return { ok: false, reason: 'missing_token' }
  if (!secret) return { ok: false, reason: 'missing_secret' }

  const form = new URLSearchParams()
  form.set('secret', secret)
  form.set('response', token)
  if (clientIp) form.set('remoteip', clientIp)

  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    })
    const data = await r.json().catch(() => ({})) as { success?: boolean; 'error-codes'?: string[] }
    if (data?.success === true) return { ok: true }
    return { ok: false, reason: (data?.['error-codes'] ?? ['unknown']).join(',') }
  } catch {
    return { ok: false, reason: 'fetch_error' }
  }
}
