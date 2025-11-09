import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Calendar,
  User,
  Star,
  Building2,
  CheckCircle,
  MapPin,
  MessageSquare,
  FileText,
  Send,
  ExternalLink
} from 'lucide-react';
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { canApplyExternally } from '@/lib/utils';

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
  screening_questions?: string[];
  project_origin?: 'internal' | 'external';
  external_url?: string | null;
  expires_at?: string | null;
  source_name?: string | null;
  is_expired?: boolean;
  client?: {
    first_name: string;
    last_name: string;
    company_name?: string;
    logo_url?: string;
    verified?: boolean;
    rating?: number;
    total_ratings?: number;
    headline?: string;
    location?: string;
  };
}

interface Skill {
  id: number;
  name: string;
}

interface Industry {
  id: number;
  name: string;
  category: string;
}

export default function GigDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Bid form state
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [screeningAnswers, setScreeningAnswers] = useState<{ [key: number]: string }>({});

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

      // Load project, skills, and industries in parallel
      const [projectResult, skillsResult, industriesResult] = await Promise.all([
        supabase
          .from('projects')
          .select(`
            *,
            client:creator_id (
              first_name,
              last_name,
              headline,
              profile_photo_url
            )
          `)
          .eq('id', id)
          .eq('status', 'open')
          .single(),
        supabase
          .from('skills')
          .select('id, name')
          .order('name'),
        supabase
          .from('industries')
          .select('id, name, category')
          .order('name')
      ]);

      if (projectResult.error) {
        console.error('Error loading project:', projectResult.error);
        navigate('/find-gigs');
        return;
      }

      if (skillsResult.error) {
        console.error('Error loading skills:', skillsResult.error);
        return;
      }

      if (industriesResult.error) {
        console.error('Error loading industries:', industriesResult.error);
        return;
      }

      setSkills(skillsResult.data || []);
      setIndustries(industriesResult.data || []);

      // Process project data
      const projectData = projectResult.data;
      
      // Load client profile data separately
      let clientProfile = null;
      if (projectData.creator_id) {
        const { data: clientProfileData } = await supabase
          .from('client_profiles')
          .select('company_name, logo_url, country')
          .eq('user_id', projectData.creator_id)
          .single();
        clientProfile = clientProfileData;
      }
      let skills_required: number[] = [];
      try {
        const parsedSkills = projectData.skills_required ? JSON.parse(projectData.skills_required) : [];
        skills_required = Array.isArray(parsedSkills)
          ? parsedSkills
              .map((skillId: number | string) => Number(skillId))
              .filter((skillId) => !Number.isNaN(skillId))
          : [];
      } catch (error) {
        console.error('Error parsing skills_required:', error);
      }

      let screening_questions: string[] = [];
      try {
        const parsedQuestions = projectData.screening_questions
          ? JSON.parse(projectData.screening_questions)
          : [];
        screening_questions = Array.isArray(parsedQuestions) ? parsedQuestions : [];
      } catch (error) {
        console.error('Error parsing screening_questions:', error);
      }

      const projectOrigin: 'internal' | 'external' =
        projectData.project_origin === 'external' ? 'external' : 'internal';
      const externalUrl = projectData.external_url || null;
      const expiresAt = projectData.expires_at || null;
      const sourceName = projectData.source_name || null;
      const isExpired = expiresAt ? new Date(expiresAt).getTime() <= Date.now() : false;

      // Mock client rating for now - in real app, this would come from database
      const clientRating = Math.random() * 2 + 3; // Random rating between 3-5
      const totalRatings = Math.floor(Math.random() * 50) + 1;

      const clientInfo =
        projectOrigin === 'external'
          ? {
              first_name: sourceName || 'External',
              last_name: 'Opportunity',
              company_name: sourceName || 'External Opportunity',
              logo_url: null,
              verified: false,
              rating: null,
              total_ratings: null,
              headline: null,
              location: null
            }
          : {
              ...projectData.client,
              company_name: clientProfile?.company_name,
              logo_url: clientProfile?.logo_url,
              country: clientProfile?.country,
              rating: clientRating,
              total_ratings: totalRatings
            };

      setProject({
        ...projectData,
        project_origin: projectOrigin,
        external_url: externalUrl,
        expires_at: expiresAt,
        source_name: sourceName,
        is_expired: isExpired,
        skills_required,
        screening_questions,
        client: clientInfo
      });

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount?: number | null, currency?: string | null) => {
    const safeCurrency =
      currency && currency.length >= 2 ? currency.toUpperCase() : 'USD';
    const numericAmount = Number(amount ?? 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  const formatDuration = (minDays?: number | null, maxDays?: number | null) => {
    if (minDays == null || maxDays == null) {
      return 'Timeline TBD';
    }

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

  const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSkillName = (skillId: number) => {
    const skill = skills.find(s => s.id === skillId);
    return skill ? skill.name : `Skill ${skillId}`;
  };

  const getIndustryName = (industryId: number) => {
    const industry = industries.find(i => i.id === industryId);
    return industry ? industry.name : `Industry ${industryId}`;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm text-slate-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !project) return;

    try {
      setSubmitting(true);
      setError(null);

      if (!bidAmount || parseFloat(bidAmount) <= 0) {
        setError('Please enter a valid bid amount');
        return;
      }

      if (!bidMessage.trim()) {
        setError('Please provide a message explaining your approach');
        return;
      }

      // Check if all screening questions are answered
      const unansweredQuestions = project.screening_questions?.filter((_, index) => !screeningAnswers[index]?.trim());
      if (unansweredQuestions && unansweredQuestions.length > 0) {
        setError('Please answer all screening questions');
        return;
      }

      const bidData = {
        project_id: project.id,
        consultant_id: user.id,
        amount: parseFloat(bidAmount),
        currency: project.currency,
        status: 'pending',
        bid_documents: [], // Could be enhanced to support file uploads
        created_at: new Date().toISOString()
      };

      const { error: bidError } = await supabase
        .from('bids')
        .insert(bidData);

      if (bidError) {
        console.error('Error submitting bid:', bidError);
        setError('Failed to submit bid. Please try again.');
        return;
      }

      setSuccess(true);
      
      // Reset form
      setBidAmount('');
      setBidMessage('');
      setScreeningAnswers({});
      
    } catch (error) {
      console.error('Error submitting bid:', error);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const isExternal = !!project && project.project_origin === 'external';
  const externalIsExpired =
    isExternal &&
    (project.is_expired ??
      (project.expires_at ? new Date(project.expires_at).getTime() <= Date.now() : false));
  const externalCanApply =
    isExternal && !!project.external_url && canApplyExternally(project);

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
            <p className="text-slate-600 mb-6">The gig you're looking for doesn't exist or is no longer available.</p>
            <Button asChild>
              <Link to="/find-gigs">Back to Find Gigs</Link>
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
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link to="/find-gigs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Find Gigs
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600">
                <span>Posted {formatDate(project.created_at)}</span>
                {isExternal ? (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    External Opportunity
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Open for Bids
                  </Badge>
                )}
                {isExternal && project.expires_at && (
                  <span className={externalIsExpired ? 'text-rose-600' : 'text-slate-500'}>
                    {externalIsExpired
                      ? `Expired on ${formatDate(project.expires_at)}`
                      : `Apply before ${formatDate(project.expires_at)}`}
                  </span>
                )}
              </div>
            </div>
          </div>
          {isExternal && (
            <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
              <AlertTitle>External Opportunity</AlertTitle>
              <AlertDescription>
                Applications for this gig are submitted on an external site. Use the button on the
                right to open the external application in a new tab.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    About the Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                      {project.client?.logo_url ? (
                        <img
                          src={project.client.logo_url}
                          alt={project.client.company_name || 'Company Logo'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {project.client?.company_name || `${project.client?.first_name} ${project.client?.last_name}`}
                      </h3>
                      {project.client?.headline && (
                        <p className="text-slate-600 mt-1">{project.client.headline}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        {project.client?.verified && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">Verified Client</span>
                          </div>
                        )}
                        {project.client?.rating ? (
                          <div className="flex items-center gap-2">
                            {renderStars(project.client.rating)}
                            <span className="text-sm text-slate-500">
                              ({project.client.total_ratings} reviews)
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">Unrated</span>
                        )}
                      </div>
                      {isExternal && project.source_name && (
                        <div className="mt-3 text-sm text-blue-600">
                          Source: {project.source_name}
                        </div>
                      )}
                      {project.client?.country && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{project.client.country}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                    <p className="text-slate-600 whitespace-pre-wrap">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        <strong>Budget:</strong> {formatCurrency(project.budget_min, project.currency)}
                        {project.budget_max !== project.budget_min && 
                          ` - ${formatCurrency(project.budget_max, project.currency)}`
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        <strong>Timeline:</strong> {formatDuration(project.delivery_time_min, project.delivery_time_max)}
                      </span>
                    </div>
                    {isExternal && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <ExternalLink className="w-4 h-4" />
                        <span>
                          <strong>Application:</strong>{' '}
                          {project.external_url ? (
                            <button
                              type="button"
                              className="text-blue-600 hover:underline"
                              onClick={() => {
                                if (project.external_url) {
                                  window.open(project.external_url, '_blank', 'noopener,noreferrer');
                                }
                              }}
                            >
                              Open external site
                            </button>
                          ) : (
                            'Not provided'
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills Required */}
                  {project.skills_required && project.skills_required.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.skills_required.map((skillId) => (
                          <Badge key={skillId} variant="outline" className="text-sm">
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
                      <div className="space-y-3">
                        {project.screening_questions.map((question, index) => (
                          <div key={index}>
                            <p className="text-sm font-medium text-slate-700 mb-1">
                              {index + 1}. {question}
                            </p>
                            <Textarea
                              placeholder="Your answer..."
                              value={screeningAnswers[index] || ''}
                              onChange={(e) => setScreeningAnswers(prev => ({
                                ...prev,
                                [index]: e.target.value
                              }))}
                              className="min-h-[80px]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Bid Form */}
            <div className="space-y-6">
              {isExternal ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Apply Externally</CardTitle>
                    <CardDescription>
                      {project.source_name
                        ? `This opportunity is hosted on ${project.source_name}.`
                        : 'This opportunity is hosted on an external site.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full flex items-center justify-center gap-2"
                      disabled={!externalCanApply}
                      onClick={() => {
                        if (project.external_url && externalCanApply) {
                          window.open(project.external_url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      Apply Externally
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <div className="text-sm text-slate-600 space-y-2">
                      <p>
                        {project.external_url
                          ? externalCanApply
                            ? 'You will be redirected to the external application page in a new tab.'
                            : externalIsExpired
                              ? 'This opportunity has expired.'
                              : 'External applications are currently unavailable.'
                          : 'No external application URL was provided.'}
                      </p>
                      {project.expires_at && (
                        <p className="text-xs text-slate-500">
                          {externalIsExpired
                            ? `Expired on ${formatDate(project.expires_at)}`
                            : `Apply before ${formatDate(project.expires_at)}`}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Bid</CardTitle>
                    <CardDescription>
                      Submit your proposal for this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {success ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Bid Submitted Successfully!</h3>
                        <p className="text-slate-600 text-sm mb-4">
                          Your bid has been sent to the client. You'll be notified when they respond.
                        </p>
                        <Button variant="outline" asChild className="w-full">
                          <Link to="/find-gigs">Find More Gigs</Link>
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitBid} className="space-y-4">
                        {error && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="bidAmount" className="text-sm font-semibold text-slate-900">
                            Your Bid Amount <span className="text-red-500">*</span>
                          </Label>
                          <div className="flex gap-2 mt-1">
                            <span className="flex items-center px-3 py-2 bg-slate-100 text-slate-600 text-sm border border-slate-200 rounded-l-md">
                              {project.currency}
                            </span>
                            <Input
                              id="bidAmount"
                              type="number"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              placeholder="Enter your bid"
                              className="rounded-l-none"
                              required
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Budget range: {formatCurrency(project.budget_min, project.currency)} - {formatCurrency(project.budget_max, project.currency)}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="bidMessage" className="text-sm font-semibold text-slate-900">
                            Your Proposal <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="bidMessage"
                            value={bidMessage}
                            onChange={(e) => setBidMessage(e.target.value)}
                            placeholder="Explain your approach, relevant experience, and why you're the right fit for this project..."
                            className="mt-1 min-h-[120px]"
                            required
                          />
                        </div>

                        <Button type="submit" disabled={submitting} className="w-full">
                          {submitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting Bid...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Submit Bid
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Client
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Save for Later
                  </Button>
                </CardContent>
              </Card>

              {/* Project Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Posted</span>
                    <span className="font-semibold text-sm">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Timeline</span>
                    <span className="font-semibold text-sm">
                      {formatDuration(project.delivery_time_min, project.delivery_time_max)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Budget</span>
                    <span className="font-semibold text-sm">
                      {formatCurrency(project.budget_min, project.currency)}
                      {project.budget_max !== project.budget_min && 
                        ` - ${formatCurrency(project.budget_max, project.currency)}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Skills Required</span>
                    <span className="font-semibold text-sm">
                      {project.skills_required.length}
                    </span>
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
