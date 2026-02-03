import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppShell } from '@/components/AppShell';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react';

interface UserInfo {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  user_type: string | null;
}

export default function Feedback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form state
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');

  // Check authentication and load user data
  useEffect(() => {
    const checkAuthAndLoadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Redirect to login if not authenticated
          toast({
            title: 'Authentication required',
            description: 'Please log in to submit feedback.',
            variant: 'destructive',
          });
          navigate('/auth/login', { state: { returnTo: '/feedback' } });
          return;
        }

        // Fetch user details
        const { data: userData, error } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, user_type')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user:', error);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            first_name: null,
            last_name: null,
            user_type: null,
          });
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadUser();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !feedback.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please select a category and enter your feedback.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Session expired',
          description: 'Please log in again to submit feedback.',
          variant: 'destructive',
        });
        navigate('/auth/login');
        return;
      }

      const response = await fetch('/.netlify/functions/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          category,
          subject: subject.trim() || `${category} feedback`,
          feedback: feedback.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit feedback');
      }

      setIsSubmitted(true);
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback! We appreciate you helping us improve.',
      });

    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
    setCategory('');
    setSubject('');
    setFeedback('');
  };

  useEffect(() => {
    document.title = 'Feedback - GigExecs';
  }, []);

  if (isLoading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#0284C7] mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF]">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <MessageSquare className="w-8 h-8 text-[#0284C7]" />
                <h1 className="text-3xl font-bold text-gray-900">Share Your Feedback</h1>
              </div>
              <p className="text-gray-600">
                Help us improve GigExecs. Your feedback matters.
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isSubmitted ? (
            // Success State
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thank You!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your feedback has been submitted successfully. We appreciate you taking the time to help us improve GigExecs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={handleSubmitAnother}
                    variant="outline"
                  >
                    Submit More Feedback
                  </Button>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-[#0284C7] hover:bg-[#0369A1]"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Feedback Form
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle>We'd love to hear from you</CardTitle>
                <CardDescription>
                  Whether it's a suggestion, a bug report, or just general feedback — we're listening.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Info Display */}
                  {user && (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <p className="text-sm text-gray-500 mb-1">Submitting as:</p>
                      <p className="font-medium text-gray-900">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user.email}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  )}

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Feedback</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="ui">UI/UX Improvement</SelectItem>
                        <SelectItem value="performance">Performance Issue</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject (Optional)</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief summary of your feedback"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      maxLength={200}
                    />
                  </div>

                  {/* Feedback */}
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Your Feedback *</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Please share your thoughts, suggestions, or describe the issue you encountered..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={6}
                      maxLength={5000}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {feedback.length}/5000 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !category || !feedback.trim()}
                    className="w-full bg-[#0284C7] hover:bg-[#0369A1]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Your feedback will be sent to our team at help@gigexecs.com
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
