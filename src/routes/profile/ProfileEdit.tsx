import React, { useState, useRef, useEffect } from 'react';
import { User, FileText, Award, Briefcase, Upload, GraduationCap, Briefcase as WorkIcon, ChevronRight } from 'lucide-react';
import { SectionCard } from '@/components/profile/SectionCard';
import { ProfileStatusCard } from '@/components/profile/ProfileStatusCard';
import { BasicInfoForm } from '@/components/profile/BasicInfoForm';
import { ReferencesForm } from '@/components/profile/ReferencesForm';
import { QualificationsForm } from '@/components/profile/QualificationsForm';
import { CertificationsForm } from '@/components/profile/CertificationsForm';
import { PortfolioForm } from '@/components/profile/PortfolioForm';
import { WorkExperienceForm } from '@/components/profile/WorkExperienceForm';
import { IdDocumentUploader } from '@/components/profile/IdDocumentUploader';
import { useProfileStatus } from '@/hooks/useProfileStatus';
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

interface WorkExperience {
  id: number;
  company: string;
  job_title: string;
  city?: string;
  country_id?: number;
  start_date_month: string;
  start_date_year: number;
  end_date_month?: string;
  end_date_year?: number;
  currently_working: boolean;
  description?: string;
}

interface ProfileData {
  user: User;
  profile?: ConsultantProfile;
  references: Reference[];
  education: Education[];
  certifications: Certification[];
  workExperience: WorkExperience[];
  portfolio: PortfolioItem[];
}

interface ProfileEditProps {
  profileData: ProfileData;
  onUpdate: (data: ProfileData) => void;
}

export function ProfileEdit({ profileData, onUpdate }: ProfileEditProps) {
  const { 
    user, 
    profile, 
    references = [], 
    education = [], 
    certifications = [], 
    workExperience = [],
    portfolio = [] 
  } = profileData;
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const tabsNavRef = useRef<HTMLElement>(null);
  const { toast } = useToast();
  
  // Check if tabs can scroll (for mobile scroll indicator)
  useEffect(() => {
    const checkScrollable = () => {
      const nav = tabsNavRef.current;
      if (nav) {
        // Show indicator if there's more content to scroll
        const canScroll = nav.scrollWidth > nav.clientWidth;
        const notAtEnd = nav.scrollLeft < nav.scrollWidth - nav.clientWidth - 10;
        setShowScrollIndicator(canScroll && notAtEnd);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    const nav = tabsNavRef.current;
    if (nav) {
      nav.addEventListener('scroll', checkScrollable);
    }

    return () => {
      window.removeEventListener('resize', checkScrollable);
      if (nav) {
        nav.removeEventListener('scroll', checkScrollable);
      }
    };
  }, []);

  // Use the new profile status hook
  const { 
    status: profileStatus, 
    isLoading: statusLoading, 
    error: statusError,
    refresh: refreshStatus 
  } = useProfileStatus(user.id);

  // Helper function to sort work experience by latest first
  const sortWorkExperience = (experiences: WorkExperience[]) => {
    return experiences.sort((a, b) => {
      // Sort by year first (descending), then by month (descending)
      if (a.start_date_year !== b.start_date_year) {
        return b.start_date_year - a.start_date_year;
      }
      // If years are equal, sort by month (descending)
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthOrder.indexOf(b.start_date_month) - monthOrder.indexOf(a.start_date_month);
    });
  };

  // Define navigation tabs (ordered by importance/flow)
  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: User },
    { id: 'work-experience', name: 'Work Experience', icon: WorkIcon },
    { id: 'references', name: 'References', icon: FileText },
    { id: 'documents', name: 'Documents', icon: Upload },
    { id: 'qualifications', name: 'Qualifications', icon: GraduationCap },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
  ];
  
  // Refresh status when profile data changes (e.g., after saving)
  const handleProfileSaved = () => {
    refreshStatus();
  };

  // Handle profile updates
  const handleProfileUpdate = (updatedData: any) => {
    onUpdate({
      ...profileData,
      user: updatedData.user || profileData.user,
      profile: updatedData.profile || profileData.profile,
    });
  };

  // Refetch data by updating the profile data
  const refetchData = async () => {
    console.log('Refetching profile data...');
    try {
      // Reload consultant profile to get updated id_doc_url
      const { data: updatedProfile, error } = await supabase
        .from('consultant_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error refetching profile:', error);
        return;
      }
      
      // Update the profile data with the new information
      onUpdate({
        ...profileData,
        profile: updatedProfile
      });
      
      console.log('Profile data refreshed successfully');
    } catch (error) {
      console.error('Error during profile refresh:', error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Status Card */}
      <div className="mb-8">
        <ProfileStatusCard
          status={profileStatus}
          isLoading={statusLoading}
          error={statusError}
          onCtaClick={() => {
            // Scroll to the tabs section when CTA is clicked
            const tabsElement = document.getElementById('profile-tabs');
            if (tabsElement) {
              tabsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        />
      </div>

      {/* Navigation Tabs */}
      <div id="profile-tabs" className="relative border-b border-slate-200 mb-8 scroll-mt-4">
        <nav 
          ref={tabsNavRef}
          className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide pr-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
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
        
        {/* Scroll indicator - gradient fade with arrow (shown when tabs overflow) */}
        {showScrollIndicator && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none">
            {/* Gradient fade */}
            <div className="w-12 h-full bg-gradient-to-l from-white via-white/80 to-transparent" />
            {/* Arrow indicator */}
            <div className="absolute right-1 flex items-center justify-center w-6 h-6 bg-slate-100 rounded-full shadow-sm animate-pulse">
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'basic' && (
          <BasicInfoForm 
            user={user}
            profile={profile}
            onUpdate={handleProfileUpdate}
            onSaved={handleProfileSaved}
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
                handleProfileSaved();
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
                handleProfileSaved();
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
                handleProfileSaved();
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
                handleProfileSaved();
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
                handleProfileSaved();
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
                handleProfileSaved();
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
                handleProfileSaved();
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
                handleProfileSaved();
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
                handleProfileSaved();
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
        
        {activeTab === 'work-experience' && (
          <WorkExperienceForm 
            workExperiences={workExperience}
            onAdd={async (exp) => {
              try {
                const { data, error } = await supabase
                  .from('work_experience')
                  .insert([{
                    user_id: user.id,
                    company: exp.company,
                    job_title: exp.job_title,
                    city: exp.city || null,
                    country_id: exp.country_id || null,
                    start_date_month: exp.start_date_month,
                    start_date_year: exp.start_date_year,
                    end_date_month: exp.end_date_month || null,
                    end_date_year: exp.end_date_year || null,
                    currently_working: exp.currently_working || false,
                    description: exp.description || null
                  }])
                  .select()
                  .single();

                if (error) throw error;

                // Update local state with proper sorting
                const updatedWorkExperience = sortWorkExperience([...workExperience, data]);
                onUpdate({
                  ...profileData,
                  workExperience: updatedWorkExperience
                });
                handleProfileSaved();
              } catch (error) {
                console.error('Error adding work experience:', error);
                throw error;
              }
            }}
            onEdit={async (id, exp) => {
              try {
                const { error } = await supabase
                  .from('work_experience')
                  .update({
                    company: exp.company,
                    job_title: exp.job_title,
                    city: exp.city || null,
                    country_id: exp.country_id || null,
                    start_date_month: exp.start_date_month,
                    start_date_year: exp.start_date_year,
                    end_date_month: exp.end_date_month || null,
                    end_date_year: exp.end_date_year || null,
                    currently_working: exp.currently_working || false,
                    description: exp.description || null
                  })
                  .eq('id', id)
                  .eq('user_id', user.id);

                if (error) throw error;

                // Update local state with proper sorting
                const updatedWorkExperience = workExperience.map(w => 
                  w.id === id ? { ...w, ...exp } : w
                );
                const sortedWorkExperience = sortWorkExperience(updatedWorkExperience);
                onUpdate({
                  ...profileData,
                  workExperience: sortedWorkExperience
                });
                handleProfileSaved();
              } catch (error) {
                console.error('Error updating work experience:', error);
                throw error;
              }
            }}
            onDelete={async (id) => {
              try {
                const { error } = await supabase
                  .from('work_experience')
                  .delete()
                  .eq('id', id)
                  .eq('user_id', user.id);

                if (error) throw error;

                // Update local state
                const filteredWorkExperience = workExperience.filter(w => w.id !== id);
                onUpdate({
                  ...profileData,
                  workExperience: filteredWorkExperience
                });
                handleProfileSaved();
              } catch (error) {
                console.error('Error deleting work experience:', error);
                throw error;
              }
            }}
            isLoading={isLoading}
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
                handleProfileSaved();
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
                handleProfileSaved();
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
                handleProfileSaved();
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
                
                // Refresh profile data and status
                await refetchData();
                handleProfileSaved();
                
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
                
                // Refresh profile data and status
                await refetchData();
                handleProfileSaved();
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