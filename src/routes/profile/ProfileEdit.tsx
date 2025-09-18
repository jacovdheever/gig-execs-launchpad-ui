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
import { uploadProfileDocument, uploadPortfolioFile } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

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
  
  const { 
    user, 
    profile, 
    references = [], 
    education = [], 
    certifications = [], 
    portfolio = [] 
  } = profileData;
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
            references={references}
            onAdd={async (ref) => {
              try {
                const { data, error } = await supabase
                  .from('reference_contacts')
                  .insert([{
                    user_id: user.id,
                    first_name: ref.first_name,
                    last_name: ref.last_name,
                    email: ref.email,
                    phone: ref.phone || null,
                    company_name: ref.company_name || null,
                    description: ref.description || null
                  }])
                  .select()
                  .single();

                if (error) throw error;

                // Update local state
                const newReference = { ...data, id: data.id };
                onUpdate({
                  ...profileData,
                  references: [...references, newReference]
                });
              } catch (error) {
                console.error('Error adding reference:', error);
                throw error;
              }
            }}
            onEdit={async (id, ref) => {
              try {
                const { error } = await supabase
                  .from('reference_contacts')
                  .update({
                    first_name: ref.first_name,
                    last_name: ref.last_name,
                    email: ref.email,
                    phone: ref.phone || null,
                    company_name: ref.company_name || null,
                    description: ref.description || null
                  })
                  .eq('id', id)
                  .eq('user_id', user.id);

                if (error) throw error;

                // Update local state
                const updatedReferences = references.map(r => 
                  r.id === id ? { ...r, ...ref } : r
                );
                onUpdate({
                  ...profileData,
                  references: updatedReferences
                });
              } catch (error) {
                console.error('Error updating reference:', error);
                throw error;
              }
            }}
            onDelete={async (id) => {
              try {
                const { error } = await supabase
                  .from('reference_contacts')
                  .delete()
                  .eq('id', id)
                  .eq('user_id', user.id);

                if (error) throw error;

                // Update local state
                const filteredReferences = references.filter(r => r.id !== id);
                onUpdate({
                  ...profileData,
                  references: filteredReferences
                });
              } catch (error) {
                console.error('Error deleting reference:', error);
                throw error;
              }
            }}
          />
        )}
        
        {activeTab === 'qualifications' && (
          <QualificationsForm 
            qualifications={education}
            onAdd={async (qual) => {
              try {
                const { data, error } = await supabase
                  .from('education')
                  .insert([{
                    user_id: user.id,
                    institution_name: qual.institution_name,
                    degree_level: qual.degree_level,
                    grade: qual.grade || null,
                    start_date: qual.start_date || null,
                    end_date: qual.end_date || null,
                    description: qual.description || null,
                    file_url: qual.file_url || null
                  }])
                  .select()
                  .single();

                if (error) throw error;

                // Update local state
                onUpdate({
                  ...profileData,
                  education: [...education, data]
                });
              } catch (error) {
                console.error('Error adding qualification:', error);
                throw error;
              }
            }}
            onEdit={async (id, qual) => {
              try {
                const { error } = await supabase
                  .from('education')
                  .update({
                    institution_name: qual.institution_name,
                    degree_level: qual.degree_level,
                    grade: qual.grade || null,
                    start_date: qual.start_date || null,
                    end_date: qual.end_date || null,
                    description: qual.description || null,
                    file_url: qual.file_url || null
                  })
                  .eq('id', id)
                  .eq('user_id', user.id);

                if (error) throw error;

                // Update local state
                const updatedEducation = education.map(e => 
                  e.id === id ? { ...e, ...qual } : e
                );
                onUpdate({
                  ...profileData,
                  education: updatedEducation
                });
              } catch (error) {
                console.error('Error updating qualification:', error);
                throw error;
              }
            }}
            onDelete={async (id) => {
              try {
                const { error } = await supabase
                  .from('education')
                  .delete()
                  .eq('id', id)
                  .eq('user_id', user.id);

                if (error) throw error;

                // Update local state
                const filteredEducation = education.filter(e => e.id !== id);
                onUpdate({
                  ...profileData,
                  education: filteredEducation
                });
              } catch (error) {
                console.error('Error deleting qualification:', error);
                throw error;
              }
            }}
            onUploadFile={async (file) => {
              try {
                const result = await uploadProfileDocument(file, user.id, 'qualification');
                if (!result.success) {
                  throw new Error(result.error);
                }
                return result.url;
              } catch (error) {
                console.error('Error uploading qualification document:', error);
                throw error;
              }
            }}
          />
        )}
        
        {activeTab === 'certifications' && (
          <CertificationsForm 
            certifications={certifications}
            onAdd={async (cert) => {
              try {
                const { data, error } = await supabase
                  .from('certifications')
                  .insert([{
                    user_id: user.id,
                    name: cert.name,
                    awarding_body: cert.awarding_body,
                    issue_date: cert.issue_date || null,
                    expiry_date: cert.expiry_date || null,
                    credential_id: cert.credential_id || null,
                    credential_url: cert.credential_url || null,
                    file_url: cert.file_url || null
                  }])
                  .select()
                  .single();

                if (error) throw error;

                // Update local state
                onUpdate({
                  ...profileData,
                  certifications: [...certifications, data]
                });
              } catch (error) {
                console.error('Error adding certification:', error);
                throw error;
              }
            }}
            onEdit={async (id, cert) => {
              try {
                const { error } = await supabase
                  .from('certifications')
                  .update({
                    name: cert.name,
                    awarding_body: cert.awarding_body,
                    issue_date: cert.issue_date || null,
                    expiry_date: cert.expiry_date || null,
                    credential_id: cert.credential_id || null,
                    credential_url: cert.credential_url || null,
                    file_url: cert.file_url || null
                  })
                  .eq('id', id)
                  .eq('user_id', user.id);

                if (error) throw error;

                // Update local state
                const updatedCertifications = certifications.map(c => 
                  c.id === id ? { ...c, ...cert } : c
                );
                onUpdate({
                  ...profileData,
                  certifications: updatedCertifications
                });
              } catch (error) {
                console.error('Error updating certification:', error);
                throw error;
              }
            }}
            onDelete={async (id) => {
              try {
                const { error } = await supabase
                  .from('certifications')
                  .delete()
                  .eq('id', id)
                  .eq('user_id', user.id);

                if (error) throw error;

                // Update local state
                const filteredCertifications = certifications.filter(c => c.id !== id);
                onUpdate({
                  ...profileData,
                  certifications: filteredCertifications
                });
              } catch (error) {
                console.error('Error deleting certification:', error);
                throw error;
              }
            }}
            onUploadFile={async (file) => {
              try {
                const result = await uploadProfileDocument(file, user.id, 'certification');
                if (!result.success) {
                  throw new Error(result.error);
                }
                return result.url;
              } catch (error) {
                console.error('Error uploading certification document:', error);
                throw error;
              }
            }}
          />
        )}
        
        {activeTab === 'portfolio' && (
          <PortfolioForm 
            portfolio={portfolio}
            onAdd={async (proj) => {
              try {
                const { data, error } = await supabase
                  .from('portfolio')
                  .insert([{
                    user_id: user.id,
                    project_name: proj.project_name,
                    project_role: proj.project_role || null,
                    description: proj.description || null,
                    start_date: proj.start_date || null,
                    completed_date: proj.completed_date || null,
                    currently_open: proj.currently_open || false,
                    problem_video_url: proj.problem_video_url || null,
                    problem_files: proj.problem_files || null,
                    solution_video_url: proj.solution_video_url || null,
                    solution_files: proj.solution_files || null,
                    skills: proj.skills || null,
                    portfolio_files: proj.portfolio_files || null
                  }])
                  .select()
                  .single();

                if (error) throw error;

                // Update local state
                onUpdate({
                  ...profileData,
                  portfolio: [...portfolio, data]
                });
              } catch (error) {
                console.error('Error adding portfolio project:', error);
                throw error;
              }
            }}
            onEdit={async (id, proj) => {
              try {
                const { error } = await supabase
                  .from('portfolio')
                  .update({
                    project_name: proj.project_name,
                    project_role: proj.project_role || null,
                    description: proj.description || null,
                    start_date: proj.start_date || null,
                    completed_date: proj.completed_date || null,
                    currently_open: proj.currently_open || false,
                    problem_video_url: proj.problem_video_url || null,
                    problem_files: proj.problem_files || null,
                    solution_video_url: proj.solution_video_url || null,
                    solution_files: proj.solution_files || null,
                    skills: proj.skills || null,
                    portfolio_files: proj.portfolio_files || null
                  })
                  .eq('id', id)
                  .eq('user_id', user.id);

                if (error) throw error;

                // Update local state
                const updatedPortfolio = portfolio.map(p => 
                  p.id === id ? { ...p, ...proj } : p
                );
                onUpdate({
                  ...profileData,
                  portfolio: updatedPortfolio
                });
              } catch (error) {
                console.error('Error updating portfolio project:', error);
                throw error;
              }
            }}
            onDelete={async (id) => {
              try {
                const { error } = await supabase
                  .from('portfolio')
                  .delete()
                  .eq('id', id)
                  .eq('user_id', user.id);

                if (error) throw error;

                // Update local state
                const filteredPortfolio = portfolio.filter(p => p.id !== id);
                onUpdate({
                  ...profileData,
                  portfolio: filteredPortfolio
                });
              } catch (error) {
                console.error('Error deleting portfolio project:', error);
                throw error;
              }
            }}
            onUploadFile={async (file) => {
              try {
                const result = await uploadPortfolioFile(file, user.id);
                if (!result.success) {
                  throw new Error(result.error);
                }
                return result.url;
              } catch (error) {
                console.error('Error uploading portfolio file:', error);
                throw error;
              }
            }}
          />
        )}
        
        {activeTab === 'documents' && (
          <IdDocumentUploader 
            currentDocumentUrl={profile?.id_doc_url}
            onUpload={async (file) => {
              try {
                console.log('🔍 ID Document Upload: Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);
                console.log('🔍 ID Document Upload: User ID:', user.id);
                
                const result = await uploadProfileDocument(file, user.id, 'id');
                console.log('🔍 ID Document Upload: Upload result:', result);
                
                if (!result.success) {
                  console.error('🔍 ID Document Upload: Upload failed:', result.error);
                  throw new Error(result.error);
                }
                
                console.log('🔍 ID Document Upload: Upload successful, updating database with URL:', result.url);
                
                // Update consultant_profiles table with the new document URL
                const { error } = await supabase
                  .from('consultant_profiles')
                  .update({ id_doc_url: result.url })
                  .eq('user_id', user.id);
                
                if (error) {
                  console.error('🔍 ID Document Upload: Database update failed:', error);
                  throw error;
                }
                
                console.log('🔍 ID Document Upload: Database updated successfully, refreshing data');
                
                // Refresh profile data
                refetchData();
                
                return result.url;
              } catch (error) {
                console.error('🔍 ID Document Upload: Error in upload process:', error);
                throw error;
              }
            }}
            onRemove={async () => {
              try {
                // Remove the document URL from the database
                const { error } = await supabase
                  .from('consultant_profiles')
                  .update({ id_doc_url: null })
                  .eq('user_id', user.id);
                
                if (error) throw error;
                
                // Refresh profile data
                refetchData();
              } catch (error) {
                console.error('Error removing ID document:', error);
                throw error;
              }
            }}
          />
        )}
      </div>
    </div>
  );
}