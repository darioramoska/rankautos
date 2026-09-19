# RankAutos — mobile (Expo / React Native)

A native-feeling iOS port of the RankAutos web app (`../web`). Same mock `CAR_DATA` dataset,
same scoring/filtering logic, same visual language (violet→magenta gradients, glass tiles,
Space Grotesk type) — rebuilt as an Expo Router app instead of Next.js pages.

Scaffolded with:

```
npx create-expo-app@latest mobile --template default
```

(SDK 57, TypeScript + Expo Router file-based navigation, the current stable default template at
the time this was built. The template's demo tab UI — `app-tabs`, `explore`, the animated splash
icon, etc. — was removed and replaced with the screens below; nothing about the underlying
project setup, `app.json`, or dependency baseline was changed beyond that cleanup.)

## Running it

- **Quick preview on a real iPhone (no Mac needed):** install the **Expo Go** app from the App
  Store, then from `mobile/` run:

  ```
  npx expo start
  ```

  and scan the QR code with your iPhone's camera. Expo Go will load the JS bundle over the LAN.

- **A real native build (needs a Mac + Xcode):**

  ```
  npx expo run:ios
  ```

  This compiles an actual iOS binary and launches it in the simulator (or on a connected
  device). Not something this environment can do — see below.

- **Browser preview (what was actually used to verify this build):**

  ```
  npx expo start --web
  ```

## What was verified, and how — and what wasn't

This was built on Windows with no Xcode/macOS available, so **no real iOS binary was ever built
or run**, and nothing here has been confirmed to work on an actual device or simulator. Two
things were checked, both from the terminal:

1. **`npx tsc --noEmit`** — passes cleanly, no type errors, across the whole `src/` tree.
2. **`npx expo start --web`** — the Metro web bundler compiles and serves the app without build
   errors; the served HTML was fetched and inspected for real app content (not an error page),
   and the browser console/network log showed no runtime exceptions on the Home screen.

Web-preview via react-native-web is a reasonable proxy for "does the React tree render and does
the business logic run correctly," but it is **not** a substitute for testing on iOS: native-only
behavior (gesture handling feel, safe-area insets on notched devices, `expo-blur`'s actual blur
effect — it's a no-op tint on web, `LayoutAnimation` behavior, the modal presentation / swipe-to-
dismiss chrome, real font rendering, `@react-native-assets/slider` touch handling) has not been
exercised at all. Treat this as "compiles and the logic is sound," not "confirmed to work on
iPhone."

## Structure

```
src/
  lib/            ported business logic (see below)
  components/     shared UI: ScoreBadge, CarImage, RankBadge, icons, chips, sliders, FilterGroup
  screens/        the 4 screens' actual content (HomeScreen, ResultsScreen, CarDetailScreen,
                   PlatformListingsScreen) — kept separate from the route files, mirroring how
                   web/src/components is separate from web/src/app
  app/            Expo Router routes — thin wrappers that read/encode navigation params and
                   wire screens together (index → results → car-detail → platform-listings)
```

### `src/lib/` — ported from `web/src/lib/`

- `types.ts`, `data.ts` — copied verbatim (pure TS/data, no DOM APIs, nothing to change).
- `scoring.ts` — copied verbatim except `scoreColor()`, which returned CSS custom-property
  strings (`"var(--green)"`) on web; RN has no CSS variables, so it now returns the matching hex
  from `theme.ts`.
- `useWeights.ts` — same default-5-per-criterion behavior, `localStorage` swapped for
  `@react-native-async-storage/async-storage` (async, so there's now a `loaded` guard to avoid
  writing the defaults back to storage before the initial read resolves).
- `filters.ts` — the web version encoded `Filters` into a `URLSearchParams` query string. Expo
  Router passes navigation params, not a URL, so this now just JSON-stringifies the whole
  `Filters` object into a single route param (`f`). `encodeFiltersParam` / `decodeFiltersParam`
  replace `encodeFilters` / `decodeFilters`. Kept intentionally simple, per the brief.
- `theme.ts` — new file, no web equivalent. Hex/RN mirror of `web/src/app/globals.css`'s custom
  properties (colors, gradients, radii, shadow presets, Space Grotesk font family names).

### Screens / navigation

- `app/index.tsx` (Home) → `app/results.tsx` (Results, pushed) → `app/car-detail.tsx` (modal,
  `presentation: 'modal'`) → `app/platform-listings.tsx` (modal on top of that). Stack is defined
  in `app/_layout.tsx`, which also loads Space Grotesk (400/500/600/700) before rendering anything.
- Filters travel through the stack as the `f` param; weights don't travel as params at all —
  every screen that needs them just calls `useWeights()`, which reads the same AsyncStorage key,
  so Results, Car Detail, and Platform Listings always agree on the current weights without
  threading them through navigation.

## Known deviations from the web app (and why)

- **Dual-thumb range slider** (budget, boot space): React Native has no built-in range slider.
  Per the brief, evaluated `@react-native-assets/slider` first — it's a real two-thumb
  `<RangeSlider>`, has **zero native dependencies** (pure JS/TSX, so no linking step that could
  silently be broken and unverifiable without a Mac), and explicitly supports
  `react-native-web`, which made it the safer choice given the only available verification path
  here is the web bundler. Used it as-is rather than falling back to two adjacent single sliders.
- **Gradient-filled heading text** (`ranked to find your dream car.` on the Home hero): the web
  version uses `background-clip: text` for a gradient fill on the text. RN text has no native
  gradient-fill; the only way to get one is `@react-native-masked-view/masked-view`. Adding a
  dependency for one decorative heading felt like scope creep, so it's a solid highlight color
  (`#f6b6ff`) instead — same effect the web version's `.gradient-text` reduces to at low
  saturation anyway.
- **"How to use RankAutos" 3-step infographic**: web lays these out horizontally with connecting
  arrow SVGs between them; there's no room for that at phone width, so it's a vertical list
  (icon + number, title, description) with the arrows dropped.
- **"How it works" platform → RankAutos → results diagram**: kept its horizontal layout (matches
  the web version's own `overflow-x-auto` treatment) inside a horizontal `ScrollView`, rather than
  redesigning it as a vertical flow.
- **Listings tables** (`ListingsTable`, `PlatformListingsScreen`): the web version is a real CSS
  grid table with column headers. At phone width there's no room for a 7-column grid, so each
  listing is a stacked card (platform/badge row, year/mileage/condition/location row, price +
  score row) instead — same data, same sort order, same "best" highlight, just reflowed for a
  narrow screen.
- **Weight sliders on Results**: web pins a persistent sidebar next to the ranked list (desktop
  grid layout). On phone that sidebar is a collapsible "Your priorities" panel above the list —
  same 7 sliders, same live re-rank on every change, just tucked away by default so the list is
  visible immediately.
- **`expo-blur`**: used for the hero's "glass" tagline pill. The filter-icon tiles behind each
  `FilterGroup`'s icon use a `LinearGradient` soft-lavender tint instead of `BlurView` — they sit
  on a plain white surface (not over gradient/photo content), so a translucent blur wouldn't read
  as glass there anyway; matching the web app's own `.tile-soft` (gradient tint, not blur) was more
  faithful than forcing blur in where the source design didn't use it either.

## Not built (out of scope per the brief)

No Supabase/live-data wiring, no backend integration — same static `CAR_DATA` mock dataset as the
web app. No screens beyond the 4 in the brief (Home, Results, Car Detail, Platform Listings).
