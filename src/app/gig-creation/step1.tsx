import { useState, useEffect } from 'react';
import { ArrowLeft, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface Skill {
  id: number;
  name: string;
}

export default function GigCreationStep1() {
  const [gigName, setGigName] = useState('');
  const [gigDescription, setGigDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load available skills on component mount
  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true);
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('id, name')
          .order('name');

        if (skillsError) {
          console.error('Error loading skills:', skillsError);
          return;
        }

        setAvailableSkills(skillsData || []);
      } catch (error) {
        console.error('Error loading skills:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  // Filter skills based on search
  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.some(selected => selected.id === skill.id)
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

  const isValid = gigName.trim() !== '' && 
                 gigDescription.trim() !== '' && 
                 gigDescription.length <= 2000 && 
                 selectedSkills.length > 0;

  const handleContinue = () => {
    if (!isValid) return;
    
    // Store data in session storage for multi-step form
    const stepData = {
      gigName: gigName.trim(),
      gigDescription: gigDescription.trim(),
      selectedSkills: selectedSkills
    };
    sessionStorage.setItem('gigCreationData', JSON.stringify(stepData));
    
    navigate('/gig-creation/step2');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading skills...</p>
        </div>
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
            <div className="ml-auto text-sm text-slate-500">Step 1 of 5</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Create Your Gig
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tell us about your project and what skills you're looking for in a professional.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Gig Name */}
              <div>
                <Label className="text-lg font-semibold text-slate-900">
                  Gig Name <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-slate-600 mt-1 mb-3">
                  Give your project a clear, descriptive title
                </p>
                <Input
                  placeholder="e.g., Build a React Native mobile app for e-commerce"
                  value={gigName}
                  onChange={(e) => setGigName(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Gig Description */}
              <div>
                <Label className="text-lg font-semibold text-slate-900">
                  Gig Description <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-slate-600 mt-1 mb-3">
                  Provide detailed information about your project ({gigDescription.length}/2000 characters)
                </p>
                <Textarea
                  placeholder="Describe your project in detail. What are the main objectives? What deliverables do you expect? What challenges might the professional face?"
                  value={gigDescription}
                  onChange={(e) => setGigDescription(e.target.value)}
                  className="min-h-[120px] text-base"
                  maxLength={2000}
                />
                {gigDescription.length > 1800 && (
                  <p className="text-sm text-amber-600 mt-1">
                    {2000 - gigDescription.length} characters remaining
                  </p>
                )}
              </div>

              {/* Required Skills */}
              <div>
                <Label className="text-lg font-semibold text-slate-900">
                  Required Skills <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-slate-600 mt-1 mb-3">
                  Select the skills needed for this project (minimum 1, maximum 15)
                </p>
                
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Start typing to search skills..."
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
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill.name}
                          <button
                            onClick={() => removeSkill(skill.id)}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      {selectedSkills.length}/15 skills selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-200">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!isValid}
                className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Continue to Cost & Timeline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
