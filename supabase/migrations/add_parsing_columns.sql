-- Add parsing columns to profile_source_files table
-- These columns support background CV parsing

-- Add parsing_status column (tracks parsing state separately from extraction)
ALTER TABLE profile_source_files 
ADD COLUMN IF NOT EXISTS parsing_status text DEFAULT 'pending' 
CHECK (parsing_status IN ('pending', 'processing', 'completed', 'failed'));

-- Add parsed_data column (stores the AI-parsed CV data as JSON)
ALTER TABLE profile_source_files 
ADD COLUMN IF NOT EXISTS parsed_data jsonb;

-- Add parsing_error column (stores error messages when parsing fails)
ALTER TABLE profile_source_files 
ADD COLUMN IF NOT EXISTS parsing_error text;

-- Add index for efficient status queries
CREATE INDEX IF NOT EXISTS idx_profile_source_files_parsing_status 
ON profile_source_files(parsing_status);

-- Comment on columns
COMMENT ON COLUMN profile_source_files.parsing_status IS 'Status of AI parsing: pending, processing, completed, failed';
COMMENT ON COLUMN profile_source_files.parsed_data IS 'JSON structure containing parsed CV data from OpenAI';
COMMENT ON COLUMN profile_source_files.parsing_error IS 'Error message if parsing failed';

