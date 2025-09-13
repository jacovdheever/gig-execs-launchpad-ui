import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Building, User } from 'lucide-react';

interface Reference {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  description?: string;
}

interface ReferencesViewProps {
  references: Reference[];
}

export function ReferencesView({ references }: ReferencesViewProps) {
  if (references.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No references added yet</p>
        <p className="text-sm text-slate-400 mt-1">
          Add professional references to complete your profile
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          Professional References ({references.length})
        </h3>
        <Badge variant="outline" className="bg-slate-50 text-slate-600">
          {references.length >= 2 ? 'Complete' : `${2 - references.length} more needed`}
        </Badge>
      </div>

      <div className="grid gap-4">
        {references.map((reference) => (
          <Card key={reference.id} className="border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">
                    {reference.first_name} {reference.last_name}
                  </h4>
                  
                  {reference.company_name && (
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">{reference.company_name}</span>
                    </div>
                  )}
                  
                  {reference.description && (
                    <p className="text-slate-600 text-sm mt-2">{reference.description}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <a 
                    href={`mailto:${reference.email}`}
                    className="text-[#0284C7] hover:underline text-sm"
                  >
                    {reference.email}
                  </a>
                </div>
                
                {reference.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <a 
                      href={`tel:${reference.phone}`}
                      className="text-[#0284C7] hover:underline text-sm"
                    >
                      {reference.phone}
                    </a>
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
