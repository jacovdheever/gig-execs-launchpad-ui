#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_country_names():
    """Check country names for the top country IDs in work experience"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Top country IDs from work experience
    top_country_ids = [187, 186, 161, 185, 76, 9, 32, 36, 3, 126]
    
    print("🌍 Country names for top work experience countries:")
    print("=" * 60)
    
    for country_id in top_country_ids:
        try:
            result = supabase.table('countries').select('name').eq('id', country_id).execute()
            if result.data:
                country_name = result.data[0]['name']
                print(f"   • Country ID {country_id}: {country_name}")
            else:
                print(f"   • Country ID {country_id}: Not found")
        except Exception as e:
            print(f"   • Country ID {country_id}: Error - {e}")

if __name__ == "__main__":
    check_country_names() 