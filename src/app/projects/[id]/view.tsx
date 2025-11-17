import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign,
  Calendar,
  User,
  Star,
  MoreVertical,
  CheckCircle,
  XCircle,
  Award,
  MessageSquare,
  FileText,
  MapPin
} from 'lucide-react';
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  updated_at: string;
  skills_required: number[];
  creator_id: string;
  screening_questions?: string[];
  project_origin?: 'internal' | 'external';
  external_url?: string | null;
  expires_at?: string | null;
  source_name?: string | null;
  role_type?: string | null;
  gig_location?: string | null;
}

interface Skill {
  id: number;
  name: string;
}

interface Bid {
  id: number;
  project_id: number;
  consultant_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  bid_documents?: string[];
  consultant?: {
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
    headline?: string;
  };
}

interface Contract {
  id: number;
  client_id: string;
  consultant_id: string;
  project_id: number;
  bid_id: number;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export default function GigViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [awardingBid, setAwardingBid] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const userData = await getCurrentUser();
      if (!userData) {
        navigate('/auth/login');
        return;
      }
      setUser(userData);

      // Load project, skills, bids, and contract in parallel
      const [projectResult, skillsResult, bidsResult, contractResult] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('creator_id', userData.id)
          .single(),
        supabase
          .from('skills')
          .select('id, name')
          .order('name'),
        supabase
          .from('bids')
          .select(`
            *,
            consultant:consultant_id (
              first_name,
              last_name,
              profile_photo_url,
              headline
            )
          `)
          .eq('project_id', id)
          .order('created_at', { ascending: false }),
        supabase
          .from('contracts')
          .select('*')
          .eq('project_id', id)
          .eq('client_id', userData.id)
          .single()
      ]);

      if (projectResult.error) {
        console.error('Error loading project:', projectResult.error);
        navigate('/projects');
        return;
      }

      if (skillsResult.error) {
        console.error('Error loading skills:', skillsResult.error);
        return;
      }

      if (bidsResult.error) {
        console.error('Error loading bids:', bidsResult.error);
        return;
      }

      // Set data
      setSkills(skillsResult.data || []);
      setBids(bidsResult.data || []);
      setContract(contractResult.data || null);

      // Parse project data
      const projectData = projectResult.data;
      let skills_required = [];
      try {
        skills_required = projectData.skills_required ? JSON.parse(projectData.skills_required) : [];
      } catch (error) {
        console.error('Error parsing skills_required:', error);
      }

      let screening_questions = [];
      try {
        screening_questions = projectData.screening_questions ? JSON.parse(projectData.screening_questions) : [];
      } catch (error) {
        console.error('Error parsing screening_questions:', error);
      }

      setProject({
        ...projectData,
        skills_required,
        screening_questions
      });

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

  const getSkillName = (skillId: number) => {
    const skill = skills.find(s => s.id === skillId);
    return skill ? skill.name : `Skill ${skillId}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const, color: 'bg-slate-100 text-slate-700' },
      open: { label: 'Open', variant: 'default' as const, color: 'bg-green-100 text-green-700' },
      in_progress: { label: 'In Progress', variant: 'default' as const, color: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Completed', variant: 'default' as const, color: 'bg-purple-100 text-purple-700' },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, color: 'bg-red-100 text-red-700' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handleAwardBid = async (bidId: number) => {
    try {
      setAwardingBid(bidId);
      
      // Create contract
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .insert({
          client_id: user?.id,
          consultant_id: bids.find(b => b.id === bidId)?.consultant_id,
          project_id: project?.id,
          bid_id: bidId,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          terms: JSON.stringify({}),
          payment_terms: JSON.stringify({})
        })
        .select()
        .single();

      if (contractError) {
        console.error('Error creating contract:', contractError);
        return;
      }

      // Update project status to in_progress
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'in_progress' })
        .eq('id', project?.id);

      if (projectError) {
        console.error('Error updating project status:', projectError);
        return;
      }

      // Update bid status to accepted
      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bidId);

      if (bidError) {
        console.error('Error updating bid status:', bidError);
        return;
      }

      // Reload data
      await loadData();
      
    } catch (error) {
      console.error('Error awarding bid:', error);
    } finally {
      setAwardingBid(null);
    }
  };

  const handleMarkCompleted = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'completed' })
        .eq('id', project?.id);

      if (error) {
        console.error('Error marking project as completed:', error);
        return;
      }

      await loadData();
    } catch (error) {
      console.error('Error marking project as completed:', error);
    }
  };

  const handleCancelGig = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'cancelled' })
        .eq('id', project?.id);

      if (error) {
        console.error('Error cancelling project:', error);
        return;
      }

      await loadData();
    } catch (error) {
      console.error('Error cancelling project:', error);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading gig details...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Gig not found</h1>
            <p className="text-slate-600 mb-6">The gig you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button asChild>
              <Link to="/projects">Back to My Gigs</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/projects">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to My Gigs
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  {getStatusBadge(project.status)}
                  <span className="text-sm text-slate-600">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/projects/${project.id}/edit`}>
                    <FileText className="w-4 h-4 mr-2" />
                    Edit Gig
                  </Link>
                </DropdownMenuItem>
                {project.status !== 'cancelled' && project.status !== 'completed' && (
                  <DropdownMenuItem onClick={handleCancelGig}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Gig
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                    <p className="text-slate-600">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        {formatCurrency(project.budget_min, project.currency)}
                        {project.budget_max !== project.budget_min && 
                          ` - ${formatCurrency(project.budget_max, project.currency)}`
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(project.delivery_time_min, project.delivery_time_max)}</span>
                    </div>

                    {project.role_type && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4" />
                        <span>
                          {project.role_type === 'in_person' ? 'In-person' : 
                           project.role_type === 'hybrid' ? 'Hybrid' : 
                           project.role_type === 'remote' ? 'Remote' : project.role_type}
                        </span>
                      </div>
                    )}

                    {project.gig_location && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{project.gig_location}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {project.skills_required && project.skills_required.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.skills_required.map((skillId) => (
                          <Badge key={skillId} variant="outline" className="text-xs">
                            {getSkillName(skillId)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Screening Questions */}
                  {project.screening_questions && project.screening_questions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Screening Questions</h3>
                      <ul className="space-y-2">
                        {project.screening_questions.map((question, index) => (
                          <li key={index} className="text-sm text-slate-600">
                            {index + 1}. {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bids Section */}
              {project.status === 'open' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Bids Received ({bids.length})</CardTitle>
                    <CardDescription>
                      Review and award bids from professionals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bids.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600">No bids received yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bids.map((bid) => (
                          <div key={bid.id} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                    {bid.consultant?.profile_photo_url ? (
                                      <img
                                        src={bid.consultant.profile_photo_url}
                                        alt={`${bid.consultant.first_name} ${bid.consultant.last_name}`}
                                        className="w-full h-full object-cover rounded-full"
                                      />
                                    ) : (
                                      <span className="text-sm font-semibold text-slate-700">
                                        {bid.consultant?.first_name?.charAt(0)}{bid.consultant?.last_name?.charAt(0)}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-900">
                                      {bid.consultant?.first_name} {bid.consultant?.last_name}
                                    </h4>
                                    {bid.consultant?.headline && (
                                      <p className="text-sm text-slate-600">{bid.consultant.headline}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                  <span className="font-semibold text-green-600">
                                    {formatCurrency(bid.amount, bid.currency)}
                                  </span>
                                  <span>
                                    Bid on {new Date(bid.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAwardBid(bid.id)}
                                disabled={awardingBid === bid.id}
                              >
                                {awardingBid === bid.id ? 'Awarding...' : 'Award Bid'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Contract/Awarded Professional */}
              {contract && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Awarded Professional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Professional Name</h4>
                        <p className="text-sm text-slate-600">Contract started {new Date(contract.start_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Progress Tracking */}
              {project.status === 'in_progress' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Progress</CardTitle>
                    <CardDescription>
                      Track the progress of your gig
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Project Status</span>
                        <Badge variant="default" className="bg-blue-100 text-blue-700">
                          In Progress
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Started</span>
                        <span className="text-sm font-medium">
                          {contract ? new Date(contract.start_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Expected Completion</span>
                        <span className="text-sm font-medium">
                          {contract ? new Date(contract.end_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <Button onClick={handleMarkCompleted} className="w-full">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Completed
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ratings */}
              {project.status === 'completed' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Ratings</CardTitle>
                    <CardDescription>
                      Feedback from both parties
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Your Rating from Professional</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-slate-600">Outstanding</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Your Rating of Professional</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-slate-600">Outstanding</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to={`/projects/${project.id}/edit`}>
                      <FileText className="w-4 h-4 mr-2" />
                      Edit Gig
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Professional
                  </Button>
                  {project.status === 'in_progress' && (
                    <Button variant="outline" className="w-full" onClick={handleMarkCompleted}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Project Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Bids Received</span>
                    <span className="font-semibold">{bids.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Days Active</span>
                    <span className="font-semibold">
                      {Math.ceil((new Date().getTime() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <span className="font-semibold capitalize">{project.status.replace('_', ' ')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
