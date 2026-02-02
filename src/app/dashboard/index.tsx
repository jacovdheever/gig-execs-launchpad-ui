import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Briefcase, 
  FileText, 
} from 'lucide-react'
import { ProfileStatusCard } from '@/components/profile/ProfileStatusCard'
import { useProfileStatus } from '@/hooks/useProfileStatus'
import { usePosts } from '@/lib/community.hooks'
import type { ForumPost } from '@/lib/community.types'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser'
import { toast } from 'sonner'

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

  // Load current user
  useEffect(() => {
    getCurrentUser()
      .then((userData) => {
        console.log('Dashboard: User data loaded:', userData);
        setUser(userData);
      })
      .catch((err) => {
        console.error('Dashboard: Error loading user:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Use the new profile status hook for consultants
  const { 
    status: profileStatus, 
    isLoading: statusLoading, 
    error: statusError,
    shouldSubmitForVetting 
  } = useProfileStatus(
    user?.role === 'consultant' ? user?.id : null,
    {
      autoRefresh: true,
      onVettingSubmitted: () => {
        // Show notification when profile is auto-submitted for vetting
        toast.success(
          'Profile submitted for vetting!',
          { description: 'Our team will review your profile and get back to you soon.' }
        );
      }
    }
  );

  // Note: Old profile completeness calculation removed. 
  // Using useProfileStatus hook instead (see above).
  

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

      {/* Profile Status Card - Only for consultants */}
      {user.role === 'consultant' && (
        <div className="w-full lg:w-2/3">
          <ProfileStatusCard
            status={profileStatus}
            isLoading={statusLoading}
            error={statusError}
          />
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

