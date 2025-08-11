#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def test_education_auth_user():
    """Test education insert with auth user"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("🧪 Testing education insert with auth user...")
    print("=" * 60)
    
    try:
        # Get a user from our users table
        result = supabase.table('users').select('id, email').limit(1).execute()
        if result.data:
            user = result.data[0]
            user_id = user['id']
            email = user['email']
            print(f"✅ Found user: {email} with ID: {user_id}")
            
            # Try to insert education record
            test_entry = {
                'user_id': user_id,
                'institution_name': 'Test University',
                'degree_level': 'Bachelor',
                'grade': None,
                'start_date': None,
                'end_date': None,
                'description': 'Test education entry',
                'file_url': None
            }
            
            print(f"🔄 Attempting to insert: {test_entry}")
            
            # Try direct SQL insert to bypass any client-side issues
            sql_query = f"""
            INSERT INTO education (user_id, institution_name, degree_level, grade, start_date, end_date, description, file_url)
            VALUES ('{user_id}', 'Test University', 'Bachelor', NULL, NULL, NULL, 'Test education entry', NULL)
            RETURNING id;
            """
            
            print(f"🔧 Trying direct SQL insert...")
            result = supabase.rpc('exec_sql', {'sql': sql_query}).execute()
            print(f"✅ Successfully inserted education entry!")
            
        else:
            print("❌ No users found in database")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"   Error type: {type(e)}")
        print(f"   Error details: {str(e)}")
        
        # Try alternative approach - check if education table exists in different schema
        print(f"\n🔍 Trying alternative approach...")
        try:
            # Try inserting with explicit schema
            test_entry = {
                'user_id': user_id,
                'institution_name': 'Test University 2',
                'degree_level': 'Master',
                'grade': None,
                'start_date': None,
                'end_date': None,
                'description': 'Test education entry 2',
                'file_url': None
            }
            
            # Try with public schema
            result = supabase.table('public.education').insert(test_entry).execute()
            print(f"✅ Successfully inserted with public schema!")
            
        except Exception as e2:
            print(f"❌ Alternative approach also failed: {e2}")

if __name__ == "__main__":
    test_education_auth_user() 