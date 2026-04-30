-- ─────────────────────────────────────────────────────────────
-- Migration: security_invoker_views_20260430.sql
-- Purpose:   Supabase Security Advisor CRITICAL 3건 영구 해결
-- Trigger:   2026-04-30 CEO 지적 — Security Definer View 3건
-- Approval:  CEO 승인 2026-04-30 21:xx KST (Production DB 직접 적용)
-- Status:    PRODUCTION 적용 완료. 본 파일은 미래 재구축 시 동일 결함 재발 방지용.
-- ─────────────────────────────────────────────────────────────
--
-- 배경:
--   `score_snapshots_schema.sql`에서 정의된 3개 view가 PostgreSQL 기본값
--   `SECURITY DEFINER`로 생성되어 view 소유자(postgres) 권한으로 쿼리가
--   실행됨 → 호출자의 RLS 정책이 우회되는 구조적 결함.
--
-- 해결:
--   `security_invoker = true` 옵션으로 변경 → view 호출자(인증된 user_id)
--   기준으로 RLS가 적용되도록 강제.
--
-- 영향 분석 (2026-04-30 검증):
--   - API 코드(api/src/*.ts) 호출 0건
--   - FE 코드(landing/*.html) 호출 0건
--   - 마이그레이션 정의(score_snapshots_schema.sql)에서만 참조
--   → functional regression 없음 확인 완료.
--
-- 롤백:
--   ALTER VIEW <name> SET (security_invoker = false);
--   (단, 보안 결함 복귀이므로 권장하지 않음)
-- ─────────────────────────────────────────────────────────────

ALTER VIEW public.v_snapshots_daily_14   SET (security_invoker = true);
ALTER VIEW public.v_snapshots_weekly_12  SET (security_invoker = true);
ALTER VIEW public.v_snapshots_monthly_12 SET (security_invoker = true);

-- ─────────────────────────────────────────────────────────────
-- 검증 쿼리 — 3 rows 모두 (security_invoker,true) 반환되어야 함
-- ─────────────────────────────────────────────────────────────
SELECT schemaname, viewname,
       pg_options_to_table(reloptions) AS opts
  FROM pg_views v
  JOIN pg_class c ON c.relname = v.viewname
 WHERE viewname LIKE 'v_snapshots_%';

-- ─────────────────────────────────────────────────────────────
-- 검증 결과 (2026-04-30 적용 후):
--   public | v_snapshots_daily_14   | (security_invoker,true)
--   public | v_snapshots_weekly_12  | (security_invoker,true)
--   public | v_snapshots_monthly_12 | (security_invoker,true)
-- 3 rows
--
-- Security Advisor: CRITICAL 3건 → 0건 (CEO 새로고침 캡쳐 검증 완료)
-- ─────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────
-- 후속 작업 (별도 세션):
--   Auth RLS Initialization Plan WARNING 다수 (성능 이슈)
--   대상: scores · probe_logs · beta_signups · user_events ·
--         domains · score_snapshots
--   조치: USING/WITH CHECK 표현식의 auth.uid() →
--        (SELECT auth.uid()) 으로 감싸 plan-time 캐싱 활용.
--   우선순위: W2 런칭 윈도우(05-08~14) 트래픽 급증 대비 권장.
-- ─────────────────────────────────────────────────────────────
