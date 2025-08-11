#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from typing import Dict, List, Any

def analyze_work_experience():
    """Analyze work experience fields in the CSV data"""
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🔍 Analyzing work experience fields in CSV data...")
    print("=" * 60)
    
    work_experience_fields = {
        'public_data': set(),
        'private_data': set(),
        'protected_data': set()
    }
    
    work_experience_samples = []
    total_records = 0
    records_with_work_experience = 0
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            total_records += 1
            
            # Analyze PublicData
            public_data_str = row.get('PublicData', '')
            if public_data_str and public_data_str != 'null':
                try:
                    public_data = json.loads(public_data_str)
                    
                    # Check for workExperience array
                    if 'workExperience' in public_data:
                        records_with_work_experience += 1
                        work_experience = public_data['workExperience']
                        
                        if work_experience and len(work_experience) > 0:
                            # Analyze first work experience entry
                            first_exp = work_experience[0]
                            work_experience_fields['public_data'].update(first_exp.keys())
                            
                            # Store sample for detailed analysis
                            if len(work_experience_samples) < 3:
                                work_experience_samples.append({
                                    'source': 'PublicData',
                                    'data': first_exp
                                })
                        
                        # Check for other work-related fields
                        for key in public_data.keys():
                            if 'work' in key.lower() or 'experience' in key.lower() or 'job' in key.lower():
                                work_experience_fields['public_data'].add(key)
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
            
            # Analyze PrivateData
            private_data_str = row.get('PrivateData', '')
            if private_data_str and private_data_str != 'null':
                try:
                    private_data = json.loads(private_data_str)
                    
                    # Check for work-related fields
                    for key in private_data.keys():
                        if 'work' in key.lower() or 'experience' in key.lower() or 'job' in key.lower():
                            work_experience_fields['private_data'].add(key)
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
            
            # Analyze ProtectedData
            protected_data_str = row.get('ProtectedData', '')
            if protected_data_str and protected_data_str != 'null':
                try:
                    protected_data = json.loads(protected_data_str)
                    
                    # Check for work-related fields
                    for key in protected_data.keys():
                        if 'work' in key.lower() or 'experience' in key.lower() or 'job' in key.lower():
                            work_experience_fields['protected_data'].add(key)
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
    
    # Print analysis results
    print(f"📊 Analysis Results:")
    print(f"   Total records processed: {total_records}")
    print(f"   Records with work experience: {records_with_work_experience}")
    print(f"   Percentage with work experience: {(records_with_work_experience/total_records)*100:.1f}%")
    
    print(f"\n🔍 Work Experience Fields Found:")
    
    if work_experience_fields['public_data']:
        print(f"\n📋 PublicData work experience fields:")
        for field in sorted(work_experience_fields['public_data']):
            print(f"   • {field}")
    
    if work_experience_fields['private_data']:
        print(f"\n🔒 PrivateData work experience fields:")
        for field in sorted(work_experience_fields['private_data']):
            print(f"   • {field}")
    
    if work_experience_fields['protected_data']:
        print(f"\n🛡️  ProtectedData work experience fields:")
        for field in sorted(work_experience_fields['protected_data']):
            print(f"   • {field}")
    
    # Show detailed samples
    if work_experience_samples:
        print(f"\n📝 Sample Work Experience Entries:")
        for i, sample in enumerate(work_experience_samples, 1):
            print(f"\n--- Sample {i} ({sample['source']}) ---")
            for key, value in sample['data'].items():
                print(f"   {key}: {value}")
    
    # Check for specific work experience patterns
    print(f"\n🔍 Looking for specific work experience patterns...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            public_data_str = row.get('PublicData', '')
            if public_data_str and public_data_str != 'null':
                try:
                    public_data = json.loads(public_data_str)
                    
                    if 'workExperience' in public_data and public_data['workExperience']:
                        work_exp = public_data['workExperience'][0]  # First entry
                        
                        print(f"\n📋 Work Experience Structure Analysis:")
                        print(f"   Common fields found in workExperience entries:")
                        
                        # Analyze structure of work experience entries
                        structure_analysis = {}
                        for exp in public_data['workExperience'][:5]:  # Analyze first 5 entries
                            for key, value in exp.items():
                                if key not in structure_analysis:
                                    structure_analysis[key] = []
                                structure_analysis[key].append(type(value).__name__)
                        
                        for field, types in structure_analysis.items():
                            unique_types = list(set(types))
                            print(f"   • {field}: {', '.join(unique_types)}")
                        
                        break  # Only analyze first record with work experience
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass

if __name__ == "__main__":
    analyze_work_experience() 