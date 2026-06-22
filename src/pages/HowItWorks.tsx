import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageMeta } from '@/components/PageMeta'
import { MarketingNav } from '@/components/MarketingNav'
import { MarketingFooter } from '@/components/MarketingFooter'
import { JsonLd } from '@/components/JsonLd'
import { TrustBlocks } from '@/components/TrustBlocks'
import { breadcrumbSchema } from '@/lib/schema'
import {
  FileText,
  ShieldCheck,
  Briefcase,
  Users,
  Target,
  CheckCircle,
} from 'lucide-react'

function HowItWorks() {
  const stepCardClass = "rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
  const iconWrapperClass = "w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center shrink-0"

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF]">
      <PageMeta
        title="How a Vetted Network Works"
        description="Learn how GigExecs connects a premium community of vetted independent consultants and senior professionals with flexible engagements—advisory, interim, fractional, contract, and project-based."
        path="/how-it-works"
      />
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "How it works", path: "/how-it-works" },
          ]),
        ]}
      />

      {/* Navigation */}
      <MarketingNav />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#012E46] to-[#0284C7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            How it Works
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover how GigExecs connects a premium community of vetted independent consultants and senior professionals with high-quality flexible work worldwide—advisory, interim leadership, fractional roles, contracts, and project engagements.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#for-professionals"
              className="inline-flex items-center px-5 py-2.5 rounded-lg border border-white/60 text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0284C7]"
            >
              For Senior Professionals
            </a>
            <a
              href="#for-clients"
              className="inline-flex items-center px-5 py-2.5 rounded-lg border border-white/60 text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0284C7]"
            >
              For Clients & Partners
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* For Senior Professionals Section (FIRST) */}
            <div className="mb-16">
              <h2 id="for-professionals" className="text-3xl font-bold text-[#012E46] mb-8 scroll-mt-24">For Senior Professionals</h2>

              <div className="space-y-6">
                <Card className={`${stepCardClass} border-l-4 border-l-[#FACC15]`}>
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className={iconWrapperClass}>
                      <FileText className="w-6 h-6 text-[#FACC15]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-[#012E46]">1. Create a credible profile (AI-assisted)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">
                      Upload your CV or chat with our AI to build an outcome-focused profile in minutes.
                    </p>
                  </CardContent>
                </Card>

                <Card className={`${stepCardClass} border-l-4 border-l-[#FACC15]`}>
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className={iconWrapperClass}>
                      <ShieldCheck className="w-6 h-6 text-[#FACC15]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-[#012E46]">2. Get vetted for quality</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">
                      Our team reviews experience and credentials, with references where applicable.
                    </p>
                  </CardContent>
                </Card>

                <Card className={`${stepCardClass} border-l-4 border-l-[#FACC15]`}>
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className={iconWrapperClass}>
                      <Briefcase className="w-6 h-6 text-[#FACC15]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-[#012E46]">3. Access high-quality engagements</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">
                      Browse and apply for opportunities aligned with your expertise and preferences—advisory, interim leadership, fractional roles, contracts, and projects.
                    </p>
                  </CardContent>
                </Card>

                <p className="text-gray-700 text-base font-bold mt-4 pl-4 border-l-2 border-[#FACC15]/50">
                  Engage the GigExecs Community: Share resources, tools, and insights with peers.
                </p>
              </div>
            </div>

            {/* For Clients & Partners Section (SECOND) */}
            <div className="mb-16">
              <h2 id="for-clients" className="text-3xl font-bold text-[#012E46] mb-8 scroll-mt-24">For Clients & Partners</h2>

              <div className="space-y-6">
                <Card className={`${stepCardClass} border-l-4 border-l-[#0284C7]`}>
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className={iconWrapperClass}>
                      <Target className="w-6 h-6 text-[#0284C7]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-[#012E46]">1. Define your need</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">
                      Advisory support, interim leadership, fractional roles, fixed-term contracts, or project engagements.
                    </p>
                  </CardContent>
                </Card>

                <Card className={`${stepCardClass} border-l-4 border-l-[#0284C7]`}>
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className={iconWrapperClass}>
                      <Users className="w-6 h-6 text-[#0284C7]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-[#012E46]">2. Reach our vetted network</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">
                      Publish an engagement to our premium community or request curated introductions.
                    </p>
                  </CardContent>
                </Card>

                <Card className={`${stepCardClass} border-l-4 border-l-[#0284C7]`}>
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className={iconWrapperClass}>
                      <CheckCircle className="w-6 h-6 text-[#0284C7]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-[#012E46]">3. Engage with confidence</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">
                      Work directly with senior professionals under clear expectations and a quality-first standard.
                    </p>
                  </CardContent>
                </Card>

                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-600 mb-3">Who uses GigExecs</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Startups & scale-ups",
                      "SMEs",
                      "Nonprofits & NGOs",
                      "PE/VC-backed teams",
                      "Consulting & advisory firms",
                      "Executive search & talent partners",
                      "Corporate transformation teams",
                      "Academia & research programs",
                    ].map((chip) => (
                      <span
                        key={chip}
                        className="inline-flex px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
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
                    <h3 className="font-semibold text-[#012E46] mb-2">Premium network, not a marketplace</h3>
                    <p className="text-gray-700">Built for credibility and senior expertise—not bidding wars.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#0284C7] rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#012E46] mb-2">Vetted profiles and quality standards</h3>
                    <p className="text-gray-700">Clear signals of experience, outcomes, and professionalism.</p>
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
                    <p className="text-gray-700">Advisory • Interim • Fractional • Contract • Project-based</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#0284C7] rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#012E46] mb-2">Faster access to experience</h3>
                    <p className="text-gray-700">Move quickly without long full-time hiring cycles.</p>
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
                  <p className="mb-4">Publish an engagement or request introductions.</p>
                  <Button asChild className="bg-white text-[#012E46] hover:bg-gray-100">
                    <a href="/clients">Create an Engagement</a>
                  </Button>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Professionals</h3>
                  <p className="mb-4">Create a profile and apply to join the network.</p>
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

      {/* TrustBlocks - above footer */}
      <section aria-label="Vetting and quality standards" className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBlocks variant="howItWorks" />
        </div>
      </section>

      {/* Footer */}
      <MarketingFooter />
    </div>
  )
}

export default HowItWorks
