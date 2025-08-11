#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_auth_users():
    """Check if there's an auth.users table and understand the structure"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Try to access auth.users table
        result = supabase.table('auth.users').select('*').limit(1).execute()
        print("✅ auth.users table exists")
        if result.data:
            print("Sample auth.users record:")
            for key, value in result.data[0].items():
                print(f"  {key}: {value}")
        else:
            print("auth.users table is empty")
    except Exception as e:
        print(f"❌ Error accessing auth.users: {e}")
    
    try:
        # Try to access the custom users table
        result = supabase.table('users').select('*').limit(1).execute()
        print("\n✅ Custom users table exists")
        if result.data:
            print("Sample users record:")
            for key, value in result.data[0].items():
                print(f"  {key}: {value}")
        else:
            print("users table is empty")
    except Exception as e:
        print(f"❌ Error accessing users table: {e}")

if __name__ == "__main__":
    check_auth_users() 