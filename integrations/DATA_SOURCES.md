# RankAutos — EU Car Platform Integration Guide
**Date:** May 2026

---

## Overview

RankAutos needs to pull live listings from 10+ European car marketplaces on a daily basis. This document covers the integration approach for each platform, partnership requirements, technical notes, and legal considerations.

---

## Platform Tier Summary

| Platform | Country | Monthly Visitors | API Available | Approach | Difficulty |
|---|---|---|---|---|---|
| AutoScout24 | EU-wide | ~45M | ✅ Official API | API partnership | Medium |
| mobile.de | Germany | ~15M | ✅ Official API | API partnership | Medium |
| LaCentrale | France | ~8M | ❌ | Scraping | Hard |
| Marktplaats | Netherlands | ~6M | ⚠️ Partial | Scraping + RSS | Medium |
| Otomoto | Poland | ~10M | ⚠️ Partial | Scraping | Medium |
| Coches.net | Spain | ~7M | ❌ | Scraping | Hard |
| AutoScout24.it | Italy | ~5M | ✅ Same as EU | API partnership | Medium |
| Tesla.com | EU-wide | — | ✅ Unofficial | Direct scrape | Easy |
| AutoUncle | EU-wide | ~3M | ✅ Official API | API partnership | Easy |
| Automobile.it | Italy | ~4M | ❌ | Scraping | Hard |

---

## 1. AutoScout24 (Primary — EU, IT, BE, NL, AT, CH)

**Website:** https://www.autoscout24.com  
**API Docs:** https://autoscout24.github.io/api-documentation  

### Partnership Process
1. Apply for a **Partner API** account at autoscout24.github.io
2. AutoScout24 distinguishes between Dealer API (for car dealers) and Partner API (for aggregators/tools)
3. Request the **Listings Search API** — allows querying public listings with filters
4. Approval typically takes 2–4 weeks; requires a business registration (EU entity preferred)

### Key Endpoints
```
GET /offers
  ?make=hyundai&model=ioniq5
  &zip=10115&zipcountry=D&radius=0
  &fueltype[]=E          (E = Electric)
  &gear[]=A              (A = Automatic)
  &pricefrom=20000&priceto=60000
  &mileageto=100000
  &firstregistrationyearfrom=2020
  &sort=price&order=asc
  &pagesize=20&page=1
```

### Rate Limits
- Production: ~60 requests/min
- Sandbox available for development

### Data Mapping
| AutoScout24 field | RankAutos field |
|---|---|
| `id` | `external_id` |
| `urls.public_url` | `url` |
| `prices.public_price.price_amount` | `price_eur` |
| `first_registration_year` | `year` |
| `mileage.value` | `mileage_km` |
| `location.city` | `city` |
| `location.country_code` | `country_code` |
| `exterior_color` | `exterior_color` |
| `fuel_type_id` | map to fuel_type enum |

---

## 2. mobile.de (Germany)

**Website:** https://www.mobile.de  
**API:** Available via dealer/partner program

### Partnership Process
1. Contact mobile.de partner team: partner@mobile.de
2. They offer a **Data Feed API** for approved aggregators
3. German business registration or EU entity required
4. Typical cost: revenue-share model (0.5–2% of referred sales) or flat monthly fee

### Notes
- mobile.de is owned by the same group as AutoScout24 (Axel Springer / OLX Group)
- If you have an AutoScout24 partnership, mention it — they may have a combined deal
- Their feed supports XML and JSON formats
- Search parameters similar to AutoScout24

---

## 3. LaCentrale (France)

**Website:** https://www.lacentrale.fr  
**API:** No public API

### Scraping Approach

```javascript
// Example using Playwright (headless browser)
// LaCentrale uses JS-rendered pages — Cheerio alone won't work

const { chromium } = require('playwright');

async function scrapeLaCentrale(make, model, maxPages = 5) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = [];
  for (let p = 1; p <= maxPages; p++) {
    await page.goto(
      `https://www.lacentrale.fr/auto-occasion-annonce-${make}_${model}-page${p}.html`,
      { waitUntil: 'networkidle' }
    );
    
    const listings = await page.evaluate(() => {
      return [...document.querySelectorAll('[data-testid="listing-card"]')].map(el => ({
        externalId: el.dataset.adId,
        price:      parseInt(el.querySelector('[class*="price"]')?.textContent?.replace(/\D/g,'')),
        year:       parseInt(el.querySelector('[class*="year"]')?.textContent),
        mileage:    parseInt(el.querySelector('[class*="mileage"]')?.textContent?.replace(/\D/g,'')),
        city:       el.querySelector('[class*="location"]')?.textContent?.trim(),
        url:        el.querySelector('a')?.href,
      }));
    });
    results.push(...listings);
    await page.waitForTimeout(2000 + Math.random() * 1500); // polite delay
  }
  
  await browser.close();
  return results;
}
```

### Important Legal Note
⚠️ Scraping LaCentrale without a data license may violate their Terms of Service and EU database rights (Directive 96/9/EC). Before deploying at scale:
- Review LaCentrale's ToS (Section "Utilisation des données")
- Consider reaching out for a data licensing deal
- If launching in France, a data partnership is strongly recommended

---

## 4. Marktplaats (Netherlands)

**Website:** https://www.marktplaats.nl  
**Owner:** Adevinta (same group as AutoScout24 / mobile.de)  

### Approach
Marktplaats exposes an unofficial RSS/JSON feed for categories:
```
GET https://www.marktplaats.nl/lrp/api/search
  ?query=hyundai+ioniq+5
  &categoryId=91    (91 = Personenauto's)
  &offset=0&limit=30
```

The response is a structured JSON with listings. This is not a documented public API but has been stable for several years.

For reliability, pursue an **Adevinta partnership** (same contact as AutoScout24).

---

## 5. Otomoto (Poland)

**Website:** https://www.otomoto.pl  
**Owner:** OLX Group (Naspers)

### API
Otomoto has an undocumented GraphQL API:
```
POST https://www.otomoto.pl/api/
Content-Type: application/json

{
  "operationName": "listingScreen",
  "variables": {
    "after": null,
    "filters": [
      {"name": "filter_enum_make", "value": "hyundai"},
      {"name": "filter_enum_model", "value": "ioniq-5"}
    ],
    "page": 1
  }
}
```

This is stable and widely used by Polish automotive sites. Not officially supported.  
Pursue an **OLX Group partnership** for a formal data agreement.

---

## 6. Coches.net (Spain)

**Website:** https://www.coches.net  
**Owner:** Schibsted Media Group

### Approach
Coches.net uses standard server-side rendering — Cheerio/Axios scraping works:
```javascript
const cheerio = require('cheerio');
const axios   = require('axios');

async function scrapeCoches(make, model) {
  const { data } = await axios.get(
    `https://www.coches.net/segunda-mano/${make}/${model}/?orden=precio_asc`,
    { headers: { 'Accept-Language': 'es-ES,es;q=0.9' } }
  );
  const $ = cheerio.load(data);
  return $('.mt-CardAd').map((_, el) => ({
    externalId: $(el).data('id'),
    price:  parseInt($(el).find('.mt-CardAdPrice-cash').text().replace(/\D/g,'')),
    year:   parseInt($(el).find('.mt-CardAdV2-attrItem--km').prev().text()),
    city:   $(el).find('.mt-CardAd-attrItem--province').text().trim(),
    url:    'https://www.coches.net' + $(el).find('a').attr('href'),
  })).get();
}
```

Contact: partnerships@schibsted.com for a data agreement.

---

## 7. Tesla.com (EU direct configurator)

Tesla exposes a public JSON endpoint for their inventory:
```
GET https://www.tesla.com/inventory/api/v4/inventory-results
  ?query={"query":{"model":"my","condition":"used","options":{},"arrangeby":"Price","order":"asc","market":"NL","language":"en","super_region":"north america"},"offset":0,"count":24,"outsideOffset":0,"outsideSearch":false}
```

Key parameters:
- `market`: 2-letter country code
- `model`: `ms` (Model S), `m3` (Model 3), `mx` (Model X), `my` (Model Y)
- `condition`: `"new"` or `"used"`

No API key required. Update daily.

---

## 8. Euro NCAP (Safety Ratings)

**Website:** https://www.euroncap.com  
**Data:** Publicly available for non-commercial and commercial use  
**Format:** Data available via their published PDF results and a semi-official CSV export

Recommended approach:
1. Download their latest results CSV from https://www.euroncap.com/en/results/
2. Parse and load into the `ncap_ratings` table monthly
3. Map by make + model name fuzzy match to `car_models`

---

## Scraper Architecture

### Recommended Stack

```
┌─────────────────────────────────────────────────┐
│              Scraper Service (Node.js)           │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Scheduler│  │  Queue   │  │  Workers (N) │  │
│  │(node-cron│  │ (BullMQ) │  │  Playwright/ │  │
│  │  / cron) │  │ + Redis  │  │  Axios/Cheer │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│                                    │             │
│                           ┌────────▼──────────┐ │
│                           │  Normalizer &     │ │
│                           │  Score Computer   │ │
│                           └────────┬──────────┘ │
└────────────────────────────────────┼────────────┘
                                     │
                              ┌──────▼──────┐
                              │ PostgreSQL   │
                              └─────────────┘
```

### Schedule (recommended)
```
# crontab / node-cron
0 3 * * *   AutoScout24 full sweep     (03:00 daily)
0 4 * * *   mobile.de full sweep       (04:00 daily)
0 5 * * *   LaCentrale, Marktplaats    (05:00 daily)
0 6 * * *   Otomoto, Coches.net        (06:00 daily)
0 2 * * *   Tesla inventory            (02:00 daily)
0 1 1 * *   Euro NCAP refresh          (01:00 1st of month)
```

### Deduplication
A listing is uniquely identified by `(platform_id, external_id)`. On each scrape:
1. Upsert on `(platform_id, external_id)`
2. If `price_eur` changed, insert a row in `price_history`
3. Set `last_seen_at = NOW()`
4. Run a cleanup job after each platform sweep: mark listings not seen in 7+ days as `is_active = false`

### Proxy Requirements
For scraped platforms (LaCentrale, Coches.net, Otomoto):
- Use a residential proxy pool (e.g. Bright Data, Oxylabs, Smartproxy)
- Rotate IPs per request
- Respect `robots.txt`
- Randomise request intervals (1.5–4s between requests)
- Budget: €200–500/month for proxy costs at launch scale

---

## Data Quality & Matching

### Model Matching
Scraped listings need to be matched to `car_models`. Strategy:
1. Build a lookup table: `(platform_make_value, platform_model_value) → car_model_id`
2. Use fuzzy matching (pg_trgm) for unmapped entries
3. Manual review queue for low-confidence matches

Example mapping table:
```sql
CREATE TABLE platform_model_map (
  platform_id    VARCHAR(50) NOT NULL,
  platform_make  VARCHAR(100) NOT NULL,
  platform_model VARCHAR(100) NOT NULL,
  car_model_id   INTEGER REFERENCES car_models(id),
  confidence     SMALLINT DEFAULT 100,   -- 0–100
  PRIMARY KEY (platform_id, platform_make, platform_model)
);
```

---

## Legal & Compliance

### GDPR (EU)
- No personal data in listings (car ads are not personal data)
- User email addresses require explicit consent
- Implement right-to-erasure for user accounts
- Privacy policy must disclose data sources
- DPA (Data Processing Agreement) required if using third-party processors (Render, AWS, etc.)

### Data Licensing
- Scraped data from platforms may be protected by **EU Database Directive (96/9/EC)**
- Do not republish full listing data — only link back to original URLs
- Storing and displaying summarised/ranked data is generally considered fair use under EU law
- **Strongly recommended:** Pursue data partnership agreements with all Tier 1 platforms before launch

### robots.txt Compliance
Always check and respect `robots.txt` before scraping. As of May 2026:
- AutoScout24: restricts bots without key — use official API
- mobile.de: allows bots for non-dealer paths with rate limiting
- LaCentrale: restricts aggressive crawling; manual review required
