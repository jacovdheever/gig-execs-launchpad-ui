/**
 * SortMenu Component
 * Displays a popover menu for sorting posts
 */

import { useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Eye 
} from 'lucide-react';
import type { SortOption } from '@/lib/community.types';

interface SortMenuProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  { 
    value: 'default' as SortOption, 
    label: 'Default (Activity)', 
    icon: <Activity className="w-4 h-4" />,
    description: 'Most recent activity'
  },
  { 
    value: 'new' as SortOption, 
    label: 'New (Created)', 
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Recently created posts'
  },
  { 
    value: 'top' as SortOption, 
    label: 'Top (Reactions)', 
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Most reactions'
  },
  { 
    value: 'unread' as SortOption, 
    label: 'Unread', 
    icon: <Eye className="w-4 h-4" />,
    description: 'Posts you haven\'t read'
  },
];

export default function SortMenu({ currentSort, onSortChange }: SortMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (sort: SortOption) => {
    onSortChange(sort);
    setIsOpen(false);
  };

  const currentSortOption = sortOptions.find(option => option.value === currentSort);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-slate-100"
          aria-label="Sort posts"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors
                ${currentSort === option.value
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              <div className="text-slate-500">
                {option.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-slate-500">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
