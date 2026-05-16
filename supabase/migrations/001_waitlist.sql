CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL,
  persona TEXT NOT NULL CHECK (persona IN ('event', 'brand')),

  -- Event-specific fields (nullable for brand persona)
  event_name TEXT,
  event_vertical TEXT,
  event_location TEXT,
  event_size TEXT,
  sponsor_target_budget TEXT,

  -- Brand-specific fields (nullable for event persona)
  company_name TEXT,
  target_vertical TEXT,
  region_focus TEXT,
  budget_tier TEXT,

  -- Common
  notes TEXT,
  source TEXT,

  UNIQUE(email, persona)
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (waitlist signup)
CREATE POLICY "Allow anonymous waitlist signup"
  ON waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

-- No SELECT for anon (admin only via service_role)
CREATE POLICY "Service role can read all"
  ON waitlist FOR SELECT
  TO service_role
  USING (true);

CREATE INDEX idx_waitlist_persona ON waitlist(persona);
CREATE INDEX idx_waitlist_created ON waitlist(created_at DESC);
