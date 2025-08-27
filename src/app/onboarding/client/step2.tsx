import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { uploadProfilePhoto, deleteProfilePhoto } from '@/lib/storage';

export default function ClientOnboardingStep2() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: ''
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadExistingData();
  }, []);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const loadExistingData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }

      // Load existing user data
      const { data: userData } = await supabase
        .from('users')
        .select('first_name, last_name, profile_photo_url')
        .eq('id', user.id)
        .single();

      // Load existing client profile data
      console.log('Loading existing client profile data...');
      const { data: clientProfile, error: clientProfileError } = await supabase
        .from('client_profiles')
        .select('job_title')
        .eq('user_id', user.id)
        .single();

      if (clientProfileError) {
        console.log('Client profile error (this might be normal for new users):', clientProfileError);
      }
      
      console.log('Loaded client profile data:', clientProfile);

      if (userData) {
        const initialFormData = {
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          jobTitle: clientProfile?.job_title || ''
        };
        console.log('Setting initial form data:', initialFormData);
        setFormData(initialFormData);
        setProfilePicture(userData.profile_photo_url);
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    console.log('=== VALIDATION DEBUG ===');
    console.log('Form data for validation:', formData);
    console.log('firstName valid:', formData.firstName.trim() !== '');
    console.log('lastName valid:', formData.lastName.trim() !== '');
    console.log('jobTitle valid:', formData.jobTitle.trim() !== '');
    
    const valid = formData.firstName.trim() !== '' && 
                  formData.lastName.trim() !== '' && 
                  formData.jobTitle.trim() !== '';
    
    console.log('Overall form valid:', valid);
    console.log('=== END VALIDATION DEBUG ===');
    setIsValid(valid);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    console.log(`Input change - Field: ${field}, Value: "${value}"`);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError(null);

      // Delete existing photo if any
      if (profilePicture) {
        const user = await getCurrentUser();
        if (user) {
          await deleteProfilePhoto(user.id);
        }
      }

      // Upload new photo
      const user = await getCurrentUser();
      if (!user) {
        setUploadError('User not authenticated');
        return;
      }
      
      const result = await uploadProfilePhoto(file, user.id);
      if (result.success && result.url) {
        setProfilePicture(result.url);
      } else {
        setUploadError(result.error || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setUploadError('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (profilePicture) {
      try {
        const user = await getCurrentUser();
        if (user) {
          await deleteProfilePhoto(user.id);
          setProfilePicture(null);
        }
      } catch (error) {
        console.error('Error removing photo:', error);
      }
    }
  };

  const saveToSupabase = async () => {
    try {
      console.log('=== SAVE TO SUPABASE DEBUG ===');
      console.log('Form data:', formData);
      console.log('Job title value:', formData.jobTitle);
      console.log('Job title type:', typeof formData.jobTitle);
      console.log('Job title length:', formData.jobTitle?.length);
      
      const user = await getCurrentUser();
      if (!user) {
        console.error('No user found');
        return;
      }
      console.log('User ID:', user.id);

      // Update users table with basic profile data
      console.log('Updating users table...');
      const { error: userError } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          profile_photo_url: profilePicture,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (userError) {
        console.error('Error updating user:', userError);
        return;
      }
      console.log('Users table updated successfully');

      // Update client_profiles table with job title
      console.log('Updating client_profiles table...');
      const upsertData = {
        user_id: user.id,
        job_title: formData.jobTitle,
        updated_at: new Date().toISOString()
      };
      console.log('Upsert data:', upsertData);
      
      const { data: profileData, error: profileError } = await supabase
        .from('client_profiles')
        .upsert(upsertData, {
          onConflict: 'user_id'
        })
        .select();

      if (profileError) {
        console.error('Error updating client profile:', profileError);
        console.error('Profile error details:', {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint
        });
        return;
      }
      
      console.log('Client profile updated successfully');
      console.log('Returned profile data:', profileData);
      console.log('=== END SAVE DEBUG ===');
    } catch (error) {
      console.error('Error saving profile data:', error);
      console.error('Full error object:', error);
    }
  };

  const handleContinue = async () => {
    if (!isValid) return;
    
    await saveToSupabase();
    navigate('/onboarding/client/step3');
  };

  const handleBack = () => {
    navigate('/onboarding/client/step1');
  };

  const handleSkip = async () => {
    await saveToSupabase();
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
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#012E46] mb-4">
            Your Profile
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Let's start with your personal information. This helps us personalize your experience.
          </p>
        </div>

        {/* Profile Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              {/* Profile Photo Section */}
              <div className="mb-8">
                <Label className="text-base font-medium text-slate-700 mb-3 block">
                  Profile Photo (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  {/* Current Photo Display */}
                  <div className="relative">
                    {profilePicture ? (
                      <div className="relative">
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                        />
                        <button
                          onClick={handleRemoveProfilePicture}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300">
                        <User className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                    {uploadError && (
                      <p className="text-red-500 text-sm mt-1">{uploadError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* First Name */}
                <div>
                  <Label htmlFor="firstName" className="text-base font-medium text-slate-700 mb-2 block">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label htmlFor="lastName" className="text-base font-medium text-slate-700 mb-2 block">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full"
                  />
                </div>

                {/* Job Title */}
                <div>
                  <Label htmlFor="jobTitle" className="text-base font-medium text-slate-700 mb-2 block">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="e.g., CEO, Project Manager, Director"
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={handleBack}
              variant="outline"
              className="px-6 py-2"
            >
              Back
            </Button>
            
            <div className="flex gap-3">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="px-6 py-2"
              >
                Skip
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!isValid}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
