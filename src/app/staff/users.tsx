/**
 * Staff Management Page
 * 
 * Super user only page for managing staff accounts
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { StaffRoute, useStaffUser } from '@/components/staff/StaffRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Plus, 
  Edit, 
  Save,
  X,
  ArrowLeft,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StaffUser {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: 'support' | 'admin' | 'super_user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  email?: string; // Will be joined from auth.users if needed
}

export default function StaffUsersPage() {
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { staff } = useStaffUser();
  const navigate = useNavigate();

  // Form state for new user
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'support' as 'support' | 'admin' | 'super_user',
    is_active: true
  });

  // Form state for editing user
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    role: 'support' as 'support' | 'admin' | 'super_user',
    is_active: true
  });

  useEffect(() => {
    loadStaffUsers();
  }, []);

  async function loadStaffUsers() {
    try {
      setLoading(true);
      // Use Netlify function with service role to list staff users
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('❌ No session found while loading staff users');
        return;
      }
      const resp = await fetch('/.netlify/functions/staff-manage-users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const json = await resp.json();
      if (!resp.ok) {
        console.error('❌ Error loading staff users:', json);
        return;
      }
      setStaffUsers(json.staff || []);
    } catch (error) {
      console.error('❌ Unexpected error loading staff users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateStaff() {
    try {
      setSaving(true);

      // Get current auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to create staff users');
        return;
      }

      // Create auth user first via Netlify function
      const response = await fetch('/.netlify/functions/staff-create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          role: newUser.role,
          is_active: newUser.is_active
        })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Error: ${result.error || 'Failed to create staff user'}`);
        return;
      }

      // Reset form and reload
      setNewUser({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'support',
        is_active: true
      });
      setIsAddDialogOpen(false);
      loadStaffUsers();
    } catch (error) {
      console.error('❌ Error creating staff user:', error);
      alert('Failed to create staff user');
    } finally {
      setSaving(false);
    }
  }

  async function handleEditStaff() {
    if (!editingUser) return;

    try {
      setSaving(true);

      // Get current session for auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to update staff users');
        return;
      }

      // Call Netlify function to update staff user
      const response = await fetch('/.netlify/functions/staff-update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          id: editingUser.id,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          role: editForm.role,
          is_active: editForm.is_active,
          old_values: {
            first_name: editingUser.first_name,
            last_name: editingUser.last_name,
            role: editingUser.role,
            is_active: editingUser.is_active
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Error updating staff user:', data);
        alert(`Error: ${data.error || 'Failed to update staff user'}`);
        return;
      }

      console.log('✅ Staff user updated successfully');
      setIsEditDialogOpen(false);
      setEditingUser(null);
      loadStaffUsers();
    } catch (error) {
      console.error('❌ Unexpected error updating staff user:', error);
      alert('Failed to update staff user');
    } finally {
      setSaving(false);
    }
  }

  function openEditDialog(user: StaffUser) {
    setEditingUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      is_active: user.is_active
    });
    setIsEditDialogOpen(true);
  }

  function getRoleBadgeColor(role: string) {
    switch (role) {
      case 'super_user':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'support':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  return (
    <StaffRoute requiredRole="super_user">
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
                  <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage staff accounts and permissions
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Staff Members ({staffUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-medium text-gray-700">Name</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-700">Role</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-700">Created</th>
                        <th className="text-right p-3 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center p-8 text-gray-500">
                            No staff members found
                          </td>
                        </tr>
                      ) : (
                        staffUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-medium">
                                {user.first_name} {user.last_name}
                              </div>
                              {user.email && (
                                <div className="text-sm text-gray-500">{user.email}</div>
                              )}
                            </td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}
                              >
                                {user.role === 'super_user' && <ShieldCheck className="h-3 w-3 mr-1" />}
                                {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                                {user.role === 'support' && <Users className="h-3 w-3 mr-1" />}
                                {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </td>
                            <td className="p-3">
                              {user.is_active ? (
                                <span className="inline-flex items-center text-green-700">
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-red-700">
                                  <UserX className="h-4 w-4 mr-1" />
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(user)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Staff Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Create a new staff account. The user will need to log in with the email and password provided.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="staff@gigexecs.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: 'support' | 'admin' | 'super_user') =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_user">Super User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={newUser.is_active}
                  onChange={(e) => setNewUser({ ...newUser, is_active: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_active" className="font-normal">
                  Account is active
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateStaff}
                disabled={saving || !newUser.email || !newUser.password || !newUser.first_name || !newUser.last_name}
              >
                {saving ? 'Creating...' : 'Create Staff Member'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Staff Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>
                Update staff member information and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_first_name">First Name *</Label>
                  <Input
                    id="edit_first_name"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_last_name">Last Name *</Label>
                  <Input
                    id="edit_last_name"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_role">Role *</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value: 'support' | 'admin' | 'super_user') =>
                    setEditForm({ ...editForm, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_user">Super User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit_is_active" className="font-normal">
                  Account is active
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditStaff}
                disabled={saving || !editForm.first_name || !editForm.last_name}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </StaffRoute>
  );
}

