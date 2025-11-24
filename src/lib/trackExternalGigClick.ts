/**
 * Track External Gig Click
 * 
 * Logs when an authenticated professional clicks on an external gig link.
 * This function is called before opening the external URL.
 */

import { supabase } from './supabase';

export type ClickSource = 'listing' | 'detail';

/**
 * Tracks a click on an external gig link
 * @param projectId - The ID of the external project
 * @param clickSource - Where the click originated ('listing' or 'detail')
 * @returns Promise<boolean> - True if tracking was successful, false otherwise
 */
export async function trackExternalGigClick(
  projectId: number,
  clickSource: ClickSource
): Promise<boolean> {
  try {
    // Get the current session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      console.warn('⚠️ No session found, cannot track external gig click');
      return false;
    }

    // Call the tracking function
    const response = await fetch('/.netlify/functions/track-external-gig-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        project_id: projectId,
        click_source: clickSource
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.warn('⚠️ Failed to track external gig click:', error);
      return false;
    }

    const result = await response.json();
    console.log('✅ External gig click tracked:', result);
    return true;

  } catch (error) {
    // Don't block the user from opening the link if tracking fails
    console.error('❌ Error tracking external gig click:', error);
    return false;
  }
}

