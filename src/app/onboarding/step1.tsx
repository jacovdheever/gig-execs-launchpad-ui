import { useState, useRef, useCallback } from 'react';
import { ArrowLeft, FileText, User, Upload, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type UploadStatus = 'idle' | 'uploading' | 'parsing' | 'complete' | 'error';
type SelectedMethod = 'cv' | 'manual' | 'ai' | null;

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function OnboardingStep1() {
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getAuthToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

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
    setSelectedMethod('cv');
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

  const uploadAndParseCv = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setUploadProgress(10);
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
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(selectedFile);
      });

      setUploadProgress(30);

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
      setUploadProgress(50);
      setUploadStatus('parsing');

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

      setUploadProgress(80);

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json();
        throw new Error(errorData.message || 'Failed to parse CV');
      }

      const parseResult = await parseResponse.json();
      setUploadProgress(100);
      setUploadStatus('complete');

      // Store parsed data in sessionStorage for step2 to use
      sessionStorage.setItem('cvParsedData', JSON.stringify({
        sourceFileId: uploadResult.sourceFileId,
        parsedData: parseResult.parsedData,
        eligibility: parseResult.eligibility
      }));

      toast({
        title: 'CV processed successfully!',
        description: 'Your information has been extracted. Review it in the next step.',
      });

      // Navigate to step 2 after a brief delay
      setTimeout(() => {
        navigate('/onboarding/step2');
      }, 1500);

    } catch (err) {
      console.error('Upload/parse error:', err);
      setUploadStatus('error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to process CV',
        variant: 'destructive'
      });
    }
  };

  const handleContinue = () => {
    if (selectedMethod === 'cv' && selectedFile) {
      uploadAndParseCv();
    } else if (selectedMethod === 'manual') {
      // Clear any stored CV data
      sessionStorage.removeItem('cvParsedData');
      navigate('/onboarding/step2');
    } else if (selectedMethod === 'ai') {
      // Navigate to AI profile creation flow
      sessionStorage.removeItem('cvParsedData');
      navigate('/onboarding/ai-profile');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
    setError(null);
    setSelectedFile(null);
    setSelectedMethod(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
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

  const isProcessing = uploadStatus === 'uploading' || uploadStatus === 'parsing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="text-2xl font-bold text-[#012E46]">GigExecs</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Stepped Process Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 overflow-x-auto px-2 max-w-full">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center flex-shrink-0">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                  step === 1 
                    ? 'bg-[#012E46] text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 6 && (
                  <div className={`w-6 sm:w-8 lg:w-12 h-1 mx-1 sm:mx-2 ${
                    step === 1 ? 'bg-[#012E46]' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              {/* Title and Description */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#012E46] mb-3 sm:mb-4 text-center">
                  Choose Your Preferred Method to Input Your Information
                </h1>
                <p className="text-base sm:text-lg text-[#012E46] text-center">
                  Uploading your CV is quick and efficient. Our AI will extract your professional details and you can review everything before adding it to your GigExecs profile.
                </p>
              </div>

              {/* Processing State */}
              {isProcessing && (
                <div className="space-y-6 py-8">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-[#012E46]" />
                    <div className="text-center">
                      <p className="font-medium text-[#012E46]">{getStatusMessage()}</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {uploadStatus === 'parsing' 
                          ? 'This may take a few seconds...' 
                          : 'Please wait...'}
                      </p>
                    </div>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Success State */}
              {uploadStatus === 'complete' && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="p-4 rounded-full bg-green-100">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-green-600 text-lg">{getStatusMessage()}</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Redirecting to review your information...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {uploadStatus === 'error' && (
                <div className="space-y-4 py-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error || 'An error occurred'}</AlertDescription>
                  </Alert>
                  <div className="flex justify-center">
                    <Button onClick={resetUpload} variant="outline">
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {/* Selection Options - Only show when idle */}
              {uploadStatus === 'idle' && (
                <>
                  <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                    {/* CV Upload Option */}
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedMethod === 'cv' 
                          ? 'ring-2 ring-yellow-500 border-green-700' 
                          : 'border-green-700 hover:border-green-600'
                      }`}
                      onClick={() => {
                        setSelectedMethod('cv');
                        if (!selectedFile) {
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* CV Icon */}
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#012E46] rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          
                          {/* Text Content */}
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-semibold text-[#012E46] mb-1">
                              Upload your CV / Resume
                            </h3>
                            <p className="text-[#012E46] text-sm">
                              We'll complete your profile - simply upload your latest CV / Resume in Word or PDF format.
                            </p>
                            
                            {/* File Drop Zone */}
                            {selectedMethod === 'cv' && (
                              <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                                className={`
                                  mt-4 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                                  transition-colors duration-200
                                  ${isDragging 
                                    ? 'border-[#012E46] bg-blue-50' 
                                    : 'border-slate-300 hover:border-[#012E46] hover:bg-slate-50'
                                  }
                                  ${selectedFile ? 'border-green-500 bg-green-50' : ''}
                                `}
                              >
                                {selectedFile ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <FileText className="h-5 w-5 text-green-600" />
                                    <span className="font-medium text-green-700">{selectedFile.name}</span>
                                    <span className="text-sm text-slate-500">
                                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-6 w-6 text-slate-400" />
                                    <span className="text-sm text-slate-600">
                                      Drop your file here or click to browse
                                    </span>
                                    <span className="text-xs text-slate-400">
                                      PDF, DOC, DOCX (max 10MB)
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleInputChange}
                      className="hidden"
                    />

                    {/* AI Assistant Option */}
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedMethod === 'ai' 
                          ? 'ring-2 ring-yellow-500 border-green-700' 
                          : 'border-green-700 hover:border-green-600'
                      }`}
                      onClick={() => {
                        setSelectedMethod('ai');
                        setSelectedFile(null);
                      }}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* AI Icon */}
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          
                          {/* Text Content */}
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-semibold text-[#012E46] mb-1">
                              Create with AI Assistant
                            </h3>
                            <p className="text-[#012E46] text-sm">
                              Have a conversation with our AI to build your profile. Answer questions and we'll create a professional profile for you.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Manual Input Option */}
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedMethod === 'manual' 
                          ? 'ring-2 ring-yellow-500 border-green-700' 
                          : 'border-green-700 hover:border-green-600'
                      }`}
                      onClick={() => {
                        setSelectedMethod('manual');
                        setSelectedFile(null);
                      }}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Manual Input Icon */}
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          
                          {/* Text Content */}
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-semibold text-[#012E46] mb-1">
                              Input information manually
                            </h3>
                            <p className="text-[#012E46]">
                              Build your profile step by step with custom information
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Continue Button */}
                  <div className="text-center">
                    <Button
                      onClick={handleContinue}
                      disabled={!selectedMethod || (selectedMethod === 'cv' && !selectedFile)}
                      className="px-8 py-3 text-lg bg-gradient-to-r from-[#012E46] to-[#4885AA] hover:from-[#011E36] hover:to-[#3A7A9A] text-white border-0 disabled:opacity-50"
                    >
                      {selectedMethod === 'ai' ? 'Start AI Conversation' : 'Continue'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
