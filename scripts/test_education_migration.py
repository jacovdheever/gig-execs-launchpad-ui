#!/usr/bin/env python3
import csv
import json
import uuid
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

def extract_education_data(public_data):
    """Extract education data from PublicData JSON"""
    education_entries = []
    
    if not public_data or public_data == 'null':
        return education_entries
    
    try:
        data = json.loads(public_data)
        
        if 'formalEducation' in data and data['formalEducation']:
            for entry in data['formalEducation']:
                # Skip entries with no institution name
                if not entry.get('institutionName'):
                    continue
                
                education_entry = {
                    'institution_name': entry.get('institutionName', '').strip() if entry.get('institutionName') else '',
                    'degree_level': entry.get('degree', '').strip() if entry.get('degree') else '',
                    'field_of_study': entry.get('fieldOfStudy', '').strip() if entry.get('fieldOfStudy') else '',
                    'start_date_month': entry.get('startDateMonth', '').strip() if entry.get('startDateMonth') else '',
                    'start_date_year': entry.get('startDateYear'),
                    'end_date_month': entry.get('endDateMonth', '').strip() if entry.get('endDateMonth') else '',
                    'end_date_year': entry.get('endDateYear'),
                    'currently_completing': entry.get('currentlyCompleting'),
                    'file_url': entry.get('proofOfFormalEducation', '').strip() if entry.get('proofOfFormalEducation') else ''
                }
                
                # Create description from field of study
                if education_entry['field_of_study']:
                    education_entry['description'] = f"Field of Study: {education_entry['field_of_study']}"
                else:
                    education_entry['description'] = None
                
                # Convert date components to proper format
                if education_entry['start_date_month'] and education_entry['start_date_year']:
                    # Convert to proper date format (YYYY-MM-DD)
                    month_map = {
                        'january': '01', 'february': '02', 'march': '03', 'april': '04',
                        'may': '05', 'june': '06', 'july': '07', 'august': '08',
                        'september': '09', 'october': '10', 'november': '11', 'december': '12'
                    }
                    month = month_map.get(education_entry['start_date_month'].lower(), '01')
                    year = str(education_entry['start_date_year'])
                    education_entry['start_date'] = f"{year}-{month}-01"
                else:
                    education_entry['start_date'] = None
                
                if education_entry['end_date_month'] and education_entry['end_date_year']:
                    # Convert to proper date format (YYYY-MM-DD)
                    month_map = {
                        'january': '01', 'february': '02', 'march': '03', 'april': '04',
                        'may': '05', 'june': '06', 'july': '07', 'august': '08',
                        'september': '09', 'october': '10', 'november': '11', 'december': '12'
                    }
                    month = month_map.get(education_entry['end_date_month'].lower(), '01')
                    year = str(education_entry['end_date_year'])
                    education_entry['end_date'] = f"{year}-{month}-01"
                else:
                    education_entry['end_date'] = None
                
                # Clean up None values
                for key in ['start_date_month', 'start_date_year', 'end_date_month', 'end_date_year', 'currently_completing']:
                    if education_entry[key] is None:
                        education_entry[key] = None
                
                education_entries.append(education_entry)
    
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        print(f"❌ Error parsing education data: {e}")
    
    return education_entries

def test_education_migration():
    """Test education migration with a few records"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🧪 Testing education migration with a few records...")
    print("=" * 60)
    
    test_count = 0
    max_tests = 3
    
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
            
            # Extract education data
            education_entries = extract_education_data(public_data)
            
            if not education_entries:
                print(f"ℹ️  No education found for user: {email}")
                continue
            
            print(f"✅ Found {len(education_entries)} education entries for user {email}")
            
            # Test first education entry
            education_entry = education_entries[0]
            print(f"📋 Education Entry Details:")
            print(f"   Institution: {education_entry['institution_name']}")
            print(f"   Degree: {education_entry['degree_level']}")
            print(f"   Field of Study: {education_entry['field_of_study']}")
            print(f"   Start Date: {education_entry['start_date']}")
            print(f"   End Date: {education_entry['end_date']}")
            print(f"   File URL: {education_entry['file_url']}")
            
            # Transform for database
            db_entry = {
                'user_id': user_id,
                'institution_name': education_entry['institution_name'],
                'degree_level': education_entry['degree_level'],
                'grade': None,  # Not available in CSV
                'start_date': education_entry['start_date'],
                'end_date': education_entry['end_date'],
                'description': education_entry['description'],
                'file_url': education_entry['file_url'] if education_entry['file_url'] else None
            }
            
            print(f"🔄 Transformed Entry:")
            for key, value in db_entry.items():
                if key != 'id':  # Don't show UUID
                    print(f"   {key}: {value}")
            
            # Test database insertion
            try:
                result = supabase.table('education').insert(db_entry).execute()
                print(f"💾 Testing database insertion...")
                print(f"✅ Successfully inserted education entry!")
                print(f"   Inserted ID: {db_entry['id']}")
                
                # Verify insertion
                verify_result = supabase.table('education').select('*').eq('id', db_entry['id']).execute()
                if verify_result.data:
                    print(f"✅ Verification successful - record found in database")
                else:
                    print(f"❌ Verification failed - record not found")
                
                test_count += 1
                
            except Exception as e:
                print(f"❌ Error inserting education entry: {e}")
            
            print("=" * 60)
    
    print(f"🧪 Test completed!")

if __name__ == "__main__":
    test_education_migration() 