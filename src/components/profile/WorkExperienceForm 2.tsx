import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Calendar, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface WorkExperience {
  id?: number;
  company: string;
  job_title: string;
  city?: string;
  country_id?: number;
  start_date_month: string;
  start_date_year: number;
  end_date_month?: string;
  end_date_year?: number;
  currently_working: boolean;
  description?: string;
}

interface WorkExperienceFormProps {
  workExperiences: WorkExperience[];
  onAdd: (experience: Omit<WorkExperience, 'id'>) => Promise<void>;
  onEdit: (id: number, experience: Omit<WorkExperience, 'id'>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isLoading?: boolean;
}

export function WorkExperienceForm({ 
  workExperiences, 
  onAdd, 
  onEdit, 
  onDelete,
  isLoading = false 
}: WorkExperienceFormProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<WorkExperience>({
    company: '',
    job_title: '',
    city: '',
    country_id: undefined,
    start_date_month: '',
    start_date_year: new Date().getFullYear(),
    end_date_month: '',
    end_date_year: new Date().getFullYear(),
    currently_working: false,
    description: ''
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      company: '',
      job_title: '',
      city: '',
      country_id: undefined,
      start_date_month: '',
      start_date_year: new Date().getFullYear(),
      end_date_month: '',
      end_date_year: new Date().getFullYear(),
      currently_working: false,
      description: ''
    });
    setEditingId(null);
  };

  const handleInputChange = (field: keyof WorkExperience, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.job_title || !formData.start_date_month || !formData.start_date_year) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in company, job title, and start date.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingId) {
        await onEdit(editingId, formData);
        toast({
          title: 'Work experience updated',
          description: 'Work experience has been updated successfully.',
        });
      } else {
        await onAdd(formData);
        toast({
          title: 'Work experience added',
          description: 'Work experience has been added successfully.',
        });
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save work experience. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (experience: WorkExperience) => {
    setFormData({ ...experience });
    setEditingId(experience.id!);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this work experience?')) {
      try {
        await onDelete(id);
        toast({
          title: 'Work experience deleted',
          description: 'Work experience has been deleted successfully.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete work experience. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const formatDateRange = (experience: WorkExperience) => {
    const startDate = `${experience.start_date_month} ${experience.start_date_year}`;
    const endDate = experience.currently_working 
      ? 'Present' 
      : `${experience.end_date_month} ${experience.end_date_year}`;
    return `${startDate} - ${endDate}`;
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          Work Experience ({workExperiences.length})
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-slate-50 text-slate-600">
            {workExperiences.length >= 1 ? 'Complete' : 'Add work experience needed'}
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
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Work Experience' : 'Add Work Experience'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Job Title *</label>
                    <Input
                      value={formData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                      placeholder="E.g. Cyber Security Specialist"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Company *</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="E.g. JP Morgan"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">City (Optional)</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="E.g. Johannesburg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Start Date *</label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.start_date_month}
                      onValueChange={(value) => handleInputChange('start_date_month', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.start_date_year.toString()}
                      onValueChange={(value) => handleInputChange('start_date_year', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">End Date *</label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.end_date_month}
                      onValueChange={(value) => handleInputChange('end_date_month', value)}
                      disabled={formData.currently_working}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.end_date_year?.toString()}
                      onValueChange={(value) => handleInputChange('end_date_year', parseInt(value))}
                      disabled={formData.currently_working}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="currently_working"
                    checked={formData.currently_working}
                    onChange={(e) => handleInputChange('currently_working', e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <label htmlFor="currently_working" className="text-sm text-slate-700">
                    I am currently working in this role
                  </label>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Description (Optional)</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Type here..."
                    maxLength={2000}
                    rows={4}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.description?.length || 0}/2000 characters
                  </p>
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
                    {editingId ? 'Update' : 'Add'} Experience
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {workExperiences.map((experience) => (
          <Card key={experience.id} className="border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-5 h-5 text-slate-500" />
                    <h4 className="font-medium text-slate-900">
                      {experience.job_title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {experience.company}
                    </Badge>
                    {experience.currently_working && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Current
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(experience)}</span>
                    </div>
                    {experience.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.city}</span>
                      </div>
                    )}
                  </div>
                  
                  {experience.description && (
                    <p className="text-slate-600 text-sm mt-2">{experience.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(experience)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(experience.id!)}
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
