/**
 * Staff Dashboard Page
 * 
 * Main dashboard for GigExecs staff with key metrics and quick actions
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StaffRoute, useStaffUser } from '@/components/staff/StaffRoute';
import { 
  Users, 
  Briefcase, 
  CheckCircle, 
  DollarSign, 
  FileText,
  TrendingUp,
  LogOut,
  Settings,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface DashboardStats {
  total_professionals: number;
  total_clients: number;
  verified_users: number;
  total_gigs: number;
  total_bids: number;
  total_transaction_value: number;
  active_external_gigs: number;
}

type DateRange = 'all' | 'week' | 'month' | 'quarter' | 'year';

export default function StaffDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { staff } = useStaffUser();
  const navigate = useNavigate();

  // Function to calculate date range based on selection
  const getDateRange = () => {
    if (startDate && endDate) {
      return { start: startDate, end: endDate };
    }

    const now = new Date();
    const ranges: Record<DateRange, { days: number }> = {
      all: { days: Infinity },
      week: { days: 7 },
      month: { days: 30 },
      quarter: { days: 90 },
      year: { days: 365 }
    };

    const range = ranges[dateRange];
    if (range.days === Infinity) {
      return null;
    }

    const start = new Date(now);
    start.setDate(start.getDate() - range.days);
    
    return {
      start: start.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    };
  };

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const dateFilter = getDateRange();
        
        console.log('📊 Loading dashboard stats...', { dateFilter, dateRange });
        
        // Helper to apply date filters to a query
        const withDate = (q: any, column: string) => {
          if (!dateFilter) return q;
          return q.gte(column, `${dateFilter.start}T00:00:00Z`).lte(column, `${dateFilter.end}T23:59:59Z`);
        };

        // Build queries aligned to schema fields:
        // users.created_at, users.updated_at, projects.created_at, bids.created_at, payments.created_at
        const professionalsQ = withDate(
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('user_type', 'consultant'),
          'created_at'
        );
        const clientsQ = withDate(
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('user_type', 'client'),
          'created_at'
        );
        const verifiedQ = withDate(
          supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
            .in('vetting_status', ['verified', 'vetted']),
          // Use updated_at as the closest proxy to verification moment
          'updated_at'
        );
        const gigsQ = withDate(
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          'created_at'
        );
        const bidsQ = withDate(
          supabase.from('bids').select('id', { count: 'exact', head: true }),
          'created_at'
        );
        const paymentsQ = withDate(
          supabase.from('payments').select('amount, created_at'),
          'created_at'
        );
        
        // Active external gigs: project_origin='external', status='open', not expired, not deleted
        // Note: expires_at can be null (never expires) or in the future
        const now = new Date().toISOString();
        const externalGigsQ = supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('project_origin', 'external')
          .eq('status', 'open')
          .is('deleted_at', null)
          .or(`expires_at.is.null,expires_at.gt.${now}`);

        const [prof, cli, ver, gigs, bids, payments, externalGigs] = await Promise.all([
          professionalsQ,
          clientsQ,
          verifiedQ,
          gigsQ,
          bidsQ,
          paymentsQ,
          externalGigsQ,
        ]);

        // Handle errors if any
        const errs = [prof.error, cli.error, ver.error, gigs.error, bids.error, payments.error, externalGigs.error].filter(Boolean);
        if (errs.length) {
          console.error('❌ Error loading filtered stats:', errs[0]);
        }

        const total_transaction_value = Array.isArray(payments.data)
          ? (payments.data as Array<{ amount: number | null }>).reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
          : 0;

        setStats({
          total_professionals: prof.count || 0,
          total_clients: cli.count || 0,
          verified_users: ver.count || 0,
          total_gigs: gigs.count || 0,
          total_bids: bids.count || 0,
          total_transaction_value,
          active_external_gigs: externalGigs.count || 0,
        });
      } catch (error) {
        console.error('❌ Unexpected error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [dateRange, startDate, endDate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    sessionStorage.removeItem('staff_user');
    navigate('/staff/login');
  }

  return (
    <StaffRoute>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="w-full max-w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 break-words">GigExecs Staff Dashboard</h1>
                {staff && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                    Welcome back, {staff.first_name} ({staff.role})
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => navigate('/staff/settings')} className="text-xs sm:text-sm px-2 sm:px-3">
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs sm:text-sm px-2 sm:px-3">
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          {/* Date Range Filter */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                  <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">Time Period:</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as DateRange)}
                    className="border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-0"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 90 Days</option>
                    <option value="year">Last 12 Months</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 border-t pt-3 sm:pt-0 sm:border-t-0">
                <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">Custom Range:</label>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="date"
                    value={startDate || ''}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-0"
                  />
                  <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0">to</span>
                  <input
                    type="date"
                    value={endDate || ''}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
            <Button 
              variant="outline" 
              className="h-auto py-3 sm:py-4 justify-start w-full max-w-full"
              onClick={() => navigate('/staff/verifications')}
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600 flex-shrink-0" />
              <div className="text-left min-w-0 flex-1 overflow-hidden">
                <div className="font-semibold text-sm sm:text-base truncate">User Verifications</div>
                <div className="text-xs text-gray-600 truncate">Review pending users</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-3 sm:py-4 justify-start w-full max-w-full"
              onClick={() => navigate('/staff/audit-log')}
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600 flex-shrink-0" />
              <div className="text-left min-w-0 flex-1 overflow-hidden">
                <div className="font-semibold text-sm sm:text-base truncate">Audit Logs</div>
                <div className="text-xs text-gray-600 truncate">View staff activity</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-3 sm:py-4 justify-start w-full max-w-full"
              onClick={() => navigate('/staff/external-gig-clicks')}
            >
              <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600 flex-shrink-0" />
              <div className="text-left min-w-0 flex-1 overflow-hidden">
                <div className="font-semibold text-sm sm:text-base truncate">External Gig Clicks</div>
                <div className="text-xs text-gray-600 truncate">View click analytics</div>
              </div>
            </Button>
            
            {staff?.role === 'super_user' && (
              <Button 
                variant="outline" 
                className="h-auto py-3 sm:py-4 justify-start w-full max-w-full"
                onClick={() => navigate('/staff/users')}
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1 overflow-hidden">
                  <div className="font-semibold text-sm sm:text-base truncate">Staff Management</div>
                  <div className="text-xs text-gray-600 truncate">Manage staff accounts</div>
                </div>
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Platform Statistics</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Professionals
                  </CardTitle>
                  <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">{stats?.total_professionals || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Active consultant accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Clients
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">{stats?.total_clients || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Active client accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                    Verified Users
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">{stats?.verified_users || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Completed vetting process</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Gigs
                  </CardTitle>
                  <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">{stats?.total_gigs || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Projects created</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Bids
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">{stats?.total_bids || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Professional proposals</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                    Transaction Value
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">
                    ${(stats?.total_transaction_value || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Total payments processed</p>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/staff/external-gigs')}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                    Active External Gigs
                  </CardTitle>
                  <ExternalLink className="h-4 w-4 text-blue-600 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">{stats?.active_external_gigs || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Click to manage external gigs</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </StaffRoute>
  );
}

