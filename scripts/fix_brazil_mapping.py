#!/usr/bin/env python3
from supabase import create_client

SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def fix_brazil_mapping():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("🇧🇷 Fixing Brazil/Brasil mapping issue...")
    
    # First, check if "Brazil" exists in the countries table
    try:
        result = supabase.table('countries').select('id, name').eq('name', 'Brazil').execute()
        
        if result.data:
            brazil_id = result.data[0]['id']
            print(f"✅ Found 'Brazil' in countries table with ID: {brazil_id}")
            
            # Now update the consultant profiles that have "Brasil" to use the correct country_id
            try:
                # Get consultant profiles with "Brasil" country
                profiles_result = supabase.table('consultant_profiles').select(
                    'user_id, country'
                ).eq('country', 'Brasil').execute()
                
                if profiles_result.data:
                    print(f"📝 Found {len(profiles_result.data)} consultant profiles with 'Brasil'")
                    
                    for profile in profiles_result.data:
                        try:
                            # Update the profile to use Brazil's country_id
                            update_result = supabase.table('consultant_profiles').update({
                                'country_id': brazil_id
                            }).eq('user_id', profile['user_id']).execute()
                            
                            if update_result.data:
                                print(f"✅ Updated consultant profile {profile['user_id']}: Brasil -> Brazil (ID {brazil_id})")
                            else:
                                print(f"⚠️  No data returned for consultant profile update: {profile['user_id']}")
                                
                        except Exception as e:
                            print(f"❌ Error updating consultant profile {profile['user_id']}: {e}")
                    
                    print(f"🎉 Successfully updated {len(profiles_result.data)} profiles from 'Brasil' to 'Brazil'")
                else:
                    print("ℹ️  No consultant profiles found with 'Brasil' country")
                    
            except Exception as e:
                print(f"❌ Error processing consultant profiles: {e}")
        else:
            print("❌ 'Brazil' not found in countries table")
            
    except Exception as e:
        print(f"❌ Error checking countries table: {e}")

if __name__ == "__main__":
    fix_brazil_mapping() 