/**
 * Staff: single platform user — tabs for overview, profile, vetting, billing, activity.
 */

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StaffRoute, useStaffUser } from '@/components/staff/StaffRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { fetchAuditLogs } from '@/lib/audit';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

type ProfilePayload = {
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    user_type: string;
    vetting_status: string;
    created_at?: string;
  };
  profile: Record<string, unknown> | null;
  clientProfile: Record<string, unknown> | null;
};

function isAdminRole(role: string | undefined) {
  return role === 'admin' || role === 'super_user';
}

export default function StaffManageUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { staff } = useStaffUser();
  const admin = isAdminRole(staff?.role);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfilePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [fn, setFn] = useState('');
  const [ln, setLn] = useState('');
  const [savingOverview, setSavingOverview] = useState(false);

  const [consForm, setConsForm] = useState<Record<string, string>>({});
  const [clientForm, setClientForm] = useState<Record<string, string>>({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [vettingStatus, setVettingStatus] = useState('');
  const [vettingNotes, setVettingNotes] = useState('');
  const [requestedInfo, setRequestedInfo] = useState('');
  const [vettingSubmitting, setVettingSubmitting] = useState(false);

  const [staffSub, setStaffSub] = useState<{ subscriptions: Record<string, unknown>[]; payments: Record<string, unknown>[] } | null>(null);
  const [staffSubNote, setStaffSubNote] = useState('');
  const [savingSubNote, setSavingSubNote] = useState(false);

  const [auditLogs, setAuditLogs] = useState<Record<string, unknown>[]>([]);

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/staff/login');
        return;
      }
      const resp = await fetch(`/.netlify/functions/staff-profile-for-vetting?userId=${encodeURIComponent(userId)}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Failed to load user');
      setData(json as ProfilePayload);
      setFn(json.user?.first_name || '');
      setLn(json.user?.last_name || '');
      setVettingStatus(json.user?.vetting_status || 'pending');
      const p = json.profile as Record<string, unknown> | null;
      if (json.user?.user_type === 'consultant' && p) {
        setConsForm({
          job_title: String(p.job_title ?? ''),
          bio: String(p.bio ?? ''),
          address1: String(p.address1 ?? ''),
          address2: String(p.address2 ?? ''),
          address3: String(p.address3 ?? ''),
          country: String(p.country ?? ''),
          postal_code: String(p.postal_code ?? ''),
          phone: String(p.phone ?? ''),
          linkedin_url: String(p.linkedin_url ?? ''),
          video_intro_url: String(p.video_intro_url ?? ''),
          availability: String(p.availability ?? ''),
          hourly_rate_min: String(p.hourly_rate_min ?? ''),
          hourly_rate_max: String(p.hourly_rate_max ?? ''),
        });
      }
      const c = json.clientProfile as Record<string, unknown> | null;
      if (json.user?.user_type === 'client' && c) {
        setClientForm({
          company_name: String(c.company_name ?? ''),
          website: String(c.website ?? ''),
          description: String(c.description ?? ''),
          industry: String(c.industry ?? ''),
          organisation_type: String(c.organisation_type ?? ''),
          address1: String(c.address1 ?? ''),
          address2: String(c.address2 ?? ''),
          address3: String(c.address3 ?? ''),
          country: String(c.country ?? ''),
          postal_code: String(c.postal_code ?? ''),
          phone: String(c.phone ?? ''),
          linkedin_url: String(c.linkedin_url ?? ''),
        });
      }

      if (json.user?.user_type === 'consultant') {
        const r = await fetch(`/.netlify/functions/staff-user-subscriptions?userId=${encodeURIComponent(userId)}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const sj = await r.json();
        if (r.ok) setStaffSub({ subscriptions: sj.subscriptions || [], payments: sj.payments || [] });
        else setStaffSub({ subscriptions: [], payments: [] });
      } else {
        setStaffSub(null);
      }

      const logs = await fetchAuditLogs({ targetId: userId, limit: 100 });
      setAuditLogs(logs as Record<string, unknown>[]);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Failed to load');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function saveOverview() {
    if (!userId) return;
    setSavingOverview(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const resp = await fetch('/.netlify/functions/staff-platform-user-patch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId,
          users: { first_name: fn.trim(), last_name: ln.trim() },
        }),
      });
      const j = await resp.json();
      if (!resp.ok) throw new Error(j.error || 'Save failed');
      await loadProfile();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSavingOverview(false);
    }
  }

  async function saveProfileTab() {
    if (!userId || !data) return;
    setSavingProfile(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const body: Record<string, unknown> = { userId };
      if (data.user.user_type === 'consultant') {
        const patch: Record<string, string | null> = {};
        for (const [k, v] of Object.entries(consForm)) {
          patch[k] = v.trim() === '' ? null : v.trim();
        }
        body.consultant_profile = patch;
      } else {
        const patch: Record<string, string | null> = {};
        for (const [k, v] of Object.entries(clientForm)) {
          patch[k] = v.trim() === '' ? null : v.trim();
        }
        body.client_profile = patch;
      }
      const resp = await fetch('/.netlify/functions/staff-platform-user-patch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      });
      const j = await resp.json();
      if (!resp.ok) throw new Error(j.error || 'Save failed');
      await loadProfile();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSavingProfile(false);
    }
  }

  async function submitVetting() {
    if (!userId) return;
    setVettingSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const resp = await fetch('/.netlify/functions/staff-update-vetting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId,
          vettingStatus,
          notes: vettingNotes.trim() || undefined,
          requestedInfoText: vettingStatus === 'needs_info' ? requestedInfo.trim() || undefined : undefined,
        }),
      });
      const j = await resp.json();
      if (!resp.ok) throw new Error(j.error || 'Update failed');
      setVettingNotes('');
      setRequestedInfo('');
      await loadProfile();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setVettingSubmitting(false);
    }
  }

  async function saveStaffSubscriptionNote() {
    if (!userId || !staffSubNote.trim()) return;
    setSavingSubNote(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const resp = await fetch('/.netlify/functions/staff-subscription-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'add_note', userId, note: staffSubNote.trim() }),
      });
      const j = await resp.json();
      if (!resp.ok) throw new Error(j.error || 'Failed');
      setStaffSubNote('');
      alert('Note recorded in audit log.');
      await loadProfile();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed');
    } finally {
      setSavingSubNote(false);
    }
  }

  async function requestStripeRefund(paymentId: string) {
    if (!userId || !admin) return;
    if (!window.confirm('Create a full Stripe refund for this payment?')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const resp = await fetch('/.netlify/functions/staff-subscription-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'stripe_refund_payment',
          userId,
          paymentId,
          reason: 'staff_refund',
        }),
      });
      const j = await resp.json();
      if (!resp.ok) throw new Error(j.error || 'Refund failed');
      alert(`Refund: ${j.stripe_refund_id || 'ok'}`);
      await loadProfile();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Refund failed');
    }
  }

  async function cancelSubscription(subId: string, immediate: boolean) {
    if (!userId || !admin) return;
    const msg = immediate
      ? 'Cancel this subscription immediately in Stripe?'
      : 'Schedule cancellation at the end of the current billing period?';
    if (!window.confirm(msg)) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const resp = await fetch('/.netlify/functions/staff-subscription-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'stripe_cancel_subscription',
          userId,
          userSubscriptionId: subId,
          immediate,
        }),
      });
      const j = await resp.json();
      if (!resp.ok) throw new Error(j.error || 'Cancel failed');
      await loadProfile();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Cancel failed');
    }
  }

  async function resumeSubscription(subId: string) {
    if (!userId || !admin) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const resp = await fetch('/.netlify/functions/staff-subscription-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'stripe_resume_subscription',
          userId,
          userSubscriptionId: subId,
        }),
      });
      const j = await resp.json();
      if (!resp.ok) throw new Error(j.error || 'Resume failed');
      await loadProfile();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Resume failed');
    }
  }

  if (loading && !data) {
    return (
      <StaffRoute>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </StaffRoute>
    );
  }

  if (error || !data) {
    return (
      <StaffRoute>
        <div className="min-h-screen bg-slate-50 p-6">
          <p className="text-slate-600">{error || 'User not found.'}</p>
          <Button variant="link" onClick={() => navigate('/staff/manage-users')}>Back to directory</Button>
        </div>
      </StaffRoute>
    );
  }

  const u = data.user;
  const title = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email;
  const billing = u.user_type === 'consultant' ? (staffSub ?? { subscriptions: [], payments: [] }) : null;

  return (
    <StaffRoute>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="ghost" onClick={() => navigate('/staff/manage-users')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Directory
            </Button>
            {u.user_type === 'consultant' && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/staff/verifications/${userId}`)}>
                Open vetting workflow
              </Button>
            )}
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-600">{u.email} · {u.user_type} · Joined {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              {u.user_type === 'consultant' && <TabsTrigger value="vetting">Vetting</TabsTrigger>}
              {u.user_type === 'consultant' && <TabsTrigger value="billing">Billing</TabsTrigger>}
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">User ID</span>
                      <p className="font-mono text-xs break-all">{u.id}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Vetting status</span>
                      <p>{u.vetting_status || '—'}</p>
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <Label>First name</Label>
                    <Input value={fn} onChange={(e) => setFn(e.target.value)} />
                    <Label>Last name</Label>
                    <Input value={ln} onChange={(e) => setLn(e.target.value)} />
                    <Button size="sm" disabled={savingOverview} onClick={() => void saveOverview()}>
                      {savingOverview ? 'Saving…' : 'Save name'}
                    </Button>
                    <p className="text-xs text-slate-500">Support and above. Logged to audit.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {u.user_type === 'consultant' ? 'Professional profile' : 'Client profile'}
                  </CardTitle>
                  {!admin && (
                    <p className="text-sm text-amber-700">Admin role required to edit profile fields.</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {u.user_type === 'consultant' ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.keys(consForm).map((key) => (
                        <div key={key} className={key === 'bio' ? 'sm:col-span-2' : ''}>
                          <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                          {key === 'bio' ? (
                            <Textarea
                              className="mt-1"
                              rows={4}
                              value={consForm[key]}
                              disabled={!admin}
                              onChange={(e) => setConsForm((s) => ({ ...s, [key]: e.target.value }))}
                            />
                          ) : (
                            <Input
                              className="mt-1"
                              value={consForm[key]}
                              disabled={!admin}
                              onChange={(e) => setConsForm((s) => ({ ...s, [key]: e.target.value }))}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.keys(clientForm).map((key) => (
                        <div key={key} className={key === 'description' ? 'sm:col-span-2' : ''}>
                          <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                          {key === 'description' ? (
                            <Textarea
                              className="mt-1"
                              rows={4}
                              value={clientForm[key]}
                              disabled={!admin}
                              onChange={(e) => setClientForm((s) => ({ ...s, [key]: e.target.value }))}
                            />
                          ) : (
                            <Input
                              className="mt-1"
                              value={clientForm[key]}
                              disabled={!admin}
                              onChange={(e) => setClientForm((s) => ({ ...s, [key]: e.target.value }))}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <Button disabled={!admin || savingProfile} onClick={() => void saveProfileTab()}>
                    {savingProfile ? 'Saving…' : 'Save profile changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {u.user_type === 'consultant' && (
              <TabsContent value="vetting">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Vetting</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="space-y-2 max-w-md">
                      <Label>Status</Label>
                      <Select value={vettingStatus} onValueChange={setVettingStatus}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">pending</SelectItem>
                          <SelectItem value="in_progress">in_progress</SelectItem>
                          <SelectItem value="verified">verified</SelectItem>
                          <SelectItem value="vetted">vetted</SelectItem>
                          <SelectItem value="rejected">rejected</SelectItem>
                          <SelectItem value="needs_info">needs_info</SelectItem>
                          <SelectItem value="incomplete">incomplete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {vettingStatus === 'needs_info' && (
                      <div>
                        <Label>Requested info (email to user)</Label>
                        <Textarea className="mt-1" rows={3} value={requestedInfo} onChange={(e) => setRequestedInfo(e.target.value)} />
                      </div>
                    )}
                    <div>
                      <Label>Internal notes</Label>
                      <Textarea className="mt-1" rows={2} value={vettingNotes} onChange={(e) => setVettingNotes(e.target.value)} />
                    </div>
                    <Button disabled={vettingSubmitting} onClick={() => void submitVetting()}>
                      {vettingSubmitting ? 'Saving…' : 'Update vetting'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {u.user_type === 'consultant' && billing && (
              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Subscriptions &amp; payments</CardTitle>
                    <p className="text-xs text-slate-600">Refunds and Stripe subscription cancel/resume require admin.</p>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Subscriptions</p>
                      {billing.subscriptions.length === 0 ? (
                        <p className="text-slate-500">No subscription records.</p>
                      ) : (
                        <ul className="space-y-3">
                          {billing.subscriptions.map((s) => (
                            <li key={String(s.id)} className="border border-slate-200 rounded-md p-3 space-y-2">
                              <div>
                                {(s.plan_key as string) || '—'} — {(s.status as string) || '—'}
                                {s.current_period_end ? (
                                  <span className="text-slate-500"> · period end {new Date(String(s.current_period_end)).toLocaleDateString()}</span>
                                ) : null}
                                {s.cancel_at_period_end ? (
                                  <span className="text-amber-700 block text-xs">Cancel at period end</span>
                                ) : null}
                              </div>
                              {admin && s.stripe_subscription_id ? (
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => void cancelSubscription(String(s.id), false)}
                                  >
                                    Cancel at period end
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => void cancelSubscription(String(s.id), true)}
                                  >
                                    Cancel immediately
                                  </Button>
                                  {s.cancel_at_period_end ? (
                                    <Button type="button" size="sm" variant="secondary" onClick={() => void resumeSubscription(String(s.id))}>
                                      Resume subscription
                                    </Button>
                                  ) : null}
                                </div>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Recent payments</p>
                      {billing.payments.length === 0 ? (
                        <p className="text-slate-500">No payment records.</p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-2">
                          {billing.payments.slice(0, 15).map((p) => (
                            <li key={String(p.id)} className="flex flex-wrap items-center gap-2 justify-between">
                              <span>
                                {(p.status as string) || '—'} — {String(p.amount ?? '—')} {(p.currency as string) || ''}
                              </span>
                              {admin && p.stripe_charge_id ? (
                                <Button type="button" size="sm" variant="outline" onClick={() => void requestStripeRefund(String(p.id))}>
                                  Refund
                                </Button>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <Label>Staff note (audit log)</Label>
                      <Textarea className="mt-1" rows={2} value={staffSubNote} onChange={(e) => setStaffSubNote(e.target.value)} />
                      <Button
                        type="button"
                        size="sm"
                        className="mt-2"
                        disabled={savingSubNote || !staffSubNote.trim()}
                        onClick={() => void saveStaffSubscriptionNote()}
                      >
                        {savingSubNote ? 'Saving…' : 'Save note'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Audit log (this user)</CardTitle>
                </CardHeader>
                <CardContent>
                  {auditLogs.length === 0 ? (
                    <p className="text-slate-500 text-sm">No audit entries with this user as target.</p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {auditLogs.map((log) => (
                        <li key={String(log.id)} className="border border-slate-100 rounded p-2">
                          <div className="text-slate-900 font-medium">{(log.action_type as string) || '—'}</div>
                          <div className="text-xs text-slate-500">
                            {log.created_at ? new Date(String(log.created_at)).toLocaleString() : ''}
                            {log.staff && typeof log.staff === 'object' && log.staff !== null && 'first_name' in log.staff ? (
                              <span>
                                {' '}
                                · {String((log.staff as { first_name?: string }).first_name)}{' '}
                                {String((log.staff as { last_name?: string }).last_name)}
                              </span>
                            ) : null}
                          </div>
                          {log.details ? (
                            <pre className="text-xs mt-1 text-slate-600 whitespace-pre-wrap font-sans">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StaffRoute>
  );
}
