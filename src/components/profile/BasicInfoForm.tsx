import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadProfilePhoto, deleteProfilePhoto } from '@/lib/storage';

interface Skill {
  id: number;
  name: string;
}

interface Industry {
  id: number;
  name: string;
  category: string;
}

interface Language {
  id: number;
  name: string;
}

interface UserLanguage {
  user_id: string;
  language_id: number;
  language_name: string;
  proficiency: string;
}

interface BasicInfoFormProps {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    vetting_status?: string;
    profile_photo_url?: string;
  };
  profile: {
    job_title?: string;
    bio?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    country?: string;
    postal_code?: string;
    phone?: string;
    linkedin_url?: string;
    hourly_rate_min?: number;
    hourly_rate_max?: number;
    industries?: string[];
  };
  onUpdate: (updatedData: any) => void;
  isLoading?: boolean;
}

export function BasicInfoForm({ user, profile, onUpdate, isLoading = false }: BasicInfoFormProps) {
  const [formData, setFormData] = useState({
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    headline: profile.job_title || '',
    bio: profile.bio || '',
    city: profile.address1 || '',
    country: profile.country || '',
    phone: profile.phone || '',
    linkedin_url: profile.linkedin_url || '',
    hourly_rate_min: profile.hourly_rate_min || '',
    hourly_rate_max: profile.hourly_rate_max || '',
  });

  const [profilePicture, setProfilePicture] = useState<string | null>(user.profile_photo_url || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Skills and Industries
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [industrySearch, setIndustrySearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  // Languages
  const [userLanguages, setUserLanguages] = useState<UserLanguage[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<UserLanguage | null>(null);
  const [languageFormData, setLanguageFormData] = useState({
    language_id: '',
    proficiency: ''
  });

  const { toast } = useToast();

  // Countries list (same as onboarding)
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
    'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
    'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
    'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  const proficiencyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'fluent', label: 'Fluent' },
    { value: 'native', label: 'Native or Bilingual' }
  ];

  // Load existing data
  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      // Load skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('id, name')
        .order('name');

      if (skillsData) {
        setAvailableSkills(skillsData);
      }

      // Load industries
      const { data: industriesData } = await supabase
        .from('industries_master')
        .select('id, name, category')
        .order('name');

      if (industriesData) {
        setAvailableIndustries(industriesData);
      }

      // Load languages
      const { data: languagesData } = await supabase
        .from('languages')
        .select('id, name')
        .order('name');

      if (languagesData) {
        setAvailableLanguages(languagesData);
      }

      // Load user skills
      const { data: userSkillsData } = await supabase
        .from('user_skills')
        .select(`
          skill_id,
          skills!inner(id, name)
        `)
        .eq('user_id', user.id);

      if (userSkillsData) {
        const skills = userSkillsData.map((item: any) => ({
          id: item.skills.id,
          name: item.skills.name
        }));
        setSelectedSkills(skills);
      }

      // Load user industries
      if (profile.industries && profile.industries.length > 0) {
        const industries = profile.industries.map(industryName => {
          const industry = availableIndustries.find(i => i.name === industryName);
          return industry || { id: 0, name: industryName, category: 'Other' };
        });
        setSelectedIndustries(industries);
      }

      // Load user languages
      const { data: userLanguagesData } = await supabase
        .from('user_languages')
        .select(`
          language_id,
          proficiency,
          languages!inner(id, name)
        `)
        .eq('user_id', user.id);

      if (userLanguagesData) {
        const languages = userLanguagesData.map((item: any) => ({
          user_id: user.id,
          language_id: item.language_id,
          language_name: item.languages.name,
          proficiency: item.proficiency
        }));
        setUserLanguages(languages);
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      // Delete existing photo if any
      if (profilePicture) {
        await deleteProfilePhoto(user.id);
      }

      // Upload new photo
      const result = await uploadProfilePhoto(file, user.id);
      
      if (result.success && result.url) {
        setProfilePicture(result.url);
        toast({
          title: 'Profile photo updated',
          description: 'Your profile photo has been updated successfully.',
        });
      } else {
        setUploadError(result.error || 'Upload failed');
        toast({
          title: 'Upload failed',
          description: result.error || 'Failed to upload profile photo.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      setUploadError('An unexpected error occurred');
      toast({
        title: 'Upload failed',
        description: 'An unexpected error occurred while uploading.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Update users table
      const { error: userError } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          profile_photo_url: profilePicture,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Update consultant_profiles table
      const { error: profileError } = await supabase
        .from('consultant_profiles')
        .update({
          job_title: formData.headline,
          bio: formData.bio || null,
          address1: formData.city,
          country: formData.country,
          phone: formData.phone || null,
          linkedin_url: formData.linkedin_url || null,
          hourly_rate_min: formData.hourly_rate_min ? Number(formData.hourly_rate_min) : null,
          hourly_rate_max: formData.hourly_rate_max ? Number(formData.hourly_rate_max) : null,
          industries: selectedIndustries.map(i => i.name),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update skills
      await updateSkills();

      // Update languages
      await updateLanguages();

      toast({
        title: 'Profile updated',
        description: 'Your basic information has been updated successfully.',
      });

      // Trigger parent update
      onUpdate({
        user: {
          ...user,
          first_name: formData.firstName,
          last_name: formData.lastName,
          profile_photo_url: profilePicture,
        },
        profile: {
          ...profile,
          job_title: formData.headline,
          bio: formData.bio,
          address1: formData.city,
          country: formData.country,
          phone: formData.phone,
          linkedin_url: formData.linkedin_url,
          hourly_rate_min: formData.hourly_rate_min ? Number(formData.hourly_rate_min) : null,
          hourly_rate_max: formData.hourly_rate_max ? Number(formData.hourly_rate_max) : null,
          industries: selectedIndustries.map(i => i.name),
        }
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update your profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateSkills = async () => {
    // Delete existing skills
    await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', user.id);

    // Insert new skills
    if (selectedSkills.length > 0) {
      const skillsToInsert = selectedSkills.map(skill => ({
        user_id: user.id,
        skill_id: skill.id
      }));

      await supabase
        .from('user_skills')
        .insert(skillsToInsert);
    }
  };

  const updateLanguages = async () => {
    // Delete existing languages
    await supabase
      .from('user_languages')
      .delete()
      .eq('user_id', user.id);

    // Insert new languages
    if (userLanguages.length > 0) {
      const languagesToInsert = userLanguages.map(lang => ({
        user_id: user.id,
        language_id: lang.language_id,
        proficiency: lang.proficiency
      }));

      await supabase
        .from('user_languages')
        .insert(languagesToInsert);
    }
  };

  // Skills management
  const addSkill = (skill: Skill) => {
    if (!selectedSkills.some(s => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillSearch('');
      setShowSkillDropdown(false);
    }
  };

  const removeSkill = (skillId: number) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== skillId));
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.some(selected => selected.id === skill.id)
  );

  // Industries management
  const addIndustry = (industry: Industry) => {
    if (!selectedIndustries.some(i => i.id === industry.id)) {
      setSelectedIndustries([...selectedIndustries, industry]);
      setIndustrySearch('');
      setShowIndustryDropdown(false);
    }
  };

  const removeIndustry = (industryId: number) => {
    setSelectedIndustries(selectedIndustries.filter(i => i.id !== industryId));
  };

  const filteredIndustries = availableIndustries.filter(industry =>
    industry.name.toLowerCase().includes(industrySearch.toLowerCase()) &&
    !selectedIndustries.some(selected => selected.id === industry.id)
  );

  // Languages management
  const addLanguage = async () => {
    if (!languageFormData.language_id || !languageFormData.proficiency) return;

    const language = availableLanguages.find(l => l.id === Number(languageFormData.language_id));
    if (!language) return;

    const newLanguage: UserLanguage = {
      user_id: user.id,
      language_id: language.id,
      language_name: language.name,
      proficiency: languageFormData.proficiency
    };

    setUserLanguages([...userLanguages, newLanguage]);
    setLanguageFormData({ language_id: '', proficiency: '' });
    setShowLanguageModal(false);
  };

  const removeLanguage = (languageId: number) => {
    setUserLanguages(userLanguages.filter(l => l.language_id !== languageId));
  };

  const getProficiencyLabel = (value: string): string => {
    const level = proficiencyLevels.find(l => l.value === value);
    return level ? level.label : value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
          <p className="text-slate-600 mt-1">Update your personal and professional details</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Profile Photo */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {profilePicture ? (
                <div className="relative">
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setProfilePicture(null);
                      deleteProfilePhoto(user.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Profile Photo</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                />
              </div>
              {uploadError && (
                <p className="text-red-500 text-sm mt-1">{uploadError}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="headline">Professional Headline *</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={(e) => handleInputChange('headline', e.target.value)}
                className="mt-1"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="mt-1 min-h-[100px]"
                placeholder="Tell us about yourself..."
                maxLength={2000}
              />
              <div className="text-xs text-slate-500 mt-1 text-right">
                {formData.bio.length}/2000 characters
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="mt-1"
                placeholder="Enter your city"
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                className="mt-1"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Skills</h3>
          <div className="space-y-4">
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
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.slice(0, 10).map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                      >
                        {skill.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-slate-500">
                      No skills found
                    </div>
                  )}
                </div>
              )}
            </div>
            
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
        </CardContent>
      </Card>

      {/* Industries */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Industries</h3>
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={industrySearch}
                onChange={(e) => {
                  setIndustrySearch(e.target.value);
                  setShowIndustryDropdown(true);
                }}
                onFocus={() => setShowIndustryDropdown(true)}
                placeholder="Search and select industries..."
                className="w-full"
              />
              {showIndustryDropdown && industrySearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredIndustries.length > 0 ? (
                    filteredIndustries.slice(0, 10).map((industry) => (
                      <button
                        key={industry.id}
                        type="button"
                        onClick={() => addIndustry(industry)}
                        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                      >
                        {industry.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-slate-500">
                      No industries found
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {selectedIndustries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedIndustries.map((industry) => (
                  <div
                    key={industry.id}
                    className="bg-[#012E46] text-white px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{industry.name}</span>
                    <button
                      type="button"
                      onClick={() => removeIndustry(industry.id)}
                      className="hover:bg-blue-700 rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Languages</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLanguageModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Language
            </Button>
          </div>
          
          {userLanguages.length > 0 ? (
            <div className="space-y-2">
              {userLanguages.map((lang) => (
                <div key={lang.language_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-medium">{lang.language_name}</span>
                    <span className="text-slate-500 ml-2">({getProficiencyLabel(lang.proficiency)})</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLanguage(lang.language_id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No languages added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Hourly Rates */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Hourly Rates (USD)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hourly_rate_min">Minimum Rate</Label>
              <Input
                id="hourly_rate_min"
                type="number"
                value={formData.hourly_rate_min}
                onChange={(e) => handleInputChange('hourly_rate_min', e.target.value)}
                className="mt-1"
                placeholder="50"
              />
            </div>
            <div>
              <Label htmlFor="hourly_rate_max">Maximum Rate</Label>
              <Input
                id="hourly_rate_max"
                type="number"
                value={formData.hourly_rate_max}
                onChange={(e) => handleInputChange('hourly_rate_max', e.target.value)}
                className="mt-1"
                placeholder="150"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="font-semibold text-slate-900 mb-4">Add Language</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="language_select">Language</Label>
                <Select value={languageFormData.language_id} onValueChange={(value) => setLanguageFormData(prev => ({ ...prev, language_id: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((language) => (
                      <SelectItem key={language.id} value={language.id.toString()}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="proficiency_select">Proficiency Level</Label>
                <Select value={languageFormData.proficiency} onValueChange={(value) => setLanguageFormData(prev => ({ ...prev, proficiency: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={addLanguage} disabled={!languageFormData.language_id || !languageFormData.proficiency}>
                Add Language
              </Button>
              <Button variant="outline" onClick={() => setShowLanguageModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
