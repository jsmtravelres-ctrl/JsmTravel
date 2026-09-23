JSM TRAVEL — GLOBAL OTA v99 FINAL

This release is a visual and UX rebuild on top of the Worker + D1 architecture.

Highlights:
- Completely redesigned Arabic homepage with premium travel-agency visual system.
- Responsive mobile navigation.
- Flight / hotel / destinations / offers / services entry points.
- Local JSM hotel collection search with static verified data fallback.
- Siwa collection preserved at 9 hotels from the verified workbook supplied by the client.
- Trip request form posts to /api/trip-request; no fake prices are generated.
- Existing public pages and booking backend remain in the package.
- Current Cloudflare production site is not touched by this package.

Deployment:
- Use the existing D1 database binding.
- Replace only the placeholder database_id in wrangler.jsonc with the real existing D1 ID.
- Deploy Worker + Assets using the normal Cloudflare Workers deployment flow.
