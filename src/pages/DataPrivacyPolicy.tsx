import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicy() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // SEO Metadata
  useEffect(() => {
    document.title = "Privacy Policy | GigExecs"
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', "Read GigExecs Privacy Policy. Learn about our data collection, usage, and protection practices for our freelance marketplace platform.")
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = "Read GigExecs Privacy Policy. Learn about our data collection, usage, and protection practices for our freelance marketplace platform."
      document.head.appendChild(newMetaDescription)
    }

    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', "https://www.gigexecs.com/privacy-policy")
    } else {
      const newCanonical = document.createElement('link')
      newCanonical.rel = 'canonical'
      newCanonical.href = "https://www.gigexecs.com/privacy-policy"
      document.head.appendChild(newCanonical)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
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

      {/* Breadcrumbs */}
      <section className="py-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-[#6B7280] hover:text-[#0284C7] transition-colors">
                  Home
                </a>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-[#9CA3AF] mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[#1F2937] font-medium">Privacy Policy</span>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#1F2937] mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#6B7280]">
            Last updated: 9th of April 2024
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-[#6B7280] mb-8">
                  This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service, and tells You about Your privacy rights and how the law protects You.
                </p>
                <p className="text-lg text-[#6B7280] mb-8">
                  We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
                </p>
                <p className="text-lg text-[#6B7280] mb-8">
                  Please read this Privacy Policy carefully before using Our Service.
                </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">1. Interpretation and Definitions</h2>
                
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">Interpretation</h3>
                <p className="text-[#6B7280] mb-4">
                  The words of which the initial letter is capitalised have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in the singular or in the plural.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">Definitions</h3>
                <p className="text-[#6B7280] mb-4">
                  For the purposes of this Privacy Policy:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-[#6B7280]">
                  <li><strong>"Account"</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                  <li><strong>"Affiliate"</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for the election of directors or other managing authority.</li>
                  <li><strong>"Application"</strong> means the software program provided by the Company or Operator accessed by You on any electronic device, named GigExecs.com.</li>
                  <li><strong>"Buyer"</strong> refers to users of the Service who are placing Orders for Service.</li>
                  <li><strong>"Country"</strong> refers to United States of America, and Delaware where the company is registered.</li>
                  <li><strong>"Company"</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to www.GigExecs.com which is the trading name of Perito Ventures LLC, with address 16192 Coastal Highway, in the city of Lewes, County of Sussex, State of Delaware 19958, under our registered agent Harvard Business Services, Inc.</li>
                  <li><strong>"Content"</strong> refers to content such as text, images, or other information that can be posted, uploaded, linked to, or otherwise made available by You, regardless of the form of that content.</li>
                  <li><strong>"Clients"</strong> refers to blue-chip companies, small and medium-sized enterprises, government institutions, non-profits, startups, or entrepreneurs seeking to hire experienced and senior professionals through our platform.</li>
                  <li><strong>"Device"</strong> means any device that can access the Service such as a computer, a cell phone, or a digital tablet.</li>
                  <li><strong>"Feedback"</strong> means feedback, innovations, or suggestions sent by You regarding the attributes, performance, or features of our Service.</li>
                  <li><strong>"Good"</strong> refers to the items or services offered for sale, or any other means of trading on the Service.</li>
                  <li><strong>"Order"</strong> means a request by a Client to purchase or trade by any means Goods on the Application or Website.</li>
                  <li><strong>"Professionals"</strong> encompasses highly experienced and senior: freelancers, independent consultants, independent advisors, fractional service providers, and other types of workers offering their services through flexible work models (non full-time employment), with a minimum of 15 years of total professional experience.</li>
                  <li><strong>"Seller"</strong> refers to users of the Service who are listing Services and making them available for trade by any means.</li>
                  <li><strong>"Service"</strong> refers to the Application or the Website or both.</li>
                  <li><strong>"Terms of Service"</strong> (also referred to as "Terms") mean these Terms of Service that form the entire agreement between You and the Company or Operator regarding the use of the Service.</li>
                  <li><strong>"Third-party Social Media Service"</strong> means any services or content (including data, information, products, or services) provided by a third party that may be displayed, included, or made available by the Service.</li>
                  <li><strong>"Website"</strong> refers to GigExecs.com, accessible from www.gigexecs.com.</li>
                  <li><strong>"You"</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                </ul>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">2. Contact Us</h2>
                <p className="text-[#6B7280] mb-4">
                  If you have any questions about these Terms of Service, You can contact us:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-[#6B7280]">
                  <li>By email: help@gigexecs.com</li>
                  <li>By visiting our website: www.gigexecs.com</li>
                </ul>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">3. Collecting and Using Your Personal Data</h2>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">Types of Data Collected</h3>
                <h4 className="text-lg font-semibold text-[#1F2937] mb-3">Personal Data</h4>
                <p className="text-[#6B7280] mb-4">
                  While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-[#6B7280]">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Bank account information</li>
                  <li>Credit card number and expiration date</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#1F2937] mb-3">Usage Data</h4>
                <p className="text-[#6B7280] mb-4">
                  Usage Data is collected automatically when using the Service.
                </p>
                <p className="text-[#6B7280] mb-4">
                  Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                </p>
                <p className="text-[#6B7280] mb-4">
                  When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
                </p>
                <p className="text-[#6B7280] mb-6">
                  We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
                </p>

                <h4 className="text-lg font-semibold text-[#1F2937] mb-3">Information from Third-Party Social Media Services</h4>
                <p className="text-[#6B7280] mb-4">
                  The Company or Operator may allow You to create an account and log in to use the Service through the following Third-party Social Media Services. These Third-party Social Media Services, may include, but is not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-[#6B7280]">
                  <li>Google</li>
                  <li>Facebook</li>
                  <li>Twitter</li>
                  <li>Linkedin</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#1F2937] mb-3">Tracking Technologies and Cookies</h4>
                <p className="text-[#6B7280] mb-4">
                  We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyse Our Service. The technologies We use may include:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-[#6B7280]">
                  <li><strong>"Cookies or Browser Cookies."</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</li>
                  <li><strong>"Web Beacons."</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company or Operator, for example, to count users who have visited those pages or opened an email and for other related application or website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li>
                </ul>

                <h5 className="text-base font-semibold text-[#1F2937] mb-3">"Necessary / Essential Cookies"</h5>
                <p className="text-[#6B7280] mb-2">Type: Session Cookies</p>
                <p className="text-[#6B7280] mb-2">Administered by: Us</p>
                <p className="text-[#6B7280] mb-4">Purpose: These Cookies are essential to provide You with services available through the Application or Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p>

                <h5 className="text-base font-semibold text-[#1F2937] mb-3">"Cookies Policy / Notice Acceptance Cookies"</h5>
                <p className="text-[#6B7280] mb-2">Type: Persistent Cookies</p>
                <p className="text-[#6B7280] mb-2">Administered by: Us</p>
                <p className="text-[#6B7280] mb-4">Purpose: These Cookies identify if users have accepted the use of cookies on the Application or Website.</p>

                <h5 className="text-base font-semibold text-[#1F2937] mb-3">"Functionality Cookies"</h5>
                <p className="text-[#6B7280] mb-2">Type: Persistent Cookies</p>
                <p className="text-[#6B7280] mb-2">Administered by: Us</p>
                <p className="text-[#6B7280] mb-4">Purpose: These Cookies allow us to remember choices You make when You use the Application or Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Application or Website.</p>

                <h5 className="text-base font-semibold text-[#1F2937] mb-3">"Tracking and Performance Cookies"</h5>
                <p className="text-[#6B7280] mb-2">Type: Persistent Cookies</p>
                <p className="text-[#6B7280] mb-2">Administered by: Third-Parties</p>
                <p className="text-[#6B7280] mb-6">Purpose: These Cookies are used to track information about traffic to the Application or Website and how users use the Application or Website. The information gathered via these Cookies may directly or indirectly identify you as an individual visitor. This is because the information collected is typically linked to a pseudonymous identifier associated with the device you use to access the Application or Website. We may also use these Cookies to test new pages, features or new functionality of the Application or Website to see how our users react to them.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            {/* GigExecs Brand */}
            <div className="md:col-span-1">
              <div className="text-2xl font-bold text-[#FACC15] mb-4">
                <span className="font-bold">Gig</span>Execs
              </div>
              <p className="text-gray-300 mb-4">
                The premier community connecting top professionals and innovative companies.
              </p>
            </div>

            {/* How it works */}
            <div>
              <h3 className="text-lg font-semibold mb-4">How it works</h3>
              <ul className="space-y-2">
                <li><a href="/how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>

            {/* Help & Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
              <ul className="space-y-2">
                <li><a href="/help" className="hover:text-white transition-colors">Help</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/data-privacy-policy" className="text-[#FACC15] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} GigExecs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
