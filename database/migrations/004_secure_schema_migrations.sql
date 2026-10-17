-- ============================================================
-- 004 — Close public write access to schema_migrations
--
-- schema_migrations is created by ingestion/src/migrateUp.ts rather than by
-- schema.sql, so rls_policies.sql (which enumerates the app tables by name)
-- never covered it. That left it in the public schema with RLS off, which is
-- what Supabase's `rls_disabled_in_public` advisory flags — and, because
-- PostgREST exposes the public schema to the anon key embedded in the web
-- bundle, it was writable by anyone.
--
-- The rows themselves are not sensitive (migration filenames + timestamps).
-- The risk was integrity: migrateUp.ts skips any migration whose filename is
-- already present, so an inserted row would silently disable a future
-- migration, and deleting rows would force applied ones to re-run.
--
-- Nothing here grants access back: RLS with zero policies denies anon and
-- authenticated outright. The migration runner connects as the table owner,
-- which bypasses RLS, and service_role bypasses it too.
-- ============================================================

ALTER TABLE schema_migrations ENABLE ROW LEVEL SECURITY;

-- Belt and braces: also drop the API-role grants, so the table is not reachable
-- through PostgREST at all rather than merely returning empty result sets.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON schema_migrations FROM anon, authenticated;
  END IF;
END $$;
