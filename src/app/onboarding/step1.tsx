import { useState } from 'react';
import { ArrowLeft, FileText, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ProfileImportFlow } from '@/components/profile/ProfileImportFlow';

type SelectedMethod = 'cv' | 'manual' | 'ai' | null;

export default function OnboardingStep1() {
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod>(null);
  const [showCvFlow, setShowCvFlow] = useState(false);
  const navigate = useNavigate();

  const handleMethodSelect = (method: SelectedMethod) => {
    if (method === 'cv') {
      setShowCvFlow(true);
    } else {
      setSelectedMethod(method);
      setShowCvFlow(false);
    }
  };

  const handleCvFlowComplete = () => {
    // Mark that CV was imported so step2 can show the banner
    sessionStorage.setItem('cvImported', 'true');
    // Navigate to step 2
    navigate('/onboarding/step2');
  };

  const handleCvFlowCancel = () => {
    setShowCvFlow(false);
    setSelectedMethod(null);
  };

  const handleContinue = () => {
    if (selectedMethod === 'manual') {
      // Clear any stored CV data
      sessionStorage.removeItem('cvParsedData');
      sessionStorage.removeItem('cvImported');
      sessionStorage.removeItem('cvSourceFileId');
      navigate('/onboarding/step2');
    } else if (selectedMethod === 'ai') {
      // Navigate to AI profile creation flow (keep cvSourceFileId so AI can use recently parsed CV)
      sessionStorage.removeItem('cvParsedData');
      sessionStorage.removeItem('cvImported');
      navigate('/onboarding/ai-profile');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
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
                  step === 1 
                    ? 'bg-[#012E46] text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 6 && (
                  <div className={`w-6 sm:w-8 lg:w-12 h-1 mx-1 sm:mx-2 ${
                    step === 1 ? 'bg-[#012E46]' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Show CV Import Flow if CV method selected */}
        {showCvFlow ? (
          <ProfileImportFlow
            onComplete={handleCvFlowComplete}
            onCancel={handleCvFlowCancel}
          />
        ) : (
          /* Main Card - Method Selection */
          <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {/* Title and Description */}
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#012E46] mb-3 sm:mb-4 text-center">
                    Choose Your Preferred Method to Input Your Information
                  </h1>
                  <p className="text-base sm:text-lg text-[#012E46] text-center">
                    Uploading your CV is quick and efficient. Our AI will extract your professional details and you can review everything before adding it to your GigExecs profile.
                  </p>
                </div>

                {/* Selection Options */}
                <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                  {/* CV Upload Option */}
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedMethod === 'cv' 
                        ? 'ring-2 ring-yellow-500 border-green-700' 
                        : 'border-green-700 hover:border-green-600'
                    }`}
                    onClick={() => handleMethodSelect('cv')}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* CV Icon */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#012E46] rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        
                        {/* Text Content */}
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-semibold text-[#012E46] mb-1">
                            Upload your CV / Resume
                          </h3>
                          <p className="text-[#012E46] text-sm">
                            We'll complete your profile - simply upload your latest CV / Resume in Word or PDF format.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Assistant Option - HIDDEN FOR PRODUCTION (will continue in develop branch) */}
                  {/* <Card 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedMethod === 'ai' 
                        ? 'ring-2 ring-yellow-500 border-green-700' 
                        : 'border-green-700 hover:border-green-600'
                    }`}
                    onClick={() => handleMethodSelect('ai')}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-semibold text-[#012E46] mb-1">
                            Create with AI Assistant
                          </h3>
                          <p className="text-[#012E46] text-sm">
                            Have a conversation with our AI to build your profile. Answer questions and we'll create a professional profile for you.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}

                  {/* Manual Input Option */}
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedMethod === 'manual' 
                        ? 'ring-2 ring-yellow-500 border-green-700' 
                        : 'border-green-700 hover:border-green-600'
                    }`}
                    onClick={() => handleMethodSelect('manual')}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Manual Input Icon */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        
                        {/* Text Content */}
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-semibold text-[#012E46] mb-1">
                            Input information manually
                          </h3>
                          <p className="text-[#012E46]">
                            Build your profile step by step with custom information
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Continue Button */}
                <div className="text-center">
                  <Button
                    onClick={handleContinue}
                    disabled={!selectedMethod}
                    className="px-8 py-3 text-lg bg-gradient-to-r from-[#012E46] to-[#4885AA] hover:from-[#011E36] hover:to-[#3A7A9A] text-white border-0 disabled:opacity-50"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
