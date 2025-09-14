import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Award, Calendar, FileText, Plus, Edit, Trash2, Upload, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Certification {
  id: number;
  name: string;
  awarding_body: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  file_url?: string;
}

interface CertificationsFormProps {
  certifications: Certification[];
  onAdd: (certification: Omit<Certification, 'id'>) => Promise<void>;
  onEdit: (id: number, certification: Omit<Certification, 'id'>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUploadFile: (file: File) => Promise<string>;
  isLoading?: boolean;
}

export function CertificationsForm({ 
  certifications, 
  onAdd, 
  onEdit, 
  onDelete, 
  onUploadFile,
  isLoading = false 
}: CertificationsFormProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    awarding_body: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    file_url: '',
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      awarding_body: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: '',
      file_url: '',
    });
    setEditingId(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== Certifications handleFileUpload called ===');
    console.log('Event:', event);
    console.log('Target files:', event.target.files);
    
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected for certification');
      return;
    }
    
    console.log('File selected for certification:', file.name);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
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
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingFile(true);
    try {
      const fileUrl = await onUploadFile(file);
      setFormData(prev => ({ ...prev, file_url: fileUrl }));
      toast({
        title: 'File uploaded',
        description: 'Document has been uploaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.awarding_body) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in certification name and awarding body.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingId) {
        await onEdit(editingId, formData);
        toast({
          title: 'Certification updated',
          description: 'Certification has been updated successfully.',
        });
      } else {
        await onAdd(formData);
        toast({
          title: 'Certification added',
          description: 'Certification has been added successfully.',
        });
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save certification. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (certification: Certification) => {
    setFormData({
      name: certification.name,
      awarding_body: certification.awarding_body,
      issue_date: certification.issue_date || '',
      expiry_date: certification.expiry_date || '',
      credential_id: certification.credential_id || '',
      credential_url: certification.credential_url || '',
      file_url: certification.file_url || '',
    });
    setEditingId(certification.id);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await onDelete(id);
        toast({
          title: 'Certification deleted',
          description: 'Certification has been deleted successfully.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete certification. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow && expiry > new Date();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          Professional Certifications ({certifications.length})
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-slate-50 text-slate-600">
            {certifications.length >= 1 ? 'Complete' : 'Add certification needed'}
          </Badge>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Certification' : 'Add Certification'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Certification Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., AWS Solutions Architect"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Awarding Body *</label>
                    <Input
                      value={formData.awarding_body}
                      onChange={(e) => setFormData(prev => ({ ...prev, awarding_body: e.target.value }))}
                      placeholder="e.g., Amazon Web Services"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Issue Date</label>
                    <Input
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Expiry Date</label>
                    <Input
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Credential ID</label>
                    <Input
                      value={formData.credential_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, credential_id: e.target.value }))}
                      placeholder="e.g., AWS-123456"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Verification URL</label>
                    <Input
                      type="url"
                      value={formData.credential_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, credential_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Supporting Document</label>
                  <div className="flex items-center gap-4">
                    {formData.file_url ? (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">Document uploaded</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(formData.file_url, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isUploadingFile}
                          className="flex items-center gap-2"
                          onClick={() => {
                            console.log('Certification upload button clicked');
                            document.getElementById('certification-file-upload')?.click();
                          }}
                        >
                          <Upload className="w-4 h-4" />
                          {isUploadingFile ? 'Uploading...' : 'Upload Document'}
                        </Button>
                        <input
                          id="certification-file-upload"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <span className="text-xs text-slate-500">Optional</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {editingId ? 'Update' : 'Add'} Certification
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {certifications.map((certification) => {
          const expired = isExpired(certification.expiry_date);
          const expiringSoon = isExpiringSoon(certification.expiry_date);
          
          return (
            <Card key={certification.id} className="border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-slate-500" />
                      <h4 className="font-medium text-slate-900">
                        {certification.name}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {certification.awarding_body}
                      </Badge>
                      {certification.credential_id && (
                        <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                          ID: {certification.credential_id}
                        </Badge>
                      )}
                      {expired && (
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          Expired
                        </Badge>
                      )}
                      {expiringSoon && !expired && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          Expires Soon
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Issued: {formatDate(certification.issue_date)}
                        </span>
                      </div>
                      {certification.expiry_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className={expired ? 'text-red-600' : expiringSoon ? 'text-yellow-600' : ''}>
                            Expires: {formatDate(certification.expiry_date)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {certification.credential_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(certification.credential_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Verify
                      </Button>
                    )}
                    {certification.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(certification.file_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(certification)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(certification.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
