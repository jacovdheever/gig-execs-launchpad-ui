import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Save,
  X,
  Plus,
  Search
} from 'lucide-react';
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';

interface Project {
  id: number;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  currency: string;
  delivery_time_min: number;
  delivery_time_max: number;
  status: string;
  created_at: string;
  updated_at: string;
  skills_required: number[];
  creator_id: string;
  screening_questions?: string[];
  project_origin?: 'internal' | 'external';
  external_url?: string | null;
  expires_at?: string | null;
  source_name?: string | null;
  role_type?: string | null;
  gig_location?: string | null;
}

interface Skill {
  id: number;
  name: string;
}

export default function GigEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    budgetToBeConfirmed: false,
    currency: 'USD',
    duration: '',
    roleType: '',
    gigLocation: '',
    skills: [] as Skill[],
    screeningQuestions: [] as string[]
  });

  // Skills search
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const userData = await getCurrentUser();
      if (!userData) {
        navigate('/auth/login');
        return;
      }
      setUser(userData);

      // Load project and skills in parallel
      const [projectResult, skillsResult] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('creator_id', userData.id)
          .single(),
        supabase
          .from('skills')
          .select('id, name')
          .order('name')
      ]);

      if (projectResult.error) {
        console.error('Error loading project:', projectResult.error);
        navigate('/projects');
        return;
      }

      if (skillsResult.error) {
        console.error('Error loading skills:', skillsResult.error);
        return;
      }

      setSkills(skillsResult.data || []);

      // Parse project data
      const projectData = projectResult.data;
      let skills_required = [];
      try {
        skills_required = projectData.skills_required ? JSON.parse(projectData.skills_required) : [];
      } catch (error) {
        console.error('Error parsing skills_required:', error);
      }

      let screening_questions = [];
      try {
        screening_questions = projectData.screening_questions ? JSON.parse(projectData.screening_questions) : [];
      } catch (error) {
        console.error('Error parsing screening_questions:', error);
      }

      setProject(projectData);

      // Set form data
      const selectedSkills = skills_required.map(skillId => 
        skillsResult.data?.find(s => s.id === skillId)
      ).filter(Boolean) as Skill[];

      const budgetToBeConfirmed = projectData.budget_min == null && projectData.budget_max == null;
      const budgetValue = budgetToBeConfirmed ? '' : (projectData.budget_min?.toString() || '');

      setFormData({
        title: projectData.title || '',
        description: projectData.description || '',
        budget: budgetValue,
        budgetToBeConfirmed: budgetToBeConfirmed,
        currency: projectData.currency || 'USD',
        duration: getDurationFromDays(projectData.delivery_time_min, projectData.delivery_time_max),
        roleType: projectData.role_type || '',
        gigLocation: projectData.gig_location || '',
        skills: selectedSkills,
        screeningQuestions: screening_questions
      });

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDurationFromDays = (minDays: number, maxDays: number) => {
    if (minDays < 30) {
      return `${minDays}-${maxDays} days`;
    } else if (minDays < 365) {
      const minMonths = Math.round(minDays / 30);
      const maxMonths = Math.round(maxDays / 30);
      return `${minMonths}-${maxMonths} months`;
    } else {
      const minYears = Math.round(minDays / 365);
      const maxYears = Math.round(maxDays / 365);
      return `${minYears}-${maxYears} years`;
    }
  };

  const getDeliveryTimeFromDuration = (duration: string) => {
    if (duration.includes('days')) {
      const [min, max] = duration.replace(' days', '').split('-').map(Number);
      return { min, max };
    } else if (duration.includes('months')) {
      const [min, max] = duration.replace(' months', '').split('-').map(Number);
      return { min: min * 30, max: max * 30 };
    } else if (duration.includes('years')) {
      const [min, max] = duration.replace(' years', '').split('-').map(Number);
      return { min: min * 365, max: max * 365 };
    }
    return { min: 1, max: 30 };
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !formData.skills.some(selected => selected.id === skill.id)
  );

  const addSkill = (skill: Skill) => {
    if (formData.skills.length < 15) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkillSearch('');
      setShowSkillDropdown(false);
    }
  };

  const removeSkill = (skillId: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== skillId)
    }));
  };

  const addScreeningQuestion = () => {
    setFormData(prev => ({
      ...prev,
      screeningQuestions: [...prev.screeningQuestions, '']
    }));
  };

  const updateScreeningQuestion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.map((q, i) => i === index ? value : q)
    }));
  };

  const removeScreeningQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!formData.title.trim() || !formData.description.trim() || formData.skills.length === 0) {
        setError('Please fill in all required fields');
        return;
      }

      if (!formData.roleType) {
        setError('Please select a role type');
        return;
      }

      if (!formData.gigLocation.trim()) {
        setError('Please enter a gig location');
        return;
      }

      const budgetProvided = !formData.budgetToBeConfirmed && formData.budget.trim() !== '';
      const budget = budgetProvided ? parseFloat(formData.budget) : null;
      if (budgetProvided && (isNaN(budget!) || budget! <= 0)) {
        setError('Please enter a valid budget amount');
        return;
      }

      const { min: deliveryTimeMin, max: deliveryTimeMax } = getDeliveryTimeFromDuration(formData.duration);

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget_min: budget,
        budget_max: budget,
        currency: formData.currency,
        delivery_time_min: deliveryTimeMin,
        delivery_time_max: deliveryTimeMax,
        role_type: formData.roleType || null,
        gig_location: formData.gigLocation.trim() || null,
        skills_required: JSON.stringify(formData.skills.map(skill => skill.id)),
        screening_questions: formData.screeningQuestions.length > 0 
          ? JSON.stringify(formData.screeningQuestions.filter(q => q.trim()))
          : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id);

      if (error) {
        console.error('Error updating project:', error);
        setError('Failed to update gig');
        return;
      }

      navigate(`/projects/${id}/view`);
      
    } catch (error) {
      console.error('Error saving project:', error);
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading gig details...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Gig not found</h1>
            <p className="text-slate-600 mb-6">The gig you're looking for doesn't exist or you don't have permission to edit it.</p>
            <Button asChild>
              <Link to="/projects">Back to My Gigs</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/projects/${id}/view`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Gig Details
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Edit Gig</h1>
                <p className="text-slate-600 mt-1">Update your gig details</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the basic details of your gig
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-lg font-semibold text-slate-900">
                    Gig Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a descriptive title for your gig"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-lg font-semibold text-slate-900">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what you need help with in detail"
                    className="mt-2 min-h-[120px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Budget and Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Budget and Timeline</CardTitle>
                <CardDescription>
                  Set your budget and expected timeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="budget" className="text-lg font-semibold text-slate-900">
                      Budget <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-3 mt-2">
                      <div className="flex gap-2">
                        <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="ZAR">ZAR</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="budget"
                          type="number"
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          placeholder="Enter budget amount"
                          className="flex-1"
                          disabled={formData.budgetToBeConfirmed}
                          required={!formData.budgetToBeConfirmed}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="budget_tbc"
                          checked={formData.budgetToBeConfirmed}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({
                              ...prev,
                              budgetToBeConfirmed: Boolean(checked),
                              budget: Boolean(checked) ? '' : prev.budget
                            }))
                          }
                        />
                        <Label htmlFor="budget_tbc" className="text-sm text-slate-600 cursor-pointer">
                          To be confirmed
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-lg font-semibold text-slate-900">
                      Timeline <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-7 days">1-7 days</SelectItem>
                        <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                        <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                        <SelectItem value="1-2 months">1-2 months</SelectItem>
                        <SelectItem value="2-6 months">2-6 months</SelectItem>
                        <SelectItem value="6-12 months">6-12 months</SelectItem>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="roleType" className="text-lg font-semibold text-slate-900">
                      Role Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.roleType} onValueChange={(value) => setFormData(prev => ({ ...prev, roleType: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select role type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_person">In-person</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gigLocation" className="text-lg font-semibold text-slate-900">
                      Gig Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="gigLocation"
                      value={formData.gigLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, gigLocation: e.target.value }))}
                      placeholder="e.g., New York, USA or Fully Remote"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
                <CardDescription>
                  Select the skills needed for this project (minimum 1, maximum 15)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Start typing to search skills..."
                      value={skillSearch}
                      onChange={(e) => {
                        setSkillSearch(e.target.value);
                        setShowSkillDropdown(true);
                      }}
                      onFocus={() => setShowSkillDropdown(true)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Skills Dropdown */}
                  {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredSkills.map((skill) => (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                        >
                          {skill.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Skills */}
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{skill.name}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill.id)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Screening Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Screening Questions (Optional)</CardTitle>
                <CardDescription>
                  Add questions to help screen potential professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.screeningQuestions.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={question}
                      onChange={(e) => updateScreeningQuestion(index, e.target.value)}
                      placeholder={`Screening question ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeScreeningQuestion(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addScreeningQuestion}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Screening Question
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <Button variant="outline" asChild>
                <Link to={`/projects/${id}/view`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
