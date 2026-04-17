-- ============================================================
-- user_events 테이블 신설
-- 빅파이 1.5 Phase 2 · Day 1 DB-MIG-01
-- 목적: Journey Timeline + Milestones + Streak + Movement Feed 데이터 모트
-- 실행: Supabase 대시보드 → SQL Editor → 붙여넣기 → Run
-- 날짜: 2026-04-17 밤
-- 대상 DB: 스테이징 xzecybljfipmmzzzfnit (프로덕션은 CEO 승인 후 별도)
-- ============================================================

-- ── 1. 테이블 생성 ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_events (
  -- PK: UUID v4 자동 생성
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- scores.user_id와 동일 체계 (Supabase auth user id)
  user_id       TEXT NOT NULL,

  -- 대상 제품명 (scores.product_name과 동일 체계)
  product_name  TEXT NOT NULL,

  -- 이벤트 타입 (Milestone 10종 + 기타)
  --   'first_check'           : 최초 체크
  --   'first_tier1_source'    : Tier-1 소스 최초 발견
  --   'first_tier2_source'    : Tier-2 소스 최초 발견
  --   'emerging_reached'      : Emerging 진입 (Score 40+)
  --   'strong_reached'        : Strong 진입 (Score 60+)
  --   'picked_reached'        : Picked 진입 (Score 80+)
  --   'perplexity_recognized' : Perplexity 최초 인지
  --   'gemini_recognized'     : Gemini 최초 인지
  --   'category_ranked'       : 카테고리 랭킹 진입 (Top 10)
  --   'co_mention_peer_5'     : 공동 언급 제품 5개 누적
  --   'score_delta'           : 주 단위 점수 변화 (Narrative 용)
  --   'check_run'             : 일반 체크 실행 (Streak 계산용)
  event_type    TEXT NOT NULL,

  -- 이벤트별 부가 데이터 (JSONB)
  -- 예: { "score": 45, "prev_score": 32, "dim": "Category Ranking", "value": 12 }
  -- 예: { "ai": "perplexity", "grade": "C" }
  event_data    JSONB DEFAULT '{}'::JSONB,

  -- 발생 시각 (Timeline 정렬 기준)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. 인덱스 ────────────────────────────────────────────────

-- Timeline/Feed 조회: user_id + product_name + created_at DESC
CREATE INDEX IF NOT EXISTS idx_user_events_product_ts
  ON user_events (user_id, product_name, created_at DESC);

-- Milestone 중복 방지 조회: user_id + product_name + event_type
CREATE INDEX IF NOT EXISTS idx_user_events_milestone
  ON user_events (user_id, product_name, event_type);

-- Streak 계산: user_id + created_at (시간 범위 스캔)
CREATE INDEX IF NOT EXISTS idx_user_events_user_ts
  ON user_events (user_id, created_at DESC);

-- ── 3. RLS (Row Level Security) ──────────────────────────────

-- scores 테이블과 동일 패턴 (사용자별 접근 제한)
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- 본인 이벤트만 SELECT 가능
DROP POLICY IF EXISTS user_events_select_own ON user_events;
CREATE POLICY user_events_select_own ON user_events
  FOR SELECT
  USING (auth.uid()::TEXT = user_id);

-- 본인 이벤트만 INSERT 가능 (Worker는 service key로 bypass)
DROP POLICY IF EXISTS user_events_insert_own ON user_events;
CREATE POLICY user_events_insert_own ON user_events
  FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

-- ── 4. 검증 쿼리 ──────────────────────────────────────────────
-- 실행 후 아래로 확인:
--   SELECT table_name FROM information_schema.tables WHERE table_name='user_events';
--   결과: user_events
--   SELECT COUNT(*) FROM user_events;
--   결과: 0

-- ── 5. 롤백 SQL ──────────────────────────────────────────────
-- DROP TABLE IF EXISTS user_events;

-- ── 6. 설계 주석 ──────────────────────────────────────────────
-- Why JSONB event_data?
--   Milestone 종류마다 필요한 메타데이터가 다름. 스키마 자주 변경되므로 JSONB로 확장성 확보.
--
-- Why TEXT user_id (not UUID)?
--   기존 scores/probe_logs 테이블과 동일 체계 유지 (Supabase auth uid는 UUID지만 TEXT로 저장).
--
-- 중복 방지 전략:
--   Milestone INSERT 전 SELECT (user_id, product_name, event_type) LIMIT 1 확인 → 없으면 INSERT.
--   DB unique constraint 대신 애플리케이션 레벨에서 관리 (event_type별 멱등성 규칙이 다르므로).
