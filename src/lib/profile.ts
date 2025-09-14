/**
 * Profile completeness and status calculation utilities
 * Handles the 3-tier profile system: Basic, Full, All-Star
 */

export type CompletenessTier = 'BASIC' | 'FULL' | 'ALL_STAR';
export type ProfileStatus = 'INCOMPLETE' | 'BASIC' | 'FULL' | 'VERIFIED' | 'ALL_STAR';

// Configuration constants - easily adjustable
export const COMPLETENESS_THRESHOLDS = {
  BASIC: {
    WEIGHT: 40, // 40% of total
    REQUIREMENTS: {
      hasCore: true, // Basic onboarding fields completed
    }
  },
  FULL: {
    WEIGHT: 40, // +40% if all criteria met
    REQUIREMENTS: {
      referencesCount: 2,
      hasIdDocument: true,
      qualificationsCount: 1, // OR certificationsCount >= 1
      certificationsCount: 1,
    }
  },
  ALL_STAR: {
    WEIGHT: 20, // +20% if criteria met
    REQUIREMENTS: {
      portfolioCount: 1,
    }
  }
} as const;

export interface CompletenessData {
  basic: {
    hasCore: boolean;
  };
  full: {
    referencesCount: number;
    hasIdDocument: boolean;
    qualificationsCount: number;
    certificationsCount: number;
  };
  allstar: {
    portfolioCount: number;
  };
}

export interface CompletenessResult {
  tier: CompletenessTier;
  percent: number;
  segments: {
    basic: number;
    full: number;
    allStar: number;
  };
  missing: {
    basic: string[];
    full: string[];
    allStar: string[];
  };
}

/**
 * Calculate profile completeness based on data provided
 */
export function computeCompleteness(
  userId: string, 
  data: CompletenessData
): CompletenessResult {
  const { basic, full, allstar } = data;
  
  // Calculate Basic tier
  const basicComplete = basic.hasCore;
  const basicPercent = basicComplete ? COMPLETENESS_THRESHOLDS.BASIC.WEIGHT : 0;
  
  // Calculate Full tier
  const fullRequirements = {
    references: full.referencesCount >= COMPLETENESS_THRESHOLDS.FULL.REQUIREMENTS.referencesCount,
    idDocument: full.hasIdDocument,
    qualifications: full.qualificationsCount >= COMPLETENESS_THRESHOLDS.FULL.REQUIREMENTS.qualificationsCount,
    certifications: full.certificationsCount >= COMPLETENESS_THRESHOLDS.FULL.REQUIREMENTS.certificationsCount,
  };
  
  const hasQualificationsOrCerts = fullRequirements.qualifications || fullRequirements.certifications;
  const fullComplete = fullRequirements.references && 
                      fullRequirements.idDocument && 
                      hasQualificationsOrCerts;
  const fullPercent = fullComplete ? COMPLETENESS_THRESHOLDS.FULL.WEIGHT : 0;
  
  // Calculate All-Star tier - only if Full tier is complete
  const allStarComplete = fullComplete && allstar.portfolioCount >= COMPLETENESS_THRESHOLDS.ALL_STAR.REQUIREMENTS.portfolioCount;
  const allStarPercent = allStarComplete ? COMPLETENESS_THRESHOLDS.ALL_STAR.WEIGHT : 0;
  
  // Determine overall tier
  let tier: CompletenessTier = 'BASIC';
  if (basicComplete && fullComplete && allStarComplete) {
    tier = 'ALL_STAR';
  } else if (basicComplete && fullComplete) {
    tier = 'FULL';
  } else if (basicComplete) {
    tier = 'BASIC';
  }
  
  const totalPercent = basicPercent + fullPercent + allStarPercent;
  
  // Generate missing items for tooltips
  const missing = {
    basic: [] as string[],
    full: [] as string[],
    allStar: [] as string[],
  };
  
  if (!basicComplete) {
    missing.basic.push('Complete basic profile information');
  }
  
  if (!fullComplete) {
    if (!fullRequirements.references) {
      missing.full.push(`Add ${COMPLETENESS_THRESHOLDS.FULL.REQUIREMENTS.referencesCount - full.referencesCount} more references`);
    }
    if (!fullRequirements.idDocument) {
      missing.full.push('Upload proof of ID document');
    }
    if (!hasQualificationsOrCerts) {
      missing.full.push('Add qualifications or certifications');
    }
  }
  
  if (!allStarComplete) {
    missing.allStar.push('Add portfolio projects');
  }
  
  return {
    tier,
    percent: totalPercent,
    segments: {
      basic: basicPercent,
      full: fullPercent,
      allStar: allStarPercent,
    },
    missing,
  };
}

/**
 * Map completeness tier and vetting status to profile status
 */
export function computeProfileStatus({
  tier,
  vettingStatus
}: {
  tier: CompletenessTier;
  vettingStatus?: 'pending' | 'in_progress' | 'verified' | 'rejected';
}): ProfileStatus {
  // Handle incomplete profiles
  if (tier === 'BASIC' && !vettingStatus) {
    return 'BASIC';
  }
  
  // Handle basic profiles
  if (tier === 'BASIC') {
    return 'BASIC';
  }
  
  // Handle full profiles
  if (tier === 'FULL') {
    if (vettingStatus === 'verified') {
      return 'VERIFIED';
    }
    return 'FULL';
  }
  
  // Handle all-star profiles
  if (tier === 'ALL_STAR') {
    if (vettingStatus === 'verified') {
      return 'ALL_STAR';
    }
    return 'FULL'; // Still needs verification
  }
  
  // Default to incomplete
  return 'INCOMPLETE';
}

/**
 * Get status badge styling based on profile status
 */
export function getStatusBadgeStyles(status: ProfileStatus) {
  const styles = {
    INCOMPLETE: 'bg-gray-100 text-gray-800 border-gray-200',
    BASIC: 'bg-blue-100 text-blue-800 border-blue-200',
    FULL: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    VERIFIED: 'bg-green-100 text-green-800 border-green-200',
    ALL_STAR: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };
  
  return styles[status] || styles.INCOMPLETE;
}

/**
 * Get status display text
 */
export function getStatusDisplayText(status: ProfileStatus): string {
  const displayText = {
    INCOMPLETE: 'Incomplete',
    BASIC: 'Basic',
    FULL: 'Full',
    VERIFIED: 'Verified',
    ALL_STAR: 'All-Star',
  };
  
  return displayText[status] || 'Incomplete';
}

/**
 * Helper to check if a profile is ready for vetting
 */
export function isReadyForVetting(tier: CompletenessTier): boolean {
  return tier === 'FULL' || tier === 'ALL_STAR';
}

/**
 * Helper to get next steps for profile completion
 */
export function getNextSteps(result: CompletenessResult): string[] {
  const steps: string[] = [];
  
  if (result.missing.basic.length > 0) {
    steps.push(...result.missing.basic);
  }
  
  if (result.missing.full.length > 0) {
    steps.push(...result.missing.full);
  }
  
  if (result.missing.allStar.length > 0) {
    steps.push(...result.missing.allStar);
  }
  
  return steps;
}
