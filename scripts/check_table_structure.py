#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_table_structure():
    """Check the actual table structure and constraints"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Try to insert a test record to see the exact error
        test_user = {
            'id': 'test-user-123',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'user_type': 'consultant',
            'status': 'registered',
            'created_at': '2025-01-27T10:00:00Z',
            'updated_at': '2025-01-27T10:00:00Z'
        }
        
        result = supabase.table('users').insert(test_user).execute()
        print("✅ Test insert successful")
        print(f"Inserted: {result.data}")
        
    except Exception as e:
        print(f"❌ Error inserting test record: {e}")
        
        # Try to get table info
        try:
            # Try to get table schema info
            result = supabase.rpc('get_table_info', {'table_name': 'users'}).execute()
            print(f"Table info: {result.data}")
        except:
            print("Could not get table info via RPC")
        
        # Try a different approach - check if we can query the table structure
        try:
            result = supabase.table('users').select('*').limit(0).execute()
            print("✅ Can query users table")
        except Exception as e2:
            print(f"❌ Cannot query users table: {e2}")

if __name__ == "__main__":
    check_table_structure() 