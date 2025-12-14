import React, { useState } from 'react';
import { ProfileAIChat } from './ProfileAIChat';
import { ProfileDraftReview } from './ProfileDraftReview';

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

type FlowStep = 'chat' | 'review' | 'complete';

interface ProfileAIFlowProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function ProfileAIFlow({ onComplete, onCancel }: ProfileAIFlowProps) {
  const [step, setStep] = useState<FlowStep>('chat');
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftProfile, setDraftProfile] = useState<DraftProfile | null>(null);

  const handleChatComplete = (id: string, profile: DraftProfile) => {
    setDraftId(id);
    setDraftProfile(profile);
    setStep('review');
  };

  const handlePublishComplete = () => {
    setStep('complete');
    if (onComplete) {
      onComplete();
    }
  };

  const handleBackToChat = () => {
    setStep('chat');
  };

  if (step === 'chat') {
    return (
      <ProfileAIChat
        onComplete={handleChatComplete}
        onCancel={onCancel}
      />
    );
  }

  if (step === 'review' && draftId && draftProfile) {
    return (
      <ProfileDraftReview
        draftId={draftId}
        draftProfile={draftProfile}
        onPublish={handlePublishComplete}
        onBack={handleBackToChat}
      />
    );
  }

  // Complete state - could show a success message or redirect
  return null;
}

export default ProfileAIFlow;

