/**
 * ProfileStatusCard - 4-Level Profile Status Component
 * 
 * Displays the professional profile status with:
 * - Header with shield icon and title
 * - Current status badge with icon
 * - 4-step progress indicator (Registered → Basic → Full → Vetted)
 * - Status description and CTA button
 * 
 * Responsive: Mobile (< 1024px) vertical layout, Desktop (>= 1024px) two-column layout
 * 
 * @see Figma Make: https://www.figma.com/make/ZfHy5oFbHm9VtLVQFcmpMQ/Profile-Completion-UI-Design
 */

import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Shield, 
  Lock, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  type StatusResult, 
  type ProfessionalStatus,
  getProgressSteps,
  getCtaRoute 
} from '@/lib/profileStatus';

// =============================================================================
// Types
// =============================================================================

export interface ProfileStatusCardProps {
  /** The computed status result from useProfileStatus hook */
  status: StatusResult | null;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Error message if loading failed */
  error?: string | null;
  /** Optional callback when CTA is clicked */
  onCtaClick?: () => void;
  /** Optional className for the card wrapper */
  className?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Formats missing requirements into a readable sentence
 * @param missingRequirements - Array of missing requirement strings
 * @param statusKey - Current profile status to determine context
 * @returns Formatted string describing what's needed
 */
function formatMissingRequirementsMessage(
  missingRequirements: string[],
  statusKey: ProfessionalStatus
): string {
  if (missingRequirements.length === 0) return '';

  // Map requirement strings to more action-oriented phrases
  const formatRequirement = (req: string): string => {
    // Handle reference counts like "2 more references"
    const refMatch = req.match(/^(\d+) more reference/);
    if (refMatch) {
      const count = parseInt(refMatch[1], 10);
      return `add ${count} reference${count > 1 ? 's' : ''}`;
    }

    // Handle ID document
    if (req.toLowerCase().includes('id document')) {
      return 'upload an ID document';
    }

    // Handle qualification/certification
    if (req.toLowerCase().includes('qualification or certification')) {
      return 'add a qualification or certification';
    }

    // Handle work experience
    if (req.toLowerCase().includes('work experience')) {
      return 'add work experience';
    }

    // Handle skill
    if (req.toLowerCase().includes('skill')) {
      return 'add at least 1 skill';
    }

    // Handle language
    if (req.toLowerCase().includes('language')) {
      return 'add at least 1 language';
    }

    // Handle industry
    if (req.toLowerCase().includes('industry')) {
      return 'add at least 1 industry';
    }

    // Handle rates
    if (req.toLowerCase().includes('hourly rate')) {
      return 'set your hourly rate';
    }

    // Handle basic fields (First name, Last name, Job title, etc.)
    if (req === 'First name' || req === 'Last name') {
      return `add your ${req.toLowerCase()}`;
    }

    if (req === 'Job title') {
      return 'add your job title';
    }

    if (req === 'Address') {
      return 'add your address';
    }

    if (req === 'Country') {
      return 'select your country';
    }

    // Default: lowercase and prefix with "add"
    return `add ${req.toLowerCase()}`;
  };

  const formattedItems = missingRequirements.map(formatRequirement);

  // Determine the goal based on status
  const goalText = statusKey === 'registered' 
    ? 'to complete your Basic Profile'
    : 'to complete your Full Profile';

  // Build the sentence
  if (formattedItems.length === 1) {
    return `Next: ${capitalizeFirst(formattedItems[0])} ${goalText}.`;
  }

  if (formattedItems.length === 2) {
    return `Next: ${capitalizeFirst(formattedItems[0])} and ${formattedItems[1]} ${goalText}.`;
  }

  // 3+ items: "A, B, and C"
  const lastItem = formattedItems[formattedItems.length - 1];
  const otherItems = formattedItems.slice(0, -1);
  return `Next: ${capitalizeFirst(otherItems.join(', '))}, and ${lastItem} ${goalText}.`;
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Status badge with icon
 */
function StatusBadge({ 
  status, 
  title, 
  badgeIcon, 
  badgeColor 
}: { 
  status: ProfessionalStatus;
  title: string;
  badgeIcon: 'lock' | 'clock' | 'check' | 'x';
  badgeColor: 'blue' | 'green' | 'red';
}) {
  const iconMap = {
    lock: Lock,
    clock: Clock,
    check: CheckCircle,
    x: XCircle,
  };

  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };

  const Icon = iconMap[badgeIcon];

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium',
      colorMap[badgeColor]
    )}>
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </div>
  );
}

/**
 * Progress step indicator
 */
function ProgressStep({ 
  label, 
  stepIndex, 
  completedSteps, 
  isVetted,
  isDeclined
}: { 
  label: string;
  stepIndex: number;
  completedSteps: number;
  isVetted: boolean;
  isDeclined: boolean;
}) {
  const isCompleted = stepIndex < completedSteps;
  const isCurrent = stepIndex === completedSteps - 1;
  const isLast = stepIndex === 3; // Vetted step

  // Determine the bar color
  let barColor = 'bg-slate-200'; // Default: incomplete
  if (isCompleted || isCurrent) {
    if (isLast && isVetted) {
      barColor = 'bg-green-500'; // Green for vetted
    } else if (isDeclined && isCurrent) {
      barColor = 'bg-blue-500'; // Still show blue for declined (they completed full)
    } else {
      barColor = 'bg-blue-500'; // Blue for completed
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center gap-1.5">
      {/* Progress bar segment */}
      <div className="w-full h-1.5 rounded-full relative">
        <div className={cn('h-full rounded-full transition-all', barColor)} />
        {/* Lock icon for incomplete steps */}
        {!isCompleted && !isCurrent && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
          </div>
        )}
      </div>
      {/* Step label */}
      <span className={cn(
        'text-xs font-medium',
        isCompleted || isCurrent ? 'text-slate-700' : 'text-slate-400'
      )}>
        {label}
      </span>
    </div>
  );
}

/**
 * Progress bar with all steps
 */
function ProgressBar({ 
  completedSteps, 
  status 
}: { 
  completedSteps: number;
  status: ProfessionalStatus;
}) {
  const steps = getProgressSteps();
  const isVetted = status === 'vetted_approved';
  const isDeclined = status === 'vetted_declined';

  return (
    <div className="flex gap-2 w-full">
      {steps.map((label, index) => (
        <ProgressStep
          key={label}
          label={label}
          stepIndex={index}
          completedSteps={completedSteps}
          isVetted={isVetted}
          isDeclined={isDeclined}
        />
      ))}
    </div>
  );
}

/**
 * Loading skeleton
 */
function ProfileStatusCardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full lg:w-48" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Error state
 */
function ProfileStatusCardError({ error }: { error: string }) {
  return (
    <Card className="w-full border-red-200 bg-red-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Couldn't load profile status</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function ProfileStatusCard({
  status,
  isLoading = false,
  error = null,
  onCtaClick,
  className,
}: ProfileStatusCardProps) {
  const navigate = useNavigate();

  // Loading state
  if (isLoading) {
    return <ProfileStatusCardSkeleton />;
  }

  // Error state
  if (error) {
    return <ProfileStatusCardError error={error} />;
  }

  // No status yet
  if (!status) {
    return <ProfileStatusCardSkeleton />;
  }

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    }
    
    if (!status.ctaDisabled) {
      navigate(getCtaRoute(status));
    }
  };

  return (
    <Card className={cn('w-full overflow-hidden', className)}>
      <CardContent className="p-6">
        {/* Desktop: Two-column layout (>= 1024px) */}
        {/* Mobile: Vertical layout (< 1024px) */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
          
          {/* Left column: Header + Status info */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Build Your Professional Profile
                </h2>
                <p className="text-sm text-slate-500">
                  Complete your profile to unlock more opportunities on GigExecs.
                </p>
              </div>
            </div>

            {/* Current status label + badge */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                Current status
              </p>
              <StatusBadge
                status={status.statusKey}
                title={status.title}
                badgeIcon={status.badgeIcon}
                badgeColor={status.badgeColor}
              />
            </div>

            {/* Progress bar - Mobile only (shown in right column on desktop) */}
            <div className="mb-4 lg:hidden">
              <ProgressBar 
                completedSteps={status.completedSteps} 
                status={status.statusKey} 
              />
            </div>

            {/* Status description */}
            <p className="text-sm text-slate-600 mb-4">
              {status.body}
            </p>

            {/* CTA Button */}
            <Button
              onClick={handleCtaClick}
              disabled={status.ctaDisabled}
              className={cn(
                'w-full lg:w-auto',
                status.ctaDisabled && 'bg-slate-200 text-slate-500 cursor-not-allowed hover:bg-slate-200'
              )}
              variant={status.ctaDisabled ? 'secondary' : 'default'}
            >
              {status.ctaText}
            </Button>
          </div>

          {/* Right column: Progress bar - Desktop only */}
          <div className="hidden lg:flex lg:flex-col lg:items-end lg:justify-center lg:w-64">
            <ProgressBar 
              completedSteps={status.completedSteps} 
              status={status.statusKey} 
            />
          </div>
        </div>

        {/* Missing requirements hint - shows what's needed for next step */}
        {status.missingRequirements.length > 0 && status.statusKey !== 'vetted_approved' && status.statusKey !== 'pending_vetting' && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              {formatMissingRequirementsMessage(status.missingRequirements, status.statusKey)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Export Default
// =============================================================================

export default ProfileStatusCard;
