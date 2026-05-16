-- Widen the persona check constraint to allow newsletter signups.
-- Run order: 001_waitlist.sql must have been applied first.

ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS waitlist_persona_check;

ALTER TABLE waitlist
  ADD CONSTRAINT waitlist_persona_check
  CHECK (persona IN ('event', 'brand', 'newsletter'));
