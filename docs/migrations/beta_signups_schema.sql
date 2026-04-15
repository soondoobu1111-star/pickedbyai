-- Migration: beta_signups table
-- Run in Supabase SQL editor (production + staging)
-- 2026-04-15

CREATE TABLE IF NOT EXISTS public.beta_signups (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text        NOT NULL,
  terms_agreed_at timestamptz,
  joined_at       timestamptz,
  opted_out_at    timestamptz,
  created_at      timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS beta_signups_user_id_idx ON public.beta_signups(user_id);

ALTER TABLE public.beta_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own beta signup"
  ON public.beta_signups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own beta signup"
  ON public.beta_signups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own beta signup"
  ON public.beta_signups FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can read all (for count queries in CF Workers)
-- No extra policy needed: service key bypasses RLS automatically
