import { Bell, MessageSquare } from 'lucide-react';
import { CurrentUser } from '@/lib/getCurrentUser';

type Props = { user: CurrentUser | null };

export function UserBadge({ user }: Props) {
  const name = user ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` : '';
  const roleLabel = user?.role === 'consultant' ? 'Professional Account' : 'Client Account';
  
  // Get initials for avatar placeholder
  const getInitials = () => {
    if (!user) return 'U';
    const first = user.firstName.charAt(0).toUpperCase();
    const last = user.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  };

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        {/* Avatar with initials or profile photo */}
        {user?.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={`${name} profile`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700">
            {getInitials()}
          </div>
        )}
        <div className="-space-y-1">
          <div className="text-[16px] leading-5">{name}</div>
          <div className="text-xs font-semibold tracking-[0.25em] text-yellow-500">{roleLabel}</div>
        </div>
      </div>
      <button aria-label="Notifications" className="p-1">
        <Bell className="w-6 h-6" />
      </button>
      <button aria-label="Messages" className="p-1">
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
