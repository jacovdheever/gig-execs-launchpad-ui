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

class UserLanguagesMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'total_records': 0,
            'languages_processed': 0,
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

    def transform_language(self, row: Dict[str, Any], language_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform language data"""
        user_uuid = self.generate_uuid(row['Id'])
        
        # Map language codes to IDs (you may need to adjust these based on your languages table)
        language_id_map = {
            'en': 1, 'fr': 2, 'es': 3, 'de': 4, 'it': 5, 'pt': 6, 'ru': 7, 'zh': 8, 'ja': 9, 'hi': 10,
            'ar': 11, 'nl': 12, 'tr': 13, 'german': 4, 'english': 1, 'french': 2, 'spanish': 3
        }
        
        # Map proficiency levels to allowed values
        proficiency_map = {
            'beginner': 'native',
            'intermediate': 'native', 
            'advanced': 'native',
            'native': 'native',
            'fluent': 'native',
            'motherLanguage': 'native'
        }
        
        language_code = language_data.get('language', '')
        language_id = language_id_map.get(language_code.lower(), 1)  # Default to English (1)
        
        original_proficiency = language_data.get('proficiency', 'intermediate')
        # Handle None proficiency values
        if original_proficiency is None:
            original_proficiency = 'intermediate'
        proficiency = proficiency_map.get(original_proficiency.lower(), 'native')
        
        return {
            'user_id': user_uuid,
            'language_id': language_id,
            'proficiency': proficiency
        }

    def user_exists(self, user_uuid: str) -> bool:
        """Check if a user exists in the database"""
        try:
            result = self.supabase.table('users').select('id').eq('id', user_uuid).execute()
            return len(result.data) > 0
        except:
            return False

    def migrate_user_languages(self):
        """Migrate only user languages data"""
        csv_file = Path('data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv')
        
        print(f"Starting user languages migration from {csv_file}")
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
                
                # Check if user exists in database
                user_uuid = self.generate_uuid(row['Id'])
                if not self.user_exists(user_uuid):
                    print(f"  Skipping user not in database: {row['EmailAddress']}")
                    continue
                
                # Parse public data
                try:
                    public_data = json.loads(row['PublicData']) if row['PublicData'] else {}
                except:
                    public_data = {}
                
                # Ensure public_data is always a dictionary
                if public_data is None:
                    public_data = {}
                
                # Process languages
                if public_data.get('languages'):
                    for language in public_data['languages']:
                        language_data = self.transform_language(row, language)
                        try:
                            self.supabase.table('user_languages').upsert(language_data).execute()
                            self.stats['languages_processed'] += 1
                            print(f"  ✅ Added language: {language.get('language', 'unknown')}")
                        except Exception as e:
                            error_msg = f"Error inserting language {language.get('language', 'unknown')} for {row['EmailAddress']}: {e}"
                            self.stats['errors'].append(error_msg)
                            print(f"  ❌ {error_msg}")

        # Print final statistics
        print("\n" + "=" * 60)
        print("USER LANGUAGES MIGRATION STATISTICS")
        print("=" * 60)
        print(f"Total records processed: {self.stats['total_records']}")
        print(f"Languages processed: {self.stats['languages_processed']}")
        print(f"Errors encountered: {len(self.stats['errors'])}")

        if self.stats['errors']:
            print(f"\nERRORS:")
            for error in self.stats['errors'][:10]:  # Show first 10 errors
                print(f"  - {error}")
            if len(self.stats['errors']) > 10:
                print(f"  ... and {len(self.stats['errors']) - 10} more errors")

if __name__ == "__main__":
    migration = UserLanguagesMigration()
    migration.migrate_user_languages() 