import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Eye, EyeOff, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { fetchSubscriptionsMe, createPortalSession, type SubscriptionsMeResponse } from '@/lib/subscriptionApi';
import { useToast } from '@/hooks/use-toast';

export function SettingsPage() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionsMeResponse | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [userRole, setUserRole] = useState<'consultant' | 'client' | null>(null);
  const { toast } = useToast();

  // Load current user email on component mount
  React.useEffect(() => {
    const loadUserEmail = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setEmail(user.email || '');
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Error loading user email:', error);
      }
    };
    loadUserEmail();
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await getCurrentUser();
      if (!user || user.role !== 'consultant') return;
      setSubscriptionLoading(true);
      try {
        const data = await fetchSubscriptionsMe();
        if (!cancelled) setSubscription(data);
      } catch (e) {
        console.error('fetchSubscriptionsMe', e);
        if (!cancelled) setSubscription(null);
      } finally {
        if (!cancelled) setSubscriptionLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      toast({
        title: 'Email update initiated',
        description: 'Please check your new email address for a confirmation link.',
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: 'Error updating email',
        description: error.message || 'Failed to update email address. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'All fields required',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'New password and confirmation password must match.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated.',
      });

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Error updating password',
        description: error.message || 'Failed to update password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleOpenBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const { url, error } = await createPortalSession();
      if (error || !url) {
        toast({
          title: 'Unable to open billing portal',
          description: error === 'No billing customer on file. Subscribe first.'
            ? 'Choose a plan on the pricing page to start a subscription first.'
            : error || 'Please try again.',
          variant: 'destructive',
        });
        return;
      }
      window.location.href = url;
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Professional subscription (consultants) */}
          {userRole === 'consultant' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  Manage subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                {subscriptionLoading ? (
                  <p>Loading subscription…</p>
                ) : (
                  <>
                    {subscription ? (
                      <>
                        <p>
                          <span className="font-medium text-slate-900">Plan:</span>{' '}
                          {subscription.plan_key || '—'}
                        </p>
                        <p>
                          <span className="font-medium text-slate-900">Status:</span>{' '}
                          {subscription.subscription_status || 'none'}
                        </p>
                        <p>
                          <span className="font-medium text-slate-900">Current period ends:</span>{' '}
                          {subscription.current_period_end
                            ? new Date(subscription.current_period_end).toLocaleDateString()
                            : '—'}
                        </p>
                        <p>
                          <span className="font-medium text-slate-900">Auto-renewal:</span>{' '}
                          {subscription.cancel_at_period_end ? 'Off (ends at period end)' : 'On'}
                        </p>
                      </>
                    ) : (
                      <p className="text-slate-600">
                        Subscription details are unavailable right now. Try again later, or use the links below if you
                        already have a plan.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        type="button"
                        onClick={handleOpenBillingPortal}
                        disabled={portalLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {portalLoading ? 'Opening…' : 'Open billing portal'}
                      </Button>
                      <Button type="button" variant="outline" asChild>
                        <Link to="/pricing">View plans</Link>
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Update payment method, invoices, cancel at period end, or change plans in the secure Stripe
                      portal.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Email Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-slate-600" />
                Email Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    You will receive a confirmation email at the new address
                  </p>
                </div>
                <Button 
                  type="submit" 
                  disabled={isEmailLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isEmailLoading ? 'Updating...' : 'Update Email'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-600" />
                Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">
                    Current Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                    New Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm New Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isPasswordLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPasswordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
