/**
 * CommunityPlaceholder Component
 * Placeholder for Community tabs that haven't been implemented yet
 */

import { Calendar, GraduationCap, Users, Trophy, Info } from 'lucide-react';

interface CommunityPlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function CommunityPlaceholder({ title, description, icon }: CommunityPlaceholderProps) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6">
        <div className="text-slate-600">
          {icon}
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        {title}
      </h1>
      
      <p className="text-lg text-slate-600 max-w-md mx-auto mb-8">
        {description}
      </p>
      
      <div className="bg-slate-50 rounded-xl p-6 max-w-md mx-auto">
        <p className="text-slate-500 text-sm">
          This feature is coming soon! We're working hard to bring you the best community experience.
        </p>
      </div>
    </div>
  );
}

// Pre-configured placeholders for each tab
export function ClassroomPlaceholder() {
  return (
    <CommunityPlaceholder
      title="Classroom"
      description="Learn from industry experts and access exclusive courses and resources."
      icon={<GraduationCap className="w-8 h-8" />}
    />
  );
}

export function CalendarPlaceholder() {
  return (
    <CommunityPlaceholder
      title="Calendar"
      description="Stay updated with upcoming events, workshops, and community meetups."
      icon={<Calendar className="w-8 h-8" />}
    />
  );
}

export function MembersPlaceholder() {
  return (
    <CommunityPlaceholder
      title="Members"
      description="Connect with other professionals and discover new opportunities."
      icon={<Users className="w-8 h-8" />}
    />
  );
}

export function LeaderboardsPlaceholder() {
  return (
    <CommunityPlaceholder
      title="Leaderboards"
      description="See who's making waves in the community and celebrate achievements."
      icon={<Trophy className="w-8 h-8" />}
    />
  );
}

export function AboutPlaceholder() {
  return (
    <CommunityPlaceholder
      title="About"
      description="Learn more about our community values, guidelines, and mission."
      icon={<Info className="w-8 h-8" />}
    />
  );
}
