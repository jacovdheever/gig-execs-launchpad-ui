import { useState } from 'react';
import { ArrowLeft, Linkedin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function OnboardingStep1() {
  const [selectedMethod, setSelectedMethod] = useState<'linkedin' | 'manual' | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedMethod === 'linkedin') {
      // TODO: Implement LinkedIn import flow
      navigate('/onboarding/step2-linkedin');
    } else if (selectedMethod === 'manual') {
      // TODO: Implement manual input flow
      navigate('/onboarding/step2-manual');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#012E46] mb-4 text-center">
            Choose Your Preferred Method to Input Your Information
          </h1>
          <p className="text-lg text-[#012E46] max-w-2xl mx-auto text-left">
            The fastest method is to import your data from LinkedIn. You will be able to review all your details before adding it to your GigExecs profile.
          </p>
        </div>

        {/* Selection Options */}
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* LinkedIn Import Option */}
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedMethod === 'linkedin' 
                ? 'ring-2 ring-yellow-500 border-green-700' 
                : 'border-green-700 hover:border-green-600'
            }`}
            onClick={() => setSelectedMethod('linkedin')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {/* LinkedIn Icon */}
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-8 h-8 text-white" />
                </div>
                
                {/* Text Content */}
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold text-[#012E46] mb-1">
                    Import from LinkedIn
                  </h3>
                  <p className="text-[#012E46]">
                    Quick profile setup using your existing LinkedIn data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Input Option */}
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedMethod === 'manual' 
                ? 'ring-2 ring-yellow-500 border-green-700' 
                : 'border-green-700 hover:border-green-600'
            }`}
            onClick={() => setSelectedMethod('manual')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {/* Manual Input Icon */}
                <div className="w-16 h-16 bg-[#012E46] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
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
        <div className="text-center mt-12">
          <Button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="px-8 py-3 text-lg bg-gradient-to-r from-[#012E46] to-[#4885AA] hover:from-[#011E36] hover:to-[#3A7A9A] text-white border-0"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
