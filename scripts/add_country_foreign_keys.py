#!/usr/bin/env python3
from supabase import create_client

SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def add_country_foreign_keys():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # SQL commands to add foreign key columns
    sql_commands = [
        # Add country_id column to consultant_profiles table
        """
        ALTER TABLE consultant_profiles 
        ADD COLUMN country_id INTEGER REFERENCES countries(id);
        """,
        
        # Add country_id column to client_profiles table  
        """
        ALTER TABLE client_profiles 
        ADD COLUMN country_id INTEGER REFERENCES countries(id);
        """,
        
        # Add indexes for better performance
        """
        CREATE INDEX IF NOT EXISTS idx_consultant_profiles_country_id ON consultant_profiles(country_id);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_client_profiles_country_id ON client_profiles(country_id);
        """
    ]
    
    print("🗄️  Adding country foreign key columns to database...")
    
    for i, sql in enumerate(sql_commands, 1):
        try:
            print(f"📝 Executing SQL command {i}/{len(sql_commands)}...")
            
            # Execute the SQL command
            result = supabase.rpc('exec_sql', {'sql': sql}).execute()
            
            print(f"✅ SQL command {i} executed successfully")
            
        except Exception as e:
            print(f"❌ Error executing SQL command {i}: {e}")
            print(f"💡 SQL: {sql.strip()}")
            print("\n🔧 Alternative: You can manually run these SQL commands in your Supabase dashboard:")
            print("   1. Go to your Supabase dashboard")
            print("   2. Navigate to SQL Editor")
            print("   3. Copy and paste the SQL from sql/add_country_foreign_keys.sql")
            print("   4. Execute the script")
            return False
    
    print("\n🎉 Country foreign key columns added successfully!")
    print("   - Added country_id to consultant_profiles")
    print("   - Added country_id to client_profiles")
    print("   - Created indexes for performance")
    print("\n✅ You can now run the migration script: python3 scripts/migrate_country_foreign_keys.py")
    
    return True

if __name__ == "__main__":
    add_country_foreign_keys() 