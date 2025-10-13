# Staff Dashboard System - Setup Guide

This document provides complete setup instructions for the GigExecs Internal Staff Dashboard System.

## Overview

The staff dashboard system allows GigExecs team members to:
- View platform analytics and metrics
- Verify user accounts
- Impersonate users for support purposes
- Manage staff accounts (super_user only)
- View audit logs of all staff actions

## Architecture

### Tech Stack
- **Frontend**: React + TypeScript + shadcn/ui
- **Backend**: Supabase (Auth + Database) + Netlify Functions
- **Authentication**: Supabase Auth with staff metadata
- **Security**: RLS policies, HTTP-only cookies, JWT tokens

### Role Hierarchy
1. **support** - Basic dashboard access, can view metrics and audit logs
2. **admin** - Can verify users and impersonate for support
3. **super_user** - Full access, can manage staff accounts

Roles are hierarchical: super_user can do everything admin can do, admin can do everything support can do.

## Installation & Setup

### Step 1: Run Database Migration

1. Open your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and run `migrations/001_staff_system.sql`
4. Verify tables were created:
   ```sql
   SELECT * FROM staff_users;
   SELECT * FROM audit_logs;
   SELECT * FROM dashboard_summary;
   ```

### Step 2: Create First Super User

1. Register a regular user account via Supabase Dashboard:
   - Go to Authentication > Users
   - Click "Add User"
   - Enter email and password
   - Note the user ID after creation

2. Add staff record:
   ```sql
   INSERT INTO staff_users (user_id, first_name, last_name, role, is_active)
   VALUES (
     '<paste-user-id-here>',
     'Your',
     'Name',
     'super_user',
     true
   );
   ```

### Step 3: Configure Environment Variables

Ensure these are set in Netlify:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (backend only)
- `SUPABASE_JWT_SECRET` - JWT secret from Supabase project settings

### Step 4: Deploy

1. Commit changes to `develop` branch
2. Push to GitHub
3. Netlify will auto-deploy

### Step 5: Test Access

1. Navigate to `https://your-domain.com/staff/login`
2. Login with the super_user credentials
3. Verify dashboard loads with metrics

## User Guide

### Logging In

1. Go to `/staff/login`
2. Enter your staff credentials
3. You'll be redirected to `/staff/dashboard`

### Dashboard

The dashboard shows:
- Total professionals
- Total clients
- Verified users
- Total gigs
- Total bids
- Transaction value

### Quick Actions

- **User Verifications** - Review and approve pending users (Admin+)
- **Audit Logs** - View all staff activity (All roles)
- **Staff Management** - Manage staff accounts (Super User only)

### Impersonation (Admin & Super User Only)

**Purpose**: Troubleshoot user issues by viewing their account

**How to Use**:
1. Navigate to a user's profile
2. Click "Impersonate User" (requires admin role)
3. Session lasts 15 minutes
4. Red banner shows you're impersonating
5. Click "Exit Impersonation" to end

**Security**:
- All impersonation sessions are logged
- Sessions expire after 15 minutes
- HTTP-only cookies prevent XSS
- Audit logs are immutable

### Managing Staff (Super User Only)

1. Go to `/staff/users`
2. View all staff accounts
3. Create new staff accounts
4. Edit roles and permissions
5. Deactivate accounts

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled:

**staff_users**:
- Only super_users can read/modify
- Self-service not allowed

**audit_logs**:
- All staff can read
- No one can update or delete
- Insert only via functions

**impersonation_sessions**:
- Staff can read their own sessions
- No updates allowed

### Audit Logging

All staff actions are logged:
- User login/logout
- User verification
- Impersonation start/end
- Staff account changes
- All logs include timestamp, staff ID, action type, and details

### Impersonation Security

- 15-minute session expiry
- HTTP-only cookies (not accessible to JavaScript)
- Unique session tokens
- All sessions logged in audit_logs and impersonation_sessions
- Automatic session termination on error

## API Endpoints

### POST /.netlify/functions/staff-login

Authenticate staff user

**Request**:
```json
{
  "email": "staff@gigexecs.com",
  "password": "password"
}
```

**Response**:
```json
{
  "session": {...},
  "staff": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin",
    "is_active": true
  }
}
```

### POST /.netlify/functions/staff-impersonate-start

Start impersonation session (Admin+)

**Headers**: `Authorization: Bearer <jwt>`

**Request**:
```json
{
  "userId": "uuid-of-user-to-impersonate"
}
```

**Response**:
```json
{
  "sessionId": 123,
  "targetUser": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Cookie**: Sets `impersonation_token` HTTP-only cookie

### POST /.netlify/functions/staff-impersonate-end

End impersonation session

**Cookies**: Uses `impersonation_token` from cookie

**Response**:
```json
{
  "success": true,
  "message": "Impersonation ended"
}
```

## Troubleshooting

### Cannot Login

1. Verify user exists in Supabase Auth
2. Verify staff_users record exists with correct user_id
3. Verify `is_active = true`
4. Check browser console for errors

### Dashboard Shows No Data

1. Verify RLS policies are created
2. Check that grant on dashboard_summary view executed
3. Verify user has staff_users record
4. Check Supabase logs for errors

### Impersonation Not Working

1. Verify user has admin or super_user role
2. Check SUPABASE_JWT_SECRET is set in Netlify
3. Verify target user exists
4. Check browser allows cookies
5. Check Netlify function logs

### Audit Logs Not Showing

1. Verify staff_users record exists
2. Check RLS policy allows staff to read
3. Verify audit_logs inserts are working (check table directly)

## Development

### Adding New Staff Actions

1. Add action to Netlify function or frontend
2. Call `logAudit()` after action:
   ```typescript
   await logAudit(
     staffId,
     'action_name',
     'table_name',
     recordId,
     { any: 'additional details' }
   );
   ```

### Adding New Staff Pages

1. Create component in `src/app/staff/`
2. Wrap with `<StaffRoute>` or `<StaffRoute requiredRole="admin">`
3. Add route to `src/App.tsx`
4. Add navigation link in dashboard

### Testing

1. Create test staff accounts with different roles
2. Test each role's access permissions
3. Verify RLS policies block unauthorized access
4. Test impersonation flow end-to-end
5. Verify audit logs capture all actions

## Support

For issues or questions:
1. Check Supabase logs
2. Check Netlify function logs
3. Check browser console
4. Review RLS policies in Supabase
5. Contact platform administrator

## Future Enhancements

Planned features (not yet implemented):
- User verification workflow page
- Audit log search and filtering page
- Staff user management page
- Email notifications for staff actions
- Advanced analytics and reporting
- Bulk user operations

