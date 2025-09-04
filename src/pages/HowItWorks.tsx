import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function HowItWorks() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
              <a href="/" className="text-2xl text-[#012E46] hover:text-[#0284C7] transition-colors cursor-pointer">
                <span className="font-bold">Gig</span><span className="font-normal">Execs</span>
              </a>
            </div>

            {/* Center - Navigation Links */}
            <div className="hidden lg:flex items-center space-x-12">
              <a href="/" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
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
              <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Blog</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#012E46] to-[#0284C7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            How it Works
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Discover how GigExecs connects businesses with experienced executives and senior professionals for fractional, freelance, and project-based roles.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              At <strong className="text-[#012E46]">GigExecs</strong>, we make it simple for businesses to connect with experienced executives and senior professionals — without the cost and commitment of traditional hiring.
            </p>
            
            <p className="text-lg text-gray-700 mb-12 leading-relaxed">
              Whether you're a company looking for flexible expertise or a professional offering your skills, here's how it works:
            </p>

            {/* For Clients Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[#012E46] mb-8">For Clients</h2>
              
              <div className="space-y-8">
                <Card className="border-l-4 border-l-[#0284C7]">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#012E46]">1. Tell us what you need</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      Post your project, role, or requirement. Define the skills, experience, and availability you're looking for.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#0284C7]">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#012E46]">2. Get matched with senior professionals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      Our network includes <strong className="text-[#012E46]">leaders with decades of experience</strong> across industries — available for <strong className="text-[#012E46]">fractional, freelance, or project-based work</strong>.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#0284C7]">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#012E46]">3. Hire with confidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      Connect directly, agree on terms, and start working quickly. Enjoy flexibility, cost savings, and access to top-tier talent on demand.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* For Professionals Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[#012E46] mb-8">For Professionals</h2>
              
              <div className="space-y-8">
                <Card className="border-l-4 border-l-[#FACC15]">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#012E46]">1. Create your profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      Showcase your skills, industry expertise, and track record.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#FACC15]">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#012E46]">2. Discover opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      Get matched with projects and roles that align with your experience and availability.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#FACC15]">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#012E46]">3. Work on your terms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      Choose fractional roles, freelance contracts, or project-based work that fits your lifestyle and goals.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Why GigExecs Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[#012E46] mb-8">Why GigExecs?</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#0284C7] rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#012E46] mb-2">Proven expertise</h3>
                    <p className="text-gray-700">Only experienced professionals and executives.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#0284C7] rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#012E46] mb-2">Flexible engagements</h3>
                    <p className="text-gray-700">Fractional, freelance, and project-based roles.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#0284C7] rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#012E46] mb-2">Faster hiring</h3>
                    <p className="text-gray-700">Skip lengthy recruitment cycles — get started quickly.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#0284C7] rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#012E46] mb-2">Cost-effective</h3>
                    <p className="text-gray-700">Access high-level skills without full-time overhead.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Started Section */}
            <div className="bg-gradient-to-r from-[#012E46] to-[#0284C7] rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-6">Get Started Today</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Clients</h3>
                  <p className="mb-4">Post a project and find the right expertise.</p>
                  <Button asChild className="bg-white text-[#012E46] hover:bg-gray-100">
                    <a href="/clients">Post a Project</a>
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Professionals</h3>
                  <p className="mb-4">Create your profile and showcase your experience.</p>
                  <Button asChild className="bg-[#FACC15] text-[#012E46] hover:bg-[#EAB308]">
                    <a href="/auth/register">Create Profile</a>
                  </Button>
                </div>
              </div>
              
              <p className="text-xl font-semibold">
                GigExecs is where <span className="text-[#FACC15]">opportunity meets experience</span>.
              </p>
            </div>
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
            <p>&copy; 2024 GigExecs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HowItWorks
