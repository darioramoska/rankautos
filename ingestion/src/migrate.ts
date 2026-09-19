// One-shot schema migration runner.
//
// Reads ../database/schema.sql and executes it against the Postgres
// instance pointed to by DATABASE_URL (Supabase Settings -> Database ->
// Connection string -> URI). This is NOT the same credential as
// SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY (those talk to the REST API);
// this is a direct Postgres connection needed to run raw DDL.
//
// NOTE: schema.sql uses plain `CREATE TABLE` / `CREATE TYPE` statements
// without `IF NOT EXISTS` guards (Postgres enums in particular don't
// support `IF NOT EXISTS` pre-15 without extra ceremony). That means this
// script is meant to be run ONCE against a fresh Supabase project. Running
// it twice will fail with "already exists" errors on the second run. If
// you need to re-run it, reset the database from the Supabase dashboard
// first, or drop the objects manually. We deliberately did not rewrite
// database/schema.sql to add guards -- it's the canonical schema file and
// out of scope for this ingestion project to change.
import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error(
      "Missing DATABASE_URL. Set it in your environment (see ingestion/.env.example).\n" +
        "Get it from the Supabase dashboard: Settings -> Database -> Connection string (URI)."
    );
    process.exit(0);
  }

  const schemaPath = path.resolve(__dirname, "..", "..", "database", "schema.sql");
  let sql: string;
  try {
    sql = readFileSync(schemaPath, "utf8");
  } catch (err) {
    console.error(`Could not read schema file at ${schemaPath}:`, err);
    process.exit(1);
    return;
  }

  const client = new pg.Client({ connectionString });
  await client.connect();
  console.log(`Connected. Running ${schemaPath} ...`);

  try {
    await client.query(sql);
    console.log("Migration complete: schema.sql applied successfully.");
  } catch (err) {
    console.error(
      "Migration failed. If this is because objects already exist, the schema " +
        "has likely already been applied once -- see the note at the top of migrate.ts."
    );
    console.error(err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Unexpected error running migration:", err);
  process.exit(1);
});
