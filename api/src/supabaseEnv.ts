// ─────────────────────────────────────────────────────────────
// supabaseEnv.ts — 환경 분기 공통 헬퍼
//
// 목적: 스테이징/프로덕션 Supabase URL 분기 로직을 단일 지점으로 통일.
// 배경: 2026-04-22 BUG-PROBE-LOGS-HARDCODED-URL (logProbes가 프로덕션 URL 하드코딩
//       사용해 스테이징 요청도 프로덕션으로 가는 버그) 발견 후 도입.
//       동일 패턴이 dailyRefresh / retryAdapter / logProbes 등 최소 4곳 반복되어
//       "잠재 버그 복수 포인트" 발생. 공통 함수로 리팩터링해 재발 방지.
//
// 사용:
//   import { getSbUrl } from './supabaseEnv'
//   const sbUrl = getSbUrl(env)
//   fetch(`${sbUrl}/rest/v1/...`)
// ─────────────────────────────────────────────────────────────

/**
 * 프로덕션 Supabase 기본 URL (ENVIRONMENT 미지정 시 fallback).
 * 기존 index.ts:27 `const SUPABASE_URL` 과 동일 값.
 */
export const SUPABASE_URL_PROD = 'https://pfrcppgecqsbnhkkjkbd.supabase.co'

/**
 * 스테이징 Supabase URL (wrangler.toml [env.staging.vars]와 동일 값).
 * 기존 index.ts 4곳의 `SUPABASE_URL_STAGING` 상수와 동일 값.
 */
export const SUPABASE_URL_STAGING = 'https://xzecybljfipmmzzzfnit.supabase.co'

/**
 * Supabase 공개 Anon Key (비밀 아님 — FE 코드에 노출된 공개 JWT).
 * secret으로 관리 시 잘못 설정될 위험 → 코드에 하드코딩해 오염 불가능하게 함.
 */
export const SUPABASE_ANON_KEY_PROD = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcmNwcGdlY3FzYm5oa2tqa2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjQ5OTQsImV4cCI6MjA5MDkwMDk5NH0.cxBUHjJoSEPJ7IilidxpVfCjS0SFmLFNWCeq92W0fUI'
export const SUPABASE_ANON_KEY_STAGING = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZWN5YmxqZmlwbW16enpmbml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTY4NjAsImV4cCI6MjA5MTAzMjg2MH0.pYqbBfJ7hwgKFgUSjvlhRlaOBIG4RqAgwDVTNUat03w'

/**
 * env.ENVIRONMENT 기반 Supabase URL 결정.
 * 우선순위:
 *   1. ENVIRONMENT === 'staging' → SUPABASE_URL_STAGING
 *   2. env.SUPABASE_URL (vars 또는 secret)
 *   3. SUPABASE_URL_PROD (하드코딩 fallback)
 */
export function getSbUrl(env: { ENVIRONMENT?: string; SUPABASE_URL?: string }): string {
  if (env.ENVIRONMENT === 'staging') return SUPABASE_URL_STAGING
  return env.SUPABASE_URL || SUPABASE_URL_PROD
}

/**
 * 환경별 Anon Key 반환 (하드코딩 — secret 오염 불가).
 */
export function getAnonKey(env: { ENVIRONMENT?: string }): string {
  return env.ENVIRONMENT === 'staging' ? SUPABASE_ANON_KEY_STAGING : SUPABASE_ANON_KEY_PROD
}
