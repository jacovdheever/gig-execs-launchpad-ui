import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { PageMeta } from '@/components/PageMeta'
import { MarketingNav } from '@/components/MarketingNav'
import { MarketingFooter } from '@/components/MarketingFooter'

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-[#1F2937] mb-4">{title}</h2>
      {children}
    </section>
  )
}

function TermsParagraph({ children }: { children: React.ReactNode }) {
  return <p className="text-[#6B7280] mb-4 leading-relaxed">{children}</p>
}

function TermsList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-2 mb-4 text-[#6B7280] ml-2">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="Terms of Service"
        description="Read the GigExecs Terms of Service governing use of our professional network, membership, profiles, opportunities, and platform services."
        path="/terms-and-conditions"
      />
      <MarketingNav />

      <section className="py-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="text-[#6B7280] hover:text-[#0284C7] transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-[#9CA3AF] mx-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[#1F2937] font-medium">Terms of Service</span>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#1F2937] mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-[#6B7280]">
            Last updated: 20 June 2026
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <TermsParagraph>
                  Please read these Terms of Service carefully before using our Service.
                </TermsParagraph>

                <TermsSection title="1. Introduction">
                  <TermsParagraph>
                    These Terms of Service (&quot;Terms&quot;) govern your access to and use of the GigExecs platform, website, content, services, resources and related offerings (collectively, the &quot;Service&quot;). GigExecs is operated by Perito Ventures LLC, a Delaware limited liability company (&quot;GigExecs&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                  </TermsParagraph>
                  <TermsParagraph>
                    By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you should not use the Service.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="2. Nature of the Service">
                  <TermsParagraph>
                    GigExecs is a curated professional network for experienced professionals. The platform enables members to:
                  </TermsParagraph>
                  <TermsList
                    items={[
                      'Create and maintain professional profiles',
                      'Build professional visibility and reputation',
                      'Access networking opportunities and community activities',
                      'Access professional insights, resources and educational content',
                      'Discover advisory, consulting, fractional, interim, project-based and other professional opportunities',
                    ]}
                  />
                  <TermsParagraph>
                    GigExecs is a professional network and community. GigExecs is not, and should not be construed as:
                  </TermsParagraph>
                  <TermsList
                    items={[
                      'An employer or prospective employer',
                      'A recruitment agency, executive search firm or staffing company',
                      'A brokerage service or marketplace operator',
                      'A party to any agreement, engagement or arrangement between users',
                    ]}
                  />
                  <TermsParagraph>
                    GigExecs has no involvement in, and accepts no responsibility for, any professional engagements, agreements or outcomes between users.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="3. Eligibility">
                  <TermsParagraph>To use the Service, you must:</TermsParagraph>
                  <TermsList
                    items={[
                      'Be at least 18 years of age',
                      'Have the legal capacity to enter into binding agreements',
                      'Provide accurate, complete and current information',
                      'Comply with these Terms and all applicable laws',
                    ]}
                  />
                  <TermsParagraph>
                    GigExecs reserves the right to refuse, suspend or terminate membership at its sole discretion, without notice or liability, including where eligibility criteria are not met or no longer satisfied.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="4. Membership and Accounts">
                  <TermsParagraph>You are solely responsible for:</TermsParagraph>
                  <TermsList
                    items={[
                      'Maintaining accurate and current account information',
                      'All activity occurring under your account',
                      'Keeping your login credentials secure and confidential',
                      'Notifying GigExecs immediately of any unauthorised access or security breach',
                    ]}
                  />
                  <TermsParagraph>
                    GigExecs may request additional information at any time to verify your identity, experience, credentials or professional background. Failure to provide such information in a timely manner may result in suspension or termination of your account.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="5. Membership Review and Vetting">
                  <TermsParagraph>
                    To maintain the quality and integrity of the network, GigExecs may review professional experience, areas of expertise, profile content, credentials, references and publicly available information.
                  </TermsParagraph>
                  <TermsParagraph>
                    Any review conducted by GigExecs is intended solely to support the quality of the network. Such review does not and shall not constitute:
                  </TermsParagraph>
                  <TermsList
                    items={[
                      'Certification, endorsement or validation of a member',
                      "Guarantee or warranty of a member's abilities, conduct, qualifications or suitability",
                      'Verification of the accuracy of information provided by a member',
                    ]}
                  />
                  <TermsParagraph>
                    Users remain solely responsible for conducting their own due diligence before entering into any professional relationship, engagement or agreement.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="6. Professional Relationships and Engagements">
                  <TermsParagraph>
                    GigExecs may facilitate introductions, communications and professional connections between users. GigExecs does not guarantee any opportunity, introduction, engagement, employment, project, revenue or business outcome.
                  </TermsParagraph>
                  <TermsParagraph>
                    Any discussions, negotiations, agreements or engagements entered into between users are solely between those users. GigExecs is not a party to any such agreement and accepts no liability in connection with it.
                  </TermsParagraph>
                  <TermsParagraph>Users are solely responsible for:</TermsParagraph>
                  <TermsList
                    items={[
                      'Evaluating the suitability of any professional opportunity or counterparty',
                      'Negotiating and entering into their own agreements',
                      'Performing their own due diligence on any engagement',
                      'Any disputes, losses or claims arising from any professional engagement',
                    ]}
                  />
                </TermsSection>

                <TermsSection title="7. Independent Status">
                  <TermsParagraph>
                    Professionals using GigExecs act solely as independent professionals. Nothing in these Terms or the Service creates or implies any employment relationship, partnership, joint venture, agency relationship or contractor relationship between a user and GigExecs.
                  </TermsParagraph>
                  <TermsParagraph>
                    Users remain solely responsible for their own taxes, regulatory compliance, professional licences, insurance, legal obligations and contractual obligations arising from any professional engagement.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="8. Opportunities Published on the Platform">
                  <TermsParagraph>
                    GigExecs may publish, share or communicate professional opportunities through the Service. GigExecs does not independently verify every opportunity and makes no representation or warranty regarding the accuracy, suitability, availability, legitimacy or commercial value of any opportunity.
                  </TermsParagraph>
                  <TermsParagraph>
                    Users are responsible for evaluating all opportunities independently. Any engagement entered into is solely between the relevant parties. GigExecs accepts no liability for any loss or damage arising from reliance on any opportunity published through the Service.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="9. Content and User Profiles">
                  <TermsParagraph>
                    You retain ownership of content you submit to GigExecs. By submitting content, you grant GigExecs a non-exclusive, worldwide, royalty-free, sublicensable licence to use, display, reproduce and distribute such content solely in connection with operating and promoting the Service.
                  </TermsParagraph>
                  <TermsParagraph>
                    You are solely responsible for the content you publish. You represent and warrant that your content does not infringe any third-party rights and that you have all necessary rights to submit it.
                  </TermsParagraph>
                  <TermsParagraph>You must not submit content that is:</TermsParagraph>
                  <TermsList
                    items={[
                      'False, misleading or inaccurate',
                      'Defamatory, discriminatory or harassing',
                      'Infringing of any intellectual property or other rights',
                      'Illegal or promoting illegal activity',
                      'Offensive, abusive or objectionable',
                      'Malicious, harmful or containing malware',
                    ]}
                  />
                  <TermsParagraph>
                    GigExecs reserves the right to remove any content at its sole discretion, without notice or liability.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="10. AI-Powered Features">
                  <TermsParagraph>
                    GigExecs may provide AI-assisted tools and features as part of the Service. Any content generated through AI-powered tools is provided for convenience only and does not constitute professional, legal, financial or other regulated advice.
                  </TermsParagraph>
                  <TermsParagraph>
                    Users remain solely responsible for reviewing, verifying, editing and approving all AI-generated content before publication or use. GigExecs makes no warranty regarding the accuracy, completeness, reliability or suitability of AI-generated content. Use of AI features is entirely at the user&apos;s own risk.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="11. Insights, Resources and Educational Content">
                  <TermsParagraph>
                    The Service may include articles, newsletters, reports, resources, webinars, educational materials and community discussions. All such content is provided for informational and educational purposes only.
                  </TermsParagraph>
                  <TermsParagraph>
                    Nothing on GigExecs constitutes legal, tax, financial, investment, employment or other professional advice. Users should seek qualified independent advice before making decisions based on any content available through the Service.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="12. Fees and Membership Plans">
                  <TermsParagraph>
                    GigExecs may offer free and paid membership tiers. Details of applicable fees, billing cycles and inclusions are set out on www.gigexecs.com and may be updated from time to time.
                  </TermsParagraph>
                  <TermsParagraph>Where a paid membership is purchased:</TermsParagraph>
                  <TermsList
                    items={[
                      'Fees are charged in advance for the applicable period',
                      'Fees are non-refundable except where required by applicable law',
                      'GigExecs reserves the right to change fees on reasonable notice',
                      'Continued use of a paid tier following a fee change constitutes acceptance of the new fee',
                    ]}
                  />
                  <TermsParagraph>
                    Payments are processed through third-party payment providers. GigExecs is not responsible for errors or failures attributable to those providers.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="13. Intellectual Property">
                  <TermsParagraph>
                    The GigExecs platform, branding, logos, content, software, technology and all related materials remain the exclusive property of GigExecs or its licensors and are protected by applicable intellectual property laws.
                  </TermsParagraph>
                  <TermsParagraph>
                    You may not copy, reproduce, modify, distribute, sell, sublicense or exploit any part of the Service without the prior written consent of GigExecs. Unauthorised use may give rise to claims for damages and may constitute a criminal offence.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="14. Third-Party Services">
                  <TermsParagraph>
                    GigExecs may integrate with or link to third-party services, platforms or tools, including payment providers, communication tools and social media platforms. GigExecs is not responsible for the availability, content, security, policies or actions of any third-party service.
                  </TermsParagraph>
                  <TermsParagraph>
                    Use of third-party services is subject to their own terms and policies. GigExecs accepts no liability for any loss or damage arising from your use of third-party services.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="15. Suspension and Termination">
                  <TermsParagraph>
                    GigExecs may suspend, restrict or terminate your access to the Service at any time, with or without notice, including where:
                  </TermsParagraph>
                  <TermsList
                    items={[
                      'You have breached these Terms',
                      'You have provided false, inaccurate or misleading information',
                      'Your conduct threatens the integrity, reputation or safety of the network or its members',
                      'GigExecs reasonably determines that continued access is not in the best interests of the community',
                      'GigExecs is required to do so by law or regulation',
                    ]}
                  />
                  <TermsParagraph>
                    Upon termination, all rights granted to you under these Terms will immediately cease. GigExecs shall not be liable to you or any third party for any suspension or termination of your account or access to the Service.
                  </TermsParagraph>
                  <TermsParagraph>
                    You may terminate your membership at any time by contacting GigExecs at{' '}
                    <a href="mailto:help@gigexecs.com" className="text-[#0284C7] hover:underline">help@gigexecs.com</a>.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="16. Disclaimer of Warranties">
                  <TermsParagraph>
                    The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis, without warranty of any kind. To the maximum extent permitted by applicable law, GigExecs expressly disclaims all warranties, express or implied, including but not limited to:
                  </TermsParagraph>
                  <TermsList
                    items={[
                      'Warranties of merchantability, fitness for a particular purpose or non-infringement',
                      'Warranties regarding the availability, accuracy, reliability or security of the Service',
                      'Warranties regarding results obtained through use of the Service',
                    ]}
                  />
                  <TermsParagraph>
                    GigExecs does not warrant that the Service will be uninterrupted, error-free or free from viruses or harmful components. Use of the Service is entirely at your own risk.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="17. Limitation of Liability">
                  <TermsParagraph>
                    To the maximum extent permitted by applicable law, GigExecs, Perito Ventures LLC, and their respective officers, members, employees, contractors and affiliates shall not be liable for any:
                  </TermsParagraph>
                  <TermsList
                    items={[
                      'Indirect, incidental, consequential, special or punitive damages',
                      'Loss of profits, revenue, data, goodwill or business opportunities',
                      'Damages arising from reliance on any content, opportunity or engagement facilitated through the Service',
                      'Damages arising from unauthorised access to or alteration of your account or data',
                    ]}
                  />
                  <TermsParagraph>
                    GigExecs&apos; total aggregate liability arising from or in connection with the Service, under any cause of action, shall not exceed the greater of: (a) the total fees paid by you to GigExecs in the twelve (12) months immediately preceding the event giving rise to the claim; or (b) USD 100.
                  </TermsParagraph>
                  <TermsParagraph>
                    Nothing in these Terms shall limit or exclude liability for fraud, fraudulent misrepresentation, death or personal injury caused by negligence, or any other liability that cannot be lawfully excluded.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="18. Indemnification">
                  <TermsParagraph>
                    You agree to indemnify, defend and hold harmless GigExecs, Perito Ventures LLC and their respective affiliates, officers, members, employees and contractors from and against any and all claims, damages, losses, liabilities, costs and expenses (including reasonable legal fees) arising from or relating to:
                  </TermsParagraph>
                  <TermsList
                    items={[
                      'Your use of or access to the Service',
                      'Content you submit, publish or transmit through the Service',
                      'Your professional activities, engagements or agreements with third parties',
                      'Your breach of these Terms or any applicable law or regulation',
                      'Any third-party claim arising from your conduct on the platform',
                    ]}
                  />
                </TermsSection>

                <TermsSection title="19. Data Protection and Privacy">
                  <TermsParagraph>
                    GigExecs collects, uses and stores personal information in accordance with its Privacy Policy, available at www.gigexecs.com. By using the Service, you consent to the collection and use of your information as described in the{' '}
                    <Link to="/data-privacy-policy" className="text-[#0284C7] hover:underline">Privacy Policy</Link>.
                  </TermsParagraph>
                  <TermsParagraph>
                    GigExecs implements reasonable technical and organisational measures to protect user data. However, no method of transmission or storage is completely secure. GigExecs cannot guarantee the absolute security of your information.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="20. Confidentiality">
                  <TermsParagraph>
                    In the course of using the Service, you may have access to confidential information belonging to other users, organisations or third parties. You agree not to disclose, use or exploit any such confidential information for any purpose other than as necessary in connection with your use of the Service.
                  </TermsParagraph>
                  <TermsParagraph>
                    This obligation of confidentiality shall survive termination of your membership and these Terms.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="21. Governing Law and Dispute Resolution">
                  <TermsParagraph>
                    These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States of America, without regard to its conflict of law principles.
                  </TermsParagraph>
                  <TermsParagraph>
                    Any dispute, claim or controversy arising from or in connection with these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of the State of Delaware. You irrevocably submit to such jurisdiction.
                  </TermsParagraph>
                  <TermsParagraph>
                    Before initiating any formal proceedings, you agree to contact GigExecs at{' '}
                    <a href="mailto:help@gigexecs.com" className="text-[#0284C7] hover:underline">help@gigexecs.com</a>{' '}
                    to attempt to resolve any dispute informally. GigExecs will use reasonable efforts to resolve any dispute within 30 days of receiving written notice.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="22. Severability and Waiver">
                  <TermsParagraph>
                    If any provision of these Terms is found to be unenforceable or invalid under applicable law, that provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.
                  </TermsParagraph>
                  <TermsParagraph>
                    No failure or delay by GigExecs in exercising any right under these Terms shall constitute a waiver of that right. No waiver of any breach shall be deemed a waiver of any subsequent breach.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="23. Entire Agreement">
                  <TermsParagraph>
                    These Terms, together with the Privacy Policy and any other policies or guidelines published by GigExecs, constitute the entire agreement between you and GigExecs with respect to the Service and supersede all prior or contemporaneous agreements, representations or understandings.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="24. Changes to These Terms">
                  <TermsParagraph>
                    GigExecs may update these Terms at any time. Where changes are material, GigExecs will provide reasonable notice, which may include notice by email or prominent notice on the Service, at least 14 days before the changes take effect.
                  </TermsParagraph>
                  <TermsParagraph>
                    Continued use of the Service following the effective date of any updated Terms constitutes your acceptance of the revised Terms. If you do not agree to the revised Terms, you should discontinue use of the Service before they take effect.
                  </TermsParagraph>
                </TermsSection>

                <TermsSection title="25. Contact">
                  <TermsParagraph>
                    <strong>GigExecs / Perito Ventures LLC</strong><br />
                    16192 Coastal Highway, Lewes, Delaware 19958, USA<br />
                    Email: <a href="mailto:help@gigexecs.com" className="text-[#0284C7] hover:underline">help@gigexecs.com</a><br />
                    Website: <a href="https://www.gigexecs.com" className="text-[#0284C7] hover:underline">www.gigexecs.com</a>
                  </TermsParagraph>
                  <p className="text-sm text-[#9CA3AF] mt-8">
                    &copy; 2026 Perito Ventures LLC trading as GigExecs. All rights reserved.
                  </p>
                </TermsSection>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
