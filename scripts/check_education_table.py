#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_education_table():
    """Check the education table structure"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("🔍 Checking education table...")
    print("=" * 60)
    
    try:
        # Check if education table exists by trying to select from it
        result = supabase.table('education').select('*').limit(1).execute()
        print(f"✅ Education table exists")
        
        # Get count of existing records
        count_result = supabase.table('education').select('id', count='exact').execute()
        total_count = count_result.count if hasattr(count_result, 'count') else 'unknown'
        print(f"📊 Total education records: {total_count}")
        
        # Try to get table structure by attempting a minimal insert
        print(f"\n🧪 Testing table structure...")
        
        # Get a real user ID
        user_result = supabase.table('users').select('id').limit(1).execute()
        if user_result.data:
            user_id = user_result.data[0]['id']
            print(f"   Using user ID: {user_id}")
            
            # Try minimal insert
            test_entry = {
                'user_id': user_id,
                'institution_name': 'Test University',
                'degree_level': 'Bachelor',
                'grade': None,
                'start_date': None,
                'end_date': None,
                'description': 'Test entry',
                'file_url': None
            }
            
            print(f"   Attempting insert with: {test_entry}")
            
            insert_result = supabase.table('education').insert(test_entry).execute()
            print(f"✅ Successfully inserted test record!")
            
            # Clean up - delete the test record
            if insert_result.data:
                test_id = insert_result.data[0]['id']
                supabase.table('education').delete().eq('id', test_id).execute()
                print(f"🗑️  Cleaned up test record")
            
        else:
            print("❌ No users found to test with")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"   Error type: {type(e)}")
        print(f"   Error details: {str(e)}")

if __name__ == "__main__":
    check_education_table() 