import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ShieldCheck, Rocket, Briefcase, Target } from 'lucide-react'
import { PageMeta } from '@/components/PageMeta'
import { JsonLd } from '@/components/JsonLd'
import { TrustBlocks } from '@/components/TrustBlocks'
import {
  breadcrumbSchema,
  serviceSchema,
  faqSchema,
} from '@/lib/schema'
import type { FaqItem } from '@/lib/schema'

// BlogCard component for the client page
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
    5: {
      image: '/images/blog/Blog5.png',
      alt: 'Finding Purpose in the Second Half of Life',
      title:
        'Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals',
      description:
        'Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…',
      author: 'GigExecs Insider',
      date: 'July 15, 2024',
      link: '/blog/finding-purpose-second-half-life',
    },
    6: {
      image: '/images/blog/Blog6.png',
      alt: 'Building the Future of Flexible Work',
      title: 'Building the Future of Flexible Work for Senior Professionals',
      description:
        "This article updates readers on GigExecs' progress since launching its Beta version, showcasing a growing network of senior professionals from diverse industries globally. GigExecs' mission is to provide flexible work opportunities, offering solutions to the challenges posed by longer careers and ageism.",
      author: 'GigExecs Insider',
      date: 'September 13, 2024',
      link: '/blog/building-future-flexible-work',
    },
  }

  const blog = blogData[blogNumber]

  if (!blog) {
    return null
  }

  return (
    <Card className="bg-white hover:shadow-lg transition-shadow duration-300 p-0">
      <div className="h-48 rounded-t-lg overflow-hidden">
        <img
          src={blog.image}
          alt={blog.alt}
          className="w-full h-full object-cover"
        />
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

const CLIENT_FAQS: FaqItem[] = [
  {
    question: 'What is an engagement on GigExecs?',
    answer:
      'An engagement is any flexible work arrangement—advisory, interim leadership, fractional roles, fixed-term contracts, or project-based work.',
  },
  {
    question: 'Are GigExecs professionals employees?',
    answer:
      'No. Professionals in the GigExecs network operate independently and engage with organizations on flexible terms.',
  },
  {
    question: 'How does vetting work?',
    answer:
      'Vetting includes credential checks, experience review, and references where applicable.',
  },
  {
    question: 'Is GigExecs a recruitment agency?',
    answer:
      'No. GigExecs is a premium network and platform for flexible engagements—not a recruitment agency.',
  },
  {
    question: 'How quickly can we connect with senior expertise?',
    answer:
      'Once your engagement scope is defined, we activate the relevant part of our network so you can begin conversations quickly.',
  },
  {
    question: 'What types of roles can we engage?',
    answer:
      'Common engagements include advisory work, interim leadership, fractional roles, fixed-term contracts, and project-based consulting.',
  },
]

const Clients = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF]">
      <PageMeta
        title="Hire Vetted Independent Consultants & Senior Professionals"
        description="Access a premium network for advisory, interim leadership, fractional roles, contracts, and project engagements—structured, credible, and fast."
        path="/clients"
      />
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Clients', path: '/clients' },
          ]),
          serviceSchema({
            name: 'Hire Vetted Independent Consultants & Senior Professionals',
            description:
              'GigExecs provides structured access to a premium network of vetted independent consultants and senior professionals for advisory, interim, fractional, contract, and project engagements.',
            url: '/clients',
            provider: 'GigExecs',
          }),
          faqSchema(CLIENT_FAQS),
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
              <a href="/clients" className="text-[#0284C7] font-semibold">
                Clients
              </a>
              <a href="/professionals" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">
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
              <a href="/clients" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#0284C7] font-semibold">
                Clients
              </a>
              <a href="/professionals" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">
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
              Hire Vetted Independent Consultants & Senior Professionals
            </h1>
            <p className="text-lg sm:text-xl text-[#9CA3AF] mb-8 max-w-3xl mx-auto leading-relaxed">
              Get structured access to senior expertise for advisory, interim leadership, fractional roles, contracts, and project engagements—without marketplace noise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#012E46] hover:bg-[#0284C7] text-white px-8 py-3">
                <a href="/auth/register" className="w-full h-full flex items-center justify-center text-white">
                  Get started
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] px-8 py-3"
                onClick={() =>
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                How it works
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#FACC15] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#FACC15] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-[#FACC15] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* CTA Section with Split Layout */}
      <section id="cta-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="rounded-3xl h-96 overflow-hidden">
                <img
                  src="/images/client/client.png"
                  alt="Professional working on a laptop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0284C7] leading-tight">
                Engage senior expertise from our vetted network
              </h2>
              <p className="text-lg text-[#9CA3AF] leading-relaxed">
                Share your engagement scope and requirements. We notify the most relevant independent consultants and senior professionals in our premium community—so you can connect with proven expertise aligned to your needs.
              </p>
              <Button size="lg" className="bg-[#012E46] hover:bg-[#0284C7] text-white px-8 py-3">
                <a href="/auth/register" className="w-full h-full flex items-center justify-center text-white">
                  Publish an engagement
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Cards Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Join a Community of Successful Businesses and Professionals
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard blogNumber={5} />
            <BlogCard blogNumber={6} />
            <BlogCard blogNumber={1} />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-[#F5F5F5] to-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] text-center mb-16">
            How it works: Hire senior expertise in four steps
          </h2>

          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Register & verify your organization',
                  description:
                    'Create an account and verify your organization details to maintain a trusted network.',
                },
                {
                  step: '2',
                  title: 'Define your engagement need',
                  description:
                    'Advisory support, interim leadership, fractional roles, fixed-term contracts, or project engagements.',
                },
                {
                  step: '3',
                  title: 'Targeted network activation',
                  description:
                    'We notify the most relevant members of our vetted community based on your needs.',
                },
                {
                  step: '4',
                  title: 'Connect & formalize',
                  description:
                    'Engage directly under clear scope, timelines, and expectations—built for outcomes.',
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

      {/* Why Choose GigExecs Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose GigExecs?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-[#FACC15]" />
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-3">
                Premium network, not a marketplace
              </h3>
              <p className="text-gray-700">
                Built for credibility and senior expertise—not bidding wars.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Rocket className="w-12 h-12 text-[#FACC15]" />
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-3">
                Vetted profiles and quality standards
              </h3>
              <p className="text-gray-700">
                Clear signals of experience, outcomes, and professionalism.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-[#FACC15]" />
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-3">
                Flexible engagement models
              </h3>
              <p className="text-gray-700">
                Advisory • Interim • Fractional • Contract • Project-based
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Target className="w-12 h-12 text-[#FACC15]" />
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-3">
                Faster access to experience
              </h3>
              <p className="text-gray-700">
                Move quickly without long full-time hiring cycles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] text-center mb-12">
            FAQs
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {CLIENT_FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border rounded-lg bg-white px-6"
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

      {/* Footer CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#012E46] to-[#0284C7] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Need help structuring an engagement?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Tell us what you need and we'll help you frame the scope and connect with the right senior expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#FACC15] hover:bg-[#EAB308] text-[#012E46] px-8 py-3 text-lg font-semibold">
                <a href="/auth/register" className="w-full h-full flex items-center justify-center text-[#012E46]">
                  Get started
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white bg-white text-[#012E46] hover:bg-white/90 px-8 py-3 text-lg font-semibold"
              >
                <a
                  href="mailto:help@gigexecs.com?subject=Client%20enquiry%3A%20Need%20help%20structuring%20an%20engagement"
                  className="w-full h-full flex items-center justify-center text-[#012E46]"
                >
                  Email us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TrustBlocks - Clients variant */}
      <section className="py-12 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBlocks variant="clients" />
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

export default Clients
