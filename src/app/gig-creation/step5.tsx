import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Check, X, File, DollarSign, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';

interface GigCreationData {
  gigName: string;
  gigDescription: string;
  selectedSkills: Array<{ id: number; name: string }>;
  selectedIndustries?: Array<{ id: number; name: string; category?: string | null }>;
  budget: string;
  duration: string;
  roleType?: string;
  gigLocation?: string;
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    url?: string;
  }>;
  screeningQuestions: Array<{
    id: string;
    question: string;
  }>;
}

const DURATION_LABELS: { [key: string]: string } = {
  'less-than-1-month': 'Less than 1 month',
  '1-3-months': '1-3 months',
  '3-6-months': '3-6 months',
  '6-12-months': '6-12 months',
  '12-months-plus': '12 months or longer'
};

export default function GigCreationStep5() {
  const [gigData, setGigData] = useState<GigCreationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    details: true,
    cost: false,
    attachments: false,
    questions: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadGigData();
  }, []);

  const loadGigData = () => {
    try {
      const savedData = sessionStorage.getItem('gigCreationData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setGigData({
          ...data,
          selectedIndustries: data.selectedIndustries || []
        });
      } else {
        navigate('/gig-creation/step1');
      }
    } catch (error) {
      console.error('Error loading gig data:', error);
      navigate('/gig-creation/step1');
    } finally {
      setLoading(false);
    }
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEdit = (step: string) => {
    const stepRoutes: { [key: string]: string } = {
      details: '/gig-creation/step1',
      cost: '/gig-creation/step2',
      attachments: '/gig-creation/step3',
      questions: '/gig-creation/step4'
    };
    navigate(stepRoutes[step]);
  };

  const handleSubmit = async () => {
    if (!gigData) return;

    try {
      setSubmitting(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const industryIds = (gigData.selectedIndustries || [])
        .map((industry) => Number(industry.id))
        .filter((industryId) => !Number.isNaN(industryId));

      if (
        gigData.selectedIndustries &&
        gigData.selectedIndustries.length > 0 &&
        industryIds.length !== gigData.selectedIndustries.length
      ) {
        setError(
          'One or more selected industries could not be interpreted. Please return to step 1 and reselect the industries.'
        );
        return;
      }

      // Prepare project data for database
      const projectData = {
        creator_id: user.id,
        type: 'client', // Use 'client' as this is a client-created project
        title: gigData.gigName,
        description: gigData.gigDescription,
        skills_required: JSON.stringify(gigData.selectedSkills.map(skill => skill.id)),
        industries: industryIds,
        currency: 'USD',
        budget_min: parseFloat(gigData.budget),
        budget_max: parseFloat(gigData.budget),
        desired_amount_min: parseFloat(gigData.budget),
        desired_amount_max: parseFloat(gigData.budget),
        delivery_time_min: getDeliveryTimeMin(gigData.duration),
        delivery_time_max: getDeliveryTimeMax(gigData.duration),
        status: 'open',
        role_type: gigData.roleType || null,
        gig_location: gigData.gigLocation || null,
        screening_questions: gigData.screeningQuestions.length > 0 
          ? JSON.stringify(gigData.screeningQuestions.map(q => q.question))
          : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('🔍 Project data being inserted:', projectData);
      console.log('🔍 Status being set to:', projectData.status);

      // Insert project into database
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (projectError) {
        console.error('Error creating project:', projectError);
        setError('Failed to create project');
        return;
      }

      console.log('🔍 Project created successfully:', project);
      console.log('🔍 Project status in database:', project?.status);

      // Handle attachments - save URLs to database
      if (gigData.attachments && gigData.attachments.length > 0) {
        const attachmentUrls = gigData.attachments
          .filter(att => att.url) // Only include successfully uploaded files
          .map(att => att.url);

        if (attachmentUrls.length > 0) {
          const { error: updateError } = await supabase
            .from('projects')
            .update({ project_attachments: attachmentUrls })
            .eq('id', project.id);

          if (updateError) {
            console.error('Error updating project attachments:', updateError);
            // Don't fail the entire process for attachment errors
          }
        }
      }

      // Clear session storage
      sessionStorage.removeItem('gigCreationData');

      // Redirect to projects page or dashboard
      navigate('/projects');
    } catch (error) {
      console.error('Error creating gig:', error);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const getDeliveryTimeMin = (duration: string): number => {
    const timeMap: { [key: string]: number } = {
      'less-than-1-month': 1,
      '1-3-months': 30,
      '3-6-months': 90,
      '6-12-months': 180,
      '12-months-plus': 365
    };
    return timeMap[duration] || 1;
  };

  const getDeliveryTimeMax = (duration: string): number => {
    const timeMap: { [key: string]: number } = {
      'less-than-1-month': 30,
      '1-3-months': 90,
      '3-6-months': 180,
      '6-12-months': 365,
      '12-months-plus': 730
    };
    return timeMap[duration] || 30;
  };

  const handleBack = () => {
    navigate('/gig-creation/step4');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your gig details...</p>
        </div>
      </div>
    );
  }

  if (!gigData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load gig data</p>
          <Button onClick={loadGigData} variant="outline">
            Try Again
          </Button>
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
            <div className="ml-auto text-sm text-slate-500">Step 5 of 5</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Review Your Gig
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Please review all the details below. You can edit any section by clicking the edit button.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Gig Details Section */}
          <Card>
            <Collapsible 
              open={expandedSections.details} 
              onOpenChange={() => toggleSection('details')}
            >
              <CollapsibleTrigger asChild>
                <div className="p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Gig Details</h3>
                        <p className="text-sm text-slate-600">Name, description, and required skills</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit('details');
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {expandedSections.details ? (
                        <X className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 border-t border-slate-200">
                  <div className="pt-6 space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Gig Name</h4>
                      <p className="text-slate-700">{gigData.gigName}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                      <p className="text-slate-700 whitespace-pre-wrap">{gigData.gigDescription}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {gigData.selectedSkills.map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    {gigData.selectedIndustries && gigData.selectedIndustries.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Industries</h4>
                        <div className="flex flex-wrap gap-2">
                          {gigData.selectedIndustries.map((industry) => (
                            <span
                              key={industry.id}
                              className="inline-flex items-center px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-sm"
                            >
                              {industry.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Cost & Timeline Section */}
          <Card>
            <Collapsible 
              open={expandedSections.cost} 
              onOpenChange={() => toggleSection('cost')}
            >
              <CollapsibleTrigger asChild>
                <div className="p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Cost & Timeline</h3>
                        <p className="text-sm text-slate-600">Budget and project duration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit('cost');
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {expandedSections.cost ? (
                        <X className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 border-t border-slate-200">
                  <div className="pt-6 space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Budget</h4>
                      <p className="text-slate-700">{formatCurrency(gigData.budget)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Duration</h4>
                      <p className="text-slate-700">{DURATION_LABELS[gigData.duration]}</p>
                    </div>
                    {gigData.roleType && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Role Type</h4>
                        <p className="text-slate-700">
                          {gigData.roleType === 'in_person' ? 'In-person' : 
                           gigData.roleType === 'hybrid' ? 'Hybrid' : 
                           gigData.roleType === 'remote' ? 'Remote' : gigData.roleType}
                        </p>
                      </div>
                    )}
                    {gigData.gigLocation && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Gig Location</h4>
                        <p className="text-slate-700">{gigData.gigLocation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Attachments Section */}
          <Card>
            <Collapsible 
              open={expandedSections.attachments} 
              onOpenChange={() => toggleSection('attachments')}
            >
              <CollapsibleTrigger asChild>
                <div className="p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <File className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Attachments</h3>
                        <p className="text-sm text-slate-600">
                          {gigData.attachments.length} file{gigData.attachments.length !== 1 ? 's' : ''} uploaded
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit('attachments');
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {expandedSections.attachments ? (
                        <X className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 border-t border-slate-200">
                  <div className="pt-6">
                    {gigData.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {gigData.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <File className="w-4 h-4 text-slate-500" />
                              <div>
                                <p className="font-medium text-slate-900">{attachment.name}</p>
                                <p className="text-sm text-slate-500">
                                  {formatFileSize(attachment.size)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">No attachments uploaded</p>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Screening Questions Section */}
          <Card>
            <Collapsible 
              open={expandedSections.questions} 
              onOpenChange={() => toggleSection('questions')}
            >
              <CollapsibleTrigger asChild>
                <div className="p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Screening Questions</h3>
                        <p className="text-sm text-slate-600">
                          {gigData.screeningQuestions.length} question{gigData.screeningQuestions.length !== 1 ? 's' : ''} added
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit('questions');
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {expandedSections.questions ? (
                        <X className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 border-t border-slate-200">
                  <div className="pt-6">
                    {gigData.screeningQuestions.length > 0 ? (
                      <div className="space-y-3">
                        {gigData.screeningQuestions.map((question, index) => (
                          <div
                            key={question.id}
                            className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <p className="text-slate-700">{question.question}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">No screening questions added</p>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Back to Questions
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {submitting ? 'Creating Gig...' : 'Create Gig'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
