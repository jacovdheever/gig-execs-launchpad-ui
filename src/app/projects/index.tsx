import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Plus, 
  Briefcase, 
  Clock, 
  DollarSign,
  MapPin,
  Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser';
import { supabase } from '@/lib/supabase';

interface Project {
  id: number;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  currency: string;
  delivery_time_min: number;
  delivery_time_max: number;
  status: string;
  created_at: string;
  skills_required: number[];
  creator_id: string;
}

export default function ProjectsPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadUserAndProjects();
  }, []);

  const loadUserAndProjects = async () => {
    try {
      setLoading(true);
      
      // Load current user
      const userData = await getCurrentUser();
      if (!userData) {
        navigate('/auth/login');
        return;
      }
      setUser(userData);

      // Load projects
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('creator_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (minDays: number, maxDays: number) => {
    if (minDays < 30) {
      return `${minDays}-${maxDays} days`;
    } else if (minDays < 365) {
      const minMonths = Math.round(minDays / 30);
      const maxMonths = Math.round(maxDays / 30);
      return `${minMonths}-${maxMonths} months`;
    } else {
      const minYears = Math.round(minDays / 365);
      const maxYears = Math.round(maxDays / 365);
      return `${minYears}-${maxYears} years`;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      open: { label: 'Open', variant: 'default' as const },
      in_progress: { label: 'In Progress', variant: 'default' as const },
      completed: { label: 'Completed', variant: 'default' as const },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
            <p className="text-slate-600 mt-2">
              Manage your gigs and track their progress
            </p>
          </div>
          <Button asChild className="mt-4 sm:mt-0">
            <Link to="/gig-creation/step1">
              <Plus className="w-4 h-4 mr-2" />
              Create New Gig
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {projects.length === 0 ? 'No projects yet' : 'No projects match your filters'}
              </h3>
              <p className="text-slate-600 mb-6">
                {projects.length === 0 
                  ? 'Create your first gig to get started and find the right professionals for your project.'
                  : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                }
              </p>
              {projects.length === 0 && (
                <Button asChild>
                  <Link to="/gig-creation/step1">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Gig
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-3">
                        {project.description}
                      </CardDescription>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Budget */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">
                        {formatCurrency(project.budget_min, project.currency)}
                        {project.budget_max !== project.budget_min && 
                          ` - ${formatCurrency(project.budget_max, project.currency)}`
                        }
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDuration(project.delivery_time_min, project.delivery_time_max)}
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Created {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Skills */}
                    {project.skills_required && project.skills_required.length > 0 && (
                      <div className="pt-2">
                        <div className="flex flex-wrap gap-1">
                          {project.skills_required.slice(0, 3).map((skillId) => (
                            <Badge key={skillId} variant="outline" className="text-xs">
                              Skill {skillId}
                            </Badge>
                          ))}
                          {project.skills_required.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.skills_required.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
