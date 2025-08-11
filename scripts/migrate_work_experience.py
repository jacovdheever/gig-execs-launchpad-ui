#!/usr/bin/env python3
import csv
import json
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
from supabase import create_client
import uuid

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

class WorkExperienceMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
        self.stats = {
            'total_records': 0,
            'records_with_work_experience': 0,
            'work_experience_entries': 0,
            'successful_inserts': 0,
            'errors': 0,
            'country_mapping_errors': 0,
            'user_not_found_errors': 0
        }
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
            company = entry.get('company', '')
            if company:
                company = company.strip()
            job_title = entry.get('jobTitle', '')
            if job_title:
                job_title = job_title.strip()
            
            # Skip if missing required fields
            if not company or not job_title:
                continue
            
            # Extract optional fields
            description = entry.get('description', '')
            if description:
                description = description.strip()
            city = entry.get('city', '')
            if city:
                city = city.strip()
            country = entry.get('country', '')
            if country:
                country = country.strip()
            start_date_month = entry.get('startDateMonth', '')
            if start_date_month:
                start_date_month = start_date_month.strip()
            start_date_year = entry.get('startDateYear')
            end_date_month = entry.get('endDateMonth', '')
            if end_date_month:
                end_date_month = end_date_month.strip()
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
                self.stats['country_mapping_errors'] += 1
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

    def insert_work_experience(self, work_experience_data: Dict[str, Any]) -> bool:
        """Insert work experience entry into database"""
        try:
            result = self.supabase.table('work_experience').insert(work_experience_data).execute()
            if result.data:
                return True
            return False
        except Exception as e:
            print(f"❌ Error inserting work experience: {e}")
            return False

    def migrate_work_experience(self):
        """Main migration function"""
        csv_file = Path(self.csv_path)
        
        if not csv_file.exists():
            print(f"❌ CSV file not found: {self.csv_path}")
            return
        
        print("🚀 Starting work experience migration...")
        print("=" * 60)
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                self.stats['total_records'] += 1
                
                # Get user ID from email
                email = row.get('EmailAddress', '').strip()
                if not email:
                    continue
                
                user_id = self.get_user_id_from_email(email)
                if not user_id:
                    self.stats['user_not_found_errors'] += 1
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
                    self.stats['records_with_work_experience'] += 1
                    self.stats['work_experience_entries'] += len(work_experience_entries)
                    
                    # Insert each work experience entry
                    for entry in work_experience_entries:
                        transformed_entry = self.transform_work_experience(user_id, entry)
                        
                        if self.insert_work_experience(transformed_entry):
                            self.stats['successful_inserts'] += 1
                        else:
                            self.stats['errors'] += 1
                
                # Progress indicator
                if self.stats['total_records'] % 50 == 0:
                    print(f"📊 Processed {self.stats['total_records']} records...")
        
        self.save_migration_stats()
        self.print_summary()

    def save_migration_stats(self):
        """Save migration statistics to file"""
        stats_file = 'data/work_experience_migration_stats.json'
        try:
            with open(stats_file, 'w') as f:
                json.dump(self.stats, f, indent=2)
            print(f"💾 Saved migration stats to: {stats_file}")
        except Exception as e:
            print(f"❌ Error saving stats: {e}")

    def print_summary(self):
        """Print migration summary"""
        print("\n" + "=" * 60)
        print("📊 Work Experience Migration Summary:")
        print(f"   Total records processed: {self.stats['total_records']}")
        print(f"   Records with work experience: {self.stats['records_with_work_experience']}")
        print(f"   Work experience entries found: {self.stats['work_experience_entries']}")
        print(f"   Successful inserts: {self.stats['successful_inserts']}")
        print(f"   Errors: {self.stats['errors']}")
        print(f"   Country mapping errors: {self.stats['country_mapping_errors']}")
        print(f"   User not found errors: {self.stats['user_not_found_errors']}")
        
        if self.stats['work_experience_entries'] > 0:
            success_rate = (self.stats['successful_inserts'] / self.stats['work_experience_entries']) * 100
            print(f"   Success rate: {success_rate:.1f}%")
        
        print("=" * 60)

def main():
    migration = WorkExperienceMigration()
    migration.migrate_work_experience()

if __name__ == "__main__":
    main() 