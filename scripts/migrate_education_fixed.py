#!/usr/bin/env python3
import csv
import json
import uuid
from pathlib import Path
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def generate_uuid_for_csv_id(csv_id: str, user_id_mapping: dict) -> str:
    """Generate a UUID for a CSV ID, ensuring consistency"""
    if csv_id not in user_id_mapping:
        user_id_mapping[csv_id] = str(uuid.uuid4())
    return user_id_mapping[csv_id]

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

def migrate_education_fixed():
    """Migrate education data from CSV to Supabase with proper user ID mapping"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🚀 Starting education migration with proper user ID mapping...")
    print("=" * 60)
    
    # Recreate the user ID mapping (same as original migration)
    user_id_mapping = {}
    
    # Statistics
    stats = {
        'total_records': 0,
        'records_with_education': 0,
        'education_entries_found': 0,
        'successful_inserts': 0,
        'errors': 0,
        'constraint_errors': 0
    }
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            stats['total_records'] += 1
            
            if stats['total_records'] % 50 == 0:
                print(f"📊 Processed {stats['total_records']} records...")
            
            csv_id = row.get('Id', '')
            email = row.get('EmailAddress', '')
            public_data = row.get('PublicData', '')
            
            # Generate UUID for this CSV ID (same as original migration)
            user_id = generate_uuid_for_csv_id(csv_id, user_id_mapping)
            
            # Extract education data
            education_entries = extract_education_data(public_data)
            
            if not education_entries:
                continue
            
            stats['records_with_education'] += 1
            stats['education_entries_found'] += len(education_entries)
            
            # Insert each education entry
            for education_entry in education_entries:
                # Skip entries with missing required fields (only institution_name is required)
                if not education_entry['institution_name']:
                    stats['constraint_errors'] += 1
                    continue
                
                # Transform for database
                db_entry = {
                    'user_id': user_id,  # Use the mapped UUID
                    'institution_name': education_entry['institution_name'],
                    'degree_level': education_entry['degree_level'] if education_entry['degree_level'] else None,
                    'grade': None,  # Not available in CSV
                    'start_date': education_entry['start_date'] if education_entry['start_date'] else None,
                    'end_date': education_entry['end_date'] if education_entry['end_date'] else None,
                    'description': education_entry['description'],
                    'file_url': education_entry['file_url'] if education_entry['file_url'] else None
                }
                
                # Insert into database
                try:
                    result = supabase.table('education').insert(db_entry).execute()
                    stats['successful_inserts'] += 1
                except Exception as e:
                    stats['errors'] += 1
                    error_msg = str(e)
                    if 'not-null constraint' in error_msg.lower():
                        stats['constraint_errors'] += 1
    
    # Save statistics
    stats_file = Path('data/education_migration_stats_fixed.json')
    stats_file.parent.mkdir(exist_ok=True)
    
    with open(stats_file, 'w') as f:
        json.dump(stats, f, indent=2)
    
    print(f"💾 Saved migration stats to: {stats_file}")
    print("=" * 60)
    
    # Print summary
    print("📊 Education Migration Summary (Fixed):")
    print(f"   Total records processed: {stats['total_records']}")
    print(f"   Records with education: {stats['records_with_education']}")
    print(f"   Education entries found: {stats['education_entries_found']}")
    print(f"   Successful inserts: {stats['successful_inserts']}")
    print(f"   Errors: {stats['errors']}")
    print(f"   Constraint errors: {stats['constraint_errors']}")
    
    if stats['education_entries_found'] > 0:
        success_rate = (stats['successful_inserts'] / stats['education_entries_found']) * 100
        print(f"   Success rate: {success_rate:.1f}%")
    
    print("=" * 60)
    print("✅ Education migration completed!")

if __name__ == "__main__":
    migrate_education_fixed() 