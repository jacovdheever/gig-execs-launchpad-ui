#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from typing import Dict, List, Any

def analyze_references_data():
    """Analyze the structure of references data within the CSV's ProtectedData field"""
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    csv_file = Path(csv_path)
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
    
    print("🔍 Analyzing References Data Structure...")
    print("=" * 60)
    
    references_data = []
    total_records = 0
    records_with_references = 0
    total_references = 0
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            total_records += 1
            
            # Analyze ProtectedData
            protected_data_str = row.get('ProtectedData', '')
            if protected_data_str and protected_data_str != 'null':
                try:
                    protected_data = json.loads(protected_data_str)
                    
                    # Check for references
                    if 'references' in protected_data and protected_data['references']:
                        records_with_references += 1
                        references = protected_data['references']
                        total_references += len(references)
                        
                        references_data.append({
                            'email': row.get('EmailAddress', ''),
                            'references': references,
                            'count': len(references)
                        })
                
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    pass
    
    print(f"📊 References Data Analysis Summary:")
    print(f"   Total records processed: {total_records}")
    print(f"   Records with references: {records_with_references} ({(records_with_references/total_records)*100:.1f}%)")
    print(f"   Total references found: {total_references}")
    print(f"   Average references per user: {total_references/records_with_references:.1f}" if records_with_references > 0 else "   Average references per user: 0")
    
    # Analyze reference structure
    if references_data:
        print(f"\n📋 Reference Structure Analysis:")
        
        # Sample the first few references to understand structure
        sample_references = []
        for item in references_data[:5]:
            sample_references.extend(item['references'])
        
        if sample_references:
            # Analyze the structure of the first reference
            first_ref = sample_references[0]
            print(f"   Reference fields found:")
            for key, value in first_ref.items():
                print(f"     - {key}: {type(value).__name__} = {value}")
        
        # Count references per user distribution
        ref_counts = [item['count'] for item in references_data]
        count_distribution = {}
        for count in ref_counts:
            count_distribution[count] = count_distribution.get(count, 0) + 1
        
        print(f"\n📊 References per User Distribution:")
        for count in sorted(count_distribution.keys()):
            print(f"   {count} reference(s): {count_distribution[count]} users")
        
        print(f"\n📋 Sample References Data:")
        for i, item in enumerate(references_data[:3]):
            print(f"   User {i+1}: {item['email']}")
            print(f"     References count: {item['count']}")
            for j, ref in enumerate(item['references']):
                print(f"     Reference {j+1}: {ref}")
            print()
    
    print(f"\n" + "=" * 60)
    print(f"🎯 Reference Contacts Table Mapping:")
    print(f"   CSV references[] → reference_contacts table")
    print(f"   Each reference object → individual row in reference_contacts")
    print(f"   Foreign key: user_id (from users table)")
    
    print(f"\n✅ References data analysis completed!")

if __name__ == "__main__":
    analyze_references_data() 