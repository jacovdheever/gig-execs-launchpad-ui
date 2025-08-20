import { useState, useEffect } from 'react';
import { ArrowLeft, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';

interface Skill {
  id: number;
  name: string;
}

interface Industry {
  id: number;
  name: string;
  category: string;
}

export default function OnboardingStep4() {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [industrySearch, setIndustrySearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Load available skills and industries on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load available skills
        const { data: skillsData } = await supabase
          .from('skills')
          .select('id, name')
          .order('name');

        if (skillsData) {
          setAvailableSkills(skillsData);
        }

        // Load available industries
        const { data: industriesData } = await supabase
          .from('industries')
          .select('id, name, category')
          .order('name');

        if (industriesData) {
          setAvailableIndustries(industriesData);
        }

        // Load user's existing selections
        const user = await getCurrentUser();
        if (user) {
          // Load existing skills
          const { data: userSkillsData } = await supabase
            .from('user_skills')
            .select('skill_id')
            .eq('user_id', user.id);

          if (userSkillsData && userSkillsData.length > 0) {
            const skillIds = userSkillsData.map(s => s.skill_id);
            const { data: skills } = await supabase
              .from('skills')
              .select('id, name')
              .in('id', skillIds);
            if (skills) {
              setSelectedSkills(skills);
            }
          }

          // Load existing industries
          const { data: userIndustriesData } = await supabase
            .from('user_industries')
            .select('industry_id')
            .eq('user_id', user.id);

          if (userIndustriesData && userIndustriesData.length > 0) {
            const industryIds = userIndustriesData.map(i => i.industry_id);
            const { data: industries } = await supabase
              .from('industries')
              .select('id, name, category')
              .in('id', industryIds);
            if (industries) {
              setSelectedIndustries(industries);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter skills based on search
  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.some(selected => selected.id === skill.id)
  );

  // Filter industries based on search
  const filteredIndustries = availableIndustries.filter(industry =>
    industry.name.toLowerCase().includes(industrySearch.toLowerCase()) &&
    !selectedIndustries.some(selected => selected.id === industry.id)
  );

  const addSkill = (skill: Skill) => {
    if (selectedSkills.length < 15) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillSearch('');
      setShowSkillDropdown(false);
    }
  };

  const removeSkill = (skillId: number) => {
    setSelectedSkills(selectedSkills.filter(skill => skill.id !== skillId));
  };

  const addIndustry = (industry: Industry) => {
    if (selectedIndustries.length < 5) {
      setSelectedIndustries([...selectedIndustries, industry]);
      setIndustrySearch('');
      setShowIndustryDropdown(false);
    }
  };

  const removeIndustry = (industryId: number) => {
    setSelectedIndustries(selectedIndustries.filter(industry => industry.id !== industryId));
  };

  const saveToSupabase = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.error('No user found');
        return;
      }

      setSaving(true);

      // Save skills
      if (selectedSkills.length > 0) {
        const skillData = selectedSkills.map(skill => ({
          user_id: user.id,
          skill_id: skill.id
        }));

        // First, remove all existing skills
        await supabase
          .from('user_skills')
          .delete()
          .eq('user_id', user.id);

        // Then insert new skills
        if (skillData.length > 0) {
          await supabase
            .from('user_skills')
            .insert(skillData);
        }
      }

      // Save industries
      if (selectedIndustries.length > 0) {
        const industryData = selectedIndustries.map(industry => ({
          user_id: user.id,
          industry_id: industry.id
        }));

        // First, remove all existing industries
        await supabase
          .from('user_industries')
          .delete()
          .eq('user_id', user.id);

        // Then insert new industries
        if (industryData.length > 0) {
          await supabase
            .from('user_industries')
            .insert(industryData);
        }
      }

      console.log('Skills and industries saved successfully');
    } catch (error) {
      console.error('Error saving skills and industries:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = async () => {
    await saveToSupabase();
    navigate('/onboarding/step5');
  };

  const handleBack = () => {
    navigate('/onboarding/step3');
  };

  const handleSkip = async () => {
    await saveToSupabase();
    navigate('/onboarding/step5');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-slate-600">Loading skills and industries...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="text-2xl font-bold text-[#012E46]">GigExecs</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Stepped Process Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 overflow-x-auto px-2 max-w-full">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center flex-shrink-0">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                  step === 4 
                    ? 'bg-[#012E46] text-white' 
                    : step < 4
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 6 && (
                  <div className={`w-6 sm:w-8 lg:w-12 h-1 mx-1 sm:mx-2 ${
                    step < 4 ? 'bg-green-500' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#012E46] mb-2">Your Skills and Industries</h1>
          <p className="text-slate-600">It's important to showcase the industries you've worked in and skills that you possess, to help potential clients understand what services you can offer them and the type of work you excel at.</p>
        </div>

        <div className="space-y-8">
          {/* Skills Section */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <Label className="text-lg font-semibold text-slate-900">
                  Add your skills <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-slate-600 mt-1">Maximum 15 skills</p>
              </div>
              
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Start typing to search..."
                    value={skillSearch}
                    onChange={(e) => {
                      setSkillSearch(e.target.value);
                      setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    className="pl-10"
                  />
                </div>
                
                {/* Skills Dropdown */}
                {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                      >
                        {skill.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Skills Pills */}
              {selectedSkills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-[#012E46] text-white px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>{skill.name}</span>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="hover:bg-blue-700 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedSkills.length >= 15 && (
                <p className="text-sm text-amber-600 mt-2">
                  Maximum of 15 skills reached
                </p>
              )}
            </CardContent>
          </Card>

          {/* Industries Section */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <Label className="text-lg font-semibold text-slate-900">
                  Add your Industries <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-slate-600 mt-1">Maximum 5 industries</p>
              </div>
              
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Start typing to search..."
                    value={industrySearch}
                    onChange={(e) => {
                      setIndustrySearch(e.target.value);
                      setShowIndustryDropdown(true);
                    }}
                    onFocus={() => setShowIndustryDropdown(true)}
                    className="pl-10"
                  />
                </div>
                
                {/* Industries Dropdown */}
                {showIndustryDropdown && industrySearch && filteredIndustries.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredIndustries.map((industry) => (
                      <button
                        key={industry.id}
                        onClick={() => addIndustry(industry)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                      >
                        <div>
                          <div className="font-medium">{industry.name}</div>
                          <div className="text-sm text-slate-500">{industry.category}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Industries Pills */}
              {selectedIndustries.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedIndustries.map((industry) => (
                    <div
                      key={industry.id}
                      className="bg-[#012E46] text-white px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>{industry.name}</span>
                      <button
                        onClick={() => removeIndustry(industry.id)}
                        className="hover:bg-blue-700 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedIndustries.length >= 5 && (
                <p className="text-sm text-amber-600 mt-2">
                  Maximum of 5 industries reached
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="px-6"
          >
            Back
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="px-6"
            >
              I'll do this later
            </Button>
            <Button
              onClick={handleContinue}
              disabled={saving || selectedSkills.length === 0 || selectedIndustries.length === 0}
              className="px-6"
            >
              {saving ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showSkillDropdown || showIndustryDropdown) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowSkillDropdown(false);
            setShowIndustryDropdown(false);
          }}
        />
      )}
    </div>
  );
}
