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

class PhoneNumberMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'total_records': 0,
            'users_with_phones': 0,
            'consultant_profiles_found': 0,
            'phones_updated': 0,
            'phones_skipped': 0,
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

    def migrate_phone_numbers(self, csv_path: str):
        """Migrate phone numbers from CSV to consultant_profiles table"""
        csv_file = Path(csv_path)
        
        if not csv_file.exists():
            print(f"❌ CSV file not found: {csv_path}")
            return
        
        print(f"📖 Processing CSV file: {csv_path}")
        
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
                
                # Get user ID from database
                user_id = self.get_user_id_from_email(email)
                
                if not user_id:
                    continue  # Skip if user doesn't exist in database
                
                # Check if consultant profile exists
                if not self.check_consultant_profile_exists(user_id):
                    continue  # Skip if no consultant profile
                
                self.stats['consultant_profiles_found'] += 1
                
                # Update phone number
                try:
                    result = self.supabase.table('consultant_profiles').update({
                        'phone': phone_number,
                        'updated_at': datetime.now().isoformat()
                    }).eq('user_id', user_id).execute()
                    
                    if result.data:
                        self.stats['phones_updated'] += 1
                    else:
                        self.stats['phones_skipped'] += 1
                        
                except Exception as e:
                    error_msg = f"Error updating phone number for user {user_id}: {e}"
                    self.stats['errors'].append(error_msg)

    def save_migration_stats(self, output_path: str = 'data/phone_numbers_migration_stats.json'):
        """Save migration statistics"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        data = {
            'stats': self.stats,
            'timestamp': datetime.now().isoformat()
        }
        
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved migration stats to: {output_file}")

    def print_summary(self):
        """Print a summary of the migration results"""
        print("\n📊 Phone Numbers Migration Summary:")
        print(f"   Total records processed: {self.stats['total_records']}")
        print(f"   Users with phones: {self.stats['users_with_phones']}")
        print(f"   Consultant profiles found: {self.stats['consultant_profiles_found']}")
        print(f"   Phones updated: {self.stats['phones_updated']}")
        print(f"   Phones skipped (no changes): {self.stats['phones_skipped']}")
        print(f"   Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n❌ Sample errors encountered:")
            for error in self.stats['errors'][:5]:  # Show first 5 errors
                print(f"   • {error}")
            if len(self.stats['errors']) > 5:
                print(f"   ... and {len(self.stats['errors']) - 5} more")

def main():
    migrator = PhoneNumberMigration()
    
    # Migrate phone numbers
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    migrator.migrate_phone_numbers(csv_path)
    
    # Save stats
    migrator.save_migration_stats()
    
    # Print summary
    migrator.print_summary()

if __name__ == "__main__":
    main() 