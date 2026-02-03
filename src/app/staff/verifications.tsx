/**
 * Staff Verifications (Vetting) - List users pending vetting
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaffRoute } from '@/components/staff/StaffRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, CheckCircle, User, ChevronRight, Loader2 } from 'lucide-react';

interface PendingUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  user_type: string;
  vetting_status: string;
  created_at: string;
  updated_at: string;
}

export default function StaffVerificationsPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPending();
  }, []);

  async function loadPending() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/staff/login');
        return;
      }
      const resp = await fetch('/.netlify/functions/staff-pending-vetting', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Failed to load');
      setUsers(json.users || []);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  const name = (u: PendingUser) => [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email || 'Unknown';
  const roleLabel = (t: string) => t === 'consultant' ? 'Professional' : t === 'client' ? 'Client' : t;

  return (
    <StaffRoute>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={() => navigate('/staff/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                User Verifications
              </CardTitle>
              <p className="text-sm text-slate-600">
                Users who have submitted their profile for vetting. Click a row to review and approve or decline.
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              ) : users.length === 0 ? (
                <p className="text-slate-600 py-8 text-center">No users pending vetting.</p>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {users.map((u) => (
                    <li key={u.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/staff/verifications/${u.id}`)}
                        className="w-full flex items-center justify-between gap-4 py-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-slate-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">{name(u)}</p>
                            <p className="text-sm text-slate-500 truncate">{u.email}</p>
                          </div>
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex-shrink-0">
                            {roleLabel(u.user_type)}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded flex-shrink-0 ${
                            u.vetting_status === 'needs_info' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.vetting_status === 'needs_info' ? 'Needs info' : 'Pending'}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StaffRoute>
  );
}
