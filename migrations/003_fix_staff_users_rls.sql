-- Fix RLS Policy for staff_users
-- The original policy prevented staff from reading their own record
-- This fixes it by allowing users to read their own staff record

-- Drop the overly restrictive policy
DROP POLICY IF EXISTS "Super users can manage staff" ON staff_users;

-- Allow users to read their own staff record
CREATE POLICY "Staff can read own record"
  ON staff_users FOR SELECT
  USING (user_id = auth.uid());

-- Only super_users can insert/update/delete staff records
CREATE POLICY "Super users can manage all staff"
  ON staff_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff_users su
      WHERE su.user_id = auth.uid()
      AND su.role = 'super_user'
      AND su.is_active = true
    )
  );

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'staff_users';

