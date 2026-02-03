import { useState } from 'react';
import { Menu, ChevronDown, HelpCircle, User, LogOut, Settings, MessageSquare } from 'lucide-react';
import { SearchBar } from './SearchBar';
import type { CurrentUser } from '@/lib/getCurrentUser';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { supabase } from '@/lib/supabase';


type Props = { user: CurrentUser | null };

export function MobileMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          
          {/* Settings */}
          <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <Settings className="w-5 h-5" /> Settings
          </Link>
          
          {/* Feedback */}
          <Link to="/feedback" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Feedback
          </Link>
          
          {/* Help & Support */}
          <Link to="/help-secure" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" /> Help &amp; Support
          </Link>
        </nav>

        {/* User Actions - Separated section */}
        <div className="mt-8 pt-6 border-t border-white/30">
          <nav className="space-y-4 text-[18px]">
            {/* View Profile */}
            <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <User className="w-5 h-5" /> View Profile
            </Link>
            
            {/* Sign Out */}
            <button 
              onClick={() => {
                setOpen(false);
                handleSignOut();
              }} 
              className="flex items-center gap-2 text-left w-full"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
