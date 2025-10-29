# Database Migrations

This directory contains SQL migration files for the GigExecs platform.

## How to Run Migrations

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project
3. Go to the SQL Editor
4. Copy the contents of the migration file
5. Paste into the SQL Editor
6. Click "Run" to execute the migration

## Migration Files

### 001_staff_system.sql

**Purpose**: Creates the staff dashboard system infrastructure

**Creates**:
- `staff_users` table - Staff account management
- `audit_logs` table - Immutable audit logging
- `impersonation_sessions` table - Track staff impersonation sessions
- `dashboard_summary` view - Aggregated platform statistics
- RLS policies for all tables
- Indexes for performance

**After Running**:
1. Create your first super_user staff account:
   ```sql
   -- First, create a regular Supabase Auth user via the Supabase Dashboard
   -- Then link it to staff_users with super_user role:
   
   INSERT INTO staff_users (user_id, first_name, last_name, role, is_active)
   VALUES (
     '<auth_user_id>',  -- Replace with the auth.users ID
     'Your',
     'Name',
     'super_user',
     true
   );
   ```

2. That super_user can then manage other staff accounts via the staff dashboard UI at `/staff/users`

## Verification

After running the migration, verify the tables exist:

```sql
SELECT * FROM staff_users;
SELECT * FROM audit_logs;
SELECT * FROM impersonation_sessions;
SELECT * FROM dashboard_summary;
```

## Rollback

To rollback this migration:

```sql
DROP VIEW IF EXISTS dashboard_summary;
DROP TABLE IF EXISTS impersonation_sessions;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS staff_users;
DROP FUNCTION IF EXISTS log_audit_action();
```

**WARNING**: This will permanently delete all staff accounts and audit logs!

