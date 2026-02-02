/**
 * useProfileStatus - React hook for profile status computation
 * 
 * Fetches all necessary data and computes the professional profile status.
 * This is the recommended way to get profile status in React components.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  computeProfessionalProfileStatus,
  shouldAutoSubmitForVetting,
  getCtaRoute,
  type StatusResult,
  type UserData,
  type ConsultantProfile,
  type RelatedCounts,
} from '@/lib/profileStatus';

// =============================================================================
// Types
// =============================================================================

export interface ProfileStatusState {
  /** The computed status result */
  status: StatusResult | null;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Raw user data (for debugging/advanced use) */
  userData: UserData | null;
  /** Raw profile data (for debugging/advanced use) */
  profileData: ConsultantProfile | null;
  /** Raw counts (for debugging/advanced use) */
  counts: RelatedCounts | null;
  /** Whether auto-submit for vetting should be triggered */
  shouldSubmitForVetting: boolean;
}

export interface UseProfileStatusOptions {
  /** Whether to auto-refresh on focus/visibility change */
  autoRefresh?: boolean;
  /** Callback when status changes to pending_vetting (for showing notification) */
  onVettingSubmitted?: () => void;
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Hook to fetch and compute professional profile status
 * 
 * @param userId - The user ID to fetch status for
 * @param options - Optional configuration
 * @returns ProfileStatusState with status, loading, error states
 * 
 * @example
 * ```tsx
 * const { status, isLoading, error, refresh } = useProfileStatus(user.id);
 * 
 * if (isLoading) return <Skeleton />;
 * if (error) return <Error message={error} />;
 * 
 * return <ProfileStatusCard status={status} />;
 * ```
 */
export function useProfileStatus(
  userId: string | null | undefined,
  options: UseProfileStatusOptions = {}
): ProfileStatusState & { refresh: () => Promise<void> } {
  // Default autoRefresh to false - opt-in only to avoid flicker on screenshots/tab switches
  const { autoRefresh = false, onVettingSubmitted } = options;

  const [state, setState] = useState<ProfileStatusState>({
    status: null,
    isLoading: true,
    error: null,
    userData: null,
    profileData: null,
    counts: null,
    shouldSubmitForVetting: false,
  });

  // Track if we've already attempted to submit for vetting to prevent infinite loops
  const hasAttemptedVettingSubmit = useRef(false);
  // Store callback in ref to avoid dependency issues
  const onVettingSubmittedRef = useRef(onVettingSubmitted);
  onVettingSubmittedRef.current = onVettingSubmitted;

  /**
   * Fetch all data needed for status computation
   */
  const fetchStatusData = useCallback(async () => {
    if (!userId) {
      setState({
        status: null,
        isLoading: false,
        error: 'No user ID provided',
        userData: null,
        profileData: null,
        counts: null,
        shouldSubmitForVetting: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch all data in parallel for efficiency
      const [
        userResult,
        profileResult,
        workExpResult,
        skillsResult,
        languagesResult,
        industriesResult,
        referencesResult,
        educationResult,
        certificationsResult,
      ] = await Promise.all([
        // User data
        supabase
          .from('users')
          .select('id, first_name, last_name, email, vetting_status')
          .eq('id', userId)
          .single(),
        
        // Consultant profile (use maybeSingle to handle case where profile doesn't exist yet)
        supabase
          .from('consultant_profiles')
          .select('user_id, job_title, bio, address1, country, country_id, hourly_rate_min, hourly_rate_max, id_doc_url')
          .eq('user_id', userId)
          .maybeSingle(),
        
        // Work experience count
        supabase
          .from('work_experience')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // Skills count
        supabase
          .from('user_skills')
          .select('skill_id', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // Languages count
        supabase
          .from('user_languages')
          .select('language_id', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // Industries count
        supabase
          .from('user_industries')
          .select('industry_id', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // References count
        supabase
          .from('reference_contacts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // Education count
        supabase
          .from('education')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // Certifications count
        supabase
          .from('certifications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
      ]);

      // Check for user fetch error
      if (userResult.error) {
        throw new Error(`Failed to fetch user: ${userResult.error.message}`);
      }

      // Profile might not exist yet (new user), that's OK
      const userData: UserData = userResult.data;
      const profileData: ConsultantProfile | null = profileResult.data || null;

      // Build counts object
      const counts: RelatedCounts = {
        workExperienceCount: workExpResult.count || 0,
        skillsCount: skillsResult.count || 0,
        languagesCount: languagesResult.count || 0,
        industriesCount: industriesResult.count || 0,
        referencesCount: referencesResult.count || 0,
        educationCount: educationResult.count || 0,
        certificationsCount: certificationsResult.count || 0,
      };

      // Compute status
      const status = computeProfessionalProfileStatus(userData, profileData, counts);

      // Check if should auto-submit for vetting
      const shouldSubmit = shouldAutoSubmitForVetting(userData, profileData, counts);

      setState({
        status,
        isLoading: false,
        error: null,
        userData,
        profileData,
        counts,
        shouldSubmitForVetting: shouldSubmit,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile status';
      console.error('useProfileStatus error:', err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [userId]);

  /**
   * Submit profile for vetting (set vetting_status to 'pending')
   */
  const submitForVetting = useCallback(async () => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('users')
        .update({ vetting_status: 'pending' })
        .eq('id', userId);

      if (error) {
        console.error('Error submitting for vetting:', error);
        return false;
      }

      console.log('Profile submitted for vetting');
      return true;
    } catch (err) {
      console.error('Error submitting for vetting:', err);
      return false;
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchStatusData();
  }, [fetchStatusData]);

  // Auto-submit for vetting when profile becomes complete (only once per session)
  useEffect(() => {
    // Only attempt once and only if conditions are met
    if (state.shouldSubmitForVetting && userId && !hasAttemptedVettingSubmit.current) {
      hasAttemptedVettingSubmit.current = true;
      
      submitForVetting().then((success) => {
        if (success) {
          // Notify via callback
          if (onVettingSubmittedRef.current) {
            onVettingSubmittedRef.current();
          }
          // Update local state to reflect the change without refetching
          setState((prev) => ({
            ...prev,
            shouldSubmitForVetting: false,
            userData: prev.userData ? { ...prev.userData, vetting_status: 'pending' } : null,
            status: prev.status ? { 
              ...prev.status, 
              statusKey: 'pending_vetting',
              completedSteps: 3,
              title: 'Full Profile – Pending Vetting',
              body: "Your profile is complete and currently under review. We'll notify you as soon as vetting is complete.",
              ctaText: 'Vetting in progress',
              ctaDisabled: true,
            } : null,
          }));
        }
      });
    }
  }, [state.shouldSubmitForVetting, userId, submitForVetting]);

  // Auto-refresh on focus/visibility change (with debounce to prevent flicker)
  const lastRefreshRef = useRef(0);
  const REFRESH_DEBOUNCE_MS = 10000; // 10 second minimum between auto-refreshes

  useEffect(() => {
    if (!autoRefresh || !userId) return;

    const debouncedRefresh = () => {
      const now = Date.now();
      if (now - lastRefreshRef.current > REFRESH_DEBOUNCE_MS) {
        lastRefreshRef.current = now;
        fetchStatusData();
      }
    };

    const handleFocus = () => {
      debouncedRefresh();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        debouncedRefresh();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoRefresh, userId, fetchStatusData]);

  return {
    ...state,
    refresh: fetchStatusData,
  };
}

// =============================================================================
// Helper Hooks
// =============================================================================

/**
 * Simple hook to just get the CTA route for current status
 */
export function useProfileStatusRoute(userId: string | null | undefined): string {
  const { status } = useProfileStatus(userId, { autoRefresh: false });
  
  if (!status) return '/dashboard';
  return getCtaRoute(status);
}

// =============================================================================
// Server-side Function (for Netlify Functions)
// =============================================================================

/**
 * Fetch profile status data server-side
 * Use this in Netlify Functions where hooks aren't available
 * 
 * @param supabaseClient - Supabase client with service role
 * @param userId - User ID to fetch status for
 */
export async function fetchProfileStatusServerSide(
  supabaseClient: typeof supabase,
  userId: string
): Promise<{
  userData: UserData | null;
  profileData: ConsultantProfile | null;
  counts: RelatedCounts;
  status: StatusResult | null;
  shouldSubmitForVetting: boolean;
}> {
  const [
    userResult,
    profileResult,
    workExpResult,
    skillsResult,
    languagesResult,
    industriesResult,
    referencesResult,
    educationResult,
    certificationsResult,
  ] = await Promise.all([
    supabaseClient.from('users').select('id, first_name, last_name, email, vetting_status').eq('id', userId).single(),
    supabaseClient.from('consultant_profiles').select('user_id, job_title, bio, address1, country, country_id, hourly_rate_min, hourly_rate_max, id_doc_url').eq('user_id', userId).maybeSingle(),
    supabaseClient.from('work_experience').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabaseClient.from('user_skills').select('skill_id', { count: 'exact', head: true }).eq('user_id', userId),
    supabaseClient.from('user_languages').select('language_id', { count: 'exact', head: true }).eq('user_id', userId),
    supabaseClient.from('user_industries').select('industry_id', { count: 'exact', head: true }).eq('user_id', userId),
    supabaseClient.from('reference_contacts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabaseClient.from('education').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabaseClient.from('certifications').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ]);

  const userData: UserData | null = userResult.data || null;
  const profileData: ConsultantProfile | null = profileResult.data || null;

  const counts: RelatedCounts = {
    workExperienceCount: workExpResult.count || 0,
    skillsCount: skillsResult.count || 0,
    languagesCount: languagesResult.count || 0,
    industriesCount: industriesResult.count || 0,
    referencesCount: referencesResult.count || 0,
    educationCount: educationResult.count || 0,
    certificationsCount: certificationsResult.count || 0,
  };

  const status = userData ? computeProfessionalProfileStatus(userData, profileData, counts) : null;
  const shouldSubmitForVetting = userData ? shouldAutoSubmitForVetting(userData, profileData, counts) : false;

  return {
    userData,
    profileData,
    counts,
    status,
    shouldSubmitForVetting,
  };
}
