# File Matching Analysis - Source to Target System Migration

## 📁 Sample Files Analysis

### Files in File Uploads Folder:
1. `6095971960244979-59fdb868-5127-4e82-b141-2f3c1253fd77.jpg`
2. `6184698281513792-Mr. Geraldo2.jpg`  
3. `6192884863571064-identity_test_pdf.pdf`

### File Naming Pattern Analysis:
- **Pattern**: `{numeric_id}-{uuid_or_name}.{extension}`
- **Examples**:
  - `6095971960244979-59fdb868-5127-4e82-b141-2f3c1253fd77.jpg` (numeric_id + UUID)
  - `6184698281513792-Mr. Geraldo2.jpg` (numeric_id + name)
  - `6192884863571064-identity_test_pdf.pdf` (numeric_id + descriptive_name)

## 🔍 CSV Data File References Analysis

### File Reference Fields Found in CSV:
1. **`proofOfCertification`** - Certification documents
2. **`proofOfFormalEducation`** - Education certificates  
3. **`proofOfIdentity`** - ID documents
4. **`proofOfAddress`** - Address verification documents

### Sample File References from CSV:
- `"28862181639787465-Internal Auditor.png"`
- `"10950381241314666-Emmanuel Kwabena Owusu - 2024-07-31.pdf"`
- `"6659270522967844-1735824064432.jpg"`
- `"5313655428863735-1722636541727.jpg"`
- `"2823369668358149-NEBOSH_HSE_Certificate_in_PSM_-_Emmanuel_Owusu[1].pdf"`
- `"33770183530579345-1730662460489.jpg"`
- `"8570271444056625-Emmanuel Owusu certificate copy.pdf"`
- `"8346956878194045-ID.jpg"`

## 🎯 Matching Strategy

### Primary Matching Method: Numeric ID
- **Pattern**: Files start with numeric ID (e.g., `6095971960244979`, `6184698281513792`)
- **CSV References**: Also start with numeric ID (e.g., `28862181639787465`, `10950381241314666`)
- **Match Logic**: Extract numeric prefix from filename and match with CSV file references

### Secondary Matching Method: UUID
- **Pattern**: Some files have UUID after numeric ID (e.g., `59fdb868-5127-4e82-b141-2f3c1253fd77`)
- **CSV References**: Some references have UUIDs in the filename
- **Match Logic**: Extract UUID portion and match with CSV references

### Tertiary Matching Method: Descriptive Names
- **Pattern**: Some files have descriptive names (e.g., `Mr. Geraldo2`, `identity_test_pdf`)
- **CSV References**: Some references have descriptive names
- **Match Logic**: Fuzzy string matching on descriptive portions

## 📊 File Type Classification

### Based on File Extensions:
- **`.jpg/.jpeg`**: Profile photos, ID documents, certificates
- **`.pdf`**: Certificates, education documents, ID documents
- **`.png`**: Certificates, profile photos, documents

### Based on CSV Context:
- **`proofOfCertification`**: Certification documents
- **`proofOfFormalEducation`**: Education certificates
- **`proofOfIdentity`**: ID documents (passport, driver's license)
- **`proofOfAddress`**: Utility bills, bank statements

## 🚀 Implementation Plan

### Step 1: File Analysis Script
- Extract numeric IDs from all files in File Uploads folder
- Extract file references from CSV data
- Create mapping between numeric IDs and user records

### Step 2: Matching Algorithm
- Primary: Match by numeric ID prefix
- Secondary: Match by UUID if present
- Tertiary: Fuzzy string matching for descriptive names

### Step 3: Supabase Storage Upload
- Create appropriate storage buckets for each file type
- Upload files with proper naming convention
- Update user records with new file URLs

### Step 4: Database Integration
- Update `consultant_profiles` table with new file URLs
- Update `education` table with certificate URLs
- Update `certifications` table with proof URLs
- Update `users` table with profile photo URLs

## 🔧 Technical Implementation

### File Processing Pipeline:
1. **Scan File Uploads folder** for all files
2. **Extract metadata** (numeric ID, UUID, descriptive name)
3. **Parse CSV data** to extract file references
4. **Match files to users** using multiple strategies
5. **Upload to Supabase Storage** with proper organization
6. **Update database records** with new file URLs

### Storage Bucket Organization:
- `profile-photos/` - Profile pictures
- `certificates/` - Education and certification documents
- `id-documents/` - Identity verification documents
- `address-proofs/` - Address verification documents

### File Naming Convention:
- **New Format**: `{user_id}/{file_type}/{original_filename}`
- **Example**: `68878e6f-9efe-4213-806c-230bf5d849b4/certificates/ISO-45001-Internal-Auditor.png`

## 📈 Success Metrics

### Matching Accuracy:
- **Target**: 95%+ files matched to correct users
- **Fallback**: Manual review for unmatched files
- **Validation**: Cross-reference with user data for accuracy

### Upload Success:
- **Target**: 100% successful uploads to Supabase Storage
- **Error Handling**: Comprehensive logging and retry mechanisms
- **Verification**: File integrity checks post-upload

## 🎯 Next Steps

1. **Create file analysis script** to extract metadata
2. **Build matching algorithm** with multiple strategies
3. **Implement Supabase upload** with proper organization
4. **Test with sample files** to verify accuracy
5. **Scale to full dataset** with monitoring and logging
