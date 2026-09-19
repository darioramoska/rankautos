# RankAutos — Developer Handoff Package

**Date:** May 3, 2026  
**Version:** 1.0  
**Stack target:** Next.js 14 (App Router) + PostgreSQL + Node/Express scraper service

---

## Overview

RankAutos is a pan-European car comparison and ranking platform. It aggregates listings from 10+ EU marketplaces (AutoScout24, mobile.de, LaCentrale, etc.), scores every listing across 7 criteria (Range, Safety, Practicality, Technology, Reliability, Value for Money, Charging Speed), and lets users reweight those criteria to surface their personal best match.

The design prototype in `RankAutos.html` is a **high-fidelity HTML/React prototype** showing the complete intended UI. The task is to **recreate this UI** inside a production Next.js app backed by a real PostgreSQL database and a scraper/ingestion service.

---

## Fidelity

**High-fidelity.** The prototype uses final colors, typography, spacing, component shapes, and interactions. Recreate the UI pixel-accurately using the design tokens below. Do not use a third-party component library — the design is entirely custom.

---

## Screens / Views

### 1. Home / Filter Screen (`/`)

**Purpose:** User sets preferences (fuel, body type, budget, platforms, country, range, seats, boot, transmission, color) and launches the ranking.

**Layout:**
- Full-page flex column, `background: #f7f5f2`
- **Hero section** — `background: #092477`, `padding: 52px 32px 60px`, max-width 860px centered, radial accent glow `rgba(155,44,114,0.15)` at 75% 40%
  - Logo row: 34×34 accent square (`#9b2c72`, border-radius 9px) + "RankAutos" wordmark (18px 700) + "Pan-European" pill badge
  - Tagline: 12px 700 uppercase, letter-spacing 2px, color `#9b2c72`
  - H1: clamp(26px,5vw,50px), weight 700, letter-spacing -1.5px, line-height 1.05
  - Subtext: 15px, `rgba(255,255,255,0.45)`, max-width 460
  - Stats row: 4 items [17 models / 7 criteria / 10 EU platforms / Daily refresh], number 20px 700 accent, label 10px uppercase
- **Steps infographic strip** — white bg, 3-step horizontal row with SVG icons and arrow connectors
- **Filter section** — 860px max-width, collapsible accordion cards (border-radius 12px, border `#e4e0db`)
  - Fuel Type chips (pill style, dark active state)
  - Transmission chips (Automatic / Manual with custom SVG icons)
  - Body Type chips (SVG silhouette + label, 90px min-width, dark active state)
  - Budget Range dual-thumb slider + preset pills
  - Country/Market grid of flag+name pills
  - Platforms to Scan pill chips
  - Minimum Driving Range single slider (0–700 km)
  - Exterior Colour round swatches + label
  - Minimum Seats buttons (Any / 2+ / 4+ / 5+ / 7+)
  - Boot Space Range dual-thumb slider (0–1200 L)
- **CTA button:** "Step 2 — See Rankings", dark bg, 16px 36px padding, border-radius 16px, hover lifts 1px
- **How It Works** infographic at bottom (platforms → daily scan → RankAutos box → ranked list)
- **Disclaimer** footer strip

---

### 2. Results / Rankings Screen

**Purpose:** Shows ranked list of cars matching filters, with customizable scoring weights.

**Layout:**
- 2-column layout: left sidebar (weights) + right results list
- **Sidebar** (320px wide, sticky):
  - "Your priorities" heading
  - 7 `WeightSlider` rows — label, description, 0–10 range input, numeric readout in accent color
  - "Reset" link
- **Results list:**
  - Sort controls row
  - Result cards in a vertical stack
  - Each `ResultCard`: rank number (#1 gold / #2 silver / #3 bronze) + 100×62 car image + brand/model name + badge pill + fuel icon + type + range + "from €X" price + listing count pill + best platform flag + 56px score ring on right

**ResultCard states:**
- Default: `border: 1.5px solid #e4e0db`, `box-shadow: 0 2px 12px rgba(0,0,0,.07)`
- Hover: border `#092477`, `translateY(-1px)`, `box-shadow: 0 8px 40px rgba(0,0,0,.13)`, chevron appears

---

### 3. Car Detail Screen

**Purpose:** Shows full scoring breakdown + all listings across platforms for a single car model.

**Layout:**
- Back button row
- Car hero: image (large, 160px+ height) + brand/model/type/fuel metadata + score ring (large, 80px) + MSRP
- Score breakdown: 7 horizontal bars, each showing criterion label + score bar (color-coded green/yellow/red) + numeric score
- Listings section: grouped by platform, each platform shown as an expandable group
- Per-listing row: flag + platform name + year + mileage + condition + location + color swatch + price + adjusted score ring + external link arrow

---

### 4. Platform Listings Modal

**Purpose:** Full paginated listings table for a specific car + platform combination.

**Layout:**
- Full-screen overlay, dark blue tint `rgba(9,36,119,0.55)`
- Modal: max-width 820px, max-height 90vh, `border-radius: 20px`
- Header: platform flag + name + car name, listing count, close ×
- Filter bar (gray bg): Condition toggle (All/New/Used) + Max km slider + Min year slider
- Column headers: Platform / Year / Mileage / Condition / Location / Price / Score
  - Grid: `1fr 52px 90px 70px 1fr 82px 44px`
- Rows: best listing highlighted dark (`#092477` bg, white text), rest on `#f7f5f2`, each row is an `<a>` opening external URL in new tab
- Pagination: prev/next + page number buttons

---

## Design Tokens

```css
--bg:           #f7f5f2;
--surface:      #ffffff;
--dark:         #092477;
--mid:          #6b6560;
--border:       #e4e0db;
--accent:       #9b2c72;
--accent-light: oklch(0.94 0.06 340);
--warm:         oklch(0.72 0.17 55);
--warm-light:   oklch(0.96 0.06 55);
--green:        oklch(0.68 0.18 145);
--yellow:       oklch(0.78 0.18 88);
--red:          oklch(0.62 0.18 25);
--radius:       16px;
--shadow:       0 2px 12px rgba(0,0,0,.07);
--shadow-lg:    0 8px 40px rgba(0,0,0,.13);
```

**Typography:** `Space Grotesk` (Google Fonts), weights 300/400/500/600/700

**Score colors:**
- ≥ 8.5 → `--green`
- ≥ 7.0 → `--yellow`
- < 7.0 → `--red`

---

## Scoring Logic

### Model base scores
Each car model has fixed base scores (1–10) for each of the 7 criteria. See `database/schema.sql` → `car_model_scores` table.

### Listing adjusted scores
Individual listing scores are degraded from base scores based on age and mileage:

```
age = currentYear - listing.year
km  = listing.mileage / 10000

range:        base - (isEV ? age*0.14 + km*0.02 : age*0.04)
safety:       base - age * 0.18
practicality: base - age*0.04 - km*0.01
tech:         base - age * 0.28
reliability:  base - km * 0.04
value:        base + age*0.22 - km*0.02   ← older = better value
charging:     isEV ? base - age*0.18 : base
```
All scores clamped to [1, 10].

### Weighted score
```
weightedScore = Σ(score[c] * weight[c]) / Σ(weight[c])
```
Rounded to 1 decimal place.

---

## Interactions & Behavior

| Interaction | Behavior |
|---|---|
| Filter accordion | Click header toggles open/closed with 200ms rotate chevron |
| Dual-range slider | Two overlapping `<input type=range>`, both pointer-events:none except thumbs; track fill drawn as absolute positioned div |
| Result card click | Navigates to Car Detail screen |
| Platform chip on detail | Opens Platform Modal |
| Platform Modal close | Click backdrop OR press Escape |
| External listing link | Opens in new tab (`target="_blank"`) |
| Weight sliders | Live re-sort of results list on every change |
| "Clear all" filters | Resets all filter state to defaults |
| Body type chip | SVG silhouette changes color (white when active, --mid when inactive) |

---

## State Management

Use React Context or Zustand. Key state:

```typescript
interface AppState {
  screen: 'home' | 'results' | 'detail';
  
  // Filters (persisted to URL params)
  filters: {
    fuel: string[];           // ['Electric','Hybrid',...]
    type: string[];           // ['SUV','Crossover',...]
    budgetMin: number;        // 0
    budgetMax: number;        // 80000
    seats: number;            // 0 = any
    platforms: string[];      // [] = all
    countries: string[];      // [] = all
    minRange: number;         // km, 0 = any
    transmission: string[];
    colors: string[];
    minBoot: number;
    maxBoot: number;          // 1200
  };
  
  // Scoring weights (persisted to localStorage)
  weights: {
    range: number;        // 0–10
    safety: number;
    practicality: number;
    tech: number;
    reliability: number;
    value: number;
    charging: number;
  };
  
  selectedCarId: number | null;
  modalPlatform: string | null;
}
```

Default weights: all 5 (equal weighting).

---

## Files in This Package

| File | Purpose |
|---|---|
| `README.md` | This document — complete spec |
| `RankAutos.html` | Hi-fi design prototype — reference for all UI |
| `database/schema.sql` | Full PostgreSQL schema |
| `database/seed_data.sql` | Initial car model + listing seed data |
| `api/API_SPEC.md` | REST API endpoint specification |
| `integrations/DATA_SOURCES.md` | EU platform scraping & partnership guide |
| `deployment/LAUNCH_GUIDE.md` | Hosting, env vars, go-live checklist |
