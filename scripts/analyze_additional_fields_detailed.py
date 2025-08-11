#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from typing import Dict, List, Any

def analyze_additional_fields_detailed():
    """Detailed analysis of headline, industries, and profileStatus fields"""
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🔍 Detailed Analysis of Additional Fields...")
    print("=" * 60)
    
    headline_data = []
    industries_data = []
    profile_status_data = []
    
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
                        headline_data.append({
                            'email': row.get('EmailAddress', ''),
                            'headline': public_data['headline'],
                            'length': len(public_data['headline'])
                        })
                    
                    # Check for industries
                    if 'industries' in public_data and public_data['industries']:
                        records_with_industries += 1
                        industries_data.append({
                            'email': row.get('EmailAddress', ''),
                            'industries': public_data['industries'],
                            'count': len(public_data['industries'])
                        })
                    
                    # Check for profileStatus
                    if 'profileStatus' in public_data and public_data['profileStatus']:
                        records_with_profile_status += 1
                        profile_status_data.append({
                            'email': row.get('EmailAddress', ''),
                            'profileStatus': public_data['profileStatus']
                        })
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
    
    print(f"📊 Detailed Analysis Summary:")
    print(f"   Total records processed: {total_records}")
    print(f"   Records with headline: {records_with_headline} ({(records_with_headline/total_records)*100:.1f}%)")
    print(f"   Records with industries: {records_with_industries} ({(records_with_industries/total_records)*100:.1f}%)")
    print(f"   Records with profileStatus: {records_with_profile_status} ({(records_with_profile_status/total_records)*100:.1f}%)")
    
    # Analyze headline patterns
    if headline_data:
        headline_lengths = [item['length'] for item in headline_data]
        print(f"\n📋 Headline Analysis:")
        print(f"   Average length: {sum(headline_lengths)/len(headline_lengths):.1f} characters")
        print(f"   Min length: {min(headline_lengths)} characters")
        print(f"   Max length: {max(headline_lengths)} characters")
        print(f"   Sample headlines:")
        for i, item in enumerate(headline_data[:5]):
            print(f"     {i+1}. {item['email']}: {item['headline']}")
    
    # Analyze industries patterns
    if industries_data:
        industry_counts = [item['count'] for item in industries_data]
        all_industries = []
        for item in industries_data:
            all_industries.extend(item['industries'])
        
        unique_industries = list(set(all_industries))
        print(f"\n📋 Industries Analysis:")
        print(f"   Average industries per user: {sum(industry_counts)/len(industry_counts):.1f}")
        print(f"   Min industries per user: {min(industry_counts)}")
        print(f"   Max industries per user: {max(industry_counts)}")
        print(f"   Total unique industries: {len(unique_industries)}")
        print(f"   Sample industries data:")
        for i, item in enumerate(industries_data[:5]):
            print(f"     {i+1}. {item['email']}: {item['industries']}")
    
    # Analyze profile status patterns
    if profile_status_data:
        status_counts = {}
        for item in profile_status_data:
            status = item['profileStatus']
            status_counts[status] = status_counts.get(status, 0) + 1
        
        print(f"\n📋 Profile Status Analysis:")
        print(f"   Unique statuses: {list(status_counts.keys())}")
        print(f"   Status distribution:")
        for status, count in status_counts.items():
            print(f"     {status}: {count} users")
        print(f"   Sample profile statuses:")
        for i, item in enumerate(profile_status_data[:5]):
            print(f"     {i+1}. {item['email']}: {item['profileStatus']}")
    
    print(f"\n" + "=" * 60)
    print(f"🎯 Database Field Mapping:")
    print(f"   CSV headline → users.headline (TEXT)")
    print(f"   CSV industries → consultant_profiles.industries (TEXT[])")
    print(f"   CSV profileStatus → users.profile_status (TEXT)")
    
    print(f"\n✅ Detailed analysis completed!")

if __name__ == "__main__":
    analyze_additional_fields_detailed() 