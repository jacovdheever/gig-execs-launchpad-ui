import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';

interface Language {
  id: number;
  name: string;
}

interface UserLanguage {
  id?: number;
  language_id: number;
  language_name: string;
  proficiency: string;
}

interface ProficiencyLevel {
  value: string;
  label: string;
}

export default function OnboardingStep5() {
  const [userLanguages, setUserLanguages] = useState<UserLanguage[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<UserLanguage | null>(null);
  const [formData, setFormData] = useState({
    language_id: '',
    proficiency: ''
  });
  const navigate = useNavigate();

  // Proficiency levels
  const proficiencyLevels: ProficiencyLevel[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'fluent', label: 'Fluent' },
    { value: 'native', label: 'Native or Bilingual' }
  ];

  // Helper function to get proficiency display label
  const getProficiencyLabel = (value: string): string => {
    const level = proficiencyLevels.find(level => level.value === value);
    return level ? level.label : value;
  };

  // Load user data and languages on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load available languages
        const { data: languagesData, error: languagesError } = await supabase
          .from('languages')
          .select('id, name')
          .order('name');

        if (languagesError) {
          console.error('Error loading languages:', languagesError);
          return;
        }

        setAvailableLanguages(languagesData || []);

        // Load user's current languages
        const user = await getCurrentUser();
        if (user) {
          const { data: userLanguagesData, error: userLanguagesError } = await supabase
            .from('user_languages')
            .select(`
              id,
              language_id,
              proficiency,
              languages!inner(name)
            `)
            .eq('user_id', user.id);

          if (userLanguagesError) {
            console.error('Error loading user languages:', userLanguagesError);
            return;
          }

          const formattedLanguages = (userLanguagesData || []).map(item => ({
            id: item.id,
            language_id: item.language_id,
            language_name: item.languages.name,
            proficiency: item.proficiency
          }));

          setUserLanguages(formattedLanguages);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddLanguage = () => {
    setEditingLanguage(null);
    setFormData({ language_id: '', proficiency: '' });
    setShowModal(true);
  };

  const handleEditLanguage = (language: UserLanguage) => {
    setEditingLanguage(language);
    setFormData({
      language_id: language.language_id.toString(),
      proficiency: language.proficiency
    });
    setShowModal(true);
  };

  const handleDeleteLanguage = async (languageId: number) => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_languages')
        .delete()
        .eq('id', languageId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting language:', error);
        return;
      }

      // Remove from local state
      setUserLanguages(prev => prev.filter(lang => lang.id !== languageId));
    } catch (error) {
      console.error('Error deleting language:', error);
    }
  };

  const handleSaveLanguage = async () => {
    if (!formData.language_id || !formData.proficiency) return;

    try {
      setSaving(true);
      const user = await getCurrentUser();
      if (!user) return;

      if (editingLanguage) {
        // Update existing language
        const { error } = await supabase
          .from('user_languages')
          .update({
            language_id: parseInt(formData.language_id),
            proficiency: formData.proficiency
          })
          .eq('id', editingLanguage.id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating language:', error);
          return;
        }

        // Update local state
        const languageName = availableLanguages.find(l => l.id === parseInt(formData.language_id))?.name || '';
        setUserLanguages(prev => prev.map(lang => 
          lang.id === editingLanguage.id 
            ? { ...lang, language_id: parseInt(formData.language_id), language_name: languageName, proficiency: formData.proficiency }
            : lang
        ));
      } else {
        // Check if language already exists for this user
        const existingLanguage = userLanguages.find(lang => lang.language_id === parseInt(formData.language_id));
        if (existingLanguage) {
          alert('You already have this language in your profile.');
          return;
        }

        // Add new language
        const { error } = await supabase
          .from('user_languages')
          .insert({
            user_id: user.id,
            language_id: parseInt(formData.language_id),
            proficiency: formData.proficiency
          });

        if (error) {
          console.error('Error adding language:', error);
          return;
        }

        // Add to local state
        const languageName = availableLanguages.find(l => l.id === parseInt(formData.language_id))?.name || '';
        const newLanguage: UserLanguage = {
          language_id: parseInt(formData.language_id),
          language_name: languageName,
          proficiency: formData.proficiency
        };
        setUserLanguages(prev => [...prev, newLanguage]);
      }

      setShowModal(false);
      setFormData({ language_id: '', proficiency: '' });
      setEditingLanguage(null);
    } catch (error) {
      console.error('Error saving language:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = () => {
    navigate('/onboarding/step6');
  };

  const handleBack = () => {
    navigate('/onboarding/step4');
  };

  const handleSkip = () => {
    navigate('/onboarding/step6');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012E46] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading languages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-4">
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
                  step === 5 
                    ? 'bg-[#012E46] text-white' 
                    : step < 5
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 6 && (
                  <div className={`w-6 sm:w-8 lg:w-12 h-1 mx-1 sm:mx-2 ${
                    step <= 5 ? 'bg-[#012E46]' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#012E46] mb-6 sm:mb-8 text-center">
                Your Languages
              </h1>

              {/* Description */}
              <p className="text-slate-600 text-center mb-8 leading-relaxed">
                We kindly request that you add your spoken languages to your profile information. 
                This information is crucial in helping clients find the right freelancer for their projects, 
                especially those that require multilingual skills.
              </p>

              {/* Languages List */}
              {userLanguages.length > 0 && (
                <div className="mb-6 space-y-3">
                  {userLanguages.map((language, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-[#012E46]">{language.language_name}</div>
                        <div className="text-slate-600 text-sm">{getProficiencyLabel(language.proficiency)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditLanguage(language)}
                          className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
                          title="Edit language"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLanguage(language.id!)}
                          className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                          title="Delete language"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Language Button */}
              <div className="text-center mb-8">
                <button
                  onClick={handleAddLanguage}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add a Language
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  Back
                </Button>
                <Button
                  onClick={handleContinue}
                  className="flex-1 sm:flex-none bg-[#012E46] hover:bg-[#012E46]/90"
                  disabled={userLanguages.length === 0}
                >
                  Continue
                </Button>
              </div>

              {/* Skip Option */}
              <div className="text-center mt-4">
                <button
                  onClick={handleSkip}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  I'll do this later
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Language Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#012E46]">
                {editingLanguage ? 'Edit Language' : 'Add a Language'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Language Selection */}
              <div>
                <Label htmlFor="language" className="text-sm font-medium text-[#012E46]">
                  Language*
                </Label>
                <Select
                  value={formData.language_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language_id: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="(Select one)" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((language) => (
                      <SelectItem key={language.id} value={language.id.toString()}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Proficiency Selection */}
              <div>
                <Label htmlFor="proficiency" className="text-sm font-medium text-[#012E46]">
                  Proficiency*
                </Label>
                <Select
                  value={formData.proficiency}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, proficiency: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="(Select one)" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleSaveLanguage}
                disabled={!formData.language_id || !formData.proficiency || saving}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-800 font-semibold"
              >
                {saving ? 'Saving...' : editingLanguage ? 'Update Language' : 'Add Language'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
