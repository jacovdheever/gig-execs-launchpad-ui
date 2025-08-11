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

class TestUserSkillsMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'total_records': 0,
            'users_with_skills': 0,
            'skills_processed': 0,
            'user_skills_inserted': 0,
            'errors': []
        }
        self.skill_id_mapping = {}

    def load_skill_mapping(self, file_path: str = 'data/skill_id_mapping.json'):
        """Load the skill name to ID mapping"""
        mapping_file = Path(file_path)
        
        if not mapping_file.exists():
            print(f"❌ Skill mapping file not found: {file_path}")
            return False
        
        with open(mapping_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
            self.skill_id_mapping = data.get('skill_id_mapping', {})
            print(f"📖 Loaded {len(self.skill_id_mapping)} skill mappings")
            return True

    def get_user_id_from_email(self, email: str) -> Optional[str]:
        """Get the user ID from the database using email"""
        try:
            result = self.supabase.table('users').select('id').eq('email', email).execute()
            if result.data:
                return result.data[0]['id']
        except Exception as e:
            print(f"❌ Error looking up user by email: {e}")
        return None

    def check_user_exists(self, user_id: str) -> bool:
        """Check if a user exists in the database"""
        try:
            result = self.supabase.table('users').select('id').eq('id', user_id).execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"❌ Error checking if user exists: {e}")
            return False

    def process_skill_entry(self, skill_entry: str) -> List[str]:
        """Process a single skill entry, handling complex cases"""
        skills = []
        
        # Remove quotes and clean
        skill_entry = skill_entry.strip().strip('"')
        
        # Handle programming languages pattern
        if ':' in skill_entry and any(lang in skill_entry.lower() for lang in ['html', 'css', 'javascript', 'python', 'java']):
            # Extract the main skill category
            main_skill = skill_entry.split(':')[0].strip()
            skills.append(main_skill)
            
            # Extract individual languages
            languages_part = skill_entry.split(':')[1].strip()
            languages = [lang.strip() for lang in languages_part.split(',')]
            skills.extend(languages)
        else:
            # Regular skill
            skills.append(skill_entry)
        
        return skills

    def extract_skills_from_public_data(self, public_data_str: str) -> List[str]:
        """Extract skills from PublicData JSON string"""
        if not public_data_str or public_data_str == 'null':
            return []
        
        try:
            data = json.loads(public_data_str)
            if 'skills' in data and isinstance(data['skills'], list):
                all_skills = []
                for skill in data['skills']:
                    if isinstance(skill, str):
                        # Process complex skill entries
                        processed_skills = self.process_skill_entry(skill)
                        all_skills.extend(processed_skills)
                return all_skills
        except (json.JSONDecodeError, KeyError, TypeError):
            pass
        
        return []

    def transform_user_skill(self, user_id: str, skill_name: str) -> Optional[Dict[str, Any]]:
        """Transform a user skill to the target format"""
        # Get the skill ID from the mapping
        skill_id = self.skill_id_mapping.get(skill_name)
        
        if not skill_id:
            print(f"⚠️  No skill ID found for skill: {skill_name}")
            return None
        
        return {
            'user_id': user_id,
            'skill_id': skill_id
        }

    def test_single_record(self, csv_path: str):
        """Test migration with just 1 record that has skills"""
        csv_file = Path(csv_path)
        
        if not csv_file.exists():
            print(f"❌ CSV file not found: {csv_path}")
            return
        
        print(f"🧪 Testing with 1 record that has skills from: {csv_path}")
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            # Find a record with skills
            for row in reader:
                self.stats['total_records'] += 1
                
                # Get user details
                csv_id = row.get('Id', '')
                email = row.get('EmailAddress', '')
                
                # Extract skills from PublicData
                skills = self.extract_skills_from_public_data(row.get('PublicData', ''))
                
                if not skills:
                    continue  # Skip records without skills
                
                print(f"\n📋 Processing record {self.stats['total_records']}:")
                print(f"   CSV ID: {csv_id}")
                print(f"   Email: {email}")
                
                # Get user ID from database
                user_id = self.get_user_id_from_email(email)
                
                if not user_id:
                    print(f"   ❌ User not found in database for email: {email}")
                    print(f"   📝 This user has {len(skills)} skills but isn't in the database")
                    print(f"   Sample skills:")
                    for skill in skills[:3]:
                        print(f"     • {skill}")
                    break
                
                print(f"   ✅ Found user in database: {user_id}")
                
                print(f"   📝 Found {len(skills)} skills:")
                for skill in skills[:5]:  # Show first 5 skills
                    print(f"     • {skill}")
                if len(skills) > 5:
                    print(f"     ... and {len(skills) - 5} more")
                
                self.stats['users_with_skills'] += 1
                self.stats['skills_processed'] += len(skills)
                
                # Process each skill
                skills_inserted = 0
                for skill_name in skills:
                    skill_data = self.transform_user_skill(user_id, skill_name)
                    
                    if skill_data:
                        try:
                            # Insert user skill
                            result = self.supabase.table('user_skills').insert(skill_data).execute()
                            
                            if result.data:
                                skills_inserted += 1
                                print(f"   ✅ Inserted skill: {skill_name}")
                            else:
                                error_msg = f"No data returned for user skill: {user_id} - {skill_name}"
                                self.stats['errors'].append(error_msg)
                                print(f"   ❌ {error_msg}")
                                
                        except Exception as e:
                            error_msg = f"Error inserting user skill {skill_name} for user {user_id}: {e}"
                            self.stats['errors'].append(error_msg)
                            print(f"   ❌ {error_msg}")
                
                print(f"\n📊 Test Results:")
                print(f"   Skills processed: {len(skills)}")
                print(f"   Skills inserted: {skills_inserted}")
                print(f"   Errors: {len(self.stats['errors'])}")
                
                # Only process 1 record
                break

    def print_summary(self):
        """Print a summary of the test results"""
        print("\n📊 Test Migration Summary:")
        print(f"   Total records processed: {self.stats['total_records']}")
        print(f"   Users with skills: {self.stats['users_with_skills']}")
        print(f"   Skills processed: {self.stats['skills_processed']}")
        print(f"   User skills inserted: {self.stats['user_skills_inserted']}")
        print(f"   Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n❌ Errors encountered:")
            for error in self.stats['errors']:
                print(f"   • {error}")

def main():
    migrator = TestUserSkillsMigration()
    
    # Load skill mapping
    if not migrator.load_skill_mapping():
        print("❌ Failed to load skill mapping")
        return
    
    # Test with single record
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    migrator.test_single_record(csv_path)
    
    # Print summary
    migrator.print_summary()

if __name__ == "__main__":
    main() 