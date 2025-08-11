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

def extract_certifications_data(public_data):
    """Extract certifications data from PublicData JSON"""
    certifications = []
    
    if not public_data or public_data == 'null':
        return certifications
    
    try:
        data = json.loads(public_data)
        
        if 'certifications' in data and data['certifications']:
            for cert in data['certifications']:
                # Skip entries with no certification name
                if not cert.get('certificationName'):
                    continue
                
                certification = {
                    'name': cert.get('certificationName', '').strip() if cert.get('certificationName') else '',
                    'awarding_body': cert.get('issuingOrganization', '').strip() if cert.get('issuingOrganization') else '',
                    'credential_id': cert.get('credentialId', '').strip() if cert.get('credentialId') else '',
                    'credential_url': cert.get('credentialUrl', '').strip() if cert.get('credentialUrl') else '',
                    'file_url': cert.get('proofOfCertification', '').strip() if cert.get('proofOfCertification') else '',
                    'issue_date_month': cert.get('issueDateMonth', '').strip() if cert.get('issueDateMonth') else '',
                    'issue_date_year': cert.get('issueDateYear'),
                    'expiration_date_month': cert.get('expirationDateMonth', '').strip() if cert.get('expirationDateMonth') else '',
                    'expiration_date_year': cert.get('expirationDateYear'),
                    'does_not_expire': cert.get('doesNotExpire', [False])[0] if cert.get('doesNotExpire') else False
                }
                
                # Convert date components to proper format
                if certification['issue_date_month'] and certification['issue_date_year']:
                    # Convert to proper date format (YYYY-MM-DD)
                    month_map = {
                        'january': '01', 'february': '02', 'march': '03', 'april': '04',
                        'may': '05', 'june': '06', 'july': '07', 'august': '08',
                        'september': '09', 'october': '10', 'november': '11', 'december': '12'
                    }
                    month = month_map.get(certification['issue_date_month'].lower(), '01')
                    year = str(certification['issue_date_year'])
                    certification['issue_date'] = f"{year}-{month}-01"
                else:
                    certification['issue_date'] = None
                
                if certification['expiration_date_month'] and certification['expiration_date_year'] and not certification['does_not_expire']:
                    # Convert to proper date format (YYYY-MM-DD)
                    month_map = {
                        'january': '01', 'february': '02', 'march': '03', 'april': '04',
                        'may': '05', 'june': '06', 'july': '07', 'august': '08',
                        'september': '09', 'october': '10', 'november': '11', 'december': '12'
                    }
                    month = month_map.get(certification['expiration_date_month'].lower(), '01')
                    year = str(certification['expiration_date_year'])
                    certification['expiry_date'] = f"{year}-{month}-01"
                else:
                    certification['expiry_date'] = None
                
                # Clean up None values
                for key in ['issue_date_month', 'issue_date_year', 'expiration_date_month', 'expiration_date_year', 'does_not_expire']:
                    if certification[key] is None:
                        certification[key] = None
                
                certifications.append(certification)
    
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        print(f"❌ Error parsing certifications data: {e}")
    
    return certifications

def migrate_certifications():
    """Migrate certifications data using existing user IDs from database"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🚀 Starting certifications migration using existing user IDs...")
    print("=" * 60)
    
    # Statistics
    stats = {
        'total_records': 0,
        'records_with_certifications': 0,
        'certifications_found': 0,
        'successful_inserts': 0,
        'errors': 0,
        'user_not_found': 0,
        'constraint_errors': 0
    }
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            stats['total_records'] += 1
            
            if stats['total_records'] % 50 == 0:
                print(f"📊 Processed {stats['total_records']} records...")
            
            email = row.get('EmailAddress', '')
            public_data = row.get('PublicData', '')
            
            # Get existing user ID from database
            user_id = get_user_id_from_email(supabase, email)
            if not user_id:
                stats['user_not_found'] += 1
                continue
            
            # Extract certifications data
            certifications = extract_certifications_data(public_data)
            
            if not certifications:
                continue
            
            stats['records_with_certifications'] += 1
            stats['certifications_found'] += len(certifications)
            
            # Insert each certification entry
            for certification in certifications:
                # Skip entries with missing required fields (only name is required)
                if not certification['name']:
                    stats['constraint_errors'] += 1
                    continue
                
                # Transform for database
                db_entry = {
                    'user_id': user_id,  # Use existing user ID from database
                    'name': certification['name'],
                    'awarding_body': certification['awarding_body'] if certification['awarding_body'] else None,
                    'issue_date': certification['issue_date'] if certification['issue_date'] else None,
                    'expiry_date': certification['expiry_date'] if certification['expiry_date'] else None,
                    'credential_id': certification['credential_id'] if certification['credential_id'] else None,
                    'credential_url': certification['credential_url'] if certification['credential_url'] else None,
                    'file_url': certification['file_url'] if certification['file_url'] else None
                }
                
                # Insert into database
                try:
                    result = supabase.table('certifications').insert(db_entry).execute()
                    stats['successful_inserts'] += 1
                except Exception as e:
                    stats['errors'] += 1
                    error_msg = str(e)
                    if 'not-null constraint' in error_msg.lower():
                        stats['constraint_errors'] += 1
    
    # Save statistics
    stats_file = Path('data/certifications_migration_stats.json')
    stats_file.parent.mkdir(exist_ok=True)
    
    with open(stats_file, 'w') as f:
        json.dump(stats, f, indent=2)
    
    print(f"💾 Saved migration stats to: {stats_file}")
    print("=" * 60)
    
    # Print summary
    print("📊 Certifications Migration Summary:")
    print(f"   Total records processed: {stats['total_records']}")
    print(f"   Records with certifications: {stats['records_with_certifications']}")
    print(f"   Certifications found: {stats['certifications_found']}")
    print(f"   Successful inserts: {stats['successful_inserts']}")
    print(f"   Errors: {stats['errors']}")
    print(f"   User not found: {stats['user_not_found']}")
    print(f"   Constraint errors: {stats['constraint_errors']}")
    
    if stats['certifications_found'] > 0:
        success_rate = (stats['successful_inserts'] / stats['certifications_found']) * 100
        print(f"   Success rate: {success_rate:.1f}%")
    
    print("=" * 60)
    print("✅ Certifications migration completed!")

if __name__ == "__main__":
    migrate_certifications() 