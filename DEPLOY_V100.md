# JSM TRAVEL V100 — GROWTH READY

This package is built from the uploaded JSM_GITHUB_CLEAN archive, using V99 Batch 4 as the canonical Worker + site source.

## Included
- Arabic + English site
- Hotel data/media and destination pages
- Domestic + international trips
- Global hotel booking/request flow
- Flight search Worker route (Travelport credentials via secrets)
- FX-Port hotel search/rooms routes
- Visa pages
- Honeymoon
- Hajj & Umrah
- Nile Cruise
- D1 lead capture / trip requests
- Growth analytics: pageviews, CTA clicks and request-submit events
- Growth dashboard at `/growth.html`
- D1 migration `migrations/0002_growth.sql`

## Worker/D1 additions
New endpoints:
- POST `/api/analytics/event`
- GET `/api/analytics/summary` (requires `Authorization: Bearer <ADMIN_API_KEY>`)
- GET `/api/admin/leads` (requires `Authorization: Bearer <ADMIN_API_KEY>`)

Set `ADMIN_API_KEY` as a Cloudflare Worker Secret before using the dashboard.

## Deploy
From this directory:
`npx wrangler d1 migrations apply jsm-travel-db --remote`
then:
`npx wrangler deploy`

The package does not contain or expose API secrets.
