-- Fix dashboard_summary view to include both 'verified' and 'vetted' status values
-- This migration updates the verified_users count to include users with either status

-- Drop the existing view
DROP VIEW IF EXISTS dashboard_summary;

-- Recreate the view with the corrected vetting_status check
CREATE VIEW dashboard_summary AS
SELECT
  (SELECT count(*) FROM users WHERE user_type='consultant') AS total_professionals,
  (SELECT count(*) FROM users WHERE user_type='client') AS total_clients,
  (SELECT count(*) FROM users WHERE vetting_status IN ('verified', 'vetted')) AS verified_users,
  (SELECT count(*) FROM projects) AS total_gigs,
  (SELECT count(*) FROM bids) AS total_bids,
  (SELECT sum(amount) FROM payments) AS total_transaction_value;

-- Grant access to authenticated users
GRANT SELECT ON dashboard_summary TO authenticated;

