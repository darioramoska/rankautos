// Adds the US market: three US platforms plus DEMO used-car listings (raw_data.source = 'mock')
// for models that are actually sold in the US. Prices are stored in EUR like every other listing
// (USD at a fixed 1.08 rate, original USD/miles kept in raw_data). Real US data comes from a
// licensed feed -- see src/sources/marketcheck.ts. Idempotent.
import "dotenv/config";
import pg from "pg";

const USD_PER_EUR = 1.08;
const MI_TO_KM = 1.609344;
const NOW = 2026;

const PLATFORMS = [
  { id: "cars_com", name: "Cars.com", url: "https://www.cars.com" },
  { id: "cargurus", name: "CarGurus", url: "https://www.cargurus.com" },
  { id: "autotrader_us", name: "Autotrader.com", url: "https://www.autotrader.com" },
];
const US_BRANDS = ["Toyota", "Ford", "Hyundai", "Kia", "BMW", "Mercedes", "Audi", "Volkswagen", "Tesla", "Volvo", "Mazda",
  "Honda", "Nissan", "Porsche", "Polestar", "Lexus", "Subaru", "Jeep", "Genesis", "Mini", "Cadillac", "Land Rover", "Jaguar"];
// EU-only nameplates among those brands
const EU_ONLY = /Fiesta|Focus|Galaxy|Kuga|Puma|Tourneo|Explorer EV|Polo|Up!|up!|T-Cross|Taigo|Touran|Passat|Arteon|Golf Estate|ID\. Buzz Cargo|Auris|Aygo|Yaris|Urban Cruiser|Corolla Touring|1 Series|Active Tourer|B-Class|Bayon|i10|i20|i30|Inster|A1|Q2|A4 Avant|A6 Avant|Ioniq 5 N|Camry Hybrid AWD-i|Land Cruiser 2\.8|Prius Hybrid|Fabia/i;
const CITIES = ["Los Angeles, CA", "Houston, TX", "Miami, FL", "Chicago, IL", "Phoenix, AZ", "Atlanta, GA", "Seattle, WA", "Denver, CO", "Dallas, TX", "New York, NY"];
const COLORS = ["White", "Black", "Grey", "Silver", "Blue", "Red"];

let seed = 424242;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];

async function main() {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  await c.query("BEGIN");
  for (const p of PLATFORMS) {
    await c.query(
      `INSERT INTO platforms (id, display_name, base_url, country_code, flag_emoji, is_active, scrape_enabled, api_type)
       VALUES ($1,$2,$3,'US','🇺🇸',true,false,'aggregator_api')
       ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name, base_url=EXCLUDED.base_url, country_code='US', flag_emoji='🇺🇸'`,
      [p.id, p.name, p.url]);
  }
  const cars = (await c.query(
    `SELECT m.id, m.display_name, m.msrp_eur, m.model_year, m.transmission, b.display_name AS brand, g.year_from
       FROM car_models m JOIN brands b ON b.id=m.brand_id LEFT JOIN generations g ON g.id=m.generation_id
      WHERE b.display_name = ANY($1) AND m.is_active`, [US_BRANDS])).rows.filter((m) => !EU_ONLY.test(m.display_name));

  let n = 0;
  for (const m of cars) {
    const pf = [...PLATFORMS].sort(() => rnd() - 0.5).slice(0, 2);
    for (const [i, p] of pf.entries()) {
      const ly = Math.max(m.year_from ?? 2015, m.model_year - i - (rnd() < 0.5 ? 1 : 0));
      const age = Math.max(0, NOW - ly);
      const miles = Math.round((age * (9000 + rnd() * 6000)) / 100) * 100;
      const priceEur = Math.round((m.msrp_eur * Math.max(0.22, Math.pow(0.87, age)) * (1 - (miles * MI_TO_KM) / 450000) * (0.93 + rnd() * 0.12)) / 100) * 100;
      const ext = `mock:us:${m.id}:${i}`;
      await c.query(
        `INSERT INTO listings (external_id, platform_id, car_model_id, title, url, price_eur, year, mileage_km, condition, transmission,
                               country_code, city, exterior_color, is_active, raw_data)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Used',$9,'US',$10,$11,true,$12)
         ON CONFLICT (platform_id, external_id) DO NOTHING`,
        [ext, p.id, m.id, `${m.brand} ${m.display_name}`, p.url, priceEur, ly, Math.round(miles * MI_TO_KM), m.transmission, pick(CITIES),
         pick(COLORS), JSON.stringify({ source: "mock", currency: "USD", price_usd: Math.round(priceEur * USD_PER_EUR), mileage_mi: miles })]);
      n++;
    }
  }
  await c.query("COMMIT");
  console.log(`US platforms=${PLATFORMS.length} eligible cars=${cars.length} listings=${n}`);
  await c.end();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
