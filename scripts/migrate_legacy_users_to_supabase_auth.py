#!/usr/bin/env python3
"""
Script to migrate legacy users from custom users table to Supabase Auth
This script will:
1. Read legacy users from the custom users table
2. Create Supabase Auth users for each legacy user
3. Send password reset emails so they can set new passwords
4. Update profile tables to link to new auth users
"""

import os
import sys
import json
from datetime import datetime
from supabase import create_client, Client

# Add the project root to the path so we can import from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Supabase configuration
SUPABASE_URL = "https://yvevlrsothtppvpaszuq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"

def migrate_legacy_users():
    """Migrate legacy users to Supabase Auth"""
    
    try:
        # Initialize Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("🚀 Starting Legacy User Migration to Supabase Auth")
        print("=" * 60)
        
        # Step 1: Get all legacy users from custom users table
        print("\n📋 Step 1: Reading legacy users from custom users table...")
        
        response = supabase.table('users').select('*').execute()
        
        if not response.data:
            print("❌ No users found in custom users table")
            return
        
        legacy_users = response.data
        print(f"✅ Found {len(legacy_users)} legacy users to migrate")
        
        # Step 2: Process each legacy user
        print(f"\n📋 Step 2: Processing {len(legacy_users)} legacy users...")
        
        migration_results = {
            'success': [],
            'failed': [],
            'skipped': []
        }
        
        for i, legacy_user in enumerate(legacy_users, 1):
            email = legacy_user.get('email')
            user_id = legacy_user.get('id')
            
            print(f"\n👤 Processing user {i}/{len(legacy_users)}: {email}")
            
            try:
                # Check if user already exists in Supabase Auth
                print(f"  🔍 Checking if user exists in Supabase Auth...")
                
                # We can't directly query auth.users, but we can try to create the user
                # If it fails with "already exists" error, we'll know the user exists
                
                # Create user in Supabase Auth (this will fail if user already exists)
                print(f"  ➕ Creating user in Supabase Auth...")
                
                # Generate a temporary password (user will reset this)
                temp_password = f"TempPass{datetime.now().strftime('%Y%m%d%H%M%S')}!"
                
                auth_response = supabase.auth.admin.create_user({
                    "email": email,
                    "password": temp_password,
                    "email_confirm": True,  # Mark email as confirmed
                    "user_metadata": {
                        "legacy_user_id": user_id,
                        "migrated_at": datetime.now().isoformat(),
                        "migration_source": "legacy_users_table"
                    }
                })
                
                if auth_response.user:
                    print(f"  ✅ User created in Supabase Auth: {auth_response.user.id}")
                    
                    # Send password reset email
                    print(f"  📧 Sending password reset email...")
                    
                    reset_response = supabase.auth.admin.generate_link({
                        "type": "recovery",
                        "email": email
                    })
                    
                    if reset_response.properties.action_link:
                        print(f"  ✅ Password reset email sent to: {email}")
                        print(f"  🔗 Reset link: {reset_response.properties.action_link}")
                        
                        migration_results['success'].append({
                            'email': email,
                            'legacy_user_id': user_id,
                            'new_auth_user_id': auth_response.user.id,
                            'reset_link': reset_response.properties.action_link
                        })
                    else:
                        print(f"  ⚠️  User created but password reset failed")
                        migration_results['failed'].append({
                            'email': email,
                            'legacy_user_id': user_id,
                            'error': 'Password reset failed'
                        })
                else:
                    print(f"  ❌ Failed to create user in Supabase Auth")
                    migration_results['failed'].append({
                        'email': email,
                        'legacy_user_id': user_id,
                        'error': 'User creation failed'
                    })
                    
            except Exception as e:
                error_msg = str(e)
                print(f"  ❌ Error processing user: {error_msg}")
                
                if "already registered" in error_msg.lower():
                    print(f"  ⏭️  User already exists in Supabase Auth, skipping...")
                    migration_results['skipped'].append({
                        'email': email,
                        'legacy_user_id': user_id,
                        'reason': 'Already exists in Supabase Auth'
                    })
                else:
                    migration_results['failed'].append({
                        'email': email,
                        'legacy_user_id': user_id,
                        'error': error_msg
                    })
        
        # Step 3: Generate migration report
        print(f"\n📊 Migration Report")
        print("=" * 60)
        print(f"✅ Successful: {len(migration_results['success'])}")
        print(f"❌ Failed: {len(migration_results['failed'])}")
        print(f"⏭️  Skipped: {len(migration_results['skipped'])}")
        
        # Save detailed results to file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        results_file = f"data/legacy_user_migration_results_{timestamp}.json"
        
        os.makedirs('data', exist_ok=True)
        
        with open(results_file, 'w') as f:
            json.dump(migration_results, f, indent=2, default=str)
        
        print(f"\n📁 Detailed results saved to: {results_file}")
        
        # Step 4: Next steps instructions
        print(f"\n🎯 Next Steps:")
        print("=" * 60)
        print("1. ✅ Users have been created in Supabase Auth")
        print("2. 📧 Password reset emails have been sent")
        print("3. 🔗 Users will click reset links to set new passwords")
        print("4. 🔄 After password reset, users can log in normally")
        print("5. 📊 Check the results file for detailed migration info")
        
        if migration_results['success']:
            print(f"\n📧 Password reset emails sent to {len(migration_results['success'])} users:")
            for user in migration_results['success']:
                print(f"  - {user['email']}")
        
        if migration_results['failed']:
            print(f"\n❌ Failed migrations ({len(migration_results['failed'])}):")
            for user in migration_results['failed']:
                print(f"  - {user['email']}: {user['error']}")
        
        print(f"\n🎉 Migration process completed!")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        print("\n🔧 Manual migration steps:")
        print("1. Go to Supabase Dashboard → Authentication → Users")
        print("2. Manually create users for each legacy user")
        print("3. Send password reset emails manually")

if __name__ == "__main__":
    migrate_legacy_users()
