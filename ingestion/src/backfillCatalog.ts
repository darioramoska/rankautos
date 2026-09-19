// One-off, idempotent backfill for migration 001: derives model_families / generations / trim
// from the existing flat car_models rows.
//   family     = wikipedia_query minus the brand prefix and any "(...)" suffix
//   generation = the trailing "(...)" in display_name, e.g. "(2024+ Highland)" / "(2019-2023)",
//                otherwise "Current"
//   trim       = display_name with that suffix removed
import "dotenv/config";
import pg from "pg";

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function parseYears(label: string): [number | null, number | null] {
  const nums = (label.match(/(19|20)\d{2}/g) ?? []).map(Number);
  if (nums.length === 0) return [null, null];
  if (/\+/.test(label)) return [nums[0], null];
  return [nums[0], nums[1] ?? nums[0]];
}

async function main() {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const { rows } = await c.query(
    `SELECT m.id, m.display_name, m.wikipedia_query, m.model_year, b.id AS brand_id, b.slug AS brand_slug, b.display_name AS brand
       FROM car_models m JOIN brands b ON b.id = m.brand_id`
  );

  let families = 0, generations = 0;
  for (const r of rows) {
    const brandRe = new RegExp("^" + r.brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s+", "i");
    const famName = (r.wikipedia_query ?? r.display_name).replace(brandRe, "").replace(/\s*\(.*\)\s*$/, "").trim();
    const famSlug = `${r.brand_slug}-${slugify(famName)}`;

    const fam = await c.query(
      `INSERT INTO model_families (brand_id, slug, name) VALUES ($1,$2,$3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id, (xmax = 0) AS inserted`,
      [r.brand_id, famSlug, famName]
    );
    if (fam.rows[0].inserted) families++;

    const m = /\s*\(([^)]*)\)\s*$/.exec(r.display_name);
    const label = m && /\d{4}/.test(m[1]) ? m[1].replace(/–/g, "-") : "Current";
    const trim = m && /\d{4}/.test(m[1]) ? r.display_name.replace(m[0], "").trim() : r.display_name;
    const [from, to] = label === "Current" ? [r.model_year, null] : parseYears(label);

    const gen = await c.query(
      `INSERT INTO generations (family_id, label, year_from, year_to) VALUES ($1,$2,$3,$4)
       ON CONFLICT (family_id, label) DO UPDATE SET year_from = EXCLUDED.year_from RETURNING id, (xmax = 0) AS inserted`,
      [fam.rows[0].id, label, from, to]
    );
    if (gen.rows[0].inserted) generations++;

    await c.query("UPDATE car_models SET family_id=$1, generation_id=$2, trim=$3 WHERE id=$4", [
      fam.rows[0].id, gen.rows[0].id, trim, r.id,
    ]);
  }
  console.log(`car_models processed=${rows.length} new families=${families} new generations=${generations}`);
  await c.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
