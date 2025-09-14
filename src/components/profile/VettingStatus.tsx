import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Info, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VettingStatusProps {
  vettingStatus?: 'pending' | 'in_progress' | 'verified' | 'rejected';
  profileTier: 'BASIC' | 'FULL' | 'ALL_STAR';
}

export function VettingStatus({ vettingStatus, profileTier }: VettingStatusProps) {
  // Determine the display status based on profile tier and vetting status
  const getDisplayStatus = () => {
    // If profile is not complete enough for vetting
    if (profileTier === 'BASIC') {
      return {
        status: 'incomplete',
        label: 'Profile Incomplete',
        description: 'Complete your profile to Basic level to be eligible for verification',
        icon: AlertCircle,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        iconColor: 'text-gray-500'
      };
    }

    // If profile is complete but not yet submitted for vetting
    if (!vettingStatus || vettingStatus === 'pending') {
      return {
        status: 'ready',
        label: 'Profile Ready for Verification',
        description: 'Your profile meets all requirements. Submit for verification to get verified status',
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        iconColor: 'text-blue-500'
      };
    }

    // If vetting is in progress
    if (vettingStatus === 'in_progress') {
      return {
        status: 'in_progress',
        label: 'Verification In Progress',
        description: 'Your profile is currently being reviewed by our verification team',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        iconColor: 'text-yellow-500'
      };
    }

    // If verification is complete and approved
    if (vettingStatus === 'verified') {
      return {
        status: 'verified',
        label: 'Profile Verified',
        description: 'Your profile has been verified and approved by our team',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        iconColor: 'text-green-500'
      };
    }

    // If verification was rejected
    if (vettingStatus === 'rejected') {
      return {
        status: 'rejected',
        label: 'Verified: Not Approved',
        description: 'Your profile verification was not approved. Please review the feedback and resubmit',
        icon: XCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        iconColor: 'text-red-500'
      };
    }

    // Default fallback
    return {
      status: 'incomplete',
      label: 'Profile Incomplete',
      description: 'Complete your profile to be eligible for verification',
      icon: AlertCircle,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      iconColor: 'text-gray-500'
    };
  };

  const displayStatus = getDisplayStatus();
  const Icon = displayStatus.icon;

  return (
    <div className="flex items-center gap-3">
      <Badge className={`${displayStatus.color} flex items-center gap-2`}>
        <Icon className={`w-4 h-4 ${displayStatus.iconColor}`} />
        {displayStatus.label}
      </Badge>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 hover:bg-slate-100 rounded-full transition-colors">
              <Info className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-sm">{displayStatus.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
