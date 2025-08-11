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

def migrate_additional_fields():
    """Migrate headline, industries, and profileStatus fields"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🚀 Starting additional fields migration...")
    print("=" * 60)
    
    # Statistics
    stats = {
        'total_records': 0,
        'records_with_headline': 0,
        'records_with_industries': 0,
        'records_with_profile_status': 0,
        'successful_users_updates': 0,
        'successful_consultant_updates': 0,
        'errors': 0,
        'user_not_found': 0
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
            
            # Extract additional fields
            fields = extract_additional_fields(public_data)
            
            # Update statistics
            if fields['headline']:
                stats['records_with_headline'] += 1
            if fields['industries']:
                stats['records_with_industries'] += 1
            if fields['profile_status']:
                stats['records_with_profile_status'] += 1
            
            # Update users table (headline and profile_status)
            users_update = {}
            if fields['headline']:
                users_update['headline'] = fields['headline']
            if fields['profile_status']:
                users_update['profile_status'] = fields['profile_status']
            
            if users_update:
                try:
                    result = supabase.table('users').update(users_update).eq('id', user_id).execute()
                    stats['successful_users_updates'] += 1
                except Exception as e:
                    stats['errors'] += 1
                    print(f"❌ Error updating users table for {email}: {e}")
            
            # Update consultant_profiles table (industries)
            if fields['industries']:
                try:
                    result = supabase.table('consultant_profiles').update({
                        'industries': fields['industries']
                    }).eq('user_id', user_id).execute()
                    stats['successful_consultant_updates'] += 1
                except Exception as e:
                    stats['errors'] += 1
                    print(f"❌ Error updating consultant_profiles table for {email}: {e}")
    
    # Save statistics
    stats_file = Path('data/additional_fields_migration_stats.json')
    stats_file.parent.mkdir(exist_ok=True)
    
    with open(stats_file, 'w') as f:
        json.dump(stats, f, indent=2)
    
    print(f"💾 Saved migration stats to: {stats_file}")
    print("=" * 60)
    
    # Print summary
    print("📊 Additional Fields Migration Summary:")
    print(f"   Total records processed: {stats['total_records']}")
    print(f"   Records with headline: {stats['records_with_headline']} ({(stats['records_with_headline']/stats['total_records'])*100:.1f}%)")
    print(f"   Records with industries: {stats['records_with_industries']} ({(stats['records_with_industries']/stats['total_records'])*100:.1f}%)")
    print(f"   Records with profile status: {stats['records_with_profile_status']} ({(stats['records_with_profile_status']/stats['total_records'])*100:.1f}%)")
    print(f"   Successful users table updates: {stats['successful_users_updates']}")
    print(f"   Successful consultant_profiles updates: {stats['successful_consultant_updates']}")
    print(f"   Errors: {stats['errors']}")
    print(f"   User not found: {stats['user_not_found']}")
    
    # Calculate success rates
    if stats['records_with_headline'] > 0:
        headline_success_rate = (stats['successful_users_updates'] / stats['records_with_headline']) * 100
        print(f"   Headline success rate: {headline_success_rate:.1f}%")
    
    if stats['records_with_industries'] > 0:
        industries_success_rate = (stats['successful_consultant_updates'] / stats['records_with_industries']) * 100
        print(f"   Industries success rate: {industries_success_rate:.1f}%")
    
    print("=" * 60)
    print("✅ Additional fields migration completed!")

if __name__ == "__main__":
    migrate_additional_fields() 