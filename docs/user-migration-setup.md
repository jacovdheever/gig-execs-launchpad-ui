# User Migration Setup Guide

This guide explains how to set up and run the user migration process to move users from the `users` table to Supabase's `auth.users` table.

## Prerequisites

### 1. Environment Variables
Ensure you have the following environment variables set in your `.env` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://yvevlrsothtppvpaszuq.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. Service Role Key
The service role key is required for admin operations. You can find it in:
- **Supabase Dashboard** → **Settings** → **API** → **Service Role Key**

⚠️ **Important**: Never expose the service role key in frontend code. It's only used in server-side operations.

## Migration Process

### Step 1: Test Migration (Dry Run)
Before running the actual migration, test with a dry run:

```bash
npm run migrate:users:dry-run
```

This will:
- Show you what users would be migrated
- Display statistics without making any changes
- Help you verify the process works correctly

### Step 2: Run Actual Migration
Once you're satisfied with the dry run:

```bash
npm run migrate:users
```

This will:
- Read all users from the `users` table
- Create corresponding entries in `auth.users`
- Set user metadata (first_name, last_name, user_type)
- Send password reset emails to all migrated users

## What the Migration Does

### 1. Data Migration
- **Source**: `users` table
- **Destination**: `auth.users` table
- **Preserves**: All user data including ID, email, names, and user type

### 2. User Metadata
Sets the following metadata in `auth.users`:
```json
{
  "first_name": "John",
  "last_name": "Doe", 
  "user_type": "consultant",
  "migrated_from_users_table": true,
  "migration_date": "2025-01-XX"
}
```

### 3. Password Reset Emails
- Sends password reset emails to all migrated users
- Users can set new passwords and access the system
- Emails are sent via Supabase Auth's built-in email system

## Migration Statistics

The script provides detailed statistics:
- **Total Users**: Number of users found in `users` table
- **Created**: Users successfully created in `auth.users`
- **Skipped**: Users that already existed in `auth.users`
- **Errors**: Users that failed to migrate
- **Password Resets**: Password reset emails successfully sent

## Safety Features

### 1. Duplicate Prevention
- Checks if users already exist in `auth.users` before creating
- Skips existing users to prevent duplicates

### 2. Batch Processing
- Processes users in batches of 10 to avoid rate limiting
- Adds delays between batches for stability

### 3. Error Handling
- Continues processing even if individual users fail
- Logs detailed error information
- Provides comprehensive success/failure statistics

### 4. Dry Run Mode
- Test the migration without making changes
- Verify user data and process before actual migration

## Troubleshooting

### Common Issues

#### 1. Missing Environment Variables
```
❌ Missing required environment variables
```
**Solution**: Ensure all environment variables are set in your `.env` file

#### 2. Service Role Key Issues
```
❌ Error creating auth user: Invalid API key
```
**Solution**: Verify the service role key is correct and has admin permissions

#### 3. Rate Limiting
```
❌ Error: Rate limit exceeded
```
**Solution**: The script includes delays between batches. If you still hit limits, increase the delay in the script.

#### 4. Email Delivery Issues
```
❌ Error sending password reset email
```
**Solution**: Check your Supabase email configuration and SMTP settings

### Getting Help

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify your environment variables are correct
3. Ensure your Supabase project has the necessary permissions
4. Check the Supabase dashboard for any service issues

## Post-Migration Steps

### 1. Verify Migration
- Check the Supabase Auth dashboard for migrated users
- Verify user metadata is correctly set
- Test login with a few migrated users

### 2. User Communication
- Send announcement email to users about the migration
- Provide support channels for users having issues
- Monitor user adoption and login rates

### 3. Cleanup (Optional)
- Consider archiving the old `users` table data
- Update any remaining references to the old user system
- Monitor for any issues with the new auth system

## Security Considerations

### 1. Service Role Key
- Only use the service role key in secure, server-side environments
- Never commit the service role key to version control
- Rotate the key regularly for security

### 2. User Data
- All user data is migrated securely using Supabase's admin API
- No sensitive data is logged or exposed
- Password reset emails are sent through Supabase's secure email system

### 3. Access Control
- The migration script requires service role access
- Only authorized personnel should run the migration
- Consider running during low-usage periods

## Support

If you need help with the migration process:
1. Check this documentation first
2. Review the console output for error details
3. Verify your Supabase configuration
4. Contact support if issues persist

---

**Remember**: Always test with a dry run first and ensure you have backups of your data before running the actual migration!
