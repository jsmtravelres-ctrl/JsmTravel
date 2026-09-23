# JSM TRAVEL v99 — Cloudflare Dashboard Deployment

## Worker
Deploy to the existing Worker:
`jsmtravel`

Do NOT change or delete the legacy Worker:
`late-waterfall-9d04`

## Bindings
Confirm these bindings on `jsmtravel`:

- `ASSETS` → Assets
- `DB` → D1 → `jsm-travel-db`

## Worker Secrets
Add these as **Secrets**, never as normal variables and never inside GitHub/ZIP:

- `TRAVELPORT_CLIENT_ID`
- `TRAVELPORT_CLIENT_SECRET`
- `TRAVELPORT_USERNAME`
- `TRAVELPORT_PASSWORD`
- `TRAVELPORT_PCC`
- `FXPORT_API_KEY`

The package contains only the integration code and reads the secrets at runtime.

## Checks after deployment
Open:
- `/api/health`
- `/api/hotels?limit=10`
- `/api/destinations`

Expected health fields include:
- `d1: true`
- `travelport: true` after all five Travelport secrets are configured
- `fxport: true` after `FXPORT_API_KEY` is configured

Do not expect live flight/hotel supplier results until the provider credentials are valid and the relevant account/PCC access is provisioned.
