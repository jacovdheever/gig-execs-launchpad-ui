-- Check current policies and fix RLS for staff_users

-- First, view current policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'staff_users';

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Super users can manage staff" ON staff_users;
DROP POLICY IF EXISTS "Staff can read own record" ON staff_users;
DROP POLICY IF EXISTS "Super users can manage all staff" ON staff_users;

-- Create new policies with correct logic

-- 1. Allow users to read their own staff record (needed for login check)
CREATE POLICY "staff_read_own_record"
  ON staff_users FOR SELECT
  USING (user_id = auth.uid() AND is_active = true);

-- 2. Only super_users can insert new staff
CREATE POLICY "super_user_insert_staff"
  ON staff_users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM staff_users su
      WHERE su.user_id = auth.uid()
      AND su.role = 'super_user'
      AND su.is_active = true
    )
  );

-- 3. Only super_users can update staff
CREATE POLICY "super_user_update_staff"
  ON staff_users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM staff_users su
      WHERE su.user_id = auth.uid()
      AND su.role = 'super_user'
      AND su.is_active = true
    )
  );

-- 4. Only super_users can delete staff
CREATE POLICY "super_user_delete_staff"
  ON staff_users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM staff_users su
      WHERE su.user_id = auth.uid()
      AND su.role = 'super_user'
      AND su.is_active = true
    )
  );

-- Verify new policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'staff_users';

