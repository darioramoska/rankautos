// Euro NCAP ratings ingestion.
//
// Per integrations/DATA_SOURCES.md section 8, Euro NCAP does not expose a
// stable, programmatically-hittable direct-download URL for their results
// CSV (https://www.euroncap.com/en/results/ is a filterable results page,
// not a direct file). So this script expects a CSV the user has already
// downloaded by hand, passed via --file <path> or the NCAP_CSV_PATH env
// var, and parses + loads it.
//
// Expected CSV columns (header names are matched case-insensitively, with
// a few common aliases -- see COLUMN_ALIASES below). At minimum you need a
// make, a model, and an overall star rating:
//
//   Make, Model, Year, Overall Stars, Adult Occupant %, Child Occupant %,
//   Vulnerable Road Users %, Safety Assist %, Source URL
//
// If your export uses different headers, either rename them to match one
// of the aliases below, or add another alias -- no need to touch the rest
// of the script.
//
// Make + Model are fuzzy-matched to `car_models` using Postgres pg_trgm
// (already enabled by database/schema.sql) via a direct SQL similarity
// query -- see matchCarModel() below.
import "dotenv/config";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { isDatabaseConfigured, createPgClient } from "../lib/pgClient.js";
import type pg from "pg";

interface NcapCsvRow {
  make: string;
  model: string;
  year: number | null;
  overallStars: number | null;
  adultPct: number | null;
  childPct: number | null;
  vruPct: number | null;
  safetyAssistPct: number | null;
  sourceUrl: string | null;
}

// header (lowercased, trimmed) -> canonical field
const COLUMN_ALIASES: Record<string, keyof NcapCsvRow> = {
  make: "make",
  brand: "make",
  manufacturer: "make",
  model: "model",
  "model name": "model",
  year: "year",
  "test year": "year",
  "overall stars": "overallStars",
  "overall rating": "overallStars",
  stars: "overallStars",
  "adult occupant %": "adultPct",
  "adult occupant": "adultPct",
  "adult protection": "adultPct",
  "child occupant %": "childPct",
  "child occupant": "childPct",
  "child protection": "childPct",
  "vulnerable road users %": "vruPct",
  "vulnerable road users": "vruPct",
  vru: "vruPct",
  "safety assist %": "safetyAssistPct",
  "safety assist": "safetyAssistPct",
  "source url": "sourceUrl",
  "source": "sourceUrl",
  url: "sourceUrl",
};

function toIntOrNull(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const cleaned = String(value).replace(/[^\d.-]/g, "");
  if (cleaned === "") return null;
  const n = Math.round(Number(cleaned));
  return Number.isFinite(n) ? n : null;
}

function parseCsvFile(filePath: string): NcapCsvRow[] {
  const raw = readFileSync(filePath, "utf8");
  const records: Record<string, string>[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records.map((record) => {
    const row: Partial<NcapCsvRow> = {};
    for (const [header, value] of Object.entries(record)) {
      const canonical = COLUMN_ALIASES[header.trim().toLowerCase()];
      if (!canonical) continue;
      if (canonical === "make" || canonical === "model" || canonical === "sourceUrl") {
        (row as Record<string, unknown>)[canonical] = value?.trim() || null;
      } else {
        (row as Record<string, unknown>)[canonical] = toIntOrNull(value);
      }
    }
    return {
      make: row.make ?? "",
      model: row.model ?? "",
      year: row.year ?? null,
      overallStars: row.overallStars ?? null,
      adultPct: row.adultPct ?? null,
      childPct: row.childPct ?? null,
      vruPct: row.vruPct ?? null,
      safetyAssistPct: row.safetyAssistPct ?? null,
      sourceUrl: row.sourceUrl ?? null,
    };
  });
}

interface MatchCandidate {
  id: number;
  full_name: string;
  score: number;
}

/** Fuzzy-matches "make model" against car_models via pg_trgm similarity(). */
async function matchCarModel(client: pg.Client, make: string, model: string): Promise<MatchCandidate | null> {
  const query = `${make} ${model}`.trim();
  const { rows } = await client.query<MatchCandidate>(
    `SELECT cm.id, cm.full_name,
            similarity(b.display_name || ' ' || cm.display_name, $1) AS score
     FROM car_models cm
     JOIN brands b ON b.id = cm.brand_id
     ORDER BY score DESC
     LIMIT 1`,
    [query]
  );
  const best = rows[0];
  if (!best || best.score < 0.3) return null;
  return best;
}

function getCsvPath(): string | null {
  const flagIndex = process.argv.indexOf("--file");
  if (flagIndex !== -1 && process.argv[flagIndex + 1]) return process.argv[flagIndex + 1];
  return process.env.NCAP_CSV_PATH ?? null;
}

async function main() {
  const csvPath = getCsvPath();
  if (!csvPath) {
    console.error(
      "[ncap] No CSV file provided. Pass --file <path-to-csv> or set NCAP_CSV_PATH.\n" +
        "Download the results export from https://www.euroncap.com/en/results/ first -- " +
        "see ingestion/README.md for the expected column layout."
    );
    process.exit(0);
  }

  let rows: NcapCsvRow[];
  try {
    rows = parseCsvFile(csvPath);
  } catch (err) {
    console.error(`[ncap] Failed to read/parse CSV at ${csvPath}:`, err);
    process.exit(1);
    return;
  }
  console.log(`[ncap] Parsed ${rows.length} row(s) from ${csvPath}.`);

  const configured = isDatabaseConfigured();
  if (!configured) {
    console.log("[ncap] DATABASE_URL not set -- running in DRY RUN mode (parsing + matching only, no writes).");
  }

  const client = configured ? createPgClient() : null;
  if (client) await client.connect();

  let matched = 0;
  let unmatched = 0;
  let inserted = 0;
  let errors = 0;

  try {
    for (const row of rows) {
      if (!row.make || !row.model || row.overallStars === null) {
        errors++;
        console.error(`[ncap] Skipping row with missing make/model/overallStars: ${JSON.stringify(row)}`);
        continue;
      }

      if (!client) {
        console.log(`[ncap][dry-run] ${row.make} ${row.model} (${row.year ?? "?"}) -- ${row.overallStars} stars`);
        continue;
      }

      const match = await matchCarModel(client, row.make, row.model);
      if (!match) {
        unmatched++;
        console.log(`[ncap] No confident car_models match for "${row.make} ${row.model}" -- skipping.`);
        continue;
      }
      matched++;

      try {
        await client.query(
          `INSERT INTO ncap_ratings
             (car_model_id, test_year, overall_stars, adult_pct, child_pct, vru_pct, safety_assist_pct, source_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            match.id,
            row.year ?? new Date().getFullYear(),
            row.overallStars,
            row.adultPct,
            row.childPct,
            row.vruPct,
            row.safetyAssistPct,
            row.sourceUrl,
          ]
        );
        inserted++;
        console.log(`[ncap] Matched "${row.make} ${row.model}" -> car_models#${match.id} (${match.full_name}, score=${match.score.toFixed(2)})`);
      } catch (err) {
        errors++;
        console.error(`[ncap] Insert failed for "${row.make} ${row.model}":`, err);
      }
    }
  } finally {
    if (client) await client.end();
  }

  console.log(
    `[ncap] Done. rows=${rows.length} matched=${matched} unmatched=${unmatched} inserted=${inserted} errors=${errors} dryRun=${!configured}`
  );
}

main().catch((err) => {
  console.error("[ncap] Unexpected error:", err);
  process.exit(1);
});
