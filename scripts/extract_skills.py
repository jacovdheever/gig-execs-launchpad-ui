#!/usr/bin/env python3
import csv
import json
import re
from pathlib import Path
from typing import Set, List, Dict, Any

class SkillsExtractor:
    def __init__(self):
        self.all_skills = set()
        self.skills_by_user = {}
        self.stats = {
            'total_records': 0,
            'records_with_skills': 0,
            'total_skills_found': 0,
            'unique_skills': 0
        }

    def extract_skills_from_text(self, skill_text: str) -> List[str]:
        """Extract individual skills from complex skill descriptions"""
        skills = []
        
        # Handle skills separated by commas
        if ',' in skill_text:
            # Split by comma and clean each skill
            raw_skills = skill_text.split(',')
            for skill in raw_skills:
                skill = skill.strip()
                if skill:
                    skills.append(skill)
        else:
            # Single skill
            skills.append(skill_text.strip())
        
        return skills

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

    def extract_from_public_data(self, public_data_str: str) -> List[str]:
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

    def process_csv(self, csv_path: str):
        """Process the CSV file and extract all skills"""
        csv_file = Path(csv_path)
        
        if not csv_file.exists():
            print(f"❌ CSV file not found: {csv_path}")
            return
        
        print(f"📖 Processing CSV file: {csv_path}")
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                self.stats['total_records'] += 1
                
                # Extract skills from PublicData
                skills = self.extract_from_public_data(row.get('PublicData', ''))
                
                if skills:
                    self.stats['records_with_skills'] += 1
                    self.stats['total_skills_found'] += len(skills)
                    
                    # Store skills for this user
                    user_id = row.get('Id', '')
                    self.skills_by_user[user_id] = skills
                    
                    # Add to global set
                    for skill in skills:
                        self.all_skills.add(skill)
        
        self.stats['unique_skills'] = len(self.all_skills)

    def save_skills_to_file(self, output_path: str = 'data/extracted_skills.json'):
        """Save extracted skills to a JSON file"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        skills_list = sorted(list(self.all_skills))
        
        data = {
            'stats': self.stats,
            'unique_skills': skills_list,
            'skills_by_user': self.skills_by_user
        }
        
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved extracted skills to: {output_file}")
        return skills_list

    def print_summary(self):
        """Print a summary of the extraction results"""
        print("\n📊 Skills Extraction Summary:")
        print(f"   Total records processed: {self.stats['total_records']}")
        print(f"   Records with skills: {self.stats['records_with_skills']}")
        print(f"   Total skills found: {self.stats['total_skills_found']}")
        print(f"   Unique skills: {self.stats['unique_skills']}")
        
        if self.all_skills:
            print(f"\n🔍 Sample unique skills:")
            sample_skills = sorted(list(self.all_skills))[:10]
            for skill in sample_skills:
                print(f"   • {skill}")
            
            if len(self.all_skills) > 10:
                print(f"   ... and {len(self.all_skills) - 10} more")

def main():
    extractor = SkillsExtractor()
    
    # Process the CSV file
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    extractor.process_csv(csv_path)
    
    # Save results
    skills_list = extractor.save_skills_to_file()
    
    # Print summary
    extractor.print_summary()
    
    return skills_list

if __name__ == "__main__":
    main() 