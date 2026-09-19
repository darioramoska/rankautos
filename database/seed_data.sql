-- ============================================================
-- RankAutos — Seed Data (Brands + Car Models)
-- All base scores reviewed by editorial team, May 2026
-- ============================================================

-- ── Brands ──────────────────────────────────────────────────
INSERT INTO brands (slug, display_name, country) VALUES
  ('tesla',       'Tesla',       'US'),
  ('hyundai',     'Hyundai',     'KR'),
  ('kia',         'Kia',         'KR'),
  ('skoda',       'Škoda',       'CZ'),
  ('volkswagen',  'Volkswagen',  'DE'),
  ('audi',        'Audi',        'DE'),
  ('bmw',         'BMW',         'DE'),
  ('volvo',       'Volvo',       'SE'),
  ('ford',        'Ford',        'US'),
  ('renault',     'Renault',     'FR'),
  ('mercedes',    'Mercedes',    'DE'),
  ('peugeot',     'Peugeot',     'FR'),
  ('toyota',      'Toyota',      'JP'),
  ('citroen',     'Citroën',     'FR'),
  ('fiat',        'Fiat',        'IT'),
  ('cupra',       'Cupra',       'ES'),
  ('nissan',      'Nissan',      'JP'),
  ('mg',          'MG',          'CN'),
  ('opel',        'Opel',        'DE'),
  ('polestar',    'Polestar',    'SE'),
  ('honda',       'Honda',       'JP'),
  ('dacia',       'Dacia',       'RO'),
  ('seat',        'Seat',        'ES'),
  ('jeep',        'Jeep',        'US'),
  ('mini',        'Mini',        'GB'),
  ('alfa-romeo',  'Alfa Romeo',  'IT'),
  ('suzuki',      'Suzuki',      'JP'),
  ('mazda',       'Mazda',       'JP'),
  ('subaru',      'Subaru',      'JP'),
  ('jaguar',      'Jaguar',      'GB'),
  ('porsche',     'Porsche',     'DE'),
  ('lexus',       'Lexus',       'JP'),
  ('ds',          'DS',          'FR'),
  ('smart',       'Smart',       'DE'),
  ('byd',         'BYD',         'CN'),
  ('genesis',     'Genesis',     'KR'),
  ('alpine',      'Alpine',      'FR'),
  ('land-rover',  'Land Rover',  'GB'),
  ('cadillac',    'Cadillac',    'US'),
  ('lancia',      'Lancia',      'IT'),
  ('xpeng',       'Xpeng',       'CN'),
  ('leapmotor',   'Leapmotor',   'CN'),
  ('ineos',       'Ineos',       'GB'),
  ('lotus',       'Lotus',       'GB'),
  ('vinfast',     'VinFast',     'VN'),
  ('omoda',       'Omoda',       'CN'),
  ('ora',         'ORA',         'CN'),
  ('maserati',    'Maserati',    'IT');

-- ── Car Models ──────────────────────────────────────────────
-- (brand_id values assume brands inserted in above order: 1=Tesla, 2=Hyundai, etc.)

INSERT INTO car_models (
  brand_id, slug, display_name, full_name,
  body_type, fuel_type, transmission, seats,
  msrp_eur, range_km, boot_litres, charge_kw, ncap_stars, model_year,
  brand_color, badge_label, wikipedia_query,
  score_range, score_safety, score_practicality, score_tech,
  score_reliability, score_value, score_charging
) VALUES

-- Tesla Model Y Long Range
(1, 'tesla-model-y-lr', 'Model Y Long Range AWD (2020-2024)', 'Tesla Model Y Long Range AWD (2020-2024)',
 'SUV', 'Electric', 'Automatic', 5,
 44990, 533, 854, 250, 5, 2022,
 '#cc0000', NULL, 'Tesla Model Y',
 9.0, 9.5, 8.8, 9.2, 7.0, 7.8, 9.2),

-- Tesla Model Y Long Range AWD (2025+ Juniper) -- current generation, real higher range.
(1, 'tesla-model-y-lr-juniper', 'Model Y Long Range AWD (2025+ Juniper)', 'Tesla Model Y Long Range AWD (2025+ Juniper)',
 'SUV', 'Electric', 'Automatic', 5,
 52990, 622, 854, 250, 5, 2024,
 '#cc0000', 'Best Seller', 'Tesla Model Y',
 9.5, 9.5, 8.8, 9.8, 7.2, 7.2, 9.5),

-- Tesla Model Y Standard RWD -- distinct trim.
(1, 'tesla-model-y-standard-rwd', 'Model Y Standard RWD', 'Tesla Model Y Standard RWD',
 'SUV', 'Electric', 'Automatic', 5,
 44990, 466, 854, 175, 5, 2024,
 '#cc0000', 'Best Value', 'Tesla Model Y',
 7.5, 9.5, 8.8, 9.0, 7.2, 8.8, 7.5),

-- Tesla Model Y Performance -- distinct trim.
(1, 'tesla-model-y-performance', 'Model Y Performance', 'Tesla Model Y Performance',
 'SUV', 'Electric', 'Automatic', 5,
 59990, 514, 854, 250, 5, 2024,
 '#1a1a1a', 'Fastest', 'Tesla Model Y',
 8.2, 9.5, 8.8, 9.8, 7.2, 6.2, 9.5),

-- Hyundai Ioniq 5 RWD
(2, 'hyundai-ioniq5-rwd', 'Ioniq 5 RWD', 'Hyundai Ioniq 5 RWD',
 'SUV', 'Electric', 'Automatic', 5,
 41900, 507, 527, 220, 5, 2024,
 '#1a4d8f', 'Top Rated', 'Hyundai Ioniq 5',
 8.8, 9.5, 7.8, 9.0, 8.5, 8.5, 9.2),

-- Kia EV6 Standard RWD
(3, 'kia-ev6-std-rwd', 'EV6 Standard RWD', 'Kia EV6 Standard RWD',
 'Crossover', 'Electric', 'Automatic', 5,
 40990, 394, 480, 233, 5, 2024,
 '#2e7d32', NULL, 'Kia EV6',
 7.5, 9.5, 7.5, 8.8, 8.5, 8.8, 9.3),

-- Škoda Enyaq 85
(4, 'skoda-enyaq-85', 'Enyaq 85', 'Škoda Enyaq 85',
 'SUV', 'Electric', 'Automatic', 5,
 39950, 566, 585, 135, 5, 2024,
 '#444444', 'Best Range', 'Škoda Enyaq',
 9.5, 8.5, 8.5, 7.5, 8.0, 8.8, 7.5),

-- Volkswagen ID.4 Pro
(5, 'vw-id4-pro', 'ID.4 Pro', 'Volkswagen ID.4 Pro',
 'SUV', 'Electric', 'Automatic', 5,
 43995, 529, 543, 135, 5, 2024,
 '#1565c0', NULL, 'Volkswagen ID.4',
 9.0, 9.0, 8.0, 8.0, 8.5, 8.0, 7.5),

-- Audi Q4 e-tron 40
(6, 'audi-q4-etron-40', 'Q4 e-tron 40', 'Audi Q4 e-tron 40',
 'SUV', 'Electric', 'Automatic', 5,
 47300, 521, 520, 135, 5, 2024,
 '#8d1e1e', NULL, 'Audi Q4 e-tron',
 9.0, 9.0, 7.8, 8.0, 7.8, 7.0, 7.5),

-- BMW iX3 M Sport
(7, 'bmw-ix3-msport', 'iX3 M Sport', 'BMW iX3 M Sport',
 'SUV', 'Electric', 'Automatic', 5,
 55900, 460, 510, 150, 5, 2024,
 '#1c2d6b', NULL, 'BMW iX3',
 8.2, 9.0, 7.8, 8.5, 8.0, 6.5, 7.8),

-- Volvo EX40 Single Motor
(8, 'volvo-ex40-sm', 'EX40 Single Motor', 'Volvo EX40 Single Motor',
 'SUV', 'Electric', 'Automatic', 5,
 43350, 437, 419, 150, 5, 2024,
 '#1b3a2d', 'Safest', 'Volvo EX40',
 8.0, 9.5, 7.0, 8.2, 8.5, 7.5, 7.8),

-- Ford Mustang Mach-E AWD
(9, 'ford-mach-e-awd', 'Mach-E AWD', 'Ford Mustang Mach-E AWD',
 'SUV', 'Electric', 'Automatic', 5,
 46900, 490, 402, 135, 5, 2024,
 '#003087', NULL, 'Ford Mustang Mach-E',
 8.8, 9.0, 7.0, 8.5, 7.0, 7.0, 7.5),

-- Renault Megane E-Tech 220
(10, 'renault-megane-etech-220', 'Megane E-Tech 220', 'Renault Megane E-Tech 220',
 'Hatchback', 'Electric', 'Automatic', 5,
 34990, 450, 440, 130, 5, 2024,
 '#c8860a', 'Best Value', 'Renault Megane E-Tech Electric',
 8.2, 9.0, 7.2, 8.0, 7.5, 9.0, 7.2),

-- Mercedes EQA 250+
(11, 'mercedes-eqa-250plus', 'EQA 250+', 'Mercedes EQA 250+',
 'SUV', 'Electric', 'Automatic', 5,
 46500, 426, 340, 100, 5, 2024,
 '#888888', NULL, 'Mercedes-Benz EQA',
 7.8, 9.0, 6.5, 8.5, 7.5, 6.5, 6.5),

-- Peugeot e-2008 GT
(12, 'peugeot-e2008-gt', 'e-2008 GT', 'Peugeot e-2008 GT',
 'Crossover', 'Electric', 'Automatic', 5,
 35900, 400, 434, 100, 4, 2024,
 '#5c3b9e', NULL, 'Peugeot e-2008',
 7.5, 8.0, 7.2, 7.5, 7.5, 8.5, 6.5),

-- Toyota RAV4 Hybrid AWD
(13, 'toyota-rav4-hybrid-awd', 'RAV4 Hybrid AWD', 'Toyota RAV4 Hybrid AWD',
 'SUV', 'Hybrid', 'Automatic', 5,
 37900, 950, 580, 0, 5, 2024,
 '#c41230', 'Most Reliable', 'Toyota RAV4 fifth generation',
 8.0, 9.0, 8.8, 7.5, 9.5, 8.5, 1.5),

-- Volvo XC60 Recharge T6
(8, 'volvo-xc60-recharge-t6', 'XC60 Recharge T6', 'Volvo XC60 Recharge T6',
 'SUV', 'PHEV', 'Automatic', 5,
 57900, 800, 505, 50, 5, 2024,
 '#1b3a2d', NULL, 'Volvo XC60 second generation',
 7.5, 9.5, 8.0, 8.8, 8.5, 6.0, 5.5),

-- Peugeot 308 SW Hybrid
(12, 'peugeot-308sw-hybrid', '308 SW Hybrid', 'Peugeot 308 SW Hybrid',
 'Estate', 'Hybrid', 'Automatic', 5,
 38900, 720, 608, 50, 5, 2024,
 '#5c3b9e', 'Most Practical', 'Peugeot 308 third generation',
 8.5, 8.5, 9.0, 7.5, 8.0, 8.5, 5.0),

-- Volkswagen Golf 1.5 eTSI
(5, 'vw-golf-etsi', 'Golf 1.5 eTSI', 'Volkswagen Golf 1.5 eTSI',
 'Hatchback', 'Petrol', 'Manual', 5,
 28990, 900, 380, 0, 5, 2024,
 '#1565c0', NULL, 'Volkswagen Golf Mk8',
 7.5, 9.0, 7.0, 7.5, 8.8, 9.5, NULL),

-- BMW 3 Series 318i
(7, 'bmw-3series-318i', '3 Series 318i', 'BMW 3 Series 318i',
 'Sedan', 'Petrol', 'Automatic', 5,
 39900, 850, 480, 0, 5, 2024,
 '#1c2d6b', NULL, 'BMW 3 Series G20',
 8.0, 9.0, 7.5, 8.0, 8.0, 7.0, NULL);

-- ============================================================
-- Seed Data — Catalog Expansion (Sept 2026)
-- Additional models compiled from publicly published manufacturer specs
-- (not scraped listings — these are catalog/reference rows). Base scores
-- are editorial, calibrated the same way as the original 17-model set.
-- ============================================================

INSERT INTO car_models (
  brand_id, slug, display_name, full_name,
  body_type, fuel_type, transmission, seats,
  msrp_eur, range_km, boot_litres, charge_kw, ncap_stars, model_year,
  brand_color, badge_label, wikipedia_query,
  score_range, score_safety, score_practicality, score_tech,
  score_reliability, score_value, score_charging
) VALUES

-- Renault 5 E-Tech Evolution
(10, 'renault-5-etech-evolution', '5 E-Tech Evolution', 'Renault 5 E-Tech Evolution',
 'Hatchback', 'Electric', 'Automatic', 5,
 25000, 400, 326, 100, 5, 2025,
 '#ffcc00', 'City Favourite', 'Renault 5 E-Tech Electric',
 7.0, 8.5, 6.5, 8.0, 7.5, 9.2, 7.5),

-- Citroën ë-C3 Standard Range
(14, 'citroen-ec3-standard', 'ë-C3 Standard Range', 'Citroën ë-C3 Standard Range',
 'Hatchback', 'Electric', 'Automatic', 5,
 23300, 325, 310, 100, 4, 2024,
 '#c9a227', NULL, 'Citroën ë-C3',
 6.0, 7.5, 6.0, 6.5, 7.0, 9.5, 6.5),

-- Fiat Grande Panda Electric
(15, 'fiat-grande-panda-electric', 'Grande Panda Electric', 'Fiat Grande Panda Electric',
 'Hatchback', 'Electric', 'Automatic', 5,
 24000, 320, 361, 100, 4, 2025,
 '#7a1f2b', NULL, 'Fiat Grande Panda',
 6.2, 7.5, 6.8, 6.5, 7.5, 9.0, 6.8),

-- Volvo EX30 Single Motor Extended Range
(8, 'volvo-ex30-sm-extended', 'EX30 Single Motor Extended Range', 'Volvo EX30 Single Motor Extended Range',
 'Crossover', 'Electric', 'Automatic', 5,
 36000, 480, 318, 153, 5, 2024,
 '#0a0a0a', 'Best Design', 'Volvo EX30',
 8.3, 9.0, 6.0, 9.0, 7.5, 8.0, 8.5),

-- BMW iX2 eDrive20
(7, 'bmw-ix2-edrive20', 'iX2 eDrive20', 'BMW iX2 eDrive20',
 'Crossover', 'Electric', 'Automatic', 5,
 47000, 460, 525, 130, 5, 2025,
 '#6f7378', NULL, 'BMW iX2',
 8.0, 9.0, 7.5, 9.0, 7.8, 6.5, 8.0),

-- Škoda Elroq 85
(4, 'skoda-elroq-85', 'Elroq 85', 'Škoda Elroq 85',
 'SUV', 'Electric', 'Automatic', 5,
 44000, 560, 470, 175, 5, 2025,
 '#4a4a4a', 'Best Range', 'Škoda Elroq',
 9.3, 9.0, 8.5, 8.0, 8.0, 8.5, 8.8),

-- Cupra Born
(16, 'cupra-born', 'Born', 'Cupra Born',
 'Hatchback', 'Electric', 'Automatic', 5,
 38000, 420, 385, 135, 5, 2024,
 '#c8102e', NULL, 'Cupra Born',
 7.8, 8.8, 6.8, 8.2, 7.5, 7.0, 8.0),

-- Nissan Ariya 87kWh
(17, 'nissan-ariya-87kwh', 'Ariya 87kWh', 'Nissan Ariya 87kWh',
 'SUV', 'Electric', 'Automatic', 5,
 46000, 500, 466, 130, 5, 2024,
 '#c3002f', NULL, 'Nissan Ariya',
 8.7, 8.8, 7.8, 8.0, 7.5, 6.5, 8.0),

-- MG4 Electric Trophy
(18, 'mg4-electric-trophy', '4 Electric Trophy', 'MG4 Electric Trophy',
 'Hatchback', 'Electric', 'Automatic', 5,
 31000, 450, 363, 135, 5, 2024,
 '#ff4d4f', 'Best Value EV', 'MG4 Electric',
 8.0, 8.5, 7.0, 7.5, 7.0, 9.5, 8.0),

-- Opel Astra Electric
(19, 'opel-astra-electric', 'Astra Electric', 'Opel Astra Electric',
 'Hatchback', 'Electric', 'Automatic', 5,
 40000, 416, 352, 100, 5, 2024,
 '#f6a600', NULL, 'Opel Astra Electric',
 7.6, 8.8, 6.8, 7.5, 7.5, 6.8, 7.0),

-- Polestar 2 Long Range Single Motor
(20, 'polestar-2-lr-single', '2 Long Range Single Motor', 'Polestar 2 Long Range Single Motor',
 'Sedan', 'Electric', 'Automatic', 5,
 48000, 540, 405, 205, 5, 2024,
 '#14213d', NULL, 'Polestar 2',
 9.0, 9.0, 7.0, 8.8, 7.5, 6.5, 9.0),

-- Mercedes EQB 250+
(11, 'mercedes-eqb-250plus', 'EQB 250+', 'Mercedes EQB 250+',
 'SUV', 'Electric', 'Automatic', 5,
 52000, 423, 465, 100, 5, 2024,
 '#a3a3a3', NULL, 'Mercedes-Benz EQB',
 7.5, 9.0, 8.0, 8.5, 7.5, 5.8, 6.8),

-- Kia Niro EV
(3, 'kia-niro-ev', 'Niro EV', 'Kia Niro EV',
 'Crossover', 'Electric', 'Automatic', 5,
 40000, 460, 475, 85, 5, 2024,
 '#05141f', 'Most Practical EV', 'Kia Niro EV',
 8.4, 9.0, 8.5, 8.0, 8.5, 7.5, 6.5),

-- Toyota Yaris Cross Hybrid
(13, 'toyota-yaris-cross-hybrid', 'Yaris Cross Hybrid', 'Toyota Yaris Cross Hybrid',
 'Crossover', 'Hybrid', 'Automatic', 5,
 28000, 900, 320, 0, 5, 2024,
 '#eb0a1e', NULL, 'Toyota Yaris Cross',
 8.0, 8.8, 7.0, 6.5, 9.5, 9.0, NULL),

-- Honda CR-V Hybrid
(21, 'honda-crv-hybrid', 'CR-V Hybrid', 'Honda CR-V Hybrid',
 'SUV', 'Hybrid', 'Automatic', 5,
 43000, 950, 587, 0, 5, 2024,
 '#6e6e6e', 'Most Reliable SUV', 'Honda CR-V',
 7.8, 9.0, 8.8, 7.5, 9.5, 7.0, NULL),

-- Kia Sportage HEV
(3, 'kia-sportage-hev', 'Sportage HEV', 'Kia Sportage HEV',
 'SUV', 'Hybrid', 'Automatic', 5,
 36000, 900, 587, 0, 5, 2024,
 '#b8860b', NULL, 'Kia Sportage',
 7.5, 9.0, 8.8, 8.0, 8.5, 8.5, NULL),

-- Ford Kuga PHEV
(9, 'ford-kuga-phev', 'Kuga PHEV', 'Ford Kuga PHEV',
 'Crossover', 'PHEV', 'Automatic', 5,
 42000, 700, 456, 50, 4, 2024,
 '#003478', NULL, 'Ford Kuga',
 7.0, 7.8, 8.0, 7.5, 7.0, 6.5, 5.5),

-- Cupra Formentor VZe
(16, 'cupra-formentor-vze', 'Formentor VZe', 'Cupra Formentor VZe',
 'Crossover', 'PHEV', 'Automatic', 5,
 48000, 800, 345, 50, 5, 2024,
 '#4b4b4b', NULL, 'Cupra Formentor',
 7.5, 8.8, 6.5, 8.5, 7.5, 6.0, 5.5),

-- Volkswagen T-Roc 1.5 TSI
(5, 'vw-troc-15tsi', 'T-Roc 1.5 TSI', 'Volkswagen T-Roc 1.5 TSI',
 'Crossover', 'Petrol', 'Manual', 5,
 31000, 750, 445, 0, 4, 2024,
 '#58595b', NULL, 'Volkswagen T-Roc',
 6.5, 8.0, 7.2, 7.0, 8.5, 8.0, NULL),

-- Dacia Duster TCe 130
(22, 'dacia-duster-tce130', 'Duster TCe 130', 'Dacia Duster TCe 130',
 'Crossover', 'Petrol', 'Manual', 5,
 19500, 850, 517, 0, 3, 2024,
 '#6d7b6a', 'Best Value', 'Dacia Duster',
 6.8, 6.0, 8.5, 5.5, 8.0, 9.8, NULL),

-- Ford Puma 1.0 EcoBoost
(9, 'ford-puma-ecoboost', 'Puma 1.0 EcoBoost', 'Ford Puma 1.0 EcoBoost',
 'Crossover', 'Petrol', 'Manual', 5,
 26000, 800, 456, 0, 5, 2024,
 '#d62839', 'Best Boot Space', 'Ford Puma',
 6.8, 8.5, 8.2, 7.0, 8.0, 8.5, NULL),

-- Škoda Octavia Combi 1.5 TSI
(4, 'skoda-octavia-combi-15tsi', 'Octavia Combi 1.5 TSI', 'Škoda Octavia Combi 1.5 TSI',
 'Estate', 'Petrol', 'Automatic', 5,
 32000, 900, 640, 0, 5, 2024,
 '#0e4c2f', 'Biggest Boot', 'Škoda Octavia',
 7.2, 8.5, 9.5, 7.5, 8.5, 8.5, NULL),

-- Seat Leon 1.5 eTSI
(23, 'seat-leon-15etsi', 'Leon 1.5 eTSI', 'Seat Leon 1.5 eTSI',
 'Hatchback', 'Petrol', 'Manual', 5,
 27000, 800, 380, 0, 5, 2024,
 '#e4002b', NULL, 'SEAT Leon',
 6.8, 8.2, 6.8, 7.0, 7.8, 8.2, NULL),

-- Peugeot 3008 Hybrid 48V
(12, 'peugeot-3008-hybrid48v', '3008 Hybrid 48V', 'Peugeot 3008 Hybrid 48V',
 'Crossover', 'Hybrid', 'Automatic', 5,
 37000, 850, 520, 0, 5, 2024,
 '#1c1c1c', NULL, 'Peugeot 3008',
 7.5, 8.8, 7.8, 8.5, 7.5, 7.0, NULL),

-- Renault Clio E-Tech Hybrid
(10, 'renault-clio-etech-hybrid', 'Clio E-Tech Hybrid', 'Renault Clio E-Tech Hybrid',
 'Hatchback', 'Hybrid', 'Automatic', 5,
 24000, 850, 301, 0, 4, 2024,
 '#f7c600', 'Best Small Hybrid', 'Renault Clio',
 7.2, 7.8, 6.5, 7.0, 8.0, 9.0, NULL);

-- ============================================================
-- Seed Data — Catalog Expansion 2 (Sept 2026)
-- Same methodology as Expansion 1: publicly published manufacturer specs,
-- editorial base scores calibrated the same way as the original set.
-- ============================================================

INSERT INTO car_models (
  brand_id, slug, display_name, full_name,
  body_type, fuel_type, transmission, seats,
  msrp_eur, range_km, boot_litres, charge_kw, ncap_stars, model_year,
  brand_color, badge_label, wikipedia_query,
  score_range, score_safety, score_practicality, score_tech,
  score_reliability, score_value, score_charging
) VALUES

-- Tesla Model 3 Long Range AWD (2024+ Highland)
(1, 'tesla-model3-lr-awd', 'Model 3 Long Range AWD (2024+ Highland)', 'Tesla Model 3 Long Range AWD (2024+ Highland)',
 'Sedan', 'Electric', 'Automatic', 5,
 49990, 629, 594, 250, 5, 2024,
 '#cc0000', 'Longest Range', 'Tesla Model 3',
 9.5, 9.5, 8.0, 9.5, 7.5, 7.0, 9.5),

-- Tesla Model 3 Long Range AWD (2019-2023) -- genuinely different hardware
-- (pre-"Highland" refresh), not just an older copy of the row above.
(1, 'tesla-model3-lr-awd-pre-facelift', 'Model 3 Long Range AWD (2019-2023)', 'Tesla Model 3 Long Range AWD (2019-2023)',
 'Sedan', 'Electric', 'Automatic', 5,
 45990, 560, 561, 170, 5, 2022,
 '#cc0000', NULL, 'Tesla Model 3',
 8.2, 9.2, 7.8, 8.5, 7.2, 8.0, 8.0),

-- Tesla Model 3 Standard RWD -- distinct trim, not a discount copy of Long Range.
(1, 'tesla-model3-standard-rwd', 'Model 3 Standard RWD', 'Tesla Model 3 Standard RWD',
 'Sedan', 'Electric', 'Automatic', 5,
 39990, 513, 594, 170, 5, 2024,
 '#cc0000', 'Best Value', 'Tesla Model 3',
 7.8, 9.5, 7.8, 9.0, 7.5, 8.8, 7.5),

-- Tesla Model 3 Performance -- distinct trim, dual-motor/track mode, slightly less
-- range than Long Range AWD in exchange for power.
(1, 'tesla-model3-performance', 'Model 3 Performance', 'Tesla Model 3 Performance',
 'Sedan', 'Electric', 'Automatic', 5,
 54990, 528, 594, 250, 5, 2024,
 '#1a1a1a', 'Fastest', 'Tesla Model 3 Performance',
 8.5, 9.5, 7.8, 9.8, 7.5, 6.0, 9.5),

-- Hyundai Kona Electric 65kWh
(2, 'hyundai-kona-electric-65', 'Kona Electric 65kWh', 'Hyundai Kona Electric 65kWh',
 'Crossover', 'Electric', 'Automatic', 5,
 38000, 490, 466, 102, 5, 2024,
 '#1a4d8f', NULL, 'Hyundai Kona Electric',
 8.5, 8.8, 7.5, 8.0, 8.0, 7.5, 7.0),

-- Kia Picanto 1.0
(3, 'kia-picanto-10', 'Picanto 1.0', 'Kia Picanto 1.0',
 'Hatchback', 'Petrol', 'Manual', 5,
 14000, 700, 255, 0, 4, 2024,
 '#e0a800', 'Cheapest New Car', 'Kia Picanto',
 6.0, 6.5, 5.5, 5.0, 8.5, 9.5, NULL),

-- Škoda Kamiq 1.0 TSI
(4, 'skoda-kamiq-10tsi', 'Kamiq 1.0 TSI', 'Škoda Kamiq 1.0 TSI',
 'Crossover', 'Petrol', 'Manual', 5,
 24000, 780, 400, 0, 4, 2024,
 '#4a4a4a', NULL, 'Škoda Kamiq',
 6.5, 7.8, 7.5, 6.8, 8.2, 8.3, NULL),

-- Volkswagen Tiguan eHybrid
(5, 'vw-tiguan-ehybrid', 'Tiguan eHybrid', 'Volkswagen Tiguan eHybrid',
 'SUV', 'PHEV', 'Automatic', 5,
 44000, 750, 490, 50, 5, 2024,
 '#1565c0', NULL, 'Volkswagen Tiguan',
 7.2, 9.0, 8.2, 8.0, 7.8, 6.5, 5.5),

-- Audi A3 Sportback 35 TFSI
(6, 'audi-a3-sportback-35tfsi', 'A3 Sportback 35 TFSI', 'Audi A3 Sportback 35 TFSI',
 'Hatchback', 'Petrol', 'Automatic', 5,
 36000, 800, 380, 0, 5, 2024,
 '#8d1e1e', NULL, 'Audi A3',
 6.8, 8.5, 6.5, 8.0, 7.8, 6.8, NULL),

-- BMW i4 eDrive40
(7, 'bmw-i4-edrive40', 'i4 eDrive40', 'BMW i4 eDrive40',
 'Sedan', 'Electric', 'Automatic', 5,
 58000, 590, 470, 205, 5, 2024,
 '#1c2d6b', 'Best Handling', 'BMW i4',
 9.2, 9.0, 7.2, 9.0, 7.8, 6.0, 9.0),

-- Volvo XC40 Recharge Single Motor
(8, 'volvo-xc40-recharge-sm', 'XC40 Recharge Single Motor', 'Volvo XC40 Recharge Single Motor',
 'SUV', 'Electric', 'Automatic', 5,
 45000, 460, 419, 130, 5, 2024,
 '#1b3a2d', NULL, 'Volvo XC40',
 8.0, 9.5, 7.2, 8.2, 8.0, 6.8, 7.5),

-- Ford Explorer EV Extended Range
(9, 'ford-explorer-ev-extended', 'Explorer EV Extended Range', 'Ford Explorer EV Extended Range',
 'SUV', 'Electric', 'Automatic', 5,
 47000, 602, 470, 135, 5, 2024,
 '#003087', NULL, 'Ford Explorer (Europe)',
 9.3, 8.8, 7.8, 8.5, 7.0, 7.0, 7.8),

-- Renault Captur E-Tech Hybrid
(10, 'renault-captur-etech-hybrid', 'Captur E-Tech Hybrid', 'Renault Captur E-Tech Hybrid',
 'Crossover', 'Hybrid', 'Automatic', 5,
 29000, 850, 422, 0, 5, 2024,
 '#c8860a', NULL, 'Renault Captur',
 7.5, 8.2, 7.5, 7.2, 7.8, 8.5, NULL),

-- Mercedes GLC 300e
(11, 'mercedes-glc-300e', 'GLC 300e', 'Mercedes GLC 300e',
 'SUV', 'PHEV', 'Automatic', 5,
 62000, 850, 550, 60, 5, 2024,
 '#888888', 'Longest Electric Range PHEV', 'Mercedes-Benz GLC',
 8.5, 9.2, 8.5, 9.0, 7.5, 5.5, 6.5),

-- Peugeot 208 PureTech 100
(12, 'peugeot-208-puretech100', '208 PureTech 100', 'Peugeot 208 PureTech 100',
 'Hatchback', 'Petrol', 'Manual', 5,
 22000, 750, 311, 0, 5, 2024,
 '#5c3b9e', NULL, 'Peugeot 208',
 6.5, 8.0, 6.2, 7.0, 7.8, 8.5, NULL),

-- Toyota Corolla Touring Sports Hybrid
(13, 'toyota-corolla-touring-hybrid', 'Corolla Touring Sports Hybrid', 'Toyota Corolla Touring Sports Hybrid',
 'Estate', 'Hybrid', 'Automatic', 5,
 32000, 950, 596, 0, 5, 2024,
 '#c41230', 'Most Efficient Estate', 'Toyota Corolla (E210)',
 8.2, 9.0, 9.0, 7.5, 9.5, 8.0, NULL),

-- Citroën ë-C4
(14, 'citroen-ec4', 'ë-C4', 'Citroën ë-C4',
 'Crossover', 'Electric', 'Automatic', 5,
 36000, 420, 380, 100, 4, 2024,
 '#c9a227', NULL, 'Citroën ë-C4',
 7.5, 7.8, 7.0, 7.2, 7.2, 7.8, 7.0),

-- Nissan Qashqai e-Power
(17, 'nissan-qashqai-epower', 'Qashqai e-Power', 'Nissan Qashqai e-Power',
 'Crossover', 'Hybrid', 'Automatic', 5,
 37000, 750, 504, 0, 5, 2024,
 '#c3002f', NULL, 'Nissan Qashqai',
 7.2, 8.8, 8.2, 8.0, 7.8, 7.5, NULL),

-- Kia Sorento Hybrid
(3, 'kia-sorento-hybrid', 'Sorento Hybrid', 'Kia Sorento Hybrid',
 'SUV', 'Hybrid', 'Automatic', 7,
 46000, 850, 608, 0, 5, 2024,
 '#05141f', 'Best 7-Seater', 'Kia Sorento',
 7.5, 9.0, 9.2, 8.0, 8.5, 7.5, NULL),

-- Jeep Avenger Electric
(24, 'jeep-avenger-electric', 'Avenger Electric', 'Jeep Avenger Electric',
 'Crossover', 'Electric', 'Automatic', 5,
 38000, 400, 355, 100, 5, 2024,
 '#3c4a3e', NULL, 'Jeep Avenger',
 7.0, 8.8, 6.8, 7.0, 6.8, 6.8, 7.0),

-- Mini Cooper Electric SE
(25, 'mini-cooper-electric-se', 'Cooper Electric SE', 'Mini Cooper Electric SE',
 'Hatchback', 'Electric', 'Automatic', 4,
 35000, 402, 210, 95, 4, 2024,
 '#1a1a1a', 'Most Fun to Drive', 'Mini Cooper (2024)',
 6.8, 7.5, 4.5, 8.2, 7.2, 6.5, 6.8),

-- Alfa Romeo Tonale PHEV
(26, 'alfa-romeo-tonale-phev', 'Tonale PHEV', 'Alfa Romeo Tonale PHEV',
 'Crossover', 'PHEV', 'Automatic', 5,
 48000, 700, 500, 50, 5, 2024,
 '#8d1e1e', NULL, 'Alfa Romeo Tonale',
 7.2, 8.8, 7.0, 7.8, 6.8, 5.8, 5.0),

-- Suzuki Vitara Hybrid
(27, 'suzuki-vitara-hybrid', 'Vitara Hybrid', 'Suzuki Vitara Hybrid',
 'Crossover', 'Hybrid', 'Manual', 5,
 27000, 800, 375, 0, 4, 2024,
 '#1565c0', NULL, 'Suzuki Vitara',
 6.8, 7.2, 7.0, 6.0, 8.5, 8.2, NULL),

-- Mazda CX-30
(28, 'mazda-cx30', 'CX-30', 'Mazda CX-30',
 'Crossover', 'Petrol', 'Manual', 5,
 28000, 750, 430, 0, 5, 2024,
 '#7a1f2b', NULL, 'Mazda CX-30',
 6.5, 8.8, 7.2, 7.2, 8.5, 7.8, NULL),

-- Subaru Crosstrek e-Boxer
(29, 'subaru-crosstrek-eboxer', 'Crosstrek e-Boxer', 'Subaru Crosstrek e-Boxer',
 'Crossover', 'Hybrid', 'Automatic', 5,
 33000, 750, 315, 0, 5, 2024,
 '#1b3a2d', 'Best AWD Standard', 'Subaru Crosstrek',
 6.5, 9.0, 7.0, 6.5, 8.8, 7.0, NULL),

-- Jaguar I-Pace
(30, 'jaguar-ipace', 'I-Pace', 'Jaguar I-Pace',
 'SUV', 'Electric', 'Automatic', 5,
 72000, 470, 505, 100, 5, 2024,
 '#0a0a0a', NULL, 'Jaguar I-Pace',
 7.8, 8.8, 7.5, 7.8, 6.5, 4.5, 6.5),

-- Porsche Macan 4 Electric
(31, 'porsche-macan4-electric', 'Macan 4 Electric', 'Porsche Macan 4 Electric',
 'SUV', 'Electric', 'Automatic', 5,
 82000, 570, 540, 270, 5, 2025,
 '#1c1c1c', 'Fastest Charging', 'Porsche Macan (second generation)',
 9.0, 9.2, 7.5, 9.5, 7.0, 4.0, 9.8),

-- Lexus NX 350h
(32, 'lexus-nx-350h', 'NX 350h', 'Lexus NX 350h',
 'SUV', 'Hybrid', 'Automatic', 5,
 52000, 900, 520, 0, 5, 2024,
 '#4a4a4a', NULL, 'Lexus NX',
 7.5, 9.2, 7.8, 8.2, 9.5, 6.0, NULL),

-- DS 3 E-Tense
(33, 'ds-3-etense', '3 E-Tense', 'DS 3 E-Tense',
 'Crossover', 'Electric', 'Automatic', 5,
 39000, 400, 350, 100, 5, 2024,
 '#1c1c1c', NULL, 'DS 3 (automobile)',
 6.8, 8.2, 6.5, 8.0, 7.0, 6.2, 7.0),

-- Smart #1 Pro
(34, 'smart-1-pro', '#1 Pro', 'Smart #1 Pro',
 'Crossover', 'Electric', 'Automatic', 5,
 38800, 420, 411, 150, 5, 2024,
 '#e4002b', NULL, 'Smart #1',
 7.2, 8.8, 6.8, 8.5, 7.0, 6.5, 7.8),

-- BYD Atto 3
(35, 'byd-atto3', 'Atto 3', 'BYD Atto 3',
 'Crossover', 'Electric', 'Automatic', 5,
 38000, 420, 440, 88, 5, 2024,
 '#003478', 'Best Warranty', 'BYD Atto 3',
 7.2, 8.5, 7.5, 8.0, 7.5, 7.8, 6.5),

-- Genesis GV60
(36, 'genesis-gv60', 'GV60', 'Genesis GV60',
 'Crossover', 'Electric', 'Automatic', 5,
 65000, 490, 432, 235, 5, 2024,
 '#14213d', NULL, 'Genesis GV60',
 8.2, 9.2, 7.2, 9.2, 7.5, 5.0, 9.2),

-- Alpine A290 GT Performance
(37, 'alpine-a290-gt-performance', 'A290 GT Performance', 'Alpine A290 GT Performance',
 'Hatchback', 'Electric', 'Automatic', 4,
 38000, 380, 326, 100, 5, 2024,
 '#003399', 'Best Hot Hatch EV', 'Alpine A290',
 6.5, 8.5, 6.2, 8.5, 7.2, 7.5, 7.5);

-- ============================================================
-- Catalog Expansion 3 (+30 models)
-- ============================================================

INSERT INTO car_models (
  brand_id, slug, display_name, full_name,
  body_type, fuel_type, transmission, seats,
  msrp_eur, range_km, boot_litres, charge_kw, ncap_stars, model_year,
  brand_color, badge_label, wikipedia_query,
  score_range, score_safety, score_practicality, score_tech,
  score_reliability, score_value, score_charging
) VALUES

-- Tesla Model X Long Range
(1, 'tesla-model-x-long-range', 'Model X Long Range', 'Tesla Model X Long Range',
 'SUV', 'Electric', 'Automatic', 7,
 89990, 560, 750, 250, 5, 2024,
 '#8a8a8a', NULL, 'Tesla Model X',
 8.8, 9.5, 9, 9.8, 7.2, 6, 9.5),

-- Hyundai Tucson Hybrid
(2, 'hyundai-tucson-hybrid', 'Tucson Hybrid', 'Hyundai Tucson Hybrid',
 'SUV', 'Hybrid', 'Automatic', 5,
 36900, 950, 620, 0, 5, 2024,
 '#1a4d8f', NULL, 'Hyundai Tucson (NX4)',
 7.8, 9, 8.5, 8, 8.5, 8.2, 1.5),

-- Kia Ceed Sportswagon
(3, 'kia-ceed-sportswagon', 'Ceed Sportswagon', 'Kia Ceed Sportswagon',
 'Estate', 'Petrol', 'Manual', 5,
 27900, 850, 625, 0, 5, 2024,
 '#2e7d32', NULL, 'Kia Ceed',
 7.2, 8.5, 8.8, 7, 8.5, 8.8, NULL),

-- Škoda Fabia
(4, 'koda-fabia', 'Fabia', 'Škoda Fabia',
 'Hatchback', 'Petrol', 'Manual', 5,
 21900, 800, 380, 0, 4, 2024,
 '#444444', NULL, 'Škoda Fabia (2021)',
 7, 8, 7.5, 7, 8.5, 9.2, NULL),

-- Volkswagen Polo
(5, 'volkswagen-polo', 'Polo', 'Volkswagen Polo',
 'Hatchback', 'Petrol', 'Manual', 5,
 22900, 820, 351, 0, 5, 2024,
 '#1565c0', NULL, 'Volkswagen Polo (AW)',
 7.2, 8.8, 7.2, 7.5, 8.5, 8.8, NULL),

-- Volkswagen Passat Estate eHybrid
(5, 'volkswagen-passat-estate-ehybrid', 'Passat Estate eHybrid', 'Volkswagen Passat Estate eHybrid',
 'Estate', 'PHEV', 'Automatic', 5,
 45900, 850, 620, 50, 5, 2024,
 '#1565c0', 'Most Practical', 'Volkswagen Passat (B9)',
 8.5, 9, 9, 8.5, 8, 7.5, 6.5),

-- Audi e-tron GT quattro
(6, 'audi-e-tron-gt-quattro', 'e-tron GT quattro', 'Audi e-tron GT quattro',
 'Sedan', 'Electric', 'Automatic', 4,
 104900, 481, 405, 270, 5, 2024,
 '#8d1e1e', NULL, 'Audi e-tron GT',
 8.5, 9.5, 7, 9.5, 7.5, 5.5, 9.5),

-- BMW X1 xDrive25e
(7, 'bmw-x1-xdrive25e', 'X1 xDrive25e', 'BMW X1 xDrive25e',
 'SUV', 'PHEV', 'Automatic', 5,
 47900, 700, 450, 29, 5, 2024,
 '#1c2d6b', NULL, 'BMW X1 (U11)',
 8, 9, 7.8, 8.5, 8, 6.8, 5),

-- Volvo XC90 Recharge T8
(8, 'volvo-xc90-recharge-t8', 'XC90 Recharge T8', 'Volvo XC90 Recharge T8',
 'SUV', 'PHEV', 'Automatic', 7,
 71900, 780, 680, 50, 5, 2024,
 '#1b3a2d', 'Most Practical', 'Volvo XC90 (2015)',
 8, 9.5, 9.2, 9, 8, 6, 6),

-- Ford Focus 1.0 EcoBoost
(9, 'ford-focus-1-0-ecoboost', 'Focus 1.0 EcoBoost', 'Ford Focus 1.0 EcoBoost',
 'Hatchback', 'Petrol', 'Manual', 5,
 26900, 780, 375, 0, 5, 2024,
 '#003087', NULL, 'Ford Focus (fourth generation)',
 7.2, 8.5, 7.5, 7.5, 7.8, 8.5, NULL),

-- Renault Austral E-Tech Hybrid
(10, 'renault-austral-e-tech-hybrid', 'Austral E-Tech Hybrid', 'Renault Austral E-Tech Hybrid',
 'Crossover', 'Hybrid', 'Automatic', 5,
 39900, 900, 500, 0, 5, 2024,
 '#c8860a', NULL, 'Renault Austral',
 8, 9, 8.2, 8.5, 7.8, 8, 1.5),

-- Mercedes A-Class A200
(11, 'mercedes-a-class-a200', 'A-Class A200', 'Mercedes A-Class A200',
 'Hatchback', 'Petrol', 'Automatic', 5,
 36900, 750, 370, 0, 5, 2024,
 '#888888', NULL, 'Mercedes-Benz A-Class (W177)',
 7, 9, 6.8, 8.8, 7.5, 6.5, NULL),

-- Peugeot 508 SW Hybrid
(12, 'peugeot-508-sw-hybrid', '508 SW Hybrid', 'Peugeot 508 SW Hybrid',
 'Estate', 'PHEV', 'Automatic', 5,
 44900, 800, 530, 50, 5, 2024,
 '#5c3b9e', NULL, 'Peugeot 508',
 8.2, 8.5, 8.8, 8, 7.5, 7, 6),

-- Toyota Aygo X
(13, 'toyota-aygo-x', 'Aygo X', 'Toyota Aygo X',
 'Hatchback', 'Petrol', 'Manual', 5,
 17900, 700, 231, 0, 4, 2024,
 '#c41230', 'Best Value', 'Toyota Aygo X',
 6.5, 7.5, 6, 7, 9.2, 9.5, NULL),

-- Toyota C-HR Hybrid
(13, 'toyota-c-hr-hybrid', 'C-HR Hybrid', 'Toyota C-HR Hybrid',
 'Crossover', 'Hybrid', 'Automatic', 5,
 33900, 900, 388, 0, 5, 2024,
 '#c41230', NULL, 'Toyota C-HR (second generation)',
 7.8, 9, 7.2, 8.5, 9.2, 8, 1.5),

-- Citroën C5 Aircross Hybrid
(14, 'citro-n-c5-aircross-hybrid', 'C5 Aircross Hybrid', 'Citroën C5 Aircross Hybrid',
 'SUV', 'PHEV', 'Automatic', 5,
 42900, 780, 460, 50, 5, 2024,
 '#5c3b9e', NULL, 'Citroën C5 Aircross',
 7.8, 8.5, 8.5, 7.8, 7.5, 7.2, 5.5),

-- Nissan Juke Hybrid
(17, 'nissan-juke-hybrid', 'Juke Hybrid', 'Nissan Juke Hybrid',
 'Crossover', 'Hybrid', 'Automatic', 5,
 29900, 850, 354, 0, 4, 2024,
 '#003087', NULL, 'Nissan Juke',
 7.5, 7.8, 6.8, 8, 7.8, 7.8, 1.5),

-- Kia Niro Hybrid
(3, 'kia-niro-hybrid', 'Niro Hybrid', 'Kia Niro Hybrid',
 'Crossover', 'Hybrid', 'Automatic', 5,
 31900, 950, 451, 0, 5, 2024,
 '#2e7d32', NULL, 'Kia Niro',
 8, 9, 8.2, 8.5, 8.5, 8.5, 1.5),

-- Land Rover Range Rover Evoque P200
(38, 'land-rover-range-rover-evoque-p200', 'Range Rover Evoque P200', 'Land Rover Range Rover Evoque P200',
 'SUV', 'Petrol', 'Automatic', 5,
 52900, 700, 472, 0, 5, 2024,
 '#1a1a1a', NULL, 'Range Rover Evoque',
 7.5, 9, 7.5, 8.5, 6.5, 6, NULL),

-- Mini Countryman Electric
(25, 'mini-countryman-electric', 'Countryman Electric', 'Mini Countryman Electric',
 'Crossover', 'Electric', 'Automatic', 5,
 45900, 462, 460, 130, 5, 2024,
 '#1565c0', NULL, 'Mini Countryman (2024)',
 7.8, 9, 7.8, 9, 7.5, 6.5, 7.5),

-- Alfa Romeo Junior Elettrica
(26, 'alfa-romeo-junior-elettrica', 'Junior Elettrica', 'Alfa Romeo Junior Elettrica',
 'Crossover', 'Electric', 'Automatic', 5,
 39900, 410, 400, 100, 5, 2024,
 '#8d1e1e', NULL, 'Alfa Romeo Junior',
 7.2, 8.5, 7, 8.2, 7, 7, 7),

-- Mazda MX-30
(28, 'mazda-mx-30', 'MX-30', 'Mazda MX-30',
 'Crossover', 'Electric', 'Automatic', 5,
 34900, 261, 366, 50, 5, 2024,
 '#cc0000', NULL, 'Mazda MX-30',
 5.5, 8, 6.5, 7.5, 8, 6.5, 5),

-- Subaru Solterra
(29, 'subaru-solterra', 'Solterra', 'Subaru Solterra',
 'SUV', 'Electric', 'Automatic', 5,
 48900, 415, 452, 150, 5, 2024,
 '#1b3a2d', NULL, 'Subaru Solterra',
 7.5, 9.2, 7.5, 7.5, 8, 6.2, 7.8),

-- Jaguar E-Pace
(30, 'jaguar-e-pace', 'E-Pace', 'Jaguar E-Pace',
 'SUV', 'Petrol', 'Automatic', 5,
 46900, 680, 484, 0, 5, 2024,
 '#1c2d6b', NULL, 'Jaguar E-Pace',
 7, 8.8, 7.8, 8, 6.5, 6, NULL),

-- Porsche Taycan
(31, 'porsche-taycan', 'Taycan', 'Porsche Taycan',
 'Sedan', 'Electric', 'Automatic', 4,
 97900, 505, 407, 320, 5, 2024,
 '#1a1a1a', 'Top Rated', 'Porsche Taycan',
 8.8, 9.5, 7.2, 9.5, 7.8, 5.5, 9.8),

-- Lexus RX 450h+
(32, 'lexus-rx-450h', 'RX 450h+', 'Lexus RX 450h+',
 'SUV', 'PHEV', 'Automatic', 5,
 66900, 850, 546, 50, 5, 2024,
 '#888888', NULL, 'Lexus RX (fifth generation)',
 8, 9.2, 8.5, 8.8, 9, 6.5, 5.5),

-- Cadillac Lyriq
(39, 'cadillac-lyriq', 'Lyriq', 'Cadillac Lyriq',
 'SUV', 'Electric', 'Automatic', 5,
 74900, 530, 793, 190, 5, 2024,
 '#1a1a1a', NULL, 'Cadillac Lyriq',
 8.5, 9, 8.8, 8.8, 7, 6, 8.5),

-- Lancia Ypsilon Hybrid
(40, 'lancia-ypsilon-hybrid', 'Ypsilon Hybrid', 'Lancia Ypsilon Hybrid',
 'Hatchback', 'Hybrid', 'Automatic', 5,
 24500, 900, 285, 0, 4, 2024,
 '#5c3b9e', NULL, 'Lancia Ypsilon',
 7, 7.8, 6.5, 7.8, 7.5, 8.2, 1.5),

-- Xpeng G6
(41, 'xpeng-g6', 'G6', 'Xpeng G6',
 'SUV', 'Electric', 'Automatic', 5,
 44900, 570, 571, 280, 5, 2024,
 '#1565c0', 'Best Range', 'XPeng G6',
 9, 9, 8.2, 9.2, 6.5, 7.8, 9.2),

-- Leapmotor T03
(42, 'leapmotor-t03', 'T03', 'Leapmotor T03',
 'Hatchback', 'Electric', 'Automatic', 4,
 19900, 265, 210, 48, 4, 2024,
 '#c8860a', 'Best Value', 'Leapmotor T03',
 5.8, 7, 5.5, 6.8, 6.5, 9.2, 5);

-- ============================================================
-- Catalog Expansion 4 (+30 models)
-- ============================================================

INSERT INTO car_models (
  brand_id, slug, display_name, full_name,
  body_type, fuel_type, transmission, seats,
  msrp_eur, range_km, boot_litres, charge_kw, ncap_stars, model_year,
  brand_color, badge_label, wikipedia_query,
  score_range, score_safety, score_practicality, score_tech,
  score_reliability, score_value, score_charging
) VALUES

-- Toyota bZ4X
(13, 'toyota-bz4x', 'bZ4X', 'Toyota bZ4X',
 'SUV', 'Electric', 'Automatic', 5,
 45900, 516, 452, 150, 5, 2024,
 '#c41230', NULL, 'Toyota bZ4X',
 8.2, 9.2, 7.8, 7.8, 7.5, 6.5, 7.8),

-- Hyundai Bayon
(2, 'hyundai-bayon', 'Bayon', 'Hyundai Bayon',
 'Crossover', 'Petrol', 'Manual', 5,
 22900, 750, 411, 0, 4, 2024,
 '#1a4d8f', NULL, 'Hyundai Bayon',
 7, 7.8, 7.5, 7.5, 8, 8.5, NULL),

-- Kia Stonic
(3, 'kia-stonic', 'Stonic', 'Kia Stonic',
 'Crossover', 'Petrol', 'Manual', 5,
 23900, 780, 352, 0, 4, 2024,
 '#2e7d32', NULL, 'Kia Stonic',
 7, 7.8, 7.2, 7.8, 8.5, 8.5, NULL),

-- Škoda Superb Combi TDI
(4, 'koda-superb-combi-tdi', 'Superb Combi TDI', 'Škoda Superb Combi TDI',
 'Estate', 'Diesel', 'Automatic', 5,
 42900, 1100, 690, 0, 5, 2024,
 '#444444', 'Most Practical', 'Škoda Superb (third generation)',
 8.5, 9, 9.5, 8.5, 8.5, 8, NULL),

-- Volkswagen Touareg TDI
(5, 'volkswagen-touareg-tdi', 'Touareg TDI', 'Volkswagen Touareg TDI',
 'SUV', 'Diesel', 'Automatic', 5,
 68900, 1050, 810, 0, 5, 2024,
 '#1565c0', NULL, 'Volkswagen Touareg',
 8.5, 9.2, 9, 8.5, 8, 6, NULL),

-- BMW 5 Series 520d Touring
(7, 'bmw-5-series-520d-touring', '5 Series 520d Touring', 'BMW 5 Series 520d Touring',
 'Estate', 'Diesel', 'Automatic', 5,
 62900, 1200, 570, 0, 5, 2024,
 '#1c2d6b', 'Best Range', 'BMW 5 Series (G60)',
 9, 9.2, 8.8, 9, 8, 6.2, NULL),

-- Volvo V60 D4
(8, 'volvo-v60-d4', 'V60 D4', 'Volvo V60 D4',
 'Estate', 'Diesel', 'Automatic', 5,
 49900, 1150, 529, 0, 5, 2024,
 '#1b3a2d', NULL, 'Volvo V60',
 8.8, 9.5, 8.5, 8.5, 8.2, 6.5, NULL),

-- Mercedes C220d
(11, 'mercedes-c220d', 'C220d', 'Mercedes C220d',
 'Sedan', 'Diesel', 'Automatic', 5,
 54900, 1100, 455, 0, 5, 2024,
 '#888888', NULL, 'Mercedes-Benz C-Class (W206)',
 8.5, 9.2, 7.8, 9, 7.8, 6, NULL),

-- Audi A6 Avant 40 TDI
(6, 'audi-a6-avant-40-tdi', 'A6 Avant 40 TDI', 'Audi A6 Avant 40 TDI',
 'Estate', 'Diesel', 'Automatic', 5,
 58900, 1150, 565, 0, 5, 2024,
 '#8d1e1e', NULL, 'Audi A6 (C8)',
 8.8, 9.2, 8.8, 8.8, 8, 5.8, NULL),

-- Peugeot 5008 BlueHDi
(12, 'peugeot-5008-bluehdi', '5008 BlueHDi', 'Peugeot 5008 BlueHDi',
 'SUV', 'Diesel', 'Automatic', 7,
 44900, 1050, 634, 0, 5, 2024,
 '#5c3b9e', 'Most Practical', 'Peugeot 5008',
 8.2, 8.8, 9.2, 8.2, 7.8, 7, NULL),

-- Renault Scenic E-Tech
(10, 'renault-scenic-e-tech', 'Scenic E-Tech', 'Renault Scenic E-Tech',
 'Crossover', 'Electric', 'Automatic', 5,
 42900, 620, 545, 150, 5, 2024,
 '#c8860a', 'Best Range', 'Renault Scenic E-Tech',
 9, 9.2, 8.8, 9, 7.5, 7.8, 8.8),

-- Citroën C3 Aircross
(14, 'citro-n-c3-aircross', 'C3 Aircross', 'Citroën C3 Aircross',
 'Crossover', 'Petrol', 'Manual', 5,
 24900, 780, 460, 0, 4, 2024,
 '#5c3b9e', NULL, 'Citroën C3 Aircross',
 7, 7.8, 8.2, 7.5, 7.5, 8.5, NULL),

-- Nissan Leaf
(17, 'nissan-leaf', 'Leaf', 'Nissan Leaf',
 'Hatchback', 'Electric', 'Automatic', 5,
 32900, 385, 435, 100, 4, 2024,
 '#003087', NULL, 'Nissan Leaf',
 6.8, 7.8, 7.5, 7.2, 8.2, 7.8, 6.5),

-- Kia XCeed PHEV
(3, 'kia-xceed-phev', 'XCeed PHEV', 'Kia XCeed PHEV',
 'Crossover', 'PHEV', 'Automatic', 5,
 36900, 700, 291, 45, 5, 2024,
 '#2e7d32', NULL, 'Kia XCeed',
 7.8, 8.5, 6.8, 8.2, 8.2, 7.2, 6),

-- Hyundai i20
(2, 'hyundai-i20', 'i20', 'Hyundai i20',
 'Hatchback', 'Petrol', 'Manual', 5,
 20900, 800, 352, 0, 4, 2024,
 '#1a4d8f', NULL, 'Hyundai i20',
 7, 7.8, 7, 7.8, 8, 8.8, NULL),

-- Toyota Prius
(13, 'toyota-prius', 'Prius', 'Toyota Prius',
 'Sedan', 'Hybrid', 'Automatic', 5,
 39900, 1000, 284, 0, 5, 2024,
 '#c41230', 'Most Efficient', 'Toyota Prius (fifth generation)',
 8.5, 8.8, 7, 8.8, 9.2, 7, 1.5),

-- Honda Civic Hybrid
(21, 'honda-civic-hybrid', 'Civic Hybrid', 'Honda Civic Hybrid',
 'Hatchback', 'Hybrid', 'Automatic', 5,
 34900, 900, 410, 0, 5, 2024,
 '#888888', NULL, 'Honda Civic (eleventh generation)',
 7.8, 8.8, 7.8, 8.5, 8.8, 7.2, 1.5),

-- Mazda 3
(28, 'mazda-3', '3', 'Mazda 3',
 'Hatchback', 'Petrol', 'Manual', 5,
 27900, 800, 351, 0, 5, 2024,
 '#cc0000', NULL, 'Mazda 3 (fourth generation)',
 7.2, 8.8, 7.2, 8, 8.2, 7.8, NULL),

-- Suzuki Swift
(27, 'suzuki-swift', 'Swift', 'Suzuki Swift',
 'Hatchback', 'Hybrid', 'Manual', 5,
 19900, 850, 265, 0, 3, 2024,
 '#f2874d', 'Best Value', 'Suzuki Swift',
 7.2, 6.5, 6.5, 7, 8, 9.2, 1.5),

-- Fiat 600e
(15, 'fiat-600e', '600e', 'Fiat 600e',
 'Crossover', 'Electric', 'Automatic', 5,
 36900, 406, 385, 100, 5, 2024,
 '#1565c0', NULL, 'Fiat 600',
 7.5, 8.2, 7.8, 7.8, 7.5, 7.5, 7.5),

-- Opel Mokka Electric
(19, 'opel-mokka-electric', 'Mokka Electric', 'Opel Mokka Electric',
 'Crossover', 'Electric', 'Automatic', 5,
 37900, 406, 350, 100, 5, 2024,
 '#c8860a', NULL, 'Opel Mokka',
 7.5, 8.2, 7.2, 8, 7.5, 7.2, 7.5),

-- Seat Arona
(23, 'seat-arona', 'Arona', 'Seat Arona',
 'Crossover', 'Petrol', 'Manual', 5,
 23900, 780, 400, 0, 4, 2024,
 '#f2874d', NULL, 'Seat Arona',
 7, 7.8, 7.5, 7.5, 7.8, 8.5, NULL),

-- Škoda Karoq
(4, 'koda-karoq', 'Karoq', 'Škoda Karoq',
 'Crossover', 'Petrol', 'Automatic', 5,
 30900, 800, 521, 0, 5, 2024,
 '#444444', 'Most Practical', 'Škoda Karoq',
 7.5, 9, 8.8, 7.8, 8.5, 8, NULL),

-- Ineos Grenadier
(43, 'ineos-grenadier', 'Grenadier', 'Ineos Grenadier',
 'SUV', 'Diesel', 'Automatic', 5,
 74900, 900, 2000, 0, 3, 2024,
 '#1a1a1a', NULL, 'Ineos Grenadier',
 6, 7.5, 9.5, 5.5, 6.5, 4.5, NULL),

-- Lotus Eletre
(44, 'lotus-eletre', 'Eletre', 'Lotus Eletre',
 'SUV', 'Electric', 'Automatic', 5,
 95900, 600, 688, 350, 5, 2024,
 '#1a1a1a', 'Fastest Charging', 'Lotus Eletre',
 9.2, 9, 8, 9.5, 6.5, 4.5, 9.8),

-- VinFast VF8
(45, 'vinfast-vf8', 'VF8', 'VinFast VF8',
 'SUV', 'Electric', 'Automatic', 5,
 52900, 420, 466, 150, 5, 2024,
 '#003478', NULL, 'VinFast VF 8',
 6.8, 8.5, 8, 7.5, 6, 6.5, 7),

-- Omoda 5
(46, 'omoda-5', '5', 'Omoda 5',
 'Crossover', 'Petrol', 'Automatic', 5,
 27900, 750, 380, 0, 5, 2024,
 '#8d1e1e', NULL, 'Omoda 5',
 7, 8.2, 7.5, 8.2, 6.8, 8.2, NULL),

-- ORA 03
(47, 'ora-03', '03', 'ORA 03',
 'Hatchback', 'Electric', 'Automatic', 5,
 34900, 420, 228, 80, 5, 2024,
 '#f6a15a', NULL, 'Ora 03',
 7.5, 8.2, 6.5, 7.8, 6.5, 7.2, 7),

-- Maserati Grecale
(48, 'maserati-grecale', 'Grecale', 'Maserati Grecale',
 'SUV', 'Petrol', 'Automatic', 5,
 79900, 650, 535, 0, 5, 2024,
 '#1a1a1a', NULL, 'Maserati Grecale',
 7.8, 8.8, 7.8, 9, 6.5, 4.8, NULL),

-- Volkswagen Golf GTI Clubsport
(5, 'volkswagen-golf-gti-clubsport', 'Golf GTI Clubsport', 'Volkswagen Golf GTI Clubsport',
 'Hatchback', 'Petrol', 'Automatic', 5,
 44900, 700, 374, 0, 5, 2024,
 '#1a1a1a', 'Best Hot Hatch', 'Volkswagen Golf GTI',
 7.2, 9, 7, 8.2, 8, 6.5, NULL);

-- ============================================================
-- Catalog Expansion 5 (+50 models) -- deepened Audi/VW/Mercedes/BMW
-- full ranges rather than adding more niche brands
-- ============================================================

INSERT INTO car_models (
  brand_id, slug, display_name, full_name,
  body_type, fuel_type, transmission, seats,
  msrp_eur, range_km, boot_litres, charge_kw, ncap_stars, model_year,
  brand_color, badge_label, wikipedia_query,
  score_range, score_safety, score_practicality, score_tech,
  score_reliability, score_value, score_charging
) VALUES

-- Volkswagen up!
(5, 'volkswagen-up', 'up!', 'Volkswagen up!',
 'Hatchback', 'Petrol', 'Manual', 4,
 15900, 650, 251, 0, 3, 2024,
 '#1565c0', 'Best Value', 'Volkswagen Up!',
 6.5, 6.5, 6, 6.5, 8.2, 9, NULL),

-- Volkswagen T-Cross
(5, 'volkswagen-t-cross', 'T-Cross', 'Volkswagen T-Cross',
 'Crossover', 'Petrol', 'Manual', 5,
 24900, 750, 385, 0, 4, 2024,
 '#1565c0', NULL, 'Volkswagen T-Cross',
 7.2, 8, 7.8, 7.5, 8.2, 8.2, NULL),

-- Volkswagen Taigo
(5, 'volkswagen-taigo', 'Taigo', 'Volkswagen Taigo',
 'Crossover', 'Petrol', 'Manual', 5,
 26900, 760, 438, 0, 4, 2024,
 '#1565c0', NULL, 'Volkswagen Taigo',
 7.2, 8, 7.8, 7.8, 8, 8, NULL),

-- Volkswagen Arteon Shooting Brake
(5, 'volkswagen-arteon-shooting-brake', 'Arteon Shooting Brake', 'Volkswagen Arteon Shooting Brake',
 'Estate', 'Diesel', 'Automatic', 5,
 46900, 1150, 590, 0, 5, 2024,
 '#1565c0', NULL, 'Volkswagen Arteon',
 8.8, 9.2, 9, 8.8, 8, 6.5, NULL),

-- Volkswagen ID.3 Pro
(5, 'volkswagen-id-3-pro', 'ID.3 Pro', 'Volkswagen ID.3 Pro',
 'Hatchback', 'Electric', 'Automatic', 5,
 39900, 428, 385, 135, 5, 2024,
 '#1565c0', NULL, 'Volkswagen ID.3',
 7.8, 9, 7.5, 8.2, 7.8, 7.5, 7.8),

-- Volkswagen ID.5 GTX
(5, 'volkswagen-id-5-gtx', 'ID.5 GTX', 'Volkswagen ID.5 GTX',
 'Crossover', 'Electric', 'Automatic', 5,
 52900, 480, 549, 135, 5, 2024,
 '#1565c0', NULL, 'Volkswagen ID.5',
 8, 9, 7.8, 8.5, 7.8, 6.8, 7.8),

-- Volkswagen ID.7 Pro
(5, 'volkswagen-id-7-pro', 'ID.7 Pro', 'Volkswagen ID.7 Pro',
 'Sedan', 'Electric', 'Automatic', 5,
 56900, 615, 532, 170, 5, 2024,
 '#1565c0', 'Best Range', 'Volkswagen ID.7',
 9.2, 9.2, 8.5, 8.8, 7.8, 6.2, 8.5),

-- Volkswagen ID. Buzz
(5, 'volkswagen-id-buzz', 'ID. Buzz', 'Volkswagen ID. Buzz',
 'Estate', 'Electric', 'Automatic', 7,
 64900, 452, 1121, 170, 5, 2024,
 '#f6a15a', 'Most Practical', 'Volkswagen ID. Buzz',
 7.5, 9, 9.8, 8.8, 7.5, 6, 8),

-- Audi A1 Sportback 30 TFSI
(6, 'audi-a1-sportback-30-tfsi', 'A1 Sportback 30 TFSI', 'Audi A1 Sportback 30 TFSI',
 'Hatchback', 'Petrol', 'Manual', 5,
 26900, 780, 335, 0, 4, 2024,
 '#8d1e1e', NULL, 'Audi A1',
 7.2, 8.2, 6.8, 8, 7.8, 7.5, NULL),

-- Audi A4 Avant 40 TDI
(6, 'audi-a4-avant-40-tdi', 'A4 Avant 40 TDI', 'Audi A4 Avant 40 TDI',
 'Estate', 'Diesel', 'Automatic', 5,
 47900, 1200, 495, 0, 5, 2024,
 '#8d1e1e', 'Best Range', 'Audi A4',
 8.8, 9.2, 8.8, 8.5, 8.2, 6.2, NULL),

-- Audi A5 Sportback 40 TFSI
(6, 'audi-a5-sportback-40-tfsi', 'A5 Sportback 40 TFSI', 'Audi A5 Sportback 40 TFSI',
 'Sedan', 'Petrol', 'Automatic', 5,
 52900, 850, 465, 0, 5, 2024,
 '#8d1e1e', NULL, 'Audi A5',
 7.8, 9, 7.5, 8.8, 8, 6, NULL),

-- Audi A8 60 TFSIe
(6, 'audi-a8-60-tfsie', 'A8 60 TFSIe', 'Audi A8 60 TFSIe',
 'Sedan', 'PHEV', 'Automatic', 5,
 96900, 750, 390, 50, 5, 2024,
 '#1a1a1a', 'Most Luxurious', 'Audi A8',
 8.5, 9.5, 8, 9.5, 7.5, 4.2, 6.5),

-- Audi Q2 35 TFSI
(6, 'audi-q2-35-tfsi', 'Q2 35 TFSI', 'Audi Q2 35 TFSI',
 'Crossover', 'Petrol', 'Automatic', 5,
 32900, 800, 405, 0, 4, 2024,
 '#8d1e1e', NULL, 'Audi Q2',
 7.2, 8.5, 7.5, 8, 7.8, 7, NULL),

-- Audi Q3 Sportback 35 TFSI
(6, 'audi-q3-sportback-35-tfsi', 'Q3 Sportback 35 TFSI', 'Audi Q3 Sportback 35 TFSI',
 'Crossover', 'Petrol', 'Automatic', 5,
 40900, 820, 530, 0, 5, 2024,
 '#8d1e1e', NULL, 'Audi Q3',
 7.5, 9, 8, 8.2, 8, 6.5, NULL),

-- Audi Q5 Sportback 40 TDI
(6, 'audi-q5-sportback-40-tdi', 'Q5 Sportback 40 TDI', 'Audi Q5 Sportback 40 TDI',
 'SUV', 'Diesel', 'Automatic', 5,
 58900, 1150, 510, 0, 5, 2024,
 '#8d1e1e', NULL, 'Audi Q5',
 8.8, 9.2, 8.5, 8.5, 8, 5.8, NULL),

-- Audi Q7 55 TFSI
(6, 'audi-q7-55-tfsi', 'Q7 55 TFSI', 'Audi Q7 55 TFSI',
 'SUV', 'Petrol', 'Automatic', 7,
 76900, 750, 865, 0, 5, 2024,
 '#8d1e1e', 'Most Practical', 'Audi Q7',
 7.8, 9.2, 9.5, 8.8, 7.5, 5, NULL),

-- Mercedes B-Class B200
(11, 'mercedes-b-class-b200', 'B-Class B200', 'Mercedes B-Class B200',
 'Crossover', 'Petrol', 'Automatic', 5,
 38900, 800, 455, 0, 5, 2024,
 '#888888', NULL, 'Mercedes-Benz B-Class',
 7.2, 9, 8.2, 8.5, 7.8, 6.2, NULL),

-- Mercedes CLA 250e
(11, 'mercedes-cla-250e', 'CLA 250e', 'Mercedes CLA 250e',
 'Sedan', 'PHEV', 'Automatic', 5,
 46900, 700, 405, 50, 5, 2024,
 '#888888', NULL, 'Mercedes-Benz CLA',
 8, 9, 7.2, 9, 7.5, 5.8, 6.2),

-- Mercedes E-Class E220d
(11, 'mercedes-e-class-e220d', 'E-Class E220d', 'Mercedes E-Class E220d',
 'Sedan', 'Diesel', 'Automatic', 5,
 61900, 1250, 540, 0, 5, 2024,
 '#888888', 'Best Range', 'Mercedes-Benz E-Class',
 9, 9.5, 8.5, 9.2, 8, 5.5, NULL),

-- Mercedes S-Class S500
(11, 'mercedes-s-class-s500', 'S-Class S500', 'Mercedes S-Class S500',
 'Sedan', 'Petrol', 'Automatic', 5,
 112900, 800, 550, 0, 5, 2024,
 '#1a1a1a', 'Most Luxurious', 'Mercedes-Benz S-Class',
 8, 9.8, 8.5, 9.8, 7.8, 3.8, NULL),

-- Mercedes GLA 200
(11, 'mercedes-gla-200', 'GLA 200', 'Mercedes GLA 200',
 'Crossover', 'Petrol', 'Automatic', 5,
 41900, 750, 435, 0, 5, 2024,
 '#888888', NULL, 'Mercedes-Benz GLA',
 7.2, 9, 7.8, 8.5, 7.8, 6, NULL),

-- Mercedes GLB 200
(11, 'mercedes-glb-200', 'GLB 200', 'Mercedes GLB 200',
 'SUV', 'Petrol', 'Automatic', 7,
 44900, 780, 570, 0, 5, 2024,
 '#888888', 'Most Practical', 'Mercedes-Benz GLB',
 7.5, 9, 9.2, 8.5, 7.8, 6, NULL),

-- Mercedes GLE 450 4MATIC
(11, 'mercedes-gle-450-4matic', 'GLE 450 4MATIC', 'Mercedes GLE 450 4MATIC',
 'SUV', 'Petrol', 'Automatic', 5,
 84900, 720, 630, 0, 5, 2024,
 '#1a1a1a', NULL, 'Mercedes-Benz GLE',
 7.8, 9.5, 9, 9.2, 7.5, 4.5, NULL),

-- Mercedes EQE 350+
(11, 'mercedes-eqe-350', 'EQE 350+', 'Mercedes EQE 350+',
 'Sedan', 'Electric', 'Automatic', 5,
 74900, 580, 430, 170, 5, 2024,
 '#888888', NULL, 'Mercedes-Benz EQE',
 8.8, 9.5, 8, 9.2, 7.2, 5.2, 8.2),

-- BMW 1 Series 118i
(7, 'bmw-1-series-118i', '1 Series 118i', 'BMW 1 Series 118i',
 'Hatchback', 'Petrol', 'Manual', 5,
 32900, 750, 380, 0, 5, 2024,
 '#1c2d6b', NULL, 'BMW 1 Series',
 7.2, 9, 7, 8.5, 7.8, 6.5, NULL),

-- BMW 2 Series Active Tourer 218i
(7, 'bmw-2-series-active-tourer-218i', '2 Series Active Tourer 218i', 'BMW 2 Series Active Tourer 218i',
 'Crossover', 'Petrol', 'Automatic', 5,
 36900, 780, 415, 0, 5, 2024,
 '#1c2d6b', NULL, 'BMW 2 Series Active Tourer',
 7.5, 9, 8.2, 8.5, 7.8, 6.5, NULL),

-- BMW 4 Series Gran Coupe 420i
(7, 'bmw-4-series-gran-coupe-420i', '4 Series Gran Coupe 420i', 'BMW 4 Series Gran Coupe 420i',
 'Sedan', 'Petrol', 'Automatic', 5,
 49900, 800, 470, 0, 5, 2024,
 '#1c2d6b', NULL, 'BMW 4 Series',
 7.8, 9, 7.5, 8.8, 8, 6, NULL),

-- BMW 7 Series 740i
(7, 'bmw-7-series-740i', '7 Series 740i', 'BMW 7 Series 740i',
 'Sedan', 'Petrol', 'Automatic', 5,
 104900, 780, 500, 0, 5, 2024,
 '#1a1a1a', 'Most Luxurious', 'BMW 7 Series',
 8, 9.8, 8.5, 9.8, 7.8, 3.8, NULL),

-- BMW X3 xDrive20d
(7, 'bmw-x3-xdrive20d', 'X3 xDrive20d', 'BMW X3 xDrive20d',
 'SUV', 'Diesel', 'Automatic', 5,
 55900, 1100, 550, 0, 5, 2024,
 '#1c2d6b', NULL, 'BMW X3',
 8.5, 9.2, 8.5, 8.5, 8, 6, NULL),

-- BMW X5 xDrive40i
(7, 'bmw-x5-xdrive40i', 'X5 xDrive40i', 'BMW X5 xDrive40i',
 'SUV', 'Petrol', 'Automatic', 5,
 74900, 700, 650, 0, 5, 2024,
 '#1c2d6b', NULL, 'BMW X5',
 7.8, 9.5, 9, 9, 7.8, 5, NULL),

-- BMW X6 M50i
(7, 'bmw-x6-m50i', 'X6 M50i', 'BMW X6 M50i',
 'SUV', 'Petrol', 'Automatic', 5,
 94900, 650, 580, 0, 5, 2024,
 '#1a1a1a', NULL, 'BMW X6',
 7.2, 9.2, 8.2, 9.2, 7.5, 4, NULL),

-- BMW iX xDrive50
(7, 'bmw-ix-xdrive50', 'iX xDrive50', 'BMW iX xDrive50',
 'SUV', 'Electric', 'Automatic', 5,
 91900, 630, 500, 195, 5, 2024,
 '#1c2d6b', 'Best Range', 'BMW iX',
 9.2, 9.5, 8.5, 9.5, 7.5, 4.5, 9),

-- Hyundai i10
(2, 'hyundai-i10', 'i10', 'Hyundai i10',
 'Hatchback', 'Petrol', 'Manual', 4,
 15900, 680, 252, 0, 4, 2024,
 '#1a4d8f', 'Best Value', 'Hyundai i10',
 6.5, 7.2, 6, 6.8, 8.2, 9.2, NULL),

-- Hyundai Santa Fe Hybrid
(2, 'hyundai-santa-fe-hybrid', 'Santa Fe Hybrid', 'Hyundai Santa Fe Hybrid',
 'SUV', 'Hybrid', 'Automatic', 7,
 47900, 950, 628, 0, 5, 2024,
 '#1a4d8f', 'Most Practical', 'Hyundai Santa Fe',
 8, 9.2, 9.5, 8.5, 8.2, 7.2, 1.5),

-- Hyundai Ioniq 6
(2, 'hyundai-ioniq-6', 'Ioniq 6', 'Hyundai Ioniq 6',
 'Sedan', 'Electric', 'Automatic', 5,
 46900, 614, 401, 233, 5, 2024,
 '#1a4d8f', 'Best Range', 'Hyundai Ioniq 6',
 9.2, 9.5, 7.5, 9, 8.2, 7.5, 9.2),

-- Ford Fiesta
(9, 'ford-fiesta', 'Fiesta', 'Ford Fiesta',
 'Hatchback', 'Petrol', 'Manual', 5,
 21900, 780, 292, 0, 4, 2024,
 '#003087', NULL, 'Ford Fiesta',
 7, 8, 6.8, 7.2, 7.8, 8.2, NULL),

-- Ford Kuga Hybrid
(9, 'ford-kuga-hybrid', 'Kuga Hybrid', 'Ford Kuga Hybrid',
 'SUV', 'Hybrid', 'Automatic', 5,
 38900, 950, 411, 0, 5, 2024,
 '#003087', NULL, 'Ford Kuga',
 7.8, 8.8, 8.2, 8, 7.5, 7.5, 1.5),

-- Ford Galaxy
(9, 'ford-galaxy', 'Galaxy', 'Ford Galaxy',
 'Estate', 'Diesel', 'Automatic', 7,
 46900, 1100, 731, 0, 5, 2024,
 '#003087', 'Most Practical', 'Ford Galaxy',
 8.2, 9, 9.5, 7.8, 7.8, 6.8, NULL),

-- Citroën C4 X
(14, 'citro-n-c4-x', 'C4 X', 'Citroën C4 X',
 'Sedan', 'Electric', 'Automatic', 5,
 41900, 420, 510, 100, 4, 2024,
 '#5c3b9e', NULL, 'Citroën C4 X',
 7.2, 8, 8, 7.5, 7.2, 7.2, 7),

-- Citroën C3
(14, 'citro-n-c3', 'C3', 'Citroën C3',
 'Hatchback', 'Petrol', 'Manual', 5,
 19900, 750, 310, 0, 4, 2024,
 '#5c3b9e', 'Best Value', 'Citroën C3',
 6.8, 7.5, 6.8, 7.2, 7.5, 8.8, NULL),

-- Opel Corsa
(19, 'opel-corsa', 'Corsa', 'Opel Corsa',
 'Hatchback', 'Petrol', 'Manual', 5,
 22900, 780, 309, 0, 4, 2024,
 '#c8860a', NULL, 'Opel Corsa',
 7, 7.8, 6.8, 7.5, 7.8, 8.2, NULL),

-- Opel Grandland
(19, 'opel-grandland', 'Grandland', 'Opel Grandland',
 'SUV', 'PHEV', 'Automatic', 5,
 42900, 750, 550, 50, 5, 2024,
 '#c8860a', NULL, 'Opel Grandland',
 8, 8.8, 8.8, 7.8, 7.5, 6.8, 6),

-- Fiat 500e
(15, 'fiat-500e', '500e', 'Fiat 500e',
 'Hatchback', 'Electric', 'Automatic', 4,
 29900, 320, 185, 85, 4, 2024,
 '#cc0000', NULL, 'Fiat 500e (2020)',
 6.2, 7, 5.5, 7.5, 7.5, 6.8, 6.8),

-- Fiat Tipo
(15, 'fiat-tipo', 'Tipo', 'Fiat Tipo',
 'Sedan', 'Petrol', 'Manual', 5,
 21900, 800, 440, 0, 4, 2024,
 '#cc0000', NULL, 'Fiat Tipo',
 7.2, 7.5, 7.8, 7, 7.5, 8.5, NULL),

-- Toyota Highlander
(13, 'toyota-highlander', 'Highlander', 'Toyota Highlander',
 'SUV', 'Hybrid', 'Automatic', 7,
 52900, 950, 332, 0, 5, 2024,
 '#c41230', 'Most Practical', 'Toyota Highlander (XU70)',
 7.8, 9.2, 9.2, 8.2, 9.2, 6.8, 1.5),

-- Toyota Land Cruiser
(13, 'toyota-land-cruiser', 'Land Cruiser', 'Toyota Land Cruiser',
 'SUV', 'Diesel', 'Automatic', 5,
 64900, 1000, 500, 0, 4, 2024,
 '#444444', NULL, 'Toyota Land Cruiser (J250)',
 7.5, 8.5, 8.5, 7.2, 9.5, 6, NULL),

-- Peugeot 408
(12, 'peugeot-408', '408', 'Peugeot 408',
 'Sedan', 'PHEV', 'Automatic', 5,
 43900, 700, 536, 55, 5, 2024,
 '#5c3b9e', NULL, 'Peugeot 408',
 8, 8.8, 8.5, 8.2, 7.5, 6.8, 6.2),

-- Peugeot 2008 GT Petrol
(12, 'peugeot-2008-gt-petrol', '2008 GT Petrol', 'Peugeot 2008 GT Petrol',
 'Crossover', 'Petrol', 'Manual', 5,
 29900, 800, 434, 0, 4, 2024,
 '#5c3b9e', NULL, 'Peugeot 2008',
 7.2, 8, 7.2, 7.5, 7.5, 8.2, NULL),

-- Škoda Scala
(4, 'koda-scala', 'Scala', 'Škoda Scala',
 'Hatchback', 'Petrol', 'Manual', 5,
 24900, 800, 467, 0, 5, 2024,
 '#444444', 'Most Practical', 'Škoda Scala',
 7.5, 9, 8.8, 7.8, 8.5, 8.2, NULL),

-- Škoda Kodiaq
(4, 'koda-kodiaq', 'Kodiaq', 'Škoda Kodiaq',
 'SUV', 'Diesel', 'Automatic', 7,
 46900, 1150, 910, 0, 5, 2024,
 '#444444', 'Most Practical', 'Škoda Kodiaq',
 8.5, 9.2, 9.8, 8.2, 8.5, 7.2, NULL);

-- ============================================================
-- Catalog Expansion 6 (+33 models) -- fills remaining gaps in the
-- top-10 European brands by 2025 registrations (VW, Toyota, Skoda,
-- BMW, Renault, Mercedes, Peugeot, Audi, Dacia, Hyundai)
-- ============================================================

INSERT INTO car_models (
  brand_id, slug, display_name, full_name,
  body_type, fuel_type, transmission, seats,
  msrp_eur, range_km, boot_litres, charge_kw, ncap_stars, model_year,
  brand_color, badge_label, wikipedia_query,
  score_range, score_safety, score_practicality, score_tech,
  score_reliability, score_value, score_charging
) VALUES

-- Volkswagen Touran
(5, 'volkswagen-touran', 'Touran', 'Volkswagen Touran',
 'Estate', 'Petrol', 'Automatic', 7,
 33900, 800, 834, 0, 5, 2024,
 '#1565c0', 'Most Practical', 'Volkswagen Touran',
 7.5, 9, 9.5, 7.8, 8.2, 7.5, NULL),

-- Volkswagen Golf Estate
(5, 'volkswagen-golf-estate', 'Golf Estate', 'Volkswagen Golf Estate',
 'Estate', 'Diesel', 'Manual', 5,
 33900, 1150, 611, 0, 5, 2024,
 '#1565c0', NULL, 'Volkswagen Golf Mk8',
 8.5, 9, 8.8, 7.8, 8.8, 8, NULL),

-- Toyota Yaris
(13, 'toyota-yaris', 'Yaris', 'Toyota Yaris',
 'Hatchback', 'Hybrid', 'Automatic', 5,
 24900, 950, 286, 0, 5, 2024,
 '#c41230', 'Most Reliable', 'Toyota Yaris (XP210)',
 7.8, 8.5, 7, 7.8, 9.2, 8.5, 1.5),

-- Toyota Corolla
(13, 'toyota-corolla', 'Corolla', 'Toyota Corolla',
 'Hatchback', 'Hybrid', 'Automatic', 5,
 29900, 950, 361, 0, 5, 2024,
 '#c41230', NULL, 'Toyota Corolla (E210)',
 7.8, 9, 7.5, 8, 9.2, 8, 1.5),

-- Toyota Camry
(13, 'toyota-camry', 'Camry', 'Toyota Camry',
 'Sedan', 'Hybrid', 'Automatic', 5,
 43900, 1050, 524, 0, 5, 2024,
 '#444444', 'Most Reliable', 'Toyota Camry (XV80)',
 8.2, 9.2, 8.5, 8.5, 9.2, 7, 1.5),

-- Toyota Urban Cruiser
(13, 'toyota-urban-cruiser', 'Urban Cruiser', 'Toyota Urban Cruiser',
 'Crossover', 'Electric', 'Automatic', 5,
 30900, 416, 376, 100, 5, 2024,
 '#c41230', NULL, 'Toyota Urban Cruiser',
 7.2, 8.5, 7.5, 7.5, 8.5, 7.8, 7),

-- Škoda Octavia
(4, 'koda-octavia', 'Octavia', 'Škoda Octavia',
 'Sedan', 'Diesel', 'Automatic', 5,
 33900, 1250, 600, 0, 5, 2024,
 '#444444', 'Best Range', 'Škoda Octavia (2020)',
 8.8, 9, 9.2, 8, 8.8, 8.5, NULL),

-- Škoda Superb
(4, 'koda-superb', 'Superb', 'Škoda Superb',
 'Sedan', 'PHEV', 'Automatic', 5,
 45900, 900, 645, 50, 5, 2024,
 '#444444', NULL, 'Škoda Superb (2024)',
 8.5, 9.2, 9.2, 8.8, 8.2, 7.5, 6.2),

-- Škoda Kylaq
(4, 'koda-kylaq', 'Kylaq', 'Škoda Kylaq',
 'Crossover', 'Petrol', 'Manual', 5,
 22900, 780, 446, 0, 4, 2024,
 '#444444', 'Best Value', 'Škoda Kylaq',
 7.2, 8, 8, 7.5, 8.2, 8.5, NULL),

-- BMW 8 Series Gran Coupe 840i
(7, 'bmw-8-series-gran-coupe-840i', '8 Series Gran Coupe 840i', 'BMW 8 Series Gran Coupe 840i',
 'Sedan', 'Petrol', 'Automatic', 5,
 99900, 750, 455, 0, 5, 2024,
 '#1a1a1a', 'Most Luxurious', 'BMW 8 Series',
 7.5, 9.2, 7.2, 9.5, 7.5, 4, NULL),

-- BMW X4 xDrive30i
(7, 'bmw-x4-xdrive30i', 'X4 xDrive30i', 'BMW X4 xDrive30i',
 'SUV', 'Petrol', 'Automatic', 5,
 66900, 700, 525, 0, 5, 2024,
 '#1c2d6b', NULL, 'BMW X4',
 7.5, 9, 7.8, 9, 7.8, 5.5, NULL),

-- BMW X7 xDrive40i
(7, 'bmw-x7-xdrive40i', 'X7 xDrive40i', 'BMW X7 xDrive40i',
 'SUV', 'Petrol', 'Automatic', 7,
 99900, 720, 750, 0, 5, 2024,
 '#1a1a1a', 'Most Practical', 'BMW X7',
 7.8, 9.5, 9.5, 9.2, 7.5, 4.2, NULL),

-- BMW i5 eDrive40
(7, 'bmw-i5-edrive40', 'i5 eDrive40', 'BMW i5 eDrive40',
 'Sedan', 'Electric', 'Automatic', 5,
 72900, 582, 490, 205, 5, 2024,
 '#1c2d6b', NULL, 'BMW i5',
 8.8, 9.5, 8.2, 9.2, 7.8, 5.8, 8.8),

-- BMW i7 xDrive60
(7, 'bmw-i7-xdrive60', 'i7 xDrive60', 'BMW i7 xDrive60',
 'Sedan', 'Electric', 'Automatic', 5,
 119900, 625, 500, 195, 5, 2024,
 '#1a1a1a', 'Most Luxurious', 'BMW i7',
 9, 9.8, 8.5, 9.8, 7.5, 3.5, 8.5),

-- Renault Arkana E-Tech Hybrid
(10, 'renault-arkana-e-tech-hybrid', 'Arkana E-Tech Hybrid', 'Renault Arkana E-Tech Hybrid',
 'Crossover', 'Hybrid', 'Automatic', 5,
 34900, 900, 480, 0, 5, 2024,
 '#c8860a', NULL, 'Renault Arkana',
 7.8, 8.5, 7.5, 8, 7.8, 8, 1.5),

-- Renault Espace E-Tech Hybrid
(10, 'renault-espace-e-tech-hybrid', 'Espace E-Tech Hybrid', 'Renault Espace E-Tech Hybrid',
 'SUV', 'Hybrid', 'Automatic', 7,
 44900, 900, 555, 0, 5, 2024,
 '#c8860a', 'Most Practical', 'Renault Espace (2024)',
 7.8, 8.8, 9.2, 8.5, 7.5, 7.2, 1.5),

-- Renault Twingo Electric
(10, 'renault-twingo-electric', 'Twingo Electric', 'Renault Twingo Electric',
 'Hatchback', 'Electric', 'Automatic', 4,
 20900, 260, 220, 50, 4, 2024,
 '#c8860a', 'Best Value', 'Renault Twingo',
 5.8, 7.2, 5.8, 7, 7.8, 9.2, 6),

-- Mercedes GLS 450 4MATIC
(11, 'mercedes-gls-450-4matic', 'GLS 450 4MATIC', 'Mercedes GLS 450 4MATIC',
 'SUV', 'Petrol', 'Automatic', 7,
 106900, 750, 890, 0, 5, 2024,
 '#1a1a1a', 'Most Practical', 'Mercedes-Benz GLS',
 7.8, 9.5, 9.8, 9.2, 7.5, 3.8, NULL),

-- Mercedes CLE 300 Coupe
(11, 'mercedes-cle-300-coupe', 'CLE 300 Coupe', 'Mercedes CLE 300 Coupe',
 'Sedan', 'Petrol', 'Automatic', 4,
 58900, 800, 420, 0, 5, 2024,
 '#888888', NULL, 'Mercedes-Benz CLE',
 7.8, 9, 6.8, 9, 7.8, 5.5, NULL),

-- Mercedes EQS 450+
(11, 'mercedes-eqs-450', 'EQS 450+', 'Mercedes EQS 450+',
 'Sedan', 'Electric', 'Automatic', 5,
 106900, 782, 610, 200, 5, 2024,
 '#1a1a1a', 'Best Range', 'Mercedes-Benz EQS',
 9.5, 9.8, 8.8, 9.8, 7.5, 3.5, 9),

-- Mercedes G500
(11, 'mercedes-g500', 'G500', 'Mercedes G500',
 'SUV', 'Petrol', 'Automatic', 5,
 139900, 650, 454, 0, 5, 2024,
 '#1a1a1a', NULL, 'Mercedes-Benz G-Class',
 6.2, 9, 7.5, 8.5, 7.8, 2.8, NULL),

-- Peugeot Rifter
(12, 'peugeot-rifter', 'Rifter', 'Peugeot Rifter',
 'Estate', 'Diesel', 'Manual', 7,
 31900, 1050, 775, 0, 4, 2024,
 '#5c3b9e', 'Most Practical', 'Peugeot Rifter',
 8, 7.8, 9.5, 7, 7.8, 7.8, NULL),

-- Peugeot e-3008
(12, 'peugeot-e-3008', 'e-3008', 'Peugeot e-3008',
 'SUV', 'Electric', 'Automatic', 5,
 45900, 527, 520, 160, 5, 2024,
 '#5c3b9e', 'Best Range', 'Peugeot e-3008',
 8.5, 8.8, 8.5, 8.8, 7.5, 6.8, 8.5),

-- Audi Q6 e-tron
(6, 'audi-q6-e-tron', 'Q6 e-tron', 'Audi Q6 e-tron',
 'SUV', 'Electric', 'Automatic', 5,
 65900, 625, 526, 270, 5, 2024,
 '#8d1e1e', 'Best Range', 'Audi Q6 e-tron',
 9, 9.2, 8.2, 9.2, 7.5, 5.8, 9.5),

-- Audi Q8 55 TFSI
(6, 'audi-q8-55-tfsi', 'Q8 55 TFSI', 'Audi Q8 55 TFSI',
 'SUV', 'Petrol', 'Automatic', 5,
 84900, 720, 605, 0, 5, 2024,
 '#1a1a1a', NULL, 'Audi Q8',
 7.5, 9.2, 8.8, 9.2, 7.5, 4.2, NULL),

-- Audi A7 Sportback 45 TFSI
(6, 'audi-a7-sportback-45-tfsi', 'A7 Sportback 45 TFSI', 'Audi A7 Sportback 45 TFSI',
 'Sedan', 'Petrol', 'Automatic', 5,
 68900, 800, 535, 0, 5, 2024,
 '#8d1e1e', NULL, 'Audi A7',
 7.8, 9, 8, 9, 7.8, 5.2, NULL),

-- Dacia Sandero
(22, 'dacia-sandero', 'Sandero', 'Dacia Sandero',
 'Hatchback', 'Petrol', 'Manual', 5,
 15900, 800, 328, 0, 3, 2024,
 '#f2874d', 'Best Seller', 'Dacia Sandero',
 7, 6.8, 7.2, 6.2, 8, 9.8, NULL),

-- Dacia Jogger TCe 110
(22, 'dacia-jogger-tce-110', 'Jogger TCe 110', 'Dacia Jogger TCe 110',
 'Estate', 'Petrol', 'Manual', 7,
 19900, 850, 708, 0, 3, 2024,
 '#f2874d', 'Most Practical', 'Dacia Jogger',
 7.5, 6.8, 9.5, 6.5, 7.8, 9.5, NULL),

-- Dacia Spring Electric
(22, 'dacia-spring-electric', 'Spring Electric', 'Dacia Spring Electric',
 'Hatchback', 'Electric', 'Automatic', 4,
 17900, 220, 300, 30, 1, 2024,
 '#f2874d', 'Best Value', 'Dacia Spring',
 5.5, 4.5, 6.5, 5.5, 7, 9.5, 4.5),

-- Dacia Bigster TCe 130
(22, 'dacia-bigster-tce-130', 'Bigster TCe 130', 'Dacia Bigster TCe 130',
 'SUV', 'Petrol', 'Manual', 5,
 26900, 850, 667, 0, 4, 2024,
 '#f2874d', 'Best Value', 'Dacia Bigster',
 7.5, 7.8, 9.2, 7, 7.8, 9, NULL),

-- Hyundai i30
(2, 'hyundai-i30', 'i30', 'Hyundai i30',
 'Hatchback', 'Petrol', 'Manual', 5,
 24900, 800, 395, 0, 5, 2024,
 '#1a4d8f', NULL, 'Hyundai i30',
 7.2, 8.8, 7.5, 7.8, 8.2, 8.2, NULL),

-- Hyundai Ioniq 9
(2, 'hyundai-ioniq-9', 'Ioniq 9', 'Hyundai Ioniq 9',
 'SUV', 'Electric', 'Automatic', 7,
 64900, 620, 620, 233, 5, 2024,
 '#1a4d8f', 'Most Practical', 'Hyundai Ioniq 9',
 8.8, 9.5, 9.5, 9, 8, 5.5, 9),

-- Hyundai Inster
(2, 'hyundai-inster', 'Inster', 'Hyundai Inster',
 'Hatchback', 'Electric', 'Automatic', 4,
 24900, 355, 351, 120, 4, 2024,
 '#1a4d8f', 'Best Value', 'Hyundai Inster',
 7.2, 8, 7, 8, 8, 8.2, 7.8);

-- ============================================================
-- Catalog Expansion 7 (+22 models) -- next tier just outside the
-- top 10 (Kia, Ford, Citroen, Opel, Fiat, Nissan, Seat, Cupra, Volvo, Mazda)
-- ============================================================

INSERT INTO car_models (
  brand_id, slug, display_name, full_name,
  body_type, fuel_type, transmission, seats,
  msrp_eur, range_km, boot_litres, charge_kw, ncap_stars, model_year,
  brand_color, badge_label, wikipedia_query,
  score_range, score_safety, score_practicality, score_tech,
  score_reliability, score_value, score_charging
) VALUES

-- Kia Rio
(3, 'kia-rio', 'Rio', 'Kia Rio',
 'Hatchback', 'Petrol', 'Manual', 5,
 20900, 780, 325, 0, 4, 2024,
 '#2e7d32', NULL, 'Kia Rio',
 7, 7.8, 7.2, 7.2, 8.2, 8.5, NULL),

-- Kia EV3
(3, 'kia-ev3', 'EV3', 'Kia EV3',
 'Crossover', 'Electric', 'Automatic', 5,
 36900, 605, 460, 128, 5, 2024,
 '#2e7d32', 'Best Range', 'Kia EV3',
 9, 9.2, 8.2, 9, 8.2, 7.8, 8.2),

-- Kia EV9
(3, 'kia-ev9', 'EV9', 'Kia EV9',
 'SUV', 'Electric', 'Automatic', 7,
 74900, 563, 828, 210, 5, 2024,
 '#2e7d32', 'Most Practical', 'Kia EV9',
 8.5, 9.5, 9.5, 9.2, 7.8, 5.5, 8.8),

-- Kia Ceed
(3, 'kia-ceed', 'Ceed', 'Kia Ceed',
 'Hatchback', 'Petrol', 'Manual', 5,
 25900, 800, 395, 0, 5, 2024,
 '#2e7d32', NULL, 'Kia Ceed',
 7.2, 8.5, 7.8, 7.5, 8.5, 8.5, NULL),

-- Ford Puma Gen-E
(9, 'ford-puma-gen-e', 'Puma Gen-E', 'Ford Puma Gen-E',
 'Crossover', 'Electric', 'Automatic', 5,
 34900, 376, 574, 100, 5, 2024,
 '#003087', 'Most Practical', 'Ford Puma',
 7, 8.5, 8.5, 7.8, 7.5, 7.5, 6.8),

-- Ford Tourneo Connect
(9, 'ford-tourneo-connect', 'Tourneo Connect', 'Ford Tourneo Connect',
 'Estate', 'Diesel', 'Manual', 7,
 32900, 1050, 700, 0, 4, 2024,
 '#003087', 'Most Practical', 'Ford Tourneo Connect',
 7.8, 7.8, 9.2, 7, 7.5, 7.8, NULL),

-- Citroën C5 X
(14, 'citro-n-c5-x', 'C5 X', 'Citroën C5 X',
 'Sedan', 'PHEV', 'Automatic', 5,
 42900, 800, 545, 50, 5, 2024,
 '#5c3b9e', NULL, 'Citroën C5 X',
 8, 8.5, 8.8, 8, 7.5, 7, 6),

-- Citroën Berlingo
(14, 'citro-n-berlingo', 'Berlingo', 'Citroën Berlingo',
 'Estate', 'Petrol', 'Manual', 7,
 27900, 800, 775, 0, 4, 2024,
 '#5c3b9e', 'Most Practical', 'Citroën Berlingo',
 7.2, 7.5, 9.5, 6.8, 7.5, 7.8, NULL),

-- Opel Astra
(19, 'opel-astra', 'Astra', 'Opel Astra',
 'Hatchback', 'Petrol', 'Manual', 5,
 27900, 800, 422, 0, 5, 2024,
 '#c8860a', NULL, 'Opel Astra',
 7.2, 8.8, 8.2, 7.8, 7.8, 8, NULL),

-- Opel Crossland
(19, 'opel-crossland', 'Crossland', 'Opel Crossland',
 'Crossover', 'Petrol', 'Manual', 5,
 24900, 780, 410, 0, 4, 2024,
 '#c8860a', NULL, 'Opel Crossland',
 7, 7.8, 7.8, 7.2, 7.8, 8.2, NULL),

-- Opel Frontera
(19, 'opel-frontera', 'Frontera', 'Opel Frontera',
 'Crossover', 'Electric', 'Automatic', 5,
 29900, 305, 460, 100, 5, 2024,
 '#c8860a', 'Best Value', 'Opel Frontera',
 6.5, 8.2, 8, 7.5, 7.5, 8, 6.5),

-- Fiat Panda Hybrid
(15, 'fiat-panda-hybrid', 'Panda Hybrid', 'Fiat Panda Hybrid',
 'Hatchback', 'Hybrid', 'Manual', 5,
 17900, 850, 225, 0, 3, 2024,
 '#cc0000', 'Best Value', 'Fiat Panda',
 6.8, 6.5, 6.2, 6, 7.8, 9.5, 1.5),

-- Fiat 500 Hybrid
(15, 'fiat-500-hybrid', '500 Hybrid', 'Fiat 500 Hybrid',
 'Hatchback', 'Hybrid', 'Manual', 4,
 19900, 800, 185, 0, 3, 2024,
 '#cc0000', NULL, 'Fiat 500 (2007)',
 6.5, 6.2, 5.5, 6.5, 7.5, 8.8, 1.5),

-- Nissan Micra
(17, 'nissan-micra', 'Micra', 'Nissan Micra',
 'Hatchback', 'Electric', 'Automatic', 5,
 27900, 408, 326, 100, 5, 2024,
 '#003087', NULL, 'Nissan Micra',
 7.5, 8.2, 7.5, 8, 7.8, 7.8, 7.5),

-- Nissan X-Trail e-Power
(17, 'nissan-x-trail-e-power', 'X-Trail e-Power', 'Nissan X-Trail e-Power',
 'SUV', 'Hybrid', 'Automatic', 7,
 43900, 900, 585, 0, 5, 2024,
 '#003087', 'Most Practical', 'Nissan X-Trail',
 7.8, 8.8, 9.2, 8.2, 7.8, 7, 1.5),

-- Seat Ibiza
(23, 'seat-ibiza', 'Ibiza', 'Seat Ibiza',
 'Hatchback', 'Petrol', 'Manual', 5,
 21900, 780, 355, 0, 4, 2024,
 '#f2874d', NULL, 'Seat Ibiza',
 7, 7.8, 7.2, 7.2, 8, 8.5, NULL),

-- Seat Ateca
(23, 'seat-ateca', 'Ateca', 'Seat Ateca',
 'Crossover', 'Petrol', 'Automatic', 5,
 32900, 800, 510, 0, 5, 2024,
 '#f2874d', NULL, 'Seat Ateca',
 7.5, 8.8, 8.5, 7.8, 7.8, 7.5, NULL),

-- Cupra Tavascan
(16, 'cupra-tavascan', 'Tavascan', 'Cupra Tavascan',
 'SUV', 'Electric', 'Automatic', 5,
 46900, 517, 540, 135, 5, 2024,
 '#8d1e1e', NULL, 'Cupra Tavascan',
 8.5, 9, 8, 9, 7.5, 6.5, 7.8),

-- Cupra Terramar
(16, 'cupra-terramar', 'Terramar', 'Cupra Terramar',
 'SUV', 'PHEV', 'Automatic', 5,
 44900, 750, 540, 50, 5, 2024,
 '#8d1e1e', NULL, 'Cupra Terramar',
 8.2, 8.8, 8.2, 8.8, 7.5, 6.5, 6.2),

-- Volvo EX90
(8, 'volvo-ex90', 'EX90', 'Volvo EX90',
 'SUV', 'Electric', 'Automatic', 7,
 96900, 600, 655, 250, 5, 2024,
 '#1b3a2d', 'Safest', 'Volvo EX90',
 8.8, 9.8, 9.5, 9.5, 7.5, 4.2, 9),

-- Mazda Mazda2
(28, 'mazda-mazda2', 'Mazda2', 'Mazda Mazda2',
 'Hatchback', 'Hybrid', 'Manual', 5,
 22900, 850, 280, 0, 4, 2024,
 '#cc0000', NULL, 'Mazda2',
 7.2, 7.5, 6.8, 7.2, 8.2, 8.5, 1.5),

-- Mazda CX-5
(28, 'mazda-cx-5', 'CX-5', 'Mazda CX-5',
 'SUV', 'Petrol', 'Automatic', 5,
 34900, 800, 522, 0, 5, 2024,
 '#cc0000', 'Most Reliable', 'Mazda CX-5',
 7.5, 9, 8.5, 8, 8.5, 7.5, NULL);

-- ============================================================
-- Catalog Expansion 8 (+25 models) -- rounds out remaining brands
-- that only had 1-2 models each (Honda, Jeep, Mini, Subaru, Suzuki,
-- Porsche, Jaguar, Lexus, Polestar, Land Rover, Alfa Romeo, MG, DS,
-- Smart, Cadillac, Genesis)
-- ============================================================

INSERT INTO car_models (
  brand_id, slug, display_name, full_name,
  body_type, fuel_type, transmission, seats,
  msrp_eur, range_km, boot_litres, charge_kw, ncap_stars, model_year,
  brand_color, badge_label, wikipedia_query,
  score_range, score_safety, score_practicality, score_tech,
  score_reliability, score_value, score_charging
) VALUES

-- Honda Jazz Hybrid
(21, 'honda-jazz-hybrid', 'Jazz Hybrid', 'Honda Jazz Hybrid',
 'Hatchback', 'Hybrid', 'Automatic', 5,
 26900, 900, 304, 0, 5, 2024,
 '#888888', 'Most Reliable', 'Honda Jazz',
 7.8, 8.5, 8.2, 7.5, 9, 7.5, 1.5),

-- Honda HR-V Hybrid
(21, 'honda-hr-v-hybrid', 'HR-V Hybrid', 'Honda HR-V Hybrid',
 'Crossover', 'Hybrid', 'Automatic', 5,
 32900, 900, 335, 0, 5, 2024,
 '#888888', NULL, 'Honda HR-V',
 7.8, 8.8, 7.8, 8, 9, 7.2, 1.5),

-- Jeep Compass 4xe
(24, 'jeep-compass-4xe', 'Compass 4xe', 'Jeep Compass 4xe',
 'Crossover', 'PHEV', 'Automatic', 5,
 44900, 700, 420, 50, 5, 2024,
 '#1b3a2d', NULL, 'Jeep Compass',
 7.8, 8.8, 7.8, 8, 7, 6.2, 6),

-- Jeep Renegade
(24, 'jeep-renegade', 'Renegade', 'Jeep Renegade',
 'Crossover', 'Petrol', 'Manual', 5,
 29900, 780, 351, 0, 5, 2024,
 '#1b3a2d', NULL, 'Jeep Renegade',
 7, 8.2, 7.5, 7.2, 7.2, 7.5, NULL),

-- Mini Cooper
(25, 'mini-cooper', 'Cooper', 'Mini Cooper',
 'Hatchback', 'Petrol', 'Manual', 4,
 27900, 780, 210, 0, 4, 2024,
 '#1565c0', NULL, 'Mini Hatch',
 7, 8.2, 5.8, 8, 7.8, 7.2, NULL),

-- Mini Aceman SE
(25, 'mini-aceman-se', 'Aceman SE', 'Mini Aceman SE',
 'Crossover', 'Electric', 'Automatic', 5,
 39900, 406, 300, 95, 5, 2024,
 '#1565c0', NULL, 'Mini Aceman',
 7.5, 8.5, 7.2, 8.5, 7.5, 6.8, 7.2),

-- Subaru Forester Hybrid
(29, 'subaru-forester-hybrid', 'Forester Hybrid', 'Subaru Forester Hybrid',
 'SUV', 'Hybrid', 'Automatic', 5,
 39900, 900, 508, 0, 5, 2024,
 '#1b3a2d', 'Safest', 'Subaru Forester',
 7.8, 9.2, 8.5, 7.5, 8.8, 6.8, 1.5),

-- Suzuki Across
(27, 'suzuki-across', 'Across', 'Suzuki Across',
 'SUV', 'PHEV', 'Automatic', 5,
 49900, 800, 490, 50, 5, 2024,
 '#f2874d', NULL, 'Suzuki Across',
 8.2, 8.8, 8.5, 8, 8.5, 6, 6.5),

-- Suzuki Ignis
(27, 'suzuki-ignis', 'Ignis', 'Suzuki Ignis',
 'Crossover', 'Hybrid', 'Manual', 5,
 19900, 800, 267, 0, 3, 2024,
 '#f2874d', 'Best Value', 'Suzuki Ignis',
 6.8, 6.5, 6.8, 6.5, 8.5, 9, 1.5),

-- Porsche Cayenne
(31, 'porsche-cayenne', 'Cayenne', 'Porsche Cayenne',
 'SUV', 'Petrol', 'Automatic', 5,
 89900, 700, 645, 0, 5, 2024,
 '#1a1a1a', NULL, 'Porsche Cayenne',
 7.5, 9.2, 8.8, 9.2, 7.8, 4.5, NULL),

-- Porsche Panamera 4
(31, 'porsche-panamera-4', 'Panamera 4', 'Porsche Panamera 4',
 'Sedan', 'PHEV', 'Automatic', 4,
 104900, 750, 405, 50, 5, 2024,
 '#1a1a1a', 'Most Luxurious', 'Porsche Panamera',
 8.2, 9.2, 7.5, 9.5, 7.8, 3.8, 6.5),

-- Jaguar F-Pace
(30, 'jaguar-f-pace', 'F-Pace', 'Jaguar F-Pace',
 'SUV', 'Petrol', 'Automatic', 5,
 62900, 700, 650, 0, 5, 2024,
 '#1c2d6b', NULL, 'Jaguar F-Pace',
 7.2, 8.8, 8.8, 8.5, 6.8, 5.5, NULL),

-- Lexus UX 250h
(32, 'lexus-ux-250h', 'UX 250h', 'Lexus UX 250h',
 'Crossover', 'Hybrid', 'Automatic', 5,
 39900, 950, 320, 0, 5, 2024,
 '#888888', NULL, 'Lexus UX',
 7.8, 9, 7, 8.5, 9.2, 6.8, 1.5),

-- Lexus ES 300h
(32, 'lexus-es-300h', 'ES 300h', 'Lexus ES 300h',
 'Sedan', 'Hybrid', 'Automatic', 5,
 48900, 1000, 454, 0, 5, 2024,
 '#888888', 'Most Reliable', 'Lexus ES',
 8.2, 9.2, 8, 8.8, 9.2, 6.2, 1.5),

-- Polestar 3
(20, 'polestar-3', '3', 'Polestar 3',
 'SUV', 'Electric', 'Automatic', 5,
 79900, 610, 484, 250, 5, 2024,
 '#1a1a1a', NULL, 'Polestar 3',
 9, 9.2, 8.5, 9.5, 7.5, 5, 9.2),

-- Polestar 4
(20, 'polestar-4', '4', 'Polestar 4',
 'SUV', 'Electric', 'Automatic', 5,
 64900, 590, 526, 200, 5, 2024,
 '#1a1a1a', 'Best Tech', 'Polestar 4',
 8.8, 9, 8.2, 9.5, 7.5, 5.8, 8.8),

-- Land Rover Discovery Sport D200
(38, 'land-rover-discovery-sport-d200', 'Discovery Sport D200', 'Land Rover Discovery Sport D200',
 'SUV', 'Diesel', 'Automatic', 7,
 54900, 950, 897, 0, 5, 2024,
 '#1a1a1a', 'Most Practical', 'Land Rover Discovery Sport',
 7.8, 9, 9.8, 8.2, 6.8, 5.5, NULL),

-- Land Rover Defender 110
(38, 'land-rover-defender-110', 'Defender 110', 'Land Rover Defender 110',
 'SUV', 'Diesel', 'Automatic', 5,
 74900, 900, 857, 0, 5, 2024,
 '#444444', NULL, 'Land Rover Defender (L663)',
 7.2, 9.2, 9.5, 8.5, 7, 5.2, NULL),

-- Alfa Romeo Stelvio
(26, 'alfa-romeo-stelvio', 'Stelvio', 'Alfa Romeo Stelvio',
 'SUV', 'Petrol', 'Automatic', 5,
 56900, 750, 525, 0, 5, 2024,
 '#8d1e1e', NULL, 'Alfa Romeo Stelvio',
 7.5, 8.8, 8.2, 8.5, 6.8, 5.5, NULL),

-- MG 3 Hybrid+
(18, 'mg-3-hybrid', '3 Hybrid+', 'MG 3 Hybrid+',
 'Hatchback', 'Hybrid', 'Automatic', 5,
 19900, 900, 293, 0, 4, 2024,
 '#c00', 'Best Value', 'MG3',
 7.5, 7.5, 6.8, 7.5, 7.2, 9.2, 1.5),

-- MG ZS
(18, 'mg-zs', 'ZS', 'MG ZS',
 'Crossover', 'Petrol', 'Manual', 5,
 22900, 780, 448, 0, 4, 2024,
 '#c00', NULL, 'MG ZS',
 7, 7.8, 8.2, 7.2, 7, 8.8, NULL),

-- DS DS 7
(33, 'ds-ds-7', 'DS 7', 'DS DS 7',
 'SUV', 'PHEV', 'Automatic', 5,
 52900, 750, 555, 50, 5, 2024,
 '#1a1a1a', NULL, 'DS 7',
 8, 8.8, 8.8, 8.8, 7, 5.5, 6.2),

-- Smart #3
(34, 'smart-3', '#3', 'Smart #3',
 'Crossover', 'Electric', 'Automatic', 5,
 42900, 455, 370, 150, 5, 2024,
 '#f2874d', NULL, 'Smart #3',
 8.2, 8.5, 7.5, 8.8, 7.2, 6.8, 8.5),

-- Cadillac Optiq
(39, 'cadillac-optiq', 'Optiq', 'Cadillac Optiq',
 'Crossover', 'Electric', 'Automatic', 5,
 56900, 480, 490, 150, 5, 2024,
 '#1a1a1a', NULL, 'Cadillac Optiq',
 8, 8.8, 8, 8.8, 7, 5.8, 8),

-- Genesis GV70
(36, 'genesis-gv70', 'GV70', 'Genesis GV70',
 'SUV', 'Electric', 'Automatic', 5,
 68900, 455, 503, 235, 5, 2024,
 '#14213d', NULL, 'Genesis GV70',
 8, 9.2, 8.2, 9, 7.5, 5.2, 8.8);
