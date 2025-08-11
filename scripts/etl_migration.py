#!/usr/bin/env python3
import csv
import json
import sys
import asyncio
import uuid
from datetime import datetime
from pathlib import Path
from supabase import create_client, Client
from typing import Dict, List, Any, Optional

# Supabase configuration - Using service role key to bypass RLS
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

class GigExecsETL:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'total_records': 0,
            'processed_users': 0,
            'processed_consultants': 0,
            'processed_clients': 0,
            'processed_skills': 0,
            'processed_certifications': 0,
            'processed_education': 0,
            'processed_portfolio': 0,
            'errors': []
        }
        self.user_id_mapping = {}  # Map CSV ID to generated UUID

    def generate_uuid(self, csv_id: str) -> str:
        """Generate a UUID for a CSV ID, ensuring consistency"""
        if csv_id not in self.user_id_mapping:
            self.user_id_mapping[csv_id] = str(uuid.uuid4())
        return self.user_id_mapping[csv_id]

    def parse_date(self, date_str: str) -> str:
        """Parse date string to ISO format"""
        try:
            # Handle various date formats
            if date_str and date_str.strip():
                # Try to parse the date
                dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                return dt.isoformat()
            return datetime.now().isoformat()
        except:
            return datetime.now().isoformat()

    def parse_month_year(self, month: str, year: str) -> Optional[str]:
        """Convert month/year to date string"""
        try:
            if not month or not year:
                return None
            month_map = {
                'january': 1, 'february': 2, 'march': 3, 'april': 4,
                'may': 5, 'june': 6, 'july': 7, 'august': 8,
                'september': 9, 'october': 10, 'november': 11, 'december': 12
            }
            month_num = month_map.get(month.lower(), 1)
            return f"{year}-{month_num:02d}-01"
        except:
            return None
    
    def transform_user_data(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """Transform user data for Supabase users table"""
        # Generate a proper UUID for the user
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'id': user_uuid,
            'email': row['EmailAddress'],
            'first_name': row.get('FirstName', ''),
            'last_name': row.get('LastName', ''),
            'user_type': 'consultant',  # Default to consultant for now
            'status': 'registered',
            'created_at': self.parse_date(row['CreatedAt']),
            'updated_at': self.parse_date(row['CreatedAt'])
        }
    
    def transform_consultant_profile(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """Transform consultant profile data"""
        # Use the mapped UUID instead of the original CSV ID
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,  # Use the mapped UUID
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
        # Use the mapped UUID instead of the original CSV ID
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,  # Use the mapped UUID
            'company_name': row.get('CompanyName', ''),
            'industry': row.get('Industry', ''),
            'project_budget': float(row.get('ProjectBudget', 0)) if row.get('ProjectBudget') else None,
            'project_timeline': row.get('ProjectTimeline', ''),
            'created_at': self.parse_date(row['CreatedAt']),
            'updated_at': self.parse_date(row['CreatedAt'])
        }

    def transform_skill(self, row: Dict[str, Any], skill_name: str) -> Dict[str, Any]:
        """Transform skill data"""
        # Use the mapped UUID instead of the original CSV ID
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,  # Use the mapped UUID
            'skill_name': skill_name,
            'proficiency_level': 'intermediate',  # Default value
            'years_experience': 1,  # Default value
            'created_at': self.parse_date(row['CreatedAt']),
            'updated_at': self.parse_date(row['CreatedAt'])
        }

    def transform_certification(self, row: Dict[str, Any], cert_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform certification data"""
        # Use the mapped UUID instead of the original CSV ID
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,  # Use the mapped UUID
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
        # Use the mapped UUID instead of the original CSV ID
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,  # Use the mapped UUID
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
        # Use the mapped UUID instead of the original CSV ID
        user_uuid = self.generate_uuid(row['Id'])
        
        return {
            'user_id': user_uuid,  # Use the mapped UUID
            'title': portfolio_data.get('title', ''),
            'description': portfolio_data.get('description', ''),
            'url': portfolio_data.get('url', ''),
            'image_url': portfolio_data.get('imageUrl', ''),
            'start_date': self.parse_month_year(portfolio_data.get('startMonth', ''), portfolio_data.get('startYear', '')),
            'end_date': self.parse_month_year(portfolio_data.get('endMonth', ''), portfolio_data.get('endYear', '')),
            'created_at': self.parse_date(row['CreatedAt']),
            'updated_at': self.parse_date(row['CreatedAt'])
        }
    
    def process_skills(self, user_id: str, skills: List[str]) -> List[Dict[str, Any]]:
        """Process user skills"""
        skill_records = []
        for skill_name in skills:
            # First, ensure skill exists in skills table
            skill_id = self.ensure_skill_exists(skill_name)
            if skill_id:
                skill_records.append({
                    'user_id': user_id,
                    'skill_id': skill_id
                })
        return skill_records
    
    def ensure_skill_exists(self, skill_name: str) -> Optional[str]:
        """Ensure skill exists in skills table, return skill_id"""
        try:
            # Check if skill exists
            result = self.supabase.table('skills').select('id').eq('name', skill_name).execute()
            if result.data:
                return result.data[0]['id']
            
            # Create new skill
            result = self.supabase.table('skills').insert({'name': skill_name}).execute()
            if result.data:
                return result.data[0]['id']
        except Exception as e:
            self.stats['errors'].append(f"Error ensuring skill exists: {e}")
        return None
    
    def process_certifications(self, user_id: str, certifications: List[Dict]) -> List[Dict[str, Any]]:
        """Process user certifications"""
        cert_records = []
        for cert in certifications:
            issue_date = self.parse_month_year(cert.get('issueDateMonth'), str(cert.get('issueDateYear', '')))
            expiry_date = None
            if not cert.get('doesNotExpire', [False])[0]:
                # Calculate expiry date if needed
                pass
            
            cert_records.append({
                'user_id': user_id,
                'name': cert.get('certificationName'),
                'awarding_body': cert.get('issuingOrganization'),
                'issue_date': issue_date,
                'expiry_date': expiry_date,
                'credential_id': cert.get('credentialId'),
                'credential_url': cert.get('credentialUrl'),
                'file_url': cert.get('proofOfCertification')
            })
        return cert_records
    
    def process_education(self, user_id: str, education: List[Dict]) -> List[Dict[str, Any]]:
        """Process user education"""
        edu_records = []
        for edu in education:
            start_date = self.parse_month_year(edu.get('startDateMonth'), str(edu.get('startDateYear', '')))
            end_date = None
            if not edu.get('currentlyCompleting', False):
                end_date = self.parse_month_year(edu.get('endDateMonth'), str(edu.get('endDateYear', '')))
            
            edu_records.append({
                'user_id': user_id,
                'institution_name': edu.get('institutionName'),
                'degree_level': edu.get('degree'),
                'grade': None,  # Not available in source data
                'start_date': start_date,
                'end_date': end_date,
                'description': edu.get('fieldOfStudy'),
                'file_url': edu.get('proofOfFormalEducation')
            })
        return edu_records
    
    def process_portfolio(self, user_id: str, work_experience: List[Dict]) -> List[Dict[str, Any]]:
        """Process user portfolio from work experience"""
        portfolio_records = []
        for work in work_experience:
            start_date = self.parse_month_year(work.get('startDateMonth'), str(work.get('startDateYear', '')))
            completed_date = None
            if not work.get('currentlyWorkingInRole', False):
                # Would need end date in source data
                pass
            
            portfolio_records.append({
                'user_id': user_id,
                'project_name': work.get('company'),
                'project_role': work.get('jobTitle'),
                'description': work.get('description'),
                'start_date': start_date,
                'completed_date': completed_date,
                'currently_open': work.get('currentlyWorkingInRole', False),
                'skills': ', '.join(work.get('skills', [])) if work.get('skills') else None
            })
        return portfolio_records
    
    def process_languages(self, user_id: str, languages: List[Dict]) -> List[Dict[str, Any]]:
        """Process user languages"""
        language_records = []
        for lang in languages:
            # First, ensure language exists in languages table
            language_id = self.ensure_language_exists(lang.get('language'))
            if language_id:
                language_records.append({
                    'user_id': user_id,
                    'language_id': language_id,
                    'proficiency': lang.get('proficiency')
                })
        return language_records
    
    def ensure_language_exists(self, language_code: str) -> Optional[str]:
        """Ensure language exists in languages table, return language_id"""
        try:
            # Map language codes to names
            language_map = {
                'en': 'English',
                'es': 'Spanish',
                'fr': 'French',
                'de': 'German',
                'pt': 'Portuguese',
                'it': 'Italian',
                'ru': 'Russian',
                'zh': 'Chinese',
                'ja': 'Japanese',
                'ko': 'Korean',
                'ar': 'Arabic',
                'hi': 'Hindi'
            }
            language_name = language_map.get(language_code, language_code)
            
            # Check if language exists
            result = self.supabase.table('languages').select('id').eq('name', language_name).execute()
            if result.data:
                return result.data[0]['id']
            
            # Create new language
            result = self.supabase.table('languages').insert({'name': language_name}).execute()
            if result.data:
                return result.data[0]['id']
        except Exception as e:
            self.stats['errors'].append(f"Error ensuring language exists: {e}")
        return None
    
    def process_references(self, user_id: str, references: List[Dict]) -> List[Dict[str, Any]]:
        """Process user references"""
        ref_records = []
        for ref in references:
            ref_records.append({
                'user_id': user_id,
                'first_name': ref.get('firstName'),
                'last_name': ref.get('lastName'),
                'email': ref.get('email'),
                'phone': ref.get('phoneNumber'),
                'company_name': ref.get('company'),
                'description': None  # Could be added if available
            })
        return ref_records
    
    def migrate_data(self, csv_file: str):
        """Main ETL process"""
        print(f"Starting ETL migration from {csv_file}")
        print("=" * 60)
        print("IMPORTANT: This script requires the service role key from Supabase dashboard")
        print("Go to Settings > API > service_role key and update the SUPABASE_KEY variable")
        print("=" * 60)
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            rows = list(reader)
        
        self.stats['total_records'] = len(rows)
        
        for i, row in enumerate(rows):
            try:
                print(f"Processing record {i+1}/{len(rows)}: {row['EmailAddress']}")
                
                # Skip banned users
                if row['Banned'] == 'true':
                    print(f"  Skipping banned user: {row['EmailAddress']}")
                    continue
                
                # Parse public data
                public_data = {}
                if row['PublicData']:
                    try:
                        public_data = json.loads(row['PublicData'])
                    except json.JSONDecodeError:
                        print(f"  Error parsing PublicData for {row['EmailAddress']}")
                        continue
                
                # Insert user
                user_data = self.transform_user_data(row)
                try:
                    self.supabase.table('users').upsert(user_data).execute()
                    self.stats['processed_users'] += 1
                except Exception as e:
                    self.stats['errors'].append(f"Error inserting user {row['EmailAddress']}: {e}")
                    continue
                
                # Process based on account type
                account_type = public_data.get('accountType', 'unknown')
                
                if account_type == 'consultant':
                    # Insert consultant profile
                    consultant_data = self.transform_consultant_profile(row)
                    try:
                        self.supabase.table('consultant_profiles').upsert(consultant_data).execute()
                        self.stats['processed_consultants'] += 1
                    except Exception as e:
                        self.stats['errors'].append(f"Error inserting consultant profile for {row['EmailAddress']}: {e}")
                    
                    # Process skills
                    if public_data.get('skills'):
                        for skill in public_data['skills']:
                            skill_data = self.transform_skill(row, skill)
                            try:
                                self.supabase.table('user_skills').upsert(skill_data).execute()
                                self.stats['processed_skills'] += 1
                            except Exception as e:
                                self.stats['errors'].append(f"Error inserting skill {skill} for {row['EmailAddress']}: {e}")

                    # Process certifications
                    if public_data.get('certifications'):
                        for cert in public_data['certifications']:
                            cert_data = self.transform_certification(row, cert)
                            try:
                                self.supabase.table('certifications').upsert(cert_data).execute()
                                self.stats['processed_certifications'] += 1
                            except Exception as e:
                                self.stats['errors'].append(f"Error inserting certification for {row['EmailAddress']}: {e}")

                    # Process education
                    if public_data.get('education'):
                        for edu in public_data['education']:
                            edu_data = self.transform_education(row, edu)
                            try:
                                self.supabase.table('education').upsert(edu_data).execute()
                                self.stats['processed_education'] += 1
                            except Exception as e:
                                self.stats['errors'].append(f"Error inserting education for {row['EmailAddress']}: {e}")

                    # Process portfolio
                    if public_data.get('portfolio'):
                        for portfolio in public_data['portfolio']:
                            portfolio_data = self.transform_portfolio(row, portfolio)
                            try:
                                self.supabase.table('portfolio').upsert(portfolio_data).execute()
                                self.stats['processed_portfolio'] += 1
                            except Exception as e:
                                self.stats['errors'].append(f"Error inserting portfolio for {row['EmailAddress']}: {e}")
                    
                    # Process languages
                    if 'languages' in public_data:
                        lang_data = self.process_languages(row['Id'], public_data['languages'])
                        for lang_record in lang_data:
                            try:
                                self.supabase.table('user_languages').upsert(lang_record).execute()
                            except Exception as e:
                                self.stats['errors'].append(f"Error inserting language for {row['EmailAddress']}: {e}")
                
                elif account_type == 'client':
                    # Insert client profile
                    client_data = self.transform_client_profile(row)
                    try:
                        self.supabase.table('client_profiles').upsert(client_data).execute()
                        self.stats['processed_clients'] += 1
                    except Exception as e:
                        self.stats['errors'].append(f"Error inserting client profile for {row['EmailAddress']}: {e}")
                
                # Process references from protected data
                try:
                    if row['ProtectedData']:
                        protected_data = json.loads(row['ProtectedData'])
                        if 'references' in protected_data:
                            ref_data = self.process_references(row['Id'], protected_data['references'])
                            for ref_record in ref_data:
                                try:
                                    self.supabase.table('reference_contacts').upsert(ref_record).execute()
                                except Exception as e:
                                    self.stats['errors'].append(f"Error inserting reference for {row['EmailAddress']}: {e}")
                except json.JSONDecodeError:
                    pass
                
            except Exception as e:
                self.stats['errors'].append(f"Error processing record {i+1}: {e}")
        
        self.print_stats()
    
    def print_stats(self):
        """Print migration statistics"""
        print("\n" + "=" * 60)
        print("MIGRATION STATISTICS")
        print("=" * 60)
        print(f"Total records processed: {self.stats['total_records']}")
        print(f"Users created: {self.stats['processed_users']}")
        print(f"Consultant profiles: {self.stats['processed_consultants']}")
        print(f"Client profiles: {self.stats['processed_clients']}")
        print(f"Skills processed: {self.stats['processed_skills']}")
        print(f"Certifications processed: {self.stats['processed_certifications']}")
        print(f"Education records: {self.stats['processed_education']}")
        print(f"Portfolio records: {self.stats['processed_portfolio']}")
        print(f"Errors encountered: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print("\nERRORS:")
            for error in self.stats['errors'][:10]:  # Show first 10 errors
                print(f"  - {error}")
            if len(self.stats['errors']) > 10:
                print(f"  ... and {len(self.stats['errors']) - 10} more errors")

if __name__ == "__main__":
    etl = GigExecsETL()
    csv_file = "data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv"
    etl.migrate_data(csv_file) 