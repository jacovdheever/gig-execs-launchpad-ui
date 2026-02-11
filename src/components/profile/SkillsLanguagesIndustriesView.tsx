import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SkillsLanguagesIndustriesViewProps {
  items: string[];
  emptyMessage: string;
}

export function SkillsLanguagesIndustriesView({ items, emptyMessage }: SkillsLanguagesIndustriesViewProps) {
  if (items.length === 0) {
    return (
      <p className="text-slate-500 text-sm py-4">{emptyMessage}</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((name, idx) => (
        <Badge key={idx} variant="secondary" className="font-normal">
          {name}
        </Badge>
      ))}
    </div>
  );
}
