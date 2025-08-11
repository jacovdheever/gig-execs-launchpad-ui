#!/usr/bin/env python3
import csv
import json
import sys
from pathlib import Path

def analyze_csv(file_path):
    """Analyze the CSV file structure and data"""
    print(f"Analyzing CSV file: {file_path}")
    print("=" * 50)
    
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        rows = list(reader)
        
    print(f"Total records: {len(rows)}")
    print(f"Columns: {list(rows[0].keys())}")
    print("\n" + "=" * 50)
    
    # Analyze first few records
    for i, row in enumerate(rows[:3]):
        print(f"\n--- Record {i+1} ---")
        print(f"ID: {row['Id']}")
        print(f"Name: {row['FirstName']} {row['LastName']}")
        print(f"Email: {row['EmailAddress']}")
        print(f"Account Type: {row.get('PublicData', 'N/A')}")
        print(f"State: {row['State']}")
        
        # Try to parse JSON data
        try:
            if row['PublicData']:
                public_data = json.loads(row['PublicData'])
                print(f"Public Data Keys: {list(public_data.keys())}")
                
                if 'accountType' in public_data:
                    print(f"Account Type: {public_data['accountType']}")
                
                if 'skills' in public_data:
                    print(f"Skills Count: {len(public_data['skills'])}")
                    print(f"Sample Skills: {public_data['skills'][:3]}")
                
                if 'certifications' in public_data:
                    print(f"Certifications Count: {len(public_data['certifications'])}")
                
                if 'formalEducation' in public_data:
                    print(f"Education Count: {len(public_data['formalEducation'])}")
                
                if 'workExperience' in public_data:
                    print(f"Work Experience Count: {len(public_data['workExperience'])}")
                
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
        
        try:
            if row['ProtectedData']:
                protected_data = json.loads(row['ProtectedData'])
                print(f"Protected Data Keys: {list(protected_data.keys())}")
        except json.JSONDecodeError as e:
            print(f"Protected Data JSON Parse Error: {e}")
    
    # Analyze account types
    account_types = {}
    for row in rows:
        try:
            if row['PublicData']:
                public_data = json.loads(row['PublicData'])
                account_type = public_data.get('accountType', 'unknown')
                account_types[account_type] = account_types.get(account_type, 0) + 1
        except:
            pass
    
    print(f"\nAccount Type Distribution:")
    for account_type, count in account_types.items():
        print(f"  {account_type}: {count}")

if __name__ == "__main__":
    csv_file = "data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv"
    analyze_csv(csv_file) 