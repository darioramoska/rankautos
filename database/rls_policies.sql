-- ============================================================
-- RankAutos — Row Level Security policies
-- Run this AFTER schema.sql, in the same Supabase SQL Editor.
--
-- Model: the anon key is embedded in the public web app bundle, so it must
-- only ever be able to read data -- never write. All writes (ingestion,
-- scoring updates) go through ingestion/'s SUPABASE_SERVICE_ROLE_KEY, which
-- bypasses RLS entirely by design and is never exposed to a browser.
--
-- Tables not covered by a SELECT policy below (users, saved_searches,
-- scrape_jobs) get RLS enabled with zero policies -- that means "deny all"
-- for anon/authenticated until real user auth is wired up and per-user
-- policies are added.
--
-- NOTE: this file only covers the tables created by schema.sql. Any table
-- created elsewhere needs RLS enabled where it is created, or it lands in the
-- public schema wide open -- see migrations/004 for schema_migrations, which
-- ingestion/src/migrateUp.ts creates and which was missed here originally.
-- ============================================================

ALTER TABLE platforms       ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands          ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_models      ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE ncap_ratings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_jobs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches  ENABLE ROW LEVEL SECURITY;

-- Public, read-only: the catalog and listing data the site displays.
CREATE POLICY "public read" ON platforms     FOR SELECT USING (true);
CREATE POLICY "public read" ON brands        FOR SELECT USING (true);
CREATE POLICY "public read" ON car_models    FOR SELECT USING (true);
CREATE POLICY "public read" ON listings      FOR SELECT USING (true);
CREATE POLICY "public read" ON price_history FOR SELECT USING (true);
CREATE POLICY "public read" ON ncap_ratings  FOR SELECT USING (true);

-- scrape_jobs, users, saved_searches: intentionally no policies. RLS with
-- no policy = no anon/authenticated access at all (service_role still
-- bypasses RLS for ingestion writes and any future admin tooling).

-- Views inherit the querying role's access to their underlying tables only
-- if created with security_invoker; make that explicit here so
-- v_best_listing_per_model / v_listing_counts follow the same read rules
-- as the tables above rather than running with the view owner's privileges.
ALTER VIEW v_best_listing_per_model SET (security_invoker = true);
ALTER VIEW v_listing_counts         SET (security_invoker = true);
