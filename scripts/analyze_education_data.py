#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from typing import Dict, List, Any

def analyze_education_data():
    """Analyze education data in the CSV file"""
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🔍 Analyzing education data in CSV...")
    print("=" * 60)
    
    education_fields = {
        'public_data': set(),
        'private_data': set(),
        'protected_data': set()
    }
    
    education_samples = []
    total_records = 0
    records_with_education = 0
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            total_records += 1
            
            # Analyze PublicData
            public_data_str = row.get('PublicData', '')
            if public_data_str and public_data_str != 'null':
                try:
                    public_data = json.loads(public_data_str)
                    
                    # Check for formalEducation array
                    if 'formalEducation' in public_data:
                        records_with_education += 1
                        education = public_data['formalEducation']
                        
                        if education and len(education) > 0:
                            # Analyze first education entry
                            first_edu = education[0]
                            education_fields['public_data'].update(first_edu.keys())
                            
                            # Store sample for detailed analysis
                            if len(education_samples) < 5:
                                education_samples.append({
                                    'source': 'PublicData',
                                    'email': row.get('EmailAddress', ''),
                                    'data': first_edu
                                })
                        
                        # Check for other education-related fields
                        for key in public_data.keys():
                            if 'education' in key.lower() or 'degree' in key.lower() or 'school' in key.lower():
                                education_fields['public_data'].add(key)
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
            
            # Analyze PrivateData
            private_data_str = row.get('PrivateData', '')
            if private_data_str and private_data_str != 'null':
                try:
                    private_data = json.loads(private_data_str)
                    
                    # Check for education-related fields
                    for key in private_data.keys():
                        if 'education' in key.lower() or 'degree' in key.lower() or 'school' in key.lower():
                            education_fields['private_data'].add(key)
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
            
            # Analyze ProtectedData
            protected_data_str = row.get('ProtectedData', '')
            if protected_data_str and protected_data_str != 'null':
                try:
                    protected_data = json.loads(protected_data_str)
                    
                    # Check for education-related fields
                    for key in protected_data.keys():
                        if 'education' in key.lower() or 'degree' in key.lower() or 'school' in key.lower():
                            education_fields['protected_data'].add(key)
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
    
    print(f"📊 Education Data Analysis Summary:")
    print(f"   Total records processed: {total_records}")
    print(f"   Records with education data: {records_with_education}")
    print(f"   Education coverage: {(records_with_education/total_records)*100:.1f}%")
    
    print(f"\n📋 Education fields found:")
    print(f"   PublicData: {sorted(education_fields['public_data'])}")
    print(f"   PrivateData: {sorted(education_fields['private_data'])}")
    print(f"   ProtectedData: {sorted(education_fields['protected_data'])}")
    
    print(f"\n📋 Sample education entries:")
    for i, sample in enumerate(education_samples):
        print(f"\n--- Sample {i+1} ---")
        print(f"Email: {sample['email']}")
        print(f"Source: {sample['source']}")
        print(f"Fields: {list(sample['data'].keys())}")
        
        # Show the actual data
        for key, value in sample['data'].items():
            if isinstance(value, str) and len(value) > 100:
                print(f"   {key}: {value[:100]}...")
            else:
                print(f"   {key}: {value}")
    
    print(f"\n" + "=" * 60)
    print(f"🎯 Education Table Mapping:")
    print(f"   CSV field → Database field")
    print(f"   institution → institution_name")
    print(f"   degree → degree_level")
    print(f"   grade → grade")
    print(f"   startDate → start_date")
    print(f"   endDate → end_date")
    print(f"   description → description")
    print(f"   proofOfFormalEducation → file_url")
    
    print(f"\n✅ Analysis completed!")

if __name__ == "__main__":
    analyze_education_data() 