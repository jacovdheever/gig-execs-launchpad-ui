#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def verify_work_experience_migration():
    """Verify the work experience migration results"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("🔍 Verifying work experience migration...")
    print("=" * 60)
    
    try:
        # Get total count of work experience entries
        result = supabase.table('work_experience').select('id', count='exact').execute()
        total_count = result.count if hasattr(result, 'count') else len(result.data)
        
        print(f"📊 Total work experience entries in database: {total_count}")
        
        # Get sample of recent entries
        sample_result = supabase.table('work_experience').select(
            'id, user_id, company, job_title, city, country_id, currently_working, created_at'
        ).order('created_at', desc=True).limit(5).execute()
        
        if sample_result.data:
            print(f"\n📋 Sample of recent work experience entries:")
            for entry in sample_result.data:
                print(f"   • ID: {entry['id']}")
                print(f"     Company: {entry['company']}")
                print(f"     Job Title: {entry['job_title']}")
                print(f"     City: {entry.get('city', 'N/A')}")
                print(f"     Country ID: {entry.get('country_id', 'N/A')}")
                print(f"     Currently Working: {entry.get('currently_working', False)}")
                print(f"     Created: {entry.get('created_at', 'N/A')}")
                print()
        
        # Get statistics by country
        country_stats = supabase.table('work_experience').select('country_id').execute()
        country_counts = {}
        for entry in country_stats.data:
            country_id = entry.get('country_id')
            if country_id:
                country_counts[country_id] = country_counts.get(country_id, 0) + 1
        
        if country_counts:
            print(f"🌍 Work experience by country (top 10):")
            sorted_countries = sorted(country_counts.items(), key=lambda x: x[1], reverse=True)
            for country_id, count in sorted_countries[:10]:
                print(f"   • Country ID {country_id}: {count} entries")
        
        # Get currently working vs past jobs
        current_jobs = supabase.table('work_experience').select('id').eq('currently_working', True).execute()
        past_jobs = supabase.table('work_experience').select('id').eq('currently_working', False).execute()
        
        current_count = len(current_jobs.data) if current_jobs.data else 0
        past_count = len(past_jobs.data) if past_jobs.data else 0
        
        print(f"\n⏰ Work experience status:")
        print(f"   • Currently working: {current_count} entries")
        print(f"   • Past jobs: {past_count} entries")
        
        # Check for any entries with missing required fields
        missing_company = supabase.table('work_experience').select('id').is_('company', 'null').execute()
        missing_job_title = supabase.table('work_experience').select('id').is_('job_title', 'null').execute()
        
        print(f"\n⚠️  Data quality check:")
        print(f"   • Entries missing company: {len(missing_company.data) if missing_company.data else 0}")
        print(f"   • Entries missing job title: {len(missing_job_title.data) if missing_job_title.data else 0}")
        
        print("\n" + "=" * 60)
        print("✅ Verification completed!")
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")

if __name__ == "__main__":
    verify_work_experience_migration() 