import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Eye, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IdDocumentUploaderProps {
  currentDocumentUrl?: string;
  onUpload: (file: File) => Promise<string>;
  onRemove: () => Promise<void>;
  isLoading?: boolean;
}

export function IdDocumentUploader({ 
  currentDocumentUrl, 
  onUpload, 
  onRemove, 
  isLoading = false 
}: IdDocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('🔍 IdDocumentUploader: No file selected');
      return;
    }

    console.log('🔍 IdDocumentUploader: File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      console.log('🔍 IdDocumentUploader: File type validation failed:', file.type);
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, or PDF file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log('🔍 IdDocumentUploader: File size validation failed:', file.size, 'bytes');
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    console.log('🔍 IdDocumentUploader: File validation passed, starting upload');
    setIsUploading(true);
    try {
      const result = await onUpload(file);
      console.log('🔍 IdDocumentUploader: Upload completed successfully:', result);
      toast({
        title: 'Document uploaded',
        description: 'Your ID document has been uploaded successfully.',
      });
    } catch (error) {
      console.error('🔍 IdDocumentUploader: Upload failed:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove this document?')) {
      try {
        await onRemove();
        toast({
          title: 'Document removed',
          description: 'Your ID document has been removed.',
        });
      } catch (error) {
        toast({
          title: 'Remove failed',
          description: 'Failed to remove document. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const getFileIcon = (url: string) => {
    if (url.toLowerCase().includes('.pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <FileText className="w-8 h-8 text-blue-500" />;
  };

  const getFileType = (url: string) => {
    if (url.toLowerCase().includes('.pdf')) {
      return 'PDF Document';
    }
    return 'Image Document';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Proof of ID Document</h3>
        <Badge 
          variant="outline" 
          className={currentDocumentUrl ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600'}
        >
          {currentDocumentUrl ? 'Complete' : 'Required'}
        </Badge>
      </div>

      {currentDocumentUrl ? (
        <Card className="border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(currentDocumentUrl)}
                <div>
                  <p className="font-medium text-slate-900">
                    {getFileType(currentDocumentUrl)}
                  </p>
                  <p className="text-sm text-slate-500">
                    Uploaded successfully
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(currentDocumentUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
          <CardContent className="p-8">
            <div className="text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="font-medium text-slate-900 mb-2">
                Upload ID Document
              </h4>
              <p className="text-slate-500 text-sm mb-4">
                Upload a clear photo or scan of your government-issued ID
              </p>
              <p className="text-xs text-slate-400 mb-4">
                Accepted formats: JPEG, PNG, PDF (max 5MB)
              </p>
              
              <div className="flex justify-center">
                <label htmlFor="id-document-upload">
                  <Button
                    asChild
                    disabled={isLoading || isUploading}
                    className="flex items-center gap-2"
                  >
                    <span>
                      <Upload className="w-4 h-4" />
                      {isUploading ? 'Uploading...' : 'Choose File'}
                    </span>
                  </Button>
                </label>
                <input
                  id="id-document-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
