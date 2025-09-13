import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFound = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    document.title = '404 - Page Not Found | GigExecs'
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-extrabold text-slate-900 hover:text-[#0284C7] transition-colors cursor-pointer">
                GigExecs
              </a>
            </div>

            <div className="hidden lg:flex items-center space-x-12">
              <a href="/" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Blog</a>
            </div>

            <div className="flex items-center">
              <Button variant="outline" className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] rounded-r-none border-r-0">
                <a href="/auth/login" className="w-full h-full flex items-center justify-center">
                  Sign in
                </a>
              </Button>
              <Button className="bg-[#012E46] hover:bg-[#0284C7] text-white rounded-l-none">
                <a href="/auth/register" className="w-full h-full flex items-center justify-center text-white">
                  Join
                </a>
              </Button>
            </div>

            <div className="lg:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-[#1F2937] hover:text-[#0284C7] transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#F5F5F5]">
              <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Blog</a>
            </div>
          </div>
        </div>
      </nav>

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
      <footer className="bg-[#012E46] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <div className="text-2xl font-bold text-[#FACC15] mb-4">GigExecs</div>
              <p className="text-[#9CA3AF]">
                The premier community connecting top professionals and innovative companies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">How it works</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="/how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="/help" className="hover:text-white transition-colors">Help & Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/data-privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1F2937] mt-8 pt-8 text-center text-[#9CA3AF]">
            <p>&copy; {new Date().getFullYear()} GigExecs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
