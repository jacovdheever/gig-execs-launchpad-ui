import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Plus, FolderOpen } from 'lucide-react';

interface GigsDropdownProps {
  isActive?: boolean;
}

export function GigsDropdown({ isActive }: GigsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const base = 'flex items-center gap-2';
  const inactive = 'text-slate-700 hover:text-slate-900';
  const active = 'text-slate-900 border-b-2 border-yellow-500';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${base} ${isActive ? active : inactive} transition-colors`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FolderOpen className="w-5 h-5" />
        <span>My Gigs</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          aria-hidden 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            <Link
              to="/gig-creation/step1"
              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Plus className="w-4 h-4 text-green-600" />
              <div>
                <div className="font-medium">Create Gig</div>
                <div className="text-sm text-slate-500">Start a new project</div>
              </div>
            </Link>
            
            <div className="border-t border-slate-100 my-1"></div>
            
            <Link
              to="/projects"
              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-medium">Manage Gigs</div>
                <div className="text-sm text-slate-500">View and edit projects</div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
