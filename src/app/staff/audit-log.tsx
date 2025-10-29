/**
 * Audit Log Page
 * 
 * Staff-only page for viewing audit logs of all staff actions
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaffRoute } from '@/components/staff/StaffRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchAuditLogs, exportAuditLogsToCSV } from '@/lib/audit';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  FileText,
  Download,
  Search,
  Calendar,
  Filter,
  X
} from 'lucide-react';

interface AuditLog {
  id: number;
  staff_id: string;
  action_type: string;
  target_table?: string;
  target_id?: string;
  details?: Record<string, any>;
  created_at: string;
  staff?: {
    first_name: string;
    last_name: string;
    role: string;
  };
}

interface StaffUser {
  id: string;
  first_name: string;
  last_name: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  // Filter state
  const [filters, setFilters] = useState({
    staffId: '',
    actionType: '',
    startDate: '',
    endDate: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalLogs, setTotalLogs] = useState(0);

  // Action types we've seen (will be populated dynamically)
  const [actionTypes, setActionTypes] = useState<string[]>([]);

  useEffect(() => {
    loadStaffUsers();
    loadAuditLogs();
  }, [filters, currentPage]);

  async function loadStaffUsers() {
    try {
      // Get list of staff users for filter dropdown
      // Using Netlify function since we need service role access
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/.netlify/functions/staff-manage-users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();
      if (result.staff) {
        setStaffUsers(result.staff);
      }
    } catch (error) {
      console.error('Error loading staff users:', error);
    }
  }

  async function loadAuditLogs() {
    try {
      setLoading(true);

      // Build filter object
      const filterParams: Parameters<typeof fetchAuditLogs>[0] = {};

      if (filters.staffId) {
        filterParams.staffId = filters.staffId;
      }

      if (filters.actionType) {
        filterParams.actionType = filters.actionType;
      }

      if (filters.startDate) {
        filterParams.startDate = new Date(filters.startDate);
      }

      if (filters.endDate) {
        // Set end date to end of day
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        filterParams.endDate = endDate;
      }

      // Fetch all logs with filters (no limit for now, we'll paginate client-side)
      const allLogs = await fetchAuditLogs(filterParams);

      // Extract unique action types for filter dropdown
      const uniqueActionTypes = Array.from(
        new Set(allLogs.map(log => log.action_type).filter(Boolean))
      ).sort();
      setActionTypes(uniqueActionTypes);

      // Client-side pagination
      setTotalLogs(allLogs.length);
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedLogs = allLogs.slice(startIndex, endIndex);

      setLogs(paginatedLogs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCSV() {
    try {
      setExporting(true);

      const filterParams: Parameters<typeof fetchAuditLogs>[0] = {};

      if (filters.staffId) {
        filterParams.staffId = filters.staffId;
      }

      if (filters.actionType) {
        filterParams.actionType = filters.actionType;
      }

      if (filters.startDate) {
        filterParams.startDate = new Date(filters.startDate);
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        filterParams.endDate = endDate;
      }

      const csv = await exportAuditLogsToCSV(filterParams);

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  }

  function handleFilterChange(key: string, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  }

  function clearFilters() {
    setFilters({
      staffId: '',
      actionType: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(totalLogs / pageSize);

  function formatDetails(details: Record<string, any> | undefined): string {
    if (!details) return '-';
    
    try {
      const entries = Object.entries(details);
      if (entries.length === 0) return '-';
      
      return entries
        .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
        .join(', ');
    } catch {
      return JSON.stringify(details);
    }
  }

  return (
    <StaffRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/staff/dashboard')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    View all staff actions and system activity
                  </p>
                </div>
              </div>
              <Button
                onClick={handleExportCSV}
                disabled={exporting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto p-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="staff-filter">Staff Member</Label>
                  <Select
                    value={filters.staffId}
                    onValueChange={(value) => handleFilterChange('staffId', value)}
                  >
                    <SelectTrigger id="staff-filter">
                      <SelectValue placeholder="All staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All staff</SelectItem>
                      {staffUsers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.first_name} {staff.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action-filter">Action Type</Label>
                  <Select
                    value={filters.actionType}
                    onValueChange={(value) => handleFilterChange('actionType', value)}
                  >
                    <SelectTrigger id="action-filter">
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All actions</SelectItem>
                      {actionTypes.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <div className="flex gap-2">
                    <Input
                      id="end-date"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="flex-1"
                    />
                    {(filters.staffId || filters.actionType || filters.startDate || filters.endDate) && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={clearFilters}
                        title="Clear filters"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Logs ({totalLogs} total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No audit logs found
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 text-sm font-medium text-gray-700">Timestamp</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-700">Staff Member</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-700">Action Type</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-700">Target Table</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-700">Target ID</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-700">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr key={log.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm">
                              {new Date(log.created_at).toLocaleString()}
                            </td>
                            <td className="p-3">
                              {log.staff ? (
                                <div>
                                  <div className="font-medium">
                                    {log.staff.first_name} {log.staff.last_name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {log.staff.role}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">Unknown</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {log.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {log.target_table || '-'}
                            </td>
                            <td className="p-3 text-sm text-gray-600 font-mono">
                              {log.target_id || '-'}
                            </td>
                            <td className="p-3 text-sm text-gray-600 max-w-xs truncate" title={formatDetails(log.details)}>
                              {formatDetails(log.details)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalLogs)} of {totalLogs} logs
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <div className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StaffRoute>
  );
}

