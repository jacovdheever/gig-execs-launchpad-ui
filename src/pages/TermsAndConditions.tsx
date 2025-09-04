import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsOfService() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // SEO Metadata
  useEffect(() => {
    document.title = "Terms of Service | GigExecs"
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', "Read GigExecs Terms of Service. Learn about our platform rules, user responsibilities, and service agreements for our freelance marketplace.")
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = "Read GigExecs Terms of Service. Learn about our platform rules, user responsibilities, and service agreements for our freelance marketplace."
      document.head.appendChild(newMetaDescription)
    }

    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', "https://www.gigexecs.com/terms-of-service")
    } else {
      const newCanonical = document.createElement('link')
      newCanonical.rel = 'canonical'
      newCanonical.href = "https://www.gigexecs.com/terms-of-service"
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
                <span className="text-[#1F2937] font-medium">Terms of Service</span>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#1F2937] mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-[#6B7280]">
            Last updated: 3rd April 2024
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-[#6B7280] mb-8">
                Please read these terms of service carefully before using Our Service.
              </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">1. Interpretation and Definitions</h2>
                
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">1.1 Interpretation</h3>
                <p className="text-[#6B7280] mb-4">
                The words of which the initial letter is capitalised have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in the singular or in the plural.
              </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">1.2 Definitions</h3>
                <p className="text-[#6B7280] mb-4">
                For the purposes of these Terms of Service:
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
                  <li><strong>"Website"</strong> refers to GigExecs, accessible from www.gigexecs.com.</li>
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

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">3. Acknowledgment</h2>
                <p className="text-[#6B7280] mb-4">
                These are the Terms of Service governing the use of this Service and the agreement that operates between You and the Company. These Terms of Service set out the rights and obligations of all users regarding the use of the Service.
              </p>
                <p className="text-[#6B7280] mb-4">
                Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms of Service. These Terms of Service apply to all visitors, users, and others who access or use the Service.
              </p>
                <p className="text-[#6B7280] mb-4">
                By accessing or using the Service You agree to be bound by these Terms of Service. If You disagree with any part of these Terms of Service then You may not access the Service.
              </p>
                <p className="text-[#6B7280] mb-4">
                You represent that you are over the age of majority according to the laws of your country or the Country, whichever is higher. The Company or Operator does not permit those under that age to use the Service.
              </p>
                <p className="text-[#6B7280] mb-6">
                Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company or Operator. Our Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your personal information when You use the Application or Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.
              </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">4. Purpose of GigExecs</h2>
                <p className="text-[#6B7280] mb-4">
                The GigExecs platform is as an online on-demand marketplace where highly experienced and senior professionals ("Professionals") collaborate with "Clients" on project-based tasks, typically completed over short term periods instead of full-time employment. At GigExecs, our role is strictly facilitative; we do not directly engage in your negotiations or supervise the provision of services by users to their clients, nor are we party to any agreements you may enter into with other users.
              </p>
                <p className="text-[#6B7280] mb-6">
                You are exclusively accountable for the content you publish on GigExecs and for your agreements with other users, including the vetting process and adherence to the terms of those agreements.
              </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">5. Governing Law</h2>
                <p className="text-[#6B7280] mb-4">
                The laws of the United States of America, excluding its conflicts of law rules, shall govern these Terms and Your use of the Service. Your use of the Application or Website may also be subject to other local, state, national, or international laws.
              </p>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">5.1 For European Union (EU) Users</h3>
                <p className="text-[#6B7280] mb-4">
                If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident.
              </p>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">5.2 United States Legal Compliance</h3>
                <p className="text-[#6B7280] mb-4">
                You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.
              </p>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">5.3 Severability</h3>
                <p className="text-[#6B7280] mb-4">
                  If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force, and effect.
                </p>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">5.4 Waiver</h3>
                <p className="text-[#6B7280] mb-6">
                  Except as provided herein, the failure to exercise a right or to require the performance of an obligation under these Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.
                </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">6. User Accounts</h2>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">6.1 Account Creation</h3>
                <p className="text-[#6B7280] mb-4">
                When You create an account with Us, You must provide Us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
              </p>
                <p className="text-[#6B7280] mb-4">
                You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than You without appropriate authorisation, or a name that is otherwise offensive, vulgar or obscene.
              </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">6.2 Account Information</h3>
                <p className="text-[#6B7280] mb-4">
                  You may be asked to supply certain information relevant to Your Account including, without limitation, Your name, Your email, Your phone number, and Your address.
                </p>
                <p className="text-[#6B7280] mb-4">
                  You may have to provide documents to comply with identity verification.
                </p>
                <p className="text-[#6B7280] mb-4">
                  Before or during posting services, you may be asked to supply, without limitation, payment details, and Your identity documents for proof verification.
                </p>
                <p className="text-[#6B7280] mb-4">
                  Before or during placing an Order, you may be asked to supply, without limitation, Your credit card number, the expiration date of Your credit card, Your billing address, and other relevant information.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">6.3 Account Review</h3>
                <p className="text-[#6B7280] mb-4">
                  As part of our vetting process for new users in our platform and to protect the quality of our community, we perform basic checks to confirm the identity of the users, professional track record and the skills and expertise on offer. We do not accept however any responsibility for the reliability, accuracy, and completeness of any information provided by users.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">6.4 Account Password</h3>
                <p className="text-[#6B7280] mb-4">
                  You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password, whether Your password is with Our Service or a Third-Party Social Media Service.
                </p>
                <p className="text-[#6B7280] mb-4">
                  You agree not to disclose Your password to any third party. You must notify Us immediately upon becoming aware of any breach of security or unauthorised use of Your account.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">6.5 Account Termination</h3>
                <p className="text-[#6B7280] mb-4">
                  We may terminate or suspend Your Account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms of Service. Upon termination, Your right to use the Service will cease immediately.
                </p>
                <p className="text-[#6B7280] mb-6">
                  If You wish to terminate Your Account, You may simply discontinue using the Service or contact Us for help to delete your account.
                </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">7. Content</h2>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">7.1 Your Right to Post Content</h3>
                <p className="text-[#6B7280] mb-4">
                Our Service allows You to post Content. You are responsible for the Content that You post to the Service, including its legality, reliability, and appropriateness.
              </p>
                <p className="text-[#6B7280] mb-4">
                By posting Content to the Service, You grant Us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of Your rights to any Content You submit, post, or display on or through the Service and You are responsible for protecting those rights. You agree that this license includes the right for Us to make Your Content available to other users of the Service, who may also use Your Content subject to these Terms.
              </p>
                <p className="text-[#6B7280] mb-4">
                  You represent and warrant that: (i) the Content is Yours (You own it) or You have the right to use it and grant Us the rights and license as provided in these Terms, and (ii) the posting of Your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">7.2 Content Restrictions</h3>
                <p className="text-[#6B7280] mb-4">
                  The Company is not responsible for the content of the Service's users. You expressly understand and agree that You are solely responsible for the Content and for all activity that occurs under your account, whether done so by You or any third person using Your account.
                </p>
                <p className="text-[#6B7280] mb-4">
                  You may not transmit any Content that is unlawful, offensive, upsetting, intended to disgust, threatening, libellous, defamatory, obscene, or otherwise objectionable. Examples of such objectionable Content include, but are not limited to, the following:
                </p>
                <ol className="list-decimal list-inside space-y-2 mb-4 text-[#6B7280] ml-4">
                  <li>Unlawful or promoting unlawful activity.</li>
                  <li>Defamatory, discriminatory, or mean-spirited content, including references or commentary about religion, race, sexual orientation, gender, national/ethnic origin, or other targeted groups.</li>
                  <li>Spam, machine, or randomly–generated, constituting unauthorised or unsolicited advertising, chain letters, any other form of unauthorised solicitation, or any form of lottery or gambling.</li>
                  <li>Containing or installing any viruses, worms, malware, trojan horses, or other content that is designed or intended to disrupt, damage, or limit the functioning of any software, hardware, or telecommunications equipment or to damage or obtain unauthorised access to any data or other information of a third person.</li>
                  <li>Infringing on any proprietary rights of any party, including patent, trademark, trade secret, copyright, right of publicity, or other rights.</li>
                  <li>Impersonating any person or entity including the Company or Operator and its employees or representatives.</li>
                  <li>Violating the privacy of any third person.</li>
                  <li>False information and features.</li>
                </ol>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">7.3 Content Backups</h3>
                <p className="text-[#6B7280] mb-4">
                  Although regular backups of Content are performed, the Company does not guarantee there will be no loss or corruption of data.
                </p>
                <p className="text-[#6B7280] mb-4">
                  Corrupt or invalid backup points may be caused by, without limitation, Content that is corrupted prior to being backed up or that changes during the time a backup is performed.
                </p>
                <p className="text-[#6B7280] mb-4">
                  The Company will provide support and attempt to troubleshoot any known or discovered issues that may affect the backups of Content. But You acknowledge that the Company has no liability related to the integrity of Content or the failure to successfully restore Content to a usable state.
                </p>
                <p className="text-[#6B7280] mb-6">
                  You agree to maintain a complete and accurate copy of any Content in a location independent of the Service.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">7.4 Intellectual Property of Others and Copyright Infringement</h3>
                <p className="text-[#6B7280] mb-4">
                  We respect the intellectual property and copyrights of others. You may be held accountable for damages (including costs and attorneys' fees) for misrepresenting that any Content is infringing Your copyright. It is Our policy to respond to any claim that Content posted on the Service infringes a copyright or other intellectual property infringement of any person.
                </p>
                <p className="text-[#6B7280] mb-4">
                  We are ready to comply with local regulations in that matter.
                </p>
                <p className="text-[#6B7280] mb-4">
                  If You are a copyright owner or authorised on behalf of one, and You believe that the copyrighted work has been copied in a way that constitutes copyright infringement that is taking place through the Service, You must submit Your notice in writing to the attention of our copyright agent via email (see 2 - Contact Us) and include in Your notice the following information related to the alleged infringement:
                </p>
                <ol className="list-decimal list-inside space-y-2 mb-6 text-[#6B7280] ml-4">
                  <li>An electronic or physical signature of the person authorised to act on behalf of the owner of the copyright's interest.</li>
                  <li>A description of the copyrighted work that You claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work.</li>
                  <li>Identification of the URL or other specific location on the Service where the material that You claim is infringing is located.</li>
                  <li>Your address, telephone number, and email address.</li>
                  <li>A statement by You that You have a good faith belief that the disputed use is not authorised by the copyright owner, its agent, or the law.</li>
                  <li>A statement by You, made under penalty of perjury, that the above information in Your notice is accurate and that You are the copyright owner or authorised to act on the copyright owner's behalf.</li>
                </ol>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">8. Orders of Services</h2>
                <p className="text-[#6B7280] mb-4">
                By placing an Order for Services through the platform, You warrant that You are legally capable of entering into binding contracts.
              </p>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">8.1 Position of GigExecs in Services</h3>
                <p className="text-[#6B7280] mb-4">
                The role of GigExecs.com is strictly of a facilitator between users of our platform, more specifically "Professionals and "Clients". We are, therefore, not a party to any agreement between both, which limits Our liabilities in any disputes between them.
              </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">8.2 Your Information as Buyer</h3>
                <p className="text-[#6B7280] mb-4">
                  If You wish to place an Order for services, You may be asked to supply certain information relevant to Your Order including, without limitation, Your name, Your email, Your phone number, Your credit card number, the expiration date of Your credit card, Your billing address, and other relevant information.
                </p>
                <p className="text-[#6B7280] mb-4">
                  You represent and warrant that: (i) You have the legal right to use any credit or debit card(s) or other payment method(s) in connection with any Order; and that (ii) the information You supply to us is true, correct, and complete.
                </p>
                <p className="text-[#6B7280] mb-4">
                  By submitting such information, You grant us the right to provide the information to payment processing third parties for purposes of facilitating the completion of Your Order.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">8.3 Availability, Errors, and Inaccuracies</h3>
                <p className="text-[#6B7280] mb-4">
                  We and our platform Sellers are constantly updating the offerings of Services. The Services available may be mispriced, described inaccurately, or unavailable, and Sellers and We may experience delays in updating information regarding the Services in Our advertising on other websites.
                </p>
                <p className="text-[#6B7280] mb-4">
                  We and Sellers cannot and do not guarantee the accuracy or completeness of any information, including prices, product images, specifications, availability, and services. We reserve the right to change or update information and to correct errors, inaccuracies, or omissions at any time without prior notice.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">8.4 Prices Policy</h3>
                <p className="text-[#6B7280] mb-4">
                  The Company reserves the right to revise their prices or fees at any time. For updated information about pricing please consult our website www.gigexecs.com.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">8.5 Payments</h3>
                <p className="text-[#6B7280] mb-4">
                  Payments in our Platform can be made through Stripe (www.stripe.com), we rely on in this payment gateway that have their own terms of service and their own limitations. We may add in the future other payment gateways (e.g PayPal) to the platform.
                </p>
                <p className="text-[#6B7280] mb-4">
                  Payment cards (credit cards or debit cards) are subject to validation checks and authorisation by Your card issuer. If we do not receive the required authorisation, We will not be liable for any delay or non-delivery of Your Order.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">8.6 Service Fees</h3>
                <p className="text-[#6B7280] mb-4">
                  We may charge You fees (and applicable Taxes) for the right to use the Service. More information about when service fees apply and how they are calculated are available in our website www.gigexecs.com; We reserve the right to change the service fees at any time.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">8.7 Order Modification</h3>
                <p className="text-[#6B7280] mb-4">
                  You as a user of our service, are responsible for any Order modifications you agree to make via the Service and agree to pay any additional amounts, fees, or taxes associated with any Order modification. Our role is purely of a facilitator between "Clients" and "Professionals".
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">8.8 Order Cancellation</h3>
                <h4 className="text-lg font-semibold text-[#1F2937] mb-3">8.8.1 Our Order Cancellation Rights</h4>
                <p className="text-[#6B7280] mb-4">
                  We reserve the right to refuse or cancel Your Order at any time for certain reasons including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-[#6B7280] ml-4">
                  <li>Service availability</li>
                  <li>Errors in the description or prices for Services</li>
                  <li>Errors in Your Order</li>
                </ul>
                <h4 className="text-lg font-semibold text-[#1F2937] mb-3">8.8.2 Order Cancellation by Buyers</h4>
                <p className="text-[#6B7280] mb-4">
                  If You as a Buyer cancel an Order, the amount You paid (including the Service fees) is not refunded.
                </p>
                <p className="text-[#6B7280] mb-4">
                  If something outside Your control requires You to cancel an Order, or if You think your Order should be refunded, contact Us on help@gigexecs.com.
                </p>
                <h4 className="text-lg font-semibold text-[#1F2937] mb-3">8.8.3 Order Cancellation by Sellers</h4>
                <p className="text-[#6B7280] mb-4">
                  If You as a Seller cancel an Order before any service has been provided, the amount the Buyer paid (including the Service fees) will be refunded to the Buyer and will not be transferred to the Seller. We reserve the right to charge cancellation fees, for more information about fees consult our website on www.gigexecs.com.
                </p>
                <p className="text-[#6B7280] mb-6">
                  If something outside Your control requires You to cancel an Order, or if You think your Order should be refunded, contact Us on help@gigexecs.com.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">8.9 Order Dispute</h3>
                <p className="text-[#6B7280] mb-6">
                  If a Buyer or a Seller disputes an Order, the Company should be notified by email via help@gigexecs.com. Buyer and Seller should pursue all options to settle the dispute in an amicable matter. If not possible, the dispute will be resolved at Our sole discretion and based on our own independent interpretation of the facts.
                </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">9. Disclaimer of Warranties and Limitation of Liability</h2>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">9.1 Limitation of Liability</h3>
                <p className="text-[#6B7280] mb-4">
                Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service.
              </p>
                <p className="text-[#6B7280] mb-4">
                To the maximum extent permitted by applicable law, in no event shall the Company or Operator or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or Operator or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
              </p>
                <p className="text-[#6B7280] mb-4">
                  Some jurisdictions do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these jurisdictions, each party's liability will be limited to the greatest extent permitted by law.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">9.2 "AS IS" and "AS AVAILABLE" Disclaimer</h3>
                <p className="text-[#6B7280] mb-4">
                  The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory, or otherwise, with respect to the Service, including all implied warranties. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems, or services, operate without interruption, meet any performance or reliability standards or be error-free or that any errors or defects can or will be corrected.
                </p>
                <p className="text-[#6B7280] mb-4">
                  Without limiting the foregoing, neither the Company nor any of the company's providers makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company or Operator are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.
                </p>
                <p className="text-[#6B7280] mb-6">
                  Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">9.3 Links to Other Websites</h3>
                <p className="text-[#6B7280] mb-4">
                  Our Service may contain links to third-party websites or services that are not owned or controlled by the Company.
                </p>
                <p className="text-[#6B7280] mb-4">
                  The Company has no control over and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such web sites or services.
                </p>
                <p className="text-[#6B7280] mb-6">
                  We strongly advise You to read the terms of service and privacy policies of any third-party websites or services that You visit.
                </p>

                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">9.4 Translation Interpretation</h3>
                <p className="text-[#6B7280] mb-6">
                  These Terms of Service may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.
                </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">10. Disputes Resolution about the Service</h2>
                <p className="text-[#6B7280] mb-6">
                  If You have any concerns or disputes about the Service, You agree to first try to resolve the dispute informally by contacting the Company.
                </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">11. Intellectual Property of the Service</h2>
                <p className="text-[#6B7280] mb-4">
                The Service and its original content (excluding Content provided by You or other users), features, and functionality are and will remain the exclusive property of the Company or Operator and its licensors.
              </p>
                <p className="text-[#6B7280] mb-4">
                The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.
              </p>
                <p className="text-[#6B7280] mb-6">
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Company.
              </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">12. Your feedback to Us</h2>
                <p className="text-[#6B7280] mb-6">
                  You assign all rights, title, and interest in any Feedback You provide the Company. If for any reason such assignment is ineffective, You agree to grant the Company a non-exclusive, perpetual, irrevocable, royalty-free, worldwide right and license to use, reproduce, disclose, sub-license, distribute, modify and exploit such Feedback without restriction.
                </p>

                <h2 className="text-2xl font-bold text-[#1F2937] mb-4">13. Changes to these Terms of Service</h2>
                <p className="text-[#6B7280] mb-4">
                We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
              </p>
                <p className="text-[#6B7280] mb-6">
                By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Application or Website and the Service.
                </p>
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
                The premier freelance hub for top professionals and innovative companies.
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
                <li><a href="/terms-and-conditions" className="text-[#FACC15] transition-colors">Terms of Service</a></li>
                <li><a href="/data-privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
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
