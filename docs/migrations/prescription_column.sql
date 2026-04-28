-- ============================================================
-- scores.prescription JSONB column 추가
-- 빅파이 1.6 Phase 2a · PRESCRIPTION-02 영속화 보강
-- 실행: Supabase 대시보드 → SQL Editor → 붙여넣기 → Run
-- 날짜: 2026-04-28
-- 대상 DB: 스테이징 xzecybljfipmmzzzfnit 우선 (프로덕션은 CEO 승인 후 별도 실행)
-- 배경: PRESCRIPTION-02(2026-04-27)가 응답 필드만 추가하고 DB 컬럼을 누락.
--       Fresh check 후에도 페이지 새로고침/재진입 시 prescription이 사라지는 버그 근본 원인.
-- ============================================================

-- ── 1. column 추가 (nullable, JSONB) ─────────────────────────

ALTER TABLE scores
  ADD COLUMN IF NOT EXISTS prescription JSONB;

COMMENT ON COLUMN scores.prescription IS
  '빅파이 1.6 처방 엔진 결과 스냅샷 (PrescriptionResult). structure: { overall{level, summary, gap{currentLevel, currentScore, nextLevel, nextThreshold, pointsNeeded, dimensionGaps[]}}, diagnoses[4], prescriptions[3], allActions[], benchmark{category, yourRank, leaders[]}, generatedAt }. null = 레거시 row (PRESCRIPTION-02 영속화 이전).';

-- ── 2. 인덱스 (옵션) ──────────────────────────────────────────
-- GIN index는 JSONB path 쿼리 빈번하면 추가. 현재 Actions 페인은 단순 SELECT * 후 in-memory 처리 → 생략.
-- 향후 처방 효과 분석(EFFECT-01)에서 level/dimension별 집계 시 검토:
-- CREATE INDEX IF NOT EXISTS idx_scores_prescription_level ON scores ((prescription->'overall'->>'level'));

-- ── 3. 검증 쿼리 ──────────────────────────────────────────────
-- 실행 후 아래로 확인:
--   SELECT column_name, data_type FROM information_schema.columns
--     WHERE table_name='scores' AND column_name='prescription';
-- 결과: prescription | jsonb

-- ── 4. 롤백 SQL ──────────────────────────────────────────────
-- ALTER TABLE scores DROP COLUMN IF EXISTS prescription;
