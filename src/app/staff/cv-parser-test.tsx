/**
 * Staff CV Parser Test Page
 * 
 * Allows staff to test CV parsing functionality without going through onboarding
 */

import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { StaffRoute, useStaffUser } from '@/components/staff/StaffRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  X,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type UploadStatus = 'idle' | 'uploading' | 'parsing' | 'complete' | 'error';

interface ParsedResult {
  sourceFileId: string;
  extractedText?: string;
  parsedData: any;
  eligibility?: any;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costEstimate: number;
  };
}

export default function CVParserTestPage() {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedResult | null>(null);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { staff } = useStaffUser();
  const navigate = useNavigate();
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
    setParsedResult(null);
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
        throw new Error(errorData.error || errorData.message || 'Failed to upload file');
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
        throw new Error(errorData.error || errorData.message || 'Failed to parse CV');
      }

      const parseResult = await parseResponse.json();
      setProgress(100);
      setStatus('complete');

      toast({
        title: 'CV parsed successfully!',
        description: 'Review the extracted information below.',
      });

      // Store the parsed result
      setParsedResult({
        sourceFileId: uploadResult.sourceFileId,
        extractedText: parseResult.extractedText,
        parsedData: parseResult.parsedData,
        eligibility: parseResult.eligibility,
        usage: parseResult.usage
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

  const resetTest = () => {
    setStatus('idle');
    setProgress(0);
    setError(null);
    setSelectedFile(null);
    setParsedResult(null);
    setShowExtractedText(false);
    setShowRawJson(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'The text has been copied to your clipboard.',
    });
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading CV...';
      case 'parsing':
        return 'Analyzing CV with AI...';
      case 'complete':
        return 'CV processed successfully!';
      case 'error':
        return 'Something went wrong';
      default:
        return '';
    }
  };

  const getDataCounts = () => {
    if (!parsedResult?.parsedData) return null;

    const data = parsedResult.parsedData;
    return {
      workExperience: data.workExperience?.length || 0,
      education: data.education?.length || 0,
      skills: data.skills?.length || 0,
      certifications: data.certifications?.length || 0,
      languages: data.languages?.length || 0,
    };
  };

  return (
    <StaffRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="w-full max-w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/staff/dashboard')}
                className="flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                  CV Parser Test
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Test CV parsing functionality without creating new users
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload CV</CardTitle>
                <CardDescription>
                  Upload a PDF or Word document to test the parsing functionality
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
                              resetTest();
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
                              PDF, DOC, or DOCX (max 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedFile && (
                      <Button
                        onClick={uploadAndParse}
                        className="w-full"
                        size="lg"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Parse CV
                      </Button>
                    )}
                  </>
                )}

                {(status === 'uploading' || status === 'parsing') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{getStatusMessage()}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  </div>
                )}

                {status === 'error' && error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {status === 'complete' && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      CV parsed successfully! Review the results below.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {parsedResult && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Parsing Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {(() => {
                        const counts = getDataCounts();
                        if (!counts) return null;
                        return (
                          <>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{counts.workExperience}</div>
                              <div className="text-sm text-muted-foreground">Work Experience</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{counts.education}</div>
                              <div className="text-sm text-muted-foreground">Education</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{counts.skills}</div>
                              <div className="text-sm text-muted-foreground">Skills</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{counts.certifications}</div>
                              <div className="text-sm text-muted-foreground">Certifications</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{counts.languages}</div>
                              <div className="text-sm text-muted-foreground">Languages</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    {parsedResult.usage && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Prompt Tokens</div>
                            <div className="font-medium">{parsedResult.usage.promptTokens.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Completion Tokens</div>
                            <div className="font-medium">{parsedResult.usage.completionTokens.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Total Tokens</div>
                            <div className="font-medium">{parsedResult.usage.totalTokens.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Est. Cost</div>
                            <div className="font-medium">${parsedResult.usage.costEstimate.toFixed(4)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Eligibility Assessment */}
                {parsedResult.eligibility && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Eligibility Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Meets Threshold:</span>
                          <span className={parsedResult.eligibility.meetsThreshold ? 'text-green-600' : 'text-red-600'}>
                            {parsedResult.eligibility.meetsThreshold ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Years of Experience:</span>
                          <span>{parsedResult.eligibility.yearsOfExperienceEstimate || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Confidence:</span>
                          <span className="capitalize">{parsedResult.eligibility.confidence || 'N/A'}</span>
                        </div>
                        {parsedResult.eligibility.reasons && parsedResult.eligibility.reasons.length > 0 && (
                          <div className="mt-4">
                            <div className="font-medium mb-2">Reasons:</div>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {parsedResult.eligibility.reasons.map((reason: string, idx: number) => (
                                <li key={idx}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Extracted Text */}
                {parsedResult.extractedText && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Extracted Text</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(parsedResult.extractedText || '')}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowExtractedText(!showExtractedText)}
                          >
                            {showExtractedText ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                Show
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {showExtractedText && (
                      <CardContent>
                        <pre className="whitespace-pre-wrap text-xs bg-muted p-4 rounded-lg max-h-96 overflow-auto">
                          {parsedResult.extractedText}
                        </pre>
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Parsed Data */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Parsed Data</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(parsedResult.parsedData, null, 2))}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy JSON
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowRawJson(!showRawJson)}
                        >
                          {showRawJson ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide Raw JSON
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show Raw JSON
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showRawJson ? (
                      <pre className="whitespace-pre-wrap text-xs bg-muted p-4 rounded-lg max-h-96 overflow-auto">
                        {JSON.stringify(parsedResult.parsedData, null, 2)}
                      </pre>
                    ) : (
                      <div className="space-y-4">
                        {/* Basic Info */}
                        {parsedResult.parsedData.basicInfo && (
                          <div>
                            <h3 className="font-semibold mb-2">Basic Information</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(parsedResult.parsedData.basicInfo).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-muted-foreground capitalize">{key}:</span>{' '}
                                  <span>{value as string || 'N/A'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Work Experience */}
                        {parsedResult.parsedData.workExperience && parsedResult.parsedData.workExperience.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">Work Experience ({parsedResult.parsedData.workExperience.length})</h3>
                            <div className="space-y-2">
                              {parsedResult.parsedData.workExperience.map((exp: any, idx: number) => (
                                <div key={idx} className="border-l-2 border-primary pl-3 py-2">
                                  <div className="font-medium">{exp.jobTitle} at {exp.company}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {exp.startDateMonth} {exp.startDateYear} - {exp.currentlyWorking ? 'Present' : `${exp.endDateMonth} ${exp.endDateYear}`}
                                  </div>
                                  {exp.description && (
                                    <div className="text-sm mt-1">{exp.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education */}
                        {parsedResult.parsedData.education && parsedResult.parsedData.education.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">Education ({parsedResult.parsedData.education.length})</h3>
                            <div className="space-y-2">
                              {parsedResult.parsedData.education.map((edu: any, idx: number) => (
                                <div key={idx} className="border-l-2 border-primary pl-3 py-2">
                                  <div className="font-medium">{edu.degreeLevel} in {edu.fieldOfStudy}</div>
                                  <div className="text-sm text-muted-foreground">{edu.institutionName}</div>
                                  {edu.grade && (
                                    <div className="text-sm text-muted-foreground">Grade: {edu.grade}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {parsedResult.parsedData.skills && parsedResult.parsedData.skills.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">Skills ({parsedResult.parsedData.skills.length})</h3>
                            <div className="flex flex-wrap gap-2">
                              {parsedResult.parsedData.skills.map((skill: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Languages */}
                        {parsedResult.parsedData.languages && parsedResult.parsedData.languages.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">Languages ({parsedResult.parsedData.languages.length})</h3>
                            <div className="space-y-1">
                              {parsedResult.parsedData.languages.map((lang: any, idx: number) => (
                                <div key={idx} className="text-sm">
                                  <span className="font-medium">{lang.language}</span>
                                  {' - '}
                                  <span className="text-muted-foreground">{lang.proficiency}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Certifications */}
                        {parsedResult.parsedData.certifications && parsedResult.parsedData.certifications.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">Certifications ({parsedResult.parsedData.certifications.length})</h3>
                            <div className="space-y-2">
                              {parsedResult.parsedData.certifications.map((cert: any, idx: number) => (
                                <div key={idx} className="text-sm">
                                  <div className="font-medium">{cert.name}</div>
                                  {cert.awardingBody && (
                                    <div className="text-muted-foreground">by {cert.awardingBody}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Test Another CV Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={resetTest}
                    variant="outline"
                    size="lg"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Another CV
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaffRoute>
  );
}

