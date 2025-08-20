import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';

export default function OnboardingStep3() {
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load existing skills and languages on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Load existing skills
          const { data: skillsData } = await supabase
            .from('user_skills')
            .select('skill_id')
            .eq('user_id', user.id);
          
          if (skillsData) {
            // Get skill names from skills table
            const skillIds = skillsData.map(s => s.skill_id);
            if (skillIds.length > 0) {
              const { data: skillNames } = await supabase
                .from('skills')
                .select('name')
                .in('id', skillIds);
              if (skillNames) {
                setSkills(skillNames.map(s => s.name));
              }
            }
          }

          // Load existing languages
          const { data: languagesData } = await supabase
            .from('user_languages')
            .select('language_id')
            .eq('user_id', user.id);
          
          if (languagesData) {
            // Get language names from languages table
            const languageIds = languagesData.map(l => l.language_id);
            if (languageIds.length > 0) {
              const { data: languageNames } = await supabase
                .from('languages')
                .select('name')
                .in('id', languageIds);
              if (languageNames) {
                setLanguages(languageNames.map(l => l.name));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim()) && skills.length < 15) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    setLanguages(languages.filter(language => language !== languageToRemove));
  };

  const saveToSupabase = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.error('No user found');
        return;
      }

      // Save skills
      for (const skillName of skills) {
        // First, get or create the skill
        let { data: skillData } = await supabase
          .from('skills')
          .select('id')
          .eq('name', skillName)
          .single();

        if (!skillData) {
          // Create new skill if it doesn't exist
          const { data: newSkillData } = await supabase
            .from('skills')
            .insert([{ name: skillName }])
            .select()
            .single();
          skillData = newSkillData;
        }

        if (skillData) {
          // Add user-skill relationship
          await supabase
            .from('user_skills')
            .upsert([{
              user_id: user.id,
              skill_id: skillData.id
            }], { onConflict: 'user_id,skill_id' });
        }
      }

      // Save languages
      for (const languageName of languages) {
        // First, get or create the language
        let { data: languageData } = await supabase
          .from('languages')
          .select('id')
          .eq('name', languageName)
          .single();

        if (!languageData) {
          // Create new language if it doesn't exist
          const { data: newLanguageData } = await supabase
            .from('languages')
            .insert([{ name: languageName }])
            .select()
            .single();
          languageData = newLanguageData;
        }

        if (languageData) {
          // Add user-language relationship
          await supabase
            .from('user_languages')
            .upsert([{
              user_id: user.id,
              language_id: languageData.id
            }], { onConflict: 'user_id,language_id' });
        }
      }

      console.log('Skills and languages saved successfully');
    } catch (error) {
      console.error('Error saving skills and languages:', error);
    }
  };

  const handleContinue = async () => {
    await saveToSupabase();
    navigate('/onboarding/step4');
  };

  const handleBack = () => {
    navigate('/onboarding/step2');
  };

  const handleSkip = async () => {
    await saveToSupabase();
    navigate('/onboarding/step4');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-slate-600">Loading skills and languages...</div>
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
                  step === 3 
                    ? 'bg-[#012E46] text-white' 
                    : step < 3
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 6 && (
                  <div className={`w-6 sm:w-8 lg:w-12 h-1 mx-1 sm:mx-2 ${
                    step < 3 ? 'bg-green-500' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#012E46] mb-2">Skills & Languages</h1>
          <p className="text-slate-600">Tell us about your professional skills and languages</p>
        </div>

        <div className="space-y-6">
          {/* Skills Section */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <Label className="text-lg font-semibold text-slate-900">Professional Skills</Label>
                <p className="text-sm text-slate-600 mt-1">Add up to 15 skills that best describe your expertise</p>
              </div>
              
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="e.g., Project Management, React, Data Analysis"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1"
                />
                <Button 
                  onClick={addSkill}
                  disabled={!newSkill.trim() || skills.length >= 15}
                  className="px-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-blue-200 rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {skills.length >= 15 && (
                <p className="text-sm text-amber-600 mt-2">
                  Maximum of 15 skills reached
                </p>
              )}
            </CardContent>
          </Card>

          {/* Languages Section */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <Label className="text-lg font-semibold text-slate-900">Languages</Label>
                <p className="text-sm text-slate-600 mt-1">Add languages you can work in</p>
              </div>
              
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="e.g., English, Spanish, French"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                  className="flex-1"
                />
                <Button 
                  onClick={addLanguage}
                  disabled={!newLanguage.trim()}
                  className="px-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {languages.map((language, index) => (
                  <div
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{language}</span>
                    <button
                      onClick={() => removeLanguage(language)}
                      className="hover:bg-green-200 rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
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
              Skip
            </Button>
            <Button
              onClick={handleContinue}
              className="px-6"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
