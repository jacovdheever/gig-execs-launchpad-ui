import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ShieldCheck, Award, Globe, Sparkles, FileCheck, Briefcase } from 'lucide-react'
import { PageMeta } from '@/components/PageMeta'
import { MarketingNav } from '@/components/MarketingNav'
import { MarketingFooter } from '@/components/MarketingFooter'
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
    question: 'Who joins GigExecs?',
    answer:
      'GigExecs is designed for experienced professionals navigating a changing world of work. Members bring deep expertise, professional credibility, and a desire to remain active, relevant, and connected through meaningful opportunities and professional relationships.',
  },
  {
    question: 'Is GigExecs a job board or freelance marketplace?',
    answer:
      'No. GigExecs is a curated network of experienced professionals, not a job board, recruitment company, or bidding marketplace. We focus on expertise, credibility, and trusted professional relationships.',
  },
  {
    question: 'How does membership work?',
    answer:
      'Professionals create a profile, complete a review process, and become part of a trusted network built around experience, professional reputation, and meaningful engagement opportunities.',
  },
  {
    question: 'How does the profile creation process work?',
    answer:
      'Professionals can build a profile that showcases their experience, expertise, and professional achievements. Where available, AI-assisted tools can help turn a CV or guided profile input into a clearer professional profile.',
  },
  {
    question: 'What opportunities are available through GigExecs?',
    answer:
      'GigExecs focuses on advisory, consulting, fractional, interim, and project-based engagements. Broader professional opportunities may also be supported where experience and expertise are valued.',
  },
  {
    question: 'What else does GigExecs offer beyond opportunities?',
    answer:
      'GigExecs provides access to a trusted professional network, industry insights, practical resources, and conversations focused on the future of work, longevity, career transitions, and modern ways of working.',
  },
  {
    question: 'Do I need to be actively looking for work to join?',
    answer:
      'No. GigExecs is also useful for experienced professionals who want to stay visible, build relationships, access insights, and explore future opportunities over time.',
  },
]

const Professionals = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="Join a Network for Experienced Professionals"
        description="Build your profile and access advisory, consulting, fractional, interim, and project-based opportunities through a trusted professional network."
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
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-6 leading-tight">
              Become Part of a Trusted Network of Experienced Professionals
            </h1>
            <p className="text-lg sm:text-xl text-[#9CA3AF] mb-8 max-w-3xl mx-auto leading-relaxed">
              Stay visible, relevant, and connected in a changing world of work. Build your profile, access advisory, consulting, fractional, interim, and project-based opportunities, and join a network designed for modern senior careers.
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
                <a href="#how-joining-works">How It Works</a>
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
              Why Professionals Join GigExecs
            </h2>
            <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
              GigExecs helps experienced professionals stay visible, connected, and relevant in a changing world of work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Award,
                title: 'Experience',
                body:
                  'Your experience remains valuable. Build a profile that reflects the depth of your expertise, leadership, and professional achievements.',
              },
              {
                icon: Globe,
                title: 'Connections',
                body:
                  'Join a trusted network of experienced professionals, organizations, talent partners, and industry leaders.',
              },
              {
                icon: Briefcase,
                title: 'Opportunities',
                body:
                  'Access advisory, consulting, fractional, interim, and project-based opportunities where experience matters.',
              },
              {
                icon: ShieldCheck,
                title: 'Insights & Resources',
                body:
                  'Stay informed through thought leadership, practical resources, and conversations shaping the future of work.',
              },
            ].map((card) => (
              <Card key={card.title} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <card.icon className="w-8 h-8 text-[#FACC15]" />
                  </div>
                  <CardTitle className="text-xl text-[#0284C7]">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[#9CA3AF]">{card.body}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How joining works Section */}
      <section id="how-joining-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] text-center mb-16">
            Becoming Part of Our Network
          </h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto text-center mb-12">
            A simple process designed to maintain quality, credibility, and trust.
          </p>

          <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  icon: FileCheck,
                  title: 'Apply',
                  description:
                    'Share your professional background, experience, and areas of expertise.',
                },
                {
                  step: '2',
                  icon: ShieldCheck,
                  title: 'Review',
                  description:
                    'Applications are reviewed to help maintain the quality and integrity of the network.',
                },
                {
                  step: '3',
                  icon: Sparkles,
                  title: 'Build Your Presence',
                  description:
                    'Create a profile that showcases your experience, expertise, and professional achievements. Where available, use AI-assisted tools to help build your profile faster.',
                },
                {
                  step: '4',
                  icon: Briefcase,
                  title: 'Participate',
                  description:
                    'Access opportunities, insights, resources, and connections within the GigExecs network.',
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
            Why More Professionals Are Choosing Flexible Careers
          </h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto text-center mb-12">
            The future of work is creating new opportunities for experienced senior professionals to remain active, relevant, and impactful for longer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Longer Careers',
                body: 'People are living longer, working longer, and rethinking traditional career paths.',
              },
              {
                title: 'New Ways of Working',
                body: 'Advisory, consulting, fractional, interim, and project-based work are becoming established alternatives to full-time employment.',
              },
              {
                title: 'Experience Matters',
                body: 'Organizations continue to value leadership, judgment, and specialist expertise when the stakes are high.',
              },
              {
                title: 'Stay Connected',
                body: 'Professional networks, visibility, and trusted relationships matter more than ever in a changing world of work.',
              },
            ].map((card) => (
              <Card key={card.title} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-[#012E46]">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#6B7280] leading-relaxed">{card.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Cards Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Stay Informed. Stay Relevant.
          </h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto text-center mb-12">
            Insights, trends, and conversations shaping the future of work for experienced professionals.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard blogNumber={1} />
            <BlogCard blogNumber={2} />
            <BlogCard blogNumber={3} />
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5]">
              <a href="/blog">View all insights</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Membership Built Around Four Pillars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">
              Membership Built Around Four Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Opportunities', body: 'Meaningful ways to continue contributing.' },
              { title: 'Network', body: 'Trusted relationships with experienced professionals and organizations.' },
              { title: 'Insights', body: 'Perspectives shaping the future of work.', href: '/blog' },
              { title: 'Resources', body: 'Practical tools and guidance for modern careers as the network evolves.' },
            ].map((pillar) => (
              <Card key={pillar.title} className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-[#012E46]">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-[#6B7280] leading-relaxed">{pillar.body}</p>
                  {pillar.href ? (
                    <a href={pillar.href} className="inline-flex items-center text-sm font-semibold text-[#0284C7] hover:underline">
                      Explore insights →
                    </a>
                  ) : null}
                </CardContent>
              </Card>
            ))}
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
      <MarketingFooter />
    </div>
  )
}

export default Professionals
