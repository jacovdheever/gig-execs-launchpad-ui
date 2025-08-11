#!/usr/bin/env python3
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://yvevlrsothtppvpaszuq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMwNDUzMywiZXhwIjoyMDY5ODgwNTMzfQ.jUVm60s8G3cLbL2SRSPYCzkPs72gv5uB5QPNHHiU2rs'

def check_schema():
    """Check the actual table schema"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Try to get a single record to see the structure
        result = supabase.table('users').select('*').limit(1).execute()
        if result.data:
            print("Users table structure:")
            for key, value in result.data[0].items():
                print(f"  {key}: {type(value).__name__}")
        else:
            print("No users found in table")
            
        # Also check consultant_profiles table
        result = supabase.table('consultant_profiles').select('*').limit(1).execute()
        if result.data:
            print("\nConsultant profiles table structure:")
            for key, value in result.data[0].items():
                print(f"  {key}: {type(value).__name__}")
        else:
            print("No consultant profiles found in table")
            
    except Exception as e:
        print(f"Error checking schema: {e}")

if __name__ == "__main__":
    check_schema() 