import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, Building, X, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { uploadCompanyLogo, deleteCompanyLogo } from '@/lib/storage';

interface Industry {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

export default function ClientOnboardingStep3() {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    dunsNumber: '',
    companySize: '',
    industry: '',
    city: '',
    country: ''
  });
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>([]);
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const companySizeOptions = [
    '1-10',
    '11-50',
    '51-100',
    '101-500',
    '500-5000',
    '5000+'
  ];

  useEffect(() => {
    loadExistingData();
    loadDropdownData();
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

      // Load existing client profile data
      const { data: clientProfile } = await supabase
        .from('client_profiles')
        .select('company_name, website, duns_number, organisation_type, industry, address1, country_id, logo_url')
        .eq('user_id', user.id)
        .single();

      if (clientProfile) {
        setFormData({
          companyName: clientProfile.company_name || '',
          website: clientProfile.website || '',
          dunsNumber: clientProfile.duns_number || '',
          companySize: clientProfile.organisation_type || '',
          industry: clientProfile.industry || '',
          city: clientProfile.address1 || '',
          country: clientProfile.country_id?.toString() || ''
        });
        setCompanyLogo(clientProfile.logo_url);
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownData = async () => {
    try {
      // Load industries
      const { data: industries } = await supabase
        .from('industries')
        .select('id, name')
        .order('name');

      // Load countries
      const { data: countries } = await supabase
        .from('countries')
        .select('id, name')
        .order('name');

      if (industries) setAvailableIndustries(industries);
      if (countries) setAvailableCountries(countries);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  };

  const validateForm = () => {
    const valid = formData.companyName.trim() !== '' && 
                  formData.companySize !== '' && 
                  formData.industry !== '' && 
                  formData.city.trim() !== '' && 
                  formData.country !== '';
    setIsValid(valid);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError(null);

      const user = await getCurrentUser();
      if (!user) {
        setUploadError('User not authenticated');
        return;
      }

      // Delete existing logo if any
      if (companyLogo) {
        await deleteCompanyLogo(companyLogo);
      }

      // Upload new logo
      const result = await uploadCompanyLogo(file, user.id);
      if (result.success && result.url) {
        setCompanyLogo(result.url);
      } else {
        setUploadError(result.error || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadError('Failed to upload logo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (companyLogo) {
      try {
        await deleteCompanyLogo(companyLogo);
        setCompanyLogo(null);
      } catch (error) {
        console.error('Error removing logo:', error);
      }
    }
  };

  const saveToSupabase = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.error('No user found');
        return;
      }

      // Update client_profiles table
      const { error: profileError } = await supabase
        .from('client_profiles')
        .upsert({
          user_id: user.id,
          company_name: formData.companyName,
          website: formData.website || null,
          duns_number: formData.dunsNumber || null,
          organisation_type: formData.companySize,
          industry: formData.industry,
          logo_url: companyLogo,
          address1: formData.city,
          country_id: formData.country ? parseInt(formData.country) : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('Error updating client profile:', profileError);
        return;
      }

      console.log('Company profile data saved successfully');
    } catch (error) {
      console.error('Error saving company profile data:', error);
    }
  };

  const handleContinue = async () => {
    if (!isValid) return;
    
    await saveToSupabase();
    navigate('/onboarding/client/review');
  };

  const handleBack = () => {
    navigate('/onboarding/client/step2');
  };

  const handleSkip = async () => {
    await saveToSupabase();
    navigate('/onboarding/client/review');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading company data...</p>
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#012E46] mb-4">
            Company Profile
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Tell us about your company. This information helps consultants understand your business better.
          </p>
        </div>

        {/* Company Profile Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              {/* Company Logo Section */}
              <div className="mb-8">
                <Label className="text-base font-medium text-slate-700 mb-3 block">
                  Company Logo (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  {/* Current Logo Display */}
                  <div className="relative">
                    {companyLogo ? (
                      <div className="relative">
                        <img
                          src={companyLogo}
                          alt="Company Logo"
                          className="w-20 h-20 object-contain border-2 border-slate-200 rounded-lg"
                        />
                        <button
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                        <Building className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload Logo'}
                    </Button>
                    {uploadError && (
                      <p className="text-red-500 text-sm mt-1">{uploadError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Company Name */}
                <div>
                  <Label htmlFor="companyName" className="text-base font-medium text-slate-700 mb-2 block">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter your company name"
                    className="w-full"
                  />
                </div>

                {/* Website */}
                <div>
                  <Label htmlFor="website" className="text-base font-medium text-slate-700 mb-2 block">
                    Website (Optional)
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://www.yourcompany.com"
                      className="w-full pl-10"
                    />
                  </div>
                </div>

                {/* D-U-N-S Number */}
                <div>
                  <Label htmlFor="dunsNumber" className="text-base font-medium text-slate-700 mb-2 block">
                    D-U-N-S Number (Optional)
                  </Label>
                  <Input
                    id="dunsNumber"
                    value={formData.dunsNumber}
                    onChange={(e) => handleInputChange('dunsNumber', e.target.value)}
                    placeholder="Enter your D-U-N-S number"
                    className="w-full"
                  />
                </div>

                {/* Company Size */}
                <div>
                  <Label htmlFor="companySize" className="text-base font-medium text-slate-700 mb-2 block">
                    Company Size <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizeOptions.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size} employees
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry */}
                <div>
                  <Label htmlFor="industry" className="text-base font-medium text-slate-700 mb-2 block">
                    Industry <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIndustries.map((industry) => (
                        <SelectItem key={industry.id} value={industry.name}>
                          {industry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Location */}
                <div className="grid grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <Label htmlFor="city" className="text-base font-medium text-slate-700 mb-2 block">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                        className="w-full pl-10"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <Label htmlFor="country" className="text-base font-medium text-slate-700 mb-2 block">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCountries.map((country) => (
                          <SelectItem key={country.id} value={country.id.toString()}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={handleBack}
              variant="outline"
              className="px-6 py-2"
            >
              Back
            </Button>
            
            <div className="flex gap-3">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="px-6 py-2"
              >
                Skip
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!isValid}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
