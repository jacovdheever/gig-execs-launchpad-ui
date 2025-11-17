import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Calendar,
  User,
  Building2,
  CheckCircle,
  MapPin,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  FileText,
  Edit
} from 'lucide-react';
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { canApplyExternally } from '@/lib/utils';
import { uploadProjectAttachment, getSignedDocumentUrl } from '@/lib/storage';

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
  role_type?: string | null;
  gig_location?: string | null;
  is_expired?: boolean;
  industries?: number[];
  client?: {
    first_name: string;
    last_name: string;
    company_name?: string;
    logo_url?: string;
    verified?: boolean;
    headline?: string;
    location?: string;
    country?: string;
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
  const [existingBid, setExistingBid] = useState<any | null>(null);
  const [isEditingBid, setIsEditingBid] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [screeningAnswers, setScreeningAnswers] = useState<{ [key: number]: string }>({});
  const [bidDocuments, setBidDocuments] = useState<Array<{ name: string; url: string }>>([]);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [bidCardOpen, setBidCardOpen] = useState(false);

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
          .is('deleted_at', null)
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

      let industriesArray: number[] = [];
      if (Array.isArray(projectData.industries)) {
        industriesArray = projectData.industries
          .map((industryId: number | string) => Number(industryId))
          .filter((industryId) => !Number.isNaN(industryId));
      } else if (typeof projectData.industries === 'string') {
        try {
          const parsedIndustries = JSON.parse(projectData.industries);
          if (Array.isArray(parsedIndustries)) {
            industriesArray = parsedIndustries
              .map((industryId: number | string) => Number(industryId))
              .filter((industryId) => !Number.isNaN(industryId));
          }
        } catch (error) {
          console.error('Error parsing industries:', error);
        }
      }

      const projectOrigin: 'internal' | 'external' =
        projectData.project_origin === 'external' ? 'external' : 'internal';
      const externalUrl = projectData.external_url || null;
      const expiresAt = projectData.expires_at || null;
      const sourceName = projectData.source_name || null;
      const isExpired = expiresAt ? new Date(expiresAt).getTime() <= Date.now() : false;

      const clientInfo =
        projectOrigin === 'external'
          ? {
              first_name: sourceName || 'External',
              last_name: 'Opportunity',
              company_name: sourceName || 'External Opportunity',
              logo_url: null,
              verified: false,
              headline: null,
              location: null
            }
          : {
              ...projectData.client,
              company_name: clientProfile?.company_name,
              logo_url: clientProfile?.logo_url,
              country: clientProfile?.country
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
        industries: industriesArray,
        client: clientInfo
      });

      // Load existing bid if user is a consultant
      if (userData && !isExternal) {
        const projectIdNum = parseInt(id || '0', 10);
        if (!isNaN(projectIdNum)) {
          const { data: existingBidData, error: bidError } = await supabase
            .from('bids')
            .select('*')
            .eq('project_id', projectIdNum)
            .eq('consultant_id', userData.id)
            .maybeSingle();

          // Check if we got a bid (maybeSingle returns null if not found, but no error)
          if (existingBidData && !bidError) {
            console.log('Found existing bid:', existingBidData);
            console.log('Bid fields:', Object.keys(existingBidData));
            console.log('Bid message:', existingBidData.message);
            console.log('Bid proposal:', existingBidData.proposal);
            setExistingBid(existingBidData);
            // Pre-populate form with existing bid data
            setBidAmount(existingBidData.amount?.toString() || '');
            setBidMessage(existingBidData.message || existingBidData.proposal || '');
            
            // Load screening answers if stored
            if (existingBidData.screening_answers) {
              try {
                const parsed = typeof existingBidData.screening_answers === 'string' 
                  ? JSON.parse(existingBidData.screening_answers)
                  : existingBidData.screening_answers;
                setScreeningAnswers(parsed || {});
              } catch (e) {
                console.error('Error parsing screening answers:', e);
              }
            }
            
            // Load documents
            if (existingBidData.bid_documents && Array.isArray(existingBidData.bid_documents)) {
              setBidDocuments(existingBidData.bid_documents.map((url: string) => ({
                name: url.split('/').pop() || 'Document',
                url: url
              })));
            }
            
            // Open the bid card if there's an existing bid
            setBidCardOpen(true);
          } else if (bidError) {
            console.error('Error loading existing bid:', bidError);
          } else {
            console.log('No existing bid found for this project');
          }
        }
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount?: number | null, currency?: string | null) => {
    if (amount == null || Number.isNaN(Number(amount))) {
      return 'Budget to be confirmed';
    }
    const safeCurrency =
      currency && currency.length >= 2 ? currency.toUpperCase() : 'USD';
    const numericAmount = Number(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  const formatDuration = (minDays?: number | null, maxDays?: number | null) => {
    if (minDays == null || maxDays == null) {
      return 'Timeline to be confirmed';
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

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user) return;

    const file = files[0];
    setUploadingDocument(true);

    try {
      const result = await uploadProjectAttachment(file, user.id);
      if (result.success && result.url) {
        setBidDocuments(prev => [...prev, { name: file.name, url: result.url! }]);
      } else {
        setError(result.error || 'Failed to upload document');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
    } finally {
      setUploadingDocument(false);
      // Reset input
      event.target.value = '';
    }
  };

  const removeDocument = (index: number) => {
    setBidDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const scrollToBidCard = () => {
    const bidCardElement = document.getElementById('submit-bid-card');
    if (bidCardElement) {
      bidCardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setBidCardOpen(true);
    }
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

      const bidData: any = {
        project_id: project.id,
        consultant_id: user.id,
        amount: parseFloat(bidAmount),
        currency: project.currency,
        status: existingBid?.status || 'pending',
        message: bidMessage.trim(),
        proposal: bidMessage.trim(), // Store in both fields for compatibility
        screening_answers: JSON.stringify(screeningAnswers),
        bid_documents: bidDocuments.map(doc => doc.url),
        updated_at: new Date().toISOString()
      };

      let bidError;
      if (existingBid) {
        // Update existing bid
        bidError = (await supabase
          .from('bids')
          .update(bidData)
          .eq('id', existingBid.id)).error;
      } else {
        // Create new bid
        bidData.created_at = new Date().toISOString();
        bidError = (await supabase
          .from('bids')
          .insert(bidData)).error;
      }

      if (bidError) {
        console.error('Error submitting bid:', bidError);
        setError('Failed to submit bid. Please try again.');
        return;
      }

      // Reload the bid to get updated data
      const { data: updatedBid } = await supabase
        .from('bids')
        .select('*')
        .eq('project_id', project.id)
        .eq('consultant_id', user.id)
        .maybeSingle();

      if (updatedBid) {
        setExistingBid(updatedBid);
      }

      setSuccess(true);
      setIsEditingBid(false);
      
    } catch (error) {
      console.error('Error submitting bid:', error);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBid = () => {
    setIsEditingBid(true);
    setSuccess(false);
    setBidCardOpen(true);
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

  const displayClientName = isExternal
    ? project.source_name || 'External client'
    : project.client?.company_name ||
      (project.client?.first_name && project.client?.last_name
        ? `${project.client.first_name} ${project.client.last_name}`
        : project.client?.first_name || project.client?.last_name || 'Client');
  const currencyCode = project.currency || 'USD';
  const hasBudgetMin = project.budget_min != null;
  const hasBudgetMax = project.budget_max != null;
  let budgetDisplay: string;
  if (hasBudgetMin) {
    if (hasBudgetMax && project.budget_max !== project.budget_min) {
      budgetDisplay = `${formatCurrency(project.budget_min, currencyCode)} - ${formatCurrency(
        project.budget_max,
        currencyCode
      )}`;
    } else {
      budgetDisplay = formatCurrency(project.budget_min, currencyCode);
    }
  } else {
    budgetDisplay = 'Budget to be confirmed';
  }
  const timelineDisplay = formatDuration(project.delivery_time_min, project.delivery_time_max);

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
              {/* Top Row - Client Info and Project Info (Desktop) */}
              <div className="grid gap-6 lg:grid-cols-2">
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
                      {project.client?.verified && (
                        <div className="flex items-center gap-1 mt-3">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">Verified Client</span>
                        </div>
                      )}
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

              {/* Project Information */}
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

                    {project.role_type && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4" />
                        <span>
                          <strong>Role Type:</strong>{' '}
                          {project.role_type === 'in_person' ? 'In-person' : 
                           project.role_type === 'hybrid' ? 'Hybrid' : 
                           project.role_type === 'remote' ? 'Remote' : project.role_type}
                        </span>
                      </div>
                    )}

                    {project.gig_location && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>
                          <strong>Location:</strong> {project.gig_location}
                        </span>
                      </div>
                    )}

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
                  {project?.industries && project.industries.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Industries</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.industries.map((industryId) => (
                          <Badge
                            key={industryId}
                            variant="secondary"
                            className="text-xs"
                          >
                            {getIndustryName(industryId)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isExternal && (
                    <div className="pt-4 border-t border-slate-200">
                      <Button onClick={scrollToBidCard} className="w-full">
                        {existingBid ? (
                          <>
                            <FileText className="w-4 h-4 mr-2" />
                            View Your Bid
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Your Bid
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Your Bid - Collapsible Card (for Client Gigs only) */}
              {!isExternal && (
                <Collapsible open={bidCardOpen} onOpenChange={setBidCardOpen} id="submit-bid-card">
                  <Card>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>
                              {existingBid && !isEditingBid ? 'Your Submitted Bid' : 'Submit Your Bid'}
                            </CardTitle>
                            <CardDescription>
                              {existingBid && !isEditingBid 
                                ? 'View and manage your proposal for this project'
                                : 'Submit your proposal for this project'}
                            </CardDescription>
                          </div>
                          {bidCardOpen ? (
                            <ChevronUp className="w-5 h-5 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent>
                        {success ? (
                          <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">
                              {existingBid ? 'Bid Updated Successfully!' : 'Bid Submitted Successfully!'}
                            </h3>
                            <p className="text-slate-600 text-sm mb-4">
                              Your bid has been sent to the client. You'll be notified when they respond.
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={handleEditBid} className="flex-1">
                                Edit Bid
                              </Button>
                              <Button variant="outline" asChild className="flex-1">
                                <Link to="/find-gigs">Find More Gigs</Link>
                              </Button>
                            </div>
                          </div>
                        ) : existingBid && !isEditingBid ? (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-slate-900">Your Submitted Bid</h3>
                              <Button variant="outline" size="sm" onClick={handleEditBid}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-semibold text-slate-900">Bid Amount</Label>
                                <p className="text-slate-700 mt-1">
                                  {formatCurrency(parseFloat(existingBid.amount || '0'), existingBid.currency || project.currency)}
                                </p>
                              </div>

                              <div>
                                <Label className="text-sm font-semibold text-slate-900">Your Proposal</Label>
                                <p className="text-slate-700 mt-1 whitespace-pre-wrap">
                                  {existingBid.message || existingBid.proposal || 'No proposal provided'}
                                </p>
                              </div>

                              {/* Screening Questions Answers */}
                              {project.screening_questions && project.screening_questions.length > 0 && (
                                <div>
                                  <Label className="text-sm font-semibold text-slate-900 mb-2 block">
                                    Screening Questions
                                  </Label>
                                  <div className="space-y-4">
                                    {project.screening_questions.map((question, index) => {
                                      let answer = '';
                                      if (existingBid.screening_answers) {
                                        try {
                                          const parsed = typeof existingBid.screening_answers === 'string'
                                            ? JSON.parse(existingBid.screening_answers)
                                            : existingBid.screening_answers;
                                          answer = parsed[index] || '';
                                        } catch (e) {
                                          console.error('Error parsing screening answers:', e);
                                        }
                                      }
                                      return (
                                        <div key={index}>
                                          <Label className="text-sm font-medium text-slate-700 mb-1 block">
                                            {index + 1}. {question}
                                          </Label>
                                          <p className="text-slate-600 text-sm whitespace-pre-wrap bg-slate-50 p-3 rounded border border-slate-200">
                                            {answer || 'No answer provided'}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Supporting Documents */}
                              {existingBid.bid_documents && Array.isArray(existingBid.bid_documents) && existingBid.bid_documents.length > 0 && (
                                <div>
                                  <Label className="text-sm font-semibold text-slate-900 mb-2 block">
                                    Supporting Documents
                                  </Label>
                                  <div className="space-y-2">
                                    {existingBid.bid_documents.map((url: string, index: number) => {
                                      const DocumentLink = ({ url, index }: { url: string; index: number }) => {
                                        const [loading, setLoading] = useState(false);
                                        const [error, setError] = useState<string | null>(null);

                                        const handleClick = async (e: React.MouseEvent) => {
                                          e.preventDefault();
                                          setLoading(true);
                                          setError(null);
                                          
                                          try {
                                            let viewUrl = url;
                                            
                                            // If it's a full URL, try to get signed URL if needed
                                            if (url.startsWith('https://')) {
                                              const signed = await getSignedDocumentUrl(url);
                                              if (signed) {
                                                viewUrl = signed;
                                              }
                                            } else {
                                              // It's a file path, generate signed URL
                                              const signed = await getSignedDocumentUrl(url);
                                              if (signed) {
                                                viewUrl = signed;
                                              } else {
                                                setError('Unable to access document');
                                                return;
                                              }
                                            }
                                            
                                            window.open(viewUrl, '_blank', 'noopener,noreferrer');
                                          } catch (err) {
                                            console.error('Error opening document:', err);
                                            setError('Failed to open document');
                                          } finally {
                                            setLoading(false);
                                          }
                                        };

                                        return (
                                          <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                              <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                              <a
                                                href="#"
                                                onClick={handleClick}
                                                className="text-sm text-blue-600 hover:underline flex-1 truncate"
                                              >
                                                {url.split('/').pop() || `Document ${index + 1}`}
                                              </a>
                                              {loading && (
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-600"></div>
                                              )}
                                              {error && (
                                                <span className="text-xs text-red-600 ml-2">{error}</span>
                                              )}
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={async (e) => {
                                                e.preventDefault();
                                                setLoading(true);
                                                try {
                                                  let downloadUrl = url;
                                                  if (!url.startsWith('https://')) {
                                                    const signed = await getSignedDocumentUrl(url);
                                                    if (signed) downloadUrl = signed;
                                                  } else {
                                                    const signed = await getSignedDocumentUrl(url);
                                                    if (signed) downloadUrl = signed;
                                                  }
                                                  const link = document.createElement('a');
                                                  link.href = downloadUrl;
                                                  link.download = url.split('/').pop() || `document-${index + 1}`;
                                                  link.target = '_blank';
                                                  link.click();
                                                } catch (err) {
                                                  console.error('Error downloading:', err);
                                                } finally {
                                                  setLoading(false);
                                                }
                                              }}
                                              disabled={loading}
                                            >
                                              <Download className="w-4 h-4 mr-1" />
                                              Download
                                            </Button>
                                          </div>
                                        );
                                      };

                                      return <DocumentLink key={index} url={url} index={index} />;
                                    })}
                                  </div>
                                </div>
                              )}

                              <div className="pt-4 border-t border-slate-200">
                                <p className="text-xs text-slate-500">
                                  Submitted on {formatDate(existingBid.created_at)}
                                  {existingBid.updated_at && existingBid.updated_at !== existingBid.created_at && (
                                    <span> • Last updated on {formatDate(existingBid.updated_at)}</span>
                                  )}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  Status: <span className="font-medium capitalize">{existingBid.status || 'pending'}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitBid} className="space-y-6">
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

                            {/* Screening Questions */}
                            {project.screening_questions && project.screening_questions.length > 0 && (
                              <div>
                                <Label className="text-sm font-semibold text-slate-900">
                                  Screening Questions <span className="text-red-500">*</span>
                                </Label>
                                <div className="space-y-4 mt-2">
                                  {project.screening_questions.map((question, index) => (
                                    <div key={index}>
                                      <Label className="text-sm font-medium text-slate-700 mb-2 block">
                                        {index + 1}. {question}
                                      </Label>
                                      <Textarea
                                        placeholder="Your answer..."
                                        value={screeningAnswers[index] || ''}
                                        onChange={(e) => setScreeningAnswers(prev => ({
                                          ...prev,
                                          [index]: e.target.value
                                        }))}
                                        className="min-h-[80px]"
                                        required
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Supporting Documents */}
                            <div>
                              <Label className="text-sm font-semibold text-slate-900 mb-2 block">
                                Supporting Documents (Optional)
                              </Label>
                              <p className="text-xs text-slate-500 mb-3">
                                Upload examples of work, detailed proposals, or supporting documentation
                              </p>
                              
                              {bidDocuments.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  {bidDocuments.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                        <span className="text-sm text-slate-700 truncate">{doc.name}</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeDocument(index)}
                                        className="ml-2 p-1 hover:bg-slate-200 rounded transition-colors"
                                      >
                                        <X className="w-4 h-4 text-slate-500" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="relative">
                                <input
                                  type="file"
                                  id="documentUpload"
                                  onChange={handleDocumentUpload}
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                                  disabled={uploadingDocument}
                                />
                                <Label
                                  htmlFor="documentUpload"
                                  className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-slate-400 transition-colors"
                                >
                                  {uploadingDocument ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                                      <span className="text-sm text-slate-600">Uploading...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-4 h-4 text-slate-600" />
                                      <span className="text-sm text-slate-600">Upload Document</span>
                                    </>
                                  )}
                                </Label>
                              </div>
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
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              )}
            </div>

            {/* Sidebar - External Apply (External Gigs only) */}
            {isExternal && (
              <div className="space-y-6">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
