#!/usr/bin/env python3
"""
Script to check what users exist in the legacy users table
"""

import os
import sys
from supabase import create_client, Client

# Add the project root to the path so we can import from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Supabase configuration
SUPABASE_URL = "https://yvevlrsothtppvpaszuq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"

def check_legacy_users():
    """Check what users exist in the legacy users table"""
    
    try:
        # Initialize Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("🔍 Checking Legacy Users Table")
        print("=" * 50)
        
        # Check users table
        print("\n📋 Checking 'users' table...")
        response = supabase.table('users').select('*').execute()
        
        if response.data:
            print(f"✅ Found {len(response.data)} users in 'users' table:")
            for i, user in enumerate(response.data, 1):
                print(f"  {i}. ID: {user.get('id', 'N/A')}")
                print(f"     Email: {user.get('email', 'N/A')}")
                print(f"     Created: {user.get('created_at', 'N/A')}")
                print(f"     Updated: {user.get('updated_at', 'N/A')}")
                print()
        else:
            print("❌ No users found in 'users' table")
        
        # Check consultant_profiles table
        print("\n📋 Checking 'consultant_profiles' table...")
        response = supabase.table('consultant_profiles').select('*').execute()
        
        if response.data:
            print(f"✅ Found {len(response.data)} consultant profiles:")
            for i, profile in enumerate(response.data, 1):
                print(f"  {i}. User ID: {profile.get('user_id', 'N/A')}")
                print(f"     Job Title: {profile.get('job_title', 'N/A')}")
                print(f"     Phone: {profile.get('phone', 'N/A')}")
                print()
        else:
            print("❌ No consultant profiles found")
        
        # Check client_profiles table
        print("\n📋 Checking 'client_profiles' table...")
        response = supabase.table('client_profiles').select('*').execute()
        
        if response.data:
            print(f"✅ Found {len(response.data)} client profiles:")
            for i, profile in enumerate(response.data, 1):
                print(f"  {i}. User ID: {profile.get('user_id', 'N/A')}")
                print(f"     Company: {profile.get('company_name', 'N/A')}")
                print(f"     Phone: {profile.get('phone', 'N/A')}")
                print()
        else:
            print("❌ No client profiles found")
        
        print("\n🎯 Summary:")
        print("=" * 50)
        print("This script shows you what data exists in your legacy tables.")
        print("To migrate these users to Supabase Auth, run:")
        print("  python scripts/migrate_legacy_users_to_supabase_auth.py")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_legacy_users()
