/**
 * Staff: directory of platform users — search, filters, link to detail.
 */

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaffRoute } from '@/components/staff/StaffRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface DirectoryUserRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  user_type: string;
  vetting_status: string | null;
  created_at: string;
  basic_profile_complete: boolean | null;
  full_profile_complete: boolean | null;
}

export default function StaffManageUsersPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [users, setUsers] = useState<DirectoryUserRow[]>([]);
  const [totalMatching, setTotalMatching] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 40;

  const [search, setSearch] = useState('');
  const [searchApplied, setSearchApplied] = useState('');
  const [userType, setUserType] = useState<string>('all');
  const [vettingStatus, setVettingStatus] = useState<string>('all');
  const [profileCompletion, setProfileCompletion] = useState<string>('any');
  const [registeredFrom, setRegisteredFrom] = useState('');
  const [registeredTo, setRegisteredTo] = useState('');

  const load = useCallback(async (nextOffset: number, append: boolean) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/staff/login');
        return;
      }
      const params = new URLSearchParams();
      if (searchApplied.trim()) params.set('search', searchApplied.trim());
      if (userType !== 'all') params.set('user_type', userType);
      if (vettingStatus !== 'all') {
        params.set('vetting_status', vettingStatus === 'unset' ? 'null' : vettingStatus);
      }
      if (profileCompletion !== 'any') params.set('profile_completion', profileCompletion);
      if (registeredFrom) params.set('registered_from', registeredFrom);
      if (registeredTo) params.set('registered_to', registeredTo);
      params.set('limit', String(limit));
      params.set('offset', String(nextOffset));

      const res = await fetch(`/.netlify/functions/staff-directory-users?${params}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load users');
      const rows = (json.users || []) as DirectoryUserRow[];
      setTotalMatching(json.total_matching ?? null);
      setHasMore(!!json.has_more);
      if (append) {
        setUsers((prev) => [...prev, ...rows]);
      } else {
        setUsers(rows);
      }
      setOffset(nextOffset);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [navigate, searchApplied, userType, vettingStatus, profileCompletion, registeredFrom, registeredTo, limit]);

  useEffect(() => {
    void load(0, false);
  }, [load]);

  function applySearch() {
    setSearchApplied(search);
  }

  return (
    <StaffRoute>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate('/staff/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to dashboard
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">View &amp; manage users</CardTitle>
              <p className="text-sm text-slate-600">
                Search platform accounts, filter by type and vetting, then open a user for full profile and billing tools.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3 md:items-end">
                <div className="flex-1 space-y-1">
                  <Label>Search (name or email)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                      placeholder="e.g. smith or @gmail"
                    />
                    <Button type="button" onClick={applySearch}>
                      <Search className="h-4 w-4 mr-1" />
                      Search
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 min-w-[140px]">
                  <Label>User type</Label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="consultant">Professional</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 min-w-[160px]">
                  <Label>Vetting status</Label>
                  <Select value={vettingStatus} onValueChange={setVettingStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unset">Not set</SelectItem>
                      <SelectItem value="pending">pending</SelectItem>
                      <SelectItem value="in_progress">in_progress</SelectItem>
                      <SelectItem value="verified">verified</SelectItem>
                      <SelectItem value="vetted">vetted</SelectItem>
                      <SelectItem value="rejected">rejected</SelectItem>
                      <SelectItem value="needs_info">needs_info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 min-w-[180px]">
                  <Label>Profile completion (professionals)</Label>
                  <Select value={profileCompletion} onValueChange={setProfileCompletion}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="basic_complete">Basic complete</SelectItem>
                      <SelectItem value="basic_incomplete">Basic incomplete</SelectItem>
                      <SelectItem value="full_complete">Full complete</SelectItem>
                      <SelectItem value="full_incomplete">Full incomplete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <Label>Registered from</Label>
                  <Input type="date" value={registeredFrom} onChange={(e) => setRegisteredFrom(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Registered to</Label>
                  <Input type="date" value={registeredTo} onChange={(e) => setRegisteredTo(e.target.value)} />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="self-end"
                  onClick={() => {
                    setSearch('');
                    setSearchApplied('');
                    setUserType('all');
                    setVettingStatus('all');
                    setProfileCompletion('any');
                    setRegisteredFrom('');
                    setRegisteredTo('');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                Users
                {totalMatching != null && (
                  <span className="text-slate-500 font-normal text-sm ml-2">({totalMatching} matching)</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && users.length === 0 ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              ) : users.length === 0 ? (
                <p className="text-slate-600 py-8 text-center">No users match these filters.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b text-slate-600">
                        <th className="py-2 pr-4 font-medium">Name</th>
                        <th className="py-2 pr-4 font-medium">Email</th>
                        <th className="py-2 pr-4 font-medium">Type</th>
                        <th className="py-2 pr-4 font-medium">Vetting</th>
                        <th className="py-2 pr-4 font-medium">Basic / full</th>
                        <th className="py-2 pr-4 font-medium">Registered</th>
                        <th className="py-2 font-medium w-32" />
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-2 pr-4">
                            {[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}
                          </td>
                          <td className="py-2 pr-4">{u.email}</td>
                          <td className="py-2 pr-4">{u.user_type}</td>
                          <td className="py-2 pr-4">{u.vetting_status || '—'}</td>
                          <td className="py-2 pr-4">
                            {u.user_type === 'consultant' ? (
                              <>
                                {u.basic_profile_complete ? '✓' : '✗'} basic · {u.full_profile_complete ? '✓' : '✗'} full
                              </>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-2 pr-4">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="py-2">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/staff/manage-users/${u.id}`)}>
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {hasMore && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    disabled={loadingMore}
                    onClick={() => void load(offset + limit, true)}
                  >
                    {loadingMore ? 'Loading…' : 'Load more'}
                  </Button>
                </div>
              )}
              {loading && users.length > 0 && (
                <p className="text-center text-slate-500 text-sm mt-2">Loading…</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StaffRoute>
  );
}
