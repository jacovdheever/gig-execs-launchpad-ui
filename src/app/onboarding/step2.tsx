import { useState, useRef } from 'react';
import { ArrowLeft, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

export default function OnboardingStep2() {
  const [formData, setFormData] = useState({
    firstName: 'Lance',
    lastName: 'Whiteford',
    headline: 'Competitive Intelligence Analyst',
    bio: ''
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Check if all required fields are filled
  const isFormValid = formData.firstName.trim() && 
                     formData.lastName.trim() && 
                     formData.headline.trim();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (!isFormValid) return;
    navigate('/onboarding/step3');
  };

  const handleBack = () => {
    navigate('/onboarding/step1');
  };

  const handleSkip = () => {
    navigate('/onboarding/step3');
  };

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
                  step === 2 
                    ? 'bg-[#012E46] text-white' 
                    : step < 2
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 6 && (
                  <div className={`w-6 sm:w-8 lg:w-12 h-1 mx-1 sm:mx-2 ${
                    step <= 2 ? 'bg-[#012E46]' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#012E46] mb-6 sm:mb-8 text-center">
                Your Profile
              </h1>

              {/* Profile Picture Section */}
              <div className="mb-6 sm:mb-8">
                <Label className="text-sm font-medium text-[#012E46] mb-3 block">
                  Add a profile picture*
                </Label>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img 
                          src={profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
                    >
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {/* First Name */}
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-[#012E46]">
                    First name*
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-2"
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-[#012E46]">
                    Last name*
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-2"
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Headline */}
                <div>
                  <Label htmlFor="headline" className="text-sm font-medium text-[#012E46]">
                    Headline*
                  </Label>
                  <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => handleInputChange('headline', e.target.value)}
                    className="mt-2"
                    placeholder="How could you add value to potential clients?"
                  />
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium text-[#012E46]">
                    Bio (Optional)
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="mt-2 min-h-[100px] resize-none"
                    placeholder="Write a short bio about yourself here..."
                    maxLength={2000}
                  />
                  <div className="text-xs text-slate-500 mt-1 text-right">
                    {formData.bio.length}/2000 characters
                  </div>
                </div>
              </div>

              {/* Required Fields Note */}
              <div className="text-sm text-red-600 mb-6 sm:mb-8 text-center">
                All fields marked with * are required before proceeding
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 sm:flex-none px-8 py-3 text-lg border-[#012E46] text-[#012E46] hover:bg-[#012E46] hover:text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!isFormValid}
                  className="flex-1 sm:flex-none px-8 py-3 text-lg bg-gradient-to-r from-[#012E46] to-[#4885AA] hover:from-[#011E36] hover:to-[#3A7A9A] text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={handleSkip}
            className="text-[#012E46] hover:text-[#4885AA] underline text-sm"
          >
            I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
}
