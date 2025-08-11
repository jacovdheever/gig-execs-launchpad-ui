#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_constraints():
    """Check table constraints and structure"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Try to get information about the users table
        result = supabase.rpc('get_table_constraints', {'table_name': 'users'}).execute()
        print(f"Table constraints: {result.data}")
    except Exception as e:
        print(f"Could not get constraints via RPC: {e}")
    
    try:
        # Try to get table schema information
        result = supabase.rpc('get_table_schema', {'table_name': 'users'}).execute()
        print(f"Table schema: {result.data}")
    except Exception as e:
        print(f"Could not get schema via RPC: {e}")
    
    # Try a different approach - check if we can disable constraints
    try:
        # Try to disable foreign key checks temporarily
        result = supabase.rpc('disable_foreign_key_checks').execute()
        print("Foreign key checks disabled")
    except Exception as e:
        print(f"Could not disable foreign key checks: {e}")
    
    # Try to insert with a different approach
    try:
        # Try to insert using upsert instead of insert
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
        
        result = supabase.table('users').upsert(test_user, on_conflict='id').execute()
        print("✅ Upsert successful")
        print(f"Result: {result.data}")
        
    except Exception as e:
        print(f"❌ Upsert failed: {e}")

if __name__ == "__main__":
    check_constraints() 