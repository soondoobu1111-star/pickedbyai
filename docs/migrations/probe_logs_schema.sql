-- ============================================================
-- probe_logs 테이블 스키마 마이그레이션
-- P1-02: Probe Log Database (Phase 2 Analytics 기초 자산)
-- 실행: Supabase 대시보드 → SQL Editor → 붙여넣기 → Run
-- 날짜: 2026-04-15
-- ============================================================

-- ── 1. 테이블 생성 ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS probe_logs (
  -- PK: UUID v4 자동 생성
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 어떤 제품을 검색했는지 (scores 테이블의 product_name과 동일 체계)
  product_id    TEXT NOT NULL,

  -- 어떤 질문 템플릿으로 쿼리했는지
  -- 예: 'product_knowledge', 'best_alternative_to', 'top_5_in_category'
  query_template TEXT NOT NULL,

  -- AI 소스 식별자
  -- 'perplexity' | 'gpt' | 'gemini' (향후 'claude', 'copilot' 등 확장)
  ai_source     TEXT NOT NULL,

  -- AI 응답 원문 (snippet이 아닌 전문 저장 — 분석 정밀도 확보)
  result_text   TEXT NOT NULL DEFAULT '',

  -- 추출된 순위 (nullable — 순위형 질문이 아닌 경우 NULL)
  -- 예: "3 best tools" 질문에서 2번째로 언급되면 2
  detected_rank INTEGER,

  -- 함께 추천된 제품들 (JSON array of strings)
  -- 예: ["Notion", "Airtable", "Coda"]
  -- Phase 2 경쟁사 벤치마크, Phase 3 광고 타겟팅 핵심 데이터
  co_recommendations JSONB DEFAULT '[]'::JSONB,

  -- AI가 제품을 인식했는지
  recognized    BOOLEAN NOT NULL DEFAULT FALSE,

  -- AI가 제품을 추천했는지
  recommended   BOOLEAN NOT NULL DEFAULT FALSE,

  -- Perplexity citation URLs (다른 AI는 빈 배열)
  citations     JSONB DEFAULT '[]'::JSONB,

  -- 어떤 user의 제품인지 (scores.user_id와 조인 가능)
  user_id       TEXT,

  -- 제품 URL (중복 저장 — 조인 없이 단독 조회 가능하도록)
  product_url   TEXT,

  -- 실행 컨텍스트: 'cron' (자동 일일 스캔) | 'manual' (사용자 대시보드 요청)
  trigger_type  TEXT NOT NULL DEFAULT 'cron',

  -- AI API 응답 시간 (ms) — 성능 모니터링 및 비용 최적화
  response_ms   INTEGER,

  -- AI 모델 버전 (예: 'sonar', 'gpt-4o-mini', 'gemini-2.0-flash')
  model_version TEXT,

  -- 생성 시각 (UTC, Supabase 기본 timezone)
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ── 2. 인덱스 ───────────────────────────────────────────────

-- 제품별 시계열 조회 (Dashboard: "내 제품의 AI 추천 추이")
CREATE INDEX IF NOT EXISTS idx_probe_logs_product_created
  ON probe_logs (product_id, created_at DESC);

-- AI 소스별 필터링 (Analytics: "Perplexity vs GPT 비교")
CREATE INDEX IF NOT EXISTS idx_probe_logs_ai_source_created
  ON probe_logs (ai_source, created_at DESC);

-- 사용자별 조회 (Dashboard: "내 모든 제품의 probe 이력")
CREATE INDEX IF NOT EXISTS idx_probe_logs_user_id
  ON probe_logs (user_id, created_at DESC);

-- query_template별 집계 (Analytics: "어떤 질문 유형에서 잘 추천되나")
CREATE INDEX IF NOT EXISTS idx_probe_logs_template
  ON probe_logs (query_template, created_at DESC);

-- co_recommendations GIN 인덱스 (Phase 2: "Notion이 함께 추천된 모든 로그")
CREATE INDEX IF NOT EXISTS idx_probe_logs_co_recs_gin
  ON probe_logs USING GIN (co_recommendations);

-- trigger_type 필터 (cron vs manual 분리 분석)
CREATE INDEX IF NOT EXISTS idx_probe_logs_trigger
  ON probe_logs (trigger_type, created_at DESC);

-- ── 3. RLS 정책 ─────────────────────────────────────────────

ALTER TABLE probe_logs ENABLE ROW LEVEL SECURITY;

-- Service Role: 전체 CRUD (API Worker가 service_key로 접근)
CREATE POLICY "service_role_full_access"
  ON probe_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Anon/Authenticated: 자기 데이터만 읽기 (Dashboard에서 anon_key 사용 시)
-- user_id가 JWT의 sub 클레임과 일치하는 행만 SELECT 가능
CREATE POLICY "users_read_own_logs"
  ON probe_logs
  FOR SELECT
  TO anon, authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::JSON->>'sub');

-- Anon/Authenticated: INSERT/UPDATE/DELETE 차단 (API Worker만 쓰기 가능)
-- (RLS 기본: 명시적 policy 없으면 차단)

-- ── 4. 코멘트 ───────────────────────────────────────────────

COMMENT ON TABLE probe_logs IS 'AI Probe 실행 로그. Phase 2 Analytics + Phase 3 Ads 기초 자산.';
COMMENT ON COLUMN probe_logs.product_id IS '제품 식별자. scores.product_name과 동일 값 사용.';
COMMENT ON COLUMN probe_logs.query_template IS '질문 템플릿 ID. 예: product_knowledge, best_in_category';
COMMENT ON COLUMN probe_logs.ai_source IS 'AI 서비스명: perplexity, gpt, gemini';
COMMENT ON COLUMN probe_logs.result_text IS 'AI 응답 전문. 분석 정밀도를 위해 snippet이 아닌 전체 저장.';
COMMENT ON COLUMN probe_logs.detected_rank IS '순위형 질문에서 추출된 순위. NULL=순위 질문 아님 또는 미포함.';
COMMENT ON COLUMN probe_logs.co_recommendations IS '함께 추천된 제품 목록 (JSON string array). 경쟁사 벤치마크 핵심.';
COMMENT ON COLUMN probe_logs.recognized IS 'AI가 제품을 인식했는지 여부.';
COMMENT ON COLUMN probe_logs.recommended IS 'AI가 제품을 추천했는지 여부.';
COMMENT ON COLUMN probe_logs.citations IS 'AI 응답의 인용 URL 목록 (Perplexity 전용).';
COMMENT ON COLUMN probe_logs.trigger_type IS '실행 트리거: cron(자동) / manual(사용자 요청)';
COMMENT ON COLUMN probe_logs.response_ms IS 'AI API 응답 시간(ms). 성능 모니터링용.';
COMMENT ON COLUMN probe_logs.model_version IS '사용된 AI 모델 버전. 예: sonar, gpt-4o-mini';
