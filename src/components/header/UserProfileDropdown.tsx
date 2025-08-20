import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Bell, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import type { CurrentUser } from '@/lib/getCurrentUser';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';

type Props = { user: CurrentUser | null };

export function UserProfileDropdown({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const name = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <div className="flex items-center gap-4">
      {/* User Info Display */}
      <div className="flex items-center gap-3">
        {/* User Avatar Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full"
          aria-label="User menu"
        >
          <ProfileAvatar user={user} size="md" />
        </button>
      </div>

      {/* Notifications and Messages Icons */}
      <div className="flex items-center gap-2">
        <button aria-label="Notifications" className="p-1">
          <Bell className="w-6 h-6" />
        </button>
        <button aria-label="Messages" className="p-1">
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

      {/* Dropdown Menu */}
      <div className="relative" ref={dropdownRef}>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
            {/* User Profile Section */}
            <div className="px-4 py-3 border-b border-slate-200">
              <div className="flex flex-col items-center">
                {/* Profile Picture */}
                <ProfileAvatar user={user} size="xl" />
                {/* User Name */}
                <h3 className="font-semibold text-slate-900 text-center mt-2">{name}</h3>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
              >
                <User className="w-4 h-4" />
                View Profile
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
