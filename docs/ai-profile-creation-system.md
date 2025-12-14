# AI Profile Creation System - Implementation Documentation

## Overview

The AI Profile Creation System enables professionals to create their GigExecs profiles using AI-powered CV parsing and conversational profile building. The system is designed in two phases:

- **Phase 1**: CV Upload & Parsing (✅ COMPLETED)
- **Phase 2**: Conversational AI Profile Creation (🔄 IN PROGRESS)

---

## Phase 1: CV Upload & Parsing - COMPLETED ✅

**Status**: Fully implemented and deployed to production  
**Completion Date**: January 2025

### Architecture

#### **Asynchronous Processing Pattern**

The CV parsing system uses a robust asynchronous architecture to handle long-running AI operations:

1. **File Upload** (`profile-cv-upload.js`)
   - Accepts PDF/DOCX file uploads
   - Extracts text immediately during upload
   - Caches extracted text in database
   - Returns `sourceFileId` for subsequent parsing

2. **Parse Trigger** (`profile-parse-cv.js`)
   - Lightweight function that validates and triggers parsing
   - Sets `parsing_status = 'processing'`
   - Returns `202 Accepted` immediately
   - Triggers background function asynchronously

3. **Background Processing** (`profile-parse-cv-background.js`)
   - Netlify Background Function with 15-minute timeout
   - Performs OpenAI API calls for CV parsing
   - Updates `parsing_status` and `parsed_data` in database
   - Handles errors gracefully

4. **Status Polling** (`profile-parse-cv-status.js`)
   - Frontend polls this endpoint for parsing completion
   - Returns current `parsing_status`, `parsed_data`, and errors
   - Enables real-time progress updates

5. **Text Paste Fallback** (`profile-parse-text.js`)
   - Direct text parsing for failed PDF extractions
   - Handles raw text input (100-30,000 characters)
   - Provides alternative path when file extraction fails

### Database Schema

#### **profile_source_files Table**

```sql
CREATE TABLE profile_source_files (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  file_type text NOT NULL CHECK (file_type IN ('cv', 'portfolio', 'certification', 'other')),
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  mime_type text,
  
  -- Text Extraction
  extracted_text text,
  extraction_status text DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed')),
  extraction_error text,
  
  -- AI Parsing
  parsing_status text DEFAULT 'pending' CHECK (parsing_status IN ('pending', 'processing', 'completed', 'failed')),
  parsed_data jsonb,
  parsing_error text,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone
);
```

### Key Features

#### **✅ Robust Error Handling**

- **Extraction Errors**: Detects PDF extraction failures (bad XRef, corrupted files, encoding issues)
- **Paste Fallback**: Automatically offers text paste option when extraction fails
- **Timeout Prevention**: Background functions prevent Netlify 10-second timeout limits
- **Graceful Degradation**: System continues to function even when extraction fails

#### **✅ Data Quality Improvements**

- **Month Normalization**: Converts "January" → "Jan" for database compatibility
- **Location Parsing**: Extracts city and country from location strings
- **Country Mapping**: Maps country names to database country IDs
- **Fuzzy Matching**: Matches skills and industries with variations (e.g., "Project Management" vs "Project Mgmt")
- **Flexible Validation**: Allows work experience entries with missing dates

#### **✅ User Experience**

- **Status Updates**: Clear progress indicators (uploading → parsing → polling → complete)
- **Error Messages**: User-friendly error messages with actionable guidance
- **Mobile Responsive**: Optimized for mobile devices
- **Progress Tracking**: Visual progress bar during processing

### Implementation Details

#### **Text Extraction**

Text extraction happens during file upload in `profile-cv-upload.js`:

- **PDF**: Uses `pdf-parse` library
- **DOCX**: Uses `mammoth` library
- **Caching**: Extracted text stored in `extracted_text` column
- **Error Handling**: Extraction errors stored in `extraction_error` column

#### **OpenAI Integration**

CV parsing uses OpenAI GPT-4o-mini:

- **Model**: `gpt-4o-mini` (cost-effective for structured extraction)
- **Token Limit**: 4,500 tokens for CV text (truncated if longer)
- **Structured Output**: Returns JSON matching profile schema
- **Cost Tracking**: All API calls logged to `ai_usage_events` table

#### **Data Mapping**

The `profile-mapper.js` module handles:

- **Basic Info**: Maps to `users` and `consultant_profiles` tables
- **Work Experience**: Creates entries in `work_experience` table
- **Education**: Creates entries in `education` table
- **Skills**: Fuzzy matches to `skills` table, creates `user_skills` relationships
- **Industries**: Fuzzy matches to `industries` table, creates `user_industries` relationships
- **Certifications**: Creates entries in `certifications` table

### Frontend Components

#### **ProfileCVUpload.tsx**

Main component for CV upload in onboarding flow:

- **File Upload**: Drag & drop or click to browse
- **Status Management**: Handles all status states (idle, uploading, parsing, polling, complete, error, paste_fallback)
- **Polling Logic**: Polls `profile-parse-cv-status` every 2 seconds
- **Paste Fallback**: Conditional rendering of textarea for extraction errors
- **Error Recovery**: Retry options and clear error messages

#### **cv-parser-test.tsx**

Staff testing page with full feature set:

- **Testing Interface**: Upload CVs and view parsing results
- **Debug Information**: Shows extracted text, parsed data, and errors
- **All Features**: Includes paste fallback and status polling

### Recent Improvements (January 2025)

1. **Background Function Architecture**
   - Resolved timeout issues for complex CVs
   - Implemented asynchronous processing pattern
   - Added status polling mechanism

2. **Text Extraction Optimization**
   - Moved extraction to upload phase
   - Added caching to avoid re-extraction
   - Improved error handling

3. **Text Paste Fallback**
   - Automatic detection of extraction errors
   - User-friendly fallback interface
   - Direct text parsing endpoint

4. **Data Quality Enhancements**
   - Month name normalization
   - Location parsing and country mapping
   - Fuzzy matching for skills and industries
   - Flexible work experience validation

### Success Metrics

- ✅ **Timeout Resolution**: 100% of CVs process without timeout errors
- ✅ **Background Processing**: Complex CVs (30+ seconds) handled successfully
- ✅ **Fallback System**: Extraction errors automatically trigger paste fallback
- ✅ **Data Matching**: Improved skill/industry matching accuracy
- ✅ **Location Parsing**: City and country correctly extracted and mapped
- ✅ **Production Deployment**: All features deployed to production

---

## Phase 2: Conversational AI Profile Creation - IN PROGRESS 🔄

**Status**: Partially implemented, database schema ready  
**Target Completion**: TBD

### Architecture Overview

Phase 2 will enable users to create profiles through a conversational AI interface:

1. **Start Conversation** (`profile-ai-start.js`)
   - Initialize AI conversation session
   - Load existing profile data (if any)
   - Create `profile_drafts` record
   - Return initial assistant message

2. **Continue Conversation** (`profile-ai-continue.js`)
   - Process user responses
   - Update draft profile based on conversation
   - Maintain conversation history
   - Assess eligibility as profile builds

3. **Publish Profile** (`profile-ai-publish.js`)
   - Save completed draft to profile tables
   - Record profile creation event
   - Update profile completeness

### Database Schema

#### **profile_drafts Table**

```sql
CREATE TABLE profile_drafts (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  draft_json jsonb NOT NULL, -- Structured profile data
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'ready_for_review', 'completed', 'abandoned')),
  last_step text, -- 'basic_info', 'experience', 'education', 'skills', etc.
  source_file_ids uuid[], -- References to profile_source_files
  eligibility jsonb, -- Eligibility assessment
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);
```

#### **ai_usage_events Table**

```sql
CREATE TABLE ai_usage_events (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  feature text NOT NULL CHECK (feature IN ('profile_cv_parse', 'profile_ai_conversation', 'profile_eligibility_check')),
  model text NOT NULL, -- 'gpt-4o-mini', 'gpt-4o', etc.
  prompt_tokens integer NOT NULL,
  completion_tokens integer NOT NULL,
  total_tokens integer NOT NULL,
  cost_estimate_usd numeric(10, 6),
  metadata jsonb, -- Additional context
  created_at timestamp with time zone DEFAULT now()
);
```

#### **profile_creation_events Table**

```sql
CREATE TABLE profile_creation_events (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  method text NOT NULL CHECK (method IN ('manual', 'cv_upload', 'ai_conversational')),
  metadata jsonb, -- {source_file_id, draft_id, ai_call_count, etc.}
  created_at timestamp with time zone DEFAULT now()
);
```

### Current Implementation Status

#### **✅ Completed**

- Database schema (migrations/012_ai_profile_creation_tables.sql)
- Backend functions (`profile-ai-start.js`, `profile-ai-continue.js`, `profile-ai-publish.js`)
- OpenAI conversation client (`lib/openai-client.js`)
- Profile mapping utilities (`lib/profile-mapper.js`)

#### **🔄 In Progress**

- Frontend components (`ProfileAIChat.tsx`, `ProfileAIFlow.tsx`)
- Onboarding integration
- Eligibility assessment integration
- Draft persistence and resume functionality

#### **📋 Planned**

- Conversation history management
- Multi-turn conversation optimization
- Cost optimization strategies
- User testing and feedback integration

### Key Design Decisions

#### **Model Selection**

- **Primary**: GPT-4o-mini (cost-effective, high quality for structured extraction)
- **Fallback**: GPT-4o (for complex cases requiring higher reasoning)

#### **Cost Optimization**

- **Structured Outputs**: Use OpenAI's structured outputs to minimize retries
- **Text Caching**: Cache extracted text to avoid re-extraction
- **Conversation Summarization**: Summarize conversation history every 5 turns
- **Delta Updates**: Send only changed fields in later conversation turns

#### **User Experience**

- **Progressive Disclosure**: Build profile step-by-step (basic info → experience → education → skills)
- **Draft Persistence**: Users can save and resume later
- **Eligibility Feedback**: Real-time eligibility assessment as profile builds
- **Review Before Publish**: Final review step before saving to profile

---

## Technical Stack

### Backend

- **Netlify Functions**: Serverless functions for API endpoints
- **Supabase**: PostgreSQL database with RLS policies
- **OpenAI API**: GPT-4o-mini for CV parsing and conversations
- **Text Extraction**: `pdf-parse` (PDF), `mammoth` (DOCX)

### Frontend

- **React + TypeScript**: Component-based UI
- **shadcn/ui**: UI component library
- **Tailwind CSS**: Styling
- **Supabase Client**: Database and storage access

### Security

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: All functions require valid JWT tokens
- **Service Role Key**: Only used server-side for privileged operations
- **File Validation**: File type and size validation before upload

---

## Future Enhancements

### Short Term

1. **Eligibility Assessment**: Re-implement as separate function
2. **Batch Processing**: Support multiple document uploads
3. **Parsing Analytics**: Track success rates and common errors
4. **Error Reporting**: Enhanced error reporting for debugging

### Long Term

1. **Multi-Document Support**: Parse CV + portfolio + certifications together
2. **AI Model Selection**: Automatic fallback to GPT-4o for complex cases
3. **Cost Optimization**: Further reduce token usage and API calls
4. **Conversational Flow**: Complete Phase 2 implementation
5. **Analytics Dashboard**: Staff dashboard for AI usage and profile creation metrics

---

## Related Documentation

- **Database Migrations**: `migrations/012_ai_profile_creation_tables.sql`
- **Backend Functions**: `netlify/functions/profile-*.js`
- **Frontend Components**: `src/components/profile/Profile*.tsx`
- **OpenAI Client**: `netlify/functions/lib/openai-client.js`
- **Profile Mapper**: `netlify/functions/lib/profile-mapper.js`

---

## Changelog

### January 2025

- ✅ Implemented background function architecture for CV parsing
- ✅ Added text extraction during file upload
- ✅ Created text paste fallback for extraction errors
- ✅ Enhanced data mapping with fuzzy matching and location parsing
- ✅ Improved error handling and user experience
- ✅ Deployed to production on main branch

### Previous Updates

- Initial Phase 1 implementation
- Database schema creation
- Basic CV upload and parsing
- OpenAI integration

---

*Last Updated: January 2025*

