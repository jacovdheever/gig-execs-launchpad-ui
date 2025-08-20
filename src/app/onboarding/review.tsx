import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { Edit, CheckCircle, User, MapPin, Briefcase, Code, Globe, DollarSign } from 'lucide-react';

interface ProfileData {
  // Step 2: Personal & Location
  personal: {
    first_name: string;
    last_name: string;
    job_title: string;
    bio: string;
    address1: string;
    country: string;
    profile_photo_url?: string;
  };
  // Step 3: Work Experience
  work_experience: Array<{
    company: string;
    job_title: string;
    description: string;
    city: string;
    start_date_month: string;
    start_date_year: number;
    end_date_month: string;
    end_date_year: number;
    currently_working: boolean;
  }>;
  // Step 4: Skills & Industries
  skills: Array<{ name: string }>;
  industries: Array<{ name: string }>;
  // Step 5: Languages
  languages: Array<{
    language_name: string;
    proficiency: string;
  }>;
  // Step 6: Hourly Rate
  hourly_rate: {
    currency: string;
    min_price: number;
    max_price: number;
  };
}

export default function ReviewProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }

      // Load all profile data from various tables
      const [
        { data: userData },
        { data: consultantProfile },
        { data: workExp },
        { data: userSkills },
        { data: userIndustries },
        { data: userLanguages }
      ] = await Promise.all([
        supabase.from('users').select('first_name, last_name, profile_photo_url').eq('id', user.id).single(),
        supabase.from('consultant_profiles').select('job_title, bio, address1, country, hourly_rate_min, hourly_rate_max').eq('user_id', user.id).single(),
        supabase.from('work_experience').select('company, job_title, description, city, start_date_month, start_date_year, end_date_month, end_date_year, currently_working').eq('user_id', user.id).order('start_date_year', { ascending: false }),
        supabase.from('user_skills').select('skill_id').eq('user_id', user.id),
        supabase.from('user_industries').select('industry_id').eq('user_id', user.id),
        supabase.from('user_languages').select('language_id, proficiency').eq('user_id', user.id)
      ]);

      // Load skill names
      const skillIds = userSkills?.map(us => us.skill_id) || [];
      const { data: skills } = await supabase.from('skills').select('name').in('id', skillIds);

      // Load industry names
      const industryIds = userIndustries?.map(ui => ui.industry_id) || [];
      const { data: industries } = await supabase.from('industries').select('name').in('id', industryIds);

      // Load language names
      const languageIds = userLanguages?.map(ul => ul.language_id) || [];
      const { data: languages } = await supabase.from('languages').select('name').in('id', languageIds);

      // Map language data with names and proficiency
      const languagesWithNames = userLanguages?.map(ul => {
        const language = languages?.find(l => l.id === ul.language_id);
        return {
          language_name: language?.name || 'Unknown',
          proficiency: ul.proficiency
        };
      }) || [];

      setProfileData({
        personal: {
          first_name: userData?.first_name || '',
          last_name: userData?.last_name || '',
          job_title: consultantProfile?.job_title || '',
          bio: consultantProfile?.bio || '',
          address1: consultantProfile?.address1 || '',
          country: consultantProfile?.country || '',
          profile_photo_url: userData?.profile_photo_url
        },
        work_experience: workExp || [],
        skills: skills || [],
        industries: industries || [],
        languages: languagesWithNames,
        hourly_rate: {
          currency: 'USD',
          min_price: consultantProfile?.hourly_rate_min || 0,
          max_price: consultantProfile?.hourly_rate_max || 0
        }
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (step: string) => {
    const stepRoutes: Record<string, string> = {
      'Personal & Location': '/onboarding/step2',
      'Work Experience': '/onboarding/step3',
      'Skills & Industries': '/onboarding/step4',
      'Languages': '/onboarding/step5',
      'Hourly Rate': '/onboarding/step6'
    };
    navigate(stepRoutes[step]);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Mark profile as complete
      const { error } = await supabase
        .from('users')
        .update({ profile_complete_pct: 100 })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile completion:', error);
        setError('Failed to mark profile as complete');
        return;
      }

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting profile:', error);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAndExit = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/onboarding/step6');
  };

  const getProficiencyLabel = (proficiency: string): string => {
    const labels: Record<string, string> = {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'fluent': 'Fluent',
      'native': 'Native or Bilingual'
    };
    return labels[proficiency] || proficiency;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile data</p>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Review Your Profile</h1>
            <p className="text-gray-600 text-lg">
              Please review all the information you've provided. You can edit any section by clicking the edit button.
            </p>
          </div>

          {/* Profile Data Accordion */}
          <Accordion type="single" collapsible className="w-full mb-8">
            {/* Step 2: Personal & Location */}
            <AccordionItem value="personal">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Personal & Location</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit('Personal & Location')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{profileData.personal.first_name} {profileData.personal.last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Job Title</p>
                        <p className="font-medium">{profileData.personal.job_title || 'Not specified'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Bio</p>
                        <p className="font-medium">{profileData.personal.bio || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{profileData.personal.address1 || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Country</p>
                        <p className="font-medium">{profileData.personal.country || 'Not specified'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Step 3: Work Experience */}
            <AccordionItem value="work-experience">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>Work Experience</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Work History</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit('Work Experience')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {profileData.work_experience.length > 0 ? (
                      <div className="space-y-4">
                        {profileData.work_experience.map((exp, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{exp.job_title}</h4>
                                <p className="text-gray-600">{exp.company}</p>
                                <p className="text-sm text-gray-500">
                                  {exp.start_date_month} {exp.start_date_year} - {exp.currently_working ? 'Present' : `${exp.end_date_month} ${exp.end_date_year}`}
                                </p>
                                {exp.city && <p className="text-sm text-gray-500">{exp.city}</p>}
                              </div>
                            </div>
                            {exp.description && (
                              <p className="text-gray-700 mt-2">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No work experience added</p>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Step 4: Skills & Industries */}
            <AccordionItem value="skills-industries">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-blue-600" />
                  <span>Skills & Industries</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Skills & Industries</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit('Skills & Industries')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.length > 0 ? (
                          profileData.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill.name}</Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills added</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Industries</p>
                      <div className="flex flex-wrap gap-2">
                        {profileData.industries.length > 0 ? (
                          profileData.industries.map((industry, index) => (
                            <Badge key={index} variant="outline">{industry.name}</Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">No industries added</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Step 5: Languages */}
            <AccordionItem value="languages">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>Languages</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Language Proficiency</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit('Languages')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {profileData.languages.length > 0 ? (
                      <div className="space-y-3">
                        {profileData.languages.map((lang, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="font-medium">{lang.language_name}</span>
                            <Badge variant="secondary">{getProficiencyLabel(lang.proficiency)}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No languages added</p>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Step 6: Hourly Rate */}
            <AccordionItem value="hourly-rate">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span>Hourly Rate</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rate Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit('Hourly Rate')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Currency</p>
                        <p className="font-medium">{profileData.hourly_rate.currency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Min Price</p>
                        <p className="font-medium">${profileData.hourly_rate.min_price}/hr</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Max Price</p>
                        <p className="font-medium">${profileData.hourly_rate.max_price}/hr</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Error Display */}
          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              disabled={submitting}
            >
              Back
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveAndExit}
              className="flex-1"
              disabled={submitting}
            >
              Save and Exit
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
