import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  ExternalLink,
  Filter,
  Loader2,
  PenSquare,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { StaffRoute, useStaffUser } from '@/components/staff/StaffRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn, canApplyExternally } from '@/lib/utils';

type StaffRole = 'support' | 'admin' | 'super_user';

type ExpiryFilter = 'all' | 'active' | 'expired';

interface ExternalProject {
  id: string | number;
  title: string;
  description: string;
  status: string;
  external_url: string | null;
  expires_at: string | null;
  source_name: string | null;
  updated_at: string | null;
  created_at: string | null;
  currency: string | null;
  budget_min: number | null;
  budget_max: number | null;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
  skills_required: number[];
  industries: number[];
  role_type?: string | null;
  gig_location?: string | null;
  is_expired?: boolean;
  project_origin?: 'internal' | 'external';
}

interface SkillOption {
  id: number;
  name: string;
}

interface IndustryOption {
  id: number;
  name: string;
  category?: string | null;
}

interface ExternalGigFormState {
  client_name: string;
  title: string;
  description: string;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  external_url: string;
  expires_at: string;
  budget_amount: string;
  budget_to_be_confirmed: boolean;
  timeline: string;
  skills: number[];
  industries: number[];
  role_type: string;
  gig_location: string;
}

const statusOptions = ['draft', 'open', 'in_progress', 'completed', 'cancelled'] as const;
const statusLabels: Record<string, string> = {
  draft: 'Draft',
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

const expiryOptions: { value: ExpiryFilter; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'all', label: 'All' }
];

const defaultFormState: ExternalGigFormState = {
  client_name: '',
  title: '',
  description: '',
  status: 'draft',
  external_url: '',
  expires_at: '',
  budget_amount: '',
  budget_to_be_confirmed: false,
  timeline: '',
  skills: [],
  industries: [],
  role_type: '',
  gig_location: ''
};

const TIMELINE_OPTIONS = [
  { value: '1-7-days', label: '1-7 days', min: 1, max: 7 },
  { value: '1-2-weeks', label: '1-2 weeks', min: 7, max: 14 },
  { value: '2-4-weeks', label: '2-4 weeks', min: 14, max: 30 },
  { value: '1-2-months', label: '1-2 months', min: 30, max: 60 },
  { value: '2-6-months', label: '2-6 months', min: 60, max: 180 },
  { value: '6-12-months', label: '6-12 months', min: 180, max: 365 },
  { value: '1-2-years', label: '1-2 years', min: 365, max: 730 }
] as const;

type TimelineValue = (typeof TIMELINE_OPTIONS)[number]['value'];

function mapTimelineToRange(value: TimelineValue | ''): { min: number | null; max: number | null } {
  if (!value) {
    return { min: null, max: null };
  }
  const option = TIMELINE_OPTIONS.find((item) => item.value === value);
  if (!option) {
    return { min: null, max: null };
  }
  return { min: option.min, max: option.max };
}

function mapRangeToTimeline(min: number | null | undefined, max: number | null | undefined): TimelineValue | '' {
  if (min == null || max == null) {
    return '';
  }
  const option = TIMELINE_OPTIONS.find((item) => item.min === min && item.max === max);
  return option ? option.value : '';
}

function toLocalInputDate(iso: string | null | undefined) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (value: number) => `${value}`.padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toIso(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeExternalUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function isValidHttpUrl(value: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_error) {
    return false;
  }
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function statusBadgeClasses(status: string) {
  switch (status) {
    case 'open':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'draft':
      return 'bg-slate-100 text-slate-800 border-slate-200';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
}

function normalizeSkills(value: unknown): number[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => Number(item)).filter((item) => !Number.isNaN(item));
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => Number(item)).filter((item) => !Number.isNaN(item));
      }
    } catch (_error) {
      return [];
    }
  }

  return [];
}

function normalizeIndustries(value: unknown): number[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => Number(item)).filter((item) => !Number.isNaN(item));
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => Number(item)).filter((item) => !Number.isNaN(item));
      }
    } catch (_error) {
      return [];
    }
  }

  return [];
}

export default function StaffExternalGigsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { staff, loading: staffLoading } = useStaffUser();

  const [projects, setProjects] = useState<ExternalProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>(['open']);
  const [expiryFilter, setExpiryFilter] = useState<ExpiryFilter>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [industries, setIndustries] = useState<IndustryOption[]>([]);
  const [industriesLoading, setIndustriesLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ExternalProject | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState<ExternalGigFormState>(defaultFormState);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [industrySearch, setIndustrySearch] = useState('');
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  const filteredSkills = useMemo(() => {
    if (!skillSearch.trim()) {
      return skills.filter((skill) => !formState.skills.includes(skill.id));
    }
    const term = skillSearch.toLowerCase();
    return skills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(term) && !formState.skills.includes(skill.id)
    );
  }, [skillSearch, skills, formState.skills]);

  const filteredIndustries = useMemo(() => {
    if (!industrySearch.trim()) {
      return industries.filter((industry) => !formState.industries.includes(industry.id));
    }
    const term = industrySearch.toLowerCase();
    return industries.filter(
      (industry) =>
        industry.name.toLowerCase().includes(term) &&
        !formState.industries.includes(industry.id)
    );
  }, [industrySearch, industries, formState.industries]);

  const selectedSkillOptions = useMemo(
    () =>
      formState.skills
        .map((id) => skills.find((skill) => skill.id === id))
        .filter((skill): skill is SkillOption => Boolean(skill)),
    [formState.skills, skills]
  );

  const selectedIndustryOptions = useMemo(
    () =>
      formState.industries
        .map((id) => industries.find((industry) => industry.id === id))
        .filter((industry): industry is IndustryOption => Boolean(industry)),
    [formState.industries, industries]
  );

  const maxSkillSelectionsReached = formState.skills.length >= 15;
  const maxIndustrySelectionsReached = formState.industries.length >= 10;

  function addSkillOption(skill: SkillOption) {
    if (maxSkillSelectionsReached) return;
    setFormState((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill.id) ? prev.skills : [...prev.skills, skill.id]
    }));
    setSkillSearch('');
    setShowSkillDropdown(false);
  }

  function removeSkillOption(skillId: number) {
    setFormState((prev) => ({
      ...prev,
      skills: prev.skills.filter((id) => id !== skillId)
    }));
  }

  function addIndustryOption(industry: IndustryOption) {
    if (maxIndustrySelectionsReached) return;
    setFormState((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry.id)
        ? prev.industries
        : [...prev.industries, industry.id]
    }));
    setIndustrySearch('');
    setShowIndustryDropdown(false);
  }

  function removeIndustryOption(industryId: number) {
    setFormState((prev) => ({
      ...prev,
      industries: prev.industries.filter((id) => id !== industryId)
    }));
  }

  const canManage = useMemo(
    () => (staff?.role === 'admin' || staff?.role === 'super_user') as boolean,
    [staff?.role]
  );

  const canDelete = useMemo(() => staff?.role === 'super_user', [staff?.role]);

  useEffect(() => {
    if (staffLoading) return;
    loadProjects();
  }, [staffLoading, expiryFilter, searchQuery, statusFilter.join(',')]);

  useEffect(() => {
    loadSkills();
    loadIndustries();
  }, []);

  async function loadSkills() {
    try {
      setSkillsLoading(true);
      const { data, error } = await supabase.from('skills').select('id, name').order('name');

      if (error) {
        console.error('❌ Failed to load skills for external gigs:', error);
        toast({
          title: 'Failed to load skills',
          description: 'Unable to fetch skill options right now.',
          variant: 'destructive'
        });
        return;
      }

      setSkills(data || []);
    } catch (error) {
      console.error('❌ Unexpected error loading skills:', error);
    } finally {
      setSkillsLoading(false);
    }
  }

  async function loadIndustries() {
    try {
      setIndustriesLoading(true);
      const { data, error } = await supabase
        .from('industries')
        .select('id, name, category')
        .order('name');

      if (error) {
        console.error('❌ Failed to load industries for external gigs:', error);
        toast({
          title: 'Failed to load industries',
          description: 'Unable to fetch industry options right now.',
          variant: 'destructive'
        });
        return;
      }

      setIndustries(data || []);
    } catch (error) {
      console.error('❌ Unexpected error loading industries:', error);
    } finally {
      setIndustriesLoading(false);
    }
  }

  async function loadProjects() {
    try {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in as staff to load external gigs.',
          variant: 'destructive'
        });
        return;
      }

      const params = new URLSearchParams();
      const normalizedStatuses = statusFilter.filter((status) => status !== 'all');

      if (normalizedStatuses.length > 0) {
        params.set('status', normalizedStatuses.join(','));
      }

      if (expiryFilter !== 'all') {
        params.set('expiry', expiryFilter);
      }

      if (searchQuery) {
        params.set('search', searchQuery);
      }

      const queryString = params.toString();
      const endpoint = `/.netlify/functions/staff-external-gigs-list${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Error loading external gigs:', result);
        toast({
          title: 'Failed to load external gigs',
          description: result.error || 'Unexpected error while loading external gigs.',
          variant: 'destructive'
        });
        return;
      }

      const projectList: ExternalProject[] = (result.projects || []).map(
        (project: ExternalProject) => ({
          ...project,
          project_origin: 'external',
          skills_required: normalizeSkills(project.skills_required),
          industries: normalizeIndustries(project.industries)
        })
      );

      setProjects(projectList);
    } catch (error) {
      console.error('❌ Unexpected error loading external gigs:', error);
      toast({
        title: 'Failed to load external gigs',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormState(defaultFormState);
    setSkillSearch('');
    setShowSkillDropdown(false);
    setIndustrySearch('');
    setShowIndustryDropdown(false);
  }

  function openCreateDialog() {
    resetForm();
    setSelectedProject(null);
    setCreateOpen(true);
  }

  function openEditDialog(project: ExternalProject) {
    setSelectedProject(project);
    const timeline = mapRangeToTimeline(project.delivery_time_min, project.delivery_time_max);
    const budgetToBeConfirmed =
      project.budget_min == null && project.budget_max == null;
    const budgetAmount = budgetToBeConfirmed
      ? ''
      : String(project.budget_min ?? project.budget_max ?? '');
    setFormState({
      client_name: project.source_name || '',
      title: project.title || '',
      description: project.description || '',
      status: project.status || 'draft',
      external_url: project.external_url || '',
      expires_at: toLocalInputDate(project.expires_at),
      budget_amount: budgetAmount,
      budget_to_be_confirmed: budgetToBeConfirmed,
      timeline,
      skills: normalizeSkills(project.skills_required),
      industries: project.industries || [],
      role_type: project.role_type || '',
      gig_location: project.gig_location || ''
    });
    setSkillSearch('');
    setShowSkillDropdown(false);
    setIndustrySearch('');
    setShowIndustryDropdown(false);
    setEditOpen(true);
  }

  function openDeleteDialog(project: ExternalProject) {
    setSelectedProject(project);
    setDeleteOpen(true);
  }

  async function handleCreate() {
    try {
      setSubmitting(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in as staff to create an external gig.',
          variant: 'destructive'
        });
        return;
      }

      const budgetProvided =
        !formState.budget_to_be_confirmed && formState.budget_amount.trim() !== '';
      const parsedBudget = budgetProvided ? Number(formState.budget_amount) : null;
      const budgetValue =
        parsedBudget !== null && !Number.isNaN(parsedBudget) ? parsedBudget : null;
      const { min: timelineMin, max: timelineMax } = mapTimelineToRange(
        formState.timeline as TimelineValue | ''
      );
      const externalUrl = normalizeExternalUrl(formState.external_url);

      if (!isValidHttpUrl(externalUrl)) {
        toast({
          title: 'Unable to create external gig',
          description: 'External URL must be a valid HTTP or HTTPS link.',
          variant: 'destructive'
        });
        return;
      }

      const normalizedIndustries = formState.industries
        .map((industryId) => Number(industryId))
        .filter((industryId) => !Number.isNaN(industryId));

      if (
        formState.industries.length > 0 &&
        normalizedIndustries.length !== formState.industries.length
      ) {
        toast({
          title: 'Unable to create external gig',
          description: 'One or more selected industries could not be interpreted. Please reselect the industries and try again.',
          variant: 'destructive'
        });
        return;
      }

      const payload = {
        title: formState.title,
        description: formState.description,
        status: formState.status,
        external_url: externalUrl,
        expires_at: toIso(formState.expires_at),
        source_name: formState.client_name ? formState.client_name.trim() : null,
        currency: 'USD',
        budget_min: budgetValue,
        budget_max: budgetValue,
        delivery_time_min: timelineMin,
        delivery_time_max: timelineMax,
        skills_required: formState.skills,
        industries: normalizedIndustries,
        role_type: formState.role_type || null,
        gig_location: formState.gig_location.trim() || null
      };

      const response = await fetch('/.netlify/functions/staff-external-gigs-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Error creating external gig:', result);
        toast({
          title: 'Unable to create external gig',
          description: result.error || 'Please correct the highlighted fields and try again.',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'External gig created',
        description: 'The external opportunity is now available to staff.',
        variant: 'default'
      });

      setCreateOpen(false);
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('❌ Unexpected error creating external gig:', error);
      toast({
        title: 'Unable to create external gig',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate() {
    if (!selectedProject) return;

    try {
      setSubmitting(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in as staff to update an external gig.',
          variant: 'destructive'
        });
        return;
      }

      const budgetProvided =
        !formState.budget_to_be_confirmed && formState.budget_amount.trim() !== '';
      const parsedBudget = budgetProvided ? Number(formState.budget_amount) : null;
      const budgetValue =
        parsedBudget !== null && !Number.isNaN(parsedBudget) ? parsedBudget : null;
      const { min: timelineMin, max: timelineMax } = mapTimelineToRange(
        formState.timeline as TimelineValue | ''
      );

      const normalizedIndustries = formState.industries
        .map((industryId) => Number(industryId))
        .filter((industryId) => !Number.isNaN(industryId));
      const externalUrl = normalizeExternalUrl(formState.external_url);

      if (!isValidHttpUrl(externalUrl)) {
        toast({
          title: 'Unable to update external gig',
          description: 'External URL must be a valid HTTP or HTTPS link.',
          variant: 'destructive'
        });
        return;
      }

      if (
        formState.industries.length > 0 &&
        normalizedIndustries.length !== formState.industries.length
      ) {
        toast({
          title: 'Unable to update external gig',
          description: 'One or more selected industries could not be interpreted. Please reselect the industries and try again.',
          variant: 'destructive'
        });
        return;
      }

      const payload = {
        id: selectedProject.id,
        title: formState.title,
        description: formState.description,
        status: formState.status,
        external_url: externalUrl,
        expires_at: formState.expires_at ? toIso(formState.expires_at) : null,
        source_name: formState.client_name ? formState.client_name.trim() : null,
        currency: 'USD',
        budget_min: budgetValue,
        budget_max: budgetValue,
        delivery_time_min: timelineMin,
        delivery_time_max: timelineMax,
        skills_required: formState.skills,
        industries: normalizedIndustries
      };

      const response = await fetch('/.netlify/functions/staff-external-gigs-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Error updating external gig:', result);
        toast({
          title: 'Unable to update external gig',
          description: result.error || 'Please correct the highlighted fields and try again.',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'External gig updated',
        description: 'Changes saved successfully.',
        variant: 'default'
      });

      setEditOpen(false);
      setSelectedProject(null);
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('❌ Unexpected error updating external gig:', error);
      toast({
        title: 'Unable to update external gig',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedProject) return;

    try {
      setSubmitting(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in as staff to delete an external gig.',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch('/.netlify/functions/staff-external-gigs-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ id: selectedProject.id })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Error deleting external gig:', result);
        toast({
          title: 'Unable to delete external gig',
          description: result.error || 'Please try again.',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'External gig removed',
        description: 'The external opportunity will no longer appear to professionals.',
        variant: 'default'
      });

      setDeleteOpen(false);
      setSelectedProject(null);
      loadProjects();
    } catch (error) {
      console.error('❌ Unexpected error deleting external gig:', error);
      toast({
        title: 'Unable to delete external gig',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  }

  const activeFiltersSummary = useMemo(() => {
    const parts: string[] = [];
    const normalizedStatuses = statusFilter.filter((status) => status !== 'all');
    if (normalizedStatuses.length > 0) {
      parts.push(`${normalizedStatuses.length} status${normalizedStatuses.length > 1 ? 'es' : ''}`);
    }
    if (expiryFilter !== 'all') {
      parts.push(`${expiryFilter === 'active' ? 'Active' : 'Expired'} only`);
    }
    if (searchQuery) {
      parts.push(`Search: “${searchQuery}”`);
    }
    return parts.join(' • ');
  }, [expiryFilter, searchQuery, statusFilter]);

  const renderFilters = () => (
    <div className="flex flex-wrap gap-3 items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => loadProjects()}
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              Refresh
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reload external gigs from Supabase</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Status
            {statusFilter.filter((status) => status !== 'all').length > 0 && (
              <Badge variant="secondary">
                {statusFilter.filter((status) => status !== 'all').length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Statuses</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map((status) => {
            const isChecked = statusFilter.includes(status);
            return (
              <DropdownMenuCheckboxItem
                key={status}
                checked={isChecked}
                onCheckedChange={(checked) => {
                  setStatusFilter((prev) => {
                    const withoutAll = prev.filter((item) => item !== 'all');
                    if (checked) {
                      return Array.from(new Set([...withoutAll, status]));
                    }
                    const next = withoutAll.filter((item) => item !== status);
                    return next.length === 0 ? ['all'] : next;
                  });
                }}
                className="capitalize"
              >
                {statusLabels[status]}
              </DropdownMenuCheckboxItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={statusFilter.includes('all')}
            onCheckedChange={(checked) => {
              if (checked) {
                setStatusFilter(['all']);
              } else {
                setStatusFilter(['open']);
              }
            }}
          >
            All statuses
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Select value={expiryFilter} onValueChange={(value: ExpiryFilter) => setExpiryFilter(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Expiry" />
        </SelectTrigger>
        <SelectContent>
          {expiryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search title, description, or source"
          className="w-64"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSearchQuery(searchTerm.trim())}
        >
          Search
        </Button>
      </div>
    </div>
  );

  const renderIndustrySelector = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-700">
          Industries <span className="text-xs text-slate-400">(optional)</span>
        </Label>
        <span className="text-xs text-slate-500">
          {formState.industries.length}/10 selected
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={industrySearch}
          placeholder={
            maxIndustrySelectionsReached
              ? 'Maximum industries selected'
              : 'Search for industries...'
          }
          onChange={(event) => {
            const value = event.target.value;
            setIndustrySearch(value);
            setShowIndustryDropdown(Boolean(value));
          }}
          onFocus={() => {
            if (industrySearch) {
              setShowIndustryDropdown(true);
            }
          }}
          disabled={
            industriesLoading || (maxIndustrySelectionsReached && !industrySearch)
          }
          className="pl-10"
        />
        {showIndustryDropdown && !industriesLoading && (
          <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
            {filteredIndustries.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">
                No industries match “{industrySearch}”.
              </div>
            ) : (
              filteredIndustries.map((industry) => (
                <button
                  key={industry.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    addIndustryOption(industry);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span className="flex flex-col">
                    <span>{industry.name}</span>
                    {industry.category && (
                      <span className="text-xs text-slate-400">{industry.category}</span>
                    )}
                  </span>
                  {formState.industries.includes(industry.id) && (
                    <Badge variant="secondary">Added</Badge>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {industriesLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading industries…
        </div>
      ) : selectedIndustryOptions.length === 0 ? (
        <p className="text-xs text-slate-500">
          You can leave this blank if the industry is unspecified.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedIndustryOptions.map((industry) => (
            <span
              key={industry.id}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
            >
              {industry.name}
              <button
                type="button"
                onClick={() => removeIndustryOption(industry.id)}
                className="rounded-full p-0.5 text-blue-500 hover:text-blue-700"
                aria-label={`Remove ${industry.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderSkillSelector = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-700">
          Required Skills <span className="text-xs text-slate-400">(optional)</span>
        </Label>
        <span className="text-xs text-slate-500">
          {formState.skills.length}/15 selected
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={skillSearch}
          placeholder={
            maxSkillSelectionsReached
              ? 'Maximum skills selected'
              : 'Search for skills...'
          }
          onChange={(event) => {
            const value = event.target.value;
            setSkillSearch(value);
            setShowSkillDropdown(Boolean(value));
          }}
          onFocus={() => {
            if (skillSearch) {
              setShowSkillDropdown(true);
            }
          }}
          disabled={skillsLoading || (maxSkillSelectionsReached && !skillSearch)}
          className="pl-10"
        />
        {showSkillDropdown && !skillsLoading && (
          <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
            {filteredSkills.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">
                No skills match “{skillSearch}”.
              </div>
            ) : (
              filteredSkills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    addSkillOption(skill);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span>{skill.name}</span>
                  {formState.skills.includes(skill.id) && (
                    <Badge variant="secondary">Added</Badge>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {skillsLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading skills…
        </div>
      ) : selectedSkillOptions.length === 0 ? (
        <p className="text-xs text-slate-500">
          You can leave this blank if no specific skills are required.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedSkillOptions.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
            >
              {skill.name}
              <button
                type="button"
                onClick={() => removeSkillOption(skill.id)}
                className="rounded-full p-0.5 text-slate-500 hover:text-slate-700"
                aria-label={`Remove ${skill.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderExternalGigForm = (prefix: string) => (
    <div className="grid gap-5 py-4">
      <div className="grid gap-2">
        <Label htmlFor={`${prefix}-client_name`}>External client name</Label>
        <Input
          id={`${prefix}-client_name`}
          value={formState.client_name}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, client_name: event.target.value }))
          }
          placeholder="Company or hiring manager name"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${prefix}-title`}>Opportunity title</Label>
        <Input
          id={`${prefix}-title`}
          value={formState.title}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, title: event.target.value }))
          }
          placeholder="Senior Product Strategist"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${prefix}-description`}>Description</Label>
        <Textarea
          id={`${prefix}-description`}
          rows={5}
          value={formState.description}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, description: event.target.value }))
          }
          placeholder="Brief description of the opportunity and key requirements."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-external_url`}>External application URL</Label>
          <Input
            id={`${prefix}-external_url`}
            value={formState.external_url}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, external_url: event.target.value }))
            }
            placeholder="https://example.com/opportunity"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-expires_at`}>Expires at (optional)</Label>
          <Input
            id={`${prefix}-expires_at`}
            type="datetime-local"
            value={formState.expires_at}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, expires_at: event.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-status`}>Status</Label>
          <Select
            value={formState.status}
            onValueChange={(value) => setFormState((prev) => ({ ...prev, status: value }))}
          >
            <SelectTrigger id={`${prefix}-status`}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-timeline`}>Timeline</Label>
          <Select
            value={formState.timeline}
            onValueChange={(value) =>
              setFormState((prev) => ({ ...prev, timeline: value as TimelineValue }))
            }
          >
            <SelectTrigger id={`${prefix}-timeline`}>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              {TIMELINE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-role_type`}>Role Type</Label>
          <Select
            value={formState.role_type}
            onValueChange={(value) => setFormState((prev) => ({ ...prev, role_type: value }))}
          >
            <SelectTrigger id={`${prefix}-role_type`}>
              <SelectValue placeholder="Select role type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in_person">In-person</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-gig_location`}>Gig Location</Label>
          <Input
            id={`${prefix}-gig_location`}
            value={formState.gig_location}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, gig_location: event.target.value }))
            }
            placeholder="e.g., New York, USA or Fully Remote"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Budget (USD)</Label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              $
            </span>
            <Input
              id={`${prefix}-budget_amount`}
              type="number"
              min="0"
              step="100"
              placeholder="4500"
              value={formState.budget_amount}
              disabled={formState.budget_to_be_confirmed}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  budget_amount: event.target.value
                }))
              }
              className="pl-7"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id={`${prefix}-budget_tbd`}
              checked={formState.budget_to_be_confirmed}
              onCheckedChange={(checked) =>
                setFormState((prev) => ({
                  ...prev,
                  budget_to_be_confirmed: Boolean(checked),
                  budget_amount: Boolean(checked) ? '' : prev.budget_amount
                }))
              }
            />
            <Label htmlFor={`${prefix}-budget_tbd`} className="text-sm text-slate-600">
              To be confirmed
            </Label>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Currency is fixed to USD. Professionals will see “To be confirmed” when checked.
        </p>
      </div>

      {renderIndustrySelector()}
      {renderSkillSelector()}
    </div>
  );

  return (
    <StaffRoute requiredRole="support">
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b">
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/staff/dashboard')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      External Gigs
                      <Badge variant="outline" className="uppercase tracking-wide text-xs">
                        External
                      </Badge>
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage manually curated opportunities sourced outside GigExecs.
                    </p>
                    {activeFiltersSummary && (
                      <p className="text-xs text-gray-500 mt-1">Filters: {activeFiltersSummary}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canManage ? (
                    <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New External Gig
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button disabled className="opacity-60 cursor-not-allowed">
                            <Plus className="h-4 w-4 mr-2" />
                            New External Gig
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Admin role required to create external gigs.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 py-6">
            <div className="mb-6">{renderFilters()}</div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  External Opportunities ({projects.length})
                </CardTitle>
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading latest entries…
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left p-3 font-medium text-slate-600">Title</th>
                        <th className="text-left p-3 font-medium text-slate-600">Source</th>
                        <th className="text-left p-3 font-medium text-slate-600">Status</th>
                        <th className="text-left p-3 font-medium text-slate-600">Expires</th>
                        <th className="text-left p-3 font-medium text-slate-600">Updated</th>
                        <th className="text-center p-3 font-medium text-slate-600">Apply</th>
                        <th className="text-right p-3 font-medium text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-10 text-center text-gray-500">
                            {loading ? 'Loading external gigs…' : 'No external gigs found.'}
                          </td>
                        </tr>
                      ) : (
                        projects.map((project) => {
                          const isActive = canApplyExternally(project);
                          return (
                            <tr key={project.id} className="border-b hover:bg-slate-50/70 transition">
                              <td className="p-3 align-top">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900">
                                      {project.title}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      External
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-slate-500 line-clamp-2">
                                    {project.description}
                                  </p>
                                </div>
                              </td>
                              <td className="p-3 align-top">
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-medium text-slate-700">
                                    {project.source_name || 'External Source'}
                                  </span>
                                  {project.external_url && (
                                    <a
                                      href={project.external_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline"
                                    >
                                      {project.external_url}
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 align-top">
                                <Badge className={cn('capitalize', statusBadgeClasses(project.status))}>
                                  {statusLabels[project.status] || project.status}
                                </Badge>
                              </td>
                              <td className="p-3 align-top">
                                <div className="flex flex-col gap-1 text-xs">
                                  <span className="font-medium text-slate-700">
                                    {formatDate(project.expires_at)}
                                  </span>
                                  {project.expires_at ? (
                                    project.is_expired ? (
                                      <Badge variant="destructive" className="w-fit">
                                        Expired
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="w-fit">
                                        Active
                                      </Badge>
                                    )
                                  ) : (
                                    <Badge variant="outline" className="w-fit">
                                      No expiry
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 align-top text-xs text-slate-600">
                                {project.updated_at
                                  ? `${formatDistanceToNow(new Date(project.updated_at), {
                                      addSuffix: true
                                    })}`
                                  : '—'}
                              </td>
                              <td className="p-3 align-top text-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => {
                                          if (project.external_url) {
                                            window.open(
                                              project.external_url,
                                              '_blank',
                                              'noopener,noreferrer'
                                            );
                                          }
                                        }}
                                        disabled={!project.external_url || !isActive}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        <span className="sr-only">Open external application</span>
                                      </Button>
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {project.external_url
                                      ? isActive
                                        ? 'Open external application URL'
                                        : 'Application expired'
                                      : 'No external URL provided'}
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                              <td className="p-3 align-top">
                                <div className="flex items-center justify-end gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="flex items-center gap-2"
                                          onClick={() => openEditDialog(project)}
                                          disabled={!canManage}
                                        >
                                          <PenSquare className="h-4 w-4" />
                                          Edit
                                        </Button>
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {canManage
                                        ? 'Edit external gig'
                                        : 'Admin role required to edit'}
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-rose-600 hover:text-rose-700"
                                          onClick={() => openDeleteDialog(project)}
                                          disabled={!canDelete}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Remove external gig</span>
                                        </Button>
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {canDelete
                                        ? 'Remove external gig'
                                        : 'Super user role required to remove'}
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog
          open={createOpen}
          onOpenChange={(open) => {
            if (!open) {
              setCreateOpen(false);
              resetForm();
            }
          }}
        >
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create External Gig</DialogTitle>
              <DialogDescription>
                Publish an external opportunity that will appear alongside internal gigs.
              </DialogDescription>
            </DialogHeader>
            {renderExternalGigForm('create')}
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create External Gig
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={editOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditOpen(false);
              setSelectedProject(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit External Gig</DialogTitle>
              <DialogDescription>
                Update the external opportunity details. Changes are logged for auditing.
              </DialogDescription>
            </DialogHeader>
            {renderExternalGigForm('edit')}
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button variant="outline" onClick={() => setEditOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={deleteOpen}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteOpen(false);
              setSelectedProject(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove External Gig</DialogTitle>
              <DialogDescription>
                This will cancel the opportunity and remove it from professional views.
              </DialogDescription>
            </DialogHeader>
            <div className="border border-rose-200 bg-rose-50 rounded-md p-4 flex items-start gap-3 text-sm text-rose-700">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">Are you sure you want to remove this external gig?</p>
                <p className="mt-1">
                  This action is logged for auditing. Professionals will no longer see this
                  opportunity.
                </p>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Remove External Gig
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </StaffRoute>
  );
}

