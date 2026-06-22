import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, CalendarDays, Globe2, ShieldCheck } from 'lucide-react'
import { PageMeta } from '@/components/PageMeta'
import { MarketingNav } from '@/components/MarketingNav'
import { MarketingFooter } from '@/components/MarketingFooter'
import { JsonLd } from '@/components/JsonLd'
import { TrustBlocks } from '@/components/TrustBlocks'
import {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
} from '@/lib/schema'

function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF]">
      <PageMeta
        title="Senior Expertise for Fractional & Advisory Work"
        description="A premium network of experienced professionals and independent consultants for advisory, consulting, fractional, interim and project-based opportunities."
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
      <MarketingNav />

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
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] gap-8 items-center min-h-[60vh]">
              {/* Left side - empty to show video background */}
              <div className="hidden lg:block"></div>
              
              {/* Right side - content */}
              <div className="text-center lg:text-left lg:max-w-4xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl animate-fade-in-up">
                  GigExecs: A Premium Network of Independent Senior Professionals
                </h1>
                <p className="text-lg sm:text-xl text-white/95 mb-8 max-w-4xl mx-auto lg:mx-0 leading-relaxed drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
                    asChild
                  >
                    <a href="/how-it-works">How it Works</a>
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
              A premium network built around experience, expertise and meaningful professional opportunities beyond traditional employment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Built Around Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  A trusted network for accomplished senior professionals and independent consultants who want to keep contributing, growing, and creating value.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Modern Ways of Working</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  Advisory, consulting, fractional, interim, contract, and project-based engagements for how experienced professionals work today.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe2 className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">A Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  Members bring deep industry, functional, and geographic expertise across a trusted international community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Community First. Quality Always.</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  Built on credibility, trust, and shared standards — not recruitment, job-board listings, or bidding wars.
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
                Access experienced professionals for advisory, consulting, fractional, interim, and project-based engagements.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-[#0284C7] group-hover:underline">
                Explore Find Expertise →
              </span>
            </Link>
            <Link
              to="/professionals"
              className="group block rounded-lg border border-border/50 bg-muted/30 px-6 py-5 transition-colors hover:bg-muted/50 hover:border-[#0284C7]/40 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">Are you an experienced professional?</p>
              <p className="text-base text-[#1F2937] mb-3 leading-snug">
                Join a trusted network built around credibility, relevance, and meaningful flexible work.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-[#0284C7] group-hover:underline">
                Become an Expert →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Experience Matters More Than Ever */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-12 text-center">
            Why Experience Matters More Than Ever
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-[#0284C7]/15 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <p className="text-xs font-semibold tracking-wide text-[#0284C7] uppercase mb-2">For Organizations</p>
                <CardTitle className="text-2xl text-[#012E46]">Access Experience Faster</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-[#6B7280] leading-relaxed">
                  Organizations and talent partners increasingly rely on trusted networks of experienced professionals to access expertise, leadership, and specialist knowledge when it matters most.
                </p>
                <p className="text-base font-semibold text-[#012E46] border-l-4 border-[#FACC15] pl-4">
                  Trusted expertise when it matters most.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#0284C7]/15 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <p className="text-xs font-semibold tracking-wide text-[#0284C7] uppercase mb-2">For Professionals</p>
                <CardTitle className="text-2xl text-[#012E46]">Longer Careers. New Opportunities.</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-[#6B7280] leading-relaxed">
                  Longer careers, increasing longevity, and changing work models are creating new ways for experienced professionals to remain active, relevant, and impactful.
                </p>
                <p className="text-base font-semibold text-[#012E46] border-l-4 border-[#FACC15] pl-4">
                  Stay active, relevant, and impactful.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bridge statement - high-converting hero copy */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <blockquote className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-[#FACC15] rounded-full" aria-hidden />
            <p className="pl-6 sm:pl-8 text-xl sm:text-2xl lg:text-3xl font-semibold text-[#012E46] leading-snug tracking-tight">
              GigExecs is a trusted network for experienced professionals and organizations navigating advisory, consulting, fractional, interim, and project-based work.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Built Around Experience */}
      <section id="about" className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-6">
                Built Around Experience
              </h2>
              <p className="text-lg text-[#9CA3AF] mb-8 leading-relaxed">
                GigExecs helps experienced professionals stay visible, credible, and connected as the future of work continues to evolve.
              </p>
              <div className="space-y-5">
                <div>
                  <p className="font-semibold text-[#1F2937] mb-1">Credibility</p>
                  <p className="text-[#6B7280] leading-relaxed">Showcase your experience, expertise, and professional achievements through a profile built around impact.</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1F2937] mb-1">Connections</p>
                  <p className="text-[#6B7280] leading-relaxed">Become part of a trusted global network of experienced professionals, organizations, talent partners, and industry leaders.</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1F2937] mb-1">Opportunities</p>
                  <p className="text-[#6B7280] leading-relaxed">Access advisory, consulting, fractional, interim, and project-based opportunities where experience matters.</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1F2937] mb-1">Relevance</p>
                  <p className="text-[#6B7280] leading-relaxed">Stay visible, relevant, and connected as the future of work continues to evolve.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/AboutUs/homepage-lower-section.png"
                  alt="Experienced professionals collaborating in a modern work environment"
                  className="w-full h-auto object-cover"
                />
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
      <MarketingFooter />
    </div>
  )
}

export default Homepage
