#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from typing import Dict, List, Any

def analyze_additional_fields():
    """Analyze headline, industries, and profileStatus fields in the CSV"""
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🔍 Analyzing headline, industries, and profileStatus fields...")
    print("=" * 60)
    
    headline_samples = []
    industries_samples = []
    profile_status_samples = []
    
    total_records = 0
    records_with_headline = 0
    records_with_industries = 0
    records_with_profile_status = 0
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            total_records += 1
            
            # Analyze PublicData
            public_data_str = row.get('PublicData', '')
            if public_data_str and public_data_str != 'null':
                try:
                    public_data = json.loads(public_data_str)
                    
                    # Check for headline
                    if 'headline' in public_data and public_data['headline']:
                        records_with_headline += 1
                        if len(headline_samples) < 5:
                            headline_samples.append({
                                'email': row.get('EmailAddress', ''),
                                'headline': public_data['headline']
                            })
                    
                    # Check for industries
                    if 'industries' in public_data and public_data['industries']:
                        records_with_industries += 1
                        if len(industries_samples) < 5:
                            industries_samples.append({
                                'email': row.get('EmailAddress', ''),
                                'industries': public_data['industries']
                            })
                    
                    # Check for profileStatus
                    if 'profileStatus' in public_data and public_data['profileStatus']:
                        records_with_profile_status += 1
                        if len(profile_status_samples) < 5:
                            profile_status_samples.append({
                                'email': row.get('EmailAddress', ''),
                                'profileStatus': public_data['profileStatus']
                            })
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
    
    print(f"📊 Additional Fields Analysis Summary:")
    print(f"   Total records processed: {total_records}")
    print(f"   Records with headline: {records_with_headline} ({(records_with_headline/total_records)*100:.1f}%)")
    print(f"   Records with industries: {records_with_industries} ({(records_with_industries/total_records)*100:.1f}%)")
    print(f"   Records with profileStatus: {records_with_profile_status} ({(records_with_profile_status/total_records)*100:.1f}%)")
    
    print(f"\n📋 Headline Samples:")
    for i, sample in enumerate(headline_samples):
        print(f"   {i+1}. {sample['email']}: {sample['headline']}")
    
    print(f"\n📋 Industries Samples:")
    for i, sample in enumerate(industries_samples):
        print(f"   {i+1}. {sample['email']}: {sample['industries']}")
    
    print(f"\n📋 Profile Status Samples:")
    for i, sample in enumerate(profile_status_samples):
        print(f"   {i+1}. {sample['email']}: {sample['profileStatus']}")
    
    print(f"\n" + "=" * 60)
    print(f"🎯 Database Schema Analysis:")
    print(f"   Current users table: No headline field")
    print(f"   Current consultant_profiles table: No industries field")
    print(f"   Current users table: No profileStatus field")
    
    print(f"\n✅ Analysis completed!")

if __name__ == "__main__":
    analyze_additional_fields() 