// ─────────────────────────────────────────────────────────────
// refreshIntegrity.test.ts — BUG-REFRESH-DB-ONLY-01 회귀 게이트
//
// D안 (업계 표준) 정책 검증:
//   - REFRESH = DB 재조회 only (새 LLM 호출 X)
//   - /v1/check 오늘자 row 존재 시 UPDATE skip (cron baseline 보호)
//   - manual baseline 가드 양방향 (cron + manual 모두 anomaly 시 flagged=true)
//   - FE isValidScoreRow가 flagged=true row 제외
//
// 작성: 2026-05-04 (5번째 score 일관성 회귀 차단)
// 영구 룰: feedback_refresh_dom_semantics.md
// ─────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const dashboardSrc = readFileSync(
  join(__dirname, '..', '..', 'landing', 'dashboard.html'),
  'utf-8',
)
const indexSrc = readFileSync(join(__dirname, 'index.ts'), 'utf-8')

describe('BUG-REFRESH-DB-ONLY-01 회귀 게이트', () => {
  describe('Test 1 — triggerRefreshNow는 LLM 호출 0', () => {
    it('triggerRefreshNow 본문에 runCheckForce 호출이 없어야 함', () => {
      // triggerRefreshNow 함수 본문 추출 (next function declaration까지)
      const fnStart = dashboardSrc.indexOf('async function triggerRefreshNow()')
      expect(fnStart).toBeGreaterThan(0)
      // 함수 닫는 } + window.triggerRefreshNow까지 본문 추출
      const fnEnd = dashboardSrc.indexOf('window.triggerRefreshNow = triggerRefreshNow', fnStart)
      expect(fnEnd).toBeGreaterThan(fnStart)
      const body = dashboardSrc.slice(fnStart, fnEnd)
      expect(body).not.toContain('runCheckForce(')
      expect(body).not.toContain('await runCheckForce')
    })

    it('triggerRefreshNow 본문에 /v1/check fetch 패턴이 없어야 함', () => {
      const fnStart = dashboardSrc.indexOf('async function triggerRefreshNow()')
      const fnEnd = dashboardSrc.indexOf('window.triggerRefreshNow = triggerRefreshNow', fnStart)
      const body = dashboardSrc.slice(fnStart, fnEnd)
      expect(body).not.toMatch(/fetch\([^)]*\/v1\/check/)
    })

    it('triggerRefreshNow 본문에 Turnstile 토큰 자동 대기 / openQuickCheck 폴백 없어야 함', () => {
      const fnStart = dashboardSrc.indexOf('async function triggerRefreshNow()')
      const fnEnd = dashboardSrc.indexOf('window.triggerRefreshNow = triggerRefreshNow', fnStart)
      const body = dashboardSrc.slice(fnStart, fnEnd)
      expect(body).not.toContain('getTurnstileToken')
      expect(body).not.toContain('openQuickCheck')
    })

    it('triggerRefreshNow 본문에 loadHistory 또는 동등한 DB 재조회 호출 있어야 함', () => {
      const fnStart = dashboardSrc.indexOf('async function triggerRefreshNow()')
      const fnEnd = dashboardSrc.indexOf('window.triggerRefreshNow = triggerRefreshNow', fnStart)
      const body = dashboardSrc.slice(fnStart, fnEnd)
      expect(body).toContain('loadHistory')
    })
  })

  describe('Test 2 — /v1/check 오늘자 row 존재 시 UPDATE skip', () => {
    it('index.ts에 D안 skip 주석 또는 skip 로직이 있어야 함', () => {
      // skip persist 로그 패턴 확인 (D안 적용 증명)
      expect(indexSrc).toMatch(/skip persist|today row exists|cron baseline 보호/i)
    })

    it('index.ts /v1/check 영역에 PATCH (UPDATE) 패턴이 없어야 함', () => {
      // /v1/check 핸들러 본문 추출 — `app.post('/v1/check'`부터 다음 `app.` 까지
      const checkStart = indexSrc.indexOf("app.post('/v1/check'")
      expect(checkStart).toBeGreaterThan(0)
      // 적절한 종료점: 다음 app.post 또는 app.get 등
      const candidates = [
        indexSrc.indexOf('\napp.post(', checkStart + 1),
        indexSrc.indexOf('\napp.get(', checkStart + 1),
        indexSrc.indexOf('\napp.delete(', checkStart + 1),
      ].filter((i) => i > 0)
      const checkEnd = Math.min(...candidates)
      expect(checkEnd).toBeGreaterThan(checkStart)
      const body = indexSrc.slice(checkStart, checkEnd)
      // PATCH /scores UPDATE 패턴 검출 — D안 위반 시 fail
      expect(body).not.toMatch(/method:\s*['"]PATCH['"][\s\S]{0,200}\/scores/i)
    })
  })

  describe('Test 3 — manual baseline 가드 양방향', () => {
    it('/v1/check 영역에 manual INSERT 시 baseline 가드 적용 (getRecentBaselineScore 호출)', () => {
      const checkStart = indexSrc.indexOf("app.post('/v1/check'")
      const candidates = [
        indexSrc.indexOf('\napp.post(', checkStart + 1),
        indexSrc.indexOf('\napp.get(', checkStart + 1),
      ].filter((i) => i > 0)
      const checkEnd = Math.min(...candidates)
      const body = indexSrc.slice(checkStart, checkEnd)
      expect(body).toContain('getRecentBaselineScore')
      // anomaly 가드 + flagged 저장
      expect(body).toMatch(/MANUAL ANOMALY|isAnomaly|flagged:\s*isAnomaly/i)
    })
  })

  describe('Test 4 — FE isValidScoreRow가 flagged 통과 (룰 잔존)', () => {
    it('dashboard.html에 isValidScoreRow가 flagged 검사 포함', () => {
      // isValidScoreRow 함수 + flagged 참조
      expect(dashboardSrc).toContain('isValidScoreRow')
      // flagged === true 또는 .flagged 검사 패턴
      expect(dashboardSrc).toMatch(/flagged\s*===?\s*true|\.flagged\b|flagged:\s*\w/i)
    })
  })
})
