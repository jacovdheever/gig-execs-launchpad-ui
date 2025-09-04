import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function Homepage() {
  const [email, setEmail] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle email subscription
    console.log('Email submitted:', email)
    setEmail('')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <a href="#home" className="text-2xl text-[#012E46] hover:text-[#0284C7] transition-colors cursor-pointer">
                <span className="font-bold">Gig</span><span className="font-normal">Execs</span>
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
              console.error('Video failed to load, falling back to image:', e);
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
            <source src="/videos/hero-banner-gigexecs.mp4" type="video/mp4" />
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl animate-fade-in-up">
              GigExecs: The Premier Freelance Hub for{' '}
              <span className="bg-gradient-to-r from-[#FACC15] to-[#0284C7] bg-clip-text text-transparent drop-shadow-2xl">
                Top Professionals
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Join a growing network of experienced talent and innovative companies. GigExecs connects senior professionals with projects that need their expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-white hover:bg-gray-100 text-[#012E46] px-8 py-3 drop-shadow-lg transition-all duration-300 hover:scale-105 font-semibold">
                <a href="/auth/register" className="w-full h-full flex items-center justify-center text-[#012E46]">
                  Join GigExecs
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#012E46] px-8 py-3 drop-shadow-lg backdrop-blur-sm bg-white/10 transition-all duration-300 hover:scale-105 font-semibold">
                Learn More
              </Button>
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
              We make it easier to hire, manage and pay senior professionals in a trusted freelance ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0284C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Transparent and Easy Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  All pricing is upfront and visible to both professionals and clients.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#16A34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Give and Receive Feedback and Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  Track your performance and build your credibility in the community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0284C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Direct Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  Engage directly with clients or professionals using our built-in chat.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0284C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Verified Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  All users go through a vetting process to maintain a trusted space.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
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
                GigExecs is a trusted freelance platform that connects experienced professionals with innovative companies. 
                Start your freelance journey with confidence.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#0284C7] rounded-full mr-3"></div>
                  <span className="text-[#1F2937]">Verified professional profiles and credentials</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#0284C7] rounded-full mr-3"></div>
                  <span className="text-[#1F2937]">Secure payment processing and escrow services</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#0284C7] rounded-full mr-3"></div>
                  <span className="text-[#1F2937]">Built-in project management and communication tools</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#0284C7] rounded-full mr-3"></div>
                  <span className="text-[#1F2937]">Comprehensive feedback and rating system</span>
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

      {/* Newsletter Section */}
      <section id="newsletter" className="py-20 bg-gradient-to-r from-[#012E46] to-[#0284C7] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              A Premier Global Community for Elite Freelance Professionals
            </h2>
            <p className="text-lg text-white mb-8">
              Sign up today and join a platform built for experienced professionals and the businesses that need them.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" size="lg" className="bg-[#FACC15] hover:bg-[#EAB308] text-[#012E46] px-8 py-3 text-lg font-semibold">
                <a href="https://gigexecs.com/signup" target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center text-[#012E46]">
                  Sign up for GigExecs Now
                </a>
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#012E46] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <div className="text-2xl font-bold text-[#FACC15] mb-4">GigExecs</div>
              <p className="text-[#9CA3AF]">
                The premier freelance hub for top professionals and innovative companies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">How it works</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="/marketing" className="hover:text-white transition-colors">How it works</a></li>
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
            <p>&copy; 2024 GigExecs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage
