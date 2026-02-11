import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar } from 'lucide-react';

export interface WorkExperienceItem {
  id: number;
  company?: string;
  job_title?: string;
  description?: string;
  city?: string;
  start_date_year?: number;
  start_date_month?: string;
  end_date_year?: number | null;
  end_date_month?: string | null;
  currently_working?: boolean;
}

interface WorkExperienceViewProps {
  experiences: WorkExperienceItem[];
}

export function WorkExperienceView({ experiences }: WorkExperienceViewProps) {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-8">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No work experience added yet</p>
        <p className="text-sm text-slate-400 mt-1">
          At least 1 work experience is required for vetting
        </p>
      </div>
    );
  }

  const formatDateRange = (exp: WorkExperienceItem) => {
    const start = exp.start_date_year ?? '?';
    if (exp.currently_working) return `${start} – Present`;
    const end = exp.end_date_year ?? '?';
    return `${start} – ${end}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          Work Experience ({experiences.length})
        </h3>
        <Badge variant="outline" className="bg-slate-50 text-slate-600">
          {experiences.length >= 1 ? 'Complete' : 'Add work experience needed'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {experiences.map((exp) => (
          <Card key={exp.id} className="border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-5 h-5 text-slate-500 shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900">
                        {exp.job_title || 'Role'}
                        {exp.company && (
                          <span className="text-slate-600 font-normal"> at {exp.company}</span>
                        )}
                      </h4>
                      {exp.city && (
                        <p className="text-sm text-slate-500">{exp.city}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(exp)}</span>
                    </div>
                    {exp.currently_working && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 text-sm mt-2 whitespace-pre-wrap">{exp.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
