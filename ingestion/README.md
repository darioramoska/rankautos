# RankAutos Ingestion

Standalone Node.js + TypeScript project that loads real listing and safety-rating
data into the RankAutos Supabase (Postgres) database. Independent of `web/` --
its own `package.json`, no npm workspace.

## Status at a glance

| Source | Status | Notes |
|---|---|---|
| Tesla.com inventory | **Live today** | Public JSON endpoint, no API key. See caveat below. |
| Euro NCAP ratings | **Live today** | Expects a manually-downloaded CSV (no stable direct-download URL). |
| AutoScout24 | **Gated** | Needs an approved Partner API key. Code is written; exits cleanly without a key. |
| mobile.de | **Gated** | Needs an approved Data Feed partnership. Code is written; exits cleanly without a key. |
| LaCentrale, Marktplaats, Otomoto, Coches.net, Automobile.it | **Deferred, not built** | ToS-restricted scraping / require partnerships per `integrations/DATA_SOURCES.md`'s "Legal & Compliance" section (EU Database Directive 96/9/EC risk, ToS bans on aggressive crawling). Explicitly out of scope until a partnership or legal sign-off exists. |

## Setup

```bash
cd ingestion
npm install
cp .env.example .env
```

Fill in `.env`:

1. **Supabase project** (create one at supabase.com if you haven't).
2. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` -- Supabase dashboard →
   **Settings → API** → "Project URL" and "Project API keys → service_role".
   This is a secret, server-side-only key; it bypasses Row Level Security,
   which is why ingestion (a trusted backend job) uses it instead of the
   anon key the web app will use.
3. `DATABASE_URL` -- Supabase dashboard → **Settings → Database** →
   "Connection string" → URI. This is a *direct Postgres connection*,
   separate from the REST API URL above -- used by `migrate.ts` (to run raw
   DDL) and `sources/ncap.ts` (to run a `pg_trgm` similarity query).
4. Leave `AUTOSCOUT24_API_KEY` / `MOBILE_DE_API_KEY` blank until you have
   approved partner access (see "Gated sources" below).
5. `NCAP_CSV_PATH` is optional -- you can also pass `--file <path>` per run.

## Commands

```bash
npm run migrate            # apply database/schema.sql to your Supabase Postgres instance (run once, fresh project)
npm run ingest:tesla        # Tesla.com inventory
npm run ingest:ncap -- --file /path/to/euroncap-results.csv   # Euro NCAP ratings
npm run ingest:autoscout24  # AutoScout24 (no-ops until AUTOSCOUT24_API_KEY is set)
npm run ingest:mobile-de    # mobile.de (no-ops until MOBILE_DE_API_KEY is set)
npm run typecheck           # tsc --noEmit
```

### `migrate`

Reads `../database/schema.sql` and runs it verbatim against `DATABASE_URL`.
**This is meant to run once on a fresh Supabase project.** `schema.sql` uses
plain `CREATE TABLE` / `CREATE TYPE` statements without `IF NOT EXISTS`
guards, so re-running it against a database that already has the schema
will fail with "already exists" errors. We deliberately did not add guards
to `database/schema.sql` itself -- it's the canonical schema file shared
with the rest of the project and editing it was out of scope here. If you
need to re-apply it, reset the database from the Supabase dashboard first
(or drop the objects by hand).

### `ingest:tesla`

Hits `https://www.tesla.com/inventory/api/v4/inventory-results` (documented
in `integrations/DATA_SOURCES.md` section 7) for Model Y + Model 3, markets
NL + DE, conditions new + used -- a small fixed sweep per the project brief.
No API key required.

Behavior:
- Fetches each (model, market, condition) combination separately; a failed
  or non-200 request is logged and skipped, it never aborts the whole run.
- Normalizes results into the `listings` table shape and upserts on
  `(platform_id='tesla', external_id=VIN)`, following the deduplication
  strategy in `DATA_SOURCES.md` ("Deduplication" section): upsert the row,
  insert into `price_history` if the price changed, bump `last_seen_at`.
- Resolves `car_model_id` by matching the brand `tesla` + a `car_models.slug`
  pattern (`tesla-model-y%` / `tesla-model-3%`). `database/seed_data.sql`
  only seeds a Model Y row (`tesla-model-y-lr`) -- **Model 3 listings will
  get `car_model_id = NULL`** until a Model 3 row is added to
  `car_models`. This is logged clearly at runtime. Matching arbitrary trims
  to the closest seeded model (instead of leaving NULL) is a reasonable
  follow-up once more Tesla trims are seeded.
- **Dry run by default without Supabase configured**: if
  `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` aren't set, it fetches and
  logs normalized rows without writing anything. Pass `--dry-run` to force
  this even when Supabase *is* configured (useful for eyeballing output).

**Verification caveat (important):** this script's request shape matches
`DATA_SOURCES.md` exactly, and the response normalizer (`normalizeResult()`
in `src/sources/tesla.ts`) is written from the well-documented public shape
of this endpoint (fields like `VIN`, `Price`, `Year`, `City`, ...). However,
**we could not get a live 200 response from this sandbox** to verify it
end-to-end: `tesla.com` is fronted by Akamai bot protection that returns
HTTP 403 for requests from this environment's outbound IP regardless of
headers sent -- confirmed by the fact that even `tesla.com/robots.txt`
403s from here, while unrelated hosts (`example.com`, `google.com`) return
200 fine. This is very likely a blanket block on cloud/CI IP ranges, not
something fixable in code. **Before relying on this in production**, run
`npm run ingest:tesla -- --dry-run` from a normal residential/office network
and confirm the logged rows look right; adjust the field name fallbacks in
`normalizeResult()` if Tesla's actual response shape has drifted from what's
encoded here. The script already fails soft (logs + skips) on unexpected
shapes rather than crashing, so a field-name mismatch degrades to "0 rows
normalized" rather than an exception.

### `ingest:ncap`

Parses a Euro NCAP results CSV you've downloaded by hand from
https://www.euroncap.com/en/results/ (`DATA_SOURCES.md` section 8 notes
there's no stable direct-download URL to hit programmatically -- we checked
and didn't find one either).

Expected columns (header names matched case-insensitively; see
`COLUMN_ALIASES` in `src/sources/ncap.ts` to add more aliases):

```
Make, Model, Year, Overall Stars, Adult Occupant %, Child Occupant %,
Vulnerable Road Users %, Safety Assist %, Source URL
```

Run with:

```bash
npm run ingest:ncap -- --file /path/to/euroncap-results.csv
```

Behavior:
- Parses the CSV with `csv-parse`.
- Fuzzy-matches `Make + Model` against `car_models` using Postgres
  `pg_trgm`'s `similarity()` function (the extension is already enabled by
  `database/schema.sql`) -- comparing against `brands.display_name || ' ' ||
  car_models.display_name`. Matches below a `0.3` similarity score are
  treated as "no match" and skipped (logged), rather than guessed.
- Inserts matched rows into `ncap_ratings`.
- **Dry run without `DATABASE_URL` configured**: parses and logs what it
  would match/insert, without connecting to Postgres.
- If no `--file`/`NCAP_CSV_PATH` is given at all, it logs a message and
  exits 0 rather than erroring.

Tested against a small hand-made sample CSV (2 rows, Tesla Model Y +
Hyundai Ioniq 5) in dry-run mode to confirm the parser and column-alias
matching work correctly.

### `ingest:autoscout24` / `ingest:mobile-de`

Both require partner API access RankAutos doesn't have yet:

- **AutoScout24**: apply for a Partner API account at
  autoscout24.github.io; approval is a 2-4 week process requiring an EU
  business registration (`DATA_SOURCES.md` section 1).
- **mobile.de**: contact `partner@mobile.de` for their Data Feed API;
  typically a revenue-share or flat-fee commercial agreement
  (`DATA_SOURCES.md` section 2).

Until `AUTOSCOUT24_API_KEY` / `MOBILE_DE_API_KEY` are set, each script logs
a clear message naming exactly what's missing and **exits 0** -- it never
attempts a network call, and never crashes a scheduled job that runs it
unconditionally alongside the live sources.

The request-building and field-mapping code is real and written directly
from `DATA_SOURCES.md`'s tables (AutoScout24 has an explicit field-mapping
table in section 1; mobile.de doesn't get its own table in `DATA_SOURCES.md`,
so `src/sources/mobile-de.ts` reuses the same field-mapping convention as
AutoScout24 as a documented best guess -- see the comment at the top of that
file). **The exact API host and auth header scheme for both are not in
`DATA_SOURCES.md`** (they're handed out with partner approval) -- both
default to a placeholder base URL and a `Bearer` auth header;
`AUTOSCOUT24_API_BASE_URL` / `MOBILE_DE_API_BASE_URL` env vars let you
override the host once you have real partner docs. Confirm/adjust both
against the real docs once access is granted.

### Deferred sources (not built)

LaCentrale, Marktplaats, Otomoto, Coches.net, and Automobile.it are **not**
implemented, even as stubs, per the project decision: `DATA_SOURCES.md`'s
"Legal & Compliance" section flags scraping these as a ToS / EU Database
Directive (96/9/EC) risk (LaCentrale, Coches.net explicitly; "Strongly
recommended: Pursue data partnership agreements with all Tier 1 platforms
before launch"), and Marktplaats/Otomoto rely on undocumented/unofficial
endpoints pending an Adevinta/OLX Group partnership. Building scrapers for
these is deferred until a partnership or an explicit legal decision is made.

## Project structure

```
ingestion/
  src/
    supabaseClient.ts     Supabase REST client (service role key)
    migrate.ts             runs database/schema.sql via DATABASE_URL
    lib/
      types.ts              shared NormalizedListing shape (matches `listings` columns)
      upsertListing.ts       shared dedup/upsert + price_history logic
      carModels.ts           car_models lookup helper (used by tesla.ts)
      pgClient.ts             direct Postgres client (used by migrate.ts, ncap.ts)
    sources/
      tesla.ts               live: Tesla.com inventory API
      ncap.ts                 live: Euro NCAP CSV import
      autoscout24.ts          gated: AutoScout24 Partner API
      mobile-de.ts             gated: mobile.de Data Feed API
  .env.example
  package.json
  tsconfig.json
```

## Follow-ups / known gaps

- **Cleanup sweep**: `DATA_SOURCES.md`'s dedup strategy step 4 ("mark
  listings not seen in 7+ days as `is_active = false`") is a
  per-platform sweep job, not something a single source-ingestion run does
  for itself (it would incorrectly deactivate listings from *other*
  platforms/models it didn't touch this run). Not built here -- add a
  separate scheduled job once more than one source is live.
- **Tesla Model 3 car_model_id**: NULL until a Model 3 row is added to
  `car_models` (see `ingest:tesla` section above).
- **AutoScout24 / mobile.de car_model_id**: always NULL in the current
  code -- both scripts leave a `TODO` where the `platform_model_map` lookup
  described in `DATA_SOURCES.md`'s "Data Quality & Matching" section would
  go. That table isn't in `database/schema.sql` yet; add it when a partner
  key is actually available and you're ready to build real model matching.
- **Tesla endpoint verification**: see the caveat under `ingest:tesla`
  above -- normalizer field names are documented-but-unverified against a
  live response; re-check from an unblocked network before production use.
