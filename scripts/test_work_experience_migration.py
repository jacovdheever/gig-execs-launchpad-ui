#!/usr/bin/env python3
import csv
import json
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

class TestWorkExperienceMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
        self.country_mapping = {}
        self.load_country_mapping()

    def load_country_mapping(self):
        """Load country name to ID mapping from database"""
        try:
            result = self.supabase.table('countries').select('id, name').execute()
            for country in result.data:
                self.country_mapping[country['name']] = country['id']
            print(f"✅ Loaded {len(self.country_mapping)} countries for mapping")
        except Exception as e:
            print(f"❌ Error loading country mapping: {e}")

    def get_user_id_from_email(self, email: str) -> Optional[str]:
        """Get user ID from email address"""
        try:
            result = self.supabase.table('users').select('id').eq('email', email).execute()
            if result.data:
                return result.data[0]['id']
            return None
        except Exception as e:
            print(f"❌ Error looking up user by email {email}: {e}")
            return None

    def get_country_id(self, country_name: str) -> Optional[int]:
        """Get country ID from country name"""
        if not country_name:
            return None
        
        # Direct mapping
        if country_name in self.country_mapping:
            return self.country_mapping[country_name]
        
        # Try some common variations
        variations = {
            'United States': 'United States of America',
            'USA': 'United States of America',
            'US': 'United States of America',
            'UK': 'United Kingdom',
            'England': 'United Kingdom',
            'UAE': 'United Arab Emirates',
            'South Korea': 'Korea, Republic of',
            'North Korea': 'Korea, Democratic People\'s Republic of',
            'Czech Republic': 'Czechia',
            'Brasil': 'Brazil'
        }
        
        if country_name in variations:
            mapped_name = variations[country_name]
            if mapped_name in self.country_mapping:
                return self.country_mapping[mapped_name]
        
        return None

    def extract_work_experience_data(self, public_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract work experience entries from PublicData"""
        work_experience_entries = []
        
        if not public_data or 'workExperience' not in public_data:
            return work_experience_entries
        
        work_experience = public_data['workExperience']
        if not work_experience or not isinstance(work_experience, list):
            return work_experience_entries
        
        for entry in work_experience:
            if not isinstance(entry, dict):
                continue
                
            # Extract required fields
            company = entry.get('company', '').strip()
            job_title = entry.get('jobTitle', '').strip()
            
            # Skip if missing required fields
            if not company or not job_title:
                continue
            
            # Extract optional fields
            description = entry.get('description', '').strip()
            city = entry.get('city', '').strip()
            country = entry.get('country', '').strip()
            start_date_month = entry.get('startDateMonth', '').strip()
            start_date_year = entry.get('startDateYear')
            end_date_month = entry.get('endDateMonth', '').strip()
            end_date_year = entry.get('endDateYear')
            currently_working = entry.get('currentlyWorkingInRole', False)
            
            # Convert currently_working to boolean
            if isinstance(currently_working, list):
                currently_working = bool(currently_working)
            elif isinstance(currently_working, str):
                currently_working = currently_working.lower() in ['true', '1', 'yes']
            
            # Convert year to integer if it's a string
            if isinstance(start_date_year, str):
                try:
                    start_date_year = int(start_date_year)
                except ValueError:
                    start_date_year = None
            
            if isinstance(end_date_year, str):
                try:
                    end_date_year = int(end_date_year)
                except ValueError:
                    end_date_year = None
            
            work_experience_entries.append({
                'company': company,
                'job_title': job_title,
                'description': description if description else None,
                'city': city if city else None,
                'country': country if country else None,
                'start_date_month': start_date_month if start_date_month else None,
                'start_date_year': start_date_year,
                'end_date_month': end_date_month if end_date_month else None,
                'end_date_year': end_date_year,
                'currently_working': currently_working
            })
        
        return work_experience_entries

    def transform_work_experience(self, user_id: str, entry: Dict[str, Any]) -> Dict[str, Any]:
        """Transform work experience entry for database insertion"""
        # Get country ID
        country_id = None
        if entry.get('country'):
            country_id = self.get_country_id(entry['country'])
            if not country_id:
                print(f"⚠️  Country not found in mapping: {entry['country']}")
        
        return {
            'user_id': user_id,
            'company': entry['company'],
            'job_title': entry['job_title'],
            'description': entry.get('description'),
            'city': entry.get('city'),
            'country_id': country_id,
            'start_date_month': entry.get('start_date_month'),
            'start_date_year': entry.get('start_date_year'),
            'end_date_month': entry.get('end_date_month'),
            'end_date_year': entry.get('end_date_year'),
            'currently_working': entry.get('currently_working', False)
        }

    def test_single_record(self):
        """Test migration with a single record"""
        csv_file = Path(self.csv_path)
        
        if not csv_file.exists():
            print(f"❌ CSV file not found: {self.csv_path}")
            return
        
        print("🧪 Testing work experience migration with single record...")
        print("=" * 60)
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                # Get user ID from email
                email = row.get('EmailAddress', '').strip()
                if not email:
                    continue
                
                user_id = self.get_user_id_from_email(email)
                if not user_id:
                    print(f"⚠️  User not found for email: {email}")
                    continue
                
                # Parse PublicData
                public_data_str = row.get('PublicData', '')
                if not public_data_str or public_data_str == 'null':
                    continue
                
                try:
                    public_data = json.loads(public_data_str)
                except (json.JSONDecodeError, TypeError):
                    continue
                
                # Extract work experience data
                work_experience_entries = self.extract_work_experience_data(public_data)
                
                if work_experience_entries:
                    print(f"✅ Found {len(work_experience_entries)} work experience entries for user {email}")
                    
                    # Test first work experience entry
                    first_entry = work_experience_entries[0]
                    print(f"\n📋 Work Experience Entry Details:")
                    print(f"   Company: {first_entry['company']}")
                    print(f"   Job Title: {first_entry['job_title']}")
                    print(f"   City: {first_entry.get('city', 'N/A')}")
                    print(f"   Country: {first_entry.get('country', 'N/A')}")
                    print(f"   Start Date: {first_entry.get('start_date_month', 'N/A')} {first_entry.get('start_date_year', 'N/A')}")
                    print(f"   End Date: {first_entry.get('end_date_month', 'N/A')} {first_entry.get('end_date_year', 'N/A')}")
                    print(f"   Currently Working: {first_entry.get('currently_working', False)}")
                    print(f"   Description: {first_entry.get('description', 'N/A')[:100]}...")
                    
                    # Transform for database
                    transformed_entry = self.transform_work_experience(user_id, first_entry)
                    print(f"\n🔄 Transformed Entry:")
                    for key, value in transformed_entry.items():
                        print(f"   {key}: {value}")
                    
                    # Test insertion
                    print(f"\n💾 Testing database insertion...")
                    try:
                        result = self.supabase.table('work_experience').insert(transformed_entry).execute()
                        if result.data:
                            print(f"✅ Successfully inserted work experience entry!")
                            print(f"   Inserted ID: {result.data[0]['id']}")
                            
                            # Verify the insertion
                            verify_result = self.supabase.table('work_experience').select('*').eq('id', result.data[0]['id']).execute()
                            if verify_result.data:
                                print(f"✅ Verification successful - record found in database")
                            else:
                                print(f"⚠️  Verification failed - record not found")
                        else:
                            print(f"❌ Insertion failed - no data returned")
                    except Exception as e:
                        print(f"❌ Error during insertion: {e}")
                    
                    # Only process first record with work experience
                    break
                else:
                    print(f"ℹ️  No work experience found for user: {email}")
        
        print("\n" + "=" * 60)
        print("🧪 Test completed!")

def main():
    test = TestWorkExperienceMigration()
    test.test_single_record()

if __name__ == "__main__":
    main() 