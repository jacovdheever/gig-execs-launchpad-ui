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
import { ProfileStatusCard } from '@/components/profile/ProfileStatusCard';
import { SectionCard } from '@/components/profile/SectionCard';
import { BasicInfoView } from '@/components/profile/BasicInfoView';
import { ReferencesView } from '@/components/profile/ReferencesView';
import { QualificationsView } from '@/components/profile/QualificationsView';
import { CertificationsView } from '@/components/profile/CertificationsView';
import { PortfolioView } from '@/components/profile/PortfolioView';
import { computeProfessionalProfileStatus } from '@/lib/profileStatus';
import { ArrowLeft, Loader2, CheckCircle, XCircle, MessageSquare, AlertTriangle, RotateCcw, Eye, FileText } from 'lucide-react';
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
  counts?: {
    workExperienceCount: number;
    skillsCount: number;
    languagesCount: number;
    industriesCount: number;
    referencesCount: number;
    educationCount: number;
    certificationsCount: number;
  };
}

export default function StaffVerificationReviewPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProfilePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [requestedInfoText, setRequestedInfoText] = useState('');
  const [confirmAction, setConfirmAction] = useState<'approve' | 'decline' | 'incomplete' | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

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
      if (vettingStatus === 'incomplete') {
        navigate('/staff/verifications');
      } else {
        await loadProfile();
      }
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  }

  const lastDecision = data?.vettingDecisions?.[0];
  const name = data?.user ? [data.user.first_name, data.user.last_name].filter(Boolean).join(' ') || data.user.email : '';

  // Compute profile status using new 4-level system (for ProfileStatusCard)
  const counts = data?.counts ?? {
    workExperienceCount: data?.workExperience?.length ?? 0,
    skillsCount: 0,
    languagesCount: 0,
    industriesCount: 0,
    referencesCount: data?.references?.length ?? 0,
    educationCount: data?.education?.length ?? 0,
    certificationsCount: data?.certifications?.length ?? 0,
  };
  const profileStatus = data?.user && data?.profile
    ? computeProfessionalProfileStatus(
        {
          id: data.user.id,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          email: data.user.email,
          vetting_status: data.user.vetting_status as 'pending' | 'in_progress' | 'verified' | 'vetted' | 'rejected' | null,
        },
        {
          user_id: data.user.id,
          job_title: (data.profile as { job_title?: string }).job_title,
          address1: (data.profile as { address1?: string }).address1,
          country: (data.profile as { country?: string }).country,
          country_id: (data.profile as { country_id?: number }).country_id,
          hourly_rate_min: (data.profile as { hourly_rate_min?: number }).hourly_rate_min as number | null,
          hourly_rate_max: (data.profile as { hourly_rate_max?: number }).hourly_rate_max as number | null,
          id_doc_url: (data.profile as { id_doc_url?: string }).id_doc_url,
        },
        counts
      )
    : null;
  const statusForCard = profileStatus ? { ...profileStatus, ctaDisabled: true } : null;

  async function handleViewDocument(filePath: string) {
    setLoadingDoc(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const resp = await fetch('/.netlify/functions/staff-get-document-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ filePath }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Failed to get document link');
      if (json.signedUrl) window.open(json.signedUrl, '_blank');
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Could not open document');
    } finally {
      setLoadingDoc(false);
    }
  }

  // Completeness check (consultants only): 2 references + ID document required
  const isConsultant = data?.user?.user_type === 'consultant';
  const refCount = data?.references?.length ?? 0;
  const hasIdDoc = !!(data?.profile as { id_doc_url?: string } | null)?.id_doc_url;
  const meetsMinimums = !isConsultant || (refCount >= 2 && hasIdDoc);
  const missingReqs: string[] = [];
  if (isConsultant) {
    if (refCount < 2) missingReqs.push(`${2 - refCount} more reference${refCount === 0 ? 's' : ''} needed`);
    if (!hasIdDoc) missingReqs.push('ID document');
  }

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
    references: data.references as { id: number; first_name: string; last_name: string; email: string; company_name?: string; description?: string }[],
    education: data.education as { id: number; institution_name: string; degree_level: string; description?: string }[],
    certifications: data.certifications as { id: number; name: string; awarding_body: string; credential_url?: string }[],
    portfolio: data.portfolio as { id: number; project_name: string; project_role?: string; description?: string }[]
  };
  const idDocUrl = (data.profile as { id_doc_url?: string } | null)?.id_doc_url;

  return (
    <StaffRoute>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate('/staff/verifications')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to list
          </Button>

          {!meetsMinimums && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Profile does not meet minimum requirements</p>
                <p className="text-sm text-amber-700 mt-1">
                  Missing: {missingReqs.join(', ')}. Consider marking as incomplete so the user can finish their profile.
                </p>
              </div>
            </div>
          )}

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
                <>
                  {/* Profile completeness - new 4-level ProfileStatusCard */}
                  <ProfileStatusCard status={statusForCard} onCtaClick={() => {}} />

                  {/* Uploaded documents - ID proof */}
                  <SectionCard title="Uploaded Documents">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-slate-500" />
                          <div>
                            <p className="font-medium text-slate-900">Proof of Identity</p>
                            <p className="text-sm text-slate-500">
                              {idDocUrl ? 'Document uploaded' : 'No document uploaded'}
                            </p>
                          </div>
                        </div>
                        {idDocUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDocument(idDocUrl)}
                            disabled={loadingDoc}
                          >
                            {loadingDoc ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </SectionCard>

                  {/* Profile sections */}
                  <SectionCard title="Basic Information">
                    <BasicInfoView user={data.user} profile={data.profile as Record<string, unknown>} />
                  </SectionCard>
                  <SectionCard title="Professional References">
                    <ReferencesView references={profileDataForView.references} />
                  </SectionCard>
                  <SectionCard title="Educational Qualifications">
                    <QualificationsView qualifications={profileDataForView.education} />
                  </SectionCard>
                  <SectionCard title="Professional Certifications">
                    <CertificationsView certifications={profileDataForView.certifications} />
                  </SectionCard>
                  <SectionCard title="Portfolio Projects">
                    <PortfolioView portfolio={profileDataForView.portfolio} />
                  </SectionCard>
                </>
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
                      variant="outline"
                      className="w-full"
                      disabled={submitting}
                      onClick={() => setConfirmAction('incomplete')}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Mark as incomplete
                    </Button>
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
          <AlertDialogTitle>
            {confirmAction === 'approve' && 'Approve profile?'}
            {confirmAction === 'decline' && 'Decline profile?'}
            {confirmAction === 'incomplete' && 'Mark as incomplete?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {confirmAction === 'approve' && 'The user will receive an approval email and gain full access.'}
            {confirmAction === 'decline' && 'The user will receive a decline email. You can add notes above before confirming.'}
            {confirmAction === 'incomplete' && 'The profile will be removed from the vetting queue. The user can continue editing and will need to re-submit when their profile meets the minimum requirements.'}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirmAction) return;
                if (confirmAction === 'incomplete') submitVetting('incomplete');
                else submitVetting(confirmAction === 'approve' ? 'verified' : 'rejected');
              }}
              disabled={submitting}
              className={confirmAction === 'decline' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmAction === 'approve' ? 'Approve' : confirmAction === 'decline' ? 'Decline' : 'Mark incomplete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </StaffRoute>
  );
}
