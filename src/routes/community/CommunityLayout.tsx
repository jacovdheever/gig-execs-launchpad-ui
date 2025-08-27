/**
 * Community Layout Component
 * Provides layout for the Community feature
 */

import { Outlet } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';

export default function CommunityLayout() {
  return (
    <AppShell>
      <div className="min-h-screen bg-slate-50">
        {/* Community Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </div>
    </AppShell>
  );
}
