// Trim / generation rollout for the top-10 European brands (VW, Toyota, Renault, Peugeot, Škoda,
// Ford, Mercedes, BMW, Audi, Hyundai).
//  1. Normalises model_families (one family per nameplate) and gives every existing row of those
//     brands a real generation label ("2019+") instead of "Current".
//  2. Adds extra trims of the current generation and rows for the previous generation, cloned
//     from an existing "base" row with overrides; editorial scores are derived from the base
//     (range/value/practicality follow the spec change, older generations lose tech/safety points).
//  3. Adds demo listings for the new rows (raw_data.source = 'mock', same as syncMockCatalog).
// Scores are editorial estimates, specs are approximate WLTP/MSRP figures. Idempotent.
import "dotenv/config";
import pg from "pg";

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

import { top10 } from "./trimData/top10.js";
import { more } from "./trimData/more.js";
import type { V } from "./trimData/types.js";

const DATASETS = [top10, more];
const BRANDS = DATASETS.flatMap((d) => d.brands);
const GEN_FROM: Record<number, number> = Object.assign({}, ...DATASETS.map((d) => d.genFrom));
const VARIANTS: V[] = DATASETS.flatMap((d) => d.variants);

const clamp = (n: number, lo = 1, hi = 10) => Math.min(hi, Math.max(lo, n));
const r1 = (n: number) => Math.round(n * 10) / 10;

function cleanFamily(name: string): string {
  return name
    .replace(/^Mercedes-Benz\s+/i, "")
    .replace(/\s+(Mk\d+|G\d{2}|(second|third|fourth|fifth|sixth) generation)$/i, "")
    .replace(/^Golf GTI$/i, "Golf")
    .trim();
}

// deterministic pseudo-random so reruns produce the same demo data
let seed = 20260919;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];

const MOCK_PLATFORMS: Record<string, { url: string; cities: string[] }> = {
  mobile_de: { url: "https://www.mobile.de", cities: ["Berlin", "München", "Hamburg", "Köln"] },
  autoscout24: { url: "https://www.autoscout24.com", cities: ["Wien", "Antwerpen", "Bruxelles", "Stuttgart"] },
  lacentrale: { url: "https://www.lacentrale.fr", cities: ["Paris", "Lyon", "Lille", "Bordeaux"] },
  marktplaats: { url: "https://www.marktplaats.nl", cities: ["Amsterdam", "Utrecht", "Rotterdam"] },
  otomoto: { url: "https://www.otomoto.pl", cities: ["Warszawa", "Kraków", "Poznań"] },
  coches_net: { url: "https://www.coches.net", cities: ["Madrid", "Barcelona", "Valencia"] },
  autoscout24_it: { url: "https://www.autoscout24.it", cities: ["Milano", "Roma", "Torino"] },
};
const COLORS = ["White", "Black", "Grey", "Silver", "Blue", "Red"];
const NOW = 2026;

async function main() {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  await c.query("BEGIN");

  const rows = (await c.query(
    `SELECT m.*, b.display_name AS brand, b.slug AS brand_slug, f.name AS fam_name
       FROM car_models m JOIN brands b ON b.id=m.brand_id JOIN model_families f ON f.id=m.family_id
      WHERE b.display_name = ANY($1)`, [BRANDS])).rows;
  const byId = new Map<number, any>(rows.map((r) => [r.id, r]));

  const famCache = new Map<string, number>();
  const famId = async (brandId: number, brandSlug: string, name: string) => {
    const slug = `${brandSlug}-${slugify(name)}`;
    if (famCache.has(slug)) return famCache.get(slug)!;
    const r = await c.query(
      `INSERT INTO model_families (brand_id, slug, name) VALUES ($1,$2,$3)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name RETURNING id`, [brandId, slug, name]);
    famCache.set(slug, r.rows[0].id);
    return r.rows[0].id as number;
  };
  const genId = async (family: number, from: number, to: number | null) => {
    const label = to ? `${from}–${to}` : `${from}+`;
    const r = await c.query(
      `INSERT INTO generations (family_id, label, year_from, year_to) VALUES ($1,$2,$3,$4)
       ON CONFLICT (family_id, label) DO UPDATE SET year_from=EXCLUDED.year_from, year_to=EXCLUDED.year_to RETURNING id`,
      [family, label, from, to]);
    return r.rows[0].id as number;
  };

  // 1. normalise existing rows
  let relinked = 0;
  for (const r of rows) {
    const from = GEN_FROM[r.id];
    if (!from) { console.log("no generation year for", r.id, r.display_name); continue; }
    const fam = await famId(r.brand_id, r.brand_slug, cleanFamily(r.fam_name));
    const gen = await genId(fam, from, null);
    await c.query("UPDATE car_models SET family_id=$1, generation_id=$2 WHERE id=$3", [fam, gen, r.id]);
    r.family_id = fam;
    relinked++;
  }

  // 2. variants + 3. demo listings
  let added = 0, listingsAdded = 0;
  for (const [vi, v] of VARIANTS.entries()) {
    const [baseId, from, to, trim, year, o, d = {}, chargeScore] = v;
    const b = byId.get(baseId);
    if (!b) throw new Error(`unknown base id ${baseId}`);
    const old = to !== null;
    const display = old ? `${trim} (${from}–${to})` : trim;
    const exists = await c.query("SELECT id FROM car_models WHERE brand_id=$1 AND display_name=$2", [b.brand_id, display]);
    let carId: number;
    if (exists.rows.length) {
      carId = exists.rows[0].id;
    } else {
      const num = (x: any) => Number(x);
      const fuel = o.fuel ?? b.fuel_type;
      const msrp = o.msrp ?? b.msrp_eur;
      const range = o.range ?? b.range_km;
      const boot = o.boot ?? b.boot_litres;
      const isEv = fuel === "Electric";
      const baseEv = b.fuel_type === "Electric";
      // range score follows the range figure only when both rows use the same energy type
      const rangeDelta = isEv !== baseEv ? 0
        : isEv ? ((range - b.range_km) / 100) * 0.5
        : (range - b.range_km) / 250 + (fuel === "PHEV" && b.fuel_type !== "PHEV" ? 0.5 : 0);
      const valueDelta = -clamp((msrp / b.msrp_eur - 1) * 3, -2, 2) + (old ? 0.5 : 0);
      const sc = {
        range: r1(clamp(num(b.score_range) + rangeDelta + (d.r ?? 0))),
        safety: r1(clamp(num(b.score_safety) - (old ? 0.4 : 0) + (d.s ?? 0))),
        practicality: r1(clamp(num(b.score_practicality) + ((boot - b.boot_litres) / 100) * 0.3 + (d.p ?? 0))),
        tech: r1(clamp(num(b.score_tech) - (old ? 1.2 : 0) + (d.t ?? 0))),
        reliability: r1(clamp(num(b.score_reliability) + (d.rel ?? 0))),
        value: r1(clamp(num(b.score_value) + valueDelta + (d.v ?? 0))),
      };
      let charging: number | null = null;
      let kw = 0;
      if (isEv) {
        kw = o.kw ?? b.charge_kw ?? 0;
        charging = b.score_charging != null ? r1(clamp(num(b.score_charging) + ((kw - b.charge_kw) / 100) * 0.5)) : chargeScore ?? 5;
      } else if (fuel === "PHEV") {
        kw = o.kw ?? b.charge_kw ?? 0;
        charging = chargeScore ?? 4.5;
      }
      const elec = fuel === "PHEV" ? o.elec ?? b.electric_range_km ?? null : null;
      const ins = await c.query(
        `INSERT INTO car_models (brand_id, slug, display_name, full_name, body_type, fuel_type, transmission, seats, msrp_eur,
            range_km, electric_range_km, boot_litres, charge_kw, ncap_stars, model_year, brand_color, badge_label, wikipedia_query,
            score_range, score_safety, score_practicality, score_tech, score_reliability, score_value, score_charging,
            is_active, family_id, generation_id, trim)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NULL,$17,$18,$19,$20,$21,$22,$23,$24,true,$25,$26,$27)
         ON CONFLICT (slug) DO NOTHING RETURNING id`,
        [
          b.brand_id, `${b.brand_slug}-${slugify(display)}-${from}`, display, `${b.brand} ${display}`, b.body_type, fuel,
          o.tr ?? b.transmission, o.seats ?? b.seats, msrp, range, elec, boot, kw, o.ncap ?? b.ncap_stars, year, b.brand_color,
          b.wikipedia_query, sc.range, sc.safety, sc.practicality, sc.tech, sc.reliability, sc.value, charging,
          b.family_id, await genId(b.family_id, from, to), trim,
        ]);
      if (!ins.rows.length) { console.log("slug clash, skipped:", display); continue; }
      carId = ins.rows[0].id;
      added++;
    }

    const have = await c.query("SELECT count(*) FROM listings WHERE car_model_id=$1", [carId]);
    if (Number(have.rows[0].count) > 0) continue;
    const car = (await c.query("SELECT msrp_eur, transmission FROM car_models WHERE id=$1", [carId])).rows[0];
    const platforms = Object.keys(MOCK_PLATFORMS).sort(() => rnd() - 0.5).slice(0, 4);
    for (const [i, pid] of platforms.entries()) {
      const top = Math.min(to ?? NOW, NOW);
      const ly = old ? Math.max(from, top - 1 - i * 2 - Math.floor(rnd() * 2)) : Math.max(from, year - i - (rnd() < 0.4 ? 1 : 0));
      const age = NOW - ly;
      const mileage = Math.round((age * (11000 + rnd() * 8000)) / 100) * 100;
      const price = Math.round((car.msrp_eur * Math.max(0.22, Math.pow(0.87, age)) * (1 - mileage / 450000) * (0.94 + rnd() * 0.12)) / 100) * 100;
      const p = MOCK_PLATFORMS[pid];
      await c.query(
        `INSERT INTO listings (external_id, platform_id, car_model_id, title, url, price_eur, year, mileage_km, condition, transmission, city, exterior_color, is_active, raw_data)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true,$13)
         ON CONFLICT (platform_id, external_id) DO NOTHING`,
        [`mock:trim:${vi}:${i}`, pid, carId, `${b.brand} ${display}`, p.url, price, ly, mileage, mileage < 500 && age <= 1 ? "New" : "Used",
         car.transmission, pick(p.cities), pick(COLORS), JSON.stringify({ source: "mock" })]);
      listingsAdded++;
    }
  }

  // 4. drop now-empty generations/families
  const g = await c.query(`DELETE FROM generations g WHERE NOT EXISTS (SELECT 1 FROM car_models m WHERE m.generation_id=g.id) RETURNING 1`);
  const f = await c.query(`DELETE FROM model_families f WHERE NOT EXISTS (SELECT 1 FROM car_models m WHERE m.family_id=f.id)
                            AND NOT EXISTS (SELECT 1 FROM generations g WHERE g.family_id=f.id) RETURNING 1`);
  await c.query("COMMIT");
  console.log(`relinked=${relinked} added=${added} listings=${listingsAdded} removed empty generations=${g.rowCount} families=${f.rowCount}`);
  await c.end();
}

main().catch((e) => { console.error(e.message); process.exit(1); });
