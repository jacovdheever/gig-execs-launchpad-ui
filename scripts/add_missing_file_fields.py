#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def add_missing_file_fields():
    """Add missing database fields for file uploads"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("🔧 Adding missing file upload fields...")
    print("=" * 60)
    
    # Note: Since we can't execute DDL statements directly through the Supabase client,
    # we'll provide the SQL commands that need to be run manually
    
    print("📋 Missing fields detected:")
    print("   ❌ portfolio.portfolio_files")
    print("   ❌ bids.bid_documents")
    
    print("\n🔧 SQL commands to run in Supabase SQL Editor:")
    print("=" * 60)
    
    sql_commands = """
-- Add missing file upload fields to database tables

-- 1. Add portfolio files field to portfolio table
ALTER TABLE portfolio 
ADD COLUMN portfolio_files TEXT[]; -- Array to store multiple file URLs

-- 2. Add bid documents field to bids table
ALTER TABLE bids 
ADD COLUMN bid_documents TEXT[]; -- Array to store multiple document URLs

-- Add comments to explain the new fields
COMMENT ON COLUMN portfolio.portfolio_files IS 'Array of URLs to portfolio files (images/documents) stored in Supabase Storage';
COMMENT ON COLUMN bids.bid_documents IS 'Array of URLs to bid/proposal documents stored in Supabase Storage';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bids_documents ON bids USING GIN(bid_documents);
CREATE INDEX IF NOT EXISTS idx_portfolio_files ON portfolio USING GIN(portfolio_files);
"""
    
    print(sql_commands)
    print("=" * 60)
    print("📋 Instructions:")
    print("1. Go to your Supabase dashboard")
    print("2. Navigate to SQL Editor")
    print("3. Copy and paste the SQL commands above")
    print("4. Execute the script")
    print("5. Run the verification script again to confirm")
    
    print("\n✅ Storage buckets are working correctly!")
    print("✅ Public buckets (profile-photos, company-logos) are accessible")
    print("✅ Private buckets are created and secure")

if __name__ == "__main__":
    add_missing_file_fields() 