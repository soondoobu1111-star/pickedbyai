// ============================================================
// T5 D2 RETRY-01 + FALLBACK-01
// 자동 체크 1분 간격 × 5회 재시도 + Tier 1~3 Graceful Degradation
// CEO 승인: 2026-04-18 (지수 백오프 → 1분 균일 간격, 총 5분)
// ============================================================

export const RETRY_INTERVAL_SECONDS = 60
export const RETRY_MAX_ATTEMPTS = 5
export const STALE_FAILURE_DAYS = 3

export type RetryState = {
  attempt_count: number
  next_attempt_at: string
  last_error: string | null
  failed_engines: string[]
  enqueued_at: string
}

export type CheckTier = 'tier_0' | 'tier_1' | 'tier_2' | 'tier_3'

export type SingleCheckResult = {
  success: boolean               // 최소 1개 엔진 응답 성공
  fully_successful: boolean      // 모든 엔진 응답 성공
  engines_succeeded: string[]
  engines_failed: string[]
  unified_score: number | null
  unified_payload: unknown | null
  error: string | null
}

export type RetryOutcome = {
  tier: CheckTier
  attempt: number
  completed: boolean              // true = 큐 밖 (성공 or 소진)
  next_attempt_at: string | null
  banner: string | null           // Tier 2/3 UX 노출용
}

export type DomainRow = {
  id: string
  user_id: string
  product_name: string
  domain_url: string
  retry_state: RetryState | null
  consecutive_failures: number
  last_check_success_at: string | null
}

type SupaEnv = {
  SUPABASE_SERVICE_KEY: string
  SUPABASE_URL?: string
  ENVIRONMENT?: string
}

// 2026-04-22 refactor: 공통 ./supabaseEnv.getSbUrl 로 교체.
import { getSbUrl as supaUrl } from './supabaseEnv'

function serviceHeaders(env: SupaEnv) {
  return {
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  }
}

async function patchDomain(
  env: SupaEnv,
  domainId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(`${supaUrl(env)}/rest/v1/domains?id=eq.${domainId}`, {
    method: 'PATCH',
    headers: serviceHeaders(env),
    body: JSON.stringify(patch),
  })
  if (!res.ok) {
    console.error('[retryAdapter] patch failed', res.status, await res.text())
  }
}

function formatRelative(iso: string | null): string {
  if (!iso) return 'unknown'
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 0) return 'just now'
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1) return `${Math.floor(diff / 60_000)}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function nextAttemptIso(): string {
  return new Date(Date.now() + RETRY_INTERVAL_SECONDS * 1000).toISOString()
}

// ────────────────────────────────────────────────────────────
// 핵심: 체크 결과 기록 + 다음 재시도 예약 / Tier 판정
// ────────────────────────────────────────────────────────────
export async function recordCheckResult(
  env: SupaEnv,
  domain: DomainRow,
  result: SingleCheckResult,
): Promise<RetryOutcome> {
  const prevAttempt = domain.retry_state?.attempt_count ?? 0
  const enqueuedAt = domain.retry_state?.enqueued_at ?? new Date().toISOString()
  const nowIso = new Date().toISOString()

  // ── 1) 완전 성공 → tier_0, 큐 밖 ──
  if (result.fully_successful) {
    await patchDomain(env, domain.id, {
      retry_state: null,
      check_tier: 'tier_0',
      last_check_success_at: nowIso,
      last_checked_at: nowIso,
      consecutive_failures: 0,
    })
    return { tier: 'tier_0', attempt: prevAttempt, completed: true, next_attempt_at: null, banner: null }
  }

  // ── 2) 부분 성공 → tier_1, 실패 엔진 남아있으면 재시도 예약 ──
  if (result.success) {
    const nextAttempt = prevAttempt + 1
    if (nextAttempt > RETRY_MAX_ATTEMPTS) {
      // 소진 — 부분이라도 점수 확정하고 종료
      await patchDomain(env, domain.id, {
        retry_state: null,
        check_tier: 'tier_1',
        last_check_success_at: nowIso,
        last_checked_at: nowIso,
        consecutive_failures: 0,
      })
      return { tier: 'tier_1', attempt: prevAttempt, completed: true, next_attempt_at: null, banner: null }
    }
    const next = nextAttemptIso()
    const state: RetryState = {
      attempt_count: nextAttempt,
      next_attempt_at: next,
      last_error: result.error,
      failed_engines: result.engines_failed,
      enqueued_at: enqueuedAt,
    }
    await patchDomain(env, domain.id, {
      retry_state: state,
      check_tier: 'tier_1',
      last_check_success_at: nowIso,
      last_checked_at: nowIso,
      consecutive_failures: 0,
    })
    return { tier: 'tier_1', attempt: nextAttempt, completed: false, next_attempt_at: next, banner: null }
  }

  // ── 3) 전체 실패 → 재시도 예약 or 소진 ──
  const nextAttempt = prevAttempt + 1

  if (nextAttempt > RETRY_MAX_ATTEMPTS) {
    // 5회 소진 — Tier 2 (스냅샷) or Tier 3 (stale)
    const newFailCount = (domain.consecutive_failures || 0) + 1
    const tier: CheckTier = newFailCount >= STALE_FAILURE_DAYS ? 'tier_3' : 'tier_2'
    const banner = tier === 'tier_3'
      ? 'Multiple consecutive check failures. We\'ll continue trying daily.'
      : `AI services unreachable. Showing last successful check ${formatRelative(domain.last_check_success_at)}.`
    await patchDomain(env, domain.id, {
      retry_state: null,
      check_tier: tier,
      last_checked_at: nowIso,
      consecutive_failures: newFailCount,
    })
    return { tier, attempt: prevAttempt, completed: true, next_attempt_at: null, banner }
  }

  // 재시도 예약
  const next = nextAttemptIso()
  const state: RetryState = {
    attempt_count: nextAttempt,
    next_attempt_at: next,
    last_error: result.error,
    failed_engines: result.engines_failed,
    enqueued_at: enqueuedAt,
  }
  await patchDomain(env, domain.id, {
    retry_state: state,
    check_tier: 'tier_1',
    last_checked_at: nowIso,
  })
  return {
    tier: 'tier_1',
    attempt: nextAttempt,
    completed: false,
    next_attempt_at: next,
    banner: `Check retrying (${nextAttempt}/${RETRY_MAX_ATTEMPTS}). Next attempt in ~1 minute.`,
  }
}

// ────────────────────────────────────────────────────────────
// 재시도 due 도메인 조회 (cron polling)
// ────────────────────────────────────────────────────────────
export async function fetchDueRetries(env: SupaEnv, limit = 20): Promise<DomainRow[]> {
  const res = await fetch(
    `${supaUrl(env)}/rest/v1/domains?status=eq.verified&retry_state=not.is.null&select=id,user_id,product_name,domain_url,retry_state,consecutive_failures,last_check_success_at&limit=${limit}`,
    { headers: serviceHeaders(env) },
  )
  if (!res.ok) {
    console.error('[fetchDueRetries] failed', res.status, await res.text())
    return []
  }
  const rows: DomainRow[] = await res.json()
  const nowIso = new Date().toISOString()
  return rows.filter(r => {
    const nextAt = r.retry_state?.next_attempt_at
    return nextAt !== undefined && nextAt !== null && nextAt <= nowIso
  })
}

// ────────────────────────────────────────────────────────────
// 도메인 단건 조회 (auto-check 엔드포인트용)
// ────────────────────────────────────────────────────────────
export async function fetchDomainById(env: SupaEnv, domainId: string): Promise<DomainRow | null> {
  const res = await fetch(
    `${supaUrl(env)}/rest/v1/domains?id=eq.${domainId}&select=id,user_id,product_name,domain_url,retry_state,consecutive_failures,last_check_success_at,status&limit=1`,
    { headers: serviceHeaders(env) },
  )
  if (!res.ok) return null
  const rows: Array<DomainRow & { status: string }> = await res.json()
  if (!rows.length) return null
  if (rows[0].status !== 'verified') return null
  return rows[0]
}
