import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Calendar, Play, FileText, ExternalLink, Tag } from 'lucide-react';

interface PortfolioItem {
  id: number;
  project_name: string;
  project_role?: string;
  description?: string;
  start_date?: string;
  completed_date?: string;
  currently_open?: boolean;
  solution_video_url?: string;
  solution_files?: string[];
  skills?: string[];
}

interface PortfolioViewProps {
  portfolio: PortfolioItem[];
}

export function PortfolioView({ portfolio }: PortfolioViewProps) {
  if (portfolio.length === 0) {
    return (
      <div className="text-center py-8">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No portfolio projects added yet</p>
        <p className="text-sm text-slate-400 mt-1">
          Showcase your work to stand out to potential clients
        </p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension || '')) {
      return <FileText className="w-4 h-4 text-red-500" />;
    }
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <FileText className="w-4 h-4 text-blue-500" />;
    }
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          Portfolio Projects ({portfolio.length})
        </h3>
        <Badge variant="outline" className="bg-slate-50 text-slate-600">
          {portfolio.length >= 1 ? 'Complete' : 'Add project needed'}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {portfolio.map((item) => (
          <Card key={item.id} className="border border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {item.project_name}
                    </h4>
                    {item.project_role && (
                      <p className="text-sm text-slate-600">{item.project_role}</p>
                    )}
                  </div>
                  {item.currently_open && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {item.description}
                  </p>
                )}

                {/* Skills */}
                {item.skills && item.skills.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-500" />
                      <span className="text-xs font-medium text-slate-700">Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.skills.slice(0, 3).map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-slate-50 text-slate-700 border-slate-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {item.skills.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-slate-50 text-slate-700 border-slate-200"
                        >
                          +{item.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {formatDate(item.start_date)} - {item.currently_open ? 'Present' : formatDate(item.completed_date)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  {item.solution_video_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(item.solution_video_url, '_blank')}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Play className="w-3 h-3" />
                      Video
                    </Button>
                  )}
                  
                  {item.solution_files && item.solution_files.length > 0 && (
                    <div className="flex items-center gap-1">
                      {item.solution_files.slice(0, 2).map((file, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(file, '_blank')}
                          className="flex items-center gap-1 text-xs"
                        >
                          {getFileIcon(file)}
                          File {index + 1}
                        </Button>
                      ))}
                      {item.solution_files.length > 2 && (
                        <span className="text-xs text-slate-500">
                          +{item.solution_files.length - 2} more
                        </span>
                      )}
                    </div>
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
