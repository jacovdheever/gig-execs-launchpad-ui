#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_database_users():
    """Check how many users exist in the database"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        result = supabase.table('users').select('id, email').limit(5).execute()
        print(f"📊 Database users found: {len(result.data)}")
        for user in result.data:
            print(f"   • {user['id']} - {user['email']}")
    except Exception as e:
        print(f"❌ Error checking database users: {e}")

def check_skill_extraction():
    """Check if skills are being extracted properly from CSV"""
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print(f"📖 Checking skill extraction from CSV...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        users_with_skills = 0
        total_records = 0
        
        for row in reader:
            total_records += 1
            
            # Extract skills from PublicData
            public_data = row.get('PublicData', '')
            if public_data and public_data != 'null':
                try:
                    data = json.loads(public_data)
                    if 'skills' in data and isinstance(data['skills'], list):
                        users_with_skills += 1
                        if users_with_skills <= 3:  # Show first 3 examples
                            print(f"   User {row.get('Id', 'N/A')} has {len(data['skills'])} skills")
                            for skill in data['skills'][:3]:  # Show first 3 skills
                                print(f"     • {skill}")
                            if len(data['skills']) > 3:
                                print(f"     ... and {len(data['skills']) - 3} more")
                except (json.JSONDecodeError, KeyError, TypeError):
                    pass
        
        print(f"📊 CSV Analysis:")
        print(f"   Total records: {total_records}")
        print(f"   Users with skills: {users_with_skills}")

def check_skill_mapping():
    """Check if skill mapping is working"""
    mapping_file = Path('data/skill_id_mapping.json')
    
    if not mapping_file.exists():
        print(f"❌ Skill mapping file not found")
        return
    
    with open(mapping_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
        skill_mapping = data.get('skill_id_mapping', {})
        
        print(f"📊 Skill Mapping Analysis:")
        print(f"   Total skill mappings: {len(skill_mapping)}")
        
        # Show some sample mappings
        sample_skills = list(skill_mapping.keys())[:5]
        for skill in sample_skills:
            skill_id = skill_mapping[skill]
            print(f"   • {skill} -> {skill_id}")

def main():
    print("🔍 Debugging User Skills Migration...\n")
    
    # Check database users
    print("1. Checking database users:")
    check_database_users()
    print()
    
    # Check skill extraction
    print("2. Checking skill extraction:")
    check_skill_extraction()
    print()
    
    # Check skill mapping
    print("3. Checking skill mapping:")
    check_skill_mapping()
    print()

if __name__ == "__main__":
    main() 