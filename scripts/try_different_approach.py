#!/usr/bin/env python3
import uuid
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def try_different_approaches():
    """Try different approaches to insert data"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Generate a proper UUID
    test_uuid = str(uuid.uuid4())
    
    print(f"Testing with UUID: {test_uuid}")
    
    # Approach 1: Try with a proper UUID
    try:
        test_user = {
            'id': test_uuid,
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'user_type': 'consultant',
            'status': 'registered',
            'created_at': '2025-01-27T10:00:00Z',
            'updated_at': '2025-01-27T10:00:00Z'
        }
        
        result = supabase.table('users').insert(test_user).execute()
        print("✅ Insert with proper UUID successful")
        print(f"Result: {result.data}")
        return True
        
    except Exception as e:
        print(f"❌ Insert with proper UUID failed: {e}")
    
    # Approach 2: Try without the id field (let database generate it)
    try:
        test_user_no_id = {
            'email': 'test2@example.com',
            'first_name': 'Test2',
            'last_name': 'User2',
            'user_type': 'consultant',
            'status': 'registered',
            'created_at': '2025-01-27T10:00:00Z',
            'updated_at': '2025-01-27T10:00:00Z'
        }
        
        result = supabase.table('users').insert(test_user_no_id).execute()
        print("✅ Insert without ID successful")
        print(f"Result: {result.data}")
        return True
        
    except Exception as e:
        print(f"❌ Insert without ID failed: {e}")
    
    # Approach 3: Try with minimal fields only
    try:
        minimal_user = {
            'email': 'test3@example.com',
            'first_name': 'Test3',
            'last_name': 'User3'
        }
        
        result = supabase.table('users').insert(minimal_user).execute()
        print("✅ Insert with minimal fields successful")
        print(f"Result: {result.data}")
        return True
        
    except Exception as e:
        print(f"❌ Insert with minimal fields failed: {e}")
    
    return False

if __name__ == "__main__":
    try_different_approaches() 