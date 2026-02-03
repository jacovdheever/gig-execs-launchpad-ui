import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Wrench,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Save,
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface DraftProfile {
  basicInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    linkedinUrl?: string;
    location?: string;
    headline?: string;
  };
  workExperience?: Array<{
    company: string;
    jobTitle?: string;
    title?: string; // Alternative field name from AI
    startDateMonth?: string;
    startDateYear?: number;
    startYear?: number; // Alternative field name from AI
    endDateMonth?: string;
    endDateYear?: number;
    endYear?: number; // Alternative field name from AI
    currentlyWorking?: boolean;
    description?: string;
    city?: string;
    country?: string;
  }>;
  education?: Array<{
    institutionName?: string;
    institution?: string; // Alternative field name from AI
    degreeLevel?: string;
    degree?: string; // Alternative field name from AI
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    year?: number; // Alternative field name from AI
    grade?: string;
    description?: string;
  }>;
  skills?: string[];
  industries?: string[];
  certifications?: Array<{
    name: string;
    awardingBody?: string;
    issueDate?: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency?: string;
  }>;
  hourlyRate?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  summary?: string;
  estimatedYearsExperience?: number;
}

// Helper functions to get values from different field names
function getEducationInstitution(edu: DraftProfile['education'][0]): string {
  return edu.institutionName || edu.institution || '';
}

function getEducationDegree(edu: DraftProfile['education'][0]): string {
  return edu.degreeLevel || edu.degree || '';
}

function getWorkExperienceTitle(exp: DraftProfile['workExperience'][0]): string {
  return exp.jobTitle || exp.title || '';
}

function getWorkExperienceStartYear(exp: DraftProfile['workExperience'][0]): number | undefined {
  return exp.startDateYear || exp.startYear;
}

function getWorkExperienceEndYear(exp: DraftProfile['workExperience'][0]): number | undefined {
  return exp.endDateYear || exp.endYear;
}

interface ProfileDraftReviewProps {
  draftId: string;
  draftProfile: DraftProfile;
  onPublish: () => void;
  onBack: () => void;
}

export function ProfileDraftReview({ draftId, draftProfile, onPublish, onBack }: ProfileDraftReviewProps) {
  const [profile, setProfile] = useState<DraftProfile>(draftProfile);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    unmatchedSkills?: string[];
    profileCompleteness?: number;
  } | null>(null);
  const { toast } = useToast();

  const getAuthToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishResult(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Please log in to publish your profile');
      }

      const response = await fetch('/.netlify/functions/profile-ai-publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          draftId,
          editedProfile: profile
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to publish profile');
      }

      const result = await response.json();
      
      setPublishResult({
        success: true,
        unmatchedSkills: result.unmatchedSkills,
        profileCompleteness: result.profileCompleteness
      });

      toast({
        title: 'Profile published successfully!',
        description: `Your profile is now ${result.profileCompleteness}% complete.`,
      });

      // Call the onPublish callback after a short delay
      setTimeout(() => {
        onPublish();
      }, 2000);

    } catch (err) {
      console.error('Publish error:', err);
      toast({
        title: 'Error publishing profile',
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const updateBasicInfo = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value
      }
    }));
  };

  const updateWorkExperience = (index: number, field: string, value: string | number | boolean) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience?.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (index: number) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience?.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education?.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index)
    }));
  };

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index)
    }));
  };

  const removeCertification = (index: number) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications?.filter((_, i) => i !== index)
    }));
  };

  const removeLanguage = (index: number) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages?.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Review Your Profile</CardTitle>
          </div>
          <CardDescription>
            Review and edit your AI-generated profile before publishing. 
            All changes will be saved to your GigExecs profile.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profile.basicInfo?.firstName || ''}
              onChange={(e) => updateBasicInfo('firstName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profile.basicInfo?.lastName || ''}
              onChange={(e) => updateBasicInfo('lastName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.basicInfo?.email || ''}
              onChange={(e) => updateBasicInfo('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={profile.basicInfo?.phone || ''}
              onChange={(e) => updateBasicInfo('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              value={profile.basicInfo?.linkedinUrl || ''}
              onChange={(e) => updateBasicInfo('linkedinUrl', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profile.basicInfo?.location || ''}
              onChange={(e) => updateBasicInfo('location', e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="headline">Professional Headline</Label>
            <Input
              id="headline"
              value={profile.basicInfo?.headline || ''}
              onChange={(e) => updateBasicInfo('headline', e.target.value)}
              placeholder="e.g., Senior Product Manager | 15+ Years Experience"
            />
          </div>
          {profile.summary && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={profile.summary}
                onChange={(e) => setProfile(prev => ({ ...prev, summary: e.target.value }))}
                rows={4}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Experience */}
      {profile.workExperience && profile.workExperience.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <CardTitle className="text-lg">Work Experience</CardTitle>
              <Badge variant="secondary">{profile.workExperience.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {profile.workExperience.map((exp, index) => (
                <AccordionItem key={index} value={`exp-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="text-left">
                        <p className="font-medium">{getWorkExperienceTitle(exp)}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.company} • {getWorkExperienceStartYear(exp)}{exp.currentlyWorking ? ' - Present' : getWorkExperienceEndYear(exp) ? ` - ${getWorkExperienceEndYear(exp)}` : ''}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWorkExperience(index);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          value={getWorkExperienceTitle(exp)}
                          onChange={(e) => updateWorkExperience(index, 'jobTitle', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Year</Label>
                        <Input
                          type="number"
                          value={getWorkExperienceStartYear(exp) || ''}
                          onChange={(e) => updateWorkExperience(index, 'startDateYear', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Year</Label>
                        <Input
                          type="number"
                          value={getWorkExperienceEndYear(exp) || ''}
                          onChange={(e) => updateWorkExperience(index, 'endDateYear', parseInt(e.target.value))}
                          disabled={exp.currentlyWorking}
                          placeholder={exp.currentlyWorking ? 'Present' : ''}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description || ''}
                          onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <CardTitle className="text-lg">Education</CardTitle>
              <Badge variant="secondary">{profile.education.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {profile.education.map((edu, index) => (
                <AccordionItem key={index} value={`edu-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="text-left">
                        <p className="font-medium">{getEducationDegree(edu)}</p>
                        <p className="text-sm text-muted-foreground">
                          {getEducationInstitution(edu)}
                          {edu.year ? ` (${edu.year})` : ''}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEducation(index);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input
                          value={getEducationInstitution(edu)}
                          onChange={(e) => updateEducation(index, 'institutionName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree Level</Label>
                        <Input
                          value={getEducationDegree(edu)}
                          onChange={(e) => updateEducation(index, 'degreeLevel', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          value={edu.fieldOfStudy || ''}
                          onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          type="number"
                          value={edu.year || ''}
                          onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              <CardTitle className="text-lg">Skills</CardTitle>
              <Badge variant="secondary">{profile.skills.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="pr-1">
                  {skill}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => removeSkill(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Skills will be matched to our database. Unmatched skills can be added manually later.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {profile.certifications && profile.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <CardTitle className="text-lg">Certifications</CardTitle>
              <Badge variant="secondary">{profile.certifications.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-muted-foreground">{cert.awardingBody}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCertification(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Industries */}
      {profile.industries && profile.industries.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <CardTitle className="text-lg">Industries</CardTitle>
              <Badge variant="secondary">{profile.industries.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.industries.map((industry, index) => (
                <Badge key={index} variant="outline" className="pr-1">
                  {industry}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => setProfile(prev => ({
                      ...prev,
                      industries: prev.industries?.filter((_, i) => i !== index)
                    }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Industries will be matched to our database when published.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              <CardTitle className="text-lg">Languages</CardTitle>
              <Badge variant="secondary">{profile.languages.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang, index) => (
                <Badge key={index} variant="outline" className="pr-1">
                  {lang.language} {lang.proficiency ? `(${lang.proficiency})` : ''}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => removeLanguage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hourly Rate */}
      {profile.hourlyRate && (profile.hourlyRate.min || profile.hourlyRate.max) && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <CardTitle className="text-lg">Hourly Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Minimum Rate</Label>
                <Input
                  type="number"
                  value={profile.hourlyRate.min || ''}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    hourlyRate: { ...prev.hourlyRate, min: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Rate</Label>
                <Input
                  type="number"
                  value={profile.hourlyRate.max || ''}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    hourlyRate: { ...prev.hourlyRate, max: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input
                  value={profile.hourlyRate.currency || 'USD'}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    hourlyRate: { ...prev.hourlyRate, currency: e.target.value }
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Photo Note */}
      <Alert>
        <User className="h-4 w-4" />
        <AlertTitle>Profile Photo</AlertTitle>
        <AlertDescription>
          You can add a profile photo after publishing your profile. 
          Go to your profile settings to upload a professional photo.
        </AlertDescription>
      </Alert>

      {/* Publish Result */}
      {publishResult && publishResult.success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Profile published successfully!</AlertTitle>
          <AlertDescription>
            <p>Your profile is now {publishResult.profileCompleteness}% complete.</p>
            {publishResult.unmatchedSkills && publishResult.unmatchedSkills.length > 0 && (
              <p className="mt-2">
                Some skills couldn't be matched: {publishResult.unmatchedSkills.join(', ')}. 
                You can add these manually in your profile settings.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-between sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-lg">
        <Button variant="outline" onClick={onBack} disabled={isPublishing}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chat
        </Button>
        <Button onClick={handlePublish} disabled={isPublishing}>
          {isPublishing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Publish Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ProfileDraftReview;

