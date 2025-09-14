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

        {/* Links - Match desktop menu */}
        <nav className="mt-6 space-y-5 text-[18px]">
          {/* Dashboard */}
          <Link to="/dashboard" onClick={() => setOpen(false)} className="block">Dashboard</Link>
          
          {/* Community */}
          <Link to="/community" onClick={() => setOpen(false)} className="block">Community</Link>
          
          {/* Find Gigs (consultants only) */}
          {user?.role === 'consultant' && (
            <Link to="/find-gigs" onClick={() => setOpen(false)} className="block">Find Gigs</Link>
          )}
          
          {/* My Gigs (clients only) */}
          {user?.role === 'client' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[18px]">
                <span>My Gigs</span><ChevronDown className="w-4 h-4" />
              </div>
              <div className="ml-4 space-y-2 text-[16px]">
                <Link to="/gig-creation/step1" onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white">
                  Create Gig
                </Link>
                <Link to="/projects" onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white">
                  Manage Gigs
                </Link>
              </div>
            </div>
          )}
          
          {/* Help & Support */}
          <Link to="/help-secure" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" /> Help &amp; Support
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
