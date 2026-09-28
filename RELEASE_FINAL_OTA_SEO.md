# JSM TRAVEL — FINAL OTA + SEO Build

This build preserves the existing Cloudflare Worker + D1 architecture and upgrades the frontend instead of replacing the backend.

## Included
- Premium OTA-style Arabic homepage with the approved JSM globe logo and poster.
- Modern bilingual Arabic/English entry pages.
- Global booking hub for Travelport flights + FX-Port hotels.
- Local Egypt hotel collection using the existing hotel data/media files.
- Hotel search/filter UI and global hotel room lookup UI.
- Package/trip request flow saved through `/api/trip-request`.
- SEO title/description/canonical/hreflang/OG/Twitter metadata on the main entry pages.
- Updated sitemap without the 404 URL.
- Existing D1 binding and Worker APIs preserved.
- No payment gateway activated.
- No DNS changes required.

## Deployment
Deploy this package using the existing Cloudflare Worker project `jsmtravel` and its existing `wrangler.json`.
Do not create a new Worker or replace the D1 database.

Required existing secrets for live provider searches:
- Travelport credentials/PCC
- FXPORT_API_KEY

The website will remain functional in fallback/request mode if a live supplier key is not configured.
