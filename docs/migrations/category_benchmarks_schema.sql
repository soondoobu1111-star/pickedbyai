-- ============================================================
-- category_benchmarks 테이블 + 5×5 시딩
-- 빅파이 1.5.1 · D1 DB-MIG-01
-- 목적: 신규 가입자 빈 화면 방지 / Overview 카테고리 벤치마크 섹션 데이터 소스
-- 실행: Supabase 대시보드 → SQL Editor → 붙여넣기 → Run
-- 날짜: 2026-04-18
-- 대상 DB: 스테이징 xzecybljfipmmzzzfnit (프로덕션은 CEO 승인 후 별도)
-- ⚠️ 점수: PROBE-REDESIGN-01 전 추정값. ANCHOR-VERIFY-01 완료 후 UPDATE 예정.
-- ============================================================

-- ── 1. 테이블 생성 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS category_benchmarks (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 카테고리 (Overview 필터 기준)
  category        TEXT NOT NULL,

  -- 제품명 (scores.product_name 체계와 동일)
  product_name    TEXT NOT NULL,

  -- 4차원 점수 (UnifiedScore 구조와 동일)
  score           NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  dim_recognition NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (dim_recognition >= 0 AND dim_recognition <= 35),
  dim_category    NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (dim_category >= 0 AND dim_category <= 35),
  dim_corec       NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (dim_corec >= 0 AND dim_corec <= 20),
  dim_web         NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (dim_web >= 0 AND dim_web <= 10),

  -- 'perfect' | 'strong' | 'emerging' | 'invisible'
  pass_indicator  TEXT NOT NULL DEFAULT 'invisible',

  -- 데이터 신뢰도 메타
  -- 'estimated' | 'measured' | 'anchor_verified'
  data_quality    TEXT NOT NULL DEFAULT 'estimated',

  -- 측정 방식 버전
  methodology_version TEXT NOT NULL DEFAULT '1.5.0',

  -- 업데이트 날짜 (ANCHOR-VERIFY-01 후 갱신)
  last_updated    DATE NOT NULL DEFAULT CURRENT_DATE,

  -- 중복 방지
  UNIQUE(category, product_name)
);

-- ── 2. 인덱스 ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cat_bench_category
  ON category_benchmarks (category, score DESC);

-- ── 3. RLS ─────────────────────────────────────────────────
-- 벤치마크는 공개 데이터 → 모든 유저 읽기 허용
ALTER TABLE category_benchmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cat_bench_public_read ON category_benchmarks;
CREATE POLICY cat_bench_public_read ON category_benchmarks
  FOR SELECT
  USING (true);

-- Service Role: 전체 CRUD (업데이트 용)
DROP POLICY IF EXISTS cat_bench_service_write ON category_benchmarks;
CREATE POLICY cat_bench_service_write ON category_benchmarks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── 4. 5×5 시딩 (추정값 — ANCHOR-VERIFY-01 후 업데이트) ────
-- 카테고리 1: Productivity Tools
INSERT INTO category_benchmarks
  (category, product_name, score, dim_recognition, dim_category, dim_corec, dim_web, pass_indicator, data_quality)
VALUES
  ('productivity', 'Notion',    85.0, 30.0, 33.0, 14.0, 8.0, 'perfect',   'estimated'),
  ('productivity', 'Obsidian',  62.0, 22.0, 22.0, 11.0, 7.0, 'strong',    'estimated'),
  ('productivity', 'Todoist',   58.0, 20.0, 22.0, 10.0, 6.0, 'strong',    'estimated'),
  ('productivity', 'Asana',     55.0, 20.0, 20.0, 10.0, 5.0, 'strong',    'estimated'),
  ('productivity', 'ClickUp',   50.0, 18.0, 18.0,  9.0, 5.0, 'emerging',  'estimated')
ON CONFLICT (category, product_name) DO UPDATE
  SET score = EXCLUDED.score,
      dim_recognition = EXCLUDED.dim_recognition,
      dim_category = EXCLUDED.dim_category,
      dim_corec = EXCLUDED.dim_corec,
      dim_web = EXCLUDED.dim_web,
      pass_indicator = EXCLUDED.pass_indicator,
      last_updated = CURRENT_DATE;

-- 카테고리 2: Design Tools
INSERT INTO category_benchmarks
  (category, product_name, score, dim_recognition, dim_category, dim_corec, dim_web, pass_indicator, data_quality)
VALUES
  ('design', 'Figma',       92.0, 33.0, 35.0, 16.0, 8.0, 'perfect',  'estimated'),
  ('design', 'Canva',       80.0, 28.0, 30.0, 14.0, 8.0, 'perfect',  'estimated'),
  ('design', 'Framer',      60.0, 22.0, 22.0, 10.0, 6.0, 'strong',   'estimated'),
  ('design', 'Sketch',      52.0, 20.0, 18.0,  9.0, 5.0, 'emerging', 'estimated'),
  ('design', 'Adobe XD',    48.0, 18.0, 17.0,  8.0, 5.0, 'emerging', 'estimated')
ON CONFLICT (category, product_name) DO UPDATE
  SET score = EXCLUDED.score,
      dim_recognition = EXCLUDED.dim_recognition,
      dim_category = EXCLUDED.dim_category,
      dim_corec = EXCLUDED.dim_corec,
      dim_web = EXCLUDED.dim_web,
      pass_indicator = EXCLUDED.pass_indicator,
      last_updated = CURRENT_DATE;

-- 카테고리 3: Developer Tools
INSERT INTO category_benchmarks
  (category, product_name, score, dim_recognition, dim_category, dim_corec, dim_web, pass_indicator, data_quality)
VALUES
  ('developer-tools', 'GitHub',    95.0, 35.0, 35.0, 18.0, 7.0, 'perfect',  'estimated'),
  ('developer-tools', 'Vercel',    82.0, 30.0, 30.0, 15.0, 7.0, 'perfect',  'estimated'),
  ('developer-tools', 'Supabase',  72.0, 26.0, 26.0, 13.0, 7.0, 'strong',   'estimated'),
  ('developer-tools', 'Linear',    68.0, 24.0, 26.0, 12.0, 6.0, 'strong',   'estimated'),
  ('developer-tools', 'Railway',   55.0, 20.0, 20.0, 10.0, 5.0, 'emerging', 'estimated')
ON CONFLICT (category, product_name) DO UPDATE
  SET score = EXCLUDED.score,
      dim_recognition = EXCLUDED.dim_recognition,
      dim_category = EXCLUDED.dim_category,
      dim_corec = EXCLUDED.dim_corec,
      dim_web = EXCLUDED.dim_web,
      pass_indicator = EXCLUDED.pass_indicator,
      last_updated = CURRENT_DATE;

-- 카테고리 4: Marketing Tools
INSERT INTO category_benchmarks
  (category, product_name, score, dim_recognition, dim_category, dim_corec, dim_web, pass_indicator, data_quality)
VALUES
  ('marketing', 'HubSpot',     88.0, 32.0, 33.0, 15.0, 8.0, 'perfect',  'estimated'),
  ('marketing', 'Mailchimp',   80.0, 29.0, 30.0, 14.0, 7.0, 'perfect',  'estimated'),
  ('marketing', 'ConvertKit',  65.0, 24.0, 24.0, 11.0, 6.0, 'strong',   'estimated'),
  ('marketing', 'Buffer',      60.0, 22.0, 22.0, 10.0, 6.0, 'strong',   'estimated'),
  ('marketing', 'Beehiiv',     48.0, 17.0, 18.0,  8.0, 5.0, 'emerging', 'estimated')
ON CONFLICT (category, product_name) DO UPDATE
  SET score = EXCLUDED.score,
      dim_recognition = EXCLUDED.dim_recognition,
      dim_category = EXCLUDED.dim_category,
      dim_corec = EXCLUDED.dim_corec,
      dim_web = EXCLUDED.dim_web,
      pass_indicator = EXCLUDED.pass_indicator,
      last_updated = CURRENT_DATE;

-- 카테고리 5: Analytics Tools
INSERT INTO category_benchmarks
  (category, product_name, score, dim_recognition, dim_category, dim_corec, dim_web, pass_indicator, data_quality)
VALUES
  ('analytics', 'Google Analytics', 95.0, 35.0, 35.0, 18.0, 7.0, 'perfect',  'estimated'),
  ('analytics', 'Mixpanel',         78.0, 28.0, 28.0, 15.0, 7.0, 'perfect',  'estimated'),
  ('analytics', 'Amplitude',        72.0, 26.0, 26.0, 13.0, 7.0, 'strong',   'estimated'),
  ('analytics', 'Hotjar',           65.0, 24.0, 23.0, 12.0, 6.0, 'strong',   'estimated'),
  ('analytics', 'PostHog',          60.0, 22.0, 22.0, 10.0, 6.0, 'strong',   'estimated')
ON CONFLICT (category, product_name) DO UPDATE
  SET score = EXCLUDED.score,
      dim_recognition = EXCLUDED.dim_recognition,
      dim_category = EXCLUDED.dim_category,
      dim_corec = EXCLUDED.dim_corec,
      dim_web = EXCLUDED.dim_web,
      pass_indicator = EXCLUDED.pass_indicator,
      last_updated = CURRENT_DATE;

-- ── 5. 검증 쿼리 ──────────────────────────────────────────────
-- 실행 후 확인:
--   SELECT category, COUNT(*) FROM category_benchmarks GROUP BY category ORDER BY category;
--   결과: 5개 카테고리 × 5건 = 25건
--
--   SELECT product_name, score, dim_recognition+dim_category+dim_corec+dim_web AS sum_check
--   FROM category_benchmarks WHERE ABS(score - (dim_recognition+dim_category+dim_corec+dim_web)) > 0.1;
--   결과: 0건 (수학적 일관성 검증)

-- ── 6. 롤백 SQL ──────────────────────────────────────────────
-- DROP TABLE IF EXISTS category_benchmarks;

-- ── 7. ANCHOR-VERIFY-01 이후 업데이트 방법 ───────────────────
-- UPDATE category_benchmarks
--   SET score=<실측값>, dim_recognition=<실측>, dim_category=<실측>,
--       dim_corec=<실측>, dim_web=<실측>, pass_indicator=<실측>,
--       data_quality='anchor_verified', last_updated=CURRENT_DATE
--   WHERE category='<카테고리>' AND product_name='<제품명>';
