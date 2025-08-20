import { useState } from 'react';
import { Menu, ChevronDown, HelpCircle } from 'lucide-react';
import { SearchBar } from './SearchBar';
import type { CurrentUser } from '@/lib/getCurrentUser';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';


type Props = { user: CurrentUser | null };

export function MobileMenu({ user }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label="Menu" className="p-2 md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-[85%] max-w-[360px] bg-[#0f3441] text-white p-6 border-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          {/* User Avatar */}
          <ProfileAvatar user={user} size="lg" showName={true} />
        </div>
        <div className="h-px bg-white/30 my-4" />

        {/* Search */}
        <SearchBar className="bg-white text-slate-800" />

        {/* Links */}
        <nav className="mt-6 space-y-5 text-[18px]">
          <Link to="/profile" onClick={() => setOpen(false)} className="block">View Profile</Link>
          <Link to="/dashboard" onClick={() => setOpen(false)} className="block">Dashboard</Link>
          <Link to="/find" onClick={() => setOpen(false)} className="block">
            {user?.role === 'consultant' ? 'Find Gigs' : 'Find Professionals & Gigs'}
          </Link>
          <button className="flex items-center gap-2">
            <span>My Gigs</span><ChevronDown className="w-4 h-4" />
          </button>
          <Link to="/reports" onClick={() => setOpen(false)} className="block">Reports</Link>
          <Link to="/help" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" /> Help &amp; Support
          </Link>
          <Link to="/settings" onClick={() => setOpen(false)} className="block">Settings</Link>
          <button onClick={async () => { /* supabase.auth.signOut() */ }} className="block text-left w-full">Sign out</button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
