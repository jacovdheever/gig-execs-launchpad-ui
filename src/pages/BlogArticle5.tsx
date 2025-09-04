import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BlogCard from '@/components/BlogCard'

export default function BlogArticle5() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    document.title = "Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals | GigExecs"
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…")
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…"
      document.head.appendChild(newMetaDescription)
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', "Finding purpose second half life, Gig economy senior professionals, Meaningful work after 50, Professional fulfillment, Senior career transition, Gig work benefits, Flexible work seniors, Career reinvention, Professional purpose, Senior professional opportunities")
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = "Finding purpose second half life, Gig economy senior professionals, Meaningful work after 50, Professional fulfillment, Senior career transition, Gig work benefits, Flexible work seniors, Career reinvention, Professional purpose, Senior professional opportunities"
      document.head.appendChild(newMetaKeywords)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', "Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals")
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.content = "Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals"
      document.head.appendChild(newOgTitle)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…")
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.content = "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…"
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
      twitterTitle.setAttribute('content', "Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals")
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = "Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals"
      document.head.appendChild(newTwitterTitle)
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…")
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…"
      document.head.appendChild(newTwitterDescription)
    }

    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', "https://www.gigexecs.com/blog/finding-purpose-second-half-life")
    } else {
      const newCanonical = document.createElement('link')
      newCanonical.rel = 'canonical'
      newCanonical.href = "https://www.gigexecs.com/blog/finding-purpose-second-half-life"
      document.head.appendChild(newCanonical)
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals",
      "description": "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…",
      "image": "https://www.gigexecs.com/images/finding-purpose-second-half-life.jpg",
      "author": {
        "@type": "Person",
        "name": "GigExecs Insider"
      },
      "publisher": {
        "@type": "Organization",
        "name": "GigExecs",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.gigexecs.com/images/logo.png"
        }
      },
      "datePublished": "2024-07-15",
      "dateModified": "2024-12-19",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.gigexecs.com/blog/finding-purpose-second-half-life"
      }
    }

    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }

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
            <div className="flex items-center">
              <a href="/" className="text-2xl text-[#012E46] hover:text-[#0284C7] transition-colors cursor-pointer">
                <span className="font-bold">Gig</span><span className="font-normal">Execs</span>
              </a>
            </div>

            <div className="hidden lg:flex items-center space-x-12">
              <a href="/" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" className="text-[#0284C7] font-semibold">Blog</a>
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
                <span className="text-[#1F2937] font-medium">Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals</span>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="text-lg font-semibold text-[#1F2937] mb-2">GigExecs Insider</div>
            <div className="text-[#6B7280]">July 15, 2024</div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-12 leading-tight">
            Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                As we navigate the second half of life, many professionals find themselves at a crossroads. The traditional career path may no longer provide the same fulfillment, and the desire to make a meaningful impact becomes more pronounced. The gig economy offers a unique opportunity for senior professionals to rediscover their purpose while maintaining financial stability and professional relevance.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                The gig economy allows experienced professionals to leverage their decades of knowledge and expertise in new and exciting ways. Instead of being constrained by traditional employment structures, they can choose projects that align with their values, interests, and desired work-life balance. This flexibility enables them to mentor younger professionals, consult on strategic initiatives, and engage in work that truly matters to them.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                One of the most rewarding aspects of gig work for senior professionals is the opportunity to share their wisdom and experience. Through consulting, mentoring, and project-based work, they can help shape the next generation of leaders while maintaining their own professional growth and development.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                <strong>Final Thoughts:</strong> The second half of life doesn't have to mean the end of professional fulfillment. The gig economy provides a pathway for senior professionals to find new purpose, share their expertise, and continue making meaningful contributions to their industries and communities.
              </p>
            </div>

            <div className="text-right">
              <a href="/auth/register" className="inline-flex items-center text-[#0284C7] hover:text-[#012E46] font-semibold text-lg transition-colors">
                Join GigExecs Now →
              </a>
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
            <BlogCard blogNumber={1} />
            <BlogCard blogNumber={4} />
            <BlogCard blogNumber={8} />
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
                <li><a href="/" className="hover:text-white transition-colors">How it works</a></li>
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
            <p>&copy; 2024 GigExecs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
