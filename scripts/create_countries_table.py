#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def create_countries_table():
    """Create the countries table in Supabase"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # SQL to create the countries table
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS countries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    # SQL to add index
    create_index_sql = """
    CREATE INDEX IF NOT EXISTS idx_countries_name ON countries(name);
    """
    
    # SQL to enable RLS
    enable_rls_sql = """
    ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
    """
    
    # SQL to create policies
    create_policies_sql = """
    CREATE POLICY "Allow authenticated users to read countries" ON countries
      FOR SELECT USING (auth.role() = 'authenticated');
    
    CREATE POLICY "Allow service role to manage countries" ON countries
      FOR ALL USING (auth.role() = 'service_role');
    """
    
    try:
        print("🗄️  Creating countries table...")
        
        # Execute the table creation
        result = supabase.rpc('exec_sql', {'sql': create_table_sql}).execute()
        print("✅ Countries table created successfully")
        
        # Execute the index creation
        result = supabase.rpc('exec_sql', {'sql': create_index_sql}).execute()
        print("✅ Index created successfully")
        
        # Execute RLS enable
        result = supabase.rpc('exec_sql', {'sql': enable_rls_sql}).execute()
        print("✅ RLS enabled successfully")
        
        # Execute policies creation
        result = supabase.rpc('exec_sql', {'sql': create_policies_sql}).execute()
        print("✅ Security policies created successfully")
        
        print("\n🎉 Countries table setup completed successfully!")
        print("   - Table structure created")
        print("   - Index added for performance")
        print("   - Row Level Security enabled")
        print("   - Security policies configured")
        
    except Exception as e:
        print(f"❌ Error creating countries table: {e}")
        print("\n💡 Alternative: You can manually run the SQL in your Supabase dashboard:")
        print("   1. Go to your Supabase dashboard")
        print("   2. Navigate to SQL Editor")
        print("   3. Copy and paste the SQL from sql/create_countries_table.sql")
        print("   4. Execute the script")

if __name__ == "__main__":
    create_countries_table() 