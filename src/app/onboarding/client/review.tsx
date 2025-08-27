import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { Edit, CheckCircle, User, Building, MapPin, Globe, Hash, ArrowLeft } from 'lucide-react';

interface ClientProfileData {
  // Step 2: Personal Profile
  personal: {
    first_name: string;
    last_name: string;
    job_title: string;
    profile_photo_url?: string;
  };
  // Step 3: Company Profile
  company: {
    company_name: string;
    website?: string;
    duns_number?: string;
    organisation_type: string;
    industry: string;
    logo_url?: string;
    city: string;
    country: string;
  };
}

export default function ClientOnboardingReview() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ClientProfileData | null>(null);
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
        { data: clientProfile }
      ] = await Promise.all([
        supabase.from('users').select('first_name, last_name, profile_photo_url').eq('id', user.id).single(),
        supabase.from('client_profiles').select('company_name, website, duns_number, organisation_type, industry, logo_url, address1, country_id').eq('user_id', user.id).single()
      ]);

      // Load country name
      let countryName = '';
      if (clientProfile?.country_id) {
        const { data: country } = await supabase
          .from('countries')
          .select('name')
          .eq('id', clientProfile.country_id)
          .single();
        countryName = country?.name || '';
      }

      setProfileData({
        personal: {
          first_name: userData?.first_name || '',
          last_name: userData?.last_name || '',
          job_title: clientProfile?.job_title || '',
          profile_photo_url: userData?.profile_photo_url
        },
        company: {
          company_name: clientProfile?.company_name || '',
          website: clientProfile?.website || '',
          duns_number: clientProfile?.duns_number || '',
          organisation_type: clientProfile?.organisation_type || '',
          industry: clientProfile?.industry || '',
          logo_url: clientProfile?.logo_url || '',
          city: clientProfile?.address1 || '',
          country: countryName
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
      'Personal Profile': '/onboarding/client/step2',
      'Company Profile': '/onboarding/client/step3'
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

      // Update profile completion percentage
      const { error: updateError } = await supabase
        .from('users')
        .update({
          profile_complete_pct: 100,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile completion:', updateError);
        setError('Failed to complete profile setup');
        return;
      }

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing profile:', error);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/client/step3');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load profile data</p>
          <Button onClick={loadProfileData} variant="outline">
            Try Again
          </Button>
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#012E46] mb-4">
            Review Your Profile
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Please review all the information below. You can edit any section before submitting, or click "Complete Profile" to finish.
          </p>
        </div>

        {/* Profile Review */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {/* Step 2: Personal Profile */}
            <AccordionItem value="personal-profile" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold">Personal Profile</span>
                  <Badge variant="secondary" className="ml-2">Step 2</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit('Personal Profile')}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Profile Photo */}
                    {profileData.personal.profile_photo_url && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 w-24">Profile Photo:</span>
                        <img
                          src={profileData.personal.profile_photo_url}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                        />
                      </div>
                    )}

                    {/* Name */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 w-24">Name:</span>
                      <span className="text-slate-800">
                        {profileData.personal.first_name} {profileData.personal.last_name}
                      </span>
                    </div>

                    {/* Job Title */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 w-24">Job Title:</span>
                      <span className="text-slate-800">{profileData.personal.job_title}</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Step 3: Company Profile */}
            <AccordionItem value="company-profile" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold">Company Profile</span>
                  <Badge variant="secondary" className="ml-2">Step 3</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Company Information</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit('Company Profile')}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Company Logo */}
                    {profileData.company.logo_url && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 w-24">Company Logo:</span>
                        <img
                          src={profileData.company.logo_url}
                          alt="Company Logo"
                          className="w-16 h-16 object-contain border-2 border-slate-200 rounded-lg"
                        />
                      </div>
                    )}

                    {/* Company Name */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 w-24">Company Name:</span>
                      <span className="text-slate-800">{profileData.company.company_name}</span>
                    </div>

                    {/* Website */}
                    {profileData.company.website && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 w-24">Website:</span>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-800">{profileData.company.website}</span>
                        </div>
                      </div>
                    )}

                    {/* D-U-N-S Number */}
                    {profileData.company.duns_number && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 w-24">D-U-N-S Number:</span>
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-800">{profileData.company.duns_number}</span>
                        </div>
                      </div>
                    )}

                    {/* Company Size */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 w-24">Company Size:</span>
                      <span className="text-slate-800">{profileData.company.organisation_type} employees</span>
                    </div>

                    {/* Industry */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 w-24">Industry:</span>
                      <span className="text-slate-800">{profileData.company.industry}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 w-24">Location:</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-800">
                          {profileData.company.city}, {profileData.company.country}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-12">
            <Button
              onClick={handleBack}
              variant="outline"
              className="px-8 py-3"
            >
              Back
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Profile
                </>
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
