# JSM TRAVEL — Travelport Secrets

Configure these as Cloudflare Worker Secrets (never commit them):
- TRAVELPORT_CLIENT_ID
- TRAVELPORT_CLIENT_SECRET
- TRAVELPORT_USERNAME
- TRAVELPORT_PASSWORD
- TRAVELPORT_PCC

Pre-production OAuth: https://auth.pp.travelport.net/oauth/token
Pre-production Air API: https://api.pp.travelport.net/11/air/

The Worker requests OAuth and calls the Search endpoint server-side. No credentials are exposed to the browser.
