import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileAIChat } from '@/components/profile/ProfileAIChat';
import { ProfileDraftReview } from '@/components/profile/ProfileDraftReview';
import { useToast } from '@/hooks/use-toast';

interface DraftProfile {
  basicInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    linkedinUrl?: string;
    location?: string;
    headline?: string;
  };
  workExperience?: Array<{
    company: string;
    jobTitle: string;
    startDateMonth?: string;
    startDateYear?: number;
    endDateMonth?: string;
    endDateYear?: number;
    currentlyWorking?: boolean;
    description?: string;
    city?: string;
    country?: string;
  }>;
  education?: Array<{
    institutionName: string;
    degreeLevel: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
    description?: string;
  }>;
  skills?: string[];
  certifications?: Array<{
    name: string;
    awardingBody?: string;
    issueDate?: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  summary?: string;
  estimatedYearsExperience?: number;
}

type FlowStep = 'chat' | 'review';

export default function OnboardingAIProfile() {
  const [step, setStep] = useState<FlowStep>('chat');
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftProfile, setDraftProfile] = useState<DraftProfile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChatComplete = (id: string, profile: DraftProfile) => {
    setDraftId(id);
    setDraftProfile(profile);
    setStep('review');
  };

  const handlePublishComplete = () => {
    toast({
      title: 'Profile created successfully!',
      description: 'Redirecting to review your complete profile...',
    });
    
    // Navigate to the final review page
    setTimeout(() => {
      navigate('/onboarding/review');
    }, 1500);
  };

  const handleBackToChat = () => {
    setStep('chat');
  };

  const handleCancel = () => {
    // Save progress and go back to step 1
    navigate('/onboarding/step1');
  };

  const handleBack = () => {
    if (step === 'review') {
      setStep('chat');
    } else {
      navigate('/onboarding/step1');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="text-2xl font-bold text-[#012E46]">GigExecs</div>
            <div className="ml-auto text-sm text-slate-500">
              {step === 'chat' ? 'AI Profile Creation' : 'Review Profile'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {step === 'chat' && (
          <ProfileAIChat
            onComplete={handleChatComplete}
            onCancel={handleCancel}
          />
        )}

        {step === 'review' && draftId && draftProfile && (
          <ProfileDraftReview
            draftId={draftId}
            draftProfile={draftProfile}
            onPublish={handlePublishComplete}
            onBack={handleBackToChat}
          />
        )}
      </div>
    </div>
  );
}

