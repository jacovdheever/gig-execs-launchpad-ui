/**
 * Staff Vetting Review - View full profile and record vetting decision
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StaffRoute } from '@/components/staff/StaffRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { ProfileView } from '@/routes/profile/ProfileView';
import { ArrowLeft, Loader2, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface VettingDecision {
  id: string;
  staff_name: string;
  action: string;
  notes: string | null;
  requested_info_text: string | null;
  created_at: string;
}

interface ProfilePayload {
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    user_type: string;
    vetting_status: string;
  };
  profile: Record<string, unknown> | null;
  clientProfile: Record<string, unknown> | null;
  references: unknown[];
  education: unknown[];
  certifications: unknown[];
  workExperience: unknown[];
  portfolio: unknown[];
  vettingDecisions: VettingDecision[];
}

export default function StaffVerificationReviewPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProfilePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [requestedInfoText, setRequestedInfoText] = useState('');
  const [confirmAction, setConfirmAction] = useState<'approve' | 'decline' | null>(null);

  useEffect(() => {
    if (userId) loadProfile();
  }, [userId]);

  async function loadProfile() {
    if (!userId) return;
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/staff/login');
        return;
      }
      const resp = await fetch(`/.netlify/functions/staff-profile-for-vetting?userId=${encodeURIComponent(userId)}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Failed to load profile');
      setData(json);
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function submitVetting(vettingStatus: string) {
    if (!userId) return;
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const resp = await fetch('/.netlify/functions/staff-update-vetting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({
          userId,
          vettingStatus,
          notes: notes.trim() || undefined,
          requestedInfoText: vettingStatus === 'needs_info' ? (requestedInfoText.trim() || undefined) : undefined
        })
      });
      const result = await resp.json();
      if (!resp.ok) throw new Error(result.error || 'Request failed');
      setConfirmAction(null);
      setRequestedInfoText('');
      await loadProfile();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  }

  const lastDecision = data?.vettingDecisions?.[0];
  const name = data?.user ? [data.user.first_name, data.user.last_name].filter(Boolean).join(' ') || data.user.email : '';

  if (loading) {
    return (
      <StaffRoute>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </StaffRoute>
    );
  }

  if (!data) {
    return (
      <StaffRoute>
        <div className="min-h-screen bg-slate-50 p-6">
          <p className="text-slate-600">Profile not found.</p>
          <Button variant="link" className="mt-2" onClick={() => navigate('/staff/verifications')}>
            Back to list
          </Button>
        </div>
      </StaffRoute>
    );
  }

  const profileDataForView = {
    user: data.user,
    profile: data.profile,
    references: data.references,
    education: data.education,
    certifications: data.certifications,
    portfolio: data.portfolio
  };

  return (
    <StaffRoute>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate('/staff/verifications')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to list
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile column */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile under review</CardTitle>
                  <p className="text-sm text-slate-600">{name} · {data.user.email}</p>
                </CardHeader>
              </Card>
              {data.user.user_type === 'consultant' ? (
                <ProfileView profileData={profileDataForView} isOwner={false} />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Client profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.clientProfile && (
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                        {JSON.stringify(data.clientProfile, null, 2)}
                      </pre>
                    )}
                    {!data.clientProfile && <p className="text-slate-500">No client profile data.</p>}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Vetting panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Vetting actions</CardTitle>
                  {lastDecision && (
                    <p className="text-xs text-slate-500 mt-1">
                      Last: {lastDecision.action} by {lastDecision.staff_name} on {new Date(lastDecision.created_at).toLocaleString()}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Internal notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Notes for this review..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="requestedInfo">Request information (sent to user by email)</Label>
                    <Textarea
                      id="requestedInfo"
                      placeholder="e.g. Please provide a copy of your ID document and 2 professional references."
                      value={requestedInfoText}
                      onChange={(e) => setRequestedInfoText(e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                    <Button
                      className="w-full mt-2"
                      variant="outline"
                      disabled={submitting || !requestedInfoText.trim()}
                      onClick={() => submitVetting('needs_info')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request information
                    </Button>
                  </div>
                  <div className="pt-2 border-t flex flex-col gap-2">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={submitting}
                      onClick={() => setConfirmAction('approve')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      variant="destructive"
                      disabled={submitting}
                      onClick={() => setConfirmAction('decline')}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={() => !submitting && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>{confirmAction === 'approve' ? 'Approve profile?' : 'Decline profile?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmAction === 'approve'
              ? 'The user will receive an approval email and gain full access.'
              : 'The user will receive a decline email. You can add notes above before confirming.'}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmAction && submitVetting(confirmAction === 'approve' ? 'verified' : 'rejected')}
              disabled={submitting}
              className={confirmAction === 'decline' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmAction === 'approve' ? 'Approve' : 'Decline'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </StaffRoute>
  );
}
