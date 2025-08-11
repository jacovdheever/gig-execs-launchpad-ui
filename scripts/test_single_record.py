#!/usr/bin/env python3
import csv
import uuid
from datetime import datetime
from pathlib import Path
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def test_single_record():
    """Test inserting a single record from the CSV"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Read the first record from the CSV
    csv_file = Path('data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv')
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        first_row = next(reader)
    
    print(f"Testing with record: {first_row['EmailAddress']}")
    print(f"Original ID: {first_row['Id']}")
    
    # Generate a proper UUID
    test_uuid = str(uuid.uuid4())
    print(f"Generated UUID: {test_uuid}")
    
    # Transform the data
    user_data = {
        'id': test_uuid,
        'email': first_row['EmailAddress'],
        'first_name': first_row.get('FirstName', ''),
        'last_name': first_row.get('LastName', ''),
        'user_type': 'consultant',
        'status': 'registered',
        'created_at': '2025-01-27T10:00:00Z',
        'updated_at': '2025-01-27T10:00:00Z'
    }
    
    print(f"Transformed data: {user_data}")
    
    try:
        # Try to insert the record
        result = supabase.table('users').insert(user_data).execute()
        print("✅ SUCCESS! Record inserted successfully")
        print(f"Inserted record: {result.data}")
        return True
        
    except Exception as e:
        print(f"❌ ERROR: Failed to insert record")
        print(f"Error details: {e}")
        return False

if __name__ == "__main__":
    test_single_record() 