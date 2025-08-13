import { useEffect, useState } from 'react';
import { getCurrentUser, CurrentUser } from '@/lib/getCurrentUser';
import { SearchBar } from './SearchBar';
import { UserBadge } from './UserBadge';
import { NavTabs } from './NavTabs';
import { MobileMenu } from './MobileMenu';
import { Bell, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AppHeader() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  
  useEffect(() => { 
    getCurrentUser().then(setUser); 
  }, []);

  return (
    <header className="w-full bg-white border-b border-yellow-500">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 md:px-20 md:py-4">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-3">
          <MobileMenu user={user} />
          <Link to="/dashboard" className="block">
            <span className="sr-only">GigExecs</span>
            {/* Replace with SVG logo when ready */}
            <div className="text-2xl font-extrabold text-slate-900">GigExecs</div>
          </Link>
        </div>

        {/* Center: search (desktop only) */}
        <div className="hidden md:flex flex-1 justify-center">
          <SearchBar className="w-full md:max-w-xl xl:w-[824px]" />
        </div>

        {/* Right: icons (mobile) / user cluster (desktop) */}
        <div className="flex items-center gap-4">
          <button aria-label="Notifications" className="md:hidden p-1">
            <Bell className="w-6 h-6" />
          </button>
          <button aria-label="Messages" className="md:hidden p-1">
            <MessageSquare className="w-6 h-6" />
          </button>
          <div className="hidden md:block">
            <UserBadge user={user} />
          </div>
        </div>
      </div>

      {/* Bottom bar nav (desktop only) */}
      <div className="hidden md:block border-t border-yellow-500">
        {user && <NavTabs role={user.role} />}
      </div>
    </header>
  );
}
