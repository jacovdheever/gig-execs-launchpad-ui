import React from 'react';
import { SectionCard } from '@/components/profile/SectionCard';
import { CompletenessMeter } from '@/components/profile/CompletenessMeter';
import { StatusBadge } from '@/components/profile/StatusBadge';
import { BasicInfoView } from '@/components/profile/BasicInfoView';
import { ReferencesView } from '@/components/profile/ReferencesView';
import { QualificationsView } from '@/components/profile/QualificationsView';
import { CertificationsView } from '@/components/profile/CertificationsView';
import { PortfolioView } from '@/components/profile/PortfolioView';
import { computeCompleteness, computeProfileStatus, type CompletenessData } from '@/lib/profile';
import type { User } from '@/types/User';


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
  hourly_rate_min?: number;
  hourly_rate_max?: number;
}

interface Reference {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  description?: string;
}

interface Education {
  id: number;
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
  project_name: string;
  project_role?: string;
  description?: string;
  start_date?: string;
  completed_date?: string;
  currently_open?: boolean;
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

interface ProfileViewProps {
  profileData: ProfileData;
  isOwner: boolean;
}

export function ProfileView({ profileData, isOwner }: ProfileViewProps) {
  console.log('🔍 ProfileView: Component started rendering');
  const { user, profile, references, education, certifications, portfolio } = profileData;

  // Calculate completeness
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

  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
            <a href="/dashboard" className="hover:text-slate-700">Dashboard</a>
            <span>/</span>
            <span className="text-slate-900 font-medium">Profile</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">Professional Profile</h1>
          <p className="text-slate-600 mt-2">View professional profile and expertise</p>
        </div>
        {/* Hero Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-slate-900">
                  {user.first_name} {user.last_name}
                </h1>
                <StatusBadge status={status} />
              </div>
              
              {profile?.job_title && (
                <p className="text-xl text-slate-600 mb-2">{profile.job_title}</p>
              )}
              
              {profile?.bio && (
                <p className="text-slate-700 leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>
            
            <div className="lg:w-80">
              <CompletenessMeter
                segments={completeness.segments}
                percent={completeness.percent}
                missing={completeness.missing}
              />
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-8">
          {/* Basic Information */}
          <SectionCard title="Basic Information">
            <BasicInfoView user={user} profile={profile} />
          </SectionCard>

          {/* References */}
          <SectionCard title="Professional References">
            <ReferencesView references={references} />
          </SectionCard>

          {/* Qualifications */}
          <SectionCard title="Educational Qualifications">
            <QualificationsView qualifications={education} />
          </SectionCard>

          {/* Certifications */}
          <SectionCard title="Professional Certifications">
            <CertificationsView certifications={certifications} />
          </SectionCard>

          {/* Portfolio */}
          <SectionCard title="Portfolio Projects">
            <PortfolioView portfolio={portfolio} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
