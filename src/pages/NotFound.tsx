import { MarketingNav } from '@/components/MarketingNav'
import { MarketingFooter } from '@/components/MarketingFooter'
import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

/** GA4 gtag loaded globally from index.html */
type GtagFn = (...args: unknown[]) => void;

/** @returns true if the event was sent, false if gtag was not ready */
function sendGa4NotFoundEvent(pathname: string, search: string): boolean {
  if (typeof window === 'undefined') return true;
  const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
  if (typeof gtag !== 'function') return false;

  const params: Record<string, string> = {
    requested_path: pathname,
  };
  if (search && search.length > 1) {
    params.query_string = search.startsWith('?') ? search.slice(1) : search;
  }
  if (document.referrer) {
    params.referrer = document.referrer;
  }

  gtag('event', 'not_found', params);
  return true;
}

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    document.title = '404 - Page Not Found | GigExecs'

    if (sendGa4NotFoundEvent(location.pathname, location.search)) {
      return;
    }
    // gtag can load after first paint; retry once so the event isn't dropped
    const timer = window.setTimeout(() => {
      sendGa4NotFoundEvent(location.pathname, location.search);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <MarketingNav />

      {/* 404 Content */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#0284C7] mb-4">404</h1>
            <h2 className="text-4xl font-bold text-[#1F2937] mb-6">Page Not Found</h2>
            <p className="text-xl text-[#9CA3AF] mb-8 max-w-2xl mx-auto">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you may have entered the wrong URL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="border-[#0284C7] text-[#0284C7] hover:bg-[#0284C7] hover:text-white px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="bg-[#0284C7] hover:bg-[#0284C7]/90 text-white px-6 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="bg-white rounded-lg shadow-sm border p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6">Maybe you were looking for:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href="/" 
                className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Home className="w-5 h-5 text-[#0284C7] mr-3" />
                <div className="text-left">
                  <div className="font-medium text-[#1F2937]">Home</div>
                  <div className="text-sm text-[#9CA3AF]">Return to our homepage</div>
                </div>
              </a>
              <a 
                href="/clients" 
                className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Search className="w-5 h-5 text-[#0284C7] mr-3" />
                <div className="text-left">
                  <div className="font-medium text-[#1F2937]">For Clients</div>
                  <div className="text-sm text-[#9CA3AF]">Find senior professionals</div>
                </div>
              </a>
              <a 
                href="/professionals" 
                className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Search className="w-5 h-5 text-[#0284C7] mr-3" />
                <div className="text-left">
                  <div className="font-medium text-[#1F2937]">For Professionals</div>
                  <div className="text-sm text-[#9CA3AF]">Join our network</div>
                </div>
              </a>
              <a 
                href="/help" 
                className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Search className="w-5 h-5 text-[#0284C7] mr-3" />
                <div className="text-left">
                  <div className="font-medium text-[#1F2937]">Help & Support</div>
                  <div className="text-sm text-[#9CA3AF]">Get assistance</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
};

export default NotFound;
