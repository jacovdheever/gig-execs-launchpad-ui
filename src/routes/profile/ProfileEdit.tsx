import React, { useState } from 'react';
import { User, FileText, Award, Briefcase, Upload, GraduationCap } from 'lucide-react';
import { SectionCard } from '@/components/profile/SectionCard';
import { CompletenessMeter } from '@/components/profile/CompletenessMeter';
import { StatusBadge } from '@/components/profile/StatusBadge';
import { BasicInfoForm } from '@/components/profile/BasicInfoForm';
import { ReferencesForm } from '@/components/profile/ReferencesForm';
import { QualificationsForm } from '@/components/profile/QualificationsForm';
import { CertificationsForm } from '@/components/profile/CertificationsForm';
import { PortfolioForm } from '@/components/profile/PortfolioForm';
import { IdDocumentUploader } from '@/components/profile/IdDocumentUploader';
import { VettingStatus } from '@/components/profile/VettingStatus';
import { computeCompleteness, computeProfileStatus, type CompletenessData } from '@/lib/profile';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { uploadProfileDocument, uploadPortfolioFile } from '@/lib/storage';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  vetting_status?: string;
}

interface ConsultantProfile {
  user_id: string;
  job_title?: string;
  bio?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  linkedin_url?: string;
  id_doc_url?: string;
  video_intro_url?: string;
  stripe_account_id?: string;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  availability?: any;
  created_at?: string;
  updated_at?: string;
  country_id?: number;
  industries?: string[];
}

interface Reference {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  description?: string;
}

interface Education {
  id: number;
  user_id: string;
  institution_name: string;
  degree_level: string;
  grade?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  file_url?: string;
}

interface Certification {
  id: number;
  user_id: string;
  name: string;
  awarding_body: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  file_url?: string;
}

interface PortfolioItem {
  id: number;
  user_id: string;
  project_name: string;
  project_role?: string;
  description?: string;
  start_date?: string;
  completed_date?: string;
  currently_open?: boolean;
  problem_video_url?: string;
  problem_files?: string[];
  solution_video_url?: string;
  solution_files?: string[];
  skills?: string[];
}

interface ProfileData {
  user: User;
  profile?: ConsultantProfile;
  references: Reference[];
  education: Education[];
  certifications: Certification[];
  portfolio: PortfolioItem[];
}

interface ProfileEditProps {
  profileData: ProfileData;
  onUpdate: (data: ProfileData) => void;
}

export function ProfileEdit({ profileData, onUpdate }: ProfileEditProps) {
  console.log('🔍 ProfileEdit: Testing with CompletenessMeter component');
  
  const { user, profile, references, education, certifications, portfolio } = profileData;
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Define navigation tabs
  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: User },
    { id: 'references', name: 'References', icon: FileText },
    { id: 'qualifications', name: 'Qualifications', icon: GraduationCap },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
    { id: 'documents', name: 'Documents', icon: Upload },
  ];
  
  // Calculate completeness for CompletenessMeter
  const completenessData: CompletenessData = {
    basic: {
      hasCore: !!(user.first_name && user.last_name && user.email && profile?.job_title),
    },
    full: {
      referencesCount: references.length,
      hasIdDocument: !!profile?.id_doc_url,
      qualificationsCount: education.length,
      certificationsCount: certifications.length,
    },
    allstar: {
      portfolioCount: portfolio.length,
    },
  };

  const completeness = computeCompleteness(user.id, completenessData);
  const status = computeProfileStatus({
    tier: completeness.tier,
    vettingStatus: user.vetting_status as any,
  });

  // Handle profile updates
  const handleProfileUpdate = (updatedData: any) => {
    onUpdate({
      ...profileData,
      user: updatedData.user || profileData.user,
      profile: updatedData.profile || profileData.profile,
    });
  };

  // Refetch data (placeholder for now)
  const refetchData = () => {
    // This would trigger a refetch of all profile data
    // For now, it's a placeholder
    console.log('Refetching profile data...');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
          <p className="text-slate-600 mt-2">Manage your professional profile and settings</p>
        </div>
        <div className="flex items-center gap-4">
          <CompletenessMeter
            segments={completeness.segments}
            percent={completeness.percent}
            missing={completeness.missing}
          />
          <VettingStatus 
            status={status}
            tier={completeness.tier}
            vettingStatus={user.vetting_status || 'pending'}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-[#0284C7] text-[#0284C7]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4 inline-block mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'basic' && (
          <BasicInfoForm 
            user={user}
            profile={profile}
            onUpdate={handleProfileUpdate}
            isLoading={isLoading}
          />
        )}
        
        {activeTab === 'references' && (
          <ReferencesForm 
            userId={user.id}
            onUpdate={() => refetchData()}
          />
        )}
        
        {activeTab === 'qualifications' && (
          <QualificationsForm 
            userId={user.id}
            onUpdate={() => refetchData()}
          />
        )}
        
        {activeTab === 'certifications' && (
          <CertificationsForm 
            userId={user.id}
            onUpdate={() => refetchData()}
          />
        )}
        
        {activeTab === 'portfolio' && (
          <PortfolioForm 
            userId={user.id}
            onUpdate={() => refetchData()}
          />
        )}
        
        {activeTab === 'documents' && (
          <IdDocumentUploader 
            userId={user.id}
            currentUrl={profile?.id_doc_url}
            onUpdate={() => refetchData()}
          />
        )}
      </div>
    </div>
  );
}