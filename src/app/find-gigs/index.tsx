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
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
  industries?: number[];
  project_origin?: 'internal' | 'external';
  external_url?: string | null;
  expires_at?: string | null;
  source_name?: string | null;
  is_expired?: boolean;
  is_active?: boolean;
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
  const [projectSkills, setProjectSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<number[]>([]);
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
  const [hourlyRateRange, setHourlyRateRange] = useState<[number, number]>([0, 0]);
  const [maxBudget, setMaxBudget] = useState<number>(1000000);
  const [showFilters, setShowFilters] = useState(false);
  const [originFilter, setOriginFilter] = useState<'all' | 'internal' | 'external'>('all');
  const [userSkills, setUserSkills] = useState<number[]>([]);
  const [userIndustries, setUserIndustries] = useState<number[]>([]);

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
      
      // Get the current session to get the JWT token
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Client data session:', session);
      console.log('🔍 Client data access token:', session?.access_token);
      
      let users: any[] = [];
      let clientProfiles: any[] = [];

      if (creatorIds.length > 0) {
      const clientDataResponse = await fetch('/.netlify/functions/get-client-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
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
          client: clientInfo
        };
      });

      setProjects(processedProjects);

      // Calculate dynamic budget range based on loaded projects
      if (processedProjects.length > 0) {
        const budgetValues = processedProjects
          .flatMap((p) => [p.budget_min, p.budget_max])
          .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));

        if (budgetValues.length > 0) {
          const minBudget = Math.min(...budgetValues);
          const maxBudgetValue = Math.max(...budgetValues);
          setMaxBudget(maxBudgetValue);
          setHourlyRateRange([minBudget, maxBudgetValue]);
          console.log('🔍 Dynamic budget range set:', { min: minBudget, max: maxBudgetValue });
        } else {
          setMaxBudget(0);
          setHourlyRateRange([0, 0]);
          console.log('🔍 Dynamic budget range set to defaults (no numeric budgets found).');
        }
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

  const calculateMatchQuality = (project: Project) => {
    if (!user || user.role !== 'consultant') {
      console.log('🔍 No match calculation - user not consultant:', { user, role: user?.role });
      return null; // No match calculation for non-consultants
    }

    if (userSkills.length === 0 && userIndustries.length === 0) {
      console.log('🔍 No match calculation - user skills/industries not loaded yet');
      return null;
    }

    const projectSkills = project.skills_required || [];
    const projectIndustries = project.industries || [];
    
    console.log('🔍 Match calculation for project', project.id, ':');
    console.log('  - userSkillsCount:', userSkills.length);
    console.log('  - userIndustriesCount:', userIndustries.length);
    console.log('  - projectSkillsCount:', projectSkills.length);
    console.log('  - projectIndustriesCount:', projectIndustries.length);
    console.log('  - userSkills:', userSkills);
    console.log('  - userIndustries:', userIndustries);
    console.log('  - projectSkills:', projectSkills);
    console.log('  - projectIndustries:', projectIndustries);
    console.log('  - userType:', user?.userType);
    console.log('  - hasUser:', !!user);
    console.log('  - userSkillsLoaded:', userSkills.length > 0);
    console.log('  - userIndustriesLoaded:', userIndustries.length > 0);
    
    // Calculate skill match percentage
    const skillMatches = projectSkills.filter(skillId => userSkills.includes(skillId)).length;
    const skillMatchPercentage = projectSkills.length > 0 ? (skillMatches / projectSkills.length) * 100 : 0;
    
    // Calculate industry match percentage
    const industryMatches = projectIndustries.filter(industryId => userIndustries.includes(industryId)).length;
    const industryMatchPercentage = projectIndustries.length > 0 ? (industryMatches / projectIndustries.length) * 100 : 0;
    
    // Calculate overall match (weighted: 70% skills, 30% industries)
    const overallMatch = (skillMatchPercentage * 0.7) + (industryMatchPercentage * 0.3);
    
    console.log('🔍 Match calculation result:', {
      skillMatches: skillMatches,
      skillMatchPercentage: skillMatchPercentage,
      industryMatches: industryMatches,
      industryMatchPercentage: industryMatchPercentage,
      overallMatch: overallMatch
    });
    
    // Determine match quality
    if (overallMatch >= 80) return { level: 'excellent', percentage: Math.round(overallMatch), color: 'green' };
    if (overallMatch >= 60) return { level: 'good', percentage: Math.round(overallMatch), color: 'blue' };
    if (overallMatch >= 30) return { level: 'partial', percentage: Math.round(overallMatch), color: 'yellow' };
    return { level: 'low', percentage: Math.round(overallMatch), color: 'gray' };
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

  // Check if any filters are actively applied (not default values)
  const hasActiveFilters = useMemo(() => {
    const hasSearch = searchTerm.length > 0;
    const hasSkills = selectedSkills.length > 0;
    const hasIndustries = selectedIndustries.length > 0;
    const hasBudgetFilter = hourlyRateRange[0] > 0 || hourlyRateRange[1] < maxBudget;
    const hasOriginFilter = originFilter !== 'all';
    const hasActiveToggle = showActiveOnly;
    
    console.log('🔍 Filter check:');
    console.log('  - hasSearch:', hasSearch);
    console.log('  - hasSkills:', hasSkills);
    console.log('  - hasIndustries:', hasIndustries);
    console.log('  - hasBudgetFilter:', hasBudgetFilter);
    console.log('  - hasOriginFilter:', hasOriginFilter);
    console.log('  - showActiveOnly:', showActiveOnly);
    console.log('  - searchTerm:', searchTerm);
    console.log('  - selectedSkills:', selectedSkills);
    console.log('  - selectedIndustries:', selectedIndustries);
    console.log('  - hourlyRateRange:', hourlyRateRange);
    console.log('  - maxBudget:', maxBudget);
    console.log('  - hourlyRateRange[0] !== 0:', hourlyRateRange[0] !== 0);
    console.log('  - hourlyRateRange[1] !== maxBudget:', hourlyRateRange[1] !== maxBudget);
    
    return (
      hasSearch ||
      hasSkills ||
      hasIndustries ||
      hasBudgetFilter ||
      hasOriginFilter ||
      hasActiveToggle
    );
  }, [
    searchTerm,
    selectedSkills,
    selectedIndustries,
    hourlyRateRange,
    maxBudget,
    originFilter,
    showActiveOnly
  ]);

  const filteredProjects = useMemo(() => {
    console.log('🔍 Starting filtering with:');
    console.log('  - totalProjects:', projects.length);
    console.log('  - hasActiveFilters:', hasActiveFilters);
    console.log('  - searchTerm:', searchTerm);
    console.log('  - selectedSkills:', selectedSkills);
    console.log('  - selectedIndustries:', selectedIndustries);
    console.log('  - hourlyRateRange:', hourlyRateRange);

    return projects.filter(project => {
      const projectOrigin = project.project_origin === 'external' ? 'external' : 'internal';
      const matchesOrigin =
        originFilter === 'all' ||
        (originFilter === 'external' && projectOrigin === 'external') ||
        (originFilter === 'internal' && projectOrigin === 'internal');

      if (!matchesOrigin) {
        console.log('🔍 Excluding project due to origin filter:', {
          id: project.id,
          originFilter,
          projectOrigin
        });
        return false;
      }

      const isActive = project.is_active ?? (project.status === 'open' && !project.is_expired);
      if (showActiveOnly && !isActive) {
        console.log('🔍 Excluding project due to active-only toggle:', {
          id: project.id,
          status: project.status,
          isExpired: project.is_expired,
          computedActive: isActive
        });
        return false;
      }
 
      // If no active filters, show all projects
      if (!hasActiveFilters) {
        console.log('🔍 No active filters, showing project', project.id);
        return true;
      }

    const matchesSearch = searchTerm.length === 0 || 
                         project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skillId => project.skills_required.includes(skillId));
    
    const matchesIndustries = selectedIndustries.length === 0 || 
                             (project.industries && selectedIndustries.some(industryId => project.industries.includes(industryId)));
    
    // Budget matching - project budget should overlap with filter range
    const hasBudget =
      typeof project.budget_min === 'number' && !Number.isNaN(project.budget_min) &&
      typeof project.budget_max === 'number' && !Number.isNaN(project.budget_max);
    const matchesRate = !hasBudget
      ? true
      : project.budget_min <= hourlyRateRange[1] && project.budget_max >= hourlyRateRange[0];
    
    // Additional debug for rate matching
    console.log('🔍 Rate matching for project', project.id, ':', {
      projectBudget: { min: project.budget_min, max: project.budget_max },
      filterRange: hourlyRateRange,
      matchesRate,
      condition1: project.budget_min <= hourlyRateRange[1],
      condition2: project.budget_max >= hourlyRateRange[0]
    });
    
    // Debug logging
    console.log('🔍 Filtering project:', {
      id: project.id,
      title: project.title,
      projectOrigin,
      matchesOrigin,
      matchesSearch,
      matchesSkills,
      matchesIndustries,
      matchesRate,
      showActiveOnly,
      isActive,
      selectedSkills: selectedSkills,
      projectSkills: project.skills_required,
      selectedIndustries: selectedIndustries,
      projectIndustries: project.industries,
      hourlyRateRange: hourlyRateRange,
      projectBudget: { min: project.budget_min, max: project.budget_max },
      searchTerm: searchTerm,
      finalResult: matchesSearch && matchesSkills && matchesIndustries && matchesRate
    });
    
    return matchesSearch && matchesSkills && matchesIndustries && matchesRate;
    });
  }, [projects, hasActiveFilters, searchTerm, selectedSkills, selectedIndustries, hourlyRateRange, user, userSkills, userIndustries, originFilter, showActiveOnly]);

  const sortedProjects = useMemo(() => [...filteredProjects].sort((a, b) => {
    // Sort by match quality: Excellent → Good → Partial → Low
    if (user?.role !== 'consultant') {
      return 0; // No sorting for non-consultants
    }

    const matchA = calculateMatchQuality(a);
    const matchB = calculateMatchQuality(b);

    if (!matchA && !matchB) return 0;
    if (!matchA) return 1;
    if (!matchB) return -1;

    const qualityOrder = { excellent: 0, good: 1, partial: 2, low: 3 };
    const orderA = qualityOrder[matchA.level as keyof typeof qualityOrder];
    const orderB = qualityOrder[matchB.level as keyof typeof qualityOrder];

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // If same quality level, sort by percentage (higher first)
    return matchB.percentage - matchA.percentage;
  }), [filteredProjects, user, userSkills, userIndustries]);

  // Debug summary
  console.log('🔍 Filtering summary:');
  console.log('  - totalProjects:', projects.length);
  console.log('  - filteredProjects:', filteredProjects.length);
  console.log('  - sortedProjects:', sortedProjects.length);
  console.log('  - hasActiveFilters:', hasActiveFilters);
  console.log('  - selectedSkills:', selectedSkills.length);
  console.log('  - selectedIndustries:', selectedIndustries.length);
  console.log('  - searchTerm:', searchTerm);
  console.log('  - hourlyRateRange:', hourlyRateRange);
  console.log('  - maxBudget:', maxBudget);
  console.log('  - userType:', user?.userType);
  
  // Log each project's data structure
  console.log('🔍 All projects data:', projects.map(p => ({
    id: p.id,
    title: p.title,
    status: p.status,
    budget_min: p.budget_min,
    budget_max: p.budget_max,
    skills_required: p.skills_required,
    industries: p.industries
  })));

  const handleSelectAllIndustries = (checked: boolean) => {
    if (checked) {
      setSelectedIndustries(industries.map(i => i.id));
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
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search gigs by title, description, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="grid gap-6 md:grid-cols-4">
                    {/* Skills Filter */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Skills Required</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {projectSkills.map((skill) => (
                          <div key={skill.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`skill-${skill.id}`}
                              checked={selectedSkills.includes(skill.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSkills([...selectedSkills, skill.id]);
                                } else {
                                  setSelectedSkills(selectedSkills.filter(id => id !== skill.id));
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
                    </div>

                    {/* Industries Filter */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">Industries</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectAllIndustries(selectedIndustries.length !== industries.length)}
                        >
                          {selectedIndustries.length === industries.length ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {industries.map((industry) => (
                          <div key={industry.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`industry-${industry.id}`}
                              checked={selectedIndustries.includes(industry.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedIndustries([...selectedIndustries, industry.id]);
                                } else {
                                  setSelectedIndustries(selectedIndustries.filter(id => id !== industry.id));
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
                    </div>

                    {/* Hourly Rate Filter */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">
                        Budget Range: {formatCurrency(hourlyRateRange[0], 'USD')} - {formatCurrency(hourlyRateRange[1], 'USD')}
                      </h3>
                      <Slider
                        value={hourlyRateRange}
                        onValueChange={setHourlyRateRange}
                        max={maxBudget}
                        min={0}
                        step={Math.max(100, Math.floor(maxBudget / 100))}
                        className="w-full"
                        minStepsBetweenThumbs={1}
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>$0</span>
                        <span>{formatCurrency(maxBudget, 'USD')}</span>
                      </div>
                    </div>

                    {/* Origin Filter */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Origin</h3>
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
                          <Label htmlFor="origin-internal" className="text-sm">
                            Internal gigs
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="external" id="origin-external" />
                          <Label htmlFor="origin-external" className="text-sm">
                            External gigs
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="active-only-toggle"
                          checked={showActiveOnly}
                          onCheckedChange={(checked) => setShowActiveOnly(Boolean(checked))}
                        />
                        <Label htmlFor="active-only-toggle" className="text-sm">
                          Show active gigs only
                        </Label>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Hide gigs that are already filled, cancelled, or past their expiry date.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Reset Filters Button */}
                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSkills([]);
                      setSelectedIndustries([]);
                      setHourlyRateRange([0, maxBudget]);
                      setOriginFilter('all');
                      setShowActiveOnly(false);
                    }}
                    className="text-sm"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-slate-600">
              Showing {sortedProjects.length} of {projects.length} available gigs
            </p>
          </div>

          {/* Gigs Grid */}
          {sortedProjects.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {projects.length === 0 ? 'No gigs available' : 'No gigs match your filters'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {projects.length === 0 
                    ? 'Check back later for new opportunities.'
                    : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  }
                </p>
                {projects.length > 0 && (
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setSelectedSkills([]);
                    setSelectedIndustries([]);
                    setHourlyRateRange([0, maxBudget]);
                    setOriginFilter('all');
                    setShowActiveOnly(false);
                  }}>
                    Clear All Filters
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
                        <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                            {createdAtLabel}
                      </Badge>
                          {isExternal && (
                            <Badge className="text-xs border-blue-200 bg-blue-50 text-blue-700">
                              External
                            </Badge>
                          )}
                        </div>
                    </div>
                    
                      <div className="mb-2 flex items-start justify-between">
                        <CardTitle className="flex-1 text-lg line-clamp-2">{project.title}</CardTitle>
                      {user?.role === 'consultant' && (() => {
                        const match = calculateMatchQuality(project);
                        console.log('🔍 Match badge for project', project.id, ':', match);
                        return match ? (
                          <Badge 
                            variant="outline" 
                            className={`ml-2 text-xs ${
                                match.color === 'green'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : match.color === 'blue'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : match.color === 'yellow'
                                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                      : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}
                            >
                              {match.level === 'excellent'
                                ? 'Excellent Match'
                                : match.level === 'good'
                                  ? 'Good Match'
                                  : match.level === 'partial'
                                    ? 'Partial Match'
                                    : 'Low Match'}{' '}
                              ({match.percentage}%)
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
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{budgetDisplay}</span>
                          </div>
                          <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{timelineDisplay}</span>
                          </div>
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
                              onClick={() => {
                                if (project.external_url && applyEnabled) {
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
