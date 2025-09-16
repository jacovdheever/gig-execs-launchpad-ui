import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Briefcase, Calendar, Play, FileText, Plus, Edit, Trash2, Upload, Tag, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Skill {
  id: number;
  name: string;
}

interface PortfolioItem {
  id: number;
  project_name: string;
  project_role?: string;
  description?: string;
  start_date?: string;
  completed_date?: string;
  currently_open?: boolean;
  solution_video_url?: string;
  solution_files?: string[];
  skills?: string[];
}

interface PortfolioFormProps {
  portfolio: PortfolioItem[];
  onAdd: (item: Omit<PortfolioItem, 'id'>) => Promise<void>;
  onEdit: (id: number, item: Omit<PortfolioItem, 'id'>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUploadFile: (file: File) => Promise<string>;
  isLoading?: boolean;
}

export function PortfolioForm({ 
  portfolio, 
  onAdd, 
  onEdit, 
  onDelete, 
  onUploadFile,
  isLoading = false 
}: PortfolioFormProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    project_role: '',
    description: '',
    start_date: '',
    completed_date: '',
    currently_open: false,
    solution_video_url: '',
    solution_files: [] as string[],
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');
  const { toast } = useToast();

  // Load available skills on component mount
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('id, name')
          .order('name');

        if (skillsError) {
          console.error('Error loading skills:', skillsError);
          return;
        }

        console.log('Skills loaded:', skillsData);
        setAvailableSkills(skillsData || []);
      } catch (error) {
        console.error('Error loading skills:', error);
      }
    };

    loadSkills();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSkillDropdown) {
        // Check if click is inside the dropdown
        const target = event.target as Element;
        const dropdown = target.closest('.skill-dropdown');
        if (!dropdown) {
          console.log('Clicking outside dropdown, closing');
          setShowSkillDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSkillDropdown]);

  const resetForm = () => {
    setFormData({
      project_name: '',
      project_role: '',
      description: '',
      start_date: '',
      completed_date: '',
      currently_open: false,
      solution_video_url: '',
      solution_files: [],
      skills: [],
    });
    setSelectedSkills([]);
    setNewSkill('');
    setEditingId(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    console.log('Files selected:', files.length);

    const fileArray = Array.from(files);
    const maxFiles = 5;
    
    if (formData.solution_files.length + fileArray.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `You can upload a maximum of ${maxFiles} files per project.`,
        variant: 'destructive',
      });
      return;
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'video/mp4', 'video/webm'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of fileArray) {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload images, PDFs, or videos only.',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > maxSize) {
        toast({
          title: 'File too large',
          description: 'Please upload files smaller than 10MB.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsUploadingFile(true);
    try {
      const uploadPromises = fileArray.map(file => onUploadFile(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        solution_files: [...prev.solution_files, ...uploadedUrls]
      }));
      
      toast({
        title: 'Files uploaded',
        description: `${fileArray.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload files. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      solution_files: prev.solution_files.filter((_, i) => i !== index)
    }));
  };

  // Filter skills based on search
  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.some(selected => selected.id === skill.id)
  );

  const addSkill = (skill: Skill) => {
    console.log('=== addSkill called ===');
    console.log('Adding skill:', skill.name, 'Current selected skills:', selectedSkills);
    console.log('Skill ID:', skill.id, 'Skill name:', skill.name);
    
    if (!selectedSkills.some(selected => selected.id === skill.id)) {
      const newSelectedSkills = [...selectedSkills, skill];
      console.log('New selected skills array:', newSelectedSkills);
      setSelectedSkills(newSelectedSkills);
      setSkillSearch('');
      setShowSkillDropdown(false);
      console.log('=== addSkill completed ===');
    } else {
      console.log('Skill already selected, not adding');
    }
  };

  const removeSkill = (skillId: number) => {
    console.log('Removing skill with ID:', skillId);
    setSelectedSkills(selectedSkills.filter(skill => skill.id !== skillId));
  };

  const handleAddCustomSkill = () => {
    if (newSkill.trim() && !selectedSkills.some(skill => skill.name === newSkill.trim())) {
      const customSkill: Skill = {
        id: Date.now(), // Use timestamp as temporary ID for custom skills
        name: newSkill.trim()
      };
      setSelectedSkills([...selectedSkills, customSkill]);
      setNewSkill('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.project_name) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in project name.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Convert selectedSkills to string array for formData
      const skillsArray = selectedSkills.map(skill => skill.name);
      const formDataWithSkills = {
        ...formData,
        skills: skillsArray
      };

      if (editingId) {
        await onEdit(editingId, formDataWithSkills);
        toast({
          title: 'Portfolio item updated',
          description: 'Portfolio item has been updated successfully.',
        });
      } else {
        await onAdd(formDataWithSkills);
        toast({
          title: 'Portfolio item added',
          description: 'Portfolio item has been added successfully.',
        });
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save portfolio item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    console.log('Editing item with skills:', item.skills);
    
    // Convert skills array to Skill objects for selectedSkills
    const skillsAsObjects: Skill[] = (item.skills || []).map((skillName, index) => ({
      id: Date.now() + index, // Temporary ID for existing skills
      name: skillName
    }));
    
    setFormData({
      project_name: item.project_name,
      project_role: item.project_role || '',
      description: item.description || '',
      start_date: item.start_date || '',
      completed_date: item.completed_date || '',
      currently_open: item.currently_open || false,
      solution_video_url: item.solution_video_url || '',
      solution_files: item.solution_files || [],
      skills: item.skills || [],
    });
    setSelectedSkills(skillsAsObjects);
    setEditingId(item.id);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await onDelete(id);
        toast({
          title: 'Portfolio item deleted',
          description: 'Portfolio item has been deleted successfully.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete portfolio item. Please try again.',
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
    });
  };

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension || '')) {
      return <FileText className="w-4 h-4 text-red-500" />;
    }
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <FileText className="w-4 h-4 text-blue-500" />;
    }
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          Portfolio Projects ({portfolio.length})
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-slate-50 text-slate-600">
            {portfolio.length >= 1 ? 'Complete' : 'Add project needed'}
          </Badge>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                onClick={() => {
                  resetForm();
                  setEditingId(null);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Project Name *</label>
                    <Input
                      value={formData.project_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Your Role</label>
                    <Input
                      value={formData.project_role}
                      onChange={(e) => setFormData(prev => ({ ...prev, project_role: e.target.value }))}
                      placeholder="e.g., Lead Developer, Project Manager"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    placeholder="Describe the project, your contributions, and key achievements..."
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
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
                      value={formData.completed_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, completed_date: e.target.value }))}
                      disabled={formData.currently_open}
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.currently_open}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          currently_open: e.target.checked,
                          completed_date: e.target.checked ? '' : prev.completed_date
                        }))}
                        className="rounded"
                      />
                      Currently Active
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Skills Used</label>
                  <div className="space-y-2">
                    {/* Skills from database */}
                    <div className="relative">
                      <Input
                        value={skillSearch}
                        onChange={(e) => {
                          setSkillSearch(e.target.value);
                          setShowSkillDropdown(true);
                        }}
                        onFocus={() => setShowSkillDropdown(true)}
                        placeholder="Search and select skills..."
                        className="w-full"
                      />
                      {showSkillDropdown && skillSearch && (
                        <div className="skill-dropdown absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {console.log('Dropdown showing, filteredSkills:', filteredSkills)}
                          {console.log('selectedSkills:', selectedSkills)}
                          {filteredSkills.length > 0 ? (
                            filteredSkills.slice(0, 10).map((skill) => {
                              console.log('Rendering skill button:', skill);
                              return (
                                <button
                                  key={skill.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Skill button clicked:', skill);
                                    addSkill(skill);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                                >
                                  {skill.name}
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-3 py-2 text-sm text-slate-500">
                              No skills found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Custom skill input */}
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add custom skill..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSkill())}
                      />
                      <Button
                        type="button"
                        onClick={handleAddCustomSkill}
                        variant="outline"
                        size="sm"
                        disabled={!newSkill.trim()}
                      >
                        Add Custom
                      </Button>
                    </div>
                    
                    {/* Selected skills */}
                    {selectedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="bg-[#012E46] text-white px-3 py-1 rounded-full flex items-center gap-2"
                          >
                            <span>{skill.name}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill.id)}
                              className="hover:bg-blue-700 rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Solution Video URL</label>
                  <Input
                    type="url"
                    value={formData.solution_video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, solution_video_url: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Solution Files</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploadingFile}
                        className="flex items-center gap-2"
                        onClick={() => {
                          console.log('Upload button clicked');
                          document.getElementById('portfolio-files-upload')?.click();
                        }}
                      >
                        <Upload className="w-4 h-4" />
                        {isUploadingFile ? 'Uploading...' : 'Upload Files'}
                      </Button>
                      <input
                        id="portfolio-files-upload"
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.mp4,.webm"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="text-xs text-slate-500">
                        Max 5 files, 10MB each
                      </span>
                    </div>
                    
                    {formData.solution_files.length > 0 && (
                      <div className="space-y-2">
                        {formData.solution_files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                            <div className="flex items-center gap-2">
                              {getFileIcon(file)}
                              <span className="text-sm text-slate-700">
                                {file.split('/').pop()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(file, '_blank')}
                              >
                                View
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
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
                    {editingId ? 'Update' : 'Add'} Project
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {portfolio.map((item) => (
          <Card key={item.id} className="border border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {item.project_name}
                    </h4>
                    {item.project_role && (
                      <p className="text-sm text-slate-600">{item.project_role}</p>
                    )}
                  </div>
                  {item.currently_open && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {item.description}
                  </p>
                )}

                {/* Skills */}
                {item.skills && item.skills.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-500" />
                      <span className="text-xs font-medium text-slate-700">Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.skills.slice(0, 3).map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-slate-50 text-slate-700 border-slate-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {item.skills.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-slate-50 text-slate-700 border-slate-200"
                        >
                          +{item.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {formatDate(item.start_date)} - {item.currently_open ? 'Present' : formatDate(item.completed_date)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  {item.solution_video_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(item.solution_video_url, '_blank')}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Play className="w-3 h-3" />
                      Video
                    </Button>
                  )}
                  
                  {item.solution_files && item.solution_files.length > 0 && (
                    <div className="flex items-center gap-1">
                      {item.solution_files.slice(0, 2).map((file, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(file, '_blank')}
                          className="flex items-center gap-1 text-xs"
                        >
                          {getFileIcon(file)}
                          File {index + 1}
                        </Button>
                      ))}
                      {item.solution_files.length > 2 && (
                        <span className="text-xs text-slate-500">
                          +{item.solution_files.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
