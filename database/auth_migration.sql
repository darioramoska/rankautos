-- ============================================================
-- RankAutos — Auth migration
-- Run this AFTER schema.sql and rls_policies.sql, in the same Supabase
-- SQL Editor. Safe to run once against a fresh project (public.users has
-- zero rows at this point — nobody has signed up yet).
--
-- What this does:
--  1. Ties public.users.id to Supabase Auth's auth.users.id instead of
--     generating its own independent UUID, so a profile row always
--     corresponds 1:1 with a real authenticated account.
--  2. Adds a trigger that auto-creates the public.users row the moment
--     someone signs up via supabase.auth.signUp() (web or mobile) —
--     app code never inserts into public.users directly.
--  3. Adds RLS policies so a signed-in user can read/update only their
--     own profile and saved searches. Nobody else's data is exposed
--     (previously users/saved_searches had RLS enabled but zero
--     policies, i.e. nobody except service_role could read/write at
--     all — this replaces that hard lock with real per-user access).
-- ============================================================

-- 1. Tie public.users.id to auth.users.id
ALTER TABLE users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE users
  ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Auto-create a public.users row on signup.
-- gdpr_consent/display_name come from the metadata the client passes to
-- supabase.auth.signUp({ options: { data: { ... } } }) — see
-- web/src/lib/auth/AuthProvider.tsx and mobile/src/lib/auth/AuthProvider.tsx.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, gdpr_consent, gdpr_date)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'gdpr_consent')::boolean, false),
    CASE WHEN COALESCE((NEW.raw_user_meta_data->>'gdpr_consent')::boolean, false) THEN NOW() ELSE NULL END
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. RLS: a user can see and edit only their own profile.
CREATE POLICY "select own profile" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "update own profile" ON users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- RLS: a user can fully manage only their own saved searches.
CREATE POLICY "select own saved searches" ON saved_searches
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own saved searches" ON saved_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own saved searches" ON saved_searches
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own saved searches" ON saved_searches
  FOR DELETE USING (auth.uid() = user_id);
