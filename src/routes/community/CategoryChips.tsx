/**
 * CategoryChips Component
 * Displays horizontal scrollable category chips for filtering posts
 */

import { useCategories } from '@/lib/community.hooks';
import type { ForumCategory } from '@/lib/community.types';

interface CategoryChipsProps {
  selectedCategoryId?: number;
  onCategoryChange: (categoryId: number | undefined) => void;
}

export default function CategoryChips({ selectedCategoryId, onCategoryChange }: CategoryChipsProps) {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="flex space-x-3 overflow-x-auto pb-2">
        <div className="flex-shrink-0 w-20 h-8 bg-slate-200 rounded-full animate-pulse" />
        <div className="flex-shrink-0 w-24 h-8 bg-slate-200 rounded-full animate-pulse" />
        <div className="flex-shrink-0 w-28 h-8 bg-slate-200 rounded-full animate-pulse" />
        <div className="flex-shrink-0 w-20 h-8 bg-slate-200 rounded-full animate-pulse" />
      </div>
    );
  }

  if (error || !categories) {
    return (
      <div className="text-slate-500 text-sm">
        Failed to load categories
      </div>
    );
  }

  return (
    <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
      {/* "All" category chip */}
      <button
        onClick={() => onCategoryChange(undefined)}
        className={`
          flex-shrink-0 px-4 py-1 text-sm font-medium rounded-full transition-colors
          ${selectedCategoryId === undefined
            ? 'bg-slate-800 text-white'
            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }
        `}
      >
        All
      </button>

      {/* Category chips */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            flex-shrink-0 px-4 py-1 text-sm font-medium rounded-full transition-colors
            ${selectedCategoryId === category.id
              ? 'bg-slate-800 text-white'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
