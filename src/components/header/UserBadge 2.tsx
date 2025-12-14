import { Bell, MessageSquare } from 'lucide-react';
import { CurrentUser } from '@/lib/getCurrentUser';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';

type Props = { user: CurrentUser | null };

export function UserBadge({ user }: Props) {

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        {/* Avatar with initials or profile photo */}
        <ProfileAvatar user={user} size="md" showName={true} />
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
