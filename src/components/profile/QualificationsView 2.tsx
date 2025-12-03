import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Calendar, Award, FileText, ExternalLink } from 'lucide-react';

interface Qualification {
  id: number;
  institution_name: string;
  degree_level: string;
  grade?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  file_url?: string;
}

interface QualificationsViewProps {
  qualifications: Qualification[];
}

export function QualificationsView({ qualifications }: QualificationsViewProps) {
  if (qualifications.length === 0) {
    return (
      <div className="text-center py-8">
        <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No qualifications added yet</p>
        <p className="text-sm text-slate-400 mt-1">
          Add your educational background to complete your profile
        </p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const getDegreeLevelColor = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes('phd') || levelLower.includes('doctorate')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    if (levelLower.includes('master') || levelLower.includes('mba')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (levelLower.includes('bachelor') || levelLower.includes('degree')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          Educational Qualifications ({qualifications.length})
        </h3>
        <Badge variant="outline" className="bg-slate-50 text-slate-600">
          {qualifications.length >= 1 ? 'Complete' : 'Add qualification needed'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {qualifications.map((qualification) => (
          <Card key={qualification.id} className="border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="w-5 h-5 text-slate-500" />
                    <h4 className="font-medium text-slate-900">
                      {qualification.institution_name}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className={getDegreeLevelColor(qualification.degree_level)}
                    >
                      {qualification.degree_level}
                    </Badge>
                    {qualification.grade && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {qualification.grade}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(qualification.start_date)} - {formatDate(qualification.end_date)}
                      </span>
                    </div>
                  </div>
                  
                  {qualification.description && (
                    <p className="text-slate-600 text-sm mt-2">{qualification.description}</p>
                  )}
                </div>
                
                {qualification.file_url && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(qualification.file_url, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View Document
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
