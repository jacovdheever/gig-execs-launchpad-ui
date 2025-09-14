import React, { useState } from 'react';
import { SectionCard } from '@/components/profile/SectionCard';
import { CompletenessMeter } from '@/components/profile/CompletenessMeter';
import { StatusBadge } from '@/components/profile/StatusBadge';
import { BasicInfoView } from '@/components/profile/BasicInfoView';
import { ReferencesForm } from '@/components/profile/ReferencesForm';
import { QualificationsForm } from '@/components/profile/QualificationsForm';
import { CertificationsForm } from '@/components/profile/CertificationsForm';
import { PortfolioForm } from '@/components/profile/PortfolioForm';
import { IdDocumentUploader } from '@/components/profile/IdDocumentUploader';
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

interface ProfileEditProps {
  profileData: ProfileData;
  onUpdate: (data: ProfileData) => void;
}

export function ProfileEdit({ profileData, onUpdate }: ProfileEditProps) {
  const { user, profile, references, education, certifications, portfolio } = profileData;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  // File upload helper
  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    try {
      let result;
      
      if (bucket === 'profile-docs') {
        // Determine document type based on context (this is a simplified approach)
        const documentType = 'document'; // You could make this more specific based on the form
        result = await uploadProfileDocument(file, user.id, documentType);
      } else if (bucket === 'portfolio') {
        result = await uploadPortfolioFile(file, user.id);
      } else {
        throw new Error(`Unknown bucket: ${bucket}`);
      }

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Upload failed');
      }

      return result.url;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  // Reference handlers
  const handleAddReference = async (reference: Omit<Reference, 'id'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reference_contacts')
        .insert([{ ...reference, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      onUpdate({
        ...profileData,
        references: [...references, data],
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditReference = async (id: number, reference: Omit<Reference, 'id'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reference_contacts')
        .update(reference)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      onUpdate({
        ...profileData,
        references: references.map(r => r.id === id ? data : r),
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReference = async (id: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reference_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onUpdate({
        ...profileData,
        references: references.filter(r => r.id !== id),
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Education handlers
  const handleAddEducation = async (educationData: Omit<Education, 'id'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('education')
        .insert([{ ...educationData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      onUpdate({
        ...profileData,
        education: [...education, data],
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEducation = async (id: number, educationData: Omit<Education, 'id'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('education')
        .update(educationData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      onUpdate({
        ...profileData,
        education: education.map(e => e.id === id ? data : e),
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEducation = async (id: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onUpdate({
        ...profileData,
        education: education.filter(e => e.id !== id),
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Certification handlers
  const handleAddCertification = async (certification: Omit<Certification, 'id'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('certifications')
        .insert([{ ...certification, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      onUpdate({
        ...profileData,
        certifications: [...certifications, data],
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCertification = async (id: number, certification: Omit<Certification, 'id'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('certifications')
        .update(certification)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      onUpdate({
        ...profileData,
        certifications: certifications.map(c => c.id === id ? data : c),
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCertification = async (id: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onUpdate({
        ...profileData,
        certifications: certifications.filter(c => c.id !== id),
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Portfolio handlers
  const handleAddPortfolio = async (item: Omit<PortfolioItem, 'id'>) => {
    console.log('=== handleAddPortfolio called ===');
    console.log('Original item:', item);
    
    setIsLoading(true);
    try {
      // Clean the data before sending - convert empty strings to null for date fields
      const cleanItem = {
        project_name: item.project_name,
        project_role: item.project_role && item.project_role.trim() !== '' ? item.project_role : null,
        description: item.description && item.description.trim() !== '' ? item.description : null,
        start_date: item.start_date && item.start_date.trim() !== '' ? item.start_date : null,
        completed_date: item.completed_date && item.completed_date.trim() !== '' ? item.completed_date : null,
        currently_open: item.currently_open || false,
        solution_video_url: item.solution_video_url && item.solution_video_url.trim() !== '' ? item.solution_video_url : null,
        solution_files: item.solution_files || null,
        skills: item.skills || null,
        user_id: user.id
      };
      
      console.log('Adding portfolio item (cleaned):', cleanItem);
      const { data, error } = await supabase
        .from('portfolio')
        .insert([cleanItem])
        .select()
        .single();

      if (error) {
        console.error('Portfolio insert error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        throw error;
      }

      onUpdate({
        ...profileData,
        portfolio: [...portfolio, data],
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPortfolio = async (id: number, item: Omit<PortfolioItem, 'id'>) => {
    console.log('=== handleEditPortfolio called ===');
    console.log('ID:', id);
    console.log('Item data:', item);
    console.log('Item data JSON:', JSON.stringify(item, null, 2));
    
    // Clean the data before sending - convert empty strings to null for date fields
    const cleanItem = {
      ...item,
      start_date: item.start_date && item.start_date.trim() !== '' ? item.start_date : null,
      completed_date: item.completed_date && item.completed_date.trim() !== '' ? item.completed_date : null,
      solution_video_url: item.solution_video_url && item.solution_video_url.trim() !== '' ? item.solution_video_url : null,
    };
    
    console.log('Cleaned item for update:', cleanItem);
    
    setIsLoading(true);
    try {
      console.log('Updating portfolio item with ID:', id);
      const { data, error } = await supabase
        .from('portfolio')
        .update(cleanItem)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Portfolio update error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        throw error;
      }

      onUpdate({
        ...profileData,
        portfolio: portfolio.map(p => p.id === id ? data : p),
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onUpdate({
        ...profileData,
        portfolio: portfolio.filter(p => p.id !== id),
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ID Document handlers
  const handleUploadIdDocument = async (file: File) => {
    const fileUrl = await uploadFile(file, 'profile-docs');
    
    const { error } = await supabase
      .from('consultant_profiles')
      .update({ id_doc_url: fileUrl })
      .eq('user_id', user.id);

    if (error) throw error;

    onUpdate({
      ...profileData,
      profile: { ...profile, id_doc_url: fileUrl },
    });

    return fileUrl;
  };

  const handleRemoveIdDocument = async () => {
    const { error } = await supabase
      .from('consultant_profiles')
      .update({ id_doc_url: null })
      .eq('user_id', user.id);

    if (error) throw error;

    onUpdate({
      ...profileData,
      profile: { ...profile, id_doc_url: undefined },
    });
  };

  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
            <a href="/dashboard" className="hover:text-slate-700">Dashboard</a>
            <span>/</span>
            <span className="text-slate-900 font-medium">My Profile</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-2">Manage your professional profile and showcase your expertise</p>
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
            <ReferencesForm
              references={references}
              onAdd={handleAddReference}
              onEdit={handleEditReference}
              onDelete={handleDeleteReference}
              isLoading={isLoading}
            />
          </SectionCard>

          {/* ID Document */}
          <SectionCard title="Proof of ID Document">
            <IdDocumentUploader
              currentDocumentUrl={profile?.id_doc_url}
              onUpload={handleUploadIdDocument}
              onRemove={handleRemoveIdDocument}
              isLoading={isLoading}
            />
          </SectionCard>

          {/* Qualifications */}
          <SectionCard title="Educational Qualifications">
            <QualificationsForm
              qualifications={education}
              onAdd={handleAddEducation}
              onEdit={handleEditEducation}
              onDelete={handleDeleteEducation}
              onUploadFile={(file) => uploadFile(file, 'profile-docs')}
              isLoading={isLoading}
            />
          </SectionCard>

          {/* Certifications */}
          <SectionCard title="Professional Certifications">
            <CertificationsForm
              certifications={certifications}
              onAdd={handleAddCertification}
              onEdit={handleEditCertification}
              onDelete={handleDeleteCertification}
              onUploadFile={(file) => uploadFile(file, 'profile-docs')}
              isLoading={isLoading}
            />
          </SectionCard>

          {/* Portfolio */}
          <SectionCard title="Portfolio Projects">
            <PortfolioForm
              portfolio={portfolio}
              onAdd={handleAddPortfolio}
              onEdit={handleEditPortfolio}
              onDelete={handleDeletePortfolio}
              onUploadFile={(file) => uploadFile(file, 'portfolio')}
              isLoading={isLoading}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
