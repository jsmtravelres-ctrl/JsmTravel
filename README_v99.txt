JSM TRAVEL — GLOBAL OTA v99 FINAL — 2026-09-23

Purpose
-------
This is the consolidated Cloudflare Workers + D1 release for JSM TRAVEL.
It is based on the previous Global OTA build and keeps the public website, hotel collections, SEO pages, booking/request flows, Worker API, and D1 architecture together.

Included
--------
- Arabic + English website
- Global booking / flight request UI
- Travelport TripServices flight-search integration layer (pre-production)
- FX-Port hotel-search integration layer
- 189 local hotel records in the static verified-data fallback
- D1 hotel lookup and lead/request storage
- Domestic and international trips
- Honeymoon
- Visas
- Nile Cruise
- Hajj & Umrah
- Custom tours
- Corporate events
- Medical tourism
- Destinations, offers, blog, FAQ, privacy and terms
- robots.txt, sitemap.xml, manifest and SEO metadata

Security
--------
No Travelport client secret, password, access token, FX-Port API key, or other private credential is stored in this package.
Use Cloudflare Worker Secrets for credentials.

Production notes
----------------
- Worker name: jsmtravel
- D1 binding: DB
- D1 database: jsm-travel-db
- Database ID: e862928e-75e0-485f-b55e-2ad1b9edd8c4
- Assets binding: ASSETS
- Public domain: jsmtravel.net
- Travelport environment: pre-production until production credentials/provisioning are completed.
- Do not modify the legacy Worker late-waterfall-9d04.
