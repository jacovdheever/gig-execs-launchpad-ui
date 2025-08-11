#!/usr/bin/env python3
import json
import uuid
from pathlib import Path
from supabase import create_client
from typing import List, Dict, Any

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

class SkillsTablePopulator:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'skills_processed': 0,
            'skills_inserted': 0,
            'skills_skipped': 0,
            'errors': []
        }
        self.skill_id_mapping = {}  # Map skill name to skill ID

    def load_extracted_skills(self, file_path: str = 'data/extracted_skills.json') -> List[str]:
        """Load the extracted skills from the JSON file"""
        skills_file = Path(file_path)
        
        if not skills_file.exists():
            print(f"❌ Skills file not found: {file_path}")
            return []
        
        with open(skills_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
            skills = data.get('unique_skills', [])
            print(f"📖 Loaded {len(skills)} unique skills from {file_path}")
            return skills

    def check_existing_skills(self) -> Dict[str, str]:
        """Check what skills already exist in the database"""
        try:
            result = self.supabase.table('skills').select('id, name').execute()
            existing_skills = {}
            for skill in result.data:
                if skill.get('name'):
                    existing_skills[skill['name']] = skill['id']
            
            print(f"📊 Found {len(existing_skills)} existing skills in database")
            return existing_skills
        except Exception as e:
            print(f"❌ Error checking existing skills: {e}")
            return {}

    def insert_skill(self, skill_name: str) -> str:
        """Insert a single skill and return its ID"""
        try:
            # Let the database auto-generate the ID
            skill_data = {
                'name': skill_name
            }
            
            result = self.supabase.table('skills').insert(skill_data).execute()
            
            if result.data:
                skill_id = result.data[0]['id']
                print(f"✅ Inserted skill: {skill_name} (ID: {skill_id})")
                return skill_id
            else:
                print(f"⚠️  No data returned for skill: {skill_name}")
                return None
                
        except Exception as e:
            error_msg = f"Error inserting skill '{skill_name}': {e}"
            print(f"❌ {error_msg}")
            self.stats['errors'].append(error_msg)
            return None

    def populate_skills_table(self, skills: List[str]):
        """Populate the skills table with all unique skills"""
        print(f"🚀 Starting skills table population...")
        
        # Check existing skills
        existing_skills = self.check_existing_skills()
        
        for skill_name in skills:
            self.stats['skills_processed'] += 1
            
            # Skip if skill already exists
            if skill_name in existing_skills:
                self.skill_id_mapping[skill_name] = existing_skills[skill_name]
                self.stats['skills_skipped'] += 1
                continue
            
            # Insert new skill
            skill_id = self.insert_skill(skill_name)
            if skill_id:
                self.skill_id_mapping[skill_name] = skill_id
                self.stats['skills_inserted'] += 1
            else:
                self.stats['skills_skipped'] += 1

    def save_skill_mapping(self, output_path: str = 'data/skill_id_mapping.json'):
        """Save the skill name to ID mapping for use in user_skills migration"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        data = {
            'stats': self.stats,
            'skill_id_mapping': self.skill_id_mapping
        }
        
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved skill ID mapping to: {output_file}")

    def print_summary(self):
        """Print a summary of the population results"""
        print("\n📊 Skills Table Population Summary:")
        print(f"   Skills processed: {self.stats['skills_processed']}")
        print(f"   Skills inserted: {self.stats['skills_inserted']}")
        print(f"   Skills skipped (already exist): {self.stats['skills_skipped']}")
        print(f"   Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n❌ Errors encountered:")
            for error in self.stats['errors'][:5]:  # Show first 5 errors
                print(f"   • {error}")
            if len(self.stats['errors']) > 5:
                print(f"   ... and {len(self.stats['errors']) - 5} more")

def main():
    populator = SkillsTablePopulator()
    
    # Load extracted skills
    skills = populator.load_extracted_skills()
    
    if not skills:
        print("❌ No skills to process")
        return
    
    # Populate the skills table
    populator.populate_skills_table(skills)
    
    # Save the mapping
    populator.save_skill_mapping()
    
    # Print summary
    populator.print_summary()

if __name__ == "__main__":
    main() 