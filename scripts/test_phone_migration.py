#!/usr/bin/env python3
import csv
import json
from datetime import datetime
from pathlib import Path
from supabase import create_client
from typing import Dict, List, Any, Optional

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

class TestPhoneMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'total_records': 0,
            'users_with_phones': 0,
            'phones_updated': 0,
            'errors': []
        }

    def get_user_id_from_email(self, email: str) -> Optional[str]:
        """Get the user ID from the database using email"""
        try:
            result = self.supabase.table('users').select('id').eq('email', email).execute()
            if result.data:
                return result.data[0]['id']
        except Exception as e:
            print(f"❌ Error looking up user by email: {e}")
        return None

    def extract_phone_number(self, private_data_str: str, protected_data_str: str) -> Optional[str]:
        """Extract phone number from PrivateData and ProtectedData"""
        phone_number = None
        
        # Parse PrivateData
        if private_data_str and private_data_str != 'null':
            try:
                private_data = json.loads(private_data_str)
                if 'phoneNumber' in private_data:
                    phone_number = private_data['phoneNumber']
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                pass  # Silently skip parsing errors
        
        # Parse ProtectedData if no phone found in PrivateData
        if not phone_number and protected_data_str and protected_data_str != 'null':
            try:
                protected_data = json.loads(protected_data_str)
                if 'phoneNumber' in protected_data:
                    phone_number = protected_data['phoneNumber']
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                pass  # Silently skip parsing errors
        
        return phone_number

    def check_consultant_profile_exists(self, user_id: str) -> bool:
        """Check if a consultant profile exists for the user"""
        try:
            result = self.supabase.table('consultant_profiles').select('user_id').eq('user_id', user_id).execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"❌ Error checking consultant profile: {e}")
            return False

    def update_consultant_profile_phone(self, user_id: str, phone_number: str) -> bool:
        """Update the phone field in consultant_profiles table"""
        try:
            result = self.supabase.table('consultant_profiles').update({
                'phone': phone_number,
                'updated_at': datetime.now().isoformat()
            }).eq('user_id', user_id).execute()
            
            return len(result.data) > 0
        except Exception as e:
            print(f"❌ Error updating consultant profile phone: {e}")
            return False

    def test_phone_migration(self, csv_path: str, max_records: int = 3):
        """Test phone migration with limited records"""
        csv_file = Path(csv_path)
        
        if not csv_file.exists():
            print(f"❌ CSV file not found: {csv_path}")
            return
        
        print(f"🧪 Testing phone migration with {max_records} records from: {csv_path}")
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                self.stats['total_records'] += 1
                
                # Get user details
                csv_id = row.get('Id', '')
                email = row.get('EmailAddress', '')
                
                # Extract phone number
                phone_number = self.extract_phone_number(
                    row.get('PrivateData', ''),
                    row.get('ProtectedData', '')
                )
                
                if not phone_number:
                    continue  # Skip records without phone numbers
                
                self.stats['users_with_phones'] += 1
                
                print(f"\n📋 Processing record {self.stats['total_records']}:")
                print(f"   CSV ID: {csv_id}")
                print(f"   Email: {email}")
                print(f"   📱 Phone number: {phone_number}")
                
                # Get user ID from database
                user_id = self.get_user_id_from_email(email)
                
                if not user_id:
                    print(f"   ❌ User not found in database for email: {email}")
                    continue
                
                print(f"   ✅ Found user in database: {user_id}")
                
                # Check if consultant profile exists
                if not self.check_consultant_profile_exists(user_id):
                    print(f"   ⚠️  No consultant profile found for user: {user_id}")
                    continue
                
                print(f"   ✅ Consultant profile exists for user: {user_id}")
                
                # Update phone number
                if self.update_consultant_profile_phone(user_id, phone_number):
                    self.stats['phones_updated'] += 1
                    print(f"   ✅ Successfully updated phone number: {phone_number}")
                else:
                    error_msg = f"Failed to update phone number for user: {user_id}"
                    self.stats['errors'].append(error_msg)
                    print(f"   ❌ {error_msg}")
                
                print(f"\n📊 Test Results so far:")
                print(f"   Users with phones: {self.stats['users_with_phones']}")
                print(f"   Phones updated: {self.stats['phones_updated']}")
                print(f"   Errors: {len(self.stats['errors'])}")
                
                # Stop after processing max_records
                if self.stats['users_with_phones'] >= max_records:
                    break

    def print_summary(self):
        """Print a summary of the test results"""
        print("\n📊 Phone Migration Test Summary:")
        print(f"   Total records processed: {self.stats['total_records']}")
        print(f"   Users with phones: {self.stats['users_with_phones']}")
        print(f"   Phones updated: {self.stats['phones_updated']}")
        print(f"   Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n❌ Errors encountered:")
            for error in self.stats['errors']:
                print(f"   • {error}")

def main():
    migrator = TestPhoneMigration()
    
    # Test with 3 records
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    migrator.test_phone_migration(csv_path, max_records=3)
    
    # Print summary
    migrator.print_summary()

if __name__ == "__main__":
    main() 