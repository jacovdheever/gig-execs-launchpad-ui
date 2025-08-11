#!/usr/bin/env python3
from supabase import create_client
import uuid

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def test_insert():
    """Test inserting a minimal user record"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Try with just the basic fields from the types
    test_user = {
        'id': str(uuid.uuid4()),
        'email': 'test@example.com',
        'created_at': '2025-01-27T10:00:00Z',
        'updated_at': '2025-01-27T10:00:00Z'
    }
    
    try:
        result = supabase.table('users').insert(test_user).execute()
        print("✅ Success! User inserted with basic fields")
        print(f"Result: {result.data}")
    except Exception as e:
        print(f"❌ Error with basic fields: {e}")
        
        # Try with additional fields that might be required
        test_user_extended = {
            'id': str(uuid.uuid4()),
            'email': 'test2@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'status': 'registered',
            'is_verified': False,
            'profile_status': 'pending',
            'num_open_listings': 0,
            'num_closed_listings': 0,
            'created_at': '2025-01-27T10:00:00Z',
            'updated_at': '2025-01-27T10:00:00Z'
        }
        
        try:
            result = supabase.table('users').insert(test_user_extended).execute()
            print("✅ Success! User inserted with extended fields")
            print(f"Result: {result.data}")
        except Exception as e2:
            print(f"❌ Error with extended fields: {e2}")

if __name__ == "__main__":
    test_insert() 