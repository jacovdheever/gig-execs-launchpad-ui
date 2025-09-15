import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  FileText, 
  CheckCircle,
  User
} from 'lucide-react'
import { CompletenessMeter } from '@/components/profile/CompletenessMeter'
import { StatusBadge } from '@/components/profile/StatusBadge'
import { computeCompleteness, computeProfileStatus, type CompletenessData } from '@/lib/profile'
import { usePosts } from '@/lib/community.hooks'
import type { ForumPost } from '@/lib/community.types'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser'
import { supabase } from '@/lib/supabase'

// Community Posts Grid Component
function CommunityPostsGrid() {
  const navigate = useNavigate();
  const { data: feedData, isLoading, error } = usePosts({
    categoryId: null,
    sort: 'new',
    page: 0,
    limit: 3
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-200 h-32 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-slate-500">
        Unable to load community posts
      </div>
    );
  }

  const posts = feedData?.posts || [];

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No community posts yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {posts.map((post: ForumPost) => (
        <div key={post.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/community')}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
              {post.author?.profile_photo_url ? (
                <img
                  src={post.author.profile_photo_url}
                  alt={`${post.author.first_name} ${post.author.last_name}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-slate-600">
                  {getInitials(post.author?.first_name || 'U', post.author?.last_name || 'U')}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-900 text-sm mb-1 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500">
                {post.author?.first_name} {post.author?.last_name}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600 line-clamp-3">
            {truncateText(stripHtml(post.body || ''))}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{post.category?.name || 'General'}</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/community');
              }}
            >
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then((userData) => {
        setUser(userData);
      })
      .catch((err) => {
        console.error('Dashboard: Error loading user:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Calculate accurate profile completeness based on completed mandatory fields
  const calculateProfileCompleteness = async (userId: string, userRole: string) => {
    try {
      
      if (userRole === 'consultant') {
        // Consultant mandatory fields across all 6 steps
        const { data: consultantProfile } = await supabase
          .from('consultant_profiles')
          .select('job_title, bio, address1, country, hourly_rate_min, hourly_rate_max')
          .eq('user_id', userId)
          .single();

        const { data: userSkills } = await supabase
          .from('user_skills')
          .select('skill_id')
          .eq('user_id', userId);

        const { data: userIndustries } = await supabase
          .from('user_industries')
          .select('industry_id')
          .eq('user_id', userId);

        const { data: userLanguages } = await supabase
          .from('user_languages')
          .select('language_id')
          .eq('user_id', userId);

        const { data: workExperience, error: workExpError } = await supabase
          .from('work_experience')
          .select('id, company, job_title, user_id')
          .eq('user_id', userId);

        if (workExpError) {
          console.error('Error loading work experience:', workExpError);
        }

        // Calculate completion based on TRULY mandatory fields across 6 steps
        let completedFields = 0;
        const totalFields = 9; // 9 mandatory fields: job_title, address1, country, work_exp, skills, industries, languages, hourly_rate_min, hourly_rate_max

        // Step 2: Personal & Location (3 mandatory fields + 1 optional)
        const jobTitleComplete = !!consultantProfile?.job_title;
        const addressComplete = !!consultantProfile?.address1;
        const countryComplete = !!consultantProfile?.country;
        // Note: bio is optional, not counted in mandatory fields

        if (jobTitleComplete) completedFields++;
        if (addressComplete) completedFields++;
        if (countryComplete) completedFields++;

        // Step 3: Work Experience (at least 1 entry required)
        const workExpComplete = workExperience && workExperience.length > 0;
        if (workExpComplete) completedFields++;

        // Step 4: Skills & Industries (2 fields)
        const skillsComplete = userSkills && userSkills.length > 0;
        const industriesComplete = userIndustries && userIndustries.length > 0;
        
        if (skillsComplete) completedFields++;
        if (industriesComplete) completedFields++;

        // Step 5: Languages (at least 1 language required)
        const languagesComplete = userLanguages && userLanguages.length > 0;
        if (languagesComplete) completedFields++;

        // Step 6: Hourly Rate (2 separate fields)
        const hourlyRateMinComplete = !!consultantProfile?.hourly_rate_min;
        const hourlyRateMaxComplete = !!consultantProfile?.hourly_rate_max;
        
        if (hourlyRateMinComplete) completedFields++;
        if (hourlyRateMaxComplete) completedFields++;

        return Math.round((completedFields / totalFields) * 100);
      } else {
        // Client mandatory fields
        const { data: clientProfile, error: clientError } = await supabase
          .from('client_profiles')
          .select('job_title, company_name, organisation_type, industry, address1, country_id')
          .eq('user_id', userId)
          .single();

        if (clientError) {
          console.error('Error loading client profile:', clientError);
        }


        // Calculate completion based on mandatory fields
        let completedFields = 0;
        const totalFields = 6; // job_title, company_name, organisation_type, industry, address1, country_id

        // Check each field individually
        const jobTitleComplete = !!clientProfile?.job_title;
        const companyNameComplete = !!clientProfile?.company_name;
        const orgTypeComplete = !!clientProfile?.organisation_type;
        const industryComplete = !!clientProfile?.industry;
        const addressComplete = !!clientProfile?.address1;
        const countryComplete = !!clientProfile?.country_id;

        if (jobTitleComplete) completedFields++;
        if (companyNameComplete) completedFields++;
        if (orgTypeComplete) completedFields++;
        if (industryComplete) completedFields++;
        if (addressComplete) completedFields++;
        if (countryComplete) completedFields++;


        return Math.round((completedFields / totalFields) * 100);
      }
    } catch (error) {
      console.error('Error calculating profile completeness:', error);
      console.error('Full error object:', error);
      return 0;
    }
  };

  // State for profile completeness
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [completenessData, setCompletenessData] = useState<CompletenessData | null>(null);
  const [computedCompleteness, setComputedCompleteness] = useState<any>(null);
  const [profileTier, setProfileTier] = useState<'BASIC' | 'FULL' | 'ALL_STAR'>('BASIC');
  const [vettingStatus, setVettingStatus] = useState<string | null>(null);
  
  // Load profile completeness on component mount and when user changes
  useEffect(() => {
    if (user) {
      calculateProfileCompleteness(user.id, user.role).then(async (percentage) => {
        setProfileCompleteness(percentage);
        
        // Also calculate detailed completeness data for Profile Strength component
        if (user.role === 'consultant') {
          try {
            // Load all necessary data for completeness calculation
            const [profileResult, referencesResult, educationResult, certificationsResult, portfolioResult] = await Promise.all([
              supabase.from('consultant_profiles').select('*').eq('user_id', user.id).single(),
              supabase.from('reference_contacts').select('id').eq('user_id', user.id),
              supabase.from('education').select('id').eq('user_id', user.id),
              supabase.from('certifications').select('id').eq('user_id', user.id),
              supabase.from('portfolio').select('id').eq('user_id', user.id)
            ]);

            const profile = profileResult.data;
            const references = referencesResult.data || [];
            const education = educationResult.data || [];
            const certifications = certificationsResult.data || [];
            const portfolio = portfolioResult.data || [];

            const completenessData: CompletenessData = {
              basic: {
                hasCore: !!(user.firstName && user.lastName && user.email && profile?.job_title),
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

            const computedCompleteness = computeCompleteness(user.id, completenessData);
            const computedStatus = computeProfileStatus({
              tier: computedCompleteness.tier,
              vettingStatus: profile?.vetting_status || 'pending'
            });

            
            setCompletenessData(completenessData);
            setComputedCompleteness(computedCompleteness);
            setProfileTier(computedCompleteness.tier);
            setVettingStatus(profile?.vetting_status || 'pending');
            setProfileCompleteness(computedCompleteness.percent);
          } catch (error) {
            console.error('Error calculating detailed completeness:', error);
          }
        }
      });
    }
  }, [user]);
  
  // Additional refresh when component is focused or becomes visible
  useEffect(() => {
    if (user) {
      const handleFocus = () => {
        calculateProfileCompleteness(user.id, user.role).then(setProfileCompleteness);
      };
      
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          calculateProfileCompleteness(user.id, user.role).then(setProfileCompleteness);
        }
      };
      
      // Add listeners
      window.addEventListener('focus', handleFocus);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Cleanup
      return () => {
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [user]);
  
  // Refresh profile completeness when component becomes visible (user returns from onboarding)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        calculateProfileCompleteness(user.id, user.role).then(setProfileCompleteness);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh when the component gains focus (user navigates back)
    const handleFocus = () => {
      if (user) {
        calculateProfileCompleteness(user.id, user.role).then(setProfileCompleteness);
      }
    };

    window.addEventListener('focus', handleFocus);
    
    // Refresh when user navigates back to dashboard (using navigation events)
    const handlePopState = () => {
      if (user) {
        // Small delay to ensure data is saved
        setTimeout(() => {
          calculateProfileCompleteness(user.id, user.role).then(setProfileCompleteness);
        }, 500);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Refresh when the page becomes active (user switches back to tab)
    const handlePageShow = () => {
      if (user) {
        // Small delay to ensure data is saved
        setTimeout(() => {
          calculateProfileCompleteness(user.id, user.role).then(setProfileCompleteness);
        }, 500);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [user]);
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600">Error: User not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#012E46] to-[#4885AA] rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-slate-100">
          Here's what's happening today.
        </p>
      </div>

      {/* Profile Strength Section - Only for consultants */}
      {user.role === 'consultant' && completenessData && (
        <div className="w-full lg:w-1/2">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => {
              // If basic profile is incomplete, go to onboarding
              if (profileTier === 'BASIC' && !completenessData.basic.hasCore) {
                navigate('/onboarding/step1');
              } else {
                // Otherwise go to profile page
                navigate('/profile');
              }
            }}
          >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Strength
            </CardTitle>
            <CardDescription>
              {profileTier === 'BASIC' && !completenessData.basic.hasCore 
                ? 'Complete your basic profile to get started'
                : 'Manage your professional profile and visibility'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <CompletenessMeter 
                  segments={computedCompleteness?.segments || { basic: 0, full: 0, allStar: 0 }}
                  percent={profileCompleteness}
                  missing={computedCompleteness?.missing || { basic: [], full: [], allStar: [] }}
                />
              </div>
              <StatusBadge status={profileTier} />
            </div>
            <div className="flex justify-center">
              <Button 
                variant={profileTier === 'BASIC' && !completenessData.basic.hasCore ? "default" : "outline"}
                className="w-auto px-8"
              >
                {profileTier === 'BASIC' && !completenessData.basic.hasCore 
                  ? 'Complete Profile' 
                  : 'View Profile'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            
            {user.role === 'consultant' ? (
              <>
                <Button asChild className="h-auto p-4 flex-col space-y-2">
                  <Link to="/find-gigs">
                    <Briefcase className="h-6 w-6" />
                    <span>Browse Gigs</span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="h-auto p-4 flex-col space-y-2">
                  <Link to="/gig-creation/step1">
                    <FileText className="h-6 w-6" />
                    <span>Create Gig</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Link to="/projects">
                    <Briefcase className="h-6 w-6" />
                    <span>View Projects</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Link to="/dashboard/profile">
                    <FileText className="h-6 w-6" />
                    <span>Company Profile</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Latest from the Community */}
      <Card>
        <CardHeader>
          <CardTitle>Latest from the Community</CardTitle>
          <CardDescription>
            See what's happening in the GigExecs community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CommunityPostsGrid />
        </CardContent>
      </Card>

    </div>
  )
}

