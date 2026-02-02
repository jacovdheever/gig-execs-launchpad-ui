/**
 * Profile Status System - 4-Level Professional Status
 * 
 * Replaces the old percentage/tier system with a clearer progression:
 * 1. Registered - Account created, email verified
 * 2. Basic Profile Complete - All basic mandatory fields filled
 * 3. Full Profile Submitted (Pending Vetting) - Ready for staff review
 * 4. Vetted (Approved/Declined) - Staff decision made
 * 
 * @see /docs/profile-status-system.md for full documentation
 */

import { z } from 'zod';

// =============================================================================
// Types
// =============================================================================

/**
 * The 5 possible professional profile statuses
 */
export type ProfessionalStatus =
  | 'registered'
  | 'basic_complete'
  | 'pending_vetting'
  | 'vetted_approved'
  | 'vetted_declined';

/**
 * Vetting status values from the database
 */
export type VettingStatus = 'pending' | 'in_progress' | 'verified' | 'vetted' | 'rejected' | null;

/**
 * CTA action types for the status card
 */
export type StatusCtaAction =
  | 'complete_profile'
  | 'finish_profile'
  | 'view_profile'
  | 'find_gigs'
  | 'review_profile';

// =============================================================================
// Zod Schemas for Input Validation
// =============================================================================

export const UserDataSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  email: z.string().email().nullable(),
  vetting_status: z.enum(['pending', 'in_progress', 'verified', 'vetted', 'rejected']).nullable(),
});

export const ConsultantProfileSchema = z.object({
  user_id: z.string().uuid(),
  job_title: z.string().nullable(),
  bio: z.string().nullable(), // Optional for basic
  address1: z.string().nullable(),
  country: z.string().nullable(),
  country_id: z.number().nullable(),
  hourly_rate_min: z.number().nullable(),
  hourly_rate_max: z.number().nullable(),
  id_doc_url: z.string().nullable(),
}).partial();

export const RelatedCountsSchema = z.object({
  workExperienceCount: z.number().min(0),
  skillsCount: z.number().min(0),
  languagesCount: z.number().min(0),
  industriesCount: z.number().min(0),
  referencesCount: z.number().min(0),
  educationCount: z.number().min(0),
  certificationsCount: z.number().min(0),
});

export type UserData = z.infer<typeof UserDataSchema>;
export type ConsultantProfile = z.infer<typeof ConsultantProfileSchema>;
export type RelatedCounts = z.infer<typeof RelatedCountsSchema>;

// =============================================================================
// Status Result Interface
// =============================================================================

export interface StatusResult {
  /** Current status key */
  statusKey: ProfessionalStatus;
  /** Number of completed steps (1-4) */
  completedSteps: number;
  /** List of missing requirements for next step */
  missingRequirements: string[];
  /** UI display title */
  title: string;
  /** UI display body/description */
  body: string;
  /** CTA button text */
  ctaText: string;
  /** CTA action type */
  ctaAction: StatusCtaAction;
  /** Whether CTA is disabled */
  ctaDisabled: boolean;
  /** Badge icon type */
  badgeIcon: 'lock' | 'clock' | 'check' | 'x';
  /** Badge color variant */
  badgeColor: 'blue' | 'green' | 'red';
}

// =============================================================================
// Configuration - Mandatory Fields
// =============================================================================

/**
 * Basic mandatory fields required for Status #2 (Basic Profile Complete)
 */
export const BASIC_MANDATORY_FIELDS = {
  user: ['first_name', 'last_name'] as const,
  profile: ['job_title', 'address1', 'hourly_rate_min', 'hourly_rate_max'] as const,
  // country can be either 'country' (text) or 'country_id' (int)
  countryRequired: true,
  // Related data requirements
  minWorkExperience: 1,
  minSkills: 1,
  minLanguages: 1,
  minIndustries: 1,
  // Bio is NOT required (confirmed optional)
};

/**
 * Full profile fields required for Status #3 (Pending Vetting)
 */
export const FULL_PROFILE_FIELDS = {
  // All basic fields plus:
  minReferences: 2,
  idDocumentRequired: true,
  // At least 1 education OR 1 certification
  minEducationOrCertifications: 1,
};

// =============================================================================
// Status Content Configuration
// =============================================================================

const STATUS_CONTENT: Record<ProfessionalStatus, Omit<StatusResult, 'statusKey' | 'completedSteps' | 'missingRequirements'>> = {
  registered: {
    title: 'Registered',
    body: "You've created your account. Complete your basic profile details to start using GigExecs.",
    ctaText: 'Complete your profile',
    ctaAction: 'complete_profile',
    ctaDisabled: false,
    badgeIcon: 'lock',
    badgeColor: 'blue',
  },
  basic_complete: {
    title: 'Basic Profile',
    body: 'Your basic profile is complete. Finish your full profile to become eligible for vetting and unlock more opportunities.',
    ctaText: 'Finish full profile',
    ctaAction: 'finish_profile',
    ctaDisabled: false,
    badgeIcon: 'lock',
    badgeColor: 'blue',
  },
  pending_vetting: {
    title: 'Full Profile – Pending Vetting',
    body: "Your profile is complete and currently under review. We'll notify you as soon as vetting is complete.",
    ctaText: 'Vetting in progress',
    ctaAction: 'view_profile',
    ctaDisabled: true,
    badgeIcon: 'clock',
    badgeColor: 'blue',
  },
  vetted_approved: {
    title: 'Vetted Profile',
    body: 'Your profile has been verified. You can now apply for gigs and be discovered by clients.',
    ctaText: 'Find gigs',
    ctaAction: 'find_gigs',
    ctaDisabled: false,
    badgeIcon: 'check',
    badgeColor: 'green',
  },
  vetted_declined: {
    title: 'Vetting outcome – action needed',
    body: "Your profile wasn't approved this time. Review your details and improve any missing information.",
    ctaText: 'Review profile',
    ctaAction: 'review_profile',
    ctaDisabled: false,
    badgeIcon: 'x',
    badgeColor: 'red',
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Check if basic mandatory fields are complete
 */
export function checkBasicFieldsComplete(
  user: UserData | null,
  profile: ConsultantProfile | null,
  counts: RelatedCounts
): { complete: boolean; missing: string[] } {
  const missing: string[] = [];

  // User fields
  if (!user?.first_name) missing.push('First name');
  if (!user?.last_name) missing.push('Last name');

  // Profile fields
  if (!profile?.job_title) missing.push('Job title');
  if (!profile?.address1) missing.push('Address');
  
  // Country - either text or ID
  const hasCountry = profile?.country || profile?.country_id;
  if (!hasCountry) missing.push('Country');

  // Rates
  if (!profile?.hourly_rate_min) missing.push('Minimum hourly rate');
  if (!profile?.hourly_rate_max) missing.push('Maximum hourly rate');

  // Related data counts
  if (counts.workExperienceCount < BASIC_MANDATORY_FIELDS.minWorkExperience) {
    missing.push('At least 1 work experience');
  }
  if (counts.skillsCount < BASIC_MANDATORY_FIELDS.minSkills) {
    missing.push('At least 1 skill');
  }
  if (counts.languagesCount < BASIC_MANDATORY_FIELDS.minLanguages) {
    missing.push('At least 1 language');
  }
  if (counts.industriesCount < BASIC_MANDATORY_FIELDS.minIndustries) {
    missing.push('At least 1 industry');
  }

  return {
    complete: missing.length === 0,
    missing,
  };
}

/**
 * Check if full profile fields are complete (for vetting eligibility)
 */
export function checkFullProfileComplete(
  profile: ConsultantProfile | null,
  counts: RelatedCounts,
  basicComplete: boolean
): { complete: boolean; missing: string[] } {
  // Must have basic complete first
  if (!basicComplete) {
    return { complete: false, missing: ['Complete basic profile first'] };
  }

  const missing: string[] = [];

  // References
  if (counts.referencesCount < FULL_PROFILE_FIELDS.minReferences) {
    const needed = FULL_PROFILE_FIELDS.minReferences - counts.referencesCount;
    missing.push(`${needed} more reference${needed > 1 ? 's' : ''}`);
  }

  // ID document
  if (!profile?.id_doc_url) {
    missing.push('ID document');
  }

  // Education OR certification (at least 1 total)
  const totalEducationOrCerts = counts.educationCount + counts.certificationsCount;
  if (totalEducationOrCerts < FULL_PROFILE_FIELDS.minEducationOrCertifications) {
    missing.push('At least 1 qualification or certification');
  }

  return {
    complete: missing.length === 0,
    missing,
  };
}

/**
 * Map vetting status from DB to status key
 */
function mapVettingStatusToStatusKey(vettingStatus: VettingStatus): ProfessionalStatus | null {
  if (vettingStatus === 'verified' || vettingStatus === 'vetted') {
    return 'vetted_approved';
  }
  if (vettingStatus === 'rejected') {
    return 'vetted_declined';
  }
  if (vettingStatus === 'pending' || vettingStatus === 'in_progress') {
    return 'pending_vetting';
  }
  return null;
}

// =============================================================================
// Main Computation Function
// =============================================================================

/**
 * Compute the professional profile status for a user.
 * 
 * This is the single source of truth for profile status.
 * 
 * @param user - User data from users table
 * @param profile - Consultant profile data (can be null if not created)
 * @param counts - Counts of related data (work experience, skills, etc.)
 * @returns StatusResult with all display information
 */
export function computeProfessionalProfileStatus(
  user: UserData | null,
  profile: ConsultantProfile | null,
  counts: RelatedCounts
): StatusResult {
  // Default to registered if no user data
  if (!user) {
    return {
      statusKey: 'registered',
      completedSteps: 1,
      missingRequirements: ['User data not loaded'],
      ...STATUS_CONTENT.registered,
    };
  }

  // Check basic fields
  const basicCheck = checkBasicFieldsComplete(user, profile, counts);
  
  // Check full profile fields
  const fullCheck = checkFullProfileComplete(profile, counts, basicCheck.complete);

  // Determine status based on vetting_status and field completion
  const vettingStatus = user.vetting_status;
  
  // If vetted (approved or declined), that takes precedence
  const vettedStatus = mapVettingStatusToStatusKey(vettingStatus);
  if (vettedStatus === 'vetted_approved' || vettedStatus === 'vetted_declined') {
    return {
      statusKey: vettedStatus,
      completedSteps: vettedStatus === 'vetted_approved' ? 4 : 3,
      missingRequirements: vettedStatus === 'vetted_declined' ? fullCheck.missing : [],
      ...STATUS_CONTENT[vettedStatus],
    };
  }

  // If full profile complete and pending/in_progress vetting
  if (fullCheck.complete && (vettingStatus === 'pending' || vettingStatus === 'in_progress')) {
    return {
      statusKey: 'pending_vetting',
      completedSteps: 3,
      missingRequirements: [],
      ...STATUS_CONTENT.pending_vetting,
    };
  }

  // If basic complete but not full
  if (basicCheck.complete) {
    return {
      statusKey: 'basic_complete',
      completedSteps: 2,
      missingRequirements: fullCheck.missing,
      ...STATUS_CONTENT.basic_complete,
    };
  }

  // Default: registered (basic not complete)
  return {
    statusKey: 'registered',
    completedSteps: 1,
    missingRequirements: basicCheck.missing,
    ...STATUS_CONTENT.registered,
  };
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get the step labels for the progress indicator
 */
export function getProgressSteps(): readonly string[] {
  return ['Registered', 'Basic', 'Full', 'Vetted'] as const;
}

/**
 * Check if a user should be auto-submitted for vetting
 * Call this when profile is saved to potentially trigger vetting submission
 */
export function shouldAutoSubmitForVetting(
  user: UserData | null,
  profile: ConsultantProfile | null,
  counts: RelatedCounts
): boolean {
  if (!user) return false;
  
  // Don't auto-submit if already submitted or vetted
  const vettingStatus = user.vetting_status;
  if (vettingStatus === 'pending' || vettingStatus === 'in_progress' || 
      vettingStatus === 'verified' || vettingStatus === 'vetted') {
    return false;
  }

  // Check if full profile is complete
  const basicCheck = checkBasicFieldsComplete(user, profile, counts);
  const fullCheck = checkFullProfileComplete(profile, counts, basicCheck.complete);

  return fullCheck.complete;
}

/**
 * Get the CTA route for a given status
 */
export function getCtaRoute(status: StatusResult): string {
  switch (status.ctaAction) {
    case 'complete_profile':
      return '/onboarding/step1';
    case 'finish_profile':
      return '/profile';
    case 'view_profile':
      return '/profile';
    case 'find_gigs':
      return '/find-gigs';
    case 'review_profile':
      return '/profile';
    default:
      return '/dashboard';
  }
}
