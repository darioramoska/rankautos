// Makes the database the single source of truth for the app: loads the demo listings that
// previously lived only in web/src/lib/data.ts into the `listings` table (tagged
// raw_data.source = 'mock' so real ingested listings can be told apart / purged later), and
// backfills car_models.electric_range_km, which the SQL seed never carried.
// Idempotent: listings upsert on (platform_id, external_id).
import "dotenv/config";
import pg from "pg";
import { CAR_DATA } from "../../web/src/lib/data.js";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[–—]/g, "-").toLowerCase().trim();

function platformId(name: string, url: string): string {
  if (name === "AutoScout24") return url.includes(".it") ? "autoscout24_it" : "autoscout24";
  const map: Record<string, string> = {
    "mobile.de": "mobile_de", LaCentrale: "lacentrale", Marktplaats: "marktplaats",
    Otomoto: "otomoto", "Coches.net": "coches_net", "Tesla.com": "tesla",
  };
  const id = map[name];
  if (!id) throw new Error(`unmapped platform ${name}`);
  return id;
}

async function main() {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const { rows } = await c.query(
    "SELECT m.id, m.display_name, b.display_name AS brand FROM car_models m JOIN brands b ON b.id = m.brand_id"
  );
  const byKey = new Map<string, number>(rows.map((r) => [norm(`${r.brand} ${r.display_name}`), r.id]));

  let matched = 0, unmatched: string[] = [], inserted = 0;
  await c.query("BEGIN");
  for (const car of CAR_DATA) {
    const id = byKey.get(norm(`${car.brand} ${car.name}`));
    if (!id) { unmatched.push(`${car.brand} ${car.name}`); continue; }
    matched++;
    if (car.elec_range_km) await c.query("UPDATE car_models SET electric_range_km=$1 WHERE id=$2", [car.elec_range_km, id]);
    for (const l of car.listings) {
      await c.query(
        `INSERT INTO listings (external_id, platform_id, car_model_id, title, url, price_eur, year, mileage_km,
                               condition, transmission, city, exterior_color, is_active, raw_data)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true,$13)
         ON CONFLICT (platform_id, external_id) DO UPDATE SET
           price_eur=EXCLUDED.price_eur, year=EXCLUDED.year, mileage_km=EXCLUDED.mileage_km, last_seen_at=NOW()`,
        [
          `mock:${car.id}:${l.id}`, platformId(l.name, l.url), id, `${car.brand} ${car.name}`, l.url,
          l.price, l.year, l.mileage, l.condition, l.transmission, l.location, l.ext_color,
          JSON.stringify({ source: "mock" }),
        ]
      );
      inserted++;
    }
  }
  await c.query("COMMIT");
  console.log(`cars matched=${matched}/${CAR_DATA.length} listings upserted=${inserted}`);
  if (unmatched.length) console.log("UNMATCHED:", unmatched.join(" | "));
  await c.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
