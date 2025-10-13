-- Create First Super User Staff Account
-- Run this AFTER running 001_staff_system.sql

-- Insert first super_user staff account for Jaco van den Heever
INSERT INTO staff_users (user_id, first_name, last_name, role, is_active)
VALUES (
  '0aeed0a0-59cc-4ae3-9a47-5f099b783aac',
  'Jaco',
  'van den Heever',
  'super_user',
  true
);

-- Verify the staff user was created
SELECT * FROM staff_users WHERE user_id = '0aeed0a0-59cc-4ae3-9a47-5f099b783aac';

-- You can now login at /staff/login with your regular GigExecs credentials
-- (jaco.vandenheever@gigexecs.com)

