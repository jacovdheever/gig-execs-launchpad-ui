#!/usr/bin/env python3
import csv
import json
from pathlib import Path

def debug_client_data():
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for i, row in enumerate(reader):
            public_data_str = row.get('PublicData', '')
            
            if public_data_str and 'companyName' in public_data_str:
                print(f"\n📋 Record {i+1} with company data:")
                print(f"   Email: {row.get('EmailAddress', '')}")
                print(f"   PublicData: {public_data_str[:200]}...")
                
                try:
                    public_data = json.loads(public_data_str)
                    print(f"   Parsed JSON keys: {list(public_data.keys())}")
                    
                    if 'companyName' in public_data:
                        print(f"   Company Name: {public_data['companyName']}")
                        print(f"   Industry: {public_data.get('industry', 'N/A')}")
                        print(f"   Website: {public_data.get('website', 'N/A')}")
                        print(f"   Organization Type: {public_data.get('organizationType', 'N/A')}")
                        print(f"   Country: {public_data.get('country', 'N/A')}")
                        
                        # Check if this user exists in database
                        email = row.get('EmailAddress', '')
                        print(f"   Email for DB lookup: {email}")
                        
                        break  # Only process first record with company data
                        
                except Exception as e:
                    print(f"   ❌ Error parsing JSON: {e}")
                    continue

if __name__ == "__main__":
    debug_client_data() 