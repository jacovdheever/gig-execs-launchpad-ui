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

class TestConsultantProfilesMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'total_records': 0,
            'consultants_found': 0,
            'profiles_inserted': 0,
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
                print(f"⚠️  Error parsing PublicData: {e}")
        
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
                print(f"⚠️  Error parsing PrivateData: {e}")
        
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

    def test_single_record(self, csv_path: str):
        """Test migration with just 1 record that has consultant data"""
        csv_file = Path(csv_path)
        
        if not csv_file.exists():
            print(f"❌ CSV file not found: {csv_path}")
            return
        
        print(f"🧪 Testing consultant profiles migration with 1 record from: {csv_path}")
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            # Find a record with consultant data
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
                
                print(f"\n📋 Processing record {self.stats['total_records']}:")
                print(f"   CSV ID: {csv_id}")
                print(f"   Email: {email}")
                
                # Get user ID from database
                user_id = self.get_user_id_from_email(email)
                
                if not user_id:
                    print(f"   ❌ User not found in database for email: {email}")
                    print(f"   📝 This user has consultant data but isn't in the database")
                    print(f"   Sample data:")
                    for key, value in list(consultant_data.items())[:3]:
                        print(f"     • {key}: {value}")
                    break
                
                print(f"   ✅ Found user in database: {user_id}")
                
                print(f"   📝 Found consultant data:")
                for key, value in consultant_data.items():
                    if value:
                        print(f"     • {key}: {value}")
                
                # Transform data
                profile_data = self.transform_consultant_profile(user_id, consultant_data)
                
                print(f"   🔄 Transformed profile data:")
                for key, value in profile_data.items():
                    if value and key != 'user_id':
                        print(f"     • {key}: {value}")
                
                # Insert profile
                try:
                    result = self.supabase.table('consultant_profiles').insert(profile_data).execute()
                    
                    if result.data:
                        self.stats['profiles_inserted'] += 1
                        print(f"   ✅ Successfully inserted consultant profile")
                    else:
                        error_msg = f"No data returned for consultant profile: {user_id}"
                        self.stats['errors'].append(error_msg)
                        print(f"   ❌ {error_msg}")
                        
                except Exception as e:
                    error_msg = str(e)
                    # Check if it's a duplicate key error (expected)
                    if 'duplicate key value violates unique constraint' in error_msg:
                        print(f"   ⚠️  Profile already exists for this user (expected)")
                    else:
                        # This is an unexpected error
                        full_error_msg = f"Error inserting consultant profile for user {user_id}: {e}"
                        self.stats['errors'].append(full_error_msg)
                        print(f"   ❌ {full_error_msg}")
                
                print(f"\n📊 Test Results:")
                print(f"   Profile inserted: {self.stats['profiles_inserted']}")
                print(f"   Errors: {len(self.stats['errors'])}")
                
                # Only process 1 record
                break

    def print_summary(self):
        """Print a summary of the test results"""
        print("\n📊 Test Migration Summary:")
        print(f"   Total records processed: {self.stats['total_records']}")
        print(f"   Consultants found: {self.stats['consultants_found']}")
        print(f"   Profiles inserted: {self.stats['profiles_inserted']}")
        print(f"   Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n❌ Errors encountered:")
            for error in self.stats['errors']:
                print(f"   • {error}")

def main():
    migrator = TestConsultantProfilesMigration()
    
    # Test with single record
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    migrator.test_single_record(csv_path)
    
    # Print summary
    migrator.print_summary()

if __name__ == "__main__":
    main() 