import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BlogCard from '@/components/BlogCard'

export default function BlogArticle1() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // SEO Metadata
  useEffect(() => {
    // Update document title
    document.title = "Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth | GigExecs"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', "There's no one-size-fits-all work model. Learn how remote, hybrid, and in-office work impact career growth, AI trends, and the future of flexible work.")
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = "There's no one-size-fits-all work model. Learn how remote, hybrid, and in-office work impact career growth, AI trends, and the future of flexible work."
      document.head.appendChild(newMetaDescription)
    }

    // Add meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', "Remote vs hybrid vs in-office work, Best work model for career growth, Does remote work hurt promotions, Hybrid work and job opportunities, AI impact on remote jobs, Future of work flexibility, Freelancing vs full-time employment, How to succeed in a hybrid work environment, Career growth in remote jobs, Choosing the right work model")
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = "Remote vs hybrid vs in-office work, Best work model for career growth, Does remote work hurt promotions, Hybrid work and job opportunities, AI impact on remote jobs, Future of work flexibility, Freelancing vs full-time employment, How to succeed in a hybrid work environment, Career growth in remote jobs, Choosing the right work model"
      document.head.appendChild(newMetaKeywords)
    }

    // Add Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', "Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth")
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.content = "Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth"
      document.head.appendChild(newOgTitle)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', "There's no one-size-fits-all work model. Learn how remote, hybrid, and in-office work impact career growth, AI trends, and the future of flexible work.")
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.content = "There's no one-size-fits-all work model. Learn how remote, hybrid, and in-office work impact career growth, AI trends, and the future of flexible work."
      document.head.appendChild(newOgDescription)
    }

    const ogType = document.querySelector('meta[property="og:type"]')
    if (ogType) {
      ogType.setAttribute('content', "article")
    } else {
      const newOgType = document.createElement('meta')
      newOgType.setAttribute('property', 'og:type')
      newOgType.content = "article"
      document.head.appendChild(newOgType)
    }

    // Add Twitter Card tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]')
    if (twitterCard) {
      twitterCard.setAttribute('content', "summary_large_image")
    } else {
      const newTwitterCard = document.createElement('meta')
      newTwitterCard.name = 'twitter:card'
      newTwitterCard.content = "summary_large_image"
      document.head.appendChild(newTwitterCard)
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', "Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth")
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = "Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth"
      document.head.appendChild(newTwitterTitle)
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', "There's no one-size-fits-all work model. Learn how remote, hybrid, and in-office work impact career growth, AI trends, and the future of flexible work.")
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = "There's no one-size-fits-all work model. Learn how remote, hybrid, and in-office work impact career growth, AI trends, and the future of flexible work."
      document.head.appendChild(newTwitterDescription)
    }

    // Add canonical URL
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', "https://www.gigexecs.com/blog/remote-hybrid-in-office")
    } else {
      const newCanonical = document.createElement('link')
      newCanonical.rel = 'canonical'
      newCanonical.href = "https://www.gigexecs.com/blog/remote-hybrid-in-office"
      document.head.appendChild(newCanonical)
    }

    // Add structured data for article
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth",
      "description": "There's no one-size-fits-all work model. Learn how remote, hybrid, and in-office work impact career growth, AI trends, and the future of flexible work.",
      "image": "https://www.gigexecs.com/images/remote-hybrid-office-work-model.jpg",
      "author": {
        "@type": "Person",
        "name": "Nuno G. Rodrigues"
      },
      "publisher": {
        "@type": "Organization",
        "name": "GigExecs",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.gigexecs.com/images/logo.png"
        }
      },
      "datePublished": "2024-03-25",
      "dateModified": "2024-12-19",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.gigexecs.com/blog/remote-hybrid-in-office"
      }
    }

    // Remove existing structured data if any
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)
  }, [])

  return (
    <div className="min-h-screen bg-white">
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
              <a href="/" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" className="text-[#0284C7] font-semibold">Blog</a>
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
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors font-semibold">Blog</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <section className="py-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-[#6B7280] hover:text-[#0284C7] transition-colors">
                  Home
                </a>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-[#9CA3AF] mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <a href="/blog" className="text-[#6B7280] hover:text-[#0284C7] transition-colors">
                  Blog
                </a>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-[#9CA3AF] mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[#1F2937] font-medium">Remote, Hybrid, or In-Office? Choosing the Right Work Model for Your Career.</span>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Author & Date */}
          <div className="mb-8">
            <div className="text-lg font-semibold text-[#1F2937] mb-2">Nuno G. Rodrigues</div>
            <div className="text-[#6B7280]">March 25, 2024</div>
          </div>

          {/* Article Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-12 leading-tight">
            Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-6">
                No One-Size-Fits-All Work Model
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                There is no perfect work model that applies universally. The decision to work remotely, in a hybrid setting, or fully in-office depends on various factors such as industry, job type, career ambitions, and corporate culture. With 23 years of experience across global markets—including 15 years in-office and 7 years remote (occasionally hybrid)—I've seen firsthand how different work models impact career growth, productivity, and job satisfaction.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-6">
                Career Growth & Office Visibility – Does it Matter?
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                If you aspire to climb the corporate ladder and reach senior management or C-suite levels, being visible in the office can play a significant role in career advancement. While technical performance is crucial, soft skills and building trust with decision-makers are equally important. If you can effectively establish strong relationships without being in-person, that's excellent. However, in most industries outside of tech and startups, remote workers often face challenges compared to colleagues who have more face-to-face interactions with leadership.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-6">
                The Changing Workforce & New Generational Trends
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                The traditional career path—joining a company fresh out of university, working tirelessly in the office for 20–30 years, and reaching the top—has lost its appeal, particularly among younger generations. Corporate loyalty is also evolving. Companies invest in employee development, yet employees may later find better opportunities elsewhere. Similarly, long-term employees are not immune to layoffs when economic downturns hit. This shift has made professionals rethink their approach to job security and work-life balance.
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-6">
                The Future of Work: AI, Freelancing & Flexibility
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                The rapid advancement of artificial intelligence is transforming the workplace. AI is automating repetitive tasks, reducing the demand for certain roles while creating new opportunities that require specialized skills. A recent study highlights how AI is already reshaping industries, from finance to healthcare. To stay relevant, professionals must adapt and reskill. A hybrid setup where senior talent can assume strategic leadership, while remote specialists—such as accountants, consultants, and IT professionals—can contribute effectively from anywhere. The rise of freelancing, independent contracting, and fractional work allows businesses to tap into specialized talent without requiring full-time, in-office presence.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-6">
                Final Thoughts: How to Choose the Best Work Model
              </h2>
              
              {/* Advice Lists */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Advice for Employers */}
                <div className="bg-[#F5F5F5] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#1F2937] mb-4">Advice for Employers:</h3>
                  <ul className="space-y-2 text-[#6B7280]">
                    <li className="flex items-start">
                      <span className="text-[#0284C7] mr-2">•</span>
                      Embrace hybrid models where it makes sense.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0284C7] mr-2">•</span>
                      Focus on skills and expertise rather than location.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0284C7] mr-2">•</span>
                      Invest in technology to enable seamless collaboration between remote and in-office teams.
                    </li>
                  </ul>
                </div>

                {/* Advice for Employees */}
                <div className="bg-[#F5F5F5] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#1F2937] mb-4">Advice for Employees:</h3>
                  <ul className="space-y-2 text-[#6B7280]">
                    <li className="flex items-start">
                      <span className="text-[#0284C7] mr-2">•</span>
                      Consider your career goals and work-life balance when choosing a work model.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0284C7] mr-2">•</span>
                      Stay adaptable—early in your career, a hybrid or in-office presence may offer better networking opportunities.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0284C7] mr-2">•</span>
                      Keep an eye on industry trends, particularly the impact of AI on your field.
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA Link */}
              <div className="text-right">
                <a href="/auth/register" className="inline-flex items-center text-[#0284C7] hover:text-[#012E46] font-semibold text-lg transition-colors">
                  Join GigExecs Now →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] text-center mb-16">
            Related Articles
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Related Articles using Master Component - Randomized (excluding Blog1) */}
            <BlogCard blogNumber={3} />
            <BlogCard blogNumber={7} />
            <BlogCard blogNumber={9} />
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
