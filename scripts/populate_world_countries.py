#!/usr/bin/env python3
import json
from datetime import datetime
from pathlib import Path
from supabase import create_client
from typing import List

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

class WorldCountriesPopulator:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'countries_loaded': 0,
            'countries_inserted': 0,
            'countries_skipped': 0,
            'errors': []
        }

    def get_world_countries(self) -> List[str]:
        """Get a comprehensive list of all countries in the world"""
        return [
            "Afghanistan",
            "Albania",
            "Algeria",
            "Andorra",
            "Angola",
            "Antigua and Barbuda",
            "Argentina",
            "Armenia",
            "Australia",
            "Austria",
            "Azerbaijan",
            "Bahamas",
            "Bahrain",
            "Bangladesh",
            "Barbados",
            "Belarus",
            "Belgium",
            "Belize",
            "Benin",
            "Bhutan",
            "Bolivia",
            "Bosnia and Herzegovina",
            "Botswana",
            "Brazil",
            "Brunei",
            "Bulgaria",
            "Burkina Faso",
            "Burundi",
            "Cabo Verde",
            "Cambodia",
            "Cameroon",
            "Canada",
            "Central African Republic",
            "Chad",
            "Chile",
            "China",
            "Colombia",
            "Comoros",
            "Congo",
            "Costa Rica",
            "Croatia",
            "Cuba",
            "Cyprus",
            "Czech Republic",
            "Democratic Republic of the Congo",
            "Denmark",
            "Djibouti",
            "Dominica",
            "Dominican Republic",
            "Ecuador",
            "Egypt",
            "El Salvador",
            "Equatorial Guinea",
            "Eritrea",
            "Estonia",
            "Eswatini",
            "Ethiopia",
            "Fiji",
            "Finland",
            "France",
            "Gabon",
            "Gambia",
            "Georgia",
            "Germany",
            "Ghana",
            "Greece",
            "Grenada",
            "Guatemala",
            "Guinea",
            "Guinea-Bissau",
            "Guyana",
            "Haiti",
            "Honduras",
            "Hungary",
            "Iceland",
            "India",
            "Indonesia",
            "Iran",
            "Iraq",
            "Ireland",
            "Israel",
            "Italy",
            "Ivory Coast",
            "Jamaica",
            "Japan",
            "Jordan",
            "Kazakhstan",
            "Kenya",
            "Kiribati",
            "Kuwait",
            "Kyrgyzstan",
            "Laos",
            "Latvia",
            "Lebanon",
            "Lesotho",
            "Liberia",
            "Libya",
            "Liechtenstein",
            "Lithuania",
            "Luxembourg",
            "Madagascar",
            "Malawi",
            "Malaysia",
            "Maldives",
            "Mali",
            "Malta",
            "Marshall Islands",
            "Mauritania",
            "Mauritius",
            "Mexico",
            "Micronesia",
            "Moldova",
            "Monaco",
            "Mongolia",
            "Montenegro",
            "Morocco",
            "Mozambique",
            "Myanmar",
            "Namibia",
            "Nauru",
            "Nepal",
            "Netherlands",
            "New Zealand",
            "Nicaragua",
            "Niger",
            "Nigeria",
            "North Korea",
            "North Macedonia",
            "Norway",
            "Oman",
            "Pakistan",
            "Palau",
            "Palestine",
            "Panama",
            "Papua New Guinea",
            "Paraguay",
            "Peru",
            "Philippines",
            "Poland",
            "Portugal",
            "Qatar",
            "Romania",
            "Russia",
            "Rwanda",
            "Saint Kitts and Nevis",
            "Saint Lucia",
            "Saint Vincent and the Grenadines",
            "Samoa",
            "San Marino",
            "Sao Tome and Principe",
            "Saudi Arabia",
            "Senegal",
            "Serbia",
            "Seychelles",
            "Sierra Leone",
            "Singapore",
            "Slovakia",
            "Slovenia",
            "Solomon Islands",
            "Somalia",
            "South Africa",
            "South Korea",
            "South Sudan",
            "Spain",
            "Sri Lanka",
            "Sudan",
            "Suriname",
            "Sweden",
            "Switzerland",
            "Syria",
            "Taiwan",
            "Tajikistan",
            "Tanzania",
            "Thailand",
            "Timor-Leste",
            "Togo",
            "Tonga",
            "Trinidad and Tobago",
            "Tunisia",
            "Turkey",
            "Turkmenistan",
            "Tuvalu",
            "Uganda",
            "Ukraine",
            "United Arab Emirates",
            "United Kingdom",
            "United States of America",
            "Uruguay",
            "Uzbekistan",
            "Vanuatu",
            "Vatican City",
            "Venezuela",
            "Vietnam",
            "Yemen",
            "Zambia",
            "Zimbabwe"
        ]

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

    def populate_world_countries(self):
        """Populate the countries table with all world countries"""
        print("🌍 Populating countries table with all world countries...")
        
        # Check if table exists
        if not self.check_countries_table_exists():
            print("❌ Countries table doesn't exist. Please create it first.")
            print("💡 Run the SQL script in your Supabase dashboard:")
            print("   sql/create_countries_table.sql")
            return
        
        # Get world countries list
        countries = self.get_world_countries()
        self.stats['countries_loaded'] = len(countries)
        
        print(f"📖 Loaded {len(countries)} world countries")
        
        # Insert countries
        for i, country in enumerate(countries, 1):
            print(f"📝 Processing {i}/{len(countries)}: {country}")
            
            if self.insert_country(country):
                self.stats['countries_inserted'] += 1
            else:
                self.stats['countries_skipped'] += 1

    def save_countries_list(self, output_path: str = 'data/world_countries_list.json'):
        """Save the world countries list to a file"""
        countries = self.get_world_countries()
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(countries, file, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved world countries list to: {output_file}")

    def print_summary(self):
        """Print a summary of the population results"""
        print("\n📊 World Countries Population Summary:")
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
    populator = WorldCountriesPopulator()
    
    # Save the world countries list first
    populator.save_countries_list()
    
    # Populate countries table
    populator.populate_world_countries()
    
    # Print summary
    populator.print_summary()

if __name__ == "__main__":
    main() 