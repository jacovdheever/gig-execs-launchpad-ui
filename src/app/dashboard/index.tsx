import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Calculate accurate profile completeness based on completed mandatory fields
  const calculateProfileCompleteness = async (userId: string, userRole: string) => {
    try {
      console.log('=== PROFILE COMPLETENESS DEBUG ===');
      console.log('Calculating for user:', userId, 'role:', userRole);
      
      if (userRole === 'consultant') {
        // Consultant mandatory fields
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

        // Calculate completion based on mandatory fields
        let completedFields = 0;
        const totalFields = 6; // job_title, bio, address1, country, hourly_rate, skills

        if (consultantProfile?.job_title) completedFields++;
        if (consultantProfile?.bio) completedFields++;
        if (consultantProfile?.address1) completedFields++;
        if (consultantProfile?.country) completedFields++;
        if (consultantProfile?.hourly_rate_min && consultantProfile?.hourly_rate_max) completedFields++;
        if (userSkills && userSkills.length > 0) completedFields++;

        console.log('Consultant profile data:', consultantProfile);
        console.log('User skills:', userSkills);
        console.log('Completed fields:', completedFields, 'of', totalFields);
        console.log('Consultant completion percentage:', Math.round((completedFields / totalFields) * 100));

        return Math.round((completedFields / totalFields) * 100);
      } else {
        // Client mandatory fields
        console.log('Loading client profile data...');
        const { data: clientProfile, error: clientError } = await supabase
          .from('client_profiles')
          .select('job_title, company_name, organisation_type, industry, address1, country_id')
          .eq('user_id', userId)
          .single();

        if (clientError) {
          console.error('Error loading client profile:', clientError);
        }

        console.log('Client profile data loaded:', clientProfile);

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

        console.log('Field completion status:');
        console.log('- job_title:', jobTitleComplete, 'value:', clientProfile?.job_title);
        console.log('- company_name:', companyNameComplete, 'value:', clientProfile?.company_name);
        console.log('- organisation_type:', orgTypeComplete, 'value:', clientProfile?.organisation_type);
        console.log('- industry:', industryComplete, 'value:', clientProfile?.industry);
        console.log('- address1:', addressComplete, 'value:', clientProfile?.address1);
        console.log('- country_id:', countryComplete, 'value:', clientProfile?.country_id);
        console.log('Completed fields:', completedFields, 'of', totalFields);
        console.log('Client completion percentage:', Math.round((completedFields / totalFields) * 100));
        console.log('=== END PROFILE COMPLETENESS DEBUG ===');

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
  
  // Load profile completeness on component mount
  useEffect(() => {
    if (user) {
      calculateProfileCompleteness(user.id, user.role).then(setProfileCompleteness);
    }
  }, [user]);
  
  const stats = {
    totalProjects: 12,
    activeProjects: 3,
    completedProjects: 8,
    pendingBids: user?.role === 'consultant' ? 5 : 0,
    unreadMessages: 2,
    profileCompleteness: profileCompleteness
  }

  const recentProjects = [
    {
      id: 1,
      title: 'Website Redesign Project',
      status: 'in_progress',
      progress: 65,
      deadline: '2024-02-15'
    },
    {
      id: 2,
      title: 'Mobile App Development',
      status: 'open',
      progress: 0,
      deadline: '2024-03-01'
    },
    {
      id: 3,
      title: 'Marketing Strategy Consultation',
      status: 'completed',
      progress: 100,
      deadline: '2024-01-20'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary">Open</Badge>
      case 'in_progress':
        return <Badge variant="default">In Progress</Badge>
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-600">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-slate-400" />
      case 'in_progress':
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />
    }
  }

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
          Here's what's happening with your {user.role === 'consultant' ? 'consulting work' : 'projects'} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-slate-600">
              {stats.activeProjects} active, {stats.completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.role === 'consultant' ? 'Pending Bids' : 'Active Projects'}
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.role === 'consultant' ? stats.pendingBids : stats.activeProjects}
            </div>
            <p className="text-xs text-slate-600">
              {user.role === 'consultant' ? 'Awaiting response' : 'Currently running'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-slate-600">
              New messages to review
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => {
            if (user.role === 'consultant') {
              navigate('/onboarding/step1');
            } else {
              navigate('/onboarding/client/step1');
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Complete</CardTitle>
            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-600">{stats.profileCompleteness}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-[#012E46] h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.profileCompleteness}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              {100 - stats.profileCompleteness}% remaining
            </p>
          </CardContent>
        </Card>
      </div>

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
            {/* Onboarding Action - Show prominently if profile incomplete */}
            {profileCompleteness < 100 && (
              <Button 
                onClick={() => {
                  if (user.role === 'consultant') {
                    navigate('/onboarding/step1');
                  } else {
                    navigate('/onboarding/client/step1');
                  }
                }}
                className="h-auto p-4 flex-col space-y-2 bg-yellow-500 hover:bg-yellow-600 text-white col-span-full sm:col-span-1"
              >
                <CheckCircle className="h-6 w-6" />
                <span>Complete Profile</span>
                <span className="text-xs opacity-90">
                  {100 - profileCompleteness}% remaining
                </span>
              </Button>
            )}
            
            {user.role === 'consultant' ? (
              <>
                <Button asChild className="h-auto p-4 flex-col space-y-2">
                  <Link to="/dashboard/projects">
                    <Briefcase className="h-6 w-6" />
                    <span>Browse Projects</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Link to="/dashboard/profile">
                    <FileText className="h-6 w-6" />
                    <span>Update Profile</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Link to="/dashboard/messages">
                    <MessageSquare className="h-6 w-6" />
                    <span>View Messages</span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="h-auto p-4 flex-col space-y-2">
                  <Link to="/dashboard/projects/new">
                    <FileText className="h-6 w-6" />
                    <span>Create Project</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Link to="/dashboard/projects">
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

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>
            Your latest project activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(project.status)}
                  <div>
                    <h3 className="font-medium text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-500">
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(project.status)}
                  {project.status === 'in_progress' && (
                    <div className="text-sm text-slate-600">
                      {project.progress}% complete
                    </div>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/projects/${project.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link to="/dashboard/projects">
                View All Projects
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

