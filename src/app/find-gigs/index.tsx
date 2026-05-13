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

function projectHasNumericBudget(project: Project) {
  return (
    typeof project.budget_min === 'number' &&
    !Number.isNaN(project.budget_min) &&
    typeof project.budget_max === 'number' &&
    !Number.isNaN(project.budget_max)
  );
}

export default function FindGigsPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  /** From professional-gigs-list — used to gate external apply for consultants (PRD §5.5). */
  const [gigsListMeta, setGigsListMeta] = useState<{
    subscription_content_access?: boolean;
    basic_profile_complete?: boolean;
    can_bid_internal?: boolean;
    gig_access_enforcement?: boolean;
  } | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  /** Industries that appear on at least one loaded gig (filter list only; full list kept for lookups) */
  const [projectIndustries, setProjectIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<number[]>([]);
  /** Distinct `gig_location` values from loaded gigs (exact DB strings) */
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  /** Distinct `role_type` values from loaded gigs (exact DB strings) */
  const [selectedRoleTypes, setSelectedRoleTypes] = useState<string[]>([]);
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
  /** Default ON: when budget slider is narrowed, still show gigs with no numeric budget */
  const [includeTbcBudgets, setIncludeTbcBudgets] = useState(true);
  const [locationsListExpanded, setLocationsListExpanded] = useState(false);
  const [industriesListExpanded, setIndustriesListExpanded] = useState(false);
  const [roleTypesListExpanded, setRoleTypesListExpanded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
    try {
      setLoading(true);
      
      const userData = await getCurrentUser();
      if (!userData) {
        setLoading(false);
        setProjects([]);
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

      // Load gigs via Netlify aggregator (redacted DTOs); skills & industries from Supabase
      const { data: { session: gigsSession } } = await supabase.auth.getSession();
      const token = gigsSession?.access_token;

      const [gigsListResponse, skillsResult, industriesResult] = await Promise.all([
        fetch('/.netlify/functions/professional-gigs-list', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        supabase.from('skills').select('id, name').order('name'),
        supabase.from('industries').select('id, name, category').order('name'),
      ]);

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

      let processedProjects: Project[] = [];

      if (!gigsListResponse.ok) {
        const errText = await gigsListResponse.text();
        console.error('professional-gigs-list failed:', gigsListResponse.status, errText);
        setProjects([]);
        setUserBids(new Set());
        setGigsListMeta(null);
      } else {
        const gigsPayload = await gigsListResponse.json();
        setGigsListMeta(gigsPayload.meta ?? null);
        processedProjects = (gigsPayload.gigs || []).map((g: Record<string, unknown>) => {
          const p = g as unknown as Project;
          return {
            ...p,
            screening_questions: Array.isArray(g.screening_questions)
              ? (g.screening_questions as string[])
              : [],
          };
        });
        const bidIds = new Set(
          processedProjects.filter((p) => p.hasBidSubmitted).map((p) => p.id)
        );
        setUserBids(bidIds);
        setProjects(processedProjects);
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

  /** Display label for a DB `role_type` value; option lists are always derived from loaded gigs */
  const formatRoleTypeLabel = (value: string) => {
    const key = value.trim().toLowerCase().replace(/[\s_]+/g, '-');
    const map: Record<string, string> = {
      'in-person': 'In-person',
      inperson: 'In-person',
      'in_person': 'In-person',
      hybrid: 'Hybrid',
      remote: 'Remote',
    };
    if (map[key]) return map[key];
    const t = value.trim();
    return t || value;
  };

  /** Distinct non-empty Gig Location strings from loaded projects (sorted) */
  const distinctGigLocations = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) {
      const loc = p.gig_location != null ? String(p.gig_location).trim() : '';
      if (loc) set.add(loc);
    }
    return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [projects]);

  /** Distinct non-empty role_type values from loaded projects (sorted) */
  const distinctRoleTypes = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) {
      const rt = p.role_type != null ? String(p.role_type).trim() : '';
      if (rt) set.add(rt);
    }
    return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [projects]);

  /**
   * Consultant profile stores `user_skills.skill_id` (numeric) but `consultant_profiles.industries`
   * is saved as industry *names* (see BasicInfoForm). Gigs use numeric industry IDs. Normalize
   * profile industries to IDs via the loaded catalog so matching works.
   */
  const matchUserSkillIdSet = useMemo(() => {
    const ids = userSkills
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));
    return new Set(ids);
  }, [userSkills]);

  const matchUserIndustryIdSet = useMemo(() => {
    const ids: number[] = [];
    for (const ref of userIndustries) {
      if (typeof ref === 'number' && !Number.isNaN(ref)) {
        ids.push(ref);
        continue;
      }
      if (typeof ref === 'string') {
        const t = ref.trim();
        if (!t) continue;
        const asNum = Number(t);
        if (!Number.isNaN(asNum) && String(asNum) === t) {
          ids.push(asNum);
          continue;
        }
        if (industries.length > 0) {
          const found = industries.find((i) => i.name.toLowerCase() === t.toLowerCase());
          if (found) ids.push(found.id);
        }
      }
    }
    return new Set(ids);
  }, [userIndustries, industries]);

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

    if (matchUserSkillIdSet.size === 0 && matchUserIndustryIdSet.size === 0) {
      return null;
    }

    const projSkills = project.skills_required || [];
    const projIndustries = project.industries || [];

    const skillPoints = projSkills.filter((skillId) =>
      matchUserSkillIdSet.has(Number(skillId))
    ).length;
    const industryPoints = projIndustries.filter((industryId) =>
      matchUserIndustryIdSet.has(Number(industryId))
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

  /** Count of active refinements (chips + summary) — excludes default “active only”; locations/roles/industries count per selection */
  const optionalFilterCount = useMemo(() => {
    let n = 0;
    if (searchTerm.trim().length > 0) n += 1;
    n += selectedLocations.length;
    n += selectedRoleTypes.length;
    n += selectedIndustries.length;
    if (isBudgetNarrowed) n += 1;
    if (isBudgetNarrowed && !includeTbcBudgets) n += 1;
    if (originFilter !== 'all') n += 1;
    if (showBidsOnly) n += 1;
    if (!showActiveOnly) n += 1; // user turned off default active-only
    return n;
  }, [
    searchTerm,
    selectedLocations,
    selectedRoleTypes,
    selectedIndustries,
    isBudgetNarrowed,
    includeTbcBudgets,
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

      if (selectedLocations.length > 0) {
        const loc =
          project.gig_location != null ? String(project.gig_location).trim() : '';
        if (!loc || !selectedLocations.includes(loc)) return false;
      }

      if (selectedRoleTypes.length > 0) {
        const rt = project.role_type != null ? String(project.role_type).trim() : '';
        if (!rt || !selectedRoleTypes.includes(rt)) return false;
      }

      if (selectedIndustries.length > 0) {
        const matchesIndustries =
          project.industries &&
          selectedIndustries.some((industryId) => project.industries!.includes(industryId));
        if (!matchesIndustries) return false;
      }

      if (isBudgetNarrowed) {
        const hasBudget = projectHasNumericBudget(project);
        if (!hasBudget) {
          if (!includeTbcBudgets) return false;
        } else {
          const overlaps =
            project.budget_min <= hourlyRateRange[1] && project.budget_max >= hourlyRateRange[0];
          if (!overlaps) return false;
        }
      }

      return true;
    });
  }, [
    projects,
    searchTerm,
    selectedLocations,
    selectedRoleTypes,
    selectedIndustries,
    hourlyRateRange,
    originFilter,
    showActiveOnly,
    showBidsOnly,
    isBudgetNarrowed,
    includeTbcBudgets,
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
  }, [
    filteredProjects,
    sortMode,
    user,
    userSkills,
    userIndustries,
    industries,
    matchUserSkillIdSet,
    matchUserIndustryIdSet,
  ]);

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
    setSelectedLocations([]);
    setSelectedRoleTypes([]);
    setSelectedIndustries([]);
    setIncludeTbcBudgets(true);
    setHourlyRateRange([0, maxBudget]);
    setOriginFilter('all');
    setShowActiveOnly(true);
    setShowBidsOnly(false);
    setSortMode('best_match');
  };

  const visibleLocationRows = locationsListExpanded
    ? distinctGigLocations
    : distinctGigLocations.slice(0, 8);
  const visibleIndustryRows = industriesListExpanded
    ? projectIndustries
    : projectIndustries.slice(0, 8);
  const visibleRoleTypeRows = roleTypesListExpanded
    ? distinctRoleTypes
    : distinctRoleTypes.slice(0, 8);

  const handleSelectAllIndustries = (checked: boolean) => {
    if (checked) {
      setSelectedIndustries(projectIndustries.map((i) => i.id));
    } else {
      setSelectedIndustries([]);
    }
  };

  const handleSelectAllLocations = (checked: boolean) => {
    if (checked) {
      setSelectedLocations([...distinctGigLocations]);
    } else {
      setSelectedLocations([]);
    }
  };

  const handleSelectAllRoleTypes = (checked: boolean) => {
    if (checked) {
      setSelectedRoleTypes([...distinctRoleTypes]);
    } else {
      setSelectedRoleTypes([]);
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
      <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 py-8">
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
          <Card className="mb-6 w-full min-w-0 max-w-full overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="min-w-0 space-y-4">
                {/* Search Bar */}
                <div className="min-w-0 space-y-2">
                  <div className="relative w-full min-w-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search by role, skill, company, or keyword"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full min-w-0 max-w-full pl-10"
                      aria-label="Search engagements"
                    />
                  </div>
                  <p className="break-words text-xs text-slate-500">
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
                      {/* 1. Location (from Gig Location on loaded gigs) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Location
                          </h3>
                          {distinctGigLocations.length > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() =>
                                handleSelectAllLocations(
                                  selectedLocations.length !== distinctGigLocations.length
                                )
                              }
                            >
                              {selectedLocations.length === distinctGigLocations.length &&
                              distinctGigLocations.length > 0
                                ? 'Deselect all'
                                : 'Select all'}
                            </Button>
                          )}
                        </div>
                        <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-slate-100 bg-white p-2">
                          {distinctGigLocations.length === 0 ? (
                            <p className="text-sm text-slate-500">No locations on loaded gigs yet.</p>
                          ) : (
                            visibleLocationRows.map((loc) => (
                              <div key={`loc-${loc}`} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`gig-location-${distinctGigLocations.indexOf(loc)}`}
                                  checked={selectedLocations.includes(loc)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedLocations([...selectedLocations, loc]);
                                    } else {
                                      setSelectedLocations(
                                        selectedLocations.filter((s) => s !== loc)
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`gig-location-${distinctGigLocations.indexOf(loc)}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {loc}
                                </label>
                              </div>
                            ))
                          )}
                        </div>
                        {distinctGigLocations.length > 8 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-slate-600"
                            onClick={() => setLocationsListExpanded((v) => !v)}
                          >
                            {locationsListExpanded ? 'Show less' : 'Show more'}
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

                    {/* Role type (distinct role_type values from loaded gigs) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Role type
                        </h3>
                        {distinctRoleTypes.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() =>
                              handleSelectAllRoleTypes(
                                selectedRoleTypes.length !== distinctRoleTypes.length
                              )
                            }
                          >
                            {selectedRoleTypes.length === distinctRoleTypes.length &&
                            distinctRoleTypes.length > 0
                              ? 'Deselect all'
                              : 'Select all'}
                          </Button>
                        )}
                      </div>
                      <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-slate-100 bg-white p-2">
                        {distinctRoleTypes.length === 0 ? (
                          <p className="text-sm text-slate-500">No role types on loaded gigs yet.</p>
                        ) : (
                          visibleRoleTypeRows.map((rt) => (
                            <div key={`rt-${rt}`} className="flex items-center space-x-2">
                              <Checkbox
                                id={`role-type-${distinctRoleTypes.indexOf(rt)}`}
                                checked={selectedRoleTypes.includes(rt)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedRoleTypes([...selectedRoleTypes, rt]);
                                  } else {
                                    setSelectedRoleTypes(
                                      selectedRoleTypes.filter((s) => s !== rt)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`role-type-${distinctRoleTypes.indexOf(rt)}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {formatRoleTypeLabel(rt)}
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                      {distinctRoleTypes.length > 8 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-slate-600"
                          onClick={() => setRoleTypesListExpanded((v) => !v)}
                        >
                          {roleTypesListExpanded ? 'Show less' : 'Show more'}
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      {/* 3. Engagement details */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Engagement details
                        </h3>
                        <div className="space-y-3 rounded-md border border-slate-100 bg-white p-3">
                          <div>
                            <div className="mb-2 flex items-center gap-1.5">
                              <p className="text-sm font-medium text-slate-800">Budget</p>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex shrink-0 touch-manipulation rounded-full text-slate-400 outline-none ring-offset-2 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-slate-400"
                                    aria-label="What does budget mean?"
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
                                  <p className="text-slate-600 leading-snug">Total Gig Budget</p>
                                </PopoverContent>
                              </Popover>
                            </div>
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
                            <div className="mt-3 flex items-start space-x-2 border-t border-slate-100 pt-3">
                              <Checkbox
                                id="include-tbc-budgets"
                                checked={includeTbcBudgets}
                                onCheckedChange={(checked) =>
                                  setIncludeTbcBudgets(Boolean(checked))
                                }
                                className="mt-0.5"
                              />
                              <div>
                                <Label htmlFor="include-tbc-budgets" className="text-sm">
                                  Include Unspecified / TBC budgets
                                </Label>
                                <p className="mt-1 text-xs text-slate-500">
                                  When off and the budget range is narrowed, engagements without a
                                  numeric budget are hidden.
                                </p>
                              </div>
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
          <div className="mb-6 min-w-0 space-y-3">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 break-words text-slate-700">{resultsSummaryText}</p>
              <div className="flex min-w-0 shrink-0 items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Sort
                </span>
                <Select
                  value={sortMode}
                  onValueChange={(v) => setSortMode(v as 'best_match' | 'most_recent')}
                >
                  <SelectTrigger className="h-9 w-full min-w-0 max-w-[180px] border-slate-200 bg-white text-sm sm:w-[180px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best_match">Best match</SelectItem>
                    <SelectItem value="most_recent">Most recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="flex min-w-0 flex-1 flex-wrap gap-2 break-words">
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
                      onClick={() => {
                        setHourlyRateRange([0, maxBudget]);
                        setIncludeTbcBudgets(true);
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                )}
                {isBudgetNarrowed && !includeTbcBudgets && (
                  <Badge
                    variant="secondary"
                    className="flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    <span className="truncate">TBC / unspecified budgets excluded</span>
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label="Include TBC and unspecified budgets again"
                      onClick={() => setIncludeTbcBudgets(true)}
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
                {selectedLocations.map((loc) => (
                  <Badge
                    key={`loc-chip-${loc}`}
                    variant="secondary"
                    className="flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    <span className="truncate">Location: {loc}</span>
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label={`Remove location ${loc}`}
                      onClick={() =>
                        setSelectedLocations((prev) => prev.filter((s) => s !== loc))
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
                {selectedRoleTypes.map((rt) => (
                  <Badge
                    key={`rt-chip-${rt}`}
                    variant="secondary"
                    className="flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-normal text-slate-800 shadow-sm"
                  >
                    <span className="truncate">Role: {formatRoleTypeLabel(rt)}</span>
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label={`Remove role type ${formatRoleTypeLabel(rt)}`}
                      onClick={() =>
                        setSelectedRoleTypes((prev) => prev.filter((s) => s !== rt))
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
            <Card className="w-full min-w-0 max-w-full overflow-hidden">
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
            <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedProjects.map((project) => {
                const isExternal = project.project_origin === 'external';
                const isExpired =
                  project.is_expired ??
                  (project.expires_at
                    ? new Date(project.expires_at).getTime() <= Date.now()
                    : false);
                const hasExternalLink = Boolean(project.external_url);
                const consultantApplyGate =
                  user?.role === 'consultant' && gigsListMeta
                    ? {
                        basicProfileComplete: !!gigsListMeta.basic_profile_complete,
                        subscriptionAccess: !!gigsListMeta.subscription_content_access,
                      }
                    : user?.role === 'consultant'
                      ? { basicProfileComplete: false, subscriptionAccess: false }
                      : undefined;
                const applyEnabled =
                  isExternal &&
                  hasExternalLink &&
                  canApplyExternally(project, consultantApplyGate);
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
                <Card key={project.id} className="w-full min-w-0 max-w-full overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="min-w-0 overflow-hidden">
                    <div className="mb-4 flex min-w-0 items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
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
                        <div className="min-w-0 flex-1">
                          <h3 className="break-words font-semibold text-slate-900">
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
                        </div>
                      </div>
                        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
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
                    
                      <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
                        <CardTitle className="min-w-0 flex-1 pr-1 text-lg leading-snug line-clamp-2">{project.title}</CardTitle>
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
                                  : 'Possible Match'}
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
                  
                  <CardContent className="min-w-0 overflow-hidden">
                    <div className="min-w-0 space-y-4">
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
