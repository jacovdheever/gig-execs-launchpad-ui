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

def extract_references(protected_data):
    """Extract references from ProtectedData JSON"""
    if not protected_data or protected_data == 'null':
        return []
    
    try:
        data = json.loads(protected_data)
        if 'references' in data and data['references']:
            return data['references']
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        print(f"❌ Error parsing references: {e}")
    
    return []

def transform_reference(reference, user_id):
    """Transform CSV reference to database format"""
    return {
        'user_id': user_id,
        'first_name': reference.get('firstName', '').strip(),
        'last_name': reference.get('lastName', '').strip(),
        'email': reference.get('email', '').strip(),
        'phone': reference.get('phoneNumber', '').strip(),
        'company_name': reference.get('company', '').strip(),
        'description': reference.get('description', '').strip() if reference.get('description') else None
    }

def migrate_references():
    """Migrate references from CSV to reference_contacts table"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🚀 Starting references migration...")
    print("=" * 60)
    
    # Statistics
    stats = {
        'total_records': 0,
        'records_with_references': 0,
        'total_references': 0,
        'successful_inserts': 0,
        'errors': 0,
        'user_not_found': 0,
        'fk_constraint_errors': 0
    }
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            stats['total_records'] += 1
            
            if stats['total_records'] % 50 == 0:
                print(f"📊 Processed {stats['total_records']} records...")
            
            email = row.get('EmailAddress', '')
            protected_data = row.get('ProtectedData', '')
            
            # Get existing user ID from database
            user_id = get_user_id_from_email(supabase, email)
            if not user_id:
                stats['user_not_found'] += 1
                continue
            
            # Extract references
            references = extract_references(protected_data)
            
            if not references:
                continue
            
            stats['records_with_references'] += 1
            stats['total_references'] += len(references)
            
            # Insert each reference
            for ref in references:
                ref_data = transform_reference(ref, user_id)
                
                try:
                    result = supabase.table('reference_contacts').insert(ref_data).execute()
                    stats['successful_inserts'] += 1
                except Exception as e:
                    error_msg = str(e)
                    if 'foreign key constraint' in error_msg.lower():
                        stats['fk_constraint_errors'] += 1
                        print(f"⚠️  FK constraint error for {email}: {error_msg}")
                    else:
                        stats['errors'] += 1
                        print(f"❌ Error inserting reference for {email}: {error_msg}")
    
    # Save statistics
    stats_file = Path('data/references_migration_stats.json')
    stats_file.parent.mkdir(exist_ok=True)
    
    with open(stats_file, 'w') as f:
        json.dump(stats, f, indent=2)
    
    print(f"💾 Saved migration stats to: {stats_file}")
    print("=" * 60)
    
    # Print summary
    print("📊 References Migration Summary:")
    print(f"   Total records processed: {stats['total_records']}")
    print(f"   Records with references: {stats['records_with_references']} ({(stats['records_with_references']/stats['total_records'])*100:.1f}%)")
    print(f"   Total references found: {stats['total_references']}")
    print(f"   Successful inserts: {stats['successful_inserts']}")
    print(f"   Foreign key constraint errors: {stats['fk_constraint_errors']}")
    print(f"   Other errors: {stats['errors']}")
    print(f"   User not found: {stats['user_not_found']}")
    
    # Calculate success rates
    if stats['total_references'] > 0:
        success_rate = (stats['successful_inserts'] / stats['total_references']) * 100
        print(f"   Success rate: {success_rate:.1f}%")
    
    print("=" * 60)
    
    if stats['fk_constraint_errors'] > 0:
        print("⚠️  Foreign key constraint errors detected!")
        print("   This indicates the reference_contacts table foreign key constraint")
        print("   is pointing to the wrong table (auth.users instead of public.users).")
        print("   Please run the SQL fix script to correct this issue.")
    
    print("✅ References migration completed!")

if __name__ == "__main__":
    migrate_references() 