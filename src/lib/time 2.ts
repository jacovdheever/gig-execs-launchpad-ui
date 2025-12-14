/**
 * Time utility functions for the Community feature
 * Formats relative time like "Last comment 27d ago"
 */

/**
 * Format a date as a relative time string
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  date: Date | string | number,
  options: {
    includeAgo?: boolean;
    shortForm?: boolean;
  } = {}
): string {
  const { includeAgo = true, shortForm = false } = options;
  
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  
  // Convert to seconds
  const diffInSeconds = Math.floor(diffInMs / 1000);
  
  if (diffInSeconds < 60) {
    return includeAgo ? 'just now' : 'now';
  }
  
  // Convert to minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  
  if (diffInMinutes < 60) {
    const unit = shortForm ? 'm' : 'minute';
    const plural = diffInMinutes === 1 ? unit : shortForm ? 'm' : unit + 's';
    return includeAgo ? `${diffInMinutes}${shortForm ? '' : ' '}${plural} ago` : `${diffInMinutes}${shortForm ? '' : ' '}${plural}`;
  }
  
  // Convert to hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  
  if (diffInHours < 24) {
    const unit = shortForm ? 'h' : 'hour';
    const plural = diffInHours === 1 ? unit : shortForm ? 'h' : unit + 's';
    return includeAgo ? `${diffInHours}${shortForm ? '' : ' '}${plural} ago` : `${diffInHours}${shortForm ? '' : ' '}${plural}`;
  }
  
  // Convert to days
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays < 7) {
    const unit = shortForm ? 'd' : 'day';
    const plural = diffInDays === 1 ? unit : shortForm ? 'd' : unit + 's';
    return includeAgo ? `${diffInDays}${shortForm ? '' : ' '}${plural} ago` : `${diffInDays}${shortForm ? '' : ' '}${plural}`;
  }
  
  // Convert to weeks
  const diffInWeeks = Math.floor(diffInDays / 7);
  
  if (diffInWeeks < 4) {
    const unit = shortForm ? 'w' : 'week';
    const plural = diffInWeeks === 1 ? unit : shortForm ? 'w' : unit + 's';
    return includeAgo ? `${diffInWeeks}${shortForm ? '' : ' '}${plural} ago` : `${diffInWeeks}${shortForm ? '' : ' '}${plural}`;
  }
  
  // Convert to months
  const diffInMonths = Math.floor(diffInDays / 30);
  
  if (diffInMonths < 12) {
    const unit = shortForm ? 'mo' : 'month';
    const plural = diffInMonths === 1 ? unit : shortForm ? 'mo' : unit + 's';
    return includeAgo ? `${diffInMonths}${shortForm ? '' : ' '}${plural} ago` : `${diffInMonths}${shortForm ? '' : ' '}${plural}`;
  }
  
  // Convert to years
  const diffInYears = Math.floor(diffInDays / 365);
  const unit = shortForm ? 'y' : 'year';
  const plural = diffInYears === 1 ? unit : shortForm ? 'y' : unit + 's';
  return includeAgo ? `${diffInYears}${shortForm ? '' : ' '}${plural} ago` : `${diffInYears}${shortForm ? '' : ' '}${plural}`;
}

/**
 * Format a date for display in post headers
 * @param date - The date to format
 * @returns Formatted date string like "Mar 7"
 */
export function formatPostDate(date: Date | string | number): string {
  const targetDate = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  // If less than 7 days, show relative time
  if (diffInDays < 7) {
    return formatRelativeTime(date, { includeAgo: false, shortForm: true });
  }
  
  // If less than 1 year, show month and day
  if (diffInDays < 365) {
    return targetDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // If more than 1 year, show month, day, and year
  return targetDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Check if a date is recent (within the last 24 hours)
 * @param date - The date to check
 * @returns True if the date is within the last 24 hours
 */
export function isRecent(date: Date | string | number): boolean {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  return diffInHours < 24;
}

/**
 * Get the time until a specific date (for countdowns like "Coffee hour in 26 hours")
 * @param date - The target date
 * @returns Formatted time until string
 */
export function formatTimeUntil(date: Date | string | number): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = targetDate.getTime() - now.getTime();
  
  if (diffInMs <= 0) {
    return 'happening now';
  }
  
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 0) {
    const unit = diffInDays === 1 ? 'day' : 'days';
    return `in ${diffInDays} ${unit}`;
  }
  
  if (diffInHours > 0) {
    const unit = diffInHours === 1 ? 'hour' : 'hours';
    return `in ${diffInHours} ${unit}`;
  }
  
  if (diffInMinutes > 0) {
    const unit = diffInMinutes === 1 ? 'minute' : 'minutes';
    return `in ${diffInMinutes} ${unit}`;
  }
  
  return 'in less than a minute';
}
