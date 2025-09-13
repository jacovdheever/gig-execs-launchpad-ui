import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Linkedin, Twitter } from 'lucide-react'

const AboutUs = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.title = 'About GigExecs | Senior Professionals & Fractional Executives Marketplace'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'GigExecs connects innovative companies with seasoned professionals for fractional, freelance, and project-based roles. Learn about our mission, team, and vision for the future of work.')
    }

    // Add meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', 'GigExecs, fractional executives, senior professionals, freelance executives, project-based consultants, gig economy leadership, hire senior talent, executive marketplace')

    // Add Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      const ogTitleEl = document.createElement('meta')
      ogTitleEl.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitleEl)
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'About GigExecs | Senior Professionals & Fractional Executives Marketplace')

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (!ogDescription) {
      const ogDescriptionEl = document.createElement('meta')
      ogDescriptionEl.setAttribute('property', 'og:description')
      document.head.appendChild(ogDescriptionEl)
    }
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Discover GigExecs\' mission to revolutionize the gig economy by connecting innovative companies with seasoned professionals. Meet the team driving the future of work.')

    const ogType = document.querySelector('meta[property="og:type"]')
    if (!ogType) {
      const ogTypeEl = document.createElement('meta')
      ogTypeEl.setAttribute('property', 'og:type')
      document.head.appendChild(ogTypeEl)
    }
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', 'website')

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (!ogUrl) {
      const ogUrlEl = document.createElement('meta')
      ogUrlEl.setAttribute('property', 'og:url')
      document.head.appendChild(ogUrlEl)
    }
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', 'https://www.gigexecs.com/about')

    const ogImage = document.querySelector('meta[property="og:image"]')
    if (!ogImage) {
      const ogImageEl = document.createElement('meta')
      ogImageEl.setAttribute('property', 'og:image')
      document.head.appendChild(ogImageEl)
    }
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', 'https://www.gigexecs.com/images/og-about.jpg')

    // Add Twitter meta tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]')
    if (!twitterCard) {
      const twitterCardEl = document.createElement('meta')
      twitterCardEl.setAttribute('name', 'twitter:card')
      document.head.appendChild(twitterCardEl)
    }
    document.querySelector('meta[name="twitter:card"]')?.setAttribute('content', 'summary_large_image')

    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (!twitterTitle) {
      const twitterTitleEl = document.createElement('meta')
      twitterTitleEl.setAttribute('name', 'twitter:title')
      document.head.appendChild(twitterTitleEl)
    }
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', 'About GigExecs | Senior Professionals & Fractional Executives Marketplace')

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (!twitterDescription) {
      const twitterDescriptionEl = document.createElement('meta')
      twitterDescriptionEl.setAttribute('name', 'twitter:description')
      document.head.appendChild(twitterDescriptionEl)
    }
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', 'GigExecs connects companies with senior professionals and executives for fractional, freelance, and project-based roles.')
  }, [])

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
              <a href="/marketing" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Blog</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-6 leading-tight">
              About{' '}
              <span className="bg-gradient-to-r from-[#0284C7] to-[#FACC15] bg-clip-text text-transparent">
                GigExecs
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[#9CA3AF] mb-8 max-w-3xl mx-auto leading-relaxed">
              Learn about our mission to revolutionize the gig economy by connecting senior professionals with innovative companies.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-[#9CA3AF] max-w-3xl mx-auto">
              We believe that experience and expertise should never be wasted. Our platform connects seasoned professionals with companies that value their knowledge, creating meaningful partnerships that drive innovation and growth.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
              The passionate individuals behind GigExecs, working to transform the future of work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                <img 
                  src="/images/AboutUs/nuno-selfie.png" 
                  alt="Nuno G. Rodrigues" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-2">Nuno G. Rodrigues</h3>
              <p className="text-[#9CA3AF] mb-4">Founder & CEO</p>
              <p className="text-sm text-[#6B7280] mb-4">
                Senior Executive, Entrepreneur and dealmaker leading GigExecs to reshape how companies and senior talent work together. Advised on $30B+ in transactions, delivered $2B+ in value creation.
              </p>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://www.linkedin.com/in/nuno-g-rodrigues-210a59/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#0284C7] hover:text-[#012E46] transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://x.com/NunoG_Rodrigues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#0284C7] hover:text-[#012E46] transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                <img 
                  src="/images/AboutUs/jaco-selfie.png" 
                  alt="Jaco van den Heever" 
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-2">Jaco van den Heever</h3>
              <p className="text-[#9CA3AF] mb-4">Co-Founder & CXO</p>
              <p className="text-sm text-[#6B7280] mb-4">
                Award-winning product and design leader with 20+ years of experience shaping digital platforms across fintech, healthcare, and enterprise domains. He drives the platform vision, user experience, and technology implementation, building GigExecs into a category-defining company.
              </p>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://www.linkedin.com/in/jacovdh/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#0284C7] hover:text-[#012E46] transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://x.com/jacovdh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#0284C7] hover:text-[#012E46] transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why GigExecs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
              Why GigExecs?
            </h2>
            <p className="text-lg text-[#9CA3AF] max-w-4xl mx-auto leading-relaxed">
              Traditional hiring is slow, costly, and rigid. GigExecs offers companies flexible access to senior executives, advisors, and specialists — on a fractional, freelance, or project basis. Our vetted community brings decades of leadership experience across industries, giving organizations immediate expertise without long-term overheads.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#0284C7] mb-4">
              Shaping the Future of Work
            </h3>
            <p className="text-lg text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
              As businesses face tighter budgets and talent shortages, fractional and project-based work has become a critical strategy. GigExecs is at the forefront of this shift, building a platform where experience meets opportunity, helping both professionals and companies thrive.
            </p>
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
                <li><a href="/help" className="hover:text-white transition-colors">Help</a></li>
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

export default AboutUs