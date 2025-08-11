#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_reference_users():
    """Check if users exist in the database for reference migration"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Test emails from the references test
    test_emails = [
        'emmanuelowusu38@yahoo.com',
        'mattdcarstens@gmail.com',
        'carmenmarianavarro@yahoo.com'
    ]
    
    print("🔍 Checking if users exist in database...")
    print("=" * 60)
    
    for email in test_emails:
        try:
            result = supabase.table('users').select('id, email').eq('email', email).execute()
            if result.data:
                user = result.data[0]
                print(f"✅ User found: {email}")
                print(f"   ID: {user['id']}")
            else:
                print(f"❌ User not found: {email}")
        except Exception as e:
            print(f"❌ Error checking user {email}: {e}")
        print()
    
    # Check total users count
    try:
        result = supabase.table('users').select('id', count='exact').execute()
        print(f"📊 Total users in database: {result.count}")
    except Exception as e:
        print(f"❌ Error getting user count: {e}")
    
    print("=" * 60)
    print("✅ User check completed!")

if __name__ == "__main__":
    check_reference_users() 