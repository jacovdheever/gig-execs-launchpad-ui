import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { Info } from 'lucide-react';

interface HourlyRateData {
  currency: string;
  min_price: number | null;
  max_price: number | null;
}

export default function OnboardingStep6() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<HourlyRateData>({
    currency: 'USD',
    min_price: null,
    max_price: null
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, []);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const loadExistingData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }

      // Load existing hourly rate data from consultant_profiles
      const { data, error } = await supabase
        .from('consultant_profiles')
        .select('hourly_rate_min, hourly_rate_max')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading hourly rate data:', error);
        return;
      }

      if (data) {
        setFormData(prev => ({
          ...prev,
          min_price: data.hourly_rate_min,
          max_price: data.hourly_rate_max
        }));
      }
    } catch (error) {
      console.error('Error loading hourly rate data:', error);
    }
  };

  const validateForm = () => {
    const { min_price, max_price } = formData;
    
    if (!min_price || !max_price) {
      setIsValid(false);
      return;
    }

    if (min_price >= max_price) {
      setIsValid(false);
      return;
    }

    if (min_price < 0 || max_price < 0) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
  };

  const handleInputChange = (field: keyof HourlyRateData, value: string | number) => {
    if (field === 'min_price' || field === 'max_price') {
      const numValue = value === '' ? null : Number(value);
      setFormData(prev => ({ ...prev, [field]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveAndExit = async () => {
    await saveToSupabase();
    navigate('/dashboard');
  };

  const handleContinue = async () => {
    if (!isValid) return;
    
    const success = await saveToSupabase();
    if (success) {
      navigate('/onboarding/review');
    }
  };

  const saveToSupabase = async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        return false;
      }

      const { error } = await supabase
        .from('consultant_profiles')
        .upsert({
          user_id: user.id,
          hourly_rate_min: formData.min_price,
          hourly_rate_max: formData.max_price
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving hourly rate data:', error);
        setError('Failed to save hourly rate data');
        return false;
      }

      console.log('Hourly rate data saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving hourly rate data:', error);
      setError('An unexpected error occurred');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/step5');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Hourly Rate</h1>
            <p className="text-gray-600 text-lg">
              Indicate your typical hourly rates. You will be allowed to adjust your rates when you bid on a specific Gig (project).
            </p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Currency and Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Currency */}
              <div>
                <Label htmlFor="currency" className="text-sm font-medium text-gray-700 mb-2 block">
                  Currency
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange('currency', value)}
                  disabled
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">🇺🇸 USA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price */}
              <div>
                <Label htmlFor="min_price" className="text-sm font-medium text-gray-700 mb-2 block">
                  Min price*
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="min_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.min_price || ''}
                    onChange={(e) => handleInputChange('min_price', e.target.value)}
                    className="pl-8"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Separator */}
              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-xl">-</span>
              </div>

              {/* Max Price */}
              <div>
                <Label htmlFor="max_price" className="text-sm font-medium text-gray-700 mb-2 block">
                  Max price*
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="max_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.max_price || ''}
                    onChange={(e) => handleInputChange('max_price', e.target.value)}
                    className="pl-8"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Validation Error */}
            {formData.min_price && formData.max_price && formData.min_price >= formData.max_price && (
              <div className="text-red-600 text-sm">
                Minimum price must be less than maximum price
              </div>
            )}

            {/* Info Note */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-amber-700 text-sm">
                This is the amount the client will see when they view your profile.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
                disabled={saving}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleContinue}
                className="flex-1"
                disabled={!isValid || saving}
              >
                {saving ? 'Saving...' : 'Continue'}
              </Button>
            </div>

            {/* Save and Exit */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleSaveAndExit}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={saving}
              >
                I'll do this later
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
