// Direct Postgres access, used where we need raw SQL (e.g. pg_trgm
// similarity queries) that the Supabase REST client can't express.
//
// DATABASE_URL is the Supabase "direct connection" string from
// Settings -> Database -> Connection string (URI) -- distinct from
// SUPABASE_URL (the REST API base used by supabaseClient.ts).
import "dotenv/config";
import pg from "pg";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function createPgClient(): pg.Client {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL. Set it in your environment (see ingestion/.env.example). " +
        "Get it from the Supabase dashboard: Settings -> Database -> Connection string (URI)."
    );
  }
  return new pg.Client({ connectionString });
}
