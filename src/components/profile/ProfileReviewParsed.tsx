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
  Plus,
  Edit,
  Save,
  X,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ParsedProfileData {
  sourceFileId: string;
  parsedData: {
    basicInfo: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      linkedinUrl?: string;
      location?: string;
      headline?: string;
    };
    workExperience: Array<{
      company: string;
      jobTitle: string;
      startDateMonth?: string;
      startDateYear?: number;
      endDateMonth?: string;
      endDateYear?: number;
      currentlyWorking?: boolean;
      description?: string;
      city?: string;
      country?: string;
    }>;
    education: Array<{
      institutionName: string;
      degreeLevel: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      grade?: string;
      description?: string;
    }>;
    skills: string[];
    certifications: Array<{
      name: string;
      awardingBody?: string;
      issueDate?: string;
      expiryDate?: string;
      credentialId?: string;
    }>;
    languages: Array<{
      language: string;
      proficiency: string;
    }>;
    summary?: string;
    estimatedYearsExperience?: number;
  };
  eligibility?: {
    yearsOfExperienceEstimate: number;
    meetsThreshold: boolean;
    confidence: 'low' | 'medium' | 'high';
    reasons: string[];
    seniorityIndicators?: string[];
  };
}

interface ProfileReviewParsedProps {
  data: ParsedProfileData;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileReviewParsed({ data, onSave, onCancel }: ProfileReviewParsedProps) {
  const [parsedData, setParsedData] = useState(data.parsedData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    success: boolean;
    unmatchedSkills?: string[];
  } | null>(null);
  const { toast } = useToast();

  const getAuthToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveResult(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Please log in to save your profile');
      }

      const response = await fetch('/.netlify/functions/profile-save-parsed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sourceFileId: data.sourceFileId,
          parsedData: parsedData,
          eligibility: data.eligibility
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }

      const result = await response.json();
      
      setSaveResult({
        success: true,
        unmatchedSkills: result.unmatchedSkills
      });

      toast({
        title: 'Profile saved successfully!',
        description: `Your profile has been updated with ${result.results.workExperience.saved} work experiences, ${result.results.education.saved} education entries, and ${result.results.skills.matched} skills.`,
      });

      // Call the onSave callback after a short delay
      setTimeout(() => {
        onSave();
      }, 2000);

    } catch (err) {
      console.error('Save error:', err);
      toast({
        title: 'Error saving profile',
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateBasicInfo = (field: string, value: string) => {
    setParsedData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value
      }
    }));
  };

  const updateWorkExperience = (index: number, field: string, value: string | number | boolean) => {
    setParsedData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (index: number) => {
    setParsedData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setParsedData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setParsedData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const removeSkill = (index: number) => {
    setParsedData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const removeCertification = (index: number) => {
    setParsedData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const removeLanguage = (index: number) => {
    setParsedData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Eligibility Alert */}
      {data.eligibility && (
        <Alert variant={data.eligibility.meetsThreshold ? 'default' : 'destructive'}>
          {data.eligibility.meetsThreshold ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {data.eligibility.meetsThreshold 
              ? 'Great match for GigExecs!' 
              : 'Experience threshold'}
          </AlertTitle>
          <AlertDescription>
            <p>
              Estimated {data.eligibility.yearsOfExperienceEstimate} years of experience.
              {!data.eligibility.meetsThreshold && (
                <span className="block mt-1">
                  GigExecs is designed for professionals with 15+ years of experience. 
                  You can still complete your profile, but some features may be limited.
                </span>
              )}
            </p>
            {data.eligibility.seniorityIndicators && data.eligibility.seniorityIndicators.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {data.eligibility.seniorityIndicators.map((indicator, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {indicator}
                  </Badge>
                ))}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Review Extracted Profile</CardTitle>
          </div>
          <CardDescription>
            We've extracted the following information from your CV. 
            Please review and edit as needed before saving to your profile.
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
              value={parsedData.basicInfo.firstName || ''}
              onChange={(e) => updateBasicInfo('firstName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={parsedData.basicInfo.lastName || ''}
              onChange={(e) => updateBasicInfo('lastName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={parsedData.basicInfo.email || ''}
              onChange={(e) => updateBasicInfo('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={parsedData.basicInfo.phone || ''}
              onChange={(e) => updateBasicInfo('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              value={parsedData.basicInfo.linkedinUrl || ''}
              onChange={(e) => updateBasicInfo('linkedinUrl', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={parsedData.basicInfo.location || ''}
              onChange={(e) => updateBasicInfo('location', e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="headline">Professional Headline</Label>
            <Input
              id="headline"
              value={parsedData.basicInfo.headline || ''}
              onChange={(e) => updateBasicInfo('headline', e.target.value)}
              placeholder="e.g., Senior Product Manager | 15+ Years Experience"
            />
          </div>
          {parsedData.summary && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={parsedData.summary}
                onChange={(e) => setParsedData(prev => ({ ...prev, summary: e.target.value }))}
                rows={4}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <CardTitle className="text-lg">Work Experience</CardTitle>
              <Badge variant="secondary">{parsedData.workExperience.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {parsedData.workExperience.map((exp, index) => (
              <AccordionItem key={index} value={`exp-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <p className="font-medium">{exp.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} • {exp.startDateYear}{exp.currentlyWorking ? ' - Present' : exp.endDateYear ? ` - ${exp.endDateYear}` : ''}
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
                        value={exp.jobTitle}
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
                        value={exp.startDateYear || ''}
                        onChange={(e) => updateWorkExperience(index, 'startDateYear', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Year</Label>
                      <Input
                        type="number"
                        value={exp.endDateYear || ''}
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
          {parsedData.workExperience.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No work experience extracted. You can add this later in your profile.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <CardTitle className="text-lg">Education</CardTitle>
            <Badge variant="secondary">{parsedData.education.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {parsedData.education.map((edu, index) => (
              <AccordionItem key={index} value={`edu-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <p className="font-medium">{edu.degreeLevel}</p>
                      <p className="text-sm text-muted-foreground">{edu.institutionName}</p>
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
                        value={edu.institutionName}
                        onChange={(e) => updateEducation(index, 'institutionName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree Level</Label>
                      <Input
                        value={edu.degreeLevel}
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
                      <Label>Grade</Label>
                      <Input
                        value={edu.grade || ''}
                        onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {parsedData.education.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No education extracted. You can add this later in your profile.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            <CardTitle className="text-lg">Skills</CardTitle>
            <Badge variant="secondary">{parsedData.skills.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {parsedData.skills.map((skill, index) => (
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
          {parsedData.skills.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No skills extracted. You can add these later in your profile.
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            Skills will be matched to our database. Unmatched skills can be added manually later.
          </p>
        </CardContent>
      </Card>

      {/* Certifications */}
      {parsedData.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <CardTitle className="text-lg">Certifications</CardTitle>
              <Badge variant="secondary">{parsedData.certifications.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {parsedData.certifications.map((cert, index) => (
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

      {/* Languages */}
      {parsedData.languages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              <CardTitle className="text-lg">Languages</CardTitle>
              <Badge variant="secondary">{parsedData.languages.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {parsedData.languages.map((lang, index) => (
                <Badge key={index} variant="outline" className="pr-1">
                  {lang.language} ({lang.proficiency})
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

      {/* Save Result */}
      {saveResult && saveResult.success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Profile saved successfully!</AlertTitle>
          <AlertDescription>
            {saveResult.unmatchedSkills && saveResult.unmatchedSkills.length > 0 && (
              <p className="mt-2">
                Some skills couldn't be matched to our database: {saveResult.unmatchedSkills.join(', ')}. 
                You can add these manually in your profile settings.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-lg">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save to Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ProfileReviewParsed;

