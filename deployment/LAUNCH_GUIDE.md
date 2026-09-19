# RankAutos — Deployment & Launch Guide
**Date:** May 2026  
**Target:** Production launch on Vercel (frontend) + Railway (API + DB + scraper)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                        Users (EU)                        │
└──────────────────┬───────────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼───────────────────────────────────────┐
│             Vercel (CDN + Next.js frontend)               │
│          rankautos.com / www.rankautos.com                 │
│     Static assets + SSR pages + API route proxy           │
└──────────────────┬───────────────────────────────────────┘
                   │ REST
┌──────────────────▼───────────────────────────────────────┐
│           Railway — API Service (Node/Express)            │
│                api.rankautos.com                          │
│   • /v1/models, /v1/listings, /v1/platforms, /v1/auth    │
└──────┬────────────────────────┬─────────────────────────┘
       │                        │
┌──────▼──────┐          ┌──────▼─────────────────────────┐
│  PostgreSQL  │          │    Railway — Scraper Service    │
│  (Railway)   │          │    (Node.js + Playwright)       │
│  Primary DB  │          │    Runs on cron schedule        │
└─────────────┘          └────────────────────────────────┘
       │
┌──────▼──────┐
│    Redis     │   ← BullMQ job queue + API response cache
│  (Railway)   │
└─────────────┘
```

---

## Step 1 — Domain & DNS

1. Register `rankautos.com` (Namecheap / Cloudflare Registrar / Google Domains)
2. If using Cloudflare (recommended for DDoS protection + free SSL):
   - Add site to Cloudflare
   - Set nameservers at registrar to Cloudflare's
   - Enable "Full (strict)" SSL mode
3. DNS records:
   ```
   A/CNAME  @              → Vercel (auto-managed via Vercel integration)
   CNAME    www            → cname.vercel-dns.com
   CNAME    api            → your-railway-service.up.railway.app
   ```

---

## Step 2 — Database Setup (Railway)

1. Create a new project on Railway (railway.app)
2. Add a **PostgreSQL** plugin
3. Copy the `DATABASE_URL` connection string from the Railway dashboard
4. Run schema + seed:
   ```bash
   psql "$DATABASE_URL" < design_handoff_rankautos/database/schema.sql
   psql "$DATABASE_URL" < design_handoff_rankautos/database/seed_data.sql
   ```
5. Add a **Redis** plugin (for BullMQ + caching)
6. Copy the `REDIS_URL` from Railway dashboard

---

## Step 3 — API Service (Railway)

### Environment Variables
Set these in Railway dashboard → your API service → Variables:

```env
# Database
DATABASE_URL=postgresql://...         # from Railway PostgreSQL
REDIS_URL=redis://...                 # from Railway Redis

# Auth
JWT_SECRET=<64-char random hex>       # openssl rand -hex 32
JWT_REFRESH_SECRET=<64-char random hex>
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=30d

# App
NODE_ENV=production
PORT=3001
API_BASE_URL=https://api.rankautos.com
FRONTEND_URL=https://www.rankautos.com
CORS_ORIGINS=https://rankautos.com,https://www.rankautos.com

# AutoScout24 API (after partnership approval)
AUTOSCOUT24_CLIENT_ID=...
AUTOSCOUT24_CLIENT_SECRET=...
AUTOSCOUT24_API_URL=https://api.autoscout24.com

# mobile.de API (after partnership approval)
MOBILEDE_API_KEY=...
MOBILEDE_API_URL=https://services.mobile.de/search-api

# Proxy (for scraped platforms)
PROXY_HOST=...
PROXY_PORT=...
PROXY_USER=...
PROXY_PASS=...

# Email (for user alerts)
SMTP_HOST=smtp.eu.sparkpostmail.com
SMTP_PORT=587
SMTP_USER=SMTP_Injection
SMTP_PASS=...
EMAIL_FROM=hello@rankautos.com

# Sentry (error monitoring)
SENTRY_DSN=https://...@sentry.io/...
```

### Deployment
```bash
# In your API repo root
railway login
railway link <project-id>
railway up
```

---

## Step 4 — Scraper Service (Railway)

Deploy as a **separate Railway service** in the same project (shares the same DATABASE_URL and REDIS_URL).

Add Playwright dependencies:
```bash
npx playwright install chromium --with-deps
```

The scraper service runs on cron (via `node-cron`) — it does not expose HTTP endpoints. Set `START_COMMAND=node scraper/index.js`.

Additional env vars:
```env
SCRAPE_CONCURRENCY=3          # parallel workers
SCRAPE_DELAY_MIN_MS=1500      # min delay between requests
SCRAPE_DELAY_MAX_MS=4000      # max delay
SCRAPE_DRY_RUN=false          # set true for testing
```

---

## Step 5 — Frontend (Vercel)

1. Push your Next.js app to GitHub
2. Import project at vercel.com/new
3. Set framework preset: **Next.js**
4. Add environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.rankautos.com/v1
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX        # Google Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...       # PostHog (product analytics)
```

5. Add custom domain `rankautos.com` in Vercel → Settings → Domains
6. Enable Vercel Analytics (free tier)

---

## Step 6 — Pre-Launch Checklist

### Legal
- [ ] Privacy Policy published at `/privacy` (GDPR-compliant)
- [ ] Cookie Policy (if using analytics)
- [ ] Terms of Use at `/terms`
- [ ] Disclaimer visible on homepage (already in design: "RankAutos is a car research tool only…")
- [ ] GDPR consent banner for EU visitors (use `react-cookie-consent` or similar)
- [ ] Data partnership agreements in place (or scraping limited to platforms with permissive ToS)

### Technical
- [ ] SSL working on all subdomains
- [ ] Database backups enabled (Railway auto-backups, or set up pg_dump cron)
- [ ] Error monitoring live (Sentry)
- [ ] Uptime monitoring (BetterUptime, UptimeRobot)
- [ ] Log aggregation (Railway built-in, or Papertrail)
- [ ] Rate limiting tested
- [ ] API load test with k6 or Artillery (target: 500 req/sec sustained)

### SEO
- [ ] `sitemap.xml` generated (one URL per car model + static pages)
- [ ] `robots.txt` allowing crawlers
- [ ] `<meta>` tags on all pages (title, description, og:image)
- [ ] Structured data: `Product` schema on car model pages with `offers`
- [ ] Core Web Vitals passing (Lighthouse score > 90)

### Analytics
- [ ] Google Analytics 4 installed
- [ ] Key events tracked:
  - `filter_applied` (which filter + value)
  - `car_viewed` (model slug)
  - `listing_clicked` (model + platform + price)
  - `search_started` (filter summary)
- [ ] PostHog for funnel analysis (Home → Results → Detail → Click-out)

### Data Quality
- [ ] All 17 seed car models have at least 2 active listings
- [ ] Wikipedia images loading for all models
- [ ] Score calculation verified against prototype values
- [ ] All platform external links tested (open in new tab, correct URL)

---

## Step 7 — Go Live

```bash
# 1. Final production build
vercel --prod

# 2. Smoke test
curl https://api.rankautos.com/v1/models | jq '.total'
curl https://api.rankautos.com/v1/platforms | jq '.[].display_name'

# 3. Trigger first full scrape
curl -X POST https://api.rankautos.com/v1/admin/scrape/trigger \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -d '{"platform_id": "autoscout24"}'

# 4. Monitor
railway logs --tail
```

---

## Estimated Monthly Running Costs (at launch)

| Service | Plan | Est. Cost |
|---|---|---|
| Railway (API + DB + Redis + Scraper) | Starter | €15–30/mo |
| Vercel (Frontend) | Hobby / Pro | €0–20/mo |
| Domain (`rankautos.com`) | Annual | ~€1.50/mo |
| Proxy (residential, scraped sites) | Entry | €100–200/mo |
| Sentry (error monitoring) | Free tier | €0 |
| Email (SparkPost EU) | Free tier (< 15k/mo) | €0 |
| **Total** | | **~€120–250/mo** |

Scale costs: At 100k monthly users, expect Railway to scale to €100–200/mo. Frontend on Vercel stays cheap due to CDN.

---

## Scaling Notes

- Database: Add a **read replica** on Railway when you hit >1k concurrent users
- Caching: Cache `/v1/models` with default weights in Redis (TTL 1h) — this is the hottest endpoint
- CDN: Car images (Wikipedia) are fetched client-side — no CDN needed for images
- Search: At >50k listings, consider adding **Meilisearch** or **Elasticsearch** for full-text search
- Scraper: Add more workers (increase `SCRAPE_CONCURRENCY`) rather than more services when scaling
