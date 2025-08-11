#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def get_user_id_from_email(supabase, email):
    """Get user ID from email address"""
    try:
        result = supabase.table('users').select('id').eq('email', email).execute()
        if result.data:
            return result.data[0]['id']
        return None
    except Exception as e:
        print(f"❌ Error getting user ID for {email}: {e}")
        return None

def extract_additional_fields(public_data):
    """Extract headline, industries, and profileStatus from PublicData JSON"""
    fields = {
        'headline': None,
        'industries': None,
        'profile_status': None
    }
    
    if not public_data or public_data == 'null':
        return fields
    
    try:
        data = json.loads(public_data)
        
        # Extract headline
        if 'headline' in data and data['headline']:
            fields['headline'] = data['headline'].strip()
        
        # Extract industries
        if 'industries' in data and data['industries']:
            fields['industries'] = data['industries']
        
        # Extract profileStatus
        if 'profileStatus' in data and data['profileStatus']:
            fields['profile_status'] = data['profileStatus'].strip()
    
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        print(f"❌ Error parsing additional fields: {e}")
    
    return fields

def test_additional_fields_migration():
    """Test migration of additional fields with a few records"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🧪 Testing additional fields migration with a few records...")
    print("=" * 60)
    
    test_count = 0
    max_tests = 5
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            if test_count >= max_tests:
                break
            
            email = row.get('EmailAddress', '')
            public_data = row.get('PublicData', '')
            
            # Get user ID
            user_id = get_user_id_from_email(supabase, email)
            if not user_id:
                print(f"ℹ️  User not found: {email}")
                continue
            
            # Extract additional fields
            fields = extract_additional_fields(public_data)
            
            # Check if we have any data to test
            has_data = any(fields.values())
            if not has_data:
                print(f"ℹ️  No additional fields found for user: {email}")
                continue
            
            print(f"✅ Found additional fields for user {email}")
            print(f"📋 Field Details:")
            print(f"   Headline: {fields['headline']}")
            print(f"   Industries: {fields['industries']}")
            print(f"   Profile Status: {fields['profile_status']}")
            
            # Test users table update (headline and profile_status)
            users_update = {}
            if fields['headline']:
                users_update['headline'] = fields['headline']
            if fields['profile_status']:
                users_update['profile_status'] = fields['profile_status']
            
            if users_update:
                print(f"🔄 Updating users table with: {users_update}")
                try:
                    result = supabase.table('users').update(users_update).eq('id', user_id).execute()
                    print(f"✅ Successfully updated users table!")
                except Exception as e:
                    print(f"❌ Error updating users table: {e}")
            
            # Test consultant_profiles table update (industries)
            if fields['industries']:
                print(f"🔄 Updating consultant_profiles table with industries: {fields['industries']}")
                try:
                    result = supabase.table('consultant_profiles').update({
                        'industries': fields['industries']
                    }).eq('user_id', user_id).execute()
                    print(f"✅ Successfully updated consultant_profiles table!")
                except Exception as e:
                    print(f"❌ Error updating consultant_profiles table: {e}")
            
            test_count += 1
            print("=" * 60)
    
    print(f"🧪 Test completed!")

if __name__ == "__main__":
    test_additional_fields_migration() 