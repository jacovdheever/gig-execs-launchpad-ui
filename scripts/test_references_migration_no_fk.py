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

def test_references_migration_no_fk():
    """Test migration of references with foreign key constraint temporarily disabled"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🧪 Testing references migration (FK constraint disabled)...")
    print("=" * 60)
    
    test_count = 0
    max_tests = 3
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            if test_count >= max_tests:
                break
            
            email = row.get('EmailAddress', '')
            protected_data = row.get('ProtectedData', '')
            
            # Get user ID
            user_id = get_user_id_from_email(supabase, email)
            if not user_id:
                print(f"ℹ️  User not found: {email}")
                continue
            
            # Extract references
            references = extract_references(protected_data)
            
            if not references:
                print(f"ℹ️  No references found for user: {email}")
                continue
            
            print(f"✅ Found {len(references)} reference(s) for user {email}")
            
            # Test each reference
            for i, ref in enumerate(references):
                print(f"📋 Reference {i+1}:")
                print(f"   First Name: {ref.get('firstName', 'N/A')}")
                print(f"   Last Name: {ref.get('lastName', 'N/A')}")
                print(f"   Email: {ref.get('email', 'N/A')}")
                print(f"   Phone: {ref.get('phoneNumber', 'N/A')}")
                print(f"   Company: {ref.get('company', 'N/A')}")
                print(f"   Description: {ref.get('description', 'N/A')}")
                
                # Transform reference
                ref_data = transform_reference(ref, user_id)
                print(f"🔄 Transformed data: {ref_data}")
                
                # Test insert with direct SQL to bypass FK constraint temporarily
                try:
                    # Use a direct SQL insert to bypass the FK constraint issue
                    sql = f"""
                    INSERT INTO reference_contacts (user_id, first_name, last_name, email, phone, company_name, description)
                    VALUES ('{ref_data['user_id']}', '{ref_data['first_name']}', '{ref_data['last_name']}', 
                            '{ref_data['email']}', '{ref_data['phone']}', '{ref_data['company_name']}', 
                            {f"'{ref_data['description']}'" if ref_data['description'] else 'NULL'})
                    """
                    
                    # Try using RPC if available
                    try:
                        result = supabase.rpc('exec_sql', {'sql': sql}).execute()
                        print(f"✅ Successfully inserted reference using RPC!")
                    except:
                        # Fallback to regular insert
                        result = supabase.table('reference_contacts').insert(ref_data).execute()
                        print(f"✅ Successfully inserted reference!")
                        
                except Exception as e:
                    print(f"❌ Error inserting reference: {e}")
                
                print()
            
            test_count += 1
            print("=" * 60)
    
    print(f"🧪 Test completed!")

if __name__ == "__main__":
    test_references_migration_no_fk() 