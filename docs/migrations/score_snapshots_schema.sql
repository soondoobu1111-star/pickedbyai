-- ============================================================
-- score_snapshots 테이블 스키마 마이그레이션
-- SCORE-UNIFY-02: 일간 점수 이력 보장 (빅파이 1.5 Phase 1)
-- 용도: 3탭 차트(Daily/Weekly/Monthly), Movement Feed, Streak 시스템 데이터 소스
-- 실행: Supabase 대시보드 → SQL Editor → 붙여넣기 → Run
-- 날짜: 2026-04-17
-- ============================================================

-- ── 1. 테이블 생성 ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS score_snapshots (
  -- PK
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 제품 식별자 (probe_logs.product_id 와 동일 체계)
  product_id    TEXT NOT NULL,

  -- 유저 식별자 (nullable — 익명 체크도 가능하지만 일반적으론 user 연결)
  user_id       TEXT,

  -- 제품 URL (중복 저장 — 조인 없이 단독 조회 가능)
  product_url   TEXT,

  -- ── 점수 필드 (4차원 + 최종) ────────────────────────────
  -- 수학적 보장: dim_* 4개 합 === score (UnifiedScoreResult §4)
  score              NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  dim_recognition    NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (dim_recognition >= 0 AND dim_recognition <= 35),
  dim_category       NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (dim_category >= 0 AND dim_category <= 35),
  dim_corec          NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (dim_corec >= 0 AND dim_corec <= 20),
  dim_web            NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (dim_web >= 0 AND dim_web <= 10),

  -- ── 보조 지표 ──────────────────────────────────────────
  -- 'perfect' | 'strong' | 'emerging' | 'invisible'
  pass_indicator     TEXT NOT NULL DEFAULT 'invisible',

  -- 'Leader' | 'Niche' | 'Challenger' | 'Invisible'
  quadrant_label     TEXT NOT NULL DEFAULT 'Invisible',

  -- ── 엔진 상태 ──────────────────────────────────────────
  -- 'known' | 'recommended' | 'unknown' | 'error' | 'not_measured'
  gemini_status      TEXT DEFAULT 'not_measured',
  perplexity_status  TEXT DEFAULT 'not_measured',

  -- ── 메타 ────────────────────────────────────────────────
  methodology_version TEXT NOT NULL DEFAULT '1.5.0',

  -- 전체 UnifiedScoreResult JSON 아카이브 (복원 및 디버깅)
  raw_result         JSONB DEFAULT '{}'::JSONB,

  -- 어떤 트리거로 생성됐는지
  -- 'manual' | 'cron_daily' | 'migration_backfill' | 'test'
  trigger_type       TEXT NOT NULL DEFAULT 'cron_daily',

  -- 날짜 (일별 UNIQUE 키 — 하루 한 번 스냅샷)
  snapshot_date      DATE NOT NULL DEFAULT CURRENT_DATE,

  -- 생성 타임스탬프
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. 인덱스 ──────────────────────────────────────────────

-- 일별 UNIQUE: 동일 제품 동일 날짜 중복 방지
CREATE UNIQUE INDEX IF NOT EXISTS idx_snapshots_product_date
  ON score_snapshots(product_id, snapshot_date);

-- 최근 조회 (차트용 시간순 정렬)
CREATE INDEX IF NOT EXISTS idx_snapshots_product_time
  ON score_snapshots(product_id, created_at DESC);

-- 유저별 조회 (대시보드 My Products)
CREATE INDEX IF NOT EXISTS idx_snapshots_user
  ON score_snapshots(user_id) WHERE user_id IS NOT NULL;

-- 트리거 타입별 분석 (cron vs manual 구분)
CREATE INDEX IF NOT EXISTS idx_snapshots_trigger
  ON score_snapshots(trigger_type, created_at DESC);

-- ── 3. RLS (Row Level Security) ────────────────────────────
-- Supabase 기본 정책 — 유저는 본인 레코드만 조회. SERVICE_KEY는 전체 접근.

ALTER TABLE score_snapshots ENABLE ROW LEVEL SECURITY;

-- 본인 user_id 레코드만 읽기 (anon/authenticated 유저)
DROP POLICY IF EXISTS score_snapshots_user_read ON score_snapshots;
CREATE POLICY score_snapshots_user_read
  ON score_snapshots FOR SELECT
  USING (user_id = current_setting('request.jwt.claim.sub', true));

-- ── 4. 뷰 — 차트용 편의 뷰 ─────────────────────────────────
-- 보안 정책 (2026-04-30 fix): 모든 view는 security_invoker=true 필수.
--   기본값 SECURITY DEFINER는 view 소유자(postgres) 권한으로 RLS 우회됨.
--   Supabase Security Advisor CRITICAL 경고 사유. 재구축 시에도 자동 적용.
--   상세: docs/migrations/security_invoker_views_20260430.sql

-- 최근 14일 일간 (Daily 탭)
CREATE OR REPLACE VIEW v_snapshots_daily_14 AS
SELECT product_id, user_id, snapshot_date, score,
       dim_recognition, dim_category, dim_corec, dim_web,
       pass_indicator, quadrant_label
FROM score_snapshots
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '14 days'
ORDER BY product_id, snapshot_date;
ALTER VIEW v_snapshots_daily_14 SET (security_invoker = true);

-- 최근 12주 주간 평균 (Weekly 탭)
CREATE OR REPLACE VIEW v_snapshots_weekly_12 AS
SELECT product_id, user_id,
       DATE_TRUNC('week', snapshot_date)::DATE AS week_start,
       AVG(score) AS avg_score,
       AVG(dim_recognition) AS avg_recognition,
       AVG(dim_category) AS avg_category,
       AVG(dim_corec) AS avg_corec,
       AVG(dim_web) AS avg_web,
       COUNT(*) AS sample_count
FROM score_snapshots
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY product_id, user_id, week_start
ORDER BY product_id, week_start;
ALTER VIEW v_snapshots_weekly_12 SET (security_invoker = true);

-- 최근 12개월 월간 평균 (Monthly 탭)
CREATE OR REPLACE VIEW v_snapshots_monthly_12 AS
SELECT product_id, user_id,
       DATE_TRUNC('month', snapshot_date)::DATE AS month_start,
       AVG(score) AS avg_score,
       AVG(dim_recognition) AS avg_recognition,
       AVG(dim_category) AS avg_category,
       AVG(dim_corec) AS avg_corec,
       AVG(dim_web) AS avg_web,
       COUNT(*) AS sample_count
FROM score_snapshots
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY product_id, user_id, month_start
ORDER BY product_id, month_start;
ALTER VIEW v_snapshots_monthly_12 SET (security_invoker = true);

-- ── 5. 수학적 무결성 트리거 ─────────────────────────────────
-- sum(dim_*) === score 검증. 위반 시 INSERT/UPDATE 거부.

CREATE OR REPLACE FUNCTION check_score_integrity()
RETURNS TRIGGER AS $$
DECLARE
  expected_score NUMERIC;
  diff NUMERIC;
BEGIN
  expected_score := NEW.dim_recognition + NEW.dim_category + NEW.dim_corec + NEW.dim_web;
  diff := ABS(expected_score - NEW.score);
  IF diff > 0.1 THEN
    RAISE EXCEPTION 'Score integrity violation: sum(dims)=% does not match score=% (diff=%)',
      expected_score, NEW.score, diff;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_score_integrity ON score_snapshots;
CREATE TRIGGER enforce_score_integrity
  BEFORE INSERT OR UPDATE ON score_snapshots
  FOR EACH ROW
  EXECUTE FUNCTION check_score_integrity();

-- ============================================================
-- 사용 예시:
--
-- INSERT INTO score_snapshots (
--   product_id, user_id, score,
--   dim_recognition, dim_category, dim_corec, dim_web,
--   pass_indicator, quadrant_label,
--   gemini_status, perplexity_status,
--   raw_result, trigger_type
-- ) VALUES (
--   'Notion', 'user_123', 85,
--   30, 30, 15, 10,     -- 합 = 85 ✓
--   'perfect', 'Leader',
--   'recommended', 'recommended',
--   '{"...full UnifiedScoreResult JSON..."}'::JSONB,
--   'cron_daily'
-- );
--
-- 차트 쿼리:
--   SELECT * FROM v_snapshots_daily_14 WHERE product_id = 'Notion';
--   SELECT * FROM v_snapshots_weekly_12 WHERE product_id = 'Notion';
--   SELECT * FROM v_snapshots_monthly_12 WHERE product_id = 'Notion';
-- ============================================================
