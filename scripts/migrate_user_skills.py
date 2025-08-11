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

class UserSkillsMigration:
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
        self.user_id_mapping = {}

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

    def load_user_id_mapping(self, file_path: str = 'data/user_id_mapping.json'):
        """Load the user ID mapping from the original migration"""
        mapping_file = Path(file_path)
        
        if not mapping_file.exists():
            print(f"⚠️  User ID mapping file not found: {file_path}")
            print("   Will generate UUIDs for users as needed")
            return False
        
        with open(mapping_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
            self.user_id_mapping = data.get('user_id_mapping', {})
            print(f"📖 Loaded {len(self.user_id_mapping)} user ID mappings")
            return True

    def generate_uuid(self, csv_id: str) -> str:
        """Generate a consistent UUID for a CSV ID"""
        # Use a hash of the CSV ID to generate a consistent UUID
        import hashlib
        hash_object = hashlib.md5(csv_id.encode())
        hash_hex = hash_object.hexdigest()
        
        # Convert to UUID format
        uuid_str = f"{hash_hex[:8]}-{hash_hex[8:12]}-{hash_hex[12:16]}-{hash_hex[16:20]}-{hash_hex[20:32]}"
        return uuid_str

    def get_user_id_from_email(self, email: str) -> Optional[str]:
        """Get the user ID from the database using email"""
        try:
            result = self.supabase.table('users').select('id').eq('email', email).execute()
            if result.data:
                return result.data[0]['id']
        except Exception as e:
            print(f"❌ Error looking up user by email: {e}")
        return None

    def get_user_id(self, csv_id: str, email: str) -> Optional[str]:
        """Get the user ID for a CSV ID"""
        # First try to find user by email in the database
        user_id = self.get_user_id_from_email(email)
        if user_id:
            return user_id
        
        # If not found by email, try the mapping
        if csv_id in self.user_id_mapping:
            return self.user_id_mapping[csv_id]
        
        # If not in mapping, generate a UUID
        return self.generate_uuid(csv_id)

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

    def migrate_user_skills(self, csv_path: str):
        """Migrate user skills from CSV to database"""
        csv_file = Path(csv_path)
        
        if not csv_file.exists():
            print(f"❌ CSV file not found: {csv_path}")
            return
        
        print(f"📖 Processing CSV file: {csv_path}")
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                self.stats['total_records'] += 1
                
                # Get user ID
                csv_id = row.get('Id', '')
                email = row.get('EmailAddress', '') # EmailAddress column in CSV
                user_id = self.get_user_id(csv_id, email)
                
                # Check if user exists in database
                if not self.check_user_exists(user_id):
                    continue  # Skip if user doesn't exist
                
                # Extract skills from PublicData
                skills = self.extract_skills_from_public_data(row.get('PublicData', ''))
                
                if skills:
                    self.stats['users_with_skills'] += 1
                    self.stats['skills_processed'] += len(skills)
                    
                    # Process each skill
                    for skill_name in skills:
                        skill_data = self.transform_user_skill(user_id, skill_name)
                        
                        if skill_data:
                            try:
                                # Insert user skill
                                result = self.supabase.table('user_skills').insert(skill_data).execute()
                                
                                if result.data:
                                    self.stats['user_skills_inserted'] += 1
                                else:
                                    error_msg = f"No data returned for user skill: {user_id} - {skill_name}"
                                    self.stats['errors'].append(error_msg)
                                    
                            except Exception as e:
                                error_msg = str(e)
                                # Check if it's a duplicate key error (expected)
                                if 'duplicate key value violates unique constraint' in error_msg:
                                    # This is expected - skill already exists for this user
                                    pass
                                else:
                                    # This is an unexpected error
                                    full_error_msg = f"Error inserting user skill {skill_name} for user {user_id}: {e}"
                                    self.stats['errors'].append(full_error_msg)

    def save_migration_stats(self, output_path: str = 'data/user_skills_migration_stats.json'):
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
        print("\n📊 User Skills Migration Summary:")
        print(f"   Total records processed: {self.stats['total_records']}")
        print(f"   Users with skills: {self.stats['users_with_skills']}")
        print(f"   Skills processed: {self.stats['skills_processed']}")
        print(f"   User skills inserted: {self.stats['user_skills_inserted']}")
        print(f"   Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n❌ Sample errors encountered:")
            for error in self.stats['errors'][:5]:  # Show first 5 errors
                print(f"   • {error}")
            if len(self.stats['errors']) > 5:
                print(f"   ... and {len(self.stats['errors']) - 5} more")

def main():
    migrator = UserSkillsMigration()
    
    # Load skill mapping
    if not migrator.load_skill_mapping():
        print("❌ Failed to load skill mapping")
        return
    
    # Load user ID mapping (optional)
    migrator.load_user_id_mapping()
    
    # Migrate user skills
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    migrator.migrate_user_skills(csv_path)
    
    # Save stats
    migrator.save_migration_stats()
    
    # Print summary
    migrator.print_summary()

if __name__ == "__main__":
    main() 