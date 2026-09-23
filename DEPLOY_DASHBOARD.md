# JSM TRAVEL v99 — Cloudflare Worker + D1

This build replaces the old mixed static + PHP/MySQL deployment model with a single Cloudflare Worker serving the website and API, with D1 for requests and hotel data.

## What is fixed
- No PHP is required by the public website.
- `/api/health` confirms Worker + D1 binding.
- `/api/hotels` reads the existing `hotels` table when available.
- `/api/trip-request` saves website requests to D1.
- `/api/hotel-search` never invents worldwide prices; it can return local D1 hotels and clearly reports when a live supplier is not connected.
- `/api/flight-search` never invents flight prices.
- The generic “صيّدلي أرخص حجز” model remains excluded.
- Siwa data in this build is based on the uploaded verified 9-hotel workbook.

## One Cloudflare setting
The package intentionally does not invent the D1 database UUID. In the Cloudflare Worker settings, bind the existing database named `jsm-travel-db` to the Worker variable `DB`. If using Wrangler, replace the single placeholder `REPLACE_WITH_YOUR_EXISTING_D1_DATABASE_ID`.

After the binding is correct, `/api/health` should report `d1: true`.
