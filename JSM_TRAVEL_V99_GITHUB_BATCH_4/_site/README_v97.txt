JSM TRAVEL GLOBAL PREMIUM v97 — WORKER + D1

A cleaned production architecture based on the uploaded v96 build. Public website is served by Cloudflare Worker Assets; D1 is used for the hotel database and incoming trip requests. Legacy PHP/MySQL files are intentionally not part of the served build because they cannot run natively inside a Cloudflare Worker.

Important: the D1 database ID is account-specific and is not guessed. Bind the existing `jsm-travel-db` database to `DB`.
