#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from typing import Dict, List, Any

def deep_work_experience_analysis():
    """Deep analysis of work experience fields across all data sections"""
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🔍 Deep Analysis of Work Experience Fields...")
    print("=" * 60)
    
    # Track all work-related fields across all data sections
    work_fields = {
        'PublicData': set(),
        'PrivateData': set(),
        'ProtectedData': set()
    }
    
    # Sample records with work experience
    samples = []
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            # Analyze PublicData
            public_data_str = row.get('PublicData', '')
            if public_data_str and public_data_str != 'null':
                try:
                    public_data = json.loads(public_data_str)
                    
                    # Check for workExperience array
                    if 'workExperience' in public_data and public_data['workExperience']:
                        if len(samples) < 2:
                            samples.append({
                                'section': 'PublicData',
                                'workExperience': public_data['workExperience'][:2],  # First 2 entries
                                'other_fields': {k: v for k, v in public_data.items() if k != 'workExperience'}
                            })
                    
                    # Check for other work-related fields
                    for key in public_data.keys():
                        if any(term in key.lower() for term in ['work', 'experience', 'job', 'employment', 'career', 'position', 'role']):
                            work_fields['PublicData'].add(key)
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
            
            # Analyze PrivateData
            private_data_str = row.get('PrivateData', '')
            if private_data_str and private_data_str != 'null':
                try:
                    private_data = json.loads(private_data_str)
                    
                    # Check for work-related fields
                    for key in private_data.keys():
                        if any(term in key.lower() for term in ['work', 'experience', 'job', 'employment', 'career', 'position', 'role']):
                            work_fields['PrivateData'].add(key)
                    
                    # If we find work-related data, store a sample
                    if any(term in str(private_data).lower() for term in ['work', 'experience', 'job', 'employment']):
                        if len(samples) < 4:
                            samples.append({
                                'section': 'PrivateData',
                                'data': private_data
                            })
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
            
            # Analyze ProtectedData
            protected_data_str = row.get('ProtectedData', '')
            if protected_data_str and protected_data_str != 'null':
                try:
                    protected_data = json.loads(protected_data_str)
                    
                    # Check for work-related fields
                    for key in protected_data.keys():
                        if any(term in key.lower() for term in ['work', 'experience', 'job', 'employment', 'career', 'position', 'role']):
                            work_fields['ProtectedData'].add(key)
                    
                    # If we find work-related data, store a sample
                    if any(term in str(protected_data).lower() for term in ['work', 'experience', 'job', 'employment']):
                        if len(samples) < 6:
                            samples.append({
                                'section': 'ProtectedData',
                                'data': protected_data
                            })
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
    
    # Print results
    print(f"📊 Work Experience Fields Found:")
    
    for section, fields in work_fields.items():
        if fields:
            print(f"\n📋 {section} work-related fields:")
            for field in sorted(fields):
                print(f"   • {field}")
        else:
            print(f"\n📋 {section}: No work-related fields found")
    
    # Show detailed samples
    print(f"\n📝 Detailed Samples:")
    for i, sample in enumerate(samples, 1):
        print(f"\n--- Sample {i} ({sample['section']}) ---")
        
        if 'workExperience' in sample:
            print(f"   Work Experience Entries:")
            for j, exp in enumerate(sample['workExperience'], 1):
                print(f"     Entry {j}:")
                for key, value in exp.items():
                    if key == 'description' and len(str(value)) > 100:
                        print(f"       {key}: {str(value)[:100]}...")
                    else:
                        print(f"       {key}: {value}")
            
            if 'other_fields' in sample:
                print(f"   Other fields in {sample['section']}:")
                for key, value in sample['other_fields'].items():
                    print(f"     • {key}")
        
        elif 'data' in sample:
            print(f"   Data fields:")
            for key, value in sample['data'].items():
                if isinstance(value, dict):
                    print(f"     • {key}: {dict}")
                elif isinstance(value, list):
                    print(f"     • {key}: [list with {len(value)} items]")
                else:
                    print(f"     • {key}: {value}")
    
    # Check for specific patterns
    print(f"\n🔍 Checking for specific work experience patterns...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            # Look for current job information
            public_data_str = row.get('PublicData', '')
            if public_data_str and public_data_str != 'null':
                try:
                    public_data = json.loads(public_data_str)
                    
                    # Check for current job fields
                    current_job_fields = []
                    for key in public_data.keys():
                        if any(term in key.lower() for term in ['current', 'present', 'now', 'active']):
                            current_job_fields.append(key)
                    
                    if current_job_fields:
                        print(f"\n📋 Current job related fields found:")
                        for field in current_job_fields:
                            print(f"   • {field}")
                        break
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass

if __name__ == "__main__":
    deep_work_experience_analysis() 