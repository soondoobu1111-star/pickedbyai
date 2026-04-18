-- ============================================================
-- T5 D2 RETRY-01 + FALLBACK-01
-- domains 테이블에 retry_state, check_tier, Graceful Degradation 컬럼 추가
-- 1분 간격 × 5회 자동 재시도 + Tier 1~3 폴백 (CEO 승인 2026-04-18)
-- 실행: Supabase 대시보드 → SQL Editor → 스테이징 먼저, 프로덕션은 D11 승인 후
-- ============================================================

ALTER TABLE domains
  ADD COLUMN IF NOT EXISTS retry_state JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS check_tier TEXT NOT NULL DEFAULT 'tier_0',
  ADD COLUMN IF NOT EXISTS last_check_success_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consecutive_failures INTEGER NOT NULL DEFAULT 0;

-- retry_state JSONB 구조:
-- {
--   "attempt_count": 1~5,
--   "next_attempt_at": "2026-04-18T22:50:00Z",
--   "last_error": "Gemini timeout" | null,
--   "failed_engines": ["gemini", "perplexity"],
--   "enqueued_at": "2026-04-18T22:45:00Z"
-- }
-- retry_state IS NULL = 큐 밖 (성공 종료 또는 소진 종료)

-- check_tier 값:
-- tier_0 = 완전 성공 (모든 엔진 응답)
-- tier_1 = 부분 성공 (일부 엔진만) 또는 재시도 진행 중
-- tier_2 = 전체 실패, 전일 스냅샷 유지 (unified_v15 보존)
-- tier_3 = stale (3일 연속 실패, 장기 알람 필요)

-- due 도메인 빠른 조회용 (cron polling)
CREATE INDEX IF NOT EXISTS idx_domains_retry_due
  ON domains ((retry_state->>'next_attempt_at'))
  WHERE retry_state IS NOT NULL;

-- tier별 상태 조회
CREATE INDEX IF NOT EXISTS idx_domains_tier_status
  ON domains (check_tier, last_checked_at DESC)
  WHERE status = 'verified';

COMMENT ON COLUMN domains.retry_state IS 'T5 D2 RETRY-01 — 재시도 큐 상태 JSONB. null이면 큐 밖 (완료 or 소진). attempt_count 1~5, next_attempt_at 매 1분 후 예약.';
COMMENT ON COLUMN domains.check_tier IS 'T5 D2 FALLBACK-01 — tier_0(정상) | tier_1(부분/진행중) | tier_2(스냅샷 유지) | tier_3(stale).';
COMMENT ON COLUMN domains.last_check_success_at IS '마지막 성공 체크 시각 (tier_0 or tier_1). Tier 2 배너 "last check Xh ago" 근거.';
COMMENT ON COLUMN domains.consecutive_failures IS '연속 전체 실패 횟수. 3일 연속 = tier_3 자동 전환.';
