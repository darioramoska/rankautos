# RankAutos — what's left, and who does it

## You (Dario)
1. **Rotate credentials** (they were pasted into a chat). Supabase → Settings → Database → reset password; Settings → API → roll the service-role key. Update `ingestion/.env` (`DATABASE_URL` = *Session pooler* string, `SUPABASE_SERVICE_ROLE_KEY`). Anon key needs no change.
2. **Try the app on your iPhone** (Expo Go): native tab-bar tint, Home hero shrinking on scroll, favorites, sign-up email flow. Tell me what looks off.
3. **Real listings — pick the routes you want to pursue**
   - US: MarketCheck API key (paid, trial available) → `MARKETCHECK_API_KEY` in `ingestion/.env`, then `npm run ingest:marketcheck` in `ingestion/`.
   - AutoScout24 partner API — apply at autoscout24.github.io.
   - mobile.de Data Feed — email partner@mobile.de (EU/German business registration usually required).
   - Euro NCAP — download the results CSV and put it in `ingestion/` (see `src/sources/ncap.ts`).
   - Otomoto has an official API (terms: "Regulamin Otomoto API") — check whether it exposes search/read access for a non-dealer.
4. **Deploy** the website (see `deployment/LAUNCH_GUIDE.md`) once you're happy with it.

## Decided: not scraping
Terms of Service review (Sept 2026), search-based — not a legal opinion:
- **Bilbasen.dk** — systematic collection/indexing needs explicit written permission.
- **mobile.de** — search only through its own search masks; circumventing them is not allowed.
- **Marktplaats / 2dehands** — database rights asserted; automated access only for API partners.
- **Otomoto** — database/copyright reserved to OLX Group; no public search API.
So: licensed feeds only (above). Cars.com / CarGurus / Autotrader: same, use MarketCheck.

## Me (when you ask)
- Real-data connectors once you have keys (MarketCheck is written, untested against the live API).
- More trims: add rows to `ingestion/src/trimData/*.ts`, run `npm run rollout:trims`.
- Web bottom-nav icons in the thin-outline style; split editorial scores out of `car_models`; saved searches / price alerts.

## Known limits
- All listings are demo data (`raw_data.source = 'mock'`); purge with `DELETE FROM listings WHERE raw_data->>'source'='mock'` when real feeds go live.
- US prices are stored in EUR (USD ÷ 1.08); the app displays €.
- The catalog is fetched at most every 5 minutes (`revalidate = 300` on Home/Results).
