#!/usr/bin/env python3
import csv
import json
import uuid
from datetime import datetime
from pathlib import Path
from supabase import create_client
from typing import Dict, List, Any, Optional

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

class ConsultantProfilesMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'total_records': 0,
            'consultants_found': 0,
            'profiles_inserted': 0,
            'profiles_skipped': 0,
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

    def extract_consultant_data(self, public_data_str: str, private_data_str: str) -> Optional[Dict[str, Any]]:
        """Extract consultant profile data from PublicData and PrivateData"""
        consultant_data = {}
        
        # Parse PublicData
        if public_data_str and public_data_str != 'null':
            try:
                public_data = json.loads(public_data_str)
                
                # Extract headline (job title)
                if 'headline' in public_data:
                    consultant_data['job_title'] = public_data['headline']
                
                # Extract hourly rate
                if 'hourlyRate' in public_data:
                    hourly_rate = public_data['hourlyRate']
                    if 'minPrice' in hourly_rate and 'amount' in hourly_rate['minPrice']:
                        consultant_data['hourly_rate_min'] = str(hourly_rate['minPrice']['amount'])
                    if 'maxPrice' in hourly_rate and 'amount' in hourly_rate['maxPrice']:
                        consultant_data['hourly_rate_max'] = str(hourly_rate['maxPrice']['amount'])
                
                # Extract address from PublicData
                if 'address' in public_data:
                    address = public_data['address']
                    consultant_data['country'] = address.get('country')
                    consultant_data['postal_code'] = address.get('zipCode')
                    
                    # Build address1 and address2
                    street_name = address.get('streetName', '')
                    suburb = address.get('suburb', '')
                    city = address.get('city', '')
                    state = address.get('state', '')
                    
                    if street_name:
                        address1_parts = [street_name]
                        if suburb:
                            address1_parts.append(suburb)
                        consultant_data['address1'] = ', '.join(address1_parts)
                    
                    if city or state:
                        address2_parts = []
                        if city:
                            address2_parts.append(city)
                        if state:
                            address2_parts.append(state)
                        consultant_data['address2'] = ', '.join(address2_parts)
                    
                    consultant_data['address3'] = address.get('city')  # Use city as address3
                
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                pass  # Silently skip parsing errors
        
        # Parse PrivateData
        if private_data_str and private_data_str != 'null':
            try:
                private_data = json.loads(private_data_str)
                
                # Extract phone number
                if 'phoneNumber' in private_data:
                    consultant_data['phone'] = private_data['phoneNumber']
                
                # Extract additional address info from PrivateData if not in PublicData
                if 'address' in private_data and 'country' not in consultant_data:
                    address = private_data['address']
                    consultant_data['country'] = address.get('country')
                    consultant_data['postal_code'] = address.get('zipCode')
                    
                    # Build address1 and address2
                    street_name = address.get('streetName', '')
                    suburb = address.get('suburb', '')
                    city = address.get('city', '')
                    state = address.get('state', '')
                    
                    if street_name and 'address1' not in consultant_data:
                        address1_parts = [street_name]
                        if suburb:
                            address1_parts.append(suburb)
                        consultant_data['address1'] = ', '.join(address1_parts)
                    
                    if (city or state) and 'address2' not in consultant_data:
                        address2_parts = []
                        if city:
                            address2_parts.append(city)
                        if state:
                            address2_parts.append(state)
                        consultant_data['address2'] = ', '.join(address2_parts)
                    
                    if city and 'address3' not in consultant_data:
                        consultant_data['address3'] = city
                
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                pass  # Silently skip parsing errors
        
        return consultant_data if consultant_data else None

    def transform_consultant_profile(self, user_id: str, consultant_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform consultant data to the target format"""
        profile_data = {
            'user_id': user_id,
            'job_title': consultant_data.get('job_title'),
            'bio': None,  # No bio data available
            'address1': consultant_data.get('address1'),
            'address2': consultant_data.get('address2'),
            'address3': consultant_data.get('address3'),
            'country': consultant_data.get('country'),
            'postal_code': consultant_data.get('postal_code'),
            'phone': consultant_data.get('phone'),
            'linkedin_url': None,  # Not available in source data
            'id_doc_url': None,  # Not available in source data
            'video_intro_url': None,  # Not available in source data
            'stripe_account_id': None,  # Not available in source data
            'hourly_rate_min': consultant_data.get('hourly_rate_min'),
            'hourly_rate_max': consultant_data.get('hourly_rate_max'),
            'availability': None,  # Not available in source data
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        return profile_data

    def migrate_consultant_profiles(self, csv_path: str):
        """Migrate consultant profiles from CSV to database"""
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
                
                # Extract consultant data
                consultant_data = self.extract_consultant_data(
                    row.get('PublicData', ''),
                    row.get('PrivateData', '')
                )
                
                if not consultant_data:
                    continue  # Skip records without consultant data
                
                self.stats['consultants_found'] += 1
                
                # Get user ID from database
                user_id = self.get_user_id_from_email(email)
                
                if not user_id:
                    continue  # Skip if user doesn't exist in database
                
                # Transform data
                profile_data = self.transform_consultant_profile(user_id, consultant_data)
                
                # Insert profile
                try:
                    result = self.supabase.table('consultant_profiles').insert(profile_data).execute()
                    
                    if result.data:
                        self.stats['profiles_inserted'] += 1
                    else:
                        error_msg = f"No data returned for consultant profile: {user_id}"
                        self.stats['errors'].append(error_msg)
                        
                except Exception as e:
                    error_msg = str(e)
                    # Check if it's a duplicate key error (expected)
                    if 'duplicate key value violates unique constraint' in error_msg:
                        self.stats['profiles_skipped'] += 1
                    else:
                        # This is an unexpected error
                        full_error_msg = f"Error inserting consultant profile for user {user_id}: {e}"
                        self.stats['errors'].append(full_error_msg)

    def save_migration_stats(self, output_path: str = 'data/consultant_profiles_migration_stats.json'):
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
        print("\n📊 Consultant Profiles Migration Summary:")
        print(f"   Total records processed: {self.stats['total_records']}")
        print(f"   Consultants found: {self.stats['consultants_found']}")
        print(f"   Profiles inserted: {self.stats['profiles_inserted']}")
        print(f"   Profiles skipped (already exist): {self.stats['profiles_skipped']}")
        print(f"   Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n❌ Sample errors encountered:")
            for error in self.stats['errors'][:5]:  # Show first 5 errors
                print(f"   • {error}")
            if len(self.stats['errors']) > 5:
                print(f"   ... and {len(self.stats['errors']) - 5} more")

def main():
    migrator = ConsultantProfilesMigration()
    
    # Migrate consultant profiles
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    migrator.migrate_consultant_profiles(csv_path)
    
    # Save stats
    migrator.save_migration_stats()
    
    # Print summary
    migrator.print_summary()

if __name__ == "__main__":
    main() 