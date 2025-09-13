import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, FileText, ExternalLink } from 'lucide-react';

interface Certification {
  id: number;
  name: string;
  awarding_body: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  file_url?: string;
}

interface CertificationsViewProps {
  certifications: Certification[];
}

export function CertificationsView({ certifications }: CertificationsViewProps) {
  if (certifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No certifications added yet</p>
        <p className="text-sm text-slate-400 mt-1">
          Add your professional certifications to complete your profile
        </p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow && expiry > new Date();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          Professional Certifications ({certifications.length})
        </h3>
        <Badge variant="outline" className="bg-slate-50 text-slate-600">
          {certifications.length >= 1 ? 'Complete' : 'Add certification needed'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {certifications.map((certification) => {
          const expired = isExpired(certification.expiry_date);
          const expiringSoon = isExpiringSoon(certification.expiry_date);
          
          return (
            <Card key={certification.id} className="border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-slate-500" />
                      <h4 className="font-medium text-slate-900">
                        {certification.name}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {certification.awarding_body}
                      </Badge>
                      {certification.credential_id && (
                        <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                          ID: {certification.credential_id}
                        </Badge>
                      )}
                      {expired && (
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          Expired
                        </Badge>
                      )}
                      {expiringSoon && !expired && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          Expires Soon
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Issued: {formatDate(certification.issue_date)}
                        </span>
                      </div>
                      {certification.expiry_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className={expired ? 'text-red-600' : expiringSoon ? 'text-yellow-600' : ''}>
                            Expires: {formatDate(certification.expiry_date)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {certification.credential_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(certification.credential_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Verify
                      </Button>
                    )}
                    {certification.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(certification.file_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
