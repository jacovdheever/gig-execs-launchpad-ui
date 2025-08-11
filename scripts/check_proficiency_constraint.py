#!/usr/bin/env python3
import uuid
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_proficiency_constraint():
    """Check what proficiency values are allowed"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Try different proficiency values to see what's allowed
        test_values = ['beginner', 'intermediate', 'advanced', 'native', 'fluent', 'motherLanguage']
        
        # Get a real user ID from the database
        users_result = supabase.table('users').select('id').limit(1).execute()
        if users_result.data:
            real_user_id = users_result.data[0]['id']
            print(f"Using real user ID: {real_user_id}")
            
            for value in test_values:
                try:
                    test_record = {
                        'user_id': real_user_id,
                        'language_id': 1,
                        'proficiency': value
                    }
                    result = supabase.table('user_languages').insert(test_record).execute()
                    print(f"✅ '{value}' is allowed")
                except Exception as e:
                    print(f"❌ '{value}' is NOT allowed: {e}")
        else:
            print("No users found in database")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_proficiency_constraint() 