import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeStyles, getStatusDisplayText, type ProfileStatus } from '@/lib/profile';

interface StatusBadgeProps {
  status: ProfileStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const displayText = getStatusDisplayText(status);
  const styles = getStatusBadgeStyles(status);
  
  return (
    <Badge 
      variant="outline" 
      className={`${styles} ${className} font-medium px-3 py-1`}
    >
      {displayText}
    </Badge>
  );
}
