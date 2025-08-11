#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from typing import Set

def extract_countries():
    """Extract all unique countries from the CSV data"""
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    countries = set()
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            # Extract country from PublicData
            public_data_str = row.get('PublicData', '')
            if public_data_str and public_data_str != 'null':
                try:
                    public_data = json.loads(public_data_str)
                    
                    # Check for country in root level
                    if 'country' in public_data:
                        countries.add(public_data['country'])
                    
                    # Check for country in address
                    if 'address' in public_data and 'country' in public_data['address']:
                        countries.add(public_data['address']['country'])
                    
                    # Check for country in companyAddress
                    if 'companyAddress' in public_data and 'country' in public_data['companyAddress']:
                        countries.add(public_data['companyAddress']['country'])
                    
                    # Check for country in workExperience
                    if 'workExperience' in public_data:
                        for experience in public_data['workExperience']:
                            if 'country' in experience:
                                countries.add(experience['country'])
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass  # Silently skip parsing errors
            
            # Extract country from PrivateData
            private_data_str = row.get('PrivateData', '')
            if private_data_str and private_data_str != 'null':
                try:
                    private_data = json.loads(private_data_str)
                    
                    # Check for country in address
                    if 'address' in private_data and 'country' in private_data['address']:
                        countries.add(private_data['address']['country'])
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass  # Silently skip parsing errors
    
    # Convert to sorted list
    countries_list = sorted(list(countries))
    
    print(f"📊 Found {len(countries_list)} unique countries:")
    for i, country in enumerate(countries_list, 1):
        print(f"   {i:2d}. {country}")
    
    # Save to file
    output_file = Path('data/countries_list.json')
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(countries_list, file, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Saved countries list to: {output_file}")
    
    return countries_list

if __name__ == "__main__":
    extract_countries() 