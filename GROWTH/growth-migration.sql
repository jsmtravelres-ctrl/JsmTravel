-- JSM TRAVEL Growth migration
-- Safe to run against the existing jsm-travel-db.
CREATE TABLE IF NOT EXISTS growth_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_name TEXT NOT NULL,
  session_id TEXT,
  visitor_id TEXT,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  page_url TEXT,
  referrer TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_growth_events_name ON growth_events(event_name);
CREATE INDEX IF NOT EXISTS idx_growth_events_source ON growth_events(source);
CREATE INDEX IF NOT EXISTS idx_growth_events_created_at ON growth_events(created_at);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT,
  service_type TEXT,
  destination TEXT,
  travel_date TEXT,
  travellers INTEGER,
  phone TEXT,
  notes TEXT,
  stage TEXT DEFAULT 'new',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Existing leads tables are extended automatically by worker.js on first write.
-- Columns added:
-- name, hotel, budget, landing_page, medium, campaign, referrer,
-- session_id, visitor_id, updated_at
