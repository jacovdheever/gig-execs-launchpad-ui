# Storage RLS Policy Setup for project-attachments

## Problem
The `project-attachments` bucket currently only allows users to view their own files. This prevents:
- Clients from viewing bid documents uploaded by professionals
- Project owners from viewing files attached to their projects

## Solution
Create RLS policies that allow:
1. Users to view their own uploaded files
2. Project owners to view files attached to their projects
3. Project owners to view bid documents for their projects

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Policies**
3. Select the `project-attachments` bucket
4. Click **"New Policy"** for each policy below

#### Policy 1: Users can upload project attachments
- **Policy Name**: `Users can upload project attachments`
- **Allowed Operation**: `INSERT`
- **Policy Definition**:
```sql
bucket_id = 'project-attachments' AND 
auth.uid()::text = (storage.foldername(name))[1]
```

#### Policy 2: Users can view their own project attachments
- **Policy Name**: `Users can view their own project attachments`
- **Allowed Operation**: `SELECT`
- **Policy Definition**:
```sql
bucket_id = 'project-attachments' AND 
auth.uid()::text = (storage.foldername(name))[1]
```

#### Policy 3: Project owners can view project attachments
- **Policy Name**: `Project owners can view project attachments`
- **Allowed Operation**: `SELECT`
- **Policy Definition**:
```sql
bucket_id = 'project-attachments' AND
EXISTS (
  SELECT 1 FROM projects
  WHERE creator_id = auth.uid()
  AND project_attachments IS NOT NULL
  AND name = ANY(
    SELECT regexp_replace(unnest(project_attachments), '^project-attachments/', '')
  )
)
```

#### Policy 4: Project owners can view bid documents
- **Policy Name**: `Project owners can view bid documents`
- **Allowed Operation**: `SELECT`
- **Policy Definition**:
```sql
bucket_id = 'project-attachments' AND
EXISTS (
  SELECT 1 FROM bids b
  INNER JOIN projects p ON b.project_id = p.id
  WHERE p.creator_id = auth.uid()
  AND b.bid_documents IS NOT NULL
  AND name = ANY(
    SELECT regexp_replace(unnest(b.bid_documents), '^project-attachments/', '')
  )
)
```

#### Policy 5: Users can update their own project attachments
- **Policy Name**: `Users can update their own project attachments`
- **Allowed Operation**: `UPDATE`
- **Policy Definition**:
```sql
bucket_id = 'project-attachments' AND 
auth.uid()::text = (storage.foldername(name))[1]
```

#### Policy 6: Users can delete their own project attachments
- **Policy Name**: `Users can delete their own project attachments`
- **Allowed Operation**: `DELETE`
- **Policy Definition**:
```sql
bucket_id = 'project-attachments' AND 
auth.uid()::text = (storage.foldername(name))[1]
```

### Option 2: Using SQL Editor with Service Role

If you have access to the service role key, you can run the migration file `migrations/010_fix_project_attachments_rls.sql` in the Supabase SQL Editor. However, you may need to run it as the service role.

## Verification

After creating the policies, test by:
1. As a professional: Upload a bid document
2. As a client: View the bid document on the project details page

Both should work without "Object not found" errors.

