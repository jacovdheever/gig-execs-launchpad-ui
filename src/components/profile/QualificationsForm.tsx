import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GraduationCap, Calendar, Award, FileText, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Qualification {
  id: number;
  institution_name: string;
  degree_level: string;
  grade?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  file_url?: string;
}

interface QualificationsFormProps {
  qualifications: Qualification[];
  onAdd: (qualification: Omit<Qualification, 'id'>) => Promise<void>;
  onEdit: (id: number, qualification: Omit<Qualification, 'id'>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUploadFile: (file: File) => Promise<string>;
  isLoading?: boolean;
}

export function QualificationsForm({ 
  qualifications, 
  onAdd, 
  onEdit, 
  onDelete, 
  onUploadFile,
  isLoading = false 
}: QualificationsFormProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    institution_name: '',
    degree_level: '',
    grade: '',
    start_date: '',
    end_date: '',
    description: '',
    file_url: '',
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      institution_name: '',
      degree_level: '',
      grade: '',
      start_date: '',
      end_date: '',
      description: '',
      file_url: '',
    });
    setEditingId(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    

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
    
    if (!formData.institution_name || !formData.degree_level) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in institution name and degree level.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingId) {
        await onEdit(editingId, formData);
        toast({
          title: 'Qualification updated',
          description: 'Qualification has been updated successfully.',
        });
      } else {
        await onAdd(formData);
        toast({
          title: 'Qualification added',
          description: 'Qualification has been added successfully.',
        });
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save qualification. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (qualification: Qualification) => {
    setFormData({
      institution_name: qualification.institution_name,
      degree_level: qualification.degree_level,
      grade: qualification.grade || '',
      start_date: qualification.start_date || '',
      end_date: qualification.end_date || '',
      description: qualification.description || '',
      file_url: qualification.file_url || '',
    });
    setEditingId(qualification.id);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this qualification?')) {
      try {
        await onDelete(id);
        toast({
          title: 'Qualification deleted',
          description: 'Qualification has been deleted successfully.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete qualification. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const getDegreeLevelColor = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes('phd') || levelLower.includes('doctorate')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    if (levelLower.includes('master') || levelLower.includes('mba')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (levelLower.includes('bachelor') || levelLower.includes('degree')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          Educational Qualifications ({qualifications.length})
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-slate-50 text-slate-600">
            {qualifications.length >= 1 ? 'Complete' : 'Add qualification needed'}
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
                Add Qualification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Qualification' : 'Add Qualification'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Institution Name *</label>
                    <Input
                      value={formData.institution_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, institution_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Degree Level *</label>
                    <Input
                      value={formData.degree_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, degree_level: e.target.value }))}
                      placeholder="e.g., Bachelor's Degree, Master's, PhD"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Grade/GPA</label>
                    <Input
                      value={formData.grade}
                      onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                      placeholder="e.g., 3.8, First Class"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Start Date</label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">End Date</label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Additional details about your qualification..."
                  />
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
                            console.log('Qualification upload button clicked');
                            document.getElementById('qualification-file-upload')?.click();
                          }}
                        >
                          <Upload className="w-4 h-4" />
                          {isUploadingFile ? 'Uploading...' : 'Upload Document'}
                        </Button>
                        <input
                          id="qualification-file-upload"
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
                    {editingId ? 'Update' : 'Add'} Qualification
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {qualifications.map((qualification) => (
          <Card key={qualification.id} className="border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="w-5 h-5 text-slate-500" />
                    <h4 className="font-medium text-slate-900">
                      {qualification.institution_name}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className={getDegreeLevelColor(qualification.degree_level)}
                    >
                      {qualification.degree_level}
                    </Badge>
                    {qualification.grade && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {qualification.grade}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(qualification.start_date)} - {formatDate(qualification.end_date)}
                      </span>
                    </div>
                  </div>
                  
                  {qualification.description && (
                    <p className="text-slate-600 text-sm mt-2">{qualification.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {qualification.file_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(qualification.file_url, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(qualification)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(qualification.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
