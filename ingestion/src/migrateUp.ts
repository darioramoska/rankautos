// Versioned migration runner: applies database/migrations/NNN_*.sql in order, each inside its
// own transaction, and records it in schema_migrations so re-running is a no-op.
// (migrate.ts only ever applied the one-shot baseline schema.sql and can't be re-run.)
import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "database", "migrations");

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL (see ingestion/.env.example).");
    process.exit(1);
  }
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())"
  );
  // This table lives in the public schema, so on Supabase PostgREST exposes it to the
  // anon key that ships in the web bundle. Left open, anyone could insert a filename and
  // make the loop below silently skip that migration (or delete rows to force a re-run).
  // Lock it down every run, not just at creation — the table predates this hardening.
  // The runner connects as the table's owner, which bypasses RLS, so this stays a no-op here.
  await client.query("ALTER TABLE schema_migrations ENABLE ROW LEVEL SECURITY");
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        REVOKE ALL ON schema_migrations FROM anon, authenticated;
      END IF;
    END $$;
  `);
  const done = new Set((await client.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
  const files = readdirSync(dir).filter((f) => /^\d+_.*\.sql$/.test(f)).sort();

  for (const f of files) {
    if (done.has(f)) {
      console.log(`skip   ${f}`);
      continue;
    }
    try {
      await client.query("BEGIN");
      await client.query(readFileSync(path.join(dir, f), "utf8"));
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [f]);
      await client.query("COMMIT");
      console.log(`applied ${f}`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(`FAILED  ${f}:`, (err as Error).message);
      process.exitCode = 1;
      break;
    }
  }
  await client.end();
}

main();
