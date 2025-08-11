#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def debug_foreign_key():
    """Debug the foreign key constraint issue"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("🔍 Debugging foreign key constraint...")
    print("=" * 60)
    
    try:
        # Get the specific user that's failing
        user_id = "2f331d37-f038-4bb5-9243-c8a9c490bb86"
        email = "mmotawea@outlook.com"
        
        print(f"🔍 Checking user with ID: {user_id}")
        print(f"🔍 Checking user with email: {email}")
        
        # Check if user exists by ID
        result = supabase.table('users').select('id, email').eq('id', user_id).execute()
        if result.data:
            print(f"✅ User found by ID: {result.data[0]}")
        else:
            print(f"❌ User not found by ID")
        
        # Check if user exists by email
        result = supabase.table('users').select('id, email').eq('email', email).execute()
        if result.data:
            print(f"✅ User found by email: {result.data[0]}")
        else:
            print(f"❌ User not found by email")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_foreign_key() 