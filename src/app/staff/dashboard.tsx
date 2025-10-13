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
  Settings
} from 'lucide-react';

interface DashboardStats {
  total_professionals: number;
  total_clients: number;
  verified_users: number;
  total_gigs: number;
  total_bids: number;
  total_transaction_value: number;
}

export default function StaffDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { staff } = useStaffUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStats() {
      try {
        console.log('📊 Loading dashboard stats...');
        
        const { data, error } = await supabase
          .from('dashboard_summary')
          .select('*')
          .single();

        if (error) {
          console.error('❌ Error loading stats:', error);
        } else {
          console.log('✅ Stats loaded:', data);
          setStats(data);
        }
      } catch (error) {
        console.error('❌ Unexpected error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    sessionStorage.removeItem('staff_user');
    navigate('/staff/login');
  }

  return (
    <StaffRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">GigExecs Staff Dashboard</h1>
                {staff && (
                  <p className="text-sm text-gray-600 mt-1">
                    Welcome back, {staff.first_name} ({staff.role})
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/staff/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto p-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button 
              variant="outline" 
              className="h-auto py-4 justify-start"
              onClick={() => navigate('/staff/verifications')}
            >
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              <div className="text-left">
                <div className="font-semibold">User Verifications</div>
                <div className="text-xs text-gray-600">Review pending users</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 justify-start"
              onClick={() => navigate('/staff/audit-log')}
            >
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold">Audit Logs</div>
                <div className="text-xs text-gray-600">View staff activity</div>
              </div>
            </Button>
            
            {staff?.role === 'super_user' && (
              <Button 
                variant="outline" 
                className="h-auto py-4 justify-start"
                onClick={() => navigate('/staff/users')}
              >
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                <div className="text-left">
                  <div className="font-semibold">Staff Management</div>
                  <div className="text-xs text-gray-600">Manage staff accounts</div>
                </div>
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <h2 className="text-lg font-semibold mb-4">Platform Statistics</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Professionals
                  </CardTitle>
                  <Users className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.total_professionals || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Active consultant accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Clients
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.total_clients || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Active client accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Verified Users
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.verified_users || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Completed vetting process</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Gigs
                  </CardTitle>
                  <FileText className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.total_gigs || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Projects created</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Bids
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.total_bids || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">Professional proposals</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Transaction Value
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${(stats?.total_transaction_value || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Total payments processed</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </StaffRoute>
  );
}

