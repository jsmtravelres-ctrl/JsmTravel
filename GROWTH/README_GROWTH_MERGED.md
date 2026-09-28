# JSM TRAVEL — Growth merged into Worker/D1

Target:
- Worker: jsmtravel
- D1: jsm-travel-db
- Binding: DB
- Database ID: e862928e-75e0-485f-b55e-2ad1b9edd8c4

Merged backend capabilities:
- /api/hotels
- /api/hotels/:id
- /api/leads
- /api/trip-request (backward compatible)
- /api/events
- /api/growth-summary
- /api/destinations
- /api/hotel-search (existing FX-Port integration)
- /api/hotel-rooms (existing FX-Port integration)
- /api/flight-search (existing Travelport integration)
- /hotels/:slug-or-id dynamic SEO hotel pages
- /en/hotels/:slug-or-id dynamic English hotel pages
- /sitemap.xml generated from D1 hotels
- /robots.txt

Growth database:
- growth_events table
- leads table retained and extended safely on first write

The legacy Worker late-waterfall-9d04 is not modified.

Deployment note:
This package is the merged Worker/D1 source. A live Cloudflare deployment still requires Cloudflare authorization in the deployment environment. No credentials are stored in this package.
