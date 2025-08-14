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
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser'

export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Simple test data without Supabase dependency
  const stats = {
    totalProjects: 12,
    activeProjects: 3,
    completedProjects: 8,
    pendingBids: user?.role === 'consultant' ? 5 : 0,
    unreadMessages: 2,
    profileCompleteness: 85
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#012E46] to-[#4885AA] rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user.role === 'consultant' ? 'Consultant' : 'Client'}!
        </h1>
        <p className="text-slate-100">
          Here's what's happening with your {user.role === 'consultant' ? 'consulting work' : 'projects'} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <Card>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

