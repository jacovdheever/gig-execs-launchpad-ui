#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from typing import Dict, List, Any

def analyze_certifications_data():
    """Analyze certifications data in the CSV file"""
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🔍 Analyzing certifications data in CSV...")
    print("=" * 60)
    
    certification_fields = {
        'public_data': set(),
        'private_data': set(),
        'protected_data': set()
    }
    
    certification_samples = []
    total_records = 0
    records_with_certifications = 0
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            total_records += 1
            
            # Analyze PublicData
            public_data_str = row.get('PublicData', '')
            if public_data_str and public_data_str != 'null':
                try:
                    public_data = json.loads(public_data_str)
                    
                    # Check for certifications array
                    if 'certifications' in public_data:
                        records_with_certifications += 1
                        certifications = public_data['certifications']
                        
                        if certifications and len(certifications) > 0:
                            # Analyze first certification entry
                            first_cert = certifications[0]
                            certification_fields['public_data'].update(first_cert.keys())
                            
                            # Store sample for detailed analysis
                            if len(certification_samples) < 5:
                                certification_samples.append({
                                    'source': 'PublicData',
                                    'email': row.get('EmailAddress', ''),
                                    'data': first_cert
                                })
                        
                        # Check for other certification-related fields
                        for key in public_data.keys():
                            if 'certification' in key.lower() or 'cert' in key.lower():
                                certification_fields['public_data'].add(key)
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
            
            # Analyze PrivateData
            private_data_str = row.get('PrivateData', '')
            if private_data_str and private_data_str != 'null':
                try:
                    private_data = json.loads(private_data_str)
                    
                    # Check for certification-related fields
                    for key in private_data.keys():
                        if 'certification' in key.lower() or 'cert' in key.lower():
                            certification_fields['private_data'].add(key)
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
            
            # Analyze ProtectedData
            protected_data_str = row.get('ProtectedData', '')
            if protected_data_str and protected_data_str != 'null':
                try:
                    protected_data = json.loads(protected_data_str)
                    
                    # Check for certification-related fields
                    for key in protected_data.keys():
                        if 'certification' in key.lower() or 'cert' in key.lower():
                            certification_fields['protected_data'].add(key)
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
    
    print(f"📊 Certifications Data Analysis Summary:")
    print(f"   Total records processed: {total_records}")
    print(f"   Records with certifications: {records_with_certifications}")
    print(f"   Certifications coverage: {(records_with_certifications/total_records)*100:.1f}%")
    
    print(f"\n📋 Certification fields found:")
    print(f"   PublicData: {sorted(certification_fields['public_data'])}")
    print(f"   PrivateData: {sorted(certification_fields['private_data'])}")
    print(f"   ProtectedData: {sorted(certification_fields['protected_data'])}")
    
    print(f"\n📋 Sample certification entries:")
    for i, sample in enumerate(certification_samples):
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
    print(f"🎯 Certifications Table Mapping:")
    print(f"   CSV field → Database field")
    print(f"   name → name")
    print(f"   issuingOrganization → issuing_organization")
    print(f"   issueDate → issue_date")
    print(f"   expirationDate → expiration_date")
    print(f"   credentialId → credential_id")
    print(f"   credentialUrl → credential_url")
    print(f"   proofOfCertification → file_url")
    
    print(f"\n✅ Analysis completed!")

if __name__ == "__main__":
    analyze_certifications_data() 