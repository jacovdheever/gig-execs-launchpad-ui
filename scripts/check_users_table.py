#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_users_table():
    """Check what users exist in the database"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("🔍 Checking users table...")
    print("=" * 60)
    
    try:
        # Get total count
        result = supabase.table('users').select('id', count='exact').execute()
        total_count = result.count if hasattr(result, 'count') else 'unknown'
        print(f"📊 Total users in database: {total_count}")
        
        # Get first few users
        result = supabase.table('users').select('id, email, first_name, last_name').limit(5).execute()
        
        if result.data:
            print(f"\n📋 Sample users:")
            for i, user in enumerate(result.data):
                print(f"   {i+1}. {user['email']} (ID: {user['id']})")
                print(f"      Name: {user.get('first_name', 'N/A')} {user.get('last_name', 'N/A')}")
        else:
            print("❌ No users found in database")
            
        # Check if a specific user exists
        test_email = "mmotawea@outlook.com"
        result = supabase.table('users').select('id, email').eq('email', test_email).execute()
        
        if result.data:
            print(f"\n✅ User '{test_email}' exists with ID: {result.data[0]['id']}")
        else:
            print(f"\n❌ User '{test_email}' not found in database")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_users_table() 