#!/usr/bin/env python3
"""
Script to delete a test user and their profile data
"""

import os
import sys
from supabase import create_client, Client

# Add the project root to the path so we can import from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Supabase configuration
SUPABASE_URL = "https://yvevlrsothtppvpaszuq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"

def delete_test_user():
    """Delete the test user and their profile data"""
    
    try:
        # Initialize Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Email of the test user to delete
        test_email = "jacovdh@yahoo.co.uk"
        
        print(f"🔍 Looking for user with email: {test_email}")
        
        # First, let's find the user in auth.users (we can't directly query this, but we can check profiles)
        print("📋 Checking consultant_profiles table...")
        
        # Get consultant profiles to find the user_id
        response = supabase.table('consultant_profiles').select('*').execute()
        
        if response.data:
            print(f"Found {len(response.data)} consultant profiles")
            for profile in response.data:
                print(f"  - User ID: {profile.get('user_id')}")
        else:
            print("No consultant profiles found")
        
        # Get client profiles as well
        print("📋 Checking client_profiles table...")
        response = supabase.table('client_profiles').select('*').execute()
        
        if response.data:
            print(f"Found {len(response.data)} client profiles")
            for profile in response.data:
                print(f"  - User ID: {profile.get('user_id')}")
        else:
            print("No client profiles found")
        
        print("\n⚠️  Note: To completely delete a user, you need to:")
        print("1. Go to Supabase Dashboard → Authentication → Users")
        print("2. Find the user and click 'Delete user'")
        print("3. This will automatically clean up related data")
        
        # We can delete profile records, but the auth user needs to be deleted from the dashboard
        print("\n🗑️  Would you like me to delete profile records? (y/n): ", end="")
        choice = input().lower().strip()
        
        if choice == 'y':
            # Delete from consultant_profiles
            print("🗑️  Deleting from consultant_profiles...")
            supabase.table('consultant_profiles').delete().neq('user_id', '00000000-0000-0000-0000-000000000000').execute()
            print("✅ consultant_profiles cleared")
            
            # Delete from client_profiles
            print("🗑️  Deleting from client_profiles...")
            supabase.table('client_profiles').delete().neq('user_id', '00000000-0000-0000-0000-000000000000').execute()
            print("✅ client_profiles cleared")
            
            print("\n✅ Profile records deleted!")
            print("⚠️  Remember to delete the auth user from Supabase Dashboard")
        else:
            print("❌ Profile deletion cancelled")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n🔧 Manual deletion steps:")
        print("1. Go to Supabase Dashboard")
        print("2. Navigate to Authentication → Users")
        print("3. Find jacovdh@yahoo.co.uk")
        print("4. Click 'Delete user'")
        print("5. Confirm deletion")

if __name__ == "__main__":
    delete_test_user()
