#!/usr/bin/env python3
import json
from datetime import datetime
from pathlib import Path
from supabase import create_client
from typing import Dict, List, Any, Optional

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

class CountryForeignKeyMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'consultant_profiles_processed': 0,
            'consultant_profiles_updated': 0,
            'client_profiles_processed': 0,
            'client_profiles_updated': 0,
            'errors': []
        }
        self.country_name_to_id = {}

    def load_country_mapping(self):
        """Load the mapping of country names to IDs from the countries table"""
        try:
            result = self.supabase.table('countries').select('id, name').execute()
            
            for country in result.data:
                self.country_name_to_id[country['name']] = country['id']
            
            print(f"✅ Loaded {len(self.country_name_to_id)} countries mapping")
            
        except Exception as e:
            print(f"❌ Error loading country mapping: {e}")
            return False
        
        return True

    def get_country_id(self, country_name: str) -> Optional[int]:
        """Get country ID from country name"""
        if not country_name:
            return None
        
        return self.country_name_to_id.get(country_name)

    def update_consultant_profiles(self):
        """Update consultant_profiles with country_id foreign keys"""
        print("👨‍💼 Updating consultant profiles with country foreign keys...")
        
        try:
            # Get all consultant profiles with country data
            result = self.supabase.table('consultant_profiles').select(
                'user_id, country'
            ).not_.is_('country', 'null').execute()
            
            for profile in result.data:
                self.stats['consultant_profiles_processed'] += 1
                
                country_name = profile.get('country')
                country_id = self.get_country_id(country_name)
                
                if country_id:
                    try:
                        # Update the profile with country_id
                        update_result = self.supabase.table('consultant_profiles').update({
                            'country_id': country_id,
                            'updated_at': datetime.now().isoformat()
                        }).eq('user_id', profile['user_id']).execute()
                        
                        if update_result.data:
                            self.stats['consultant_profiles_updated'] += 1
                            print(f"✅ Updated consultant profile {profile['user_id']}: {country_name} -> ID {country_id}")
                        else:
                            error_msg = f"No data returned for consultant profile update: {profile['user_id']}"
                            self.stats['errors'].append(error_msg)
                            
                    except Exception as e:
                        error_msg = f"Error updating consultant profile {profile['user_id']}: {e}"
                        self.stats['errors'].append(error_msg)
                        print(f"❌ {error_msg}")
                else:
                    print(f"⚠️  Country not found in mapping: {country_name}")
            
        except Exception as e:
            error_msg = f"Error processing consultant profiles: {e}"
            self.stats['errors'].append(error_msg)
            print(f"❌ {error_msg}")

    def update_client_profiles(self):
        """Update client_profiles with country_id foreign keys"""
        print("🏢 Updating client profiles with country foreign keys...")
        
        try:
            # Get all client profiles with country data
            result = self.supabase.table('client_profiles').select(
                'user_id, country'
            ).not_.is_('country', 'null').execute()
            
            for profile in result.data:
                self.stats['client_profiles_processed'] += 1
                
                country_name = profile.get('country')
                country_id = self.get_country_id(country_name)
                
                if country_id:
                    try:
                        # Update the profile with country_id
                        update_result = self.supabase.table('client_profiles').update({
                            'country_id': country_id,
                            'updated_at': datetime.now().isoformat()
                        }).eq('user_id', profile['user_id']).execute()
                        
                        if update_result.data:
                            self.stats['client_profiles_updated'] += 1
                            print(f"✅ Updated client profile {profile['user_id']}: {country_name} -> ID {country_id}")
                        else:
                            error_msg = f"No data returned for client profile update: {profile['user_id']}"
                            self.stats['errors'].append(error_msg)
                            
                    except Exception as e:
                        error_msg = f"Error updating client profile {profile['user_id']}: {e}"
                        self.stats['errors'].append(error_msg)
                        print(f"❌ {error_msg}")
                else:
                    print(f"⚠️  Country not found in mapping: {country_name}")
            
        except Exception as e:
            error_msg = f"Error processing client profiles: {e}"
            self.stats['errors'].append(error_msg)
            print(f"❌ {error_msg}")

    def test_migration(self):
        """Test the migration with a few records first"""
        print("🧪 Testing country foreign key migration...")
        
        # Load country mapping
        if not self.load_country_mapping():
            return False
        
        # Test with first few consultant profiles
        try:
            result = self.supabase.table('consultant_profiles').select(
                'user_id, country'
            ).not_.is_('country', 'null').limit(3).execute()
            
            print(f"📝 Testing with {len(result.data)} consultant profiles:")
            
            for profile in result.data:
                country_name = profile.get('country')
                country_id = self.get_country_id(country_name)
                
                print(f"   • {country_name} -> ID {country_id}")
                
                if country_id:
                    print(f"     ✅ Country mapping found")
                else:
                    print(f"     ❌ Country not found in mapping")
            
            return True
            
        except Exception as e:
            print(f"❌ Error testing migration: {e}")
            return False

    def run_migration(self):
        """Run the full migration"""
        print("🔄 Starting country foreign key migration...")
        
        # Load country mapping
        if not self.load_country_mapping():
            print("❌ Failed to load country mapping")
            return
        
        # Update consultant profiles
        self.update_consultant_profiles()
        
        # Update client profiles
        self.update_client_profiles()
        
        print("✅ Migration completed!")

    def save_migration_stats(self, output_path: str = 'data/country_foreign_key_migration_stats.json'):
        """Save migration statistics"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        data = {
            'stats': self.stats,
            'timestamp': datetime.now().isoformat()
        }
        
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved migration stats to: {output_file}")

    def print_summary(self):
        """Print a summary of the migration results"""
        print("\n📊 Country Foreign Key Migration Summary:")
        print(f"   Consultant profiles processed: {self.stats['consultant_profiles_processed']}")
        print(f"   Consultant profiles updated: {self.stats['consultant_profiles_updated']}")
        print(f"   Client profiles processed: {self.stats['client_profiles_processed']}")
        print(f"   Client profiles updated: {self.stats['client_profiles_updated']}")
        print(f"   Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n❌ Sample errors encountered:")
            for error in self.stats['errors'][:5]:  # Show first 5 errors
                print(f"   • {error}")
            if len(self.stats['errors']) > 5:
                print(f"   ... and {len(self.stats['errors']) - 5} more")

def main():
    migrator = CountryForeignKeyMigration()
    
    # Test migration first
    if migrator.test_migration():
        print("\n✅ Test successful! Proceeding with full migration...")
        
        # Run full migration
        migrator.run_migration()
        
        # Save stats
        migrator.save_migration_stats()
        
        # Print summary
        migrator.print_summary()
    else:
        print("❌ Test failed! Please check the issues above.")

if __name__ == "__main__":
    main() 