// ─────────────────────────────────────────────────────────────
// probeCache.ts — D7 PROBE-REDESIGN-01 Phase 1 24h 캐시
//
// 목적: Supabase category_cache 테이블을 이용해 Phase 1 카테고리 추론
//       결과를 24h 캐시. 반복 Perplexity 호출 비용 억제.
//
// DB 선행 조건 (CEO가 Supabase SQL Editor에서 실행):
//   CREATE TABLE IF NOT EXISTS category_cache (
//     name_normalized TEXT PRIMARY KEY,
//     description TEXT,
//     category TEXT NOT NULL,
//     sub_category TEXT,
//     primary_use_case TEXT,
//     expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours',
//     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
//   );
//
// 작성: 2026-04-24 (D7 PROBE-REDESIGN-01)
// ─────────────────────────────────────────────────────────────

type CacheEnv = {
  SUPABASE_SERVICE_KEY?: string
  SUPABASE_URL?: string
}

const DEFAULT_SUPABASE_URL = 'https://pfrcppgecqsbnhkkjkbd.supabase.co'

export type CategoryCacheEntry = {
  description?: string
  category: string
  sub_category?: string
  primary_use_case: string
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * 24h 캐시 조회. expires_at 기준 만료 여부 서버 사이드 필터링.
 * 미스 or 에러 → null.
 */
export async function getCategoryCache(
  env: CacheEnv,
  name: string,
): Promise<CategoryCacheEntry | null> {
  if (!env.SUPABASE_SERVICE_KEY) return null
  const sbUrl = env.SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = normalizeName(name)
  try {
    const res = await fetch(
      `${sbUrl}/rest/v1/category_cache?name_normalized=eq.${encodeURIComponent(key)}` +
        `&expires_at=gte.${new Date().toISOString()}&limit=1&select=description,category,sub_category,primary_use_case`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
      },
    )
    if (!res.ok) return null
    const rows = (await res.json()) as Array<{
      description?: string
      category: string
      sub_category?: string
      primary_use_case?: string
    }>
    if (!rows.length || !rows[0].category) return null
    return {
      description: rows[0].description,
      category: rows[0].category,
      sub_category: rows[0].sub_category,
      primary_use_case: rows[0].primary_use_case ?? '',
    }
  } catch (err) {
    console.error('[probeCache] getCategoryCache error:', err)
    return null
  }
}

/**
 * 캐시 저장. 이미 존재하면 upsert (만료 시간 갱신).
 * 실패 시 조용히 무시 (캐시 미스로 fallback).
 */
export async function setCategoryCache(
  env: CacheEnv,
  name: string,
  entry: CategoryCacheEntry,
): Promise<void> {
  if (!env.SUPABASE_SERVICE_KEY) return
  const sbUrl = env.SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = normalizeName(name)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  try {
    await fetch(`${sbUrl}/rest/v1/category_cache`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        name_normalized: key,
        description: entry.description ?? null,
        category: entry.category,
        sub_category: entry.sub_category ?? null,
        primary_use_case: entry.primary_use_case,
        expires_at: expiresAt,
      }),
    })
  } catch (err) {
    console.error('[probeCache] setCategoryCache error:', err)
  }
}
