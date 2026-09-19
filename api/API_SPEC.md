# RankAutos — REST API Specification
**Base URL:** `https://api.rankautos.com/v1`  
**Auth:** Bearer JWT (required only for user-scoped endpoints)  
**Format:** JSON. All prices in EUR (integer cents are NOT used — full euro integers).

---

## Authentication

```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

Standard JWT flow. Access token TTL: 1h. Refresh token TTL: 30d.  
GDPR: Collect consent at registration. Store `gdpr_consent: true` + timestamp.

---

## Car Models

### `GET /models`
Returns all active car models with base scores and best listing price.

**Query params:**

| Param | Type | Description |
|---|---|---|
| `fuel` | string[] | Filter by fuel type. e.g. `fuel=Electric&fuel=Hybrid` |
| `body_type` | string[] | Filter by body type |
| `min_price` | integer | Min MSRP / listing price (EUR) |
| `max_price` | integer | Max price |
| `min_range` | integer | Min range in km |
| `min_seats` | integer | Min seats |
| `min_boot` | integer | Min boot litres |
| `max_boot` | integer | Max boot litres |
| `transmission` | string[] | 'Automatic' or 'Manual' |
| `countries` | string[] | ISO 3166-1 alpha-2 country codes |
| `platforms` | string[] | Platform IDs |
| `colors` | string[] | Exterior color names |
| `w_range` | float 0–10 | Weight for range score (default 5) |
| `w_safety` | float 0–10 | Weight for safety score |
| `w_practicality` | float 0–10 | Weight for practicality score |
| `w_tech` | float 0–10 | Weight for tech score |
| `w_reliability` | float 0–10 | Weight for reliability score |
| `w_value` | float 0–10 | Weight for value score |
| `w_charging` | float 0–10 | Weight for charging score |
| `sort` | string | `weighted_score` (default) / `price_asc` / `price_desc` |
| `limit` | integer | Default 50, max 100 |
| `offset` | integer | Pagination offset |

**Response:**
```json
{
  "total": 17,
  "models": [
    {
      "id": 2,
      "slug": "hyundai-ioniq5-rwd",
      "brand": "Hyundai",
      "name": "Ioniq 5 RWD",
      "full_name": "Hyundai Ioniq 5 RWD",
      "body_type": "SUV",
      "fuel_type": "Electric",
      "transmission": "Automatic",
      "seats": 5,
      "msrp_eur": 41900,
      "range_km": 507,
      "boot_litres": 527,
      "charge_kw": 220,
      "ncap_stars": 5,
      "model_year": 2024,
      "brand_color": "#1a4d8f",
      "badge_label": "Top Rated",
      "wikipedia_query": "Hyundai Ioniq 5",
      "scores": {
        "range": 8.8,
        "safety": 9.5,
        "practicality": 7.8,
        "tech": 9.0,
        "reliability": 8.5,
        "value": 8.5,
        "charging": 9.2
      },
      "weighted_score": 9.2,
      "listing_count": 5,
      "best_listing": {
        "price_eur": 36800,
        "platform_id": "marktplaats",
        "platform_name": "Marktplaats",
        "flag_emoji": "🇳🇱",
        "url": "https://www.marktplaats.nl/..."
      }
    }
  ]
}
```

---

### `GET /models/:slug`
Returns a single car model with full detail including all active listings.

**Response:**
```json
{
  "id": 2,
  "slug": "hyundai-ioniq5-rwd",
  "...all fields from /models...",
  "listings": [
    {
      "id": "uuid",
      "platform_id": "autoscout24",
      "platform_name": "AutoScout24",
      "flag_emoji": "🇪🇺",
      "external_id": "AS24-12345678",
      "url": "https://www.autoscout24.com/offers/...",
      "price_eur": 41900,
      "year": 2024,
      "mileage_km": 0,
      "condition": "New",
      "transmission": "Automatic",
      "exterior_color": "Silver",
      "country_code": "DE",
      "city": "Frankfurt",
      "adjusted_scores": {
        "range": 8.8,
        "safety": 9.5,
        "practicality": 7.8,
        "tech": 9.0,
        "reliability": 8.5,
        "value": 8.5,
        "charging": 9.2
      },
      "weighted_score": 9.2,
      "last_seen_at": "2026-05-03T10:24:00Z"
    }
  ]
}
```

---

## Listings

### `GET /listings`
Query listings directly across all models. Same filter params as `/models` plus:

| Param | Type | Description |
|---|---|---|
| `model_id` | integer | Filter to specific model |
| `condition` | string | 'New' / 'Used' / 'Demo' |
| `max_mileage` | integer | Max mileage in km |
| `min_year` | integer | Min year |
| `max_year` | integer | Max year |

**Response:** paginated array of listing objects (same shape as above).

---

### `GET /listings/:id`
Single listing detail. Returns full listing object + parent model summary.

---

## Platforms

### `GET /platforms`
Returns all active platforms.

```json
{
  "platforms": [
    {
      "id": "autoscout24",
      "display_name": "AutoScout24",
      "base_url": "https://www.autoscout24.com",
      "country_code": "EU",
      "flag_emoji": "🇪🇺",
      "is_active": true
    }
  ]
}
```

---

## Scraper / Admin Endpoints
**Requires admin JWT role.**

### `POST /admin/scrape/trigger`
Triggers an immediate scrape job.

```json
{ "platform_id": "autoscout24", "model_slug": "hyundai-ioniq5-rwd" }
```
`model_slug` is optional — omit to scrape all models for the platform.

### `GET /admin/scrape/jobs`
Returns recent scrape job history with status + statistics.

### `POST /admin/scores/recalculate`
Re-computes all listing adjusted scores (e.g. after editing base model scores or changing the degradation formula). Runs async; returns a job ID.

---

## User Endpoints (JWT required)

### `GET /me`
Current user profile.

### `POST /saved-searches`
Save a search with filters + weights.

```json
{
  "name": "Electric SUV under €45k",
  "filters": { "fuel": ["Electric"], "max_price": 45000 },
  "weights": { "range": 8, "safety": 7, "value": 9, "tech": 5, "practicality": 6, "reliability": 7, "charging": 6 },
  "alert_email": true,
  "alert_freq": "daily"
}
```

### `GET /saved-searches`
List user's saved searches.

### `DELETE /saved-searches/:id`
Delete a saved search.

---

## Score Calculation Reference

The API server computes `adjusted_scores` and `weighted_score` at query time (not stored — computed fresh and optionally cached in Redis for 1h):

```typescript
function adjustedScores(model, listing) {
  const age = new Date().getFullYear() - listing.year;
  const km  = listing.mileage_km / 10000;
  const isEV = ['Electric', 'PHEV'].includes(model.fuel_type);
  const clamp = (v: number) => Math.max(1, Math.min(10, Math.round(v * 10) / 10));
  return {
    range:        clamp(model.score_range        - (isEV ? age*0.14 + km*0.02 : age*0.04)),
    safety:       clamp(model.score_safety       - age * 0.18),
    practicality: clamp(model.score_practicality - age*0.04 - km*0.01),
    tech:         clamp(model.score_tech         - age * 0.28),
    reliability:  clamp(model.score_reliability  - km * 0.04),
    value:        clamp(model.score_value        + age*0.22 - km*0.02),
    charging:     isEV ? clamp(model.score_charging - age*0.18) : model.score_charging,
  };
}

function weightedScore(scores, weights) {
  const keys = Object.keys(scores);
  const totalW = keys.reduce((s, k) => s + (weights[k] ?? 0), 0);
  if (!totalW) return 0;
  const sum = keys.reduce((s, k) => s + scores[k] * (weights[k] ?? 0), 0);
  return Math.round((sum / totalW) * 10) / 10;
}
```

---

## Error Responses

All errors follow:
```json
{
  "error": "not_found",
  "message": "Car model 'xyz' not found",
  "status": 404
}
```

Standard HTTP status codes: 200, 201, 400, 401, 403, 404, 422, 429, 500.

---

## Rate Limiting

Public endpoints: 100 req/min per IP.  
Authenticated endpoints: 500 req/min per user.  
Headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
