import React, { useState } from 'react';
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
  console.log('🔍 ProfileEdit: Starting minimal component');
  
  // MINIMAL TEST - Just render basic info without complex components
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ProfileEdit - Minimal Test</h1>
      <p>User: {profileData.user.first_name} {profileData.user.last_name}</p>
      <p>Job Title: {profileData.profile?.job_title}</p>
      <p>If this loads without error, the issue is in ProfileEdit's child components.</p>
    </div>
  );
}