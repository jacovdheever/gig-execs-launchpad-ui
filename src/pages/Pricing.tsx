import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Globe2,
  Layers,
  Shield,
  Sparkles,
  Briefcase,
  Unlock,
  Users,
  Target,
} from 'lucide-react'
import { PageMeta } from '@/components/PageMeta'
import { JsonLd } from '@/components/JsonLd'
import { PricingPlansGrid } from '@/components/pricing/PricingPlansGrid'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'
import type { FaqItem } from '@/lib/schema'

const META_DESCRIPTION =
  'Choose a GigExecs subscription plan to access curated fractional, contract, interim, and project-based opportunities for senior independent professionals.'

const OG_DESCRIPTION =
  'Subscribe to access curated gigs, fractional roles, contract opportunities, and interim leadership engagements for senior independent professionals.'

const TWITTER_DESCRIPTION =
  'Choose a subscription plan to unlock full access to internal and external gigs for senior professionals.'

const PRICING_FAQS: FaqItem[] = [
  {
    question: 'Do I need a subscription to browse gigs?',
    answer:
      'You can browse limited gig information without a subscription. A subscription is required to access external application links, unlock full opportunity access, and bid on internal gigs once vetted.',
  },
  {
    question: 'Can I try GigExecs before subscribing monthly?',
    answer:
      'Yes. The 7-Day Access Pass gives you full access for one week, making it a simple way to explore current opportunities before choosing a longer plan.',
  },
  {
    question: 'What is the best plan for active job searching?',
    answer:
      'Monthly Access is recommended for professionals actively exploring flexible work. It gives continuous access to new gigs and is better value than renewing weekly.',
  },
  {
    question: 'Why choose annual access?',
    answer:
      'Annual Access is the best value if you want always-on access to curated senior opportunities throughout the year.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes. You can turn off auto-renewal or cancel from your subscription settings. You will keep access until the end of your current paid period.',
  },
  {
    question: 'Do I need to be vetted to apply for gigs?',
    answer:
      'You can apply externally to external gigs with an active subscription. To bid on internal GigExecs gigs, your full professional profile must be reviewed and approved.',
  },
  {
    question: 'Do cancellations include refunds?',
    answer:
      'Cancelling stops future renewal. It does not automatically create a refund. Refund requests can be made by emailing help@gigexecs.com.',
  },
  {
    question: 'What happens when my subscription expires?',
    answer:
      'You can still browse limited gig information, but full access, external application links, and internal bidding will be paused until you renew.',
  },
]

const TRUST_ITEMS = [
  {
    icon: Layers,
    text: 'Curated opportunities, not generic job noise',
  },
  {
    icon: Briefcase,
    text: 'Built for senior professionals and independent consultants',
  },
  {
    icon: Globe2,
    text: 'Internal and external gigs in one place',
  },
  {
    icon: Shield,
    text: 'Cancel auto-renewal anytime',
  },
] as const

const UNLOCK_ITEMS = [
  {
    title: 'Full gig visibility',
    body:
      'See the full details behind each opportunity, including information hidden from non-subscribed users.',
  },
  {
    title: 'External opportunity access',
    body:
      'Access curated external gigs and follow application links directly from GigExecs — ideal for contract roles and interim leadership paths.',
  },
  {
    title: 'Internal gig bidding',
    body:
      'Once your profile is approved, submit bids on internal GigExecs opportunities, including fractional work and part-time executive-style engagements.',
  },
  {
    title: 'Curated senior opportunities',
    body:
      'Focus on flexible engagements designed for experienced professionals — not generic job board noise.',
  },
  {
    title: 'Profile-led matching',
    body:
      'Build a stronger profile so GigExecs can better match you with relevant independent consultant opportunities.',
  },
  {
    title: 'Community and insight access',
    body:
      'Stay close to a growing network of professionals and companies exploring flexible work for experienced professionals.',
  },
]

const COMPARISON_ROWS: { feature: string; pass: string; monthly: string; annual: string }[] = [
  { feature: 'Full gig details', pass: 'Yes', monthly: 'Yes', annual: 'Yes' },
  { feature: 'External apply links', pass: 'Yes', monthly: 'Yes', annual: 'Yes' },
  {
    feature: 'Internal gig bidding',
    pass: 'Yes, once vetted',
    monthly: 'Yes, once vetted',
    annual: 'Yes, once vetted',
  },
  { feature: 'Access to new curated gigs', pass: 'Yes', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Auto-renewal', pass: 'Yes', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Turn off renewal anytime', pass: 'Yes', monthly: 'Yes', annual: 'Yes' },
  {
    feature: 'Best for',
    pass: 'Trying GigExecs',
    monthly: 'Active opportunity search',
    annual: 'Always-on access',
  },
]

function Pricing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const scrollToPlans = () => {
    document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="Pricing"
        exactDocumentTitle="Pricing | GigExecs Professional Access Plans"
        description={META_DESCRIPTION}
        ogTitle="GigExecs Pricing | Access Senior Flexible Work Opportunities"
        ogDescription={OG_DESCRIPTION}
        twitterDescription={TWITTER_DESCRIPTION}
        path="/pricing"
      />
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]),
          faqSchema(PRICING_FAQS),
        ]}
      />

      {/* Navigation — matches Professionals / Marketing */}
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

            <div className="hidden lg:flex items-center gap-10 xl:gap-12 flex-wrap justify-center">
              <a href="/" className="text-[#1F2937] hover:text-[#0284C7] transition-colors whitespace-nowrap">
                What is GigExecs
              </a>
              <a href="/clients" className="text-[#1F2937] hover:text-[#0284C7] transition-colors whitespace-nowrap">
                Clients
              </a>
              <a href="/professionals" className="text-[#1F2937] hover:text-[#0284C7] transition-colors whitespace-nowrap">
                Professionals
              </a>
              <a href="/pricing" className="text-[#0284C7] font-semibold whitespace-nowrap">
                Pricing
              </a>
              <a href="/blog" className="text-[#1F2937] hover:text-[#0284C7] transition-colors whitespace-nowrap">
                Blog
              </a>
            </div>

            <div className="flex items-center shrink-0">
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
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#1F2937] hover:text-[#0284C7] transition-colors p-2"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
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
              isMobileMenuOpen ? 'max-h-[340px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-2 pt-2 pb-4 space-y-1 bg-white border-t border-[#F5F5F5]">
              <a
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors"
              >
                What is GigExecs
              </a>
              <a
                href="/clients"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors"
              >
                Clients
              </a>
              <a
                href="/professionals"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors"
              >
                Professionals
              </a>
              <a
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#0284C7] font-semibold"
              >
                Pricing
              </a>
              <a
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors"
              >
                Blog
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 lg:pt-24 lg:pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold tracking-wide text-[#0284C7] uppercase mb-4">
              GigExecs Professional Access
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#012E46] mb-6 leading-tight">
              Choose the access plan that fits how you work
            </h1>
            <p className="text-lg sm:text-xl text-[#6B7280] mb-4 max-w-3xl mx-auto leading-relaxed">
              Unlock full access to curated fractional, contract, interim, and project-based opportunities for senior
              independent professionals — structured{' '}
              <span className="text-[#1F2937] font-medium">senior professional opportunities</span> without job-board
              noise.
            </p>
            <p className="text-base text-[#9CA3AF] mb-10 max-w-2xl mx-auto">
              Start with a 7-day access pass, stay active with monthly access, or save with annual membership. GigExecs
              pricing is designed so every plan unlocks the same professional subscription benefits — you choose duration,
              not features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <Button
                size="lg"
                className="bg-[#012E46] hover:bg-[#0284C7] text-white px-8 py-3 w-full sm:w-auto"
                onClick={scrollToPlans}
              >
                View plans
              </Button>
              <Button variant="outline" size="lg" className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] w-full sm:w-auto" asChild>
                <Link to="/how-it-works">How it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-[#F5F5F5] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex gap-3 items-start rounded-xl bg-white border border-slate-200/80 shadow-sm px-4 py-4"
              >
                <Icon className="w-5 h-5 text-[#CC9B0A] shrink-0 mt-0.5" aria-hidden />
                <p className="text-sm sm:text-[15px] text-[#1F2937] leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section id="pricing-plans" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#012E46] mb-4">Simple access to better flexible work</h2>
            <p className="text-lg text-[#6B7280]">
              Choose the plan that matches your current search. All plans unlock the same opportunity access — the only
              difference is how long you stay active.
            </p>
          </div>

          <PricingPlansGrid mode="marketing" />
        </div>
      </section>

      {/* Plan comparison — desktop table */}
      <section className="py-16 bg-[#F5F5F5] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#012E46] mb-4">All plans include the same access</h2>
            <p className="text-lg text-[#6B7280]">
              Choose based on how long you want access — not on feature restrictions.
            </p>
          </div>

          <div className="hidden md:block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-transparent hover:bg-transparent">
                  <TableHead className="bg-[#012E46] text-white font-semibold min-w-[180px] py-4">
                    Feature
                  </TableHead>
                  <TableHead className="bg-[#012E46] text-white font-semibold text-center py-4">
                    7-Day Access Pass
                  </TableHead>
                  <TableHead className="bg-[#CC9B0A] text-[#012E46] font-semibold text-center py-4 shadow-inner">
                    Monthly Access
                  </TableHead>
                  <TableHead className="bg-[#012E46] text-white font-semibold text-center py-4">
                    Annual Access
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON_ROWS.map((row) => (
                  <TableRow key={row.feature} className="border-slate-100">
                    <TableCell className="font-medium text-[#1F2937]">{row.feature}</TableCell>
                    <TableCell className="text-center text-[#4B5563]">{row.pass}</TableCell>
                    <TableCell className="text-center text-[#1F2937] bg-[#CC9B0A]/12">{row.monthly}</TableCell>
                    <TableCell className="text-center text-[#4B5563]">{row.annual}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile stacked comparison */}
          <div className="md:hidden space-y-6">
            {[
              { label: 'Monthly Access', key: 'monthly' as const, emphasize: true },
              { label: '7-Day Access Pass', key: 'pass' as const, emphasize: false },
              { label: 'Annual Access', key: 'annual' as const, emphasize: false },
            ].map((col) => (
              <Card key={col.key} className={`rounded-2xl shadow-md overflow-hidden ${col.emphasize ? 'border-2 border-[#CC9B0A]' : ''}`}>
                <CardHeader className={`pb-2 ${col.emphasize ? 'bg-[#CC9B0A] py-4' : ''}`}>
                  <CardTitle className="text-lg font-semibold text-[#012E46]">
                    {col.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {COMPARISON_ROWS.map((row) => (
                    <div
                      key={row.feature}
                      className="flex justify-between gap-4 border-b border-slate-100 last:border-0 pb-3 last:pb-0"
                    >
                      <span className="text-sm text-[#6B7280] shrink-0 max-w-[48%]">{row.feature}</span>
                      <span className="text-sm font-medium text-[#1F2937] text-right">
                        {row[col.key]}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What you unlock */}
      <section id="what-you-unlock" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#012E46] text-center mb-14">
            What your subscription unlocks
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {UNLOCK_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-[#FAFAFA] p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3 mb-3">
                  <Unlock className="w-6 h-6 text-[#CC9B0A] shrink-0" aria-hidden />
                  <h3 className="text-lg font-semibold text-[#012E46]">{item.title}</h3>
                </div>
                <p className="text-[#6B7280] leading-relaxed text-sm sm:text-base">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objections */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#012E46] text-center mb-12">
            Built for professionals who value their time
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Why paid access?',
                body:
                  'GigExecs invests in sourcing, curating, and organizing flexible opportunities for experienced professionals. The subscription helps us focus on quality instead of volume.',
                icon: Target,
              },
              {
                title: 'Can I cancel?',
                body:
                  'Yes. You can turn off auto-renewal in your settings. Cancelling stops future renewal, and you keep access until the end of your paid period.',
                icon: Users,
              },
              {
                title: 'Do I need vetting?',
                body:
                  'You can subscribe once your basic profile is complete. To bid on internal GigExecs gigs, your full profile must be reviewed and approved.',
                icon: Shield,
              },
            ].map(({ title, body, icon: Icon }) => (
              <Card key={title} className="rounded-2xl border-slate-200 shadow-md bg-white">
                <CardHeader>
                  <div className="w-11 h-11 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-[#0284C7]" aria-hidden />
                  </div>
                  <CardTitle className="text-lg text-[#012E46]">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#012E46] text-center mb-12">FAQs</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {PRICING_FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`} className="border rounded-xl bg-gray-50 px-4 sm:px-6 border-slate-200">
                <AccordionTrigger className="hover:no-underline text-left font-semibold text-[#1F2937]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#6B7280] pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 pb-16 bg-[#012E46] border-b-4 border-[#CC9B0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-10 h-10 text-[#CC9B0A] mx-auto mb-6" aria-hidden />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to access better flexible opportunities?
          </h2>
          <p className="text-lg text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join GigExecs and unlock curated gigs designed for senior independent professionals, consultants, and
            fractional leaders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#CC9B0A] hover:bg-[#B88A09] text-white font-semibold w-full sm:w-auto px-8"
              onClick={scrollToPlans}
            >
              Choose your plan
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 w-full sm:w-auto px-8 bg-transparent"
              asChild
            >
              <Link to="/auth/register">Create your profile</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#012E46] text-white pt-10 pb-12 border-t border-white/10">
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
                <li>
                  <a href="/pricing" className="hover:text-white transition-colors">
                    Pricing
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

export default Pricing
