#!/usr/bin/env python3
import csv
import json
import uuid
from datetime import datetime
from pathlib import Path
from supabase import create_client
from typing import Dict, List, Any, Optional

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

class ClientProfilesMigration:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.stats = {
            'total_records': 0,
            'clients_found': 0,
            'profiles_inserted': 0,
            'profiles_skipped': 0,
            'errors': []
        }

    def get_user_id_from_email(self, email: str) -> Optional[str]:
        """Get the user ID from the database using email"""
        try:
            result = self.supabase.table('users').select('id').eq('email', email).execute()
            if result.data:
                return result.data[0]['id']
        except Exception as e:
            print(f"❌ Error looking up user by email: {e}")
        return None

    def extract_client_data(self, public_data_str: str, private_data_str: str, protected_data_str: str) -> Optional[Dict[str, Any]]:
        """Extract client profile data from PublicData, PrivateData, and ProtectedData"""
        client_data = {}
        
        # Parse PublicData
        if public_data_str and public_data_str != 'null':
            try:
                public_data = json.loads(public_data_str)
                
                # Extract company information from companyProfile
                if 'companyProfile' in public_data:
                    company_profile = public_data['companyProfile']
                    
                    if 'companyName' in company_profile:
                        client_data['company_name'] = company_profile['companyName']
                    
                    if 'website' in company_profile:
                        client_data['website'] = company_profile['website']
                    
                    if 'dunsNumber' in company_profile:
                        client_data['duns_number'] = company_profile['dunsNumber']
                    
                    if 'industry' in company_profile:
                        client_data['industry'] = company_profile['industry']
                    
                    if 'organizationType' in company_profile:
                        client_data['organisation_type'] = company_profile['organizationType']
                
                # Extract country from root level
                if 'country' in public_data:
                    client_data['country'] = public_data['country']
                
                # Extract address from PublicData (check both address and companyAddress)
                address_data = None
                if 'address' in public_data:
                    address_data = public_data['address']
                elif 'companyAddress' in public_data:
                    address_data = public_data['companyAddress']
                
                if address_data:
                    client_data['country'] = address_data.get('country')
                    client_data['postal_code'] = address_data.get('zipCode')
                    
                    # Build address1 and address2
                    street_name = address_data.get('streetName', '')
                    suburb = address_data.get('suburb', '')
                    city = address_data.get('city', '')
                    state = address_data.get('state', '')
                    
                    if street_name:
                        address1_parts = [street_name]
                        if suburb:
                            address1_parts.append(suburb)
                        client_data['address1'] = ', '.join(address1_parts)
                    
                    if city or state:
                        address2_parts = []
                        if city:
                            address2_parts.append(city)
                        if state:
                            address2_parts.append(state)
                        client_data['address2'] = ', '.join(address2_parts)
                    
                    client_data['address3'] = address_data.get('city')  # Use city as address3
                
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                pass  # Silently skip parsing errors
        
        # Parse PrivateData
        if private_data_str and private_data_str != 'null':
            try:
                private_data = json.loads(private_data_str)
                
                # Extract phone number
                if 'phoneNumber' in private_data:
                    client_data['phone'] = private_data['phoneNumber']
                
                # Extract additional address info from PrivateData if not in PublicData
                if 'address' in private_data and 'country' not in client_data:
                    address = private_data['address']
                    client_data['country'] = address.get('country')
                    client_data['postal_code'] = address.get('zipCode')
                    
                    # Build address1 and address2
                    street_name = address.get('streetName', '')
                    suburb = address.get('suburb', '')
                    city = address.get('city', '')
                    state = address.get('state', '')
                    
                    if street_name and 'address1' not in client_data:
                        address1_parts = [street_name]
                        if suburb:
                            address1_parts.append(suburb)
                        client_data['address1'] = ', '.join(address1_parts)
                    
                    if (city or state) and 'address2' not in client_data:
                        address2_parts = []
                        if city:
                            address2_parts.append(city)
                        if state:
                            address2_parts.append(state)
                        client_data['address2'] = ', '.join(address2_parts)
                    
                    if city and 'address3' not in client_data:
                        client_data['address3'] = city
                
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                pass  # Silently skip parsing errors
        
        # Parse ProtectedData
        if protected_data_str and protected_data_str != 'null':
            try:
                protected_data = json.loads(protected_data_str)
                
                # Extract phone number from protected data if not in private data
                if 'phoneNumber' in protected_data and 'phone' not in client_data:
                    client_data['phone'] = protected_data['phoneNumber']
                
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                pass  # Silently skip parsing errors
        
        # Only return data if we have company_name (required field)
        return client_data if client_data.get('company_name') else None

    def transform_client_profile(self, user_id: str, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform client data to the target format"""
        profile_data = {
            'user_id': user_id,
            'company_name': client_data.get('company_name'),
            'website': client_data.get('website'),
            'description': None,  # Not available in source data
            'duns_number': client_data.get('duns_number'),
            'organisation_type': client_data.get('organisation_type'),
            'industry': client_data.get('industry'),
            'logo_url': None,  # Not available in source data
            'address1': client_data.get('address1'),
            'address2': client_data.get('address2'),
            'address3': client_data.get('address3'),
            'country': client_data.get('country'),
            'postal_code': client_data.get('postal_code'),
            'phone': client_data.get('phone'),
            'linkedin_url': None,  # Not available in source data
            'stripe_customer_id': None,  # Not available in source data
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        return profile_data

    def migrate_client_profiles(self, csv_path: str):
        """Migrate client profiles from CSV to database"""
        csv_file = Path(csv_path)
        
        if not csv_file.exists():
            print(f"❌ CSV file not found: {csv_path}")
            return
        
        print(f"📖 Processing CSV file: {csv_path}")
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                self.stats['total_records'] += 1
                
                # Get user details
                csv_id = row.get('Id', '')
                email = row.get('EmailAddress', '')
                
                # Check if we have company data in PublicData
                public_data_str = row.get('PublicData', '')
                has_company_data = False
                
                if public_data_str and 'companyName' in public_data_str:
                    try:
                        public_data = json.loads(public_data_str)
                        if 'companyProfile' in public_data and 'companyName' in public_data['companyProfile']:
                            has_company_data = True
                            self.stats['clients_found'] += 1
                        else:
                            continue  # Skip if no company name
                    except Exception as e:
                        continue  # Skip parsing errors
                else:
                    continue  # Skip records without company data
                
                if not has_company_data:
                    continue  # Skip if we don't have company data
                
                # Extract client data
                client_data = self.extract_client_data(
                    row.get('PublicData', ''),
                    row.get('PrivateData', ''),
                    row.get('ProtectedData', '')
                )
                
                if not client_data:
                    continue  # Skip records without client data
                
                # Get user ID from database
                user_id = self.get_user_id_from_email(email)
                
                if not user_id:
                    continue  # Skip if user doesn't exist in database
                
                # Transform data
                profile_data = self.transform_client_profile(user_id, client_data)
                
                # Insert profile
                try:
                    result = self.supabase.table('client_profiles').insert(profile_data).execute()
                    
                    if result.data:
                        self.stats['profiles_inserted'] += 1
                    else:
                        error_msg = f"No data returned for client profile: {user_id}"
                        self.stats['errors'].append(error_msg)
                        
                except Exception as e:
                    error_msg = str(e)
                    # Check if it's a duplicate key error (expected)
                    if 'duplicate key value violates unique constraint' in error_msg:
                        self.stats['profiles_skipped'] += 1
                    else:
                        # This is an unexpected error
                        full_error_msg = f"Error inserting client profile for user {user_id}: {e}"
                        self.stats['errors'].append(full_error_msg)

    def save_migration_stats(self, output_path: str = 'data/client_profiles_migration_stats.json'):
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
        print("\n📊 Client Profiles Migration Summary:")
        print(f"   Total records processed: {self.stats['total_records']}")
        print(f"   Clients found: {self.stats['clients_found']}")
        print(f"   Profiles inserted: {self.stats['profiles_inserted']}")
        print(f"   Profiles skipped (already exist): {self.stats['profiles_skipped']}")
        print(f"   Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n❌ Sample errors encountered:")
            for error in self.stats['errors'][:5]:  # Show first 5 errors
                print(f"   • {error}")
            if len(self.stats['errors']) > 5:
                print(f"   ... and {len(self.stats['errors']) - 5} more")

def main():
    migrator = ClientProfilesMigration()
    
    # Migrate client profiles
    csv_path = 'data/secure/gigexecscom-deleted-2025-04-25-1745577673277-users.csv'
    migrator.migrate_client_profiles(csv_path)
    
    # Save stats
    migrator.save_migration_stats()
    
    # Print summary
    migrator.print_summary()

if __name__ == "__main__":
    main() 