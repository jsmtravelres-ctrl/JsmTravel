# JSM TRAVEL — FX-Port Hotels Integration

This build adds a backend-only FX-Port hotel search layer to the existing Cloudflare Worker.

## What is included
- `POST /api/hotel-search` → FX-Port hotel search
- `POST /api/hotel-rooms` → FX-Port room lookup
- `/api/health` reports whether `FXPORT_API_KEY` is configured and whether it is sandbox/live.
- Frontend `global-booking.html` now renders live FX-Port hotel results when the Worker Secret is present.
- No API key is included in this package.

## Cloudflare Worker Secret
Create a Worker Secret named:

`FXPORT_API_KEY`

Use the NEW sandbox key you create in FX-Port. Do not paste it into HTML, JavaScript, GitHub, ZIP files, or chat.

## API path note
FX-Port's public hotel integration page currently documents the hotel search resource as `POST /v1/hotels/search`, while the main API documentation states that API paths are prefixed with `/api/v1/`. The Worker therefore tries `/api/v1/hotels/search` first and `/v1/hotels/search` as a fallback if the first returns HTTP 404. The same compatibility fallback is used for room lookup.

## Booking is intentionally not enabled yet
Search and room lookup are enabled first. Hotel booking is state-changing and should only be wired after the sandbox search/room response is verified against the agency account. Do not give the Worker a live Read+Write key until the complete booking flow has been tested.
