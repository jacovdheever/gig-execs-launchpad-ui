import React, { useState } from 'react';
import { ProfileCVUpload } from './ProfileCVUpload';
import { ProfileReviewParsed } from './ProfileReviewParsed';

interface ParsedProfileData {
  sourceFileId: string;
  parsedData: {
    basicInfo: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      linkedinUrl?: string;
      location?: string;
      headline?: string;
    };
    workExperience: Array<{
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
    education: Array<{
      institutionName: string;
      degreeLevel: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      grade?: string;
      description?: string;
    }>;
    skills: string[];
    certifications: Array<{
      name: string;
      awardingBody?: string;
      issueDate?: string;
      expiryDate?: string;
      credentialId?: string;
    }>;
    languages: Array<{
      language: string;
      proficiency: string;
    }>;
    summary?: string;
    estimatedYearsExperience?: number;
  };
  eligibility?: {
    yearsOfExperienceEstimate: number;
    meetsThreshold: boolean;
    confidence: 'low' | 'medium' | 'high';
    reasons: string[];
    seniorityIndicators?: string[];
  };
}

type FlowStep = 'upload' | 'review' | 'complete';

interface ProfileImportFlowProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function ProfileImportFlow({ onComplete, onCancel }: ProfileImportFlowProps) {
  const [step, setStep] = useState<FlowStep>('upload');
  const [parsedData, setParsedData] = useState<ParsedProfileData | null>(null);

  const handleParseComplete = (data: ParsedProfileData) => {
    setParsedData(data);
    setStep('review');
  };

  const handleSaveComplete = () => {
    setStep('complete');
    if (onComplete) {
      onComplete();
    }
  };

  const handleCancel = () => {
    if (step === 'review') {
      // Go back to upload step
      setStep('upload');
      setParsedData(null);
    } else if (onCancel) {
      onCancel();
    }
  };

  if (step === 'upload') {
    return (
      <ProfileCVUpload
        onParseComplete={handleParseComplete}
        onCancel={onCancel}
      />
    );
  }

  if (step === 'review' && parsedData) {
    return (
      <ProfileReviewParsed
        data={parsedData}
        onSave={handleSaveComplete}
        onCancel={handleCancel}
      />
    );
  }

  // Complete state - could show a success message or redirect
  return null;
}

export default ProfileImportFlow;

