import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  X,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ProfileCVUploadProps {
  onParseComplete: (data: ParsedProfileData) => void;
  onCancel?: () => void;
}

interface ParsedProfileData {
  sourceFileId: string;
  parsedData: {
    basicInfo: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      linkedinUrl?: string;
      location?: string;
      headline?: string;
    };
    workExperience: Array<{
      company: string;
      jobTitle: string;
      startDateMonth?: string;
      startDateYear?: number;
      endDateMonth?: string;
      endDateYear?: number;
      currentlyWorking?: boolean;
      description?: string;
      city?: string;
      country?: string;
    }>;
    education: Array<{
      institutionName: string;
      degreeLevel: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      grade?: string;
      description?: string;
    }>;
    skills: string[];
    certifications: Array<{
      name: string;
      awardingBody?: string;
      issueDate?: string;
      expiryDate?: string;
      credentialId?: string;
    }>;
    languages: Array<{
      language: string;
      proficiency: string;
    }>;
    summary?: string;
    estimatedYearsExperience?: number;
  };
  eligibility?: {
    yearsOfExperienceEstimate: number;
    meetsThreshold: boolean;
    confidence: 'low' | 'medium' | 'high';
    reasons: string[];
    seniorityIndicators?: string[];
  };
}

type UploadStatus = 'idle' | 'uploading' | 'parsing' | 'complete' | 'error';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ProfileCVUpload({ onParseComplete, onCancel }: ProfileCVUploadProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a PDF or Word document (.pdf, .doc, .docx)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast({
        title: 'Invalid file',
        description: validationError,
        variant: 'destructive'
      });
      return;
    }

    setSelectedFile(file);
    setError(null);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const uploadAndParse = async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    setProgress(10);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Please log in to upload your CV');
      }

      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(selectedFile);
      });

      setProgress(30);

      // Upload the file
      const uploadResponse = await fetch('/.netlify/functions/profile-cv-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fileData: base64Data,
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          fileType: 'cv'
        })
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }

      const uploadResult = await uploadResponse.json();
      setProgress(50);
      setStatus('parsing');

      // Parse the CV
      const parseResponse = await fetch('/.netlify/functions/profile-parse-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sourceFileId: uploadResult.sourceFileId
        })
      });

      setProgress(80);

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json();
        throw new Error(errorData.message || 'Failed to parse CV');
      }

      const parseResult = await parseResponse.json();
      setProgress(100);
      setStatus('complete');

      toast({
        title: 'CV parsed successfully!',
        description: 'Please review the extracted information below.',
      });

      // Pass the parsed data to parent
      onParseComplete({
        sourceFileId: uploadResult.sourceFileId,
        parsedData: parseResult.parsedData,
        eligibility: parseResult.eligibility
      });

    } catch (err) {
      console.error('Upload/parse error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to process CV',
        variant: 'destructive'
      });
    }
  };

  const resetUpload = () => {
    setStatus('idle');
    setProgress(0);
    setError(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading your CV...';
      case 'parsing':
        return 'Analyzing your CV with AI...';
      case 'complete':
        return 'CV processed successfully!';
      case 'error':
        return 'Something went wrong';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Import from CV</CardTitle>
        </div>
        <CardDescription>
          Upload your CV and our AI will extract your professional information to pre-fill your profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'idle' && (
          <>
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors duration-200
                ${isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                }
                ${selectedFile ? 'border-primary bg-primary/5' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleInputChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetUpload();
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-muted">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Drop your CV here or click to browse</p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, DOC, DOCX (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 justify-end">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button 
                onClick={uploadAndParse}
                disabled={!selectedFile}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Parse CV with AI
              </Button>
            </div>
          </>
        )}

        {(status === 'uploading' || status === 'parsing') && (
          <div className="space-y-4 py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">{getStatusMessage()}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {status === 'parsing' 
                    ? 'This may take a few seconds...' 
                    : 'Please wait...'}
                </p>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {status === 'complete' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-medium text-green-600">{getStatusMessage()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Review the extracted information below
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <div className="text-center">
                <p className="font-medium text-red-600">{getStatusMessage()}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {error || 'Please try again'}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button onClick={resetUpload} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProfileCVUpload;

