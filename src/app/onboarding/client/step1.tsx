import { useState } from 'react';
import { ArrowLeft, Linkedin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function ClientOnboardingStep1() {
  const [selectedMethod, setSelectedMethod] = useState<'linkedin' | 'manual' | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedMethod === 'linkedin') {
      // TODO: Implement LinkedIn import flow for clients
      navigate('/onboarding/client/step2');
    } else if (selectedMethod === 'manual') {
      // TODO: Implement manual input flow for clients
      navigate('/onboarding/client/step2');
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
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#012E46] mb-4">
            Welcome to GigExecs!
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Let's get your company profile set up. Choose how you'd like to start building your profile.
          </p>
        </div>

        {/* Selection Cards */}
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
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* LinkedIn Icon */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                
                {/* Text Content */}
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold text-[#012E46] mb-1">
                    Import from LinkedIn
                  </h3>
                  <p className="text-[#012E46]">
                    Quick company profile setup using your existing LinkedIn data
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
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Manual Icon */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                
                {/* Text Content */}
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold text-[#012E46] mb-1">
                    Manual Input
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
        <div className="mt-12 text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
