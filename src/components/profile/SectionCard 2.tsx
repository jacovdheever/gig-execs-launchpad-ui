import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  isEditable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  className?: string;
}

export function SectionCard({ 
  title, 
  children, 
  isEditable = false, 
  isEditing = false,
  onEdit,
  onCancel,
  onSave,
  className = ''
}: SectionCardProps) {
  return (
    <Card className={`rounded-xl border border-slate-200 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">
            {title}
          </CardTitle>
          
          {isEditable && !isEditing && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
          
          {isEditable && isEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                className="flex items-center gap-2 bg-[#0284C7] hover:bg-[#0284C7]/90"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
