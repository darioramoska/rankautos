-- Model -> generation -> trim hierarchy. Until now every trim was a flat car_models row,
-- linked to its siblings only by a shared wikipedia_query string. car_models rows stay the
-- "variant" level (they carry the specs/scores); families and generations sit above them.
CREATE TABLE IF NOT EXISTS model_families (
  id       SERIAL       PRIMARY KEY,
  brand_id INTEGER      NOT NULL REFERENCES brands(id),
  slug     VARCHAR(120) NOT NULL UNIQUE,
  name     VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS generations (
  id        SERIAL      PRIMARY KEY,
  family_id INTEGER     NOT NULL REFERENCES model_families(id) ON DELETE CASCADE,
  label     VARCHAR(80) NOT NULL,          -- e.g. '2024+ Highland', '2019-2023', 'Current'
  year_from SMALLINT,
  year_to   SMALLINT,                      -- NULL = still in production
  UNIQUE (family_id, label)
);

ALTER TABLE car_models
  ADD COLUMN IF NOT EXISTS family_id     INTEGER REFERENCES model_families(id),
  ADD COLUMN IF NOT EXISTS generation_id INTEGER REFERENCES generations(id),
  ADD COLUMN IF NOT EXISTS trim          VARCHAR(120);

CREATE INDEX IF NOT EXISTS idx_car_models_family     ON car_models(family_id);
CREATE INDEX IF NOT EXISTS idx_car_models_generation ON car_models(generation_id);
CREATE INDEX IF NOT EXISTS idx_families_brand        ON model_families(brand_id);

ALTER TABLE model_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations    ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON model_families FOR SELECT USING (true);
CREATE POLICY "public read" ON generations    FOR SELECT USING (true);
