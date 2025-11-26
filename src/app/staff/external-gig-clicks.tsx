/**
 * External Gig Clicks Report Page
 * 
 * Staff-only page for viewing analytics on external gig link clicks.
 * Shows summary with unique click counts and drill-down details per gig.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaffRoute } from '@/components/staff/StaffRoute';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Users,
  ChevronRight,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SummaryItem {
  project_id: number;
  project_title: string;
  unique_click_count: number;
  total_clicks: number;
}

interface ClickDetail {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  first_clicked_at: string;
  click_source: 'listing' | 'detail';
}

interface ProjectDetails {
  id: number;
  title: string;
}

export default function ExternalGigClicksPage() {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [clickDetails, setClickDetails] = useState<ClickDetail[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Date range state - default to last 30 days
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    loadSummary();
  }, [startDate, endDate]);

  useEffect(() => {
    if (selectedProject) {
      loadClickDetails(selectedProject);
    } else {
      setClickDetails([]);
      setProjectDetails(null);
    }
  }, [selectedProject, startDate, endDate]);

  async function loadSummary() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in as staff to view the report.',
          variant: 'destructive'
        });
        return;
      }

      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const response = await fetch(`/.netlify/functions/staff-external-gig-clicks?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load report');
      }

      setSummary(result.summary || []);
    } catch (error: any) {
      console.error('❌ Error loading external gig clicks summary:', error);
      toast({
        title: 'Failed to load report',
        description: error.message || 'Unexpected error while loading the report.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadClickDetails(projectId: number) {
    try {
      setLoadingDetails(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }

      const queryParams = new URLSearchParams();
      queryParams.append('project_id', projectId.toString());
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const response = await fetch(`/.netlify/functions/staff-external-gig-clicks?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load click details');
      }

      setProjectDetails(result.project);
      setClickDetails(result.clicks || []);
    } catch (error: any) {
      console.error('❌ Error loading click details:', error);
      toast({
        title: 'Failed to load details',
        description: error.message || 'Unexpected error while loading click details.',
        variant: 'destructive'
      });
    } finally {
      setLoadingDetails(false);
    }
  }

  function handleRowClick(projectId: number) {
    setSelectedProject(selectedProject === projectId ? null : projectId);
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <StaffRoute requiredRole="support">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/staff/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">External Gig Clicks Report</h1>
                <p className="text-gray-600 mt-1">
                  Track unique user clicks on external gig links
                </p>
              </div>
              <ExternalLink className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          {/* Date Range Filter */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Date Range
              </CardTitle>
              <CardDescription>
                Filter clicks by date range (defaults to last 30 days)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={() => {
                    const date = new Date();
                    date.setDate(date.getDate() - 30);
                    setStartDate(date.toISOString().split('T')[0]);
                    setEndDate(new Date().toISOString().split('T')[0]);
                  }}
                  variant="outline"
                >
                  Reset to Last 30 Days
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Table */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Summary by Gig
              </CardTitle>
              <CardDescription>
                Click on a row to view detailed click information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : summary.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No external gig clicks found for the selected date range.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gig Name</TableHead>
                      <TableHead className="text-right">Unique Clicks</TableHead>
                      <TableHead className="text-right">Total Clicks</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.map((item) => (
                      <TableRow
                        key={item.project_id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleRowClick(item.project_id)}
                      >
                        <TableCell className="font-medium">
                          {item.project_title}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-blue-600">
                            {item.unique_click_count}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-gray-600">
                          {item.total_clicks}
                        </TableCell>
                        <TableCell>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${
                              selectedProject === item.project_id ? 'rotate-90' : ''
                            }`}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Drill-down Details */}
          {selectedProject && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      Click Details: {projectDetails?.title || 'Loading...'}
                    </CardTitle>
                    <CardDescription>
                      {loadingDetails
                        ? 'Loading details...'
                        : `${clickDetails.length} unique user${clickDetails.length !== 1 ? 's' : ''} clicked`}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProject(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingDetails ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : clickDetails.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No click details found for this gig in the selected date range.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>First Clicked</TableHead>
                        <TableHead>Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clickDetails.map((click, index) => (
                        <TableRow key={`${click.user_id}-${index}`}>
                          <TableCell className="font-medium">
                            {click.first_name} {click.last_name}
                          </TableCell>
                          <TableCell>{click.email}</TableCell>
                          <TableCell>{formatDate(click.first_clicked_at)}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {click.click_source === 'listing' ? 'Listing Page' : 'Detail Page'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StaffRoute>
  );
}

