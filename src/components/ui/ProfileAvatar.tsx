import { cn } from '@/lib/utils';
import type { CurrentUser } from '@/lib/getCurrentUser';

interface ProfileAvatarProps {
  user: CurrentUser | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showName?: boolean;
}

export function ProfileAvatar({ user, size = 'md', className, showName = false }: ProfileAvatarProps) {
  // Get initials for avatar placeholder
  const getInitials = () => {
    if (!user) return 'U';
    const first = user.firstName.charAt(0).toUpperCase();
    const last = user.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const avatarSize = sizeClasses[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Avatar */}
      <div className={cn('relative rounded-full overflow-hidden', avatarSize)}>
        {user?.profilePhotoUrl ? (
          <img
            src={user.profilePhotoUrl}
            alt={`${user.firstName} ${user.lastName} profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn(
            'w-full h-full bg-slate-200 flex items-center justify-center font-semibold text-slate-700',
            avatarSize
          )}>
            {getInitials()}
          </div>
        )}
      </div>

      {/* Name (optional) */}
      {showName && user && (
        <div className="-space-y-1">
          <div className="text-[16px] leading-5">{`${user.firstName} ${user.lastName}`}</div>
          <div className="text-xs font-semibold tracking-[0.25em] text-yellow-500">
            {user.role === 'consultant' ? 'Professional Account' : 'Client Account'}
          </div>
        </div>
      )}
    </div>
  );
}
