-- MLP-Slim 마이그레이션: scores 테이블에 dimensions + ai_probe 컬럼 추가
-- 실행: Supabase 대시보드 → SQL Editor → 붙여넣기 → Run
-- 날짜: 2026-04-10

ALTER TABLE scores ADD COLUMN IF NOT EXISTS dimensions JSONB;
ALTER TABLE scores ADD COLUMN IF NOT EXISTS ai_probe JSONB;

-- 인덱스 (추이 조회 성능)
CREATE INDEX IF NOT EXISTS idx_scores_user_product_date
  ON scores(user_id, product_name, created_at DESC);
