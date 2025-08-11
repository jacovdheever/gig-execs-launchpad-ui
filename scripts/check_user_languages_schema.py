#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_user_languages_schema():
    """Check the actual structure of the user_languages table"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Try to get a single record to see the structure
        result = supabase.table('user_languages').select('*').limit(1).execute()
        if result.data:
            print("User languages table structure:")
            for key, value in result.data[0].items():
                print(f"  {key}: {type(value).__name__}")
        else:
            print("Table is empty, trying to insert a test record to see structure...")
            test_record = {
                'user_id': 'test-uuid-123',
                'language_name': 'English',
                'proficiency_level': 'intermediate'
            }
            result = supabase.table('user_languages').insert(test_record).execute()
            print("Test record inserted successfully!")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_user_languages_schema() 