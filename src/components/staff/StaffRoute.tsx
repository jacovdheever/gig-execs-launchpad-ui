/**
 * Protected Staff Route Component
 * 
 * Wraps staff-only pages to enforce authentication and role requirements
 */

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface StaffRouteProps {
  children: React.ReactNode;
  requiredRole?: 'support' | 'admin' | 'super_user';
}

interface StaffUser {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: 'support' | 'admin' | 'super_user';
  is_active: boolean;
}

export function StaffRoute({ children, requiredRole }: StaffRouteProps) {
  const [isStaff, setIsStaff] = useState<boolean | null>(null);
  const [staffRole, setStaffRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStaffAccess() {
      try {
        // Get current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('❌ No authenticated user');
          setIsStaff(false);
          setLoading(false);
          return;
        }

        console.log('✅ User authenticated, checking staff status...');

        // Check if user is in staff_users table
        const { data: staffUser, error } = await supabase
          .from('staff_users')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (error || !staffUser) {
          console.log('❌ User is not staff or inactive');
          setIsStaff(false);
          setLoading(false);
          return;
        }

        console.log('✅ Staff verified:', {
          role: staffUser.role,
          name: `${staffUser.first_name} ${staffUser.last_name}`
        });

        setStaffRole(staffUser.role);
        setIsStaff(true);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error checking staff access:', error);
        setIsStaff(false);
        setLoading(false);
      }
    }

    checkStaffAccess();
  }, []);

  // Show loading state
  if (loading || isStaff === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying staff access...</p>
        </div>
      </div>
    );
  }

  // Redirect to staff login if not staff
  if (!isStaff) {
    console.log('🔒 Redirecting to staff login...');
    return <Navigate to="/staff/login" replace />;
  }

  // Check role requirements if specified
  if (requiredRole && staffRole) {
    const roleHierarchy: Record<string, number> = { 
      support: 1, 
      admin: 2, 
      super_user: 3 
    };
    const userLevel = roleHierarchy[staffRole];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      console.log('❌ Insufficient role level:', {
        userRole: staffRole,
        requiredRole: requiredRole
      });
      return <Navigate to="/staff/dashboard" replace />;
    }
  }

  // Render protected content
  return <>{children}</>;
}

/**
 * Hook to get current staff user information
 */
export function useStaffUser() {
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStaffUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: staffUser } = await supabase
          .from('staff_users')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        setStaff(staffUser);
        setLoading(false);
      } catch (error) {
        console.error('Error loading staff user:', error);
        setLoading(false);
      }
    }

    loadStaffUser();
  }, []);

  return { staff, loading };
}

