import { MarketingNav } from '@/components/MarketingNav'
import { MarketingFooter } from '@/components/MarketingFooter'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BlogCard from '@/components/BlogCard'

export default function BlogArticle2() {
  // SEO Metadata
  useEffect(() => {
    // Update document title
    document.title = "GigExecs: A Freelance Platform for Experienced Executives & Consultants | GigExecs"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', "Discover GigExecs, a platform designed for seasoned executives, consultants, and specialists seeking flexible, high-value opportunities. Redefining the gig economy for top professionals.")
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = "Discover GigExecs, a platform designed for seasoned executives, consultants, and specialists seeking flexible, high-value opportunities. Redefining the gig economy for top professionals."
      document.head.appendChild(newMetaDescription)
    }

    // Add meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', "GigExecs, Executive freelancing, Fractional executives, Consulting gigs, High-value freelance work, Flexible work for executives, Experienced professionals gig economy, Remote executive jobs, Freelance consulting opportunities, Alternative to traditional employment")
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = "GigExecs, Executive freelancing, Fractional executives, Consulting gigs, High-value freelance work, Flexible work for executives, Experienced professionals gig economy, Remote executive jobs, Freelance consulting opportunities, Alternative to traditional employment"
      document.head.appendChild(newMetaKeywords)
    }

    // Add Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', "GigExecs: A Freelance Platform for Experienced Executives & Consultants")
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.content = "GigExecs: A Freelance Platform for Experienced Executives & Consultants"
      document.head.appendChild(newOgTitle)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', "Discover GigExecs, a platform designed for seasoned executives, consultants, and specialists seeking flexible, high-value opportunities. Redefining the gig economy for top professionals.")
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.content = "Discover GigExecs, a platform designed for seasoned executives, consultants, and specialists seeking flexible, high-value opportunities. Redefining the gig economy for top professionals."
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
      twitterTitle.setAttribute('content', "GigExecs: A Freelance Platform for Experienced Executives & Consultants")
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = "GigExecs: A Freelance Platform for Experienced Executives & Consultants"
      document.head.appendChild(newTwitterTitle)
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', "Discover GigExecs, a platform designed for seasoned executives, consultants, and specialists seeking flexible, high-value opportunities. Redefining the gig economy for top professionals.")
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = "Discover GigExecs, a platform designed for seasoned executives, consultants, and specialists seeking flexible, high-value opportunities. Redefining the gig economy for top professionals."
      document.head.appendChild(newTwitterDescription)
    }

    // Add canonical URL
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', "https://www.gigexecs.com/blog/corporate-leadership-executive-freelancing")
    } else {
      const newCanonical = document.createElement('link')
      newCanonical.rel = 'canonical'
      newCanonical.href = "https://www.gigexecs.com/blog/corporate-leadership-executive-freelancing"
      document.head.appendChild(newCanonical)
    }

    // Add structured data for article
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "GigExecs: A Freelance Platform for Experienced Executives & Consultants",
      "description": "Discover GigExecs, a platform designed for seasoned executives, consultants, and specialists seeking flexible, high-value opportunities. Redefining the gig economy for top professionals.",
      "image": "https://www.gigexecs.com/images/executive-freelance-platform.jpg",
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
      "datePublished": "2024-05-06",
      "dateModified": "2024-12-19",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.gigexecs.com/blog/corporate-leadership-executive-freelancing"
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
      <MarketingNav />

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
                <span className="text-[#1F2937] font-medium">The Birth of GigExecs: A Personal Journey</span>
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
            <div className="text-[#6B7280]">May 6, 2024</div>
          </div>

          {/* Article Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-12 leading-tight">
            From Corporate Leadership to Executive Freelancing: The Story Behind GigExecs
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
                The Journey Begins
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                After 23 years in corporate leadership across global markets, I found myself at a crossroads. The traditional path of climbing the corporate ladder had brought success, but something was missing. The rigid structures, the endless meetings, and the disconnect between personal values and corporate objectives were taking their toll. It was time for a change.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-6">
                The Problem I Experienced
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                As a senior executive, I witnessed firsthand the challenges that experienced professionals face in today's job market. Age discrimination, limited flexibility, and the constant pressure to conform to corporate culture were pushing talented individuals out of the workforce prematurely. Meanwhile, companies were struggling to find the right expertise for specific projects without committing to full-time hires.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-6">
                The Vision for GigExecs
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                GigExecs was born from a simple yet powerful vision: to create a platform where experienced executives, consultants, and specialists could find meaningful, high-value work opportunities that matched their expertise and lifestyle preferences. We wanted to redefine the gig economy, moving beyond low-skilled, low-pay work to focus on the value that seasoned professionals bring to the table.
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-6">
                What Makes GigExecs Different
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                Unlike traditional freelance platforms, GigExecs is designed specifically for senior professionals. We understand the unique challenges and opportunities that come with experience. Our platform focuses on quality over quantity, ensuring that both professionals and companies find the right match for their specific needs. We provide the tools, support, and community that experienced professionals need to thrive in the gig economy.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-6">
                The Future of Work
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                The future of work is flexible, project-based, and value-driven. Companies need access to specialized expertise without the overhead of full-time employment. Professionals want the freedom to choose their projects, set their rates, and maintain a healthy work-life balance. GigExecs bridges this gap, creating a win-win scenario for both sides of the equation.
              </p>
            </div>

            {/* CTA Section */}
            <div className="mb-12">
              <div className="bg-[#F5F5F5] p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-[#1F2937] mb-4">Ready to Join the Future of Work?</h3>
                <p className="text-lg text-[#6B7280] mb-6">
                  Whether you're an experienced professional looking for flexible opportunities or a company seeking specialized expertise, GigExecs is here to help you succeed.
                </p>
                <a href="/auth/register" className="inline-flex items-center text-[#0284C7] hover:text-[#012E46] font-semibold text-lg transition-colors">
                  Get Started Today →
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
            {/* Related Articles using Master Component - Randomized (excluding Blog2) */}
            <BlogCard blogNumber={1} />
            <BlogCard blogNumber={5} />
            <BlogCard blogNumber={8} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <MarketingFooter />
    </div>
  )
}
