import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';

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

export default function OnboardingStep3() {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Form state
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

  // Load existing work experience on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const { data: workExpData } = await supabase
            .from('work_experience')
            .select('*')
            .eq('user_id', user.id)
            .order('start_date_year', { ascending: false })
            .order('start_date_month', { ascending: false });

          if (workExpData) {
            setWorkExperiences(workExpData);
          }
        }
      } catch (error) {
        console.error('Error loading work experience:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

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
    setEditingExperience(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (experience: WorkExperience) => {
    setFormData({ ...experience });
    setEditingExperience(experience);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (field: keyof WorkExperience, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.company || !formData.job_title || !formData.start_date_month || !formData.start_date_year) {
      return; // Required fields validation
    }

    setSaving(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.error('No user found');
        return;
      }

      const experienceData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      if (editingExperience?.id) {
        // Update existing experience
        const { error } = await supabase
          .from('work_experience')
          .update(experienceData)
          .eq('id', editingExperience.id);

        if (error) throw error;

        setWorkExperiences(prev => {
          const updated = prev.map(exp => 
            exp.id === editingExperience.id 
              ? { ...experienceData, id: editingExperience.id }
              : exp
          );
          return updated.sort((a, b) => {
            // Sort by year first (descending), then by month (descending)
            if (a.start_date_year !== b.start_date_year) {
              return b.start_date_year - a.start_date_year;
            }
            // If years are equal, sort by month (descending)
            const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthOrder.indexOf(b.start_date_month) - monthOrder.indexOf(a.start_date_month);
          });
        });
      } else {
        // Add new experience
        const { data, error } = await supabase
          .from('work_experience')
          .insert([experienceData])
          .select()
          .single();

        if (error) throw error;

        setWorkExperiences(prev => {
          const updated = [data, ...prev];
          return updated.sort((a, b) => {
            // Sort by year first (descending), then by month (descending)
            if (a.start_date_year !== b.start_date_year) {
              return b.start_date_year - a.start_date_year;
            }
            // If years are equal, sort by month (descending)
            const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthOrder.indexOf(b.start_date_month) - monthOrder.indexOf(a.start_date_month);
          });
        });
      }

      closeModal();
    } catch (error) {
      console.error('Error saving work experience:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteExperience = async (id: number) => {
    try {
      const { error } = await supabase
        .from('work_experience')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorkExperiences(prev => prev.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting work experience:', error);
    }
  };

  const handleContinue = () => {
    navigate('/onboarding/step4');
  };

  const handleBack = () => {
    navigate('/onboarding/step2');
  };

  const handleSkip = () => {
    navigate('/onboarding/step4');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-slate-600">Loading work experience...</div>
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
                  step === 3 
                    ? 'bg-[#012E46] text-white' 
                    : step < 3
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 6 && (
                  <div className={`w-6 sm:w-8 lg:w-12 h-1 mx-1 sm:mx-2 ${
                    step < 3 ? 'bg-green-500' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#012E46] mb-2">Your work experience</h1>
          <p className="text-slate-600">Only include recent and relevant work experience. Highlight skills and experiences relevant to the gigs you're applying for.</p>
        </div>

        {/* Work Experience List */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {workExperiences.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">No work experience added yet</p>
                <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Work Experience
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {workExperiences.map((experience, index) => (
                  <div key={experience.id || index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{experience.job_title}</h3>
                      <p className="text-slate-600">{experience.company}</p>
                      <p className="text-sm text-slate-500">
                        {experience.start_date_month} {experience.start_date_year} - {
                          experience.currently_working 
                            ? 'Present' 
                            : `${experience.end_date_month} ${experience.end_date_year}`
                        }
                      </p>
                      {experience.city && (
                        <p className="text-sm text-slate-500">{experience.city}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(experience)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => experience.id && deleteExperience(experience.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                ))}
                <Button onClick={openAddModal} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Work Experience
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="px-6"
          >
            Back
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="px-6"
            >
              I'll do this later
            </Button>
            <Button
              onClick={handleContinue}
              disabled={workExperiences.length === 0}
              className="px-6"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Work Experience Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#012E46] mb-4">
                {editingExperience ? 'Edit Work Experience' : 'Add Work Experience'}
              </h2>
              
              <div className="space-y-4">
                {/* Job Title */}
                <div>
                  <Label htmlFor="job_title" className="text-sm font-medium">
                    Job title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="job_title"
                    placeholder="E.g. Cyber Security Specialist"
                    value={formData.job_title}
                    onChange={(e) => handleInputChange('job_title', e.target.value)}
                  />
                </div>

                {/* Company */}
                <div>
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company"
                    placeholder="E.g. JP Morgan"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">
                    City (Optional)
                  </Label>
                  <Input
                    id="city"
                    placeholder="E.g. Johannesburg"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <Label className="text-sm font-medium">
                    Start date <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.start_date_month}
                      onValueChange={(value) => handleInputChange('start_date_month', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
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
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <Label className="text-sm font-medium">
                    End date <span className="text-red-500">*</span>
                  </Label>
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
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
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
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Currently Working Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="currently_working"
                    checked={formData.currently_working}
                    onChange={(e) => handleInputChange('currently_working', e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <Label htmlFor="currently_working" className="text-sm">
                    I am currently working in this role
                  </Label>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Type here..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    maxLength={2000}
                    rows={4}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.description?.length || 0}/2000 characters
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={saving || !formData.company || !formData.job_title || !formData.start_date_month || !formData.start_date_year}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? 'Saving...' : (editingExperience ? 'Update Work Experience' : 'Add Work Experience')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
