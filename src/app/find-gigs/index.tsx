import { useState, useEffect } from 'react';
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
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<number[]>([]);
  const [hourlyRateRange, setHourlyRateRange] = useState<[number, number]>([0, 0]);
  const [maxBudget, setMaxBudget] = useState<number>(1000000);
  const [showFilters, setShowFilters] = useState(false);
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
      setUser(userData);

      // Load user's skills and industries for match calculation
      if (userData.userType === 'consultant') {
        const [userSkillsResult, userIndustriesResult] = await Promise.all([
          supabase
            .from('user_skills')
            .select('skill_id')
            .eq('user_id', userData.id),
          supabase
            .from('consultant_profiles')
            .select('industries')
            .eq('user_id', userData.id)
            .single()
        ]);

        if (userSkillsResult.data) {
          setUserSkills(userSkillsResult.data.map(us => us.skill_id));
        }

        if (userIndustriesResult.data?.industries) {
          setUserIndustries(userIndustriesResult.data.industries);
        }
      }

      // Load projects, skills, and industries in parallel
      const [projectsResult, skillsResult, industriesResult] = await Promise.all([
        supabase
          .from('projects')
          .select(`
            *,
            users!projects_creator_id_fkey (
              first_name,
              last_name,
              client_profiles (
                company_name,
                logo_url
              )
            )
          `)
          .eq('status', 'open')
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

      console.log('🔍 Projects loaded:', projectsResult.data);

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

      // Process projects data
      const processedProjects = (projectsResult.data || []).map(project => {
        let skills_required = [];
        try {
          skills_required = project.skills_required ? JSON.parse(project.skills_required) : [];
        } catch (error) {
          console.error('Error parsing skills_required for project', project.id, error);
          skills_required = [];
        }

        // Get client profile data safely
        const clientProfile = project.users?.client_profiles?.[0] || {};
        const clientData = project.users || {};
        
        // Debug client data
        console.log('🔍 Client data for project', project.id, ':', {
          users: project.users,
          client_profiles: project.users?.client_profiles,
          clientProfile,
          clientData
        });
        
        // Only show ratings if they exist in the database (no hardcoded values)
        const clientRating = clientProfile.rating || null;
        const totalRatings = clientProfile.total_ratings || null;

        return {
          ...project,
          skills_required,
          client: {
            first_name: clientData.first_name || '',
            last_name: clientData.last_name || '',
            company_name: clientProfile.company_name || null,
            logo_url: clientProfile.logo_url || null,
            verified: clientProfile.verified || false,
            rating: clientRating,
            total_ratings: totalRatings
          }
        };
      });

      setProjects(processedProjects);

      // Calculate dynamic budget range based on loaded projects
      if (processedProjects.length > 0) {
        const maxProjectBudget = Math.max(...processedProjects.map(p => p.budget_max));
        const minProjectBudget = Math.min(...processedProjects.map(p => p.budget_min));
        setMaxBudget(maxProjectBudget);
        setHourlyRateRange([minProjectBudget, maxProjectBudget]);
        console.log('🔍 Dynamic budget range set:', { min: minProjectBudget, max: maxProjectBudget });
      }
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

  const getIndustryName = (industryId: number) => {
    const industry = industries.find(i => i.id === industryId);
    return industry ? industry.name : `Industry ${industryId}`;
  };

  const calculateMatchQuality = (project: Project) => {
    if (user.userType !== 'consultant') {
      return null; // No match calculation for non-consultants
    }

    const projectSkills = project.skills_required || [];
    const projectIndustries = project.industries || [];
    
    // Calculate skill match percentage
    const skillMatches = projectSkills.filter(skillId => userSkills.includes(skillId)).length;
    const skillMatchPercentage = projectSkills.length > 0 ? (skillMatches / projectSkills.length) * 100 : 0;
    
    // Calculate industry match percentage
    const industryMatches = projectIndustries.filter(industryId => userIndustries.includes(industryId)).length;
    const industryMatchPercentage = projectIndustries.length > 0 ? (industryMatches / projectIndustries.length) * 100 : 0;
    
    // Calculate overall match (weighted: 70% skills, 30% industries)
    const overallMatch = (skillMatchPercentage * 0.7) + (industryMatchPercentage * 0.3);
    
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
  const hasActiveFilters = searchTerm.length > 0 || 
                          selectedSkills.length > 0 || 
                          selectedIndustries.length > 0 || 
                          (hourlyRateRange[0] !== 0 || hourlyRateRange[1] !== maxBudget);

  const filteredProjects = projects.filter(project => {
    // If no active filters, show all projects
    if (!hasActiveFilters) {
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
    
    // More flexible rate matching - project budget should overlap with filter range
    const matchesRate = selectedSkills.length === 0 && selectedIndustries.length === 0 && searchTerm.length === 0 ? true :
                       project.budget_min <= hourlyRateRange[1] && project.budget_max >= hourlyRateRange[0];
    
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
      matchesSearch,
      matchesSkills,
      matchesIndustries,
      matchesRate,
      selectedSkills,
      projectSkills: project.skills_required,
      selectedIndustries,
      projectIndustries: project.industries,
      hourlyRateRange,
      projectBudget: { min: project.budget_min, max: project.budget_max },
      searchTerm,
      finalResult: matchesSearch && matchesSkills && matchesIndustries && matchesRate
    });
    
    return matchesSearch && matchesSkills && matchesIndustries && matchesRate;
  }).sort((a, b) => {
    // Sort by match quality: Excellent → Good → Partial → Low
    if (user?.userType !== 'consultant') {
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
  });

  // Debug summary
  console.log('🔍 Filtering summary:', {
    totalProjects: projects.length,
    filteredProjects: filteredProjects.length,
    hasActiveFilters,
    selectedSkills: selectedSkills.length,
    selectedIndustries: selectedIndustries.length,
    searchTerm,
    hourlyRateRange,
    maxBudget,
    userType: user?.userType
  });
  
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
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Skills Filter */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Skills Required</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {skills.slice(0, 20).map((skill) => (
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
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>$0</span>
                        <span>{formatCurrency(maxBudget, 'USD')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-slate-600">
              Showing {filteredProjects.length} of {projects.length} available gigs
            </p>
          </div>

          {/* Gigs Grid */}
          {filteredProjects.length === 0 ? (
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
                  }}>
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                          {project.client?.logo_url ? (
                            <img
                              src={project.client.logo_url}
                              alt={project.client.company_name || 'Company Logo'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {project.client?.company_name || 
                             (project.client?.first_name && project.client?.last_name ? 
                              `${project.client.first_name} ${project.client.last_name}` : 
                              'Unknown Client')}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {project.client?.verified && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">Verified</span>
                              </div>
                            )}
                            {project.client?.rating && project.client?.total_ratings ? (
                              renderStars(project.client.rating)
                            ) : (
                              <span className="text-sm text-slate-500">No ratings yet</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(project.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-2 flex-1">{project.title}</CardTitle>
                      {user?.userType === 'consultant' && (() => {
                        const match = calculateMatchQuality(project);
                        return match ? (
                          <Badge 
                            variant="outline" 
                            className={`ml-2 text-xs ${
                              match.color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                              match.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              match.color === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {match.level === 'excellent' ? 'Excellent Match' :
                             match.level === 'good' ? 'Good Match' :
                             match.level === 'partial' ? 'Partial Match' : 'Low Match'} ({match.percentage}%)
                          </Badge>
                        ) : null;
                      })()}
                    </div>
                    <CardDescription className="line-clamp-3">
                      {project.description.length > 500 
                        ? `${project.description.substring(0, 500)}...`
                        : project.description
                      }
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* About Gig */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-900 text-sm">About Gig:</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              {formatCurrency(project.budget_min, project.currency)}
                              {project.budget_max !== project.budget_min && 
                                ` - ${formatCurrency(project.budget_max, project.currency)}`
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(project.delivery_time_min, project.delivery_time_max)}</span>
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
                          <h4 className="font-semibold text-slate-900 text-sm mb-2">Skills Required:</h4>
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

                      {/* View Details Button */}
                      <div className="pt-4 border-t border-slate-200">
                        <Button asChild className="w-full">
                          <Link to={`/find-gigs/${project.id}`}>
                            View Gig Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
