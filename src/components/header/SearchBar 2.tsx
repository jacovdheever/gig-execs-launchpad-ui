import { Search } from 'lucide-react';
import { useState } from 'react';

type Props = { 
  onSearch?: (q: string) => void; 
  className?: string; 
  placeholder?: string; 
};

export function SearchBar({ onSearch, className, placeholder }: Props) {
  const [q, setQ] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(q.trim());
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`flex items-center rounded-[35px] border-2 border-sky-200 pl-6 pr-4 h-12 ${className || ''}`}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full outline-none placeholder:opacity-20"
        aria-label={placeholder || 'Search'}
        placeholder={placeholder || 'Search for gigs, consultants, teams and more...'}
      />
      <button type="submit" aria-label="Search">
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}
