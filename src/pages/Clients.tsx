import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ShieldCheck, Rocket, Briefcase, Target, User, Building2, Medal, Check } from 'lucide-react'
import { PageMeta } from '@/components/PageMeta'
import { MarketingNav } from '@/components/MarketingNav'
import { MarketingFooter } from '@/components/MarketingFooter'
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
    question: 'Who can organizations access through GigExecs?',
    answer:
      'GigExecs helps organizations connect with vetted senior professionals and independent consultants with experience across advisory, consulting, fractional, interim, and project-based work.',
  },
  {
    question: 'Is GigExecs a marketplace?',
    answer:
      'No. GigExecs is a curated network of experienced professionals, not a bidding marketplace or freelancer platform. We focus on expertise, credibility, and professional relationships.',
  },
  {
    question: 'How are GigExecs professionals vetted?',
    answer:
      'GigExecs membership is built around experience, credibility, and professional reputation. Applications may include a review of professional background, career experience, LinkedIn profile, areas of expertise, and references where applicable.',
  },
  {
    question: 'Is GigExecs a recruitment company?',
    answer:
      'No. GigExecs is a curated network, not a recruitment company or executive search firm. We help organizations access trusted expertise through flexible and modern engagement models.',
  },
  {
    question: 'How quickly can we connect with senior expertise?',
    answer:
      'Timeframes depend on the nature of the requirement and the expertise needed. Once an organization has registered and completed verification, relevant opportunities can be shared with professionals from the network.',
  },
  {
    question: 'What types of roles and engagements are available?',
    answer:
      'GigExecs focuses on advisory, consulting, fractional, interim, contract, and project-based engagements. Full-time opportunities may also be supported where appropriate, but the primary focus is flexible access to trusted expertise.',
  },
  {
    question: 'Why do organizations use GigExecs?',
    answer:
      'Organizations use GigExecs to access experienced professionals whose expertise has been earned through real-world leadership, specialist knowledge, and professional achievement.',
  },
]

const Clients = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF]">
      <PageMeta
        title="Access Senior Expertise for Fractional & Advisory Work"
        description="Connect with vetted senior professionals and independent consultants for advisory, consulting, fractional, interim, and project-based engagements."
        path="/clients"
      />
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Clients', path: '/clients' },
          ]),
          serviceSchema({
            name: 'Access Senior Expertise for Fractional & Advisory Work',
            description:
              'GigExecs helps organizations connect with vetted senior professionals and independent consultants for advisory, consulting, fractional, interim, and project-based engagements.',
            url: '/clients',
            provider: 'GigExecs',
          }),
          faqSchema(CLIENT_FAQS),
        ]}
      />

      {/* Navigation */}
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-6 leading-tight">
              Access Senior Expertise. On Demand.
            </h1>
            <p className="text-lg sm:text-xl text-[#9CA3AF] mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with vetted senior professionals and independent consultants for advisory, consulting, fractional, interim, and project-based engagements.
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#6B7280] mb-6">
              Global Network | Vetted Professionals | Trusted Expertise
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#012E46] hover:bg-[#0284C7] text-white px-8 py-3"
                onClick={() =>
                  document.getElementById('structure-engagement')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Tell Us What You Need
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] px-8 py-3"
                onClick={() =>
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                How It Works
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

      {/* Why Experience Matters More Than Ever */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">
              Why Experience Matters More Than Ever
            </h2>
            <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
              The way organizations access expertise is changing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Proven Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  When the stakes are high, experience matters. Leadership, judgment, and specialist expertise can make the difference.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Flexible Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  Advisory, consulting, fractional, interim, and project-based engagements give organizations flexible ways to access senior expertise beyond traditional full-time employment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-[#FACC15]" />
                </div>
                <CardTitle className="text-xl text-[#0284C7]">Trusted Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#9CA3AF]">
                  GigExecs provides access to a curated network of vetted senior professionals and independent consultants built around experience, credibility, and professional reputation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Cards Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Insights for Modern Engagement Models
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
                  title: 'Register & Verify',
                  description:
                    'Create an account and complete a simple verification process to help maintain a trusted network.',
                },
                {
                  step: '2',
                  title: 'Share Your Requirements',
                  description:
                    'Tell us what expertise you need, or publish an opportunity for relevant professionals in the network.',
                },
                {
                  step: '3',
                  title: 'Access Relevant Expertise',
                  description:
                    'Your requirement is shared with relevant professionals from our vetted network.',
                },
                {
                  step: '4',
                  title: 'Connect & Engage',
                  description:
                    'Connect directly, agree scope and terms, and move forward with confidence.',
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

          <div className="mt-10 bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <ShieldCheck className="w-10 h-10 text-[#FACC15] mx-auto mb-4" strokeWidth={1.75} />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-3">Verified for quality</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Both professionals and organizations are subject to verification and quality standards designed to support a trusted professional network.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  icon: User,
                  title: 'Verified professionals',
                  description: 'Identity and background verified',
                },
                {
                  icon: Building2,
                  title: 'Verified organizations',
                  description: 'Legitimacy and credentials checked',
                },
                {
                  icon: Medal,
                  title: 'Quality standards',
                  description: 'Ongoing monitoring and review',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full border border-[#E5E7EB] bg-[#FAFAFA] flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[#9CA3AF]" strokeWidth={1.75} />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#FACC15] rounded-full flex items-center justify-center border-2 border-white">
                      <Check className="w-3 h-3 text-[#012E46]" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="pt-1 text-left">
                    <p className="font-semibold text-[#1F2937] mb-1">{item.title}</p>
                    <p className="text-sm text-[#9CA3AF] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose GigExecs Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-4">
              Built on Trust. Defined by Experience.
            </h2>
            <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
              GigExecs is designed to help organizations access trusted senior expertise through flexible, modern engagement models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Vetted Professionals',
                body:
                  'Experienced senior professionals and independent consultants with proven expertise, leadership experience, and established professional reputations.',
              },
              {
                icon: Rocket,
                title: 'Verified Organizations',
                body:
                  'Organizations are subject to verification and quality standards to help maintain the integrity of the network.',
              },
              {
                icon: Briefcase,
                title: 'Flexible Engagement Models',
                body:
                  'Advisory, consulting, fractional, interim, and project-based expertise when and where it is needed.',
              },
              {
                icon: Target,
                title: 'Community First. Quality Always.',
                body:
                  'A trusted network built around credibility, relationships, and professional standards — not a job board, recruitment firm, or bidding marketplace.',
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
                  <CardDescription className="text-[#6B7280]">{card.body}</CardDescription>
                </CardContent>
              </Card>
            ))}
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
      <section id="structure-engagement" className="py-20 bg-gradient-to-r from-[#012E46] to-[#0284C7] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Need help structuring an engagement?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Tell us what you need and we’ll help you frame the scope, identify the right expertise, and connect with trusted senior professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#FACC15] hover:bg-[#EAB308] text-[#012E46] px-8 py-3 text-lg font-semibold">
                <a href="/auth/register" className="w-full h-full flex items-center justify-center text-[#012E46]">
                  Register & Create A New Gig
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white bg-white text-[#012E46] hover:bg-white/90 px-8 py-3 text-lg font-semibold"
              >
                <a
                  href="mailto:help@gigexecs.com?subject=GigExecs%20Client%20Engagement%20Enquiry"
                  className="w-full h-full flex items-center justify-center text-[#012E46]"
                >
                  Email Us
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
      <MarketingFooter />
    </div>
  )
}

export default Clients
