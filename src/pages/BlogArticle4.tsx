import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BlogCard from '@/components/BlogCard'

export default function BlogArticle4() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // SEO Metadata
  useEffect(() => {
    document.title = "The Big Anomaly of the Job Market: Older Talent | GigExecs"
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', "The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a solution, offering flexible, high-quality opportunities for experienced individuals to stay active and financially stable without the stress of traditional job hunting.")
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = "The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a solution, offering flexible, high-quality opportunities for experienced individuals to stay active and financially stable without the stress of traditional job hunting."
      document.head.appendChild(newMetaDescription)
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', "Older professionals job market, Age discrimination in hiring, Senior talent opportunities, Gig economy for experienced workers, Job security for older workers, Flexible work for seniors, Career opportunities 50+, Ageism in employment, Mature professionals job search, Alternative employment for seniors")
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = "Older professionals job market, Age discrimination in hiring, Senior talent opportunities, Gig economy for experienced workers, Job security for older workers, Flexible work for seniors, Career opportunities 50+, Ageism in employment, Mature professionals job search, Alternative employment for seniors"
      document.head.appendChild(newMetaKeywords)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', "The Big Anomaly of the Job Market: Older Talent")
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.content = "The Big Anomaly of the Job Market: Older Talent"
      document.head.appendChild(newOgTitle)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', "The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a solution, offering flexible, high-quality opportunities for experienced individuals to stay active and financially stable without the stress of traditional job hunting.")
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.content = "The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a solution, offering flexible, high-quality opportunities for experienced individuals to stay active and financially stable without the stress of traditional job hunting."
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
      twitterTitle.setAttribute('content', "The Big Anomaly of the Job Market: Older Talent")
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = "The Big Anomaly of the Job Market: Older Talent"
      document.head.appendChild(newTwitterTitle)
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', "The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a solution, offering flexible, high-quality opportunities for experienced individuals to stay active and financially stable without the stress of traditional job hunting.")
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = "The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a solution, offering flexible, high-quality opportunities for experienced individuals to stay active and financially stable without the stress of traditional job hunting."
      document.head.appendChild(newTwitterDescription)
    }

    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', "https://www.gigexecs.com/blog/job-market-anomaly-older-talent")
    } else {
      const newCanonical = document.createElement('link')
      newCanonical.rel = 'canonical'
      newCanonical.href = "https://www.gigexecs.com/blog/job-market-anomaly-older-talent"
      document.head.appendChild(newCanonical)
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "The Big Anomaly of the Job Market: Older Talent",
      "description": "The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a solution, offering flexible, high-quality opportunities for experienced individuals to stay active and financially stable without the stress of traditional job hunting.",
      "image": "https://www.gigexecs.com/images/job-market-anomaly-older-talent.jpg",
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
      "datePublished": "2024-06-10",
      "dateModified": "2024-12-19",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.gigexecs.com/blog/job-market-anomaly-older-talent"
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
              <a href="/" className="text-2xl font-extrabold text-slate-900 hover:text-[#0284C7] transition-colors cursor-pointer">
                GigExecs
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
                <span className="text-[#1F2937] font-medium">The Big Anomaly of the Job Market: Older Talent</span>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="text-lg font-semibold text-[#1F2937] mb-2">Nuno G. Rodrigues</div>
            <div className="text-[#6B7280]">June 10, 2024</div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-12 leading-tight">
            The Big Anomaly of the Job Market: Older Talent
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                If you ask a professional in their 40s, 50s, or 60s what keeps them up at night, and maybe aside from health concerns, chances are the fear of losing their job will be top on their list.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                And it's not just about the money. It's about the domino effect: the strain on family, the social pressure, and the blow to self-confidence. Not many people talk about it openly, but for many of us, the idea of finding a new well-paid job as we get older feels like a big mountain to climb. It's not impossible, but it takes time and effort.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                On top of that, the job market has a funny way of working. You're more likely to land a new role when you're already employed than when you're actively searching without a job. Take the "open to work" badge on LinkedIn, for example—I'm sure it was created with good intentions, but it's often perceived as a sign of desperation. How crazy is that? It's a reflection of how flawed and inefficient the hiring process can be at certain career levels.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                So, what can you do as the clock ticks and the years go by? Now, here's where things get interesting…
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                This problem is finally starting to get some attention. With people living longer, healthier lives, the need to stay professionally and financially active later in life isn't just a wish—it's a necessity! Businesses are realising the importance of rethinking how they balance younger talent with experienced professionals. In the UK, for example, the British government has adopted "returnships" to bring people over 50 back into the workforce, and global leaders like Goldman Sachs, IBM, and Amazon are implementing similar initiatives.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                The gig economy is emerging as a powerful solution for older professionals. Instead of competing for traditional full-time roles, experienced individuals can leverage their expertise through project-based work, consulting, and flexible arrangements. This approach allows them to maintain their professional identity, stay financially active, and contribute meaningfully without the stress of traditional job hunting.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                <strong>Final Thoughts:</strong> The job market anomaly of older talent is real, but it's not insurmountable. By embracing flexible work models, leveraging experience, and staying adaptable, older professionals can not only survive but thrive in today's economy. The key is to see change as an opportunity rather than a threat.
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
            <BlogCard blogNumber={5} />
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
