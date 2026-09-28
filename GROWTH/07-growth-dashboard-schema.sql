-- JSM TRAVEL Growth tracking schema
-- Adapt names/types to the existing Cloudflare D1 schema if needed.

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
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT NOT NULL,
  destination TEXT,
  hotel TEXT,
  travel_date TEXT,
  people INTEGER,
  budget TEXT,
  notes TEXT,
  source TEXT,
  landing_page TEXT,
  status TEXT DEFAULT 'new',
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_growth_events_name ON growth_events(event_name);
CREATE INDEX IF NOT EXISTS idx_growth_events_source ON growth_events(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
