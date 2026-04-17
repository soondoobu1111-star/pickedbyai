-- ============================================================
-- scores.unified_v15 JSONB column 추가
-- 빅파이 1.5 Phase 2 · Day 1 DB-MIG-01
-- 실행: Supabase 대시보드 → SQL Editor → 붙여넣기 → Run
-- 날짜: 2026-04-17 밤
-- 대상 DB: 스테이징 xzecybljfipmmzzzfnit (프로덕션은 CEO 승인 후 별도)
-- ============================================================

-- ── 1. column 추가 (nullable, JSONB) ─────────────────────────

ALTER TABLE scores
  ADD COLUMN IF NOT EXISTS unified_v15 JSONB;

COMMENT ON COLUMN scores.unified_v15 IS
  '빅파이 1.5 4차원 통합 스코어 스냅샷. structure: { score, dimensions[4], insights{daily_pulse, top_issue}, pass_indicator, quadrant, engine_grades[], plan_version }. null = 레거시 row (V15 플래그 off 시점)';

-- ── 2. 인덱스 (옵션) ──────────────────────────────────────────
-- GIN index는 JSONB path 쿼리 빈번하면 추가. 현재는 단순 SELECT만 → 생략.
-- 필요 시 후속 마이그레이션으로 추가:
-- CREATE INDEX IF NOT EXISTS idx_scores_unified_pass_indicator ON scores ((unified_v15->>'pass_indicator'));

-- ── 3. 검증 쿼리 ──────────────────────────────────────────────
-- 실행 후 아래로 확인:
--   SELECT column_name, data_type FROM information_schema.columns
--     WHERE table_name='scores' AND column_name='unified_v15';
-- 결과: unified_v15 | jsonb

-- ── 4. 롤백 SQL ──────────────────────────────────────────────
-- ALTER TABLE scores DROP COLUMN IF EXISTS unified_v15;
