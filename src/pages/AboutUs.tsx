import React from 'react'
import { Button } from '@/components/ui/button'
import { Linkedin, Twitter } from 'lucide-react'
import { PageMeta } from '@/components/PageMeta'
import { MarketingNav } from '@/components/MarketingNav'
import { MarketingFooter } from '@/components/MarketingFooter'
import { JsonLd } from '@/components/JsonLd'
import { TrustBlocks } from '@/components/TrustBlocks'
import { breadcrumbSchema } from '@/lib/schema'

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="About GigExecs | Premium Network of Vetted Independent Consultants"
        description="Learn why GigExecs was created: a premium community connecting vetted independent consultants and senior professionals with high-quality flexible engagements worldwide."
        path="/about"
      />
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      {/* Navigation */}
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[320px] flex items-center">
        {/* Background image - cropped to fit */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/AboutUs/thisisengineering-TXxiFuQLBKQ-unsplash.jpg"
            alt=""
            className="w-full h-full object-cover object-[85%_top] md:object-[85%_30%]"
            aria-hidden
          />
          {/* Gradient overlay - light enough to show image, dark enough for text */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#012E46]/55 via-[#012E46]/45 to-[#012E46]/65"
            aria-hidden
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            About{' '}
            <span className="text-white">
              GigExecs
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/95 mb-4 max-w-3xl mx-auto leading-relaxed">
            A premium network and vetted community connecting independent consultants and senior professionals with high-quality flexible engagements worldwide.
          </p>
          <p className="text-lg sm:text-xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed">
            Built for credibility, outcomes, and flexible work—without the noise of marketplaces.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed">
              To empower experienced professionals to build independent careers on their own terms—while helping organizations access senior expertise through flexible engagement models.
              <span className="block mt-4">GigExecs is more than a platform: it&apos;s a trusted community where experience meets opportunity, beyond the constraints of full-time employment.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Why we built GigExecs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-8">
              Why we built GigExecs
            </h2>
            <div className="max-w-3xl mx-auto space-y-6 text-left">
              <p className="text-lg text-[#6B7280] leading-relaxed">
                We built GigExecs after seeing a growing gap in the market: senior expertise is in demand, but most platforms are designed for commodity freelance work or traditional hiring.
              </p>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                Experienced professionals want meaningful, flexible engagements—and organizations want faster access to proven capability without full-time complexity.
              </p>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                GigExecs brings this together through a premium network with quality standards, credible profiles, and flexible work models—advisory, interim leadership, fractional roles, contracts, and project engagements—all in one place.
              </p>
            </div>
            <div className="max-w-4xl mx-auto mt-12">
              <blockquote className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-[#FACC15] rounded-full" aria-hidden />
                <p className="pl-6 sm:pl-8 text-xl sm:text-2xl lg:text-3xl font-semibold text-[#012E46] leading-snug tracking-tight">
                  The future of work is flexible, and the longevity economy is reshaping careers—GigExecs helps professionals stay professionally and financially active for longer.
                </p>
              </blockquote>
            </div>
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
                  src="/images/AboutUs/nuno-selfie.jpeg" 
                  alt="Nuno G. Rodrigues" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-2">Nuno G. Rodrigues</h3>
              <p className="text-[#9CA3AF] mb-4">Founder</p>
              <p className="text-sm text-[#6B7280] mb-4">
                Senior executive and entrepreneur with a global career spanning multiple countries. Married with 4 kids. Passionate about building businesses that help experienced professionals thrive in flexible work.
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
                  src="/images/AboutUs/jaco-selfie.jpg" 
                  alt="Jaco van den Heever" 
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-2">Jaco van den Heever</h3>
              <p className="text-[#9CA3AF] mb-4">Co-Founder & CXO</p>
              <p className="text-sm text-[#6B7280] mb-4">
                Product and design leader with experience building digital platforms across fintech, healthcare, and enterprise. Father of 4 and husband. Driven by human-centered design and a strong commitment to community upliftment.
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
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-6">
              Why GigExecs?
            </h2>
            <p className="text-lg text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed mb-12">
              GigExecs exists to make senior independent work credible, accessible, and global. We&apos;re built for experienced professionals and organizations who value outcomes—not volume.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-[#0284C7] rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#012E46] mb-2">Premium network, not a marketplace</h3>
                <p className="text-gray-700">Credibility-first profiles and quality standards (not bidding wars).</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-[#0284C7] rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#012E46] mb-2">Flexible engagement models</h3>
                <p className="text-gray-700">Advisory • Interim • Fractional • Contract • Project-based.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-[#0284C7] rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#012E46] mb-2">Senior expertise, faster</h3>
                <p className="text-gray-700">Access proven capability without lengthy full-time hiring cycles.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-[#0284C7] rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#012E46] mb-2">Community-driven trust</h3>
                <p className="text-gray-700">A network where professionalism and standards matter.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TrustBlocks */}
      <section aria-label="Trust and standards" className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBlocks variant="about" />
        </div>
      </section>

      {/* Footer */}
      <MarketingFooter />
    </div>
  )
}

export default AboutUs