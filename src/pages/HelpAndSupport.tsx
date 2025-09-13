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
          question: 'What is Gigexecs?',
          answer: 'GigExecs is a job marketplace exclusively designed for highly experienced freelancers with at least 10 years of expertise. It provides access to a curated pool of seasoned professionals, ensuring clients receive top-tier quality and expertise for their projects.'
        },
        {
          question: 'Understanding Gigs',
          answer: 'The platform offers a wide range of job opportunities spanning industries such as consultancy, project management, technical expertise, creative services, and more. Clients can find professionals capable of handling diverse projects, from complex technical tasks to strategic consultancy assignments. Each job listing on GigExecs is tailored to attract seasoned professionals, ensuring clients access top-tier talent for their projects.'
        },
        {
          question: 'Who are Clients?',
          answer: 'Clients on GigExec are individuals, businesses, or organizations seeking highly experienced freelancers with at least 10 years of expertise to fulfill their project needs. These clients range from small businesses to large corporations and individuals requiring specialized services. They rely on GigExec to connect them with top-tier talent across various fields, ensuring effective project outcomes.'
        },
        {
          question: 'Who are Experienced Professionals?',
          answer: 'A freelancer is a self-employed individual who provides services to clients on a project or contract basis. Freelancers work in a wide range of industries, including writing, design, programming, marketing, consulting, and more. They typically work remotely and can set their own schedules and rates. As independent contractors, freelancers are responsible for finding their own clients, negotiating contracts, and managing their own finances. They may work for multiple clients simultaneously or specialize in a particular niche. Freelancers are often highly skilled and experienced in their field, and they are able to offer flexible and customized services to meet their clients\' needs. Freelancing offers many benefits, including the freedom to choose their projects, set their own rates, and the flexibility to work from anywhere. However, it requires a high degree of self-discipline, organization, and business savvy to succeed. Freelancers must be able to manage their time effectively, maintain a steady flow of work, and provide high-quality services that meet their clients\' expectations.'
        }
      ]
    },
    'milestones': {
      title: 'Milestones',
      icon: Target,
      content: 'Understanding and managing project milestones.',
      faqs: [
        {
          question: 'What are milestones?',
          answer: 'Milestones are significant points or events in a project that mark progress toward a specific goal or achievement. They serve as checkpoints to track the completion of key tasks or phases within the project timeline.'
        },
        {
          question: 'How do I create milestones for my project?',
          answer: 'To create milestones for your project, identify key objectives or deliverables and break them down into smaller, measurable tasks. Assign specific dates or deadlines to each milestone to track progress effectively.'
        },
        {
          question: 'What should I do if a milestone is not met as planned?',
          answer: 'If a milestone is not met as planned, assess the reasons for the delay and take corrective action as necessary. This may involve reallocating resources, adjusting timelines, or revising project plans to ensure future milestones are achieved on time.'
        },
        {
          question: 'How do milestones impact project payments?',
          answer: 'Milestones serve as payment triggers in project contracts or agreements. Payments may be tied to the completion of specific milestones, ensuring that work is delivered satisfactorily before payment is made.'
        }
      ]
    },
    'contracts': {
      title: 'Contracts',
      icon: FileText,
      content: 'Contract management and legal aspects of working on GigExecs.',
      faqs: [
        {
          question: 'What is a contract on GigExecs?',
          answer: 'A contract on the platform is a legally binding agreement between a client and a freelancer/consultant outlining the terms and conditions of their working relationship. It typically includes details such as project scope, deliverables, timelines, payment terms, and other relevant terms.'
        },
        {
          question: 'How do I create a contract with a freelancer/consultant?',
          answer: 'To create a contract, both parties must agree to the terms and conditions of the project. This can be done through the platform\'s Manage Gig section. Once both parties agree, the contract is finalised and becomes binding.'
        },
        {
          question: 'What is included in a contract?',
          answer: 'A contract includes clear and detailed information about the project scope, deliverables, timelines, payment terms, intellectual property rights, confidentiality agreements, and any other relevant terms specific to the project.'
        },
        {
          question: 'Can I negotiate terms in a contract?',
          answer: 'Yes, clients and freelancers/consultants can negotiate the terms of the contract to ensure they are mutually beneficial. It\'s important to communicate openly and clearly about expectations and requirements to reach a satisfactory agreement.'
        },
        {
          question: 'What happens if there is a dispute over a contract?',
          answer: 'In the event of a dispute over a contract, both parties should attempt to resolve the issue amicably through negotiation and communication. If resolution cannot be reached, GigExecs offers dispute resolution services or mediation to help resolve the conflict.'
        },
        {
          question: 'Can I cancel a contract once it\'s been signed?',
          answer: 'Contracts are legally binding agreements, and canceling them may have legal and financial implications. However, if both parties agree to cancel the contract, they can do so by mutual consent. It\'s important to review the contract terms regarding cancellation and termination clauses.'
        },
        {
          question: 'What happens if one party breaches the contract?',
          answer: 'If one party breaches the contract by failing to fulfill their obligations, the other party may pursue legal remedies such as seeking damages or terminating the contract. It\'s essential to document any breaches and attempt to resolve the issue through communication before taking legal action.'
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
      content: 'Resolving conflicts and handling disputes on the platform.',
      faqs: [
        {
          question: 'What should I do if I have a dispute with an employer/freelancer?',
          answer: 'If you encounter a dispute, first try to resolve the issue directly by communicating with the employer/freelancer through the platform. If the matter remains unresolved, you can escalate the dispute by submitting a formal dispute resolution request via the app.'
        },
        {
          question: 'How do I file a dispute?',
          answer: 'To file a dispute, navigate to the project or contract in question, select "Open a Dispute," and provide detailed information about the issue. Be sure to include any supporting documentation or evidence related to the work completed.'
        },
        {
          question: 'What happens after I file a dispute?',
          answer: 'Once a dispute is filed, our dispute resolution team will review your submission and mediate between you and the other party. Both parties will have the opportunity to present their case. We aim to resolve disputes within a set timeframe, typically 7–10 business days.'
        },
        {
              question: 'What kind of evidence can I submit for a dispute?',
              answer: 'You can submit various forms of evidence, such as communication records, files related to the job, contracts, screenshots of conversations, invoices, and proof of payment. Be sure to provide as much relevant information as possible to support your claim.'
        },
        {
              question: 'What if I am unsatisfied with the dispute resolution outcome?',
              answer: 'If you are not satisfied with the outcome of the dispute, you may request a further review by providing additional evidence or reasoning. However, the final decision is at the discretion of the dispute resolution team.'
        },
        {
              question: 'Can I get a refund if the work was not completed as agreed?',
              answer: 'If the dispute resolution team determines that the work was not completed or was not up to the agreed-upon standard, you may be eligible for a partial or full refund depending on the situation.'
        },
        {
              question: 'What happens if the other party doesn\'t respond to the dispute?',
              answer: 'If the other party fails to respond to the dispute within the allotted time, the resolution team may make a decision based solely on the information and evidence provided by you.'
        },
        {
              question: 'Can I still work with the same freelancer/employer after a dispute?',
              answer: 'Yes, you can choose to continue working with the same freelancer/employer after a dispute is resolved, but we recommend reviewing the terms of the project carefully to avoid further issues.'
        }
      ]
    },
    'consultant': {
      title: 'Consultant',
      icon: Users,
      content: 'Information for consultants and freelancers using the platform.',
      faqs: [
        {
          question: 'How do I showcase my skills and experience effectively on my profile?',
          answer: 'Make sure to provide detailed information about your past projects, clients, achievements, and any certifications or qualifications you hold. Utilize our profile sections effectively to highlight your strengths.'
        },
        {
          question: 'Can I set my own rates as a consultant?',
          answer: 'Yes, as a consultant, you have the flexibility to set your own rates based on your expertise, market demand, and the complexity of the projects you undertake.'
        },
        {
          question: 'How do I find consulting opportunities on the platform?',
          answer: 'Consulting opportunities are typically listed under our "Find Gigs" section. You can browse through available projects, filter based on your expertise, and submit proposals for those that match your skills.'
        },
        {
          question: 'What is the process for applying to consulting projects?',
          answer: 'Once you find a project of interest, you can submit a proposal outlining your approach, relevant experience, and how you can add value to the client\'s project. Clients will review proposals and may contact you for further discussion.'
        },
        {
          question: 'How do I communicate with clients during a consulting project?',
          answer: 'Our platform provides messaging and communication tools that allow you to interact with clients directly. You can discuss project details, share documents, and provide updates through our secure messaging system.'
        },
        {
          question: 'Are there any restrictions on the number of consulting projects I can take on?',
          answer: 'As a consultant, you have the flexibility to take on multiple projects simultaneously based on your availability and workload. However, ensure that you can commit enough time and resources to deliver high-quality results for each project.'
        },
        {
          question: 'How can I build long-term relationships with clients as a consultant?',
          answer: 'Building trust, delivering exceptional results, and maintaining clear communication are key to fostering long-term relationships with clients. Consistently delivering value and exceeding client expectations can lead to repeat business and referrals.'
        }
      ]
    },
    'client': {
      title: 'Client',
      icon: Users,
      content: 'Information for clients hiring consultants and managing projects.',
      faqs: [
        {
          question: 'How can I find consultants on the platform?',
          answer: 'Clients can find consultants by browsing through our directory of experienced professionals or by posting a project and receiving proposals from qualified consultants.'
        },
        {
          question: 'What types of consulting services are available on the platform?',
          answer: 'Our platform offers a wide range of consulting services including management, strategy, finance, marketing, technology, human resources, and more. Clients can find consultants with expertise in various industries and specialties.'
        },
        {
          question: 'How do I post a project on the platform?',
          answer: 'Posting a project is simple. Just click on the "Create a New Gig" button in the navigation bar, provide details about your project requirements, budget, and timeline, and submit the project. Qualified consultants will then submit proposals for your review.'
        },
        {
          question: 'Can I review the profiles of consultants before hiring them?',
          answer: 'Yes, clients have access to detailed profiles of consultants, which include information about their expertise, experience, past projects, client reviews, and ratings. This allows clients to make informed decisions when hiring consultants.'
        },
        {
          question: 'How do I communicate with consultants during a project?',
          answer: 'Clients can communicate with consultants directly through our platform\'s messaging system. This allows for seamless communication, sharing of project updates, and collaboration throughout the project duration.'
        },
        {
          question: 'What if I\'m not satisfied with the work of a consultant?',
          answer: 'If a client is not satisfied with the work of a consultant, they can discuss their concerns directly with the consultant and attempt to resolve any issues. If necessary, clients can also reach out to our support team for assistance in resolving disputes.'
        },
        {
          question: 'Are there any fees for posting projects or hiring consultants on the platform?',
          answer: 'Clients can post projects on our platform for free. However, there are fees associated with hiring consultants, such as project fees or service fees. These fees are transparently displayed before hiring a consultant.'
        },
        {
          question: 'How can I ensure the confidentiality of my project information?',
          answer: 'We take the confidentiality of our clients\' projects seriously. Clients can rest assured that their project information is kept confidential and only shared with the consultant(s) they choose to work with.'
        },
        {
          question: 'Can I hire consultants for long-term projects or ongoing support?',
          answer: 'Yes, clients can hire consultants for both short-term and long-term projects, as well as for ongoing support. Many consultants offer flexible arrangements to meet the needs of clients\' projects.'
        }
      ]
    },
    'billing-process': {
      title: 'Billing Process & Invoicing',
      icon: CreditCard,
      content: 'How billing works and how to manage invoices.',
      faqs: [
        {
          question: 'How does the billing process work on the platform?',
          answer: 'The billing process involves charging clients for services rendered by freelancers or consultants. Clients are billed based on the agreed-upon terms and payment schedule for each project.'
        },
        {
          question: 'When will I receive invoices for services rendered?',
          answer: 'Invoices are typically generated upon project completion or at agreed-upon milestones. You\'ll receive invoices via email or can access them directly on your account dashboard.'
        },
        {
          question: 'How do I view and download invoices for my records?',
          answer: 'You can view and download invoices from your account dashboard under the "Billing" or "Invoices" section. Simply click on the invoice you wish to download for a detailed view.'
        },
        {
          question: 'What should I do if I have questions or concerns about an invoice?',
          answer: 'If you have any questions or concerns about an invoice, please reach out to our billing support team for assistance. We\'re here to help resolve any billing-related issues promptly.'
        }
      ]
    },
    'payment-methods': {
      title: 'Payment Methods',
      icon: CreditCard,
      content: 'Available payment methods and how to set them up.',
      faqs: [
        {
          question: 'What payment methods are accepted on the platform?',
          answer: 'We only accept payment methods through credit/debit cards at this time. We strive to provide a seamless and secure payment experience for our users, and credit/debit card transactions offer a convenient and widely accepted method for processing payments on our platform. We apologise for any inconvenience this may cause and appreciate your understanding. If you have any questions or concerns regarding payment methods, please don\'t hesitate to contact our support team for assistance.'
        },
        {
          question: 'How can I add or update my payment method?',
          answer: 'You can add or update your payment method in your account settings. Simply navigate to the "Payment Methods" section under your profile and follow the prompts to add a new payment method or update existing ones.'
        },
        {
          question: 'Are there any additional fees for using certain payment methods?',
          answer: 'We strive to provide transparent pricing, and there are typically no additional fees for using standard payment methods. However, please check with your financial institution for any potential transaction fees they may charge.'
        },
        {
          question: 'What should I do if I have questions or concerns about an invoice?',
          answer: 'If you have any questions or concerns about an invoice, please reach out to our billing support team for assistance. We\'re here to help resolve any billing-related issues promptly.'
        }
      ]
    },
    'subscription-management': {
      title: 'Subscription Management',
      icon: CreditCard,
      content: 'Managing your subscriptions and billing cycles.',
      faqs: [
        {
          question: 'What subscription plans are available on the platform?',
          answer: 'Currently, GigExec offers a single subscription plan at its initial launch, providing users with comprehensive access to all platform features. However, future updates may introduce additional subscription options to better cater to user needs. Stay tuned for any developments in our subscription offerings. For specific inquiries or suggestions, feel free to contact our support team.'
        },
        {
          question: 'How can I upgrade or downgrade my subscription plan?',
          answer: 'You can upgrade or downgrade your subscription plan at any time by accessing your account settings. Simply select the desired plan and follow the prompts to make the change.'
        },
        {
          question: 'Can I cancel my subscription at any time?',
          answer: 'Yes, you can cancel your subscription at any time. However, please note that cancellation may affect access to certain features or services associated with your subscription plan.'
        }
      ]
    },
    'refunds-credits': {
      title: 'Refunds and Credits',
      icon: CreditCard,
      content: 'How refunds and credits work on the platform.',
      faqs: [
        {
          question: 'What is the refund policy for services rendered?',
          answer: 'Our refund policy varies depending on the circumstances. Generally, refunds are issued in accordance with the terms of the agreement between clients and freelancers/consultants. Please refer to the project contract or contact our billing support team for more information.'
        },
        {
          question: 'How long does it take to process refunds or issue credits?',
          answer: 'Refunds and credits are typically processed within a specified timeframe, which may vary depending on the payment method and financial institution. We strive to process refunds promptly once the request is approved.'
        },
        {
          question: 'What should I do if I believe I\'m eligible for a refund or credit?',
          answer: 'If you believe you\'re eligible for a refund or credit, please contact our billing support team with details of your request. We\'ll review your case and provide assistance in processing the refund or issuing credits accordingly.'
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
                    {['consultant', 'client'].map((key) => {
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
                    {['billing-process', 'payment-methods', 'subscription-management', 'refunds-credits'].map((key) => {
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
                // Find the current section or child section
                let currentSection = helpContent[activeTab as keyof typeof helpContent]
                let currentChild = null
                
                // If not found in main sections, check if it's a child section
                if (!currentSection) {
                  Object.values(helpContent).forEach(section => {
                    if (section.children) {
                      const child = section.children.find(c => c.id === activeTab)
                      if (child) {
                        currentSection = section
                        currentChild = child
                      }
                    }
                  })
                }
                
                if (!currentSection) return null

                const IconComponent = currentSection.icon
                
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {currentChild ? currentChild.title : currentSection.title}
                        </h2>
                        <p className="text-gray-600">
                          {currentChild ? currentChild.content : currentSection.content}
                        </p>
                      </div>
                    </div>

                    {/* FAQ Content */}
                    <div className="space-y-6">
                      {(currentChild ? currentChild.faqs : currentSection.faqs) && 
                        (currentChild ? currentChild.faqs : currentSection.faqs).map((faq, index) => (
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

                    {/* Show child sections if viewing parent section */}
                    {!currentChild && currentSection.children && currentSection.children.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Topics</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {currentSection.children.map((child) => (
                            <Card key={child.id} className="hover:shadow-md transition-shadow cursor-pointer">
                              <CardHeader>
                                <CardTitle className="text-lg">{child.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-600">{child.content}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
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
