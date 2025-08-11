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

def test_certifications_migration():
    """Test certifications migration with a few records"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🧪 Testing certifications migration with a few records...")
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
            
            # Extract certifications data
            certifications = extract_certifications_data(public_data)
            
            if not certifications:
                print(f"ℹ️  No certifications found for user: {email}")
                continue
            
            print(f"✅ Found {len(certifications)} certifications for user {email}")
            
            # Test first certification entry
            certification = certifications[0]
            print(f"📋 Certification Details:")
            print(f"   Name: {certification['name']}")
            print(f"   Awarding Body: {certification['awarding_body']}")
            print(f"   Issue Date: {certification['issue_date']}")
            print(f"   Expiry Date: {certification['expiry_date']}")
            print(f"   Credential ID: {certification['credential_id']}")
            print(f"   File URL: {certification['file_url']}")
            
            # Transform for database
            db_entry = {
                'user_id': user_id,
                'name': certification['name'],
                'awarding_body': certification['awarding_body'],
                'issue_date': certification['issue_date'],
                'expiry_date': certification['expiry_date'],
                'credential_id': certification['credential_id'] if certification['credential_id'] else None,
                'credential_url': certification['credential_url'] if certification['credential_url'] else None,
                'file_url': certification['file_url'] if certification['file_url'] else None
            }
            
            print(f"🔄 Transformed Entry:")
            for key, value in db_entry.items():
                print(f"   {key}: {value}")
            
            # Test database insertion
            try:
                result = supabase.table('certifications').insert(db_entry).execute()
                print(f"💾 Testing database insertion...")
                print(f"✅ Successfully inserted certification!")
                
                test_count += 1
                
            except Exception as e:
                print(f"❌ Error inserting certification: {e}")
            
            print("=" * 60)
    
    print(f"🧪 Test completed!")

if __name__ == "__main__":
    test_certifications_migration() 