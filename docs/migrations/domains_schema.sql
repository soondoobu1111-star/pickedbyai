-- ============================================================
-- domains 테이블 스키마 마이그레이션
-- 도메인 소유자 인증 플로우 (구글 서치콘솔 모델)
-- 실행: Supabase 대시보드 → SQL Editor → 붙여넣기 → Run
-- 날짜: 2026-04-15
-- ============================================================

-- ── 1. 테이블 생성 ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS domains (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 소유자 (auth.users와 연결)
  user_id              UUID NOT NULL,

  -- 제품명 및 URL
  product_name         TEXT NOT NULL,
  domain_url           TEXT NOT NULL,         -- 정규화: https://notion.so

  -- 소유자 인증 토큰 (pba-{random 16 hex chars})
  verification_token   TEXT NOT NULL UNIQUE,

  -- 인증 상태
  -- pending: 등록 완료, 인증 대기
  -- verified: 인증 완료
  -- failed: 인증 실패
  -- unverified: 토큰 사라짐 (재확인 필요)
  status               TEXT NOT NULL DEFAULT 'pending',

  -- 설치 현황
  sdk_installed        BOOLEAN NOT NULL DEFAULT FALSE,
  llms_installed       BOOLEAN NOT NULL DEFAULT FALSE,

  -- 타임스탬프
  verified_at          TIMESTAMPTZ,
  last_checked_at      TIMESTAMPTZ,           -- 상시 토큰 체크 기록
  created_at           TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ── 2. 인덱스 ───────────────────────────────────────────────

-- 사용자별 도메인 목록
CREATE INDEX IF NOT EXISTS idx_domains_user_id
  ON domains (user_id, created_at DESC);

-- URL 기준 조회 (소유자 확인 시)
CREATE INDEX IF NOT EXISTS idx_domains_url
  ON domains (domain_url);

-- 상태별 필터 (cron: verified 도메인만 체크)
CREATE INDEX IF NOT EXISTS idx_domains_status
  ON domains (status);

-- ── 3. RLS 정책 ─────────────────────────────────────────────

ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

-- Service Role: 전체 CRUD (API Worker)
DROP POLICY IF EXISTS "service_role_full_access" ON domains;
CREATE POLICY "service_role_full_access"
  ON domains
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated: 자기 도메인만 읽기/수정
DROP POLICY IF EXISTS "users_own_domains" ON domains;
CREATE POLICY "users_own_domains"
  ON domains
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── 4. 코멘트 ───────────────────────────────────────────────

COMMENT ON TABLE domains IS '소유자 인증 도메인 목록. Google Search Console 모델.';
COMMENT ON COLUMN domains.verification_token IS '소유자 확인용 고유 토큰. 메타태그 또는 JSON 파일에 삽입.';
COMMENT ON COLUMN domains.status IS 'pending|verified|failed|unverified. 토큰 제거 시 unverified로 전환.';
COMMENT ON COLUMN domains.last_checked_at IS '토큰 상시 체크 마지막 실행 시각. 구글 서치콘솔 정책 준수.';
