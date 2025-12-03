import { NavLink } from 'react-router-dom';
import { Home, Briefcase, FolderClosed, Users, UserRound, HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import type { UserRole } from '@/lib/getCurrentUser';
import { GigsDropdown } from './GigsDropdown';

type Props = { role: UserRole; activePath?: string; };

const base = 'flex items-center gap-2';
const inactive = 'text-slate-700 hover:text-slate-900';
const active = 'text-slate-900 border-b-2 border-yellow-500';

export function NavTabs({ role }: Props) {
  const common = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { to: '/community', label: 'Community', icon: <MessageSquare className="w-5 h-5" /> },
    // Temporarily hidden until functionality is implemented
    // ...(role === 'client'
    //   ? [{ to: '/find', label: 'Find Professionals & Gigs', icon: <UserRound className="w-5 h-5" />, chevron: true }]
    //   : [{ to: '/find-gigs', label: 'Find Gigs', icon: <Briefcase className="w-5 h-5" /> }]),
    ...(role === 'consultant'
      ? [{ to: '/find-gigs', label: 'Find Gigs', icon: <Briefcase className="w-5 h-5" /> }]
      : []),
  ];

  return (
    <div className="flex items-center justify-between px-20 py-4">
      <nav className="flex items-center gap-[50px]">
        {common.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.chevron && <ChevronDown className="w-4 h-4" aria-hidden />}
          </NavLink>
        ))}
        
        {/* My Gigs Dropdown - Only for clients */}
        {role === 'client' && <GigsDropdown role={role} />}
      </nav>

      <NavLink to="/help-secure" className={`${base} ${inactive}`}>
        <HelpCircle className="w-5 h-5" />
        <span>Help &amp; Support</span>
      </NavLink>
    </div>
  );
}
