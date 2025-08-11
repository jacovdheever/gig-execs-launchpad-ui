#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def test_single_education_insert():
    """Test inserting a single education record"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("🧪 Testing single education insert...")
    print("=" * 60)
    
    # First, let's get a user that exists
    try:
        result = supabase.table('users').select('id, email').limit(1).execute()
        if result.data:
            user = result.data[0]
            user_id = user['id']
            email = user['email']
            print(f"✅ Found user: {email} with ID: {user_id}")
            
            # Try to insert a simple education record
            test_entry = {
                'user_id': user_id,
                'institution_name': 'Test University',
                'degree_level': 'Bachelor',
                'grade': None,
                'start_date': None,  # This should be optional now
                'end_date': None,
                'description': 'Test education entry',
                'file_url': None
            }
            
            print(f"🔄 Attempting to insert: {test_entry}")
            
            result = supabase.table('education').insert(test_entry).execute()
            print(f"✅ Successfully inserted education entry!")
            
        else:
            print("❌ No users found in database")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"   Error type: {type(e)}")
        print(f"   Error details: {str(e)}")

if __name__ == "__main__":
    test_single_education_insert() 