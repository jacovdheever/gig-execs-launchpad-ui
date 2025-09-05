import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const DURATION_OPTIONS = [
  { value: 'less-than-1-month', label: 'Less than 1 month' },
  { value: '1-3-months', label: '1-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6-12-months', label: '6-12 months' },
  { value: '12-months-plus', label: '12 months or longer' }
];

export default function GigCreationStep2() {
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from session storage
    const loadStepData = () => {
      try {
        const savedData = sessionStorage.getItem('gigCreationData');
        if (savedData) {
          const data = JSON.parse(savedData);
          if (data.budget) setBudget(data.budget);
          if (data.duration) setDuration(data.duration);
        }
      } catch (error) {
        console.error('Error loading step data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStepData();
  }, []);

  const isValid = budget.trim() !== '' && 
                 !isNaN(Number(budget)) && 
                 Number(budget) > 0 && 
                 duration !== '';

  const handleContinue = () => {
    if (!isValid) return;
    
    // Update session storage with step 2 data
    const savedData = sessionStorage.getItem('gigCreationData');
    const data = savedData ? JSON.parse(savedData) : {};
    
    const updatedData = {
      ...data,
      budget: budget.trim(),
      duration: duration
    };
    
    sessionStorage.setItem('gigCreationData', JSON.stringify(updatedData));
    navigate('/gig-creation/step3');
  };

  const handleBack = () => {
    navigate('/gig-creation/step1');
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
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
            <div className="ml-auto text-sm text-slate-500">Step 2 of 5</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Cost & Timeline
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Set your budget and expected project duration to help professionals understand the scope.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Budget */}
              <div>
                <Label className="text-lg font-semibold text-slate-900">
                  Estimated Budget <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-slate-600 mt-1 mb-3">
                  What's your budget range for this project? (in USD)
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">$</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="pl-7 text-base"
                    min="0"
                    step="100"
                  />
                </div>
                {budget && !isNaN(Number(budget)) && Number(budget) > 0 && (
                  <p className="text-sm text-slate-600 mt-2">
                    Budget: {formatCurrency(budget)}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div>
                <Label className="text-lg font-semibold text-slate-900">
                  Project Duration <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-slate-600 mt-1 mb-3">
                  How long do you expect this project to take?
                </p>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select project duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Budget Guidelines</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be realistic about your budget to attract quality professionals</li>
                  <li>• Consider the complexity and scope of your project</li>
                  <li>• You can always discuss budget adjustments with interested professionals</li>
                  <li>• Higher budgets typically attract more experienced consultants</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-200">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Back to Details
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!isValid}
                className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Continue to Attachments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
