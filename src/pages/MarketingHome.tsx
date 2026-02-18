import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, CalendarDays, Shuffle, Users } from 'lucide-react'
import { PageMeta } from '@/components/PageMeta'
import { JsonLd } from '@/components/JsonLd'
import { TrustBlocks } from '@/components/TrustBlocks'
import {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
} from '@/lib/schema'

function Homepage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF]">
      <PageMeta
        title="Premium Network of Vetted Independent Consultants"
        description="A premium community of vetted independent consultants and senior professionals. Explore flexible work: advisory, interim leadership, fractional roles, contracts, and projects."
        path="/"
      />
      <JsonLd
        schema={[
          organizationSchema(),
          websiteSchema(),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
        ]}
      />
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <a href="/" className="text-2xl font-extrabold text-slate-900 hover:text-[#0284C7] transition-colors cursor-pointer">
                GigExecs
              </a>
            </div>

            {/* Center - Navigation Links */}
            <div className="hidden lg:flex items-center space-x-12">
              <a href="/" className="text-[#0284C7] font-semibold">What is GigExecs</a>
              <a href="/clients" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Blog</a>
            </div>

            {/* Right side - Action Buttons */}
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

            {/* Mobile Menu Button */}
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

          {/* Mobile Navigation Menu */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#F5F5F5]">
              <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#0284C7] font-semibold">What is GigExecs</a>
              <a href="/clients" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Blog</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden min-h-screen">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ minHeight: '100vh' }}
            onError={(e) => {
              console.error('Main banner video 2 failed to load, falling back to image:', e);
              // Fallback to image if video fails
              const videoContainer = e.currentTarget.parentElement;
              if (videoContainer) {
                videoContainer.innerHTML = `
                  <div 
                    class="w-full h-full"
                    style="
                      background-image: url('/images/main-header-banner-image.png');
                      background-size: cover;
                      background-position: center;
                      background-repeat: no-repeat;
                      min-height: 100vh;
                    "
                  ></div>
                `;
              }
            }}
          >
            <source src="/videos/main-banner-video-2.mp4" type="video/mp4" />
            {/* Fallback image if video is not supported */}
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: 'url(/images/main-header-banner-image.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh'
              }}
            />
          </video>
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 h-screen flex items-center">
          <div className="relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[60vh]">
              {/* Left side - empty to show video background */}
              <div className="hidden lg:block"></div>
              
              {/* Right side - content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl animate-fade-in-up">
                  GigExecs: A Premium Network of Independent Senior Professionals
                </h1>
                <p className="text-lg sm:text-xl text-white/95 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Join a vetted community of senior independent consultants and highly experienced professionals. Discover high-quality flexible work—advisory, interim leadership, fractional roles, contracts, and project engagements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Button size="lg" className="bg-white hover:bg-gray-100 text-[#012E46] px-8 py-3 drop-shadow-lg transition-all duration-300 hover:scale-105 font-semibold">
                    <a href="/auth/register" className="w-full h-full flex items-center justify-center text-[#012E46]">
                      Join GigExecs
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-[#012E46] px-8 py-3 drop-shadow-lg backdrop-blur-sm bg-white/10 transition-all duration-300 hover:scale-105 font-semibold"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
              Why Choose GigExecs?
            </h2>
            <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
              A modern platform and community built for senior independent professionals in the future of work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Built for Senior Independent Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  A digital platform designed for senior and highly experienced professionals—whether you&apos;re already independent or transitioning from corporate life.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">High-Quality Opportunities, Updated Daily</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  We publish senior-level flexible opportunities every day—focused on meaningful work, fair rates, and roles where experience matters.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shuffle className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Flexible Work, Matched to Senior Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  Find advisory work, interim leadership, fractional roles, fixed-term contracts, and project engagements—matched to your expertise.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Community First. Premium Network Always.</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  GigExecs is a vetted community and global network—built on credibility, trust, and shared standards, not bidding and noise.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Two-path CTA strip */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Link
              to="/clients"
              className="group block rounded-lg border border-border/50 bg-muted/30 px-6 py-5 transition-colors hover:bg-muted/50 hover:border-[#0284C7]/40 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">Hiring senior expertise?</p>
              <p className="text-base text-[#1F2937] mb-3 leading-snug">
                Access vetted independent consultants for advisory, interim leadership, fractional roles, and project engagements.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-[#0284C7] group-hover:underline">
                Explore Clients →
              </span>
            </Link>
            <Link
              to="/professionals"
              className="group block rounded-lg border border-border/50 bg-muted/30 px-6 py-5 transition-colors hover:bg-muted/50 hover:border-[#0284C7]/40 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">Are you a senior professional?</p>
              <p className="text-base text-[#1F2937] mb-3 leading-snug">
                Join a premium network built on credibility and meaningful flexible work.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-[#0284C7] group-hover:underline">
                Explore Professionals →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Future of Work & Longevity Economy */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-12 text-center">
            The Future of Work and the Longevity Economy
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-4">
                Access Experience Faster—Without Full-Time Red Tape
              </h3>
              <p className="text-lg text-[#9CA3AF] leading-relaxed">
                Companies increasingly rely on flexible senior expertise to move faster—without long hiring cycles, headcount constraints, or complex full-time employment processes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-4">
                Stay Professionally and Financially Active for Longer
              </h3>
              <p className="text-lg text-[#9CA3AF] leading-relaxed">
                People are living longer and healthier lives. GigExecs helps highly experienced professionals stay engaged through flexible work that fits this new reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bridge statement - high-converting hero copy */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <blockquote className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-[#FACC15] rounded-full" aria-hidden />
            <p className="pl-6 sm:pl-8 text-xl sm:text-2xl lg:text-3xl font-semibold text-[#012E46] leading-snug tracking-tight">
              GigExecs bridges modern hiring needs with a premium network of senior independent consultants.
            </p>
          </blockquote>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-6">
                Built for Professionals
              </h2>
              <p className="text-lg text-[#9CA3AF] mb-6 leading-relaxed">
                GigExecs is a premium community and global network built for vetted independent consultants and highly experienced professionals. Build a credible profile, connect with meaningful opportunities, and thrive in flexible work—without the noise of crowded platforms.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#0284C7] rounded-full mr-3"></div>
                  <span className="text-[#1F2937]">Vetted profiles that highlight outcomes, leadership, and measurable impact</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#0284C7] rounded-full mr-3"></div>
                  <span className="text-[#1F2937]">A community-driven standard of quality, trust, and professionalism</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#0284C7] rounded-full mr-3"></div>
                  <span className="text-[#1F2937]">Flexible engagements across advisory, interim leadership, fractional roles, contracts, and project work</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#0284C7] rounded-full mr-3"></div>
                  <span className="text-[#1F2937]">Secure platform tools for introductions, communication, and (where applicable) payments</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#DC2626] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#F97316] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#16A34A] rounded-full"></div>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <div className="text-sm text-[#9CA3AF] font-mono">
                      <div className="text-[#16A34A]">✓</div>
                      <div className="text-[#1F2937]">Profile Verified</div>
                    </div>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <div className="text-sm text-[#9CA3AF] font-mono">
                      <div className="text-[#16A34A]">✓</div>
                      <div className="text-[#1F2937]">Project Matched</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TrustBlocks - subtle trust strip for SEO/LLM visibility */}
      <section aria-label="Vetting and quality standards" className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBlocks variant="default" />
        </div>
      </section>

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
  )
}

export default Homepage
