import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  Loader2, 
  Sparkles, 
  User, 
  Bot,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ProfileCVUpload } from './ProfileCVUpload';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

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
    jobTitle: string;
    startDateYear?: number;
    endDateYear?: number;
    currentlyWorking?: boolean;
    description?: string;
  }>;
  education?: Array<{
    institutionName: string;
    degreeLevel: string;
    fieldOfStudy?: string;
  }>;
  skills?: string[];
  summary?: string;
}

interface Eligibility {
  yearsOfExperienceEstimate: number;
  meetsThreshold: boolean;
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
  seniorityIndicators?: string[];
}

interface ProfileAIChatProps {
  onComplete: (draftId: string, profile: DraftProfile) => void;
  onCancel?: () => void;
}

export function ProfileAIChat({ onComplete, onCancel }: ProfileAIChatProps) {
  const [draftId, setDraftId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draftProfile, setDraftProfile] = useState<DraftProfile>({});
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [nextStep, setNextStep] = useState('basic_info');
  const [isComplete, setIsComplete] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAuthToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  // Initialize the conversation
  useEffect(() => {
    const initConversation = async () => {
      try {
        const token = await getAuthToken();
        if (!token) {
          setError('Please log in to use AI profile creation');
          setIsInitializing(false);
          return;
        }

        const response = await fetch('/.netlify/functions/profile-ai-start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to start AI conversation');
        }

        const result = await response.json();
        
        setDraftId(result.draftId);
        setDraftProfile(result.draftProfile || {});
        setNextStep(result.nextStep || 'basic_info');
        setEligibility(result.eligibility || null);
        
        if (result.conversationHistory && result.conversationHistory.length > 0) {
          setMessages(result.conversationHistory);
        } else {
          setMessages([{ role: 'assistant', content: result.assistantMessage }]);
        }

        if (result.isResume) {
          toast({
            title: 'Welcome back!',
            description: 'Continuing your profile creation session.',
          });
        }

      } catch (err) {
        console.error('Init error:', err);
        setError(err instanceof Error ? err.message : 'Failed to start conversation');
      } finally {
        setIsInitializing(false);
      }
    };

    initConversation();
  }, [toast]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || !draftId || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await fetch('/.netlify/functions/profile-ai-continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          draftId,
          userMessage: message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      const result = await response.json();

      // Add assistant response
      const assistantMessage: Message = { role: 'assistant', content: result.assistantMessage };
      setMessages(prev => [...prev, assistantMessage]);

      // Update state
      setDraftProfile(result.draftProfile || draftProfile);
      setNextStep(result.nextStep);
      setIsComplete(result.isComplete);
      
      if (result.eligibility) {
        setEligibility(result.eligibility);
      }

      if (result.isComplete) {
        toast({
          title: 'Profile ready for review!',
          description: 'Click "Review & Publish" to finalize your profile.',
        });
      }

    } catch (err) {
      console.error('Send error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove the user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleCVUploadComplete = async (data: any) => {
    setShowUpload(false);
    
    // Send a message about the uploaded CV
    await sendMessage(`I've just uploaded my CV. Please use it to help build my profile.`);
  };

  const handleReviewAndPublish = () => {
    if (draftId && draftProfile) {
      onComplete(draftId, draftProfile);
    }
  };

  const getStepLabel = (step: string): string => {
    const labels: Record<string, string> = {
      'basic_info': 'Basic Information',
      'experience': 'Work Experience',
      'education': 'Education',
      'skills': 'Skills',
      'certifications': 'Certifications',
      'languages': 'Languages',
      'summary': 'Summary',
      'eligibility_review': 'Eligibility Review',
      'complete': 'Complete'
    };
    return labels[step] || step;
  };

  if (showUpload) {
    return (
      <ProfileCVUpload
        onParseComplete={handleCVUploadComplete}
        onCancel={() => setShowUpload(false)}
      />
    );
  }

  if (isInitializing) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Starting AI assistant...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !draftId) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Panel */}
      <Card className="lg:col-span-2 flex flex-col h-[600px]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Create Profile with AI</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{getStepLabel(nextStep)}</Badge>
              {isComplete && (
                <Badge variant="default" className="bg-green-600">Ready</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <Separator />

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.filter(m => m.role !== 'system').map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {error && (
          <div className="px-4 pb-2">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <Separator />

        {/* Input */}
        <div className="p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowUpload(true)}
              disabled={isLoading}
              title="Upload CV"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex gap-2 mt-3 justify-between">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save & Exit
              </Button>
            )}
            <Button
              onClick={handleReviewAndPublish}
              disabled={!isComplete || isLoading}
              className="ml-auto"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Review & Publish
            </Button>
          </div>
        </div>
      </Card>

      {/* Draft Profile Panel */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Profile Draft</CardTitle>
        </CardHeader>
        
        <Separator />

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Basic Info */}
            {draftProfile.basicInfo && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Basic Info
                </div>
                <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                  {draftProfile.basicInfo.firstName && (
                    <p>{draftProfile.basicInfo.firstName} {draftProfile.basicInfo.lastName}</p>
                  )}
                  {draftProfile.basicInfo.headline && (
                    <p className="text-xs">{draftProfile.basicInfo.headline}</p>
                  )}
                  {draftProfile.basicInfo.location && (
                    <p className="text-xs">{draftProfile.basicInfo.location}</p>
                  )}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {draftProfile.workExperience && draftProfile.workExperience.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-4 w-4" />
                  Experience ({draftProfile.workExperience.length})
                </div>
                <div className="pl-6 space-y-2">
                  {draftProfile.workExperience.slice(0, 3).map((exp, i) => (
                    <div key={i} className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{exp.jobTitle}</p>
                      <p className="text-xs">{exp.company}</p>
                    </div>
                  ))}
                  {draftProfile.workExperience.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{draftProfile.workExperience.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {draftProfile.education && draftProfile.education.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GraduationCap className="h-4 w-4" />
                  Education ({draftProfile.education.length})
                </div>
                <div className="pl-6 space-y-2">
                  {draftProfile.education.slice(0, 2).map((edu, i) => (
                    <div key={i} className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{edu.degreeLevel}</p>
                      <p className="text-xs">{edu.institutionName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {draftProfile.skills && draftProfile.skills.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wrench className="h-4 w-4" />
                  Skills ({draftProfile.skills.length})
                </div>
                <div className="pl-6 flex flex-wrap gap-1">
                  {draftProfile.skills.slice(0, 6).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {draftProfile.skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{draftProfile.skills.length - 6}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Eligibility */}
            {eligibility && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {eligibility.meetsThreshold ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  )}
                  Eligibility
                </div>
                <div className="pl-6 text-sm text-muted-foreground">
                  <p>~{eligibility.yearsOfExperienceEstimate} years experience</p>
                  <p className="text-xs mt-1">
                    {eligibility.meetsThreshold 
                      ? 'Meets GigExecs criteria' 
                      : 'May not meet 15+ year threshold'}
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!draftProfile.basicInfo && !draftProfile.workExperience?.length && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Your profile will appear here as you chat</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

export default ProfileAIChat;

