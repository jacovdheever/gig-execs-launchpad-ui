import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// BlogCard component for the client page
const BlogCard = ({ blogNumber }: { blogNumber: number }) => {
  const blogData: Record<number, {
    image: string;
    alt: string;
    title: string;
    description: string;
    author: string;
    date: string;
    link: string;
  }> = {
    1: {
      image: "/images/blog/Blog1.png",
      alt: "Remote, Hybrid, or In-Office work models",
      title: "Remote, Hybrid, or In-Office? Choosing the Right Work Model for Your Career.",
      description: "Is remote work the future, or is hybrid the best balance? Discover insights from 23 years of global experience on how work models impact career growth, flexibility, and the evolving job market. Read on to make the right choice for your career!",
      author: "Nuno G. Rodrigues",
      date: "March 15, 2024",
      link: "/blog/remote-hybrid-in-office"
    },
    5: {
      image: "/images/blog/Blog5.png",
      alt: "Finding Purpose in the Second Half of Life",
      title: "Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals",
      description: "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…",
      author: "GigExecs Insider",
      date: "July 15, 2024",
      link: "/blog/finding-purpose-second-half-life"
    },
    6: {
      image: "/images/blog/Blog6.png",
      alt: "Building the Future of Flexible Work",
      title: "Building the Future of Flexible Work for Senior Professionals",
      description: "This article updates readers on GigExecs' progress since launching its Beta version, showcasing a growing network of senior professionals from diverse industries globally. GigExecs' mission is to provide flexible work opportunities, offering solutions to the challenges posed by longer careers and ageism.",
      author: "GigExecs Insider",
      date: "September 13, 2024",
      link: "/blog/building-future-flexible-work"
    }
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
        <a href={blog.link} className="inline-flex items-center text-[#0284C7] hover:text-[#012E46] font-medium transition-colors ml-auto">
          Read More →
        </a>
      </CardContent>
    </Card>
  )
}

const Clients = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    document.title = 'Client - GigExecs | Experienced Skills at your Fingertips'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Reach out to experienced professionals to help solve your challenges and achieve your goals. Join GigExecs today.')
    
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', window.location.href)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#FFFFFF]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl text-[#012E46] hover:text-[#0284C7] transition-colors cursor-pointer">
                <span className="font-bold">Gig</span><span className="font-normal">Execs</span>
              </a>
            </div>

            <div className="hidden lg:flex items-center space-x-12">
              <a href="/" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" className="text-[#0284C7] font-semibold">Clients</a>
              <a href="/professionals" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Blog</a>
            </div>

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

          <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#F5F5F5]">
              <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#0284C7] font-semibold">Clients</a>
              <a href="/professionals" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Blog</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-6 leading-tight">
              Experienced Skills at your Fingertips with{' '}
              <span className="bg-gradient-to-r from-[#0284C7] to-[#FACC15] bg-clip-text text-transparent">
                GigExecs
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[#9CA3AF] mb-8 max-w-3xl mx-auto leading-relaxed">
              Reach out to experienced professionals to help solve your challenges and achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#012E46] hover:bg-[#0284C7] text-white px-8 py-3">
                Join GigExecs
              </Button>
              <Button variant="outline" size="lg" className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] px-8 py-3">
                Learn More
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
      <section className="py-20 bg-white">
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
                Post your job and requirements, hire an experienced freelancer in a flash!
              </h2>
              <p className="text-lg text-[#9CA3AF] leading-relaxed">
                We designed an easy process to enable you to match quickly the perfect expert to your project needs. Post your job and start receiving offers from skilled professionals!
              </p>
              <Button size="lg" className="bg-[#012E46] hover:bg-[#0284C7] text-white px-8 py-3">
                Create a New Gig
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

      {/* Process Panel Section */}
      <section className="py-20 bg-gradient-to-br from-[#F5F5F5] to-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] text-center mb-16">
            How to Hire an Experienced Professional in a few Easy Steps:
          </h2>
          
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Sign up & get verified", description: "Our validation process ensures platform quality." },
                { step: "2", title: "Create a Job", description: "Outline the scope, required skills, timeline, and budget to find the perfect expert." },
                { step: "3", title: "Browse for Talent", description: "Browse profiles and portfolios to find the best fit for your project." },
                { step: "4", title: "Identify Potential Experts", description: "Start searching for top consultants tailored to your needs." },
                { step: "5", title: "Accept a Bid", description: "Choose the best consultant by accepting their bid." },
                { step: "6", title: "Kick-off meeting", description: "Invite the freelancer to align on deliverables and expectations." },
                { step: "7", title: "Track the progress", description: "Evaluate the deliverables and complete payment." },
                { step: "8", title: "Provide Feedback", description: "Share your review to support the consultant's growth." }
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
              <div className="bg-gray-200 rounded-xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-3">
                Access to a quality pool of experienced freelancers
              </h3>
              <p className="text-gray-700">
                GigExecs runs a rigorous vetting process to ensure and protect the quality of our freelancers and clients. Our platform and processes were designed for simplicity and for user friendliness.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 rounded-xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-3">
                Streamlined hiring process
              </h3>
              <p className="text-gray-700">
                Our platform matches the best available skills with our client's requirements. The hiring process for freelancers is simple, quick and safe.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 rounded-xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-3">
                Age is Just a Number
              </h3>
              <p className="text-gray-700">
                At GigExecs we welcome senior professionals in their 50s, 60s or 70s to join our platform to share their valuable skills and know-how with our clients; freelancing is a great alternative to stay financially active, in a less stressful lifestyle, whilst still engaged in interesting work later in our careers.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 rounded-xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-bold text-[#0284C7] mb-3">
                Secure and easy payment processes
              </h3>
              <p className="text-gray-700">
                GigExecs offers secure payment processing systems, enabling clients to make payments to freelancers using credit or debit cards as well as other mainstream digital payment methods. Our payment processes are convenient and streamlined to our users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#012E46] to-[#0284C7] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Need help but don't have time to post, browse, or monitor your project?<br />
              We can assist with that too.
            </h2>
            <Button size="lg" className="bg-[#FACC15] hover:bg-[#EAB308] text-[#012E46] px-8 py-3 text-lg font-semibold">
              Book a Call
            </Button>
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
                The premier freelance hub for top professionals and innovative companies.
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
                <li><a href="/help" className="hover:text-white transition-colors">Help</a></li>
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

export default Clients
