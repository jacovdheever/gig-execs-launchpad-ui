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

class RelatedDataMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'total_records': 0,
            'consultant_profiles': 0,
            'client_profiles': 0,
            'skills_processed': 0,
            'certifications_processed': 0,
            'education_records': 0,
            'portfolio_records': 0,
            'errors': []
        }
        self.user_id_mapping = {}

    def generate_uuid(self, csv_id: str) -> str:
        """Generate a UUID for a CSV ID, ensuring consistency"""
        if csv_id not in self.user_id_mapping:
            self.user_id_mapping[csv_id] = str(uuid.uuid4())
        return self.user_id_mapping[csv_id]

    def parse_date(self, date_str: str) -> str:
        """Parse date string to ISO format"""
        try:
            if date_str and date_str.strip():
                dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                return dt.isoformat()
            return datetime.now().isoformat()
        except:
            return datetime.now().isoformat()

    def parse_month_year(self, month: str, year: str) -> Optional[str]:
        """Convert month/year to date string"""
        try:
            if month and year:
                return f"{year}-{month.zfill(2)}-01"
            return None
        except:
            return None

    def transform_consultant_profile(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """Transform consultant profile data"""
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,
            'bio': row.get('Bio', ''),
            'hourly_rate': float(row.get('HourlyRate', 0)) if row.get('HourlyRate') else None,
            'years_experience': int(row.get('YearsOfExperience', 0)) if row.get('YearsOfExperience') else None,
            'location': row.get('Location', ''),
            'availability': row.get('Availability', ''),
            'specializations': row.get('Specializations', ''),
            'created_at': self.parse_date(row['CreatedAt']),
            'updated_at': self.parse_date(row['CreatedAt'])
        }

    def transform_client_profile(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """Transform client profile data"""
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,
            'company_name': row.get('CompanyName', ''),
            'industry': row.get('Industry', ''),
            'project_budget': float(row.get('ProjectBudget', 0)) if row.get('ProjectBudget') else None,
            'project_timeline': row.get('ProjectTimeline', ''),
            'created_at': self.parse_date(row['CreatedAt']),
            'updated_at': self.parse_date(row['CreatedAt'])
        }

    def transform_skill(self, row: Dict[str, Any], skill_name: str) -> Dict[str, Any]:
        """Transform skill data"""
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,
            'skill_name': skill_name,
            'proficiency_level': 'intermediate',
            'years_experience': 1,
            'created_at': self.parse_date(row['CreatedAt']),
            'updated_at': self.parse_date(row['CreatedAt'])
        }

    def transform_certification(self, row: Dict[str, Any], cert_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform certification data"""
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,
            'name': cert_data.get('name', ''),
            'issuing_organization': cert_data.get('issuingOrganization', ''),
            'issue_date': self.parse_month_year(cert_data.get('issueMonth', ''), cert_data.get('issueYear', '')),
            'expiration_date': self.parse_month_year(cert_data.get('expirationMonth', ''), cert_data.get('expirationYear', '')),
            'credential_id': cert_data.get('credentialId', ''),
            'credential_url': cert_data.get('credentialUrl', ''),
            'created_at': self.parse_date(row['CreatedAt']),
            'updated_at': self.parse_date(row['CreatedAt'])
        }

    def transform_education(self, row: Dict[str, Any], edu_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform education data"""
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,
            'institution': edu_data.get('institution', ''),
            'degree': edu_data.get('degree', ''),
            'field_of_study': edu_data.get('fieldOfStudy', ''),
            'start_date': self.parse_month_year(edu_data.get('startMonth', ''), edu_data.get('startYear', '')),
            'end_date': self.parse_month_year(edu_data.get('endMonth', ''), edu_data.get('endYear', '')),
            'gpa': float(edu_data.get('gpa', 0)) if edu_data.get('gpa') else None,
            'description': edu_data.get('description', ''),
            'created_at': self.parse_date(row['CreatedAt']),
            'updated_at': self.parse_date(row['CreatedAt'])
        }

    def transform_portfolio(self, row: Dict[str, Any], portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform portfolio data"""
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,
            'title': portfolio_data.get('title', ''),
            'description': portfolio_data.get('description', ''),
            'url': portfolio_data.get('url', ''),
            'image_url': portfolio_data.get('imageUrl', ''),
            'start_date': self.parse_month_year(portfolio_data.get('startMonth', ''), portfolio_data.get('startYear', '')),
            'end_date': self.parse_month_year(portfolio_data.get('endMonth', ''), portfolio_data.get('endYear', '')),
            'created_at': self.parse_date(row['CreatedAt']),
            'updated_at': self.parse_date(row['CreatedAt'])
        }

    def migrate_related_data(self):
        """Migrate only related data for existing users"""
        csv_file = Path('data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv')
        
        print(f"Starting related data migration from {csv_file}")
        print("=" * 60)
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for i, row in enumerate(reader, 1):
                self.stats['total_records'] += 1
                print(f"Processing record {i}/866: {row['EmailAddress']}")
                
                # Skip banned users
                if row.get('Banned', 'false') == 'true':
                    print(f"  Skipping banned user: {row['EmailAddress']}")
                    continue
                
                # Parse public data
                try:
                    public_data = json.loads(row['PublicData']) if row['PublicData'] else {}
                except:
                    public_data = {}
                
                # Ensure public_data is always a dictionary
                if public_data is None:
                    public_data = {}
                
                # Determine account type
                account_type = row.get('AccountType', 'consultant').lower()
                
                # Process consultant profiles
                if account_type == 'consultant':
                    consultant_data = self.transform_consultant_profile(row)
                    try:
                        self.supabase.table('consultant_profiles').upsert(consultant_data).execute()
                        self.stats['consultant_profiles'] += 1
                    except Exception as e:
                        self.stats['errors'].append(f"Error inserting consultant profile for {row['EmailAddress']}: {e}")
                
                # Process client profiles
                elif account_type == 'client':
                    client_data = self.transform_client_profile(row)
                    try:
                        self.supabase.table('client_profiles').upsert(client_data).execute()
                        self.stats['client_profiles'] += 1
                    except Exception as e:
                        self.stats['errors'].append(f"Error inserting client profile for {row['EmailAddress']}: {e}")
                
                # Process skills
                if public_data.get('skills'):
                    for skill in public_data['skills']:
                        skill_data = self.transform_skill(row, skill)
                        try:
                            self.supabase.table('user_skills').upsert(skill_data).execute()
                            self.stats['skills_processed'] += 1
                        except Exception as e:
                            self.stats['errors'].append(f"Error inserting skill {skill} for {row['EmailAddress']}: {e}")

                # Process certifications
                if public_data.get('certifications'):
                    for cert in public_data['certifications']:
                        cert_data = self.transform_certification(row, cert)
                        try:
                            self.supabase.table('certifications').upsert(cert_data).execute()
                            self.stats['certifications_processed'] += 1
                        except Exception as e:
                            self.stats['errors'].append(f"Error inserting certification for {row['EmailAddress']}: {e}")

                # Process education
                if public_data.get('education'):
                    for edu in public_data['education']:
                        edu_data = self.transform_education(row, edu)
                        try:
                            self.supabase.table('education').upsert(edu_data).execute()
                            self.stats['education_records'] += 1
                        except Exception as e:
                            self.stats['errors'].append(f"Error inserting education for {row['EmailAddress']}: {e}")

                # Process portfolio
                if public_data.get('portfolio'):
                    for portfolio in public_data['portfolio']:
                        portfolio_data = self.transform_portfolio(row, portfolio)
                        try:
                            self.supabase.table('portfolio').upsert(portfolio_data).execute()
                            self.stats['portfolio_records'] += 1
                        except Exception as e:
                            self.stats['errors'].append(f"Error inserting portfolio for {row['EmailAddress']}: {e}")

        # Print final statistics
        print("\n" + "=" * 60)
        print("MIGRATION STATISTICS")
        print("=" * 60)
        print(f"Total records processed: {self.stats['total_records']}")
        print(f"Consultant profiles: {self.stats['consultant_profiles']}")
        print(f"Client profiles: {self.stats['client_profiles']}")
        print(f"Skills processed: {self.stats['skills_processed']}")
        print(f"Certifications processed: {self.stats['certifications_processed']}")
        print(f"Education records: {self.stats['education_records']}")
        print(f"Portfolio records: {self.stats['portfolio_records']}")
        print(f"Errors encountered: {len(self.stats['errors'])}")

        if self.stats['errors']:
            print(f"\nERRORS:")
            for error in self.stats['errors'][:10]:  # Show first 10 errors
                print(f"  - {error}")
            if len(self.stats['errors']) > 10:
                print(f"  ... and {len(self.stats['errors']) - 10} more errors")

if __name__ == "__main__":
    migration = RelatedDataMigration()
    migration.migrate_related_data() 