import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, File, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { uploadProjectAttachment } from '@/lib/storage';
import { getCurrentUser } from '@/lib/getCurrentUser';

interface Attachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploading?: boolean;
  error?: string;
}

export default function GigCreationStep3() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    // Load data from session storage
    const loadStepData = () => {
      try {
        const savedData = sessionStorage.getItem('gigCreationData');
        if (savedData) {
          const data = JSON.parse(savedData);
          if (data.attachments) {
            setAttachments(data.attachments);
          }
        }
      } catch (error) {
        console.error('Error loading step data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStepData();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (attachments.length + files.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} files. You currently have ${attachments.length} files.`);
      return;
    }

    const newAttachments: Attachment[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploading: false
    }));

    // Validate file sizes
    const oversizedFiles = newAttachments.filter(att => att.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`The following files are too large (max 10MB): ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setAttachments(prev => [...prev, ...newAttachments]);

    // Upload files
    for (const attachment of newAttachments) {
      await uploadFile(attachment);
    }
  };

  const uploadFile = async (attachment: Attachment) => {
    try {
      setAttachments(prev => 
        prev.map(att => 
          att.id === attachment.id 
            ? { ...att, uploading: true, error: undefined }
            : att
        )
      );

      // Get current user ID
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const result = await uploadProjectAttachment(attachment.file, user.id);
      
      if (result.success && result.url) {
        setAttachments(prev => 
          prev.map(att => 
            att.id === attachment.id 
              ? { ...att, uploading: false, url: result.url }
              : att
          )
        );
      } else {
        setAttachments(prev => 
          prev.map(att => 
            att.id === attachment.id 
              ? { ...att, uploading: false, error: result.error || 'Upload failed' }
              : att
          )
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      setAttachments(prev => 
        prev.map(att => 
          att.id === attachment.id 
            ? { ...att, uploading: false, error: 'Upload failed' }
            : att
        )
      );
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const isValid = true; // Attachments are optional

  const handleContinue = () => {
    // Update session storage with step 3 data
    const savedData = sessionStorage.getItem('gigCreationData');
    const data = savedData ? JSON.parse(savedData) : {};
    
    const updatedData = {
      ...data,
      attachments: attachments
    };
    
    sessionStorage.setItem('gigCreationData', JSON.stringify(updatedData));
    navigate('/gig-creation/step4');
  };

  const handleBack = () => {
    navigate('/gig-creation/step2');
  };

  const handleSkip = () => {
    navigate('/gig-creation/step4');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="text-2xl font-bold text-[#012E46]">GigExecs</div>
            <div className="ml-auto text-sm text-slate-500">Step 3 of 5</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Project Attachments
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Enhance the quality of bids by illustrating your requirements clearly and providing any additional information as attachments.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* File Upload Area */}
              <div>
                <Label className="text-lg font-semibold text-slate-900">
                  Upload Files (Optional)
                </Label>
                <p className="text-sm text-slate-600 mt-1 mb-4">
                  Upload up to {MAX_FILES} files to help professionals understand your project better
                </p>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-slate-400 mb-4" />
                    <p className="text-lg font-medium text-slate-700 mb-2">
                      Click to upload files
                    </p>
                    <p className="text-sm text-slate-500">
                      PDF, DOC, DOCX, TXT, JPG, PNG, GIF, ZIP, RAR (max 10MB each)
                    </p>
                  </label>
                </div>

                {/* File List */}
                {attachments.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold text-slate-900">Uploaded Files</h3>
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-slate-500" />
                          <div>
                            <p className="font-medium text-slate-900">{attachment.name}</p>
                            <p className="text-sm text-slate-500">
                              {formatFileSize(attachment.size)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {attachment.uploading && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <span className="text-sm">Uploading...</span>
                            </div>
                          )}
                          
                          {attachment.error && (
                            <div className="flex items-center gap-2 text-red-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm">Failed</span>
                            </div>
                          )}
                          
                          {attachment.url && !attachment.uploading && (
                            <div className="flex items-center gap-2 text-green-600">
                              <span className="text-sm">✓ Uploaded</span>
                            </div>
                          )}
                          
                          <button
                            onClick={() => removeAttachment(attachment.id)}
                            className="p-1 hover:bg-slate-200 rounded"
                          >
                            <X className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Attachment Guidelines</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Include project briefs, wireframes, or design mockups</li>
                  <li>• Attach relevant documents, specifications, or requirements</li>
                  <li>• Provide examples of similar work or inspiration</li>
                  <li>• Keep files under 10MB each for faster uploads</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-200">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Back to Cost & Timeline
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Skip Attachments
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!isValid}
                className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Continue to Screening Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
