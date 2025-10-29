import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Linkedin, User } from 'lucide-react';

interface BasicInfoViewProps {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    vetting_status?: string;
  };
  profile?: {
    job_title?: string;
    bio?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    country?: string;
    postal_code?: string;
    phone?: string;
    linkedin_url?: string;
  };
}

export function BasicInfoView({ user, profile }: BasicInfoViewProps) {
  const fullName = `${user.first_name} ${user.last_name}`;
  const location = [profile?.address1, profile?.address2, profile?.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{fullName}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Professional Account
            </Badge>
            {(user.vetting_status === 'verified' || user.vetting_status === 'vetted') && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">Contact Information</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">{user.email}</span>
            </div>
            
            {profile?.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">{profile.phone}</span>
              </div>
            )}
            
            {profile?.linkedin_url && (
              <div className="flex items-center gap-3">
                <Linkedin className="w-4 h-4 text-slate-500" />
                <a 
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0284C7] hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">Location & Role</h3>
          
          <div className="space-y-2">
            {location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">{location}</span>
              </div>
            )}
            
            {profile?.job_title && (
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">{profile.job_title}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile?.bio && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">About</h3>
          <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Address Details */}
      {(profile?.address1 || profile?.postal_code) && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">Address</h3>
          <div className="text-slate-700 space-y-1">
            {profile.address1 && <p>{profile.address1}</p>}
            {profile.address2 && <p>{profile.address2}</p>}
            {profile.address3 && <p>{profile.address3}</p>}
            {profile.postal_code && <p>{profile.postal_code}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
