#!/usr/bin/env python3
import json
from datetime import datetime
from pathlib import Path
from supabase import create_client
from typing import List

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

class CountriesTablePopulator:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'countries_loaded': 0,
            'countries_inserted': 0,
            'countries_skipped': 0,
            'errors': []
        }

    def load_countries_list(self, file_path: str = 'data/countries_list.json') -> List[str]:
        """Load the countries list from JSON file"""
        countries_file = Path(file_path)
        
        if not countries_file.exists():
            print(f"❌ Countries file not found: {file_path}")
            return []
        
        with open(countries_file, 'r', encoding='utf-8') as file:
            countries = json.load(file)
        
        self.stats['countries_loaded'] = len(countries)
        return countries

    def check_countries_table_exists(self) -> bool:
        """Check if the countries table exists"""
        try:
            result = self.supabase.table('countries').select('id').limit(1).execute()
            return True
        except Exception as e:
            print(f"⚠️  Countries table doesn't exist or is not accessible: {e}")
            return False

    def insert_country(self, country_name: str) -> bool:
        """Insert a single country"""
        try:
            country_data = {
                'name': country_name,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            result = self.supabase.table('countries').insert(country_data).execute()
            
            if result.data:
                print(f"✅ Inserted country: {country_name}")
                return True
            else:
                print(f"⚠️  No data returned for country: {country_name}")
                return False
                
        except Exception as e:
            error_msg = f"Error inserting country '{country_name}': {e}"
            print(f"❌ {error_msg}")
            self.stats['errors'].append(error_msg)
            return False

    def populate_countries_table(self):
        """Populate the countries table with the extracted countries"""
        print("🌍 Populating countries table...")
        
        # Check if table exists
        if not self.check_countries_table_exists():
            print("❌ Countries table doesn't exist. Please create it first.")
            return
        
        # Load countries list
        countries = self.load_countries_list()
        
        if not countries:
            print("❌ No countries to insert")
            return
        
        print(f"📖 Loaded {len(countries)} countries from file")
        
        # Insert countries
        for country in countries:
            if self.insert_country(country):
                self.stats['countries_inserted'] += 1
            else:
                self.stats['countries_skipped'] += 1

    def print_summary(self):
        """Print a summary of the population results"""
        print("\n📊 Countries Table Population Summary:")
        print(f"   Countries loaded: {self.stats['countries_loaded']}")
        print(f"   Countries inserted: {self.stats['countries_inserted']}")
        print(f"   Countries skipped: {self.stats['countries_skipped']}")
        print(f"   Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n❌ Sample errors encountered:")
            for error in self.stats['errors'][:5]:  # Show first 5 errors
                print(f"   • {error}")
            if len(self.stats['errors']) > 5:
                print(f"   ... and {len(self.stats['errors']) - 5} more")

def main():
    populator = CountriesTablePopulator()
    
    # Populate countries table
    populator.populate_countries_table()
    
    # Print summary
    populator.print_summary()

if __name__ == "__main__":
    main() 