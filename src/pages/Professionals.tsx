import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ShieldCheck, Award, Globe, Sparkles, FileCheck, Briefcase, Target } from 'lucide-react'
import { PageMeta } from '@/components/PageMeta'
import { JsonLd } from '@/components/JsonLd'
import { TrustBlocks } from '@/components/TrustBlocks'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'
import type { FaqItem } from '@/lib/schema'

// BlogCard component for the professionals page
const BlogCard = ({ blogNumber }: { blogNumber: number }) => {
  const blogData: Record<
    number,
    {
      image: string
      alt: string
      title: string
      description: string
      author: string
      date: string
      link: string
    }
  > = {
    1: {
      image: '/images/blog/Blog1.png',
      alt: 'Remote, Hybrid, or In-Office work models',
      title:
        'Remote, Hybrid, or In-Office? Choosing the Right Work Model for Your Career.',
      description:
        'Is remote work the future, or is hybrid the best balance? Discover insights from 23 years of global experience on how work models impact career growth, flexibility, and the evolving job market. Read on to make the right choice for your career!',
      author: 'Nuno G. Rodrigues',
      date: 'March 15, 2024',
      link: '/blog/remote-hybrid-in-office',
    },
    2: {
      image: '/images/blog/Blog2.png',
      alt: 'Corporate Leadership and Executive Freelancing',
      title:
        'From Corporate Leadership to Executive Freelancing: A Strategic Career Transition',
      description:
        'Explore how senior executives are transitioning from traditional corporate roles to independent consulting. Learn about the opportunities, challenges, and strategies for success in the executive freelance market.',
      author: 'GigExecs Insider',
      date: 'April 20, 2024',
      link: '/blog/corporate-leadership-executive-freelancing',
    },
    3: {
      image: '/images/blog/Blog3.png',
      alt: 'AI Revolution and Senior Professionals',
      title: 'The AI Revolution: How Senior Professionals Can Thrive in an Automated World',
      description:
        'Discover how experienced professionals can leverage AI tools and technologies to enhance their consulting services, stay competitive, and create new opportunities in the evolving digital landscape.',
      author: 'GigExecs Insider',
      date: 'May 25, 2024',
      link: '/blog/ai-revolution-senior-professionals',
    },
  }

  const blog = blogData[blogNumber]

  if (!blog) {
    return null
  }

  return (
    <Card className="bg-white hover:shadow-lg transition-shadow duration-300 p-0">
      <div className="h-48 rounded-t-lg overflow-hidden">
        <img src={blog.image} alt={blog.alt} className="w-full h-full object-cover" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl leading-tight">
          <a href={blog.link} className="hover:text-[#0284C7] transition-colors">
            {blog.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-[#9CA3AF] leading-relaxed">
          {blog.description}
        </CardDescription>
        <div className="text-sm text-[#6B7280]">
          {blog.author} | {blog.date}
        </div>
        <a
          href={blog.link}
          className="inline-flex items-center text-[#0284C7] hover:text-[#012E46] font-medium transition-colors ml-auto"
        >
          Read More →
        </a>
      </CardContent>
    </Card>
  )
}

const PROFESSIONAL_FAQS: FaqItem[] = [
  {
    question: 'Who is GigExecs for?',
    answer:
      'GigExecs is for highly experienced professionals and independent consultants looking for meaningful flexible engagements with organizations that value senior expertise.',
  },
  {
    question: 'How does the AI profile builder work?',
    answer:
      'You can upload your CV or chat with our AI to generate a strong, outcome-focused profile quickly.',
  },
  {
    question: 'How does vetting work?',
    answer:
      'Vetting includes credential checks, experience review, and references where applicable.',
  },
  {
    question: 'What types of engagements are available?',
    answer:
      'Common engagements include advisory work, interim leadership, fractional roles, fixed-term contracts, and project-based work.',
  },
  {
    question: 'Is this a bidding marketplace?',
    answer:
      'No. GigExecs is a premium network focused on credibility and quality standards—not bidding wars.',
  },
  {
    question: 'How do I get notified about opportunities?',
    answer:
      'Once your profile and preferences are set, you can browse opportunities and receive notifications when relevant engagements are posted.',
  },
]

const Professionals = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="Join a Premium Network for Senior Professionals"
        description="Create an AI-assisted profile, get vetted, and access high-quality flexible engagements worldwide—advisory, interim leadership, fractional roles, contracts, and project work."
        path="/professionals"
      />
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Professionals', path: '/professionals' },
          ]),
          faqSchema(PROFESSIONAL_FAQS),
        ]}
      />

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a
                href="/"
                className="text-2xl font-extrabold text-slate-900 hover:text-[#0284C7] transition-colors cursor-pointer"
              >
                GigExecs
              </a>
            </div>

            <div className="hidden lg:flex items-center space-x-12">
              <a href="/" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">
                What is GigExecs
              </a>
              <a href="/clients" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">
                Clients
              </a>
              <a href="/professionals" className="text-[#0284C7] font-semibold">
                Professionals
              </a>
              <a href="/blog" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">
                Blog
              </a>
            </div>

            <div className="flex items-center">
              <Button
                variant="outline"
                className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] rounded-r-none border-r-0"
              >
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

          <div
            className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#F5F5F5]">
              <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">
                What is GigExecs
              </a>
              <a href="/clients" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">
                Clients
              </a>
              <a href="/professionals" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#0284C7] font-semibold">
                Professionals
              </a>
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">
                Blog
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-6 leading-tight">
              Join a Premium Network for Senior Independent Professionals
            </h1>
            <p className="text-lg sm:text-xl text-[#9CA3AF] mb-8 max-w-3xl mx-auto leading-relaxed">
              Build a credible profile, get vetted, and access high-quality flexible engagements—advisory, interim leadership, fractional roles, contracts, and project work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#012E46] hover:bg-[#0284C7] text-white px-8 py-3">
                <a href="/auth/register" className="w-full h-full flex items-center justify-center text-white">
                  Join GigExecs
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] px-8 py-3"
                asChild
              >
                <a href="/how-it-works#for-professionals">How it works</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose GigExecs Section */}
      <section id="features-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
              Why Choose GigExecs?
            </h2>
            <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
              A credibility-first network for experienced professionals seeking meaningful flexible engagements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Vetted Premium Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  A credibility-first network for highly experienced professionals (typically 15+ years).
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">High-Quality Opportunities, Updated Daily</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  We publish and circulate flexible engagements daily—focused on roles where experience and outcomes matter.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Flexible Work Models</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  Advisory • Interim leadership • Fractional roles • Contract • Project-based work.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How joining works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] text-center mb-16">
            How joining works
          </h2>

          <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  icon: Sparkles,
                  title: 'Create your profile (AI-assisted)',
                  description:
                    'Upload your CV or chat with our AI to generate a strong, outcome-focused profile in minutes.',
                },
                {
                  step: '2',
                  icon: FileCheck,
                  title: 'Vetting & quality review',
                  description:
                    'Experience and credentials are reviewed, with references where applicable.',
                },
                {
                  step: '3',
                  icon: Target,
                  title: 'Set your preferences',
                  description:
                    'Choose engagement types, industries, availability, and remote/on-site preferences.',
                },
                {
                  step: '4',
                  icon: Briefcase,
                  title: 'Access and apply',
                  description:
                    'Browse and apply to relevant engagements—or get notified when matches appear.',
                },
              ].map((item, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-[#FACC15] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-[#012E46] font-bold text-xl">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1F2937]">{item.title}</h3>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why GigExecs exists Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] text-center mb-8">
            Why GigExecs exists
          </h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto text-center mb-12">
            Senior expertise is in demand, but most platforms are built for commodity work or traditional hiring. GigExecs bridges the gap with a premium network and flexible engagement models.
          </p>
          <ul className="max-w-2xl mx-auto space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-[#0284C7] mt-1">•</span>
              <span className="text-[#1F2937]">
                Experience is often undervalued in modern hiring cycles and noisy platforms.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0284C7] mt-1">•</span>
              <span className="text-[#1F2937]">
                Senior professionals want flexibility and meaningful work in the longevity economy.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0284C7] mt-1">•</span>
              <span className="text-[#1F2937]">
                Organizations need proven expertise fast—without full-time complexity.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0284C7] mt-1">•</span>
              <span className="text-[#1F2937]">
                GigExecs supports credibility-first profiles, vetting, and high-quality flexible engagements.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Blog Cards Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Join a Community of Successful Professionals and Businesses
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard blogNumber={1} />
            <BlogCard blogNumber={2} />
            <BlogCard blogNumber={3} />
          </div>
        </div>
      </section>

      {/* Two-path internal link strip */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Link
              to="/clients"
              className="group block rounded-lg border border-border/50 bg-muted/30 px-6 py-5 transition-colors hover:bg-muted/50 hover:border-[#0284C7]/40 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">Hiring senior expertise?</p>
              <p className="text-base text-[#1F2937] mb-3 leading-snug">
                Access vetted independent consultants for advisory, interim leadership, fractional roles, and project engagements.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-[#0284C7] group-hover:underline">
                Explore our offering for Clients
              </span>
            </Link>
            <Link
              to="/how-it-works"
              className="group block rounded-lg border border-border/50 bg-muted/30 px-6 py-5 transition-colors hover:bg-muted/50 hover:border-[#0284C7]/40 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">Want to understand the model?</p>
              <p className="text-base text-[#1F2937] mb-3 leading-snug">
                See how vetting, matching, and flexible engagements work on GigExecs.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-[#0284C7] group-hover:underline">
                How it works →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] text-center mb-12">
            FAQs
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {PROFESSIONAL_FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border rounded-lg bg-gray-50 px-6"
              >
                <AccordionTrigger className="hover:no-underline text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#6B7280]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* TrustBlocks - Professionals variant */}
      <section className="py-12 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBlocks variant="professionals" />
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
                <li>
                  <a href="/how-it-works" className="hover:text-white transition-colors">
                    How it works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li>
                  <a href="/help" className="hover:text-white transition-colors">
                    Help
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li>
                  <a href="/terms-and-conditions" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/data-privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
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

export default Professionals
