-- ============================================================
-- RankAutos — PostgreSQL Database Schema
-- Version: 1.0  |  Date: 2026-05-03
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy text search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE fuel_type AS ENUM ('Electric', 'Hybrid', 'PHEV', 'Petrol', 'Diesel');
CREATE TYPE body_type AS ENUM ('SUV', 'Crossover', 'Hatchback', 'Sedan', 'Estate', 'Coupe', 'Convertible', 'Van');
CREATE TYPE transmission_type AS ENUM ('Automatic', 'Manual');
CREATE TYPE listing_condition AS ENUM ('New', 'Used', 'Demo');
CREATE TYPE scrape_status AS ENUM ('pending', 'success', 'failed', 'rate_limited');

-- NOTE: this file is the baseline only. Later changes (model_families/generations, cleanup,
-- auth link, favorites) live in database/migrations/ -- apply with: cd ingestion && npm run migrate:up

-- ============================================================
-- PLATFORMS
-- ============================================================

CREATE TABLE platforms (
  id              VARCHAR(50)  PRIMARY KEY,          -- 'autoscout24', 'mobile_de', etc.
  display_name    VARCHAR(100) NOT NULL,
  base_url        TEXT         NOT NULL,
  country_code    CHAR(2),                           -- ISO 3166-1 alpha-2
  flag_emoji      VARCHAR(8),
  is_active       BOOLEAN      DEFAULT true,
  scrape_enabled  BOOLEAN      DEFAULT true,
  api_type        VARCHAR(30),                       -- 'official_api' | 'scraper' | 'rss'
  rate_limit_rpm  INTEGER      DEFAULT 30,           -- requests per minute
  created_at      TIMESTAMPTZ  DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  DEFAULT NOW()
);

INSERT INTO platforms VALUES
  ('autoscout24', 'AutoScout24', 'https://www.autoscout24.com', 'EU', '🇪🇺', true, true, 'official_api', 60, NOW(), NOW()),
  ('mobile_de',   'mobile.de',   'https://www.mobile.de',       'DE', '🇩🇪', true, true, 'official_api', 60, NOW(), NOW()),
  ('lacentrale',  'LaCentrale',  'https://www.lacentrale.fr',   'FR', '🇫🇷', true, true, 'scraper',      20, NOW(), NOW()),
  ('marktplaats', 'Marktplaats', 'https://www.marktplaats.nl',  'NL', '🇳🇱', true, true, 'scraper',      20, NOW(), NOW()),
  ('otomoto',     'Otomoto',     'https://www.otomoto.pl',      'PL', '🇵🇱', true, true, 'scraper',      20, NOW(), NOW()),
  ('coches_net',  'Coches.net',  'https://www.coches.net',      'ES', '🇪🇸', true, true, 'scraper',      20, NOW(), NOW()),
  ('autoscout24_it','AutoScout24 IT','https://www.autoscout24.it','IT','🇮🇹', true, true, 'official_api', 60, NOW(), NOW()),
  ('tesla',       'Tesla.com',   'https://www.tesla.com/en_eu', NULL, '🏭',  true, true, 'official_api', 10, NOW(), NOW());

-- ============================================================
-- CAR BRANDS & MODELS
-- ============================================================

CREATE TABLE brands (
  id           SERIAL       PRIMARY KEY,
  slug         VARCHAR(50)  NOT NULL UNIQUE,    -- 'volkswagen', 'bmw'
  display_name VARCHAR(100) NOT NULL,
  country      CHAR(2),
  logo_url     TEXT,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE car_models (
  id               SERIAL        PRIMARY KEY,
  brand_id         INTEGER       NOT NULL REFERENCES brands(id),
  slug             VARCHAR(100)  NOT NULL UNIQUE,   -- 'vw-id4-pro'
  display_name     VARCHAR(150)  NOT NULL,          -- 'ID.4 Pro'
  full_name        VARCHAR(200)  NOT NULL,          -- 'Volkswagen ID.4 Pro'
  body_type        body_type     NOT NULL,
  fuel_type        fuel_type     NOT NULL,
  transmission     transmission_type NOT NULL DEFAULT 'Automatic',
  seats            SMALLINT      NOT NULL DEFAULT 5,
  
  -- Key specs
  msrp_eur         INTEGER,                         -- base MSRP in EUR
  range_km         INTEGER,                         -- official/real-world range
  electric_range_km INTEGER,                        -- for PHEVs only
  boot_litres      INTEGER,
  charge_kw        SMALLINT,                        -- peak DC charge rate (0 for non-EVs)
  ncap_stars       SMALLINT CHECK (ncap_stars BETWEEN 0 AND 5),
  model_year       SMALLINT,                        -- launch year of this generation
  
  -- Display
  brand_color      CHAR(7),                         -- hex color for SVG placeholder
  badge_label      VARCHAR(50),                     -- 'Best Seller', 'Top Rated', etc.
  wikipedia_query  VARCHAR(200),                    -- for image fetching
  
  -- Scoring (base scores, 1.0–10.0, established by editorial team)
  score_range        NUMERIC(3,1) CHECK (score_range BETWEEN 1 AND 10),
  score_safety       NUMERIC(3,1) CHECK (score_safety BETWEEN 1 AND 10),
  score_practicality NUMERIC(3,1) CHECK (score_practicality BETWEEN 1 AND 10),
  score_tech         NUMERIC(3,1) CHECK (score_tech BETWEEN 1 AND 10),
  score_reliability  NUMERIC(3,1) CHECK (score_reliability BETWEEN 1 AND 10),
  score_value        NUMERIC(3,1) CHECK (score_value BETWEEN 1 AND 10),
  -- NULL = not applicable (non-EVs have no DC charging); 1..10 otherwise.
  score_charging     NUMERIC(3,1) CHECK (score_charging BETWEEN 1 AND 10),
  
  is_active        BOOLEAN      DEFAULT true,
  created_at       TIMESTAMPTZ  DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_car_models_brand ON car_models(brand_id);
CREATE INDEX idx_car_models_fuel  ON car_models(fuel_type);
CREATE INDEX idx_car_models_body  ON car_models(body_type);
CREATE INDEX idx_car_models_active ON car_models(is_active);

-- ============================================================
-- LISTINGS
-- ============================================================

CREATE TABLE listings (
  id               UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id      VARCHAR(200)  NOT NULL,           -- ID on source platform
  platform_id      VARCHAR(50)   NOT NULL REFERENCES platforms(id),
  car_model_id     INTEGER       REFERENCES car_models(id),  -- NULL if unmatched
  
  -- Core listing data
  title            VARCHAR(300)  NOT NULL,
  url              TEXT          NOT NULL,
  price_eur        INTEGER       NOT NULL,
  year             SMALLINT      NOT NULL,
  mileage_km       INTEGER       NOT NULL DEFAULT 0,
  condition        listing_condition NOT NULL,
  transmission     transmission_type,
  
  -- Location
  country_code     CHAR(2),
  city             VARCHAR(100),
  region           VARCHAR(100),
  
  -- Spec details (from listing, may differ from model base)
  exterior_color   VARCHAR(50),
  interior_color   VARCHAR(50),
  doors            SMALLINT,
  power_kw         SMALLINT,
  engine_cc        SMALLINT,   -- null for EVs
  
  -- Computed scores (stored for query performance, recalculated on scrape)
  score_range        NUMERIC(3,1),
  score_safety       NUMERIC(3,1),
  score_practicality NUMERIC(3,1),
  score_tech         NUMERIC(3,1),
  score_reliability  NUMERIC(3,1),
  score_value        NUMERIC(3,1),
  score_charging     NUMERIC(3,1),
  -- Equally-weighted composite (weights 1/1/1/1/1/1/1)
  score_composite    NUMERIC(3,1),
  
  -- Lifecycle
  first_seen_at    TIMESTAMPTZ  DEFAULT NOW(),
  last_seen_at     TIMESTAMPTZ  DEFAULT NOW(),
  last_scraped_at  TIMESTAMPTZ,
  is_active        BOOLEAN      DEFAULT true,
  sold_at          TIMESTAMPTZ,
  
  -- Raw
  raw_data         JSONB,  -- full scraped payload for debugging
  
  UNIQUE (platform_id, external_id)
);

CREATE INDEX idx_listings_model     ON listings(car_model_id);
CREATE INDEX idx_listings_platform  ON listings(platform_id);
CREATE INDEX idx_listings_price     ON listings(price_eur);
CREATE INDEX idx_listings_year      ON listings(year);
CREATE INDEX idx_listings_mileage   ON listings(mileage_km);
CREATE INDEX idx_listings_country   ON listings(country_code);
CREATE INDEX idx_listings_active    ON listings(is_active);
CREATE INDEX idx_listings_composite ON listings(score_composite DESC);
CREATE INDEX idx_listings_raw       ON listings USING gin(raw_data);

-- ============================================================
-- SCRAPE JOBS
-- ============================================================

CREATE TABLE scrape_jobs (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_id   VARCHAR(50)  NOT NULL REFERENCES platforms(id),
  car_model_id  INTEGER      REFERENCES car_models(id),  -- NULL = full platform sweep
  status        scrape_status NOT NULL DEFAULT 'pending',
  
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ,
  
  listings_found    INTEGER DEFAULT 0,
  listings_new      INTEGER DEFAULT 0,
  listings_updated  INTEGER DEFAULT 0,
  listings_removed  INTEGER DEFAULT 0,
  
  error_message TEXT,
  error_detail  JSONB,
  
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scrape_jobs_platform ON scrape_jobs(platform_id);
CREATE INDEX idx_scrape_jobs_status   ON scrape_jobs(status);
CREATE INDEX idx_scrape_jobs_created  ON scrape_jobs(created_at DESC);

-- ============================================================
-- PRICE HISTORY  (time-series for price tracking)
-- ============================================================

CREATE TABLE price_history (
  id          BIGSERIAL   PRIMARY KEY,
  listing_id  UUID        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  price_eur   INTEGER     NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_price_history_listing ON price_history(listing_id, recorded_at DESC);

-- ============================================================
-- EURO NCAP RATINGS  (cached from euronap.com)
-- ============================================================

CREATE TABLE ncap_ratings (
  id              SERIAL      PRIMARY KEY,
  car_model_id    INTEGER     NOT NULL REFERENCES car_models(id),
  test_year       SMALLINT    NOT NULL,
  overall_stars   SMALLINT    CHECK (overall_stars BETWEEN 0 AND 5),
  adult_pct       SMALLINT,
  child_pct       SMALLINT,
  vru_pct         SMALLINT,   -- Vulnerable Road Users
  safety_assist_pct SMALLINT,
  source_url      TEXT,
  fetched_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USERS  (optional — for saved searches / alerts)
-- ============================================================

CREATE TABLE users (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(254) UNIQUE NOT NULL,
  display_name  VARCHAR(100),
  locale        VARCHAR(10) DEFAULT 'en',
  gdpr_consent  BOOLEAN     NOT NULL DEFAULT false,
  gdpr_date     TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SAVED SEARCHES / ALERTS
-- ============================================================

CREATE TABLE saved_searches (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(100),
  filters     JSONB       NOT NULL,  -- serialized filter state
  weights     JSONB       NOT NULL,  -- serialized weight state
  alert_email BOOLEAN     DEFAULT false,
  alert_freq  VARCHAR(20) DEFAULT 'daily',  -- 'daily' | 'weekly'
  last_alerted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HELPER VIEWS
-- ============================================================

-- Best (cheapest active) listing per model
CREATE VIEW v_best_listing_per_model AS
SELECT DISTINCT ON (car_model_id)
  car_model_id,
  id          AS listing_id,
  platform_id,
  price_eur,
  year,
  mileage_km,
  condition,
  country_code,
  city,
  url
FROM listings
WHERE is_active = true
ORDER BY car_model_id, price_eur ASC;

-- Active listing counts per model
CREATE VIEW v_listing_counts AS
SELECT
  car_model_id,
  COUNT(*)                           AS total_listings,
  COUNT(*) FILTER (WHERE condition = 'New')  AS new_listings,
  COUNT(*) FILTER (WHERE condition = 'Used') AS used_listings,
  MIN(price_eur)                     AS min_price,
  MAX(price_eur)                     AS max_price,
  AVG(price_eur)::INTEGER            AS avg_price
FROM listings
WHERE is_active = true
GROUP BY car_model_id;
