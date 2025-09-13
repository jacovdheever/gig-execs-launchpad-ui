import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, Search, BookOpen, Users, CreditCard, Target, FileText, Briefcase, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import BlogCard from '@/components/BlogCard'

export default function HelpSupportHome() {
  const [activeTab, setActiveTab] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Help content structure with grouped sections
  const helpContent = {
    'getting-started': {
      title: 'Getting Started',
      icon: BookOpen,
      content: 'Welcome to GigExecs! This section will help you get started with our platform.',
      faqs: [
        {
          question: 'What is GigExecs?',
          answer: 'GigExecs is a digital platform and a premium global network where companies and highly experienced senior professionals connect to work together using flexible work models - i.e. independent advisory, independent consulting, fractional roles, interim roles, freelancing, short-term contracts. We focus exclusively on talent with a minimum of 15 years\' experience, typically professionals from their late 30s into their 70s, giving businesses access to trusted skills, proven leadership, and established networks on-demand, that are otherwise difficult to reach. We believe flexible work models will enable senior professionals and companies to collaborate more easily without lengthy recruitment processes and high fees associated with full time employment.'
        },
        {
          question: 'Understanding Gigs',
          answer: 'We strongly believe that work today (as well as in the future) doesn\'t always require a full-time hire. GigExecs makes it easier for companies to access senior expertise in flexible ways - from short-term advisory and interim leadership, to part-time roles and specific mandates. We are industry agnostic, we believe our model can help companies and senior professionals across all industries and functions. More than focusing on specific industries our specific geographies, our focus is on connecting companies with trusted, highly experienced professionals who can adapt to different needs and deliver meaningful results, whatever the challenge.'
        },
        {
          question: 'Who are Clients?',
          answer: 'Clients on GigExecs are forward-thinking companies, organizations, and leaders who need access to highly experienced professionals without the cost and inflexibility of a permanent hire. They range from scaling businesses and corporates to investors, founders, and executives who value expertise on-demand. Clients use GigExecs to: Access trusted senior talent quickly and efficiently. Fill advisory, consulting, fractional, or interim roles with proven professionals. Reduce the time and fees associated with lengthy recruitment processes. Gain fresh perspectives and established networks that accelerate impact. By working with GigExecs, clients unlock the ability to collaborate with seasoned professionals who deliver meaningful results in a flexible way.'
        },
        {
          question: 'Who are Experienced Professionals?',
          answer: 'Experienced Professionals on GigExecs are senior, independent experts with a minimum of 15 years of experience, often bringing decades of leadership and specialist knowledge. They are typically professionals from their late 30s through to their 70s who choose to work differently, beyond traditional full-time employment. Our professionals include former executives, consultants, advisors, and specialists who now engage in: Independent advisory and consulting, Fractional leadership roles, Interim management, Freelancing and short-term contracts. They value: Flexibility in how, when, and where they work. The opportunity to apply their expertise across industries and functions. Belonging to a curated, trusted global network where quality and reputation matter. GigExecs enables these professionals to continue making an impact, on their own terms, while helping companies access skills and networks that are otherwise difficult to reach.'
        }
      ]
    },
    'milestones': {
      title: 'Milestones',
      icon: Target,
      content: 'Understanding and managing project milestones.',
      faqs: [
        {
          question: 'What are Milestones?',
          answer: 'Milestones are key checkpoints that mark important stages of a mandate, engagement, or project. They ensure both sides stay aligned on objectives, deliverables, and timing.'
        },
        {
          question: 'How to Create Milestones',
          answer: 'When setting up a gig, companies and professionals agree on milestones by: Defining the critical deliverables or outcomes. Breaking them into manageable phases. Assigning dates or completion criteria so progress can be measured clearly.'
        },
        {
          question: 'What if a Milestone is Delayed?',
          answer: 'If a milestone is not met as planned, both parties can review the reasons, adjust scope or timelines, and agree on corrective steps. This flexibility helps keep the engagement on track while maintaining trust and accountability.'
        },
        {
          question: 'How Milestones Impact Payments',
          answer: 'On GigExecs, milestones often act as payment triggers. This means payments are linked to the successful completion of specific deliverables, giving companies confidence in delivery and professionals clarity on when they will be paid.'
        }
      ]
    },
    'contracts': {
      title: 'Contracts',
      icon: FileText,
      content: 'Managing agreements on GigExecs.',
      faqs: [
        {
          question: 'What is a contract on GigExecs?',
          answer: 'A contract is a binding agreement between a client and a professional, outlining how they will work together. It typically covers scope, deliverables, timelines, payment terms, and any other important conditions.'
        },
        {
          question: 'How do I create a contract?',
          answer: 'Contracts are set up through the platform\'s Manage Gig section. Once both parties agree on the terms, the contract is finalized and becomes binding.'
        },
        {
          question: 'What does a contract include?',
          answer: 'It usually covers project scope, deliverables, timelines, payment details, intellectual property rights, confidentiality, and other relevant terms.'
        },
        {
          question: 'Can terms be negotiated?',
          answer: 'Yes. Both clients and professionals can negotiate terms before finalizing to ensure the contract is fair and practical for both sides.'
        },
        {
          question: 'What if a dispute arises?',
          answer: 'First, both parties should try to resolve issues directly. If that\'s not possible, GigExecs can provide dispute resolution and mediation services, either through 3rd party services or by trying to solve the issues in an independent and fair way with both parties.'
        },
        {
          question: 'Can a contract be canceled?',
          answer: 'Contracts are binding, but they can be canceled if both parties agree. The specific cancellation and termination clauses will apply.'
        },
        {
          question: 'What happens in case of a breach?',
          answer: 'If one side fails to meet their obligations, the other may take steps such as termination or legal remedies. Issues should always be documented, and resolution should be attempted through communication first.'
        }
      ]
    },
    'gigs': {
      title: 'Gigs',
      icon: Briefcase,
      content: 'Finding, applying for, and managing gig opportunities.',
      faqs: [
        {
          question: 'What is a gig on GigExecs?',
          answer: 'A gig on GigExecs refers to a specific project or task posted by a client seeking services from freelancers or consultants. Gigs can vary in scope, duration, and requirements, covering a wide range of industries and skill sets.'
        },
        {
          question: 'How do I browse gigs on GigExecs?',
          answer: 'To browse gigs, simply navigate to the platform\'s "Find Gigs" section, where you can explore available projects based on categories, keywords, or filters. Each gig listing provides details such as project description, requirements, budget, and timeline.'
        },
        {
          question: 'How do I apply for gigs on GigExecs?',
          answer: 'To apply for gigs, click on the desired project listing and review the project details. If you meet the requirements and are interested in the gig, submit a proposal outlining your qualifications, relevant experience, and approach to the project.'
        },
        {
          question: 'Can I post gigs as a client on GigExecs?',
          answer: 'Yes, both clients and consultants can post gigs on GigExecs by creating a project listing detailing the project scope, requirements, budget, and timeline. Posting gigs allows clients to receive proposals from qualified freelancers or consultants interested in the project.'
        },
        {
          question: 'What happens if there is a dispute over a gig on GigExecs?',
          answer: 'In the event of a dispute over a gig, both parties are encouraged to communicate openly and attempt to resolve the issue amicably. If resolution cannot be reached, GigExecs offers dispute resolution services or mediation to help facilitate a resolution.'
        },
        {
          question: 'Are there any fees associated with posting or applying for gigs on GigExecs?',
          answer: 'GigExecs charges fees for certain premium features or services, such as featured gig listings or access to advanced search filters. However, basic usage of the platform, including browsing and applying for gigs, is free for users.'
        }
      ]
    },
    'disputes': {
      title: 'Disputes',
      icon: AlertTriangle,
      content: 'Ensuring fair and professional conflict resolution on GigExecs.',
      faqs: [
        {
          question: 'What should I do if I have a dispute with a client or professional?',
          answer: 'Start by addressing the issue directly through open communication on the platform. Many disagreements can be resolved by clarifying expectations and finding common ground.'
        },
        {
          question: 'How do I file a dispute?',
          answer: 'If the matter remains unresolved, you can submit a formal dispute request via help@gigexecs.com. Provide a clear description of the issue along with any supporting evidence.'
        },
        {
          question: 'What happens after I file a dispute?',
          answer: 'The GigExecs team will review the case and provide an independent and fair recommendation aimed at resolving the matter quickly. Both parties will have the opportunity to present their perspectives before a recommendation is made.'
        },
        {
          question: 'What if I am unsatisfied with the resolution?',
          answer: 'If you disagree with GigExecs\' independent recommendation, you may submit further information for reconsideration. If the matter still cannot be resolved, GigExecs can recommend 3rd party specialised legal services (at an extra cost) to mediate the dispute.'
        },
        {
          question: 'What kind of evidence can I submit?',
          answer: 'Evidence may include communication records, contracts, deliverables, payment proof, or other relevant documentation. The more comprehensive the information, the smoother the process.'
        },
        {
          question: 'Can I get a refund if the work was not completed as agreed?',
          answer: 'If evidence shows that work was not delivered in line with the agreed terms, GigExecs may recommend a partial or full refund, depending on the circumstances. Refunds apply only to the payment for work and exclude any GigExecs service fees.'
        },
        {
          question: 'What happens if one party does not respond?',
          answer: 'If a party fails to engage in the process, GigExecs may issue a recommendation based solely on the available evidence. If still unresolved, the matter can be escalated to a third-party mediator or legal professional.'
        },
        {
          question: 'Can I still work with the same client or professional after a dispute?',
          answer: 'Yes. Many disputes are situational and can be resolved professionally. If trust is rebuilt, both parties are welcome to collaborate again, ideally with clearer terms in place.'
        }
      ]
    },
    'professionals': {
      title: 'Professionals',
      icon: Users,
      content: 'Information for professionals using the platform.',
      faqs: [
        {
          question: 'How do I showcase my skills and experience effectively on my profile?',
          answer: 'Provide detailed information about your career achievements, leadership roles, key projects, and any certifications or qualifications. Use the profile sections to highlight your expertise, strengths, and the value you can bring to clients.'
        },
        {
          question: 'Can I set my own rates as a professional?',
          answer: 'Yes. Professionals on GigExecs have the flexibility to set their own rates based on their expertise, market demand, and the scope or complexity of the engagement.'
        },
        {
          question: 'How do I find opportunities on the platform?',
          answer: 'Opportunities are listed in the "Find Gigs" section. You can browse available roles, filter based on your expertise, and apply to those that align with your skills and interests.'
        },
        {
          question: 'What is the process for applying to opportunities?',
          answer: 'Once you find an opportunity of interest, you can submit a tailored proposal highlighting your relevant experience, approach, and how you can deliver value to the client. Clients review proposals and may reach out to discuss further.'
        },
        {
          question: 'How do I communicate with clients during an engagement?',
          answer: 'We recommend using GigExecs\' platform messaging tools to keep all communication within the system. This ensures clarity, maintains a record in case of disputes or support needs, and allows you to share updates, documents, and clarify details directly with clients.'
        },
        {
          question: 'Are there any restrictions on the number of opportunities I can take on?',
          answer: 'Professionals are free to take on multiple opportunities simultaneously, depending on availability and workload. However, it is important to ensure capacity to deliver consistently high-quality results.'
        },
        {
          question: 'How can I build long-term relationships with clients?',
          answer: 'Trust, reliability, and impact are key. Delivering strong results, maintaining clear communication, and consistently adding value will help you foster long-term relationships that can lead to repeat work and referrals.'
        }
      ]
    },
    'client': {
      title: 'Clients',
      icon: Users,
      content: 'Information for clients hiring and engaging senior professionals.',
      faqs: [
        {
          question: 'How can I find senior professionals on the platform?',
          answer: 'Clients can find professionals by browsing our curated network of highly experienced individuals or by posting an engagement and receiving proposals from qualified professionals.'
        },
        {
          question: 'What types of services are available on the platform?',
          answer: 'GigExecs is industry and function agnostic. Clients can find professionals for advisory roles, interim leadership, fractional positions, specialized mandates, and other flexible arrangements across all sectors.'
        },
        {
          question: 'How do I post an engagement on the platform?',
          answer: 'Click on the "Create a New Gig" button, provide details about the engagement, scope, budget, and timeline, and submit it. Qualified professionals will then submit proposals for your review.'
        },
        {
          question: 'Can I review senior professional profiles before engaging them?',
          answer: 'Yes. Clients have access to detailed profiles, including expertise, experience, past roles or assignments, client feedback, and ratings. This enables informed hiring decisions.'
        },
        {
          question: 'How do I communicate with professionals during an engagement?',
          answer: 'We recommend using GigExecs\' messaging tools to keep all communication within the platform. This allows for secure, transparent communication, sharing of updates and documents, and ensures a record in case of disputes or support needs.'
        },
        {
          question: 'What if I\'m not satisfied with the work of a professional?',
          answer: 'Clients should first address concerns directly with the professional. If resolution isn\'t possible, GigExecs can provide an independent recommendation or connect both parties to third-party dispute resolution specialists.'
        },
        {
          question: 'Are there any fees for posting or hiring professionals on the platform?',
          answer: 'Posting engagements is free. Service fees or platform fees for hiring professionals are transparently displayed before engagement.'
        },
        {
          question: 'How can I ensure the confidentiality of my engagement information?',
          answer: 'GigExecs takes confidentiality seriously. Information is only shared with the professionals you choose to engage and is protected throughout the process.'
        },
        {
          question: 'Can I hire professionals for long-term or ongoing support?',
          answer: 'Yes. GigExecs supports both short-term and long-term engagements, including advisory, interim, fractional, or ongoing roles. Senior professionals in our network offer flexible arrangements to meet clients specific needs.'
        }
      ]
    },
    'billing-process': {
      title: 'Billing Process & Invoicing',
      icon: CreditCard,
      content: 'Understanding how billing works and managing invoices on GigExecs.',
      faqs: [
        {
          question: 'How does the billing process work on the platform?',
          answer: 'Clients are billed for services provided by professionals based on the agreed-upon terms and payment schedule for each engagement or milestone. GigExecs facilitates secure and transparent payments between clients and professionals.'
        },
        {
          question: 'When will I receive invoices for services rendered?',
          answer: 'Invoices are typically generated upon completion of an engagement, or at agreed-upon milestones. Clients and professionals can access invoices via email or directly through their account dashboard.'
        },
        {
          question: 'What should I do if I have questions or concerns about an invoice?',
          answer: 'If there are any questions or discrepancies, contact our team on help@gigexecs.com. They are available to help resolve any billing-related issues promptly and efficiently.'
        }
      ]
    },
    'payment-methods': {
      title: 'Payment Methods',
      icon: CreditCard,
      content: 'What payment methods are accepted on the platform?',
      faqs: [
        {
          question: 'What payment methods are accepted on the platform?',
          answer: 'Currently, all payments are processed securely via Stripe, a leading global online payment platform integrated on GigExecs. We are considering adding other payment options in the future to provide more flexibility. Stripe processing fees are typically included in the service fees charged to both clients and professionals.'
        },
        {
          question: 'How can I add or update my payment method?',
          answer: 'Go to your account settings, navigate to the "Payment Methods" section, and follow the prompts to add or update your payment details.'
        },
        {
          question: 'Are there any additional fees for using certain payment methods?',
          answer: 'There are typically no additional fees for standard payments via Stripe. Please check with your bank or card provider for any potential transaction fees they may charge.'
        },
        {
          question: 'What should I do if I have questions or concerns about a payment?',
          answer: 'Contact our team at help@gigexecs.com for assistance. They are available to help resolve any payment-related questions or issues promptly.'
        }
      ]
    },
    'refunds-credits': {
      title: 'Refunds and Credits',
      icon: CreditCard,
      content: 'Understanding how refunds and credits work on GigExecs.',
      faqs: [
        {
          question: 'What is the refund policy for services rendered?',
          answer: 'Refunds are handled in accordance with the terms agreed between clients and professionals. If work is not delivered as agreed or a dispute resolution recommends a refund, GigExecs may recommend a partial or full refund. Refunds apply only to payments for services and exclude any GigExecs service fees.'
        },
        {
          question: 'How long does it take to process refunds or issue credits?',
          answer: 'Refunds and credits are typically processed within a reasonable timeframe, depending on the payment method and financial institution. GigExecs strives to handle refund requests promptly once they are approved.'
        },
        {
          question: 'What should I do if I believe I\'m eligible for a refund or credit?',
          answer: 'Contact our support team on help@gigexecs.com with details of your request. They will review your case, coordinate with the professional if necessary, and assist in processing any approved refund or credit.'
        }
      ]
    }
  }

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    // Simulate search results - in a real app, this would search through actual help content
    const results: any[] = []
    Object.entries(helpContent).forEach(([key, section]) => {
      if (section.title.toLowerCase().includes(query.toLowerCase()) || 
          section.content.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'section',
          id: key,
          title: section.title,
          content: section.content
        })
      }
      
      // Search through FAQs
      if (section.faqs) {
        section.faqs.forEach((faq, index) => {
          if (faq.question.toLowerCase().includes(query.toLowerCase()) || 
              faq.answer.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              type: 'faq',
              id: key,
              title: faq.question,
              content: faq.answer
            })
          }
        })
      }
    })
    
    setSearchResults(results)
    setIsSearching(false)
  }

  // Handle search result click
  const handleSearchResultClick = (result: any) => {
    if (result.type === 'section') {
      setActiveTab(result.id)
    } else {
      setActiveTab(result.id)
    }
    setSearchQuery('')
    setSearchResults([])
  }

  useEffect(() => {
    document.title = 'Help & Support - GigExecs'
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <a href="/" className="text-2xl font-extrabold text-slate-900 hover:text-[#0284C7] transition-colors cursor-pointer">
                GigExecs
              </a>
            </div>

            {/* Center - Navigation Links */}
            <div className="hidden lg:flex items-center space-x-12">
              <a href="/" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Blog</a>
            </div>

            {/* Right side - Action Buttons */}
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

            {/* Mobile Menu Button */}
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

          {/* Mobile Navigation Menu */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#F5F5F5]">
              <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Blog</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-600 mt-1">Find answers to your questions and get the help you need</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search help topics..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                  />
                </div>
                
                {/* Search Results */}
                {searchQuery.trim() !== '' && (
                  <div className="mt-3 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-6 text-center">
                        <div className="w-6 h-6 mx-auto mb-3 text-blue-500 animate-spin">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((result, index) => (
                        <div
                          key={index}
                          onClick={() => handleSearchResultClick(result)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900">
                              {result.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {result.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 text-gray-400">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No results found</h3>
                        <p className="text-xs text-gray-500">
                          Try searching with different keywords or browse the topics below
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-4">
                {/* Getting Started Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                    Getting Started
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveTab('getting-started')}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        activeTab === 'getting-started'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span className="font-medium">Getting Started</span>
                    </button>
                  </div>
                </div>

                {/* Core Platform Features */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                    Core Platform Features
                  </h3>
                  <div className="space-y-1">
                    {['milestones', 'contracts', 'gigs', 'disputes'].map((key) => {
                      const section = helpContent[key as keyof typeof helpContent]
                      const IconComponent = section.icon
                      
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                            activeTab === key 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{section.title}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* User Roles */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                    User Roles
                  </h3>
                  <div className="space-y-1">
                    {['professionals', 'client'].map((key) => {
                      const section = helpContent[key as keyof typeof helpContent]
                      const IconComponent = section.icon
                      
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                            activeTab === key 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{section.title}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Billing & Payments */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                    Billing & Payments
                  </h3>
                  <div className="space-y-1">
                    {['billing-process', 'payment-methods', 'refunds-credits'].map((key) => {
                      const section = helpContent[key as keyof typeof helpContent]
                      const IconComponent = section.icon
                      
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                            activeTab === key 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{section.title}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              {(() => {
                const currentSection = helpContent[activeTab as keyof typeof helpContent]
                
                if (!currentSection) return null

                const IconComponent = currentSection.icon
                
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {currentSection.title}
                        </h2>
                        <p className="text-gray-600">
                          {currentSection.content}
                        </p>
                      </div>
                    </div>

                    {/* FAQ Content */}
                    <div className="space-y-6">
                      {currentSection.faqs && 
                        currentSection.faqs.map((faq, index) => (
                          <Card key={index} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                            <CardHeader>
                              <CardTitle className="text-lg text-gray-900">
                                {faq.question}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover more insights about freelancing, professional development, and the gig economy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Blog 1 - Getting Started with Freelancing */}
            <BlogCard blogNumber={1} />
            
            {/* Blog 2 - AI and Future of Work */}
            <BlogCard blogNumber={3} />
            
            {/* Blog 3 - Finding Purpose in Second Half */}
            <BlogCard blogNumber={5} />
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
                The premier community connecting top professionals and innovative companies.
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
                <li><a href="/help" className="hover:text-white transition-colors">Help & Support</a></li>
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
