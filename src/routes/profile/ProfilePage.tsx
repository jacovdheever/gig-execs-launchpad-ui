import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { ProfileView } from './ProfileView';
import { ProfileEdit } from './ProfileEdit';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ProfileUser {
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
  user: ProfileUser;
  profile?: ConsultantProfile;
  references: Reference[];
  education: Education[];
  certifications: Certification[];
  portfolio: PortfolioItem[];
}

export function ProfilePage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get current user
        const user = await getCurrentUser();
        if (!user) {
          navigate('/auth/login');
          return;
        }
        setCurrentUser(user);

        // Determine if this is the user's own profile or viewing someone else's
        const profileId = id || user.id;
        const isOwnProfile = profileId === user.id;
        setIsOwner(isOwnProfile);

        // Load profile data
        
        // Load user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', profileId)
          .single();

        if (userError) {
          throw new Error(`Failed to load user: ${userError.message}`);
        }

        // Load consultant profile
        const { data: consultantProfile, error: profileError } = await supabase
          .from('consultant_profiles')
          .select('*')
          .eq('user_id', profileId)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw new Error(`Failed to load consultant profile: ${profileError.message}`);
        }

        // Load references
        const { data: references, error: referencesError } = await supabase
          .from('reference_contacts')
          .select('*')
          .eq('user_id', profileId);

        if (referencesError) {
          throw new Error(`Failed to load references: ${referencesError.message}`);
        }

        // Load education
        const { data: education, error: educationError } = await supabase
          .from('education')
          .select('*')
          .eq('user_id', profileId)
          .order('start_date', { ascending: false });

        if (educationError) {
          throw new Error(`Failed to load education: ${educationError.message}`);
        }

        // Load certifications
        const { data: certifications, error: certificationsError } = await supabase
          .from('certifications')
          .select('*')
          .eq('user_id', profileId)
          .order('issue_date', { ascending: false });

        if (certificationsError) {
          throw new Error(`Failed to load certifications: ${certificationsError.message}`);
        }

        // Load portfolio
        const { data: portfolio, error: portfolioError } = await supabase
          .from('portfolio')
          .select('*')
          .eq('user_id', profileId)
          .order('start_date', { ascending: false });

        if (portfolioError) {
          throw new Error(`Failed to load portfolio: ${portfolioError.message}`);
        }

        setProfileData({
          user: userData,
          profile: consultantProfile,
          references: references || [],
          education: education || [],
          certifications: certifications || [],
          portfolio: portfolio || [],
        });

      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error loading profile',
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
          variant: 'destructive',
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0284C7] mx-auto mb-4"></div>
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!profileData) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-slate-600">Profile not found</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 text-[#0284C7] hover:underline"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Only allow editing if user is viewing their own profile and is a consultant
  if (isOwner && profileData.user.user_type === 'consultant') {
    return (
      <AppShell>
        <ProfileEdit
          profileData={profileData}
          onUpdate={setProfileData}
        />
      </AppShell>
    );
  }

  // View mode for others or non-consultants
  return (
    <AppShell>
      <ProfileView
        profileData={profileData}
        isOwner={isOwner}
      />
    </AppShell>
  );
}
