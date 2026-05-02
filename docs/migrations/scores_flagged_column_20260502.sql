-- BUG-SCORE-CONSISTENCY-01 fix (2026-05-02)
-- 배경: 05-01 cron이 score=5 anomaly row 저장 → 05-02 CEO 대시보드에서 5점 표시 (실제 baseline 45)
-- 해결: scores 테이블에 flagged 컬럼 추가. cron이 baseline 대비 anomaly 감지 시 true로 저장.
-- FE는 flagged=true row 제외하고 representative score 산출.

-- Step 1: flagged 컬럼 추가 (idempotent)
ALTER TABLE scores
  ADD COLUMN IF NOT EXISTS flagged BOOLEAN NOT NULL DEFAULT FALSE;

-- Step 2: 인덱스 (FE 쿼리 성능 — flagged=false만 빠르게 가져오기)
CREATE INDEX IF NOT EXISTS scores_flagged_idx ON scores(flagged) WHERE flagged = TRUE;

-- Step 3: 기존 anomaly row 백필 — 알려진 케이스 (05-01 pickedby.ai score=5)
-- 일반적으로 baseline 45 → score 5는 baseline * 0.11 = 11% (30% 미만이므로 anomaly)
UPDATE scores
SET flagged = TRUE
WHERE id IN (
  -- 직접 식별: 05-01 pickedby.ai score=5
  SELECT s.id
  FROM scores s
  WHERE s.product_name = 'pickedby.ai'
    AND s.score < 10
    AND DATE(s.created_at) BETWEEN '2026-05-01' AND '2026-05-02'
);

-- Step 4: 검증 쿼리 (실행 후 결과 캡처용)
-- SELECT id, product_name, score, flagged, created_at
-- FROM scores
-- WHERE product_name = 'pickedby.ai'
-- ORDER BY created_at DESC
-- LIMIT 10;
--
-- Expected: flagged=TRUE for the 05-01 score=5 row, FALSE for others.

-- Step 5: 영구 정착 — 향후 모든 score INSERT는 flagged 명시 권장
-- (BE cron + /v1/check 모두 baseline anomaly 감지 후 flagged 설정)

COMMENT ON COLUMN scores.flagged IS 'TRUE if score is anomaly (cron baseline guard failed). FE excludes from representative score selection. See: api/src/index.ts cron handler, dashboard.html isValidScoreRow().';
