import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Find Expertise', path: '/clients' },
  { label: 'Become an Expert', path: '/professionals' },
  { label: 'How it Works', path: '/how-it-works' },
  { label: 'Insights', path: '/blog' },
] as const

function isNavActive(pathname: string, path: string) {
  if (path === '/blog') {
    return pathname === '/blog' || pathname.startsWith('/blog/')
  }
  return pathname === path
}

export function MarketingNav() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const linkClass = (path: string) =>
    cn(
      isNavActive(location.pathname, path)
        ? 'text-[#0284C7] font-semibold'
        : 'text-[#1F2937] hover:text-[#0284C7] transition-colors'
    )

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-slate-900 hover:text-[#0284C7] transition-colors cursor-pointer">
              GigExecs
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-12">
            {NAV_ITEMS.map((item) => (
              <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center">
            <Button variant="outline" className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] rounded-r-none border-r-0">
              <Link to="/auth/login" className="w-full h-full flex items-center justify-center">
                Sign in
              </Link>
            </Button>
            <Button className="bg-[#012E46] hover:bg-[#0284C7] text-white rounded-l-none">
              <Link to="/auth/register" className="w-full h-full flex items-center justify-center text-white">
                Join
              </Link>
            </Button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] rounded-r-none border-r-0 px-3">
              <Link to="/auth/login" className="w-full h-full flex items-center justify-center text-xs">
                Sign in
              </Link>
            </Button>
            <Button size="sm" className="bg-[#012E46] hover:bg-[#0284C7] text-white rounded-l-none px-3">
              <Link to="/auth/register" className="w-full h-full flex items-center justify-center text-white text-xs">
                Join
              </Link>
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1F2937] hover:text-[#0284C7] transition-colors p-1"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
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

        <div
          className={cn(
            'lg:hidden transition-all duration-300 ease-in-out overflow-hidden',
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#F5F5F5]">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn('block px-3 py-2', linkClass(item.path))}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
