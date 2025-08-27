/**
 * Community Layout Component
 * Provides navigation tabs and layout for the Community feature
 */

import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { 
  MessageSquare, 
  GraduationCap, 
  Calendar, 
  Users, 
  Trophy, 
  Info 
} from 'lucide-react';

const communityTabs = [
  { 
    to: '/community', 
    label: 'Community', 
    icon: <MessageSquare className="w-5 h-5" />,
    end: true
  },
  { 
    to: '/community/classroom', 
    label: 'Classroom', 
    icon: <GraduationCap className="w-5 h-5" />
  },
  { 
    to: '/community/calendar', 
    label: 'Calendar', 
    icon: <Calendar className="w-5 h-5" />
  },
  { 
    to: '/community/members', 
    label: 'Members', 
    icon: <Users className="w-5 h-5" />
  },
  { 
    to: '/community/leaderboards', 
    label: 'Leaderboards', 
    icon: <Trophy className="w-5 h-5" />
  },
  { 
    to: '/community/about', 
    label: 'About', 
    icon: <Info className="w-5 h-5" />
  },
];

export default function CommunityLayout() {
  const location = useLocation();

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-50">
        {/* Community Navigation Tabs */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {communityTabs.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors
                    ${isActive 
                      ? 'border-yellow-500 text-yellow-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }
                  `}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Community Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </div>
    </AppShell>
  );
}
