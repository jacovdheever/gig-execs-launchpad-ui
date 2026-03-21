import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Filter, 
  MapPin,
  Clock,
  DollarSign,
  Star,
  Building2,
  CheckCircle,
  Calendar,
  Briefcase,
  ExternalLink,
  Info,
  User,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { canApplyExternally } from '@/lib/utils';
import { trackExternalGigClick } from '@/lib/trackExternalGigClick';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  industries?: number[];
  project_origin?: 'internal' | 'external';
  external_url?: string | null;
  expires_at?: string | null;
  source_name?: string | null;
  role_type?: string | null;
  gig_location?: string | null;
  is_expired?: boolean;
  is_active?: boolean;
  hasBidSubmitted?: boolean;
  client?: {
    first_name: string;
    last_name: string;
    company_name?: string;
    logo_url?: string;
    verified?: boolean;
    rating?: number;
    total_ratings?: number;
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

export default function FindGigsPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  /** Industries that appear on at least one loaded gig (filter list only; full list kept for lookups) */
  const [projectIndustries, setProjectIndustries] = useState<Industry[]>([]);
  const [projectSkills, setProjectSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<number[]>([]);
  /** Default ON: show only open, non-expired engagements */
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(true);
  /** Slider range: default always $0 → max from loaded gigs (user narrows from there) */
  const [hourlyRateRange, setHourlyRateRange] = useState<[number, number]>([0, 0]);
  const [maxBudget, setMaxBudget] = useState<number>(1000000);
  const [showFilters, setShowFilters] = useState(false);
  const [originFilter, setOriginFilter] = useState<'all' | 'internal' | 'external'>('all');
  const [userSkills, setUserSkills] = useState<number[]>([]);
  const [userIndustries, setUserIndustries] = useState<number[]>([]);
  const [userBids, setUserBids] = useState<Set<number>>(new Set());
  const [showBidsOnly, setShowBidsOnly] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<'best_match' | 'most_recent'>('best_match');
  const [skillsListExpanded, setSkillsListExpanded] = useState(false);
  const [industriesListExpanded, setIndustriesListExpanded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
    try {
      setLoading(true);
      
      const userData = await getCurrentUser();
      if (!userData) {
        return;
      }
      console.log('🔍 User data from getCurrentUser:', userData);
      console.log('🔍 User data keys:', Object.keys(userData));
      console.log('🔍 User data role:', userData.role);
      setUser(userData);

      // Load user's skills and industries for match calculation using Netlify function
      if (userData.role === 'consultant') {
        console.log('🔍 Loading user skills via Netlify function for user:', userData.id);
        
        // Get the current session to get the JWT token
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔍 Session data:', session);
        console.log('🔍 Access token:', session?.access_token);
        
        const userSkillsResponse = await fetch('/.netlify/functions/get-user-skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ userId: userData.id })
        });
        
        const userSkillsResult = await userSkillsResponse.json();
        console.log('🔍 User skills from Netlify function:', userSkillsResult);
        
        if (userSkillsResult.userSkills) {
          console.log('🔍 User skills loaded:', userSkillsResult.userSkills);
          setUserSkills(userSkillsResult.userSkills);
        } else {
          console.log('🔍 No user skills found for user:', userData.id);
        }

        if (userSkillsResult.userIndustries) {
          console.log('🔍 User industries loaded:', userSkillsResult.userIndustries);
          setUserIndustries(userSkillsResult.userIndustries);
        } else {
          console.log('🔍 No user industries found for user:', userData.id);
        }
      }

      // Load projects, skills, and industries in parallel
      const [projectsResult, skillsResult, industriesResult] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .is('deleted_at', null)
          .in('status', ['open', 'in_progress', 'completed', 'cancelled'])
          .order('created_at', { ascending: false }),
        supabase
          .from('skills')
          .select('id, name')
          .order('name'),
        supabase
          .from('industries')
          .select('id, name, category')
          .order('name')
      ]);

      if (projectsResult.error) {
        console.error('Error loading projects:', projectsResult.error);
        return;
      }

      console.log('🔍 Projects loaded:', projectsResult.data?.length || 0, 'projects');
      console.log('🔍 Raw project data structure:', JSON.stringify(projectsResult.data, null, 2));

      // Load client data with a simple approach
      console.log('🔍 Loading client data with simple approach');
      
      // Get unique creator IDs
      const rawCreatorIds = projectsResult.data?.map(p => p.creator_id) || [];
      const creatorIds = [...new Set(rawCreatorIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0))];
      console.log('🔍 Unique creator IDs:', creatorIds);
      
      // Load client data using Netlify function to bypass RLS
      console.log('🔍 Loading client data via Netlify function for creator IDs:', creatorIds);
      
      // Get the current session to get the JWT token (reuse session from earlier if available)
      const { data: { session: clientDataSession } } = await supabase.auth.getSession();
      console.log('🔍 Client data session:', clientDataSession);
      console.log('🔍 Client data access token:', clientDataSession?.access_token);
      
      let users: any[] = [];
      let clientProfiles: any[] = [];

      if (creatorIds.length > 0) {
      const clientDataResponse = await fetch('/.netlify/functions/get-client-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clientDataSession?.access_token}`
        },
        body: JSON.stringify({ creatorIds })
      });
      
        if (!clientDataResponse.ok) {
          const errorBody = await clientDataResponse.text();
          console.error('❌ Failed to load client data:', clientDataResponse.status, errorBody);
        } else {
      const clientDataResult = await clientDataResponse.json();
      console.log('🔍 Client data from Netlify function:', clientDataResult);
          users = clientDataResult.users || [];
          clientProfiles = clientDataResult.clientProfiles || [];
        }
      } else {
        console.log('🔍 No valid creator IDs found, skipping client data fetch.');
      }
      
      console.log('🔍 Users loaded from function:', users.length);
      console.log('🔍 Client profiles loaded from function:', clientProfiles.length);
      
      console.log('🔍 Client profiles loaded:', clientProfiles.length);
      console.log('🔍 Users loaded:', users.length);

      if (skillsResult.error) {
        console.error('Error loading skills:', skillsResult.error);
        return;
      }

      if (industriesResult.error) {
        console.error('Error loading industries:', industriesResult.error);
        return;
      }

      const skillsData = skillsResult.data || [];
      const industriesData = industriesResult.data || [];
      
      setSkills(skillsData);
      setIndustries(industriesData);

      // Process projects data
      const processedProjects = (projectsResult.data || []).map(project => {
        let skills_required: number[] = [];
        try {
          const parsed = project.skills_required ? JSON.parse(project.skills_required) : [];
          skills_required = Array.isArray(parsed)
            ? parsed
                .map((skillId: number | string) => Number(skillId))
                .filter((skillId) => !Number.isNaN(skillId))
            : [];
        } catch (error) {
          console.error('Error parsing skills_required for project', project.id, error);
          skills_required = [];
        }
 
        let industriesArray: number[] = [];
        if (Array.isArray(project.industries)) {
          industriesArray = project.industries
            .map((industryId: number | string) => Number(industryId))
            .filter((industryId) => !Number.isNaN(industryId));
        } else if (typeof project.industries === 'string') {
          try {
            const parsedIndustries = JSON.parse(project.industries);
            if (Array.isArray(parsedIndustries)) {
              industriesArray = parsedIndustries
                .map((industryId: number | string) => Number(industryId))
                .filter((industryId) => !Number.isNaN(industryId));
            }
          } catch (error) {
            console.error('Error parsing industries for project', project.id, error);
            industriesArray = [];
          }
        }

        const projectOrigin: 'internal' | 'external' =
          project.project_origin === 'external' ? 'external' : 'internal';
        const sourceName = project.source_name || null;
        const expiresAt = project.expires_at || null;
        const externalUrl = project.external_url || null;
        const expiryTimestamp = expiresAt ? new Date(expiresAt).getTime() : NaN;
        const isExpired = Number.isNaN(expiryTimestamp) ? false : expiryTimestamp <= Date.now();

        const clientProfile = clientProfiles.find(cp => cp.user_id === project.creator_id) || {};
        const clientData = users.find(u => u.id === project.creator_id) || {};
        const clientFirstName = typeof clientData.first_name === 'string' ? clientData.first_name : '';
        const clientLastName = typeof clientData.last_name === 'string' ? clientData.last_name : '';
        const normalizedCompanyName =
          clientProfile.company_name ||
          (clientFirstName || clientLastName
            ? `${clientFirstName} ${clientLastName}`.trim()
            : null);

        const clientInfo =
          projectOrigin === 'external'
            ? {
                first_name: sourceName || 'External',
                last_name: 'Opportunity',
                company_name: sourceName || 'External Opportunity',
                logo_url: null,
            verified: false,
            rating: null,
            total_ratings: null
          }
            : {
                first_name: clientFirstName,
                last_name: clientLastName,
                company_name: normalizedCompanyName,
                logo_url: clientProfile.logo_url || null,
                verified: false,
                rating: null,
                total_ratings: null
              };

        return {
          ...project,
          project_origin: projectOrigin,
          external_url: externalUrl,
          expires_at: expiresAt,
          is_expired: isExpired,
          skills_required,
          industries: industriesArray,
          is_active: project.status === 'open' && !isExpired,
          hasBidSubmitted: false, // Will be set after userBids is loaded
          client: clientInfo
        };
      });

      // Update projects with bid status after userBids is loaded
      // This will be done in a useEffect that watches userBids
      setProjects(processedProjects);

      // Load user's bids to check which gigs they've bid on (after projects are loaded)
      if (userData.role === 'consultant') {
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select('project_id')
          .eq('consultant_id', userData.id);

        if (!bidsError && bidsData) {
          const bidProjectIds = new Set(bidsData.map(bid => parseInt(bid.project_id?.toString() || '0', 10)).filter(id => !isNaN(id) && id > 0));
          console.log('🔍 User bids loaded:', Array.from(bidProjectIds));
          setUserBids(bidProjectIds);
          
          // Update projects with bid status
          setProjects(prevProjects => 
            prevProjects.map(project => ({
              ...project,
              hasBidSubmitted: bidProjectIds.has(project.id)
            }))
          );
        } else if (bidsError) {
          console.error('Error loading user bids:', bidsError);
        }
      }

      // Slider max from gigs; default selection is always $0 through max (no min-from-data default)
      if (processedProjects.length > 0) {
        const budgetValues = processedProjects
          .flatMap((p) => [p.budget_min, p.budget_max])
          .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));

        if (budgetValues.length > 0) {
          const maxBudgetValue = Math.max(...budgetValues);
          setMaxBudget(maxBudgetValue);
          setHourlyRateRange([0, maxBudgetValue]);
          console.log('🔍 Budget slider max:', { max: maxBudgetValue, defaultRange: [0, maxBudgetValue] });
        } else {
          setMaxBudget(0);
          setHourlyRateRange([0, 0]);
          console.log('🔍 No numeric budgets — slider at 0–0.');
        }
      } else {
        setMaxBudget(0);
        setHourlyRateRange([0, 0]);
      }

      // Extract skills from projects for filtering
      const allProjectSkills = new Set<number>();
      processedProjects.forEach(project => {
        if (project.skills_required) {
          project.skills_required.forEach(skillId => allProjectSkills.add(skillId));
        }
      });

      // Get skill details for project skills only
      const projectSkillsData = skillsData.filter(skill => allProjectSkills.has(skill.id));
      setProjectSkills(projectSkillsData);
      console.log('🔍 Project skills extracted:', {
        allProjectSkills: Array.from(allProjectSkills),
        skillsData: skillsData.length,
        projectSkillsData: projectSkillsData
      });

      const allProjectIndustryIds = new Set<number>();
      processedProjects.forEach((project) => {
        if (project.industries?.length) {
          project.industries.forEach((id) => allProjectIndustryIds.add(id));
        }
      });
      const projectIndustriesData = industriesData.filter((i) =>
        allProjectIndustryIds.has(i.id)
      );
      setProjectIndustries(projectIndustriesData);
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
    if (!value) {
      return '—';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }

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

  /**
   * Points: +1 per skill on the gig that matches the consultant’s profile, +1 per matching industry.
   * 1–3 pts → Possible Match · 4–5 → Good Match · 6+ → Strong Match. 0 pts → no badge.
   */
  const calculateMatchQuality = (
    project: Project
  ): { tier: 'strong' | 'good' | 'possible'; points: number; color: 'green' | 'blue' | 'yellow' } | null => {
    if (!user || user.role !== 'consultant') {
      return null;
    }

    if (userSkills.length === 0 && userIndustries.length === 0) {
      return null;
    }

    const projSkills = project.skills_required || [];
    const projIndustries = project.industries || [];

    const skillPoints = projSkills.filter((skillId) => userSkills.includes(skillId)).length;
    const industryPoints = projIndustries.filter((industryId) =>
      userIndustries.includes(industryId)
    ).length;
    const points = skillPoints + industryPoints;

    if (points === 0) {
      return null;
    }

    if (points >= 6) {
      return { tier: 'strong', points, color: 'green' };
    }
    if (points >= 4) {
      return { tier: 'good', points, color: 'blue' };
    }
    return { tier: 'possible', points, color: 'yellow' };
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

  /** True when user has moved the slider away from full $0–max span */
  const isBudgetNarrowed = useMemo(() => {
    if (maxBudget <= 0) return false;
    return hourlyRateRange[0] > 0 || hourlyRateRange[1] < maxBudget;
  }, [hourlyRateRange, maxBudget]);

  /** Count of active refinements (chips + summary) — excludes default “active only”; skills/industries count per selection */
  const optionalFilterCount = useMemo(() => {
    let n = 0;
    if (searchTerm.trim().length > 0) n += 1;
    n += selectedSkills.length;
    n += selectedIndustries.length;
    if (isBudgetNarrowed) n += 1;
    if (originFilter !== 'all') n += 1;
    if (showBidsOnly) n += 1;
    if (!showActiveOnly) n += 1; // user turned off default active-only
    return n;
  }, [
    searchTerm,
    selectedSkills,
    selectedIndustries,
    isBudgetNarrowed,
    originFilter,
    showBidsOnly,
    showActiveOnly,
  ]);

  const filteredProjects = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const projectOrigin = project.project_origin === 'external' ? 'external' : 'internal';
      const matchesOrigin =
        originFilter === 'all' ||
        (originFilter === 'external' && projectOrigin === 'external') ||
        (originFilter === 'internal' && projectOrigin === 'internal');
      if (!matchesOrigin) return false;

      const isActive = project.is_active ?? (project.status === 'open' && !project.is_expired);
      if (showActiveOnly && !isActive) return false;

      if (showBidsOnly && !project.hasBidSubmitted) return false;

      if (q.length > 0) {
        const skillBlob = (project.skills_required || [])
          .map((id) => getSkillName(id).toLowerCase())
          .join(' ');
        const industryBlob = (project.industries || [])
          .map((id) => getIndustryName(id).toLowerCase())
          .join(' ');
        const roleText = project.role_type ? String(project.role_type).toLowerCase() : '';
        const matchesSearch =
          project.title.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q) ||
          (project.client?.company_name?.toLowerCase().includes(q) ?? false) ||
          skillBlob.includes(q) ||
          industryBlob.includes(q) ||
          (roleText.length > 0 && roleText.includes(q));
        if (!matchesSearch) return false;
      }

      if (selectedSkills.length > 0) {
        const matchesSkills = selectedSkills.some((skillId) =>
          project.skills_required.includes(skillId)
        );
        if (!matchesSkills) return false;
      }

      if (selectedIndustries.length > 0) {
        const matchesIndustries =
          project.industries &&
          selectedIndustries.some((industryId) => project.industries!.includes(industryId));
        if (!matchesIndustries) return false;
      }

      if (isBudgetNarrowed) {
        const hasBudget =
          typeof project.budget_min === 'number' &&
          !Number.isNaN(project.budget_min) &&
          typeof project.budget_max === 'number' &&
          !Number.isNaN(project.budget_max);
        const matchesRate = !hasBudget
          ? true
          : project.budget_min <= hourlyRateRange[1] && project.budget_max >= hourlyRateRange[0];
        if (!matchesRate) return false;
      }

      return true;
    });
  }, [
    projects,
    searchTerm,
    selectedSkills,
    selectedIndustries,
    hourlyRateRange,
    originFilter,
    showActiveOnly,
    showBidsOnly,
    isBudgetNarrowed,
    skills,
    industries,
  ]);

  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    if (sortMode === 'most_recent') {
      return list.sort((a, b) => {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tb - ta;
      });
    }
    // Best match (default)
    if (user?.role !== 'consultant') {
      return list.sort((a, b) => {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tb - ta;
      });
    }

    return list.sort((a, b) => {
      const matchA = calculateMatchQuality(a);
      const matchB = calculateMatchQuality(b);

      if (!matchA && !matchB) return 0;
      if (!matchA) return 1;
      if (!matchB) return -1;

      const tierOrder = { strong: 0, good: 1, possible: 2 };
      const orderA = tierOrder[matchA.tier];
      const orderB = tierOrder[matchB.tier];

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return matchB.points - matchA.points;
    });
  }, [filteredProjects, sortMode, user, userSkills, userIndustries]);

  /** Refinements beyond search (for “with N filters applied” copy) */
  const nonSearchFilterCount = useMemo(() => {
    let n = optionalFilterCount;
    if (searchTerm.trim().length > 0) n -= 1;
    return Math.max(0, n);
  }, [optionalFilterCount, searchTerm]);

  const resultsSummaryText = useMemo(() => {
    const n = sortedProjects.length;
    const q = searchTerm.trim();
    if (q && nonSearchFilterCount > 0) {
      return `Showing ${n} result${n === 1 ? '' : 's'} for "${q}" with ${nonSearchFilterCount} filter${nonSearchFilterCount === 1 ? '' : 's'} applied`;
    }
    if (q) {
      return `Showing ${n} result${n === 1 ? '' : 's'} for "${q}"`;
    }
    if (nonSearchFilterCount > 0) {
      return `Showing ${n} result${n === 1 ? '' : 's'} with ${nonSearchFilterCount} filter${nonSearchFilterCount === 1 ? '' : 's'} applied`;
    }
    if (showActiveOnly) {
      return `Showing ${n} active gig${n === 1 ? '' : 's'}`;
    }
    return `Showing ${n} gig${n === 1 ? '' : 's'}`;
  }, [sortedProjects.length, searchTerm, nonSearchFilterCount, showActiveOnly]);

  const resetToDefaults = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setSelectedIndustries([]);
    setHourlyRateRange([0, maxBudget]);
    setOriginFilter('all');
    setShowActiveOnly(true);
    setShowBidsOnly(false);
    setSortMode('best_match');
  };

  const visibleSkillRows = skillsListExpanded ? projectSkills : projectSkills.slice(0, 8);
  const visibleIndustryRows = industriesListExpanded
    ? projectIndustries
    : projectIndustries.slice(0, 8);

  const handleSelectAllIndustries = (checked: boolean) => {
    if (checked) {
      setSelectedIndustries(projectIndustries.map((i) => i.id));
    } else {
      setSelectedIndustries([]);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading available gigs...</p>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Find Gigs</h1>
              <p className="text-slate-600 mt-2">
                Discover opportunities that match your skills and expertise
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide filters' : 'Show filters'}
                {optionalFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-xs font-medium">
                    {optionalFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search by role, skill, company, or keyword"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      aria-label="Search engagements"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Examples: <span className="text-slate-600">Fractional CMO</span>
                    {' · '}
                    <span className="text-slate-600">Marketing</span>
                    {' · '}
                    <span className="text-slate-600">Fintech</span>
                    {' · '}
                    <span className="text-slate-600">Interim COO</span>
                  </p>
                </div>

                {/* Filters panel */}
                {showFilters && (
                  <div className="space-y-5 border-t border-slate-200 pt-5">
                    <div className="grid gap-5 lg:grid-cols-2">
                      {/* 1. Skills */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Skills
                        </h3>
                        <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-slate-100 bg-white p-2">
                          {visibleSkillRows.map((skill) => (
                            <div key={skill.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`skill-${skill.id}`}
                                checked={selectedSkills.includes(skill.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSkills([...selectedSkills, skill.id]);
                                  } else {
                                    setSelectedSkills(selectedSkills.filter((id) => id !== skill.id));
                                  }
                                }}
                              />
                              <label
                                htmlFor={`skill-${skill.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {skill.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        {projectSkills.length > 8 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-slate-600"
                            onClick={() => setSkillsListExpanded((v) => !v)}
                          >
                            {skillsListExpanded ? 'Show less' : 'Show more'}
                          </Button>
                        )}
                      </div>

                      {/* 2. Industry */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Industry
                          </h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() =>
                              handleSelectAllIndustries(
                                selectedIndustries.length !== projectIndustries.length
                              )
                            }
                          >
                            {selectedIndustries.length === projectIndustries.length &&
                            projectIndustries.length > 0
                              ? 'Deselect all'
                              : 'Select all'}
                          </Button>
                        </div>
                        <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-slate-100 bg-white p-2">
                          {visibleIndustryRows.map((industry) => (
                            <div key={industry.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`industry-${industry.id}`}
                                checked={selectedIndustries.includes(industry.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedIndustries([...selectedIndustries, industry.id]);
                                  } else {
                                    setSelectedIndustries(
                                      selectedIndustries.filter((id) => id !== industry.id)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`industry-${industry.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {industry.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        {projectIndustries.length > 8 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-slate-600"
                            onClick={() => setIndustriesListExpanded((v) => !v)}
                          >
                            {industriesListExpanded ? 'Show less' : 'Show more'}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      {/* 3. Engagement details */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Engagement details
                        </h3>
                        <div className="space-y-3 rounded-md border border-slate-100 bg-white p-3">
                          <div>
                            <p className="mb-2 text-sm font-medium text-slate-800">Budget</p>
                            <p className="mb-2 text-xs text-slate-600">
                              {formatCurrency(hourlyRateRange[0], 'USD')} –{' '}
                              {formatCurrency(hourlyRateRange[1], 'USD')}
                            </p>
                            <Slider
                              value={hourlyRateRange}
                              onValueChange={setHourlyRateRange}
                              max={maxBudget}
                              min={0}
                              step={
                                maxBudget > 0
                                  ? Math.max(100, Math.floor(maxBudget / 100))
                                  : 1
                              }
                              className="w-full"
                              minStepsBetweenThumbs={1}
                            />
                            <div className="mt-2 flex justify-between text-xs text-slate-500">
                              <span>$0</span>
                              <span>{formatCurrency(maxBudget, 'USD')}</span>
                            </div>
                          </div>
                          <div className="border-t border-slate-100 pt-3">
                            <p className="mb-2 text-sm font-medium text-slate-800">Origin</p>
                            <RadioGroup
                              value={originFilter}
                              onValueChange={(value) =>
                                setOriginFilter(value as 'all' | 'internal' | 'external')
                              }
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="origin-all" />
                                <Label htmlFor="origin-all" className="text-sm">
                                  All gigs
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="internal" id="origin-internal" />
                                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                  <Label htmlFor="origin-internal" className="text-sm">
                                    Internal gigs
                                  </Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button
                                        type="button"
                                        className="inline-flex shrink-0 touch-manipulation rounded-full text-slate-400 outline-none ring-offset-2 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-slate-400"
                                        aria-label="What is an internal gig?"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Info className="h-3.5 w-3.5" strokeWidth={2} />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="max-w-[min(20rem,calc(100vw-2rem))] space-y-1 border-slate-200 p-3 text-sm shadow-md"
                                      side="top"
                                      align="start"
                                    >
                                      <p className="font-semibold text-slate-900">Internal gig</p>
                                      <p className="text-slate-600 leading-snug">
                                        A role posted directly on GigExecs by a client using the
                                        platform.
                                      </p>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="external" id="origin-external" />
                                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                  <Label htmlFor="origin-external" className="text-sm">
                                    External gigs
                                  </Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button
                                        type="button"
                                        className="inline-flex shrink-0 touch-manipulation rounded-full text-slate-400 outline-none ring-offset-2 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-slate-400"
                                        aria-label="What is an external gig?"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Info className="h-3.5 w-3.5" strokeWidth={2} />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="max-w-[min(20rem,calc(100vw-2rem))] space-y-1 border-slate-200 p-3 text-sm shadow-md"
                                      side="top"
                                      align="start"
                                    >
                                      <p className="font-semibold text-slate-900">External gig</p>
                                      <p className="text-slate-600 leading-snug">
                                        A role sourced from outside GigExecs and curated for our
                                        community.
                                      </p>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>

                      {/* 4. Status / personal activity */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status &amp; personal activity
                        </h3>
                        <div className="space-y-3 rounded-md border border-slate-100 bg-white p-3">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="active-only-toggle"
                              checked={showActiveOnly}
                              onCheckedChange={(checked) => setShowActiveOnly(Boolean(checked))}
                              className="mt-0.5"
                            />
                            <div>
                              <Label htmlFor="active-only-toggle" className="text-sm">
                                Show active gigs only
                              </Label>
                              <p className="mt-1 text-xs text-slate-500">
                                Hide engagements that are filled, cancelled, or past their expiry.
                              </p>
                            </div>
                          </div>
                          {user?.role === 'consultant' && (
                            <div className="flex items-start space-x-2 border-t border-slate-100 pt-3">
                              <Checkbox
                                id="bids-only-toggle"
                                checked={showBidsOnly}
                                onCheckedChange={(checked) => setShowBidsOnly(Boolean(checked))}
                                className="mt-0.5"
                              />
                              <div>
                                <Label htmlFor="bids-only-toggle" className="text-sm">
                                  Show my bids
                                </Label>
                                <p className="mt-1 text-xs text-slate-500">
                                  Limit to engagements you&apos;ve already responded to.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results summary + sort + active chips (outside filter card) */}
          <div className="mb-6 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-slate-700">{resultsSummaryText}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Sort
                </span>
                <Select
                  value={sortMode}
                  onValueChange={(v) => setSortMode(v as 'best_match' | 'most_recent')}
                >
                  <SelectTrigger className="h-9 w-[180px] border-slate-200 bg-white text-sm">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best_match">Best match</SelectItem>
                    <SelectItem value="most_recent">Most recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                {searchTerm.trim().length > 0 && (
                  <Badge
                    variant="secondary"
                    className="flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    <span className="truncate">Search: {searchTerm.trim()}</span>
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label="Clear search"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                )}
                {showActiveOnly ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    Active only
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label="Include inactive engagements"
                      onClick={() => setShowActiveOnly(false)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    Including inactive
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label="Show active engagements only"
                      onClick={() => setShowActiveOnly(true)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                )}
                {isBudgetNarrowed && (
                  <Badge
                    variant="secondary"
                    className="flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    <span className="truncate">
                      Budget: {formatCurrency(hourlyRateRange[0], 'USD')}–
                      {formatCurrency(hourlyRateRange[1], 'USD')}
                    </span>
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label="Clear budget filter"
                      onClick={() => setHourlyRateRange([0, maxBudget])}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                )}
                {originFilter === 'internal' && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    Internal gigs
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label="Clear origin filter"
                      onClick={() => setOriginFilter('all')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                )}
                {originFilter === 'external' && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    External gigs
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label="Clear origin filter"
                      onClick={() => setOriginFilter('all')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                )}
                {selectedSkills.map((skillId) => (
                  <Badge
                    key={`skill-chip-${skillId}`}
                    variant="secondary"
                    className="flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    <span className="truncate">{getSkillName(skillId)}</span>
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label={`Remove skill ${getSkillName(skillId)}`}
                      onClick={() =>
                        setSelectedSkills((prev) => prev.filter((id) => id !== skillId))
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
                {selectedIndustries.map((industryId) => (
                  <Badge
                    key={`industry-chip-${industryId}`}
                    variant="secondary"
                    className="flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    <span className="truncate">{getIndustryName(industryId)}</span>
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label={`Remove industry ${getIndustryName(industryId)}`}
                      onClick={() =>
                        setSelectedIndustries((prev) => prev.filter((id) => id !== industryId))
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
                {showBidsOnly && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    My bids
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label="Clear my bids filter"
                      onClick={() => setShowBidsOnly(false)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                {optionalFilterCount > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-slate-600"
                    onClick={resetToDefaults}
                  >
                    Clear all
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={resetToDefaults}
                >
                  Reset filters
                </Button>
              </div>
            </div>
          </div>

          {/* Gigs Grid */}
          {sortedProjects.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {projects.length === 0 ? 'No engagements available yet' : 'No engagements match this view'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {projects.length === 0
                    ? 'Check back soon for curated opportunities.'
                    : 'Try broadening your search or resetting to the default view.'}
                </p>
                {projects.length > 0 && (
                  <Button variant="outline" onClick={resetToDefaults}>
                    Reset to default view
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedProjects.map((project) => {
                const isExternal = project.project_origin === 'external';
                const isExpired =
                  project.is_expired ??
                  (project.expires_at
                    ? new Date(project.expires_at).getTime() <= Date.now()
                    : false);
                const hasExternalLink = Boolean(project.external_url);
                const applyEnabled = isExternal && hasExternalLink && canApplyExternally(project);
                const createdAtLabel = project.created_at
                  ? new Date(project.created_at).toLocaleDateString()
                  : '—';
                const displayClientName = isExternal
                  ? project.source_name || 'External client'
                  : project.client?.company_name ||
                    (project.client?.first_name && project.client?.last_name
                      ? `${project.client.first_name} ${project.client.last_name.charAt(0)}.`
                      : `Client ${project.creator_id?.slice(-4) || ''}`.trim() || 'Client');
                const currencyCode = project.currency || 'USD';
                const hasBudgetMin = project.budget_min != null;
                const hasBudgetMax = project.budget_max != null;
                let budgetDisplay: string;
                if (hasBudgetMin) {
                  if (hasBudgetMax && project.budget_max !== project.budget_min) {
                    budgetDisplay = `${formatCurrency(project.budget_min, currencyCode)} - ${formatCurrency(project.budget_max, currencyCode)}`;
                  } else {
                    budgetDisplay = formatCurrency(project.budget_min, currencyCode);
                  }
                } else {
                  budgetDisplay = 'Budget to be confirmed';
                }
                const timelineDisplay = formatDuration(
                  project.delivery_time_min,
                  project.delivery_time_max
                );

                return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                            {!isExternal && project.client?.logo_url ? (
                            <img
                              src={project.client.logo_url}
                              alt={project.client.company_name || 'Company Logo'}
                                className="h-full w-full object-cover"
                            />
                          ) : (
                              <Building2 className="h-6 w-6 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                              {displayClientName}
                          </h3>
                            {!isExternal ? (
                              <div className="mt-1 flex items-center gap-2">
                            {project.client?.verified && (
                              <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-xs font-medium text-green-600">Verified</span>
                              </div>
                            )}
                            {project.client?.rating && project.client?.total_ratings ? (
                              renderStars(project.client.rating)
                            ) : (
                                  <span className="text-xs text-slate-500">No ratings yet</span>
                            )}
                          </div>
                            ) : (
                              <p className="mt-1 text-xs text-slate-500">
                                External opportunity curated by GigExecs
                              </p>
                            )}
                            {isExternal && project.source_name && (
                              <p className="mt-1 text-xs text-blue-600">Client: {project.source_name}</p>
                            )}
                        </div>
                      </div>
                        <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                            {createdAtLabel}
                      </Badge>
                          {isExternal && (
                            <Badge className="text-xs border-blue-200 bg-blue-50 text-blue-700">
                              External
                            </Badge>
                          )}
                          {project.hasBidSubmitted && (
                            <Badge className="text-xs border-green-200 bg-green-50 text-green-700">
                              Response submitted
                            </Badge>
                          )}
                        </div>
                    </div>
                    
                      <div className="mb-2 flex items-start justify-between">
                        <CardTitle className="flex-1 text-lg line-clamp-2">{project.title}</CardTitle>
                      {user?.role === 'consultant' && (() => {
                        const match = calculateMatchQuality(project);
                        return match ? (
                          <Badge 
                            variant="outline" 
                            className={`ml-2 shrink-0 text-xs ${
                                match.color === 'green'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : match.color === 'blue'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}
                            >
                              {match.tier === 'strong'
                                ? 'Strong Match'
                                : match.tier === 'good'
                                  ? 'Good Match'
                                  : 'Possible Match'}{' '}
                              ({match.points} {match.points === 1 ? 'pt' : 'pts'})
                          </Badge>
                        ) : null;
                      })()}
                    </div>
                    <CardDescription className="line-clamp-3">
                      {project.description.length > 500 
                        ? `${project.description.substring(0, 500)}...`
                          : project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* About Gig */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-900 text-sm">About Gig:</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap">
                          <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{budgetDisplay}</span>
                          </div>
                          <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{timelineDisplay}</span>
                          </div>
                          {project.role_type && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>
                                {project.role_type === 'in_person' ? 'In-person' : 
                                 project.role_type === 'hybrid' ? 'Hybrid' : 
                                 project.role_type === 'remote' ? 'Remote' : project.role_type}
                              </span>
                            </div>
                          )}
                          {project.gig_location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{project.gig_location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Industries */}
                      {project.industries && project.industries.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm mb-2">Industries:</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.industries.slice(0, 3).map((industryId) => (
                              <Badge key={industryId} variant="secondary" className="text-xs">
                                {getIndustryName(industryId)}
                              </Badge>
                            ))}
                            {project.industries.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.industries.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Skills Required */}
                      {project.skills_required && project.skills_required.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-slate-900 text-sm mb-2">
                              Skills Required:
                            </h4>
                          <div className="flex flex-wrap gap-1">
                            {project.skills_required.slice(0, 4).map((skillId) => (
                              <Badge key={skillId} variant="outline" className="text-xs">
                                {getSkillName(skillId)}
                              </Badge>
                            ))}
                            {project.skills_required.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.skills_required.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                        {/* Actions */}
                        <div className="pt-4 border-t border-slate-200 space-y-2">
                        <Button asChild className="w-full">
                            <Link to={`/find-gigs/${project.id}`}>View Gig Details</Link>
                        </Button>
                          {isExternal && (
                            <Button
                              type="button"
                              variant="secondary"
                              className="w-full flex items-center justify-center gap-2"
                              disabled={!applyEnabled}
                              onClick={async () => {
                                if (project.external_url && applyEnabled) {
                                  // Track the click before opening the external URL
                                  await trackExternalGigClick(project.id, 'listing');
                                  window.open(
                                    project.external_url,
                                    '_blank',
                                    'noopener,noreferrer'
                                  );
                                }
                              }}
                            >
                              Apply Externally
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          {isExternal && (
                            <p className="text-xs text-slate-500 text-center">
                              {project.expires_at
                                ? isExpired
                                  ? 'This opportunity has expired.'
                                  : `Apply before ${formatDate(project.expires_at)}`
                                : 'No expiry date provided.'}
                            </p>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
