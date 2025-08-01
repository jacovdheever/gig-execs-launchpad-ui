import React, { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const TermsAndConditions = () => {
  useEffect(() => {
    document.title = "Terms and Conditions | GigExecs"
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'GigExecs Terms and Conditions - Read our terms of service governing the use of our executive talent platform and professional networking services.')
    }
    return () => {
      document.title = "GigExecs - Executive Talent Platform"
    }
  }, [])

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "url('/background/Background.svg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}>
      <Header />
      
      {/* Breadcrumb */}
      <div style={{ 
        padding: "16px 80px", 
        background: "#012E46",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "16px",
          maxWidth: 1320,
          margin: "0 auto"
        }}>
          <a href="/" style={{ 
            color: "#CC9B0A", 
            textDecoration: "none", 
            fontSize: 14,
            fontWeight: 600
          }}>
            Home
          </a>
          <span style={{ color: "#666", fontSize: 14 }}>{'>'}</span>
          <span style={{ color: "white", fontSize: 14 }}>Terms and Conditions</span>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ padding: "40px 80px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          {/* Page Heading */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "16px", 
            marginBottom: "40px" 
          }}>
            <div style={{
              width: 24,
              height: 24,
              background: "linear-gradient(135deg, #4885AA 0%, #CC9B0A 50%, #FFFFFF 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                width: 8,
                height: 8,
                background: "#012E46",
                borderRadius: "50%"
              }}></div>
            </div>
            <h1 style={{ 
              color: "white", 
              fontSize: 40, 
              fontWeight: 600,
              margin: 0,
              fontFamily: "Montserrat, sans-serif"
            }}>
              Terms and Conditions
            </h1>
          </div>

          {/* Content Container */}
          <div style={{
            background: "linear-gradient(136deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.95) 100%)",
            border: "1px solid rgba(1, 46, 70, 0.2)",
            borderRadius: 24,
            padding: "48px",
            backdropFilter: "blur(10px)",
            color: "#012E46"
          }}>
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ 
                color: "#012E46", 
                fontSize: 24, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Last Updated: 3rd April 2024
              </h2>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "24px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Please read these terms of service carefully before using Our Service.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                1. Interpretation and Definitions
              </h3>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                1.1 Interpretation
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The words of which the initial letter is capitalised have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in the singular or in the plural.
              </p>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                1.2 Definitions
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                For the purposes of these Terms of Service:
              </p>
              <ul style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginLeft: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                <li style={{ marginBottom: "8px" }}><strong>"Account"</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Affiliate"</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for the election of directors or other managing authority.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Application"</strong> means the software program provided by the Company or Operator accessed by You on any electronic device, named GigExecs.com.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Buyer"</strong> refers to users of the Service who are placing Orders for Service.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Country"</strong> refers to United States of America, and Delaware where the company is registered.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Company"</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to www.GigExecs.com which is the trading name of Perito Ventures LLC, with address 16192 Coastal Highway, in the city of Lewes, County of Sussex, State of Delaware 19958, under our registered agent Harvard Business Services, Inc.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Content"</strong> refers to content such as text, images, or other information that can be posted, uploaded, linked to, or otherwise made available by You, regardless of the form of that content.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Clients"</strong> refers to blue-chip companies, small and medium-sized enterprises, government institutions, non-profits, startups, or entrepreneurs seeking to hire experienced and senior professionals through our platform.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Device"</strong> means any device that can access the Service such as a computer, a cell phone, or a digital tablet.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Feedback"</strong> means feedback, innovations, or suggestions sent by You regarding the attributes, performance, or features of our Service.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Good"</strong> refers to the items or services offered for sale, or any other means of trading on the Service.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Order"</strong> means a request by a Client to purchase or trade by any means Goods on the Application or Website.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Professionals"</strong> encompasses highly experienced and senior: freelancers, independent consultants, independent advisors, fractional service providers, and other types of workers offering their services through flexible work models (non full-time employment), with a minimum of 15 years of total professional experience.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Seller"</strong> refers to users of the Service who are listing Services and making them available for trade by any means.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Service"</strong> refers to the Application or the Website or both.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Terms of Service"</strong> (also referred to as "Terms") mean these Terms of Service that form the entire agreement between You and the Company or Operator regarding the use of the Service.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Third-party Social Media Service"</strong> means any services or content (including data, information, products, or services) provided by a third party that may be displayed, included, or made available by the Service.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Website"</strong> refers to GigExecs, accessible from www.gigexecs.com.</li>
                <li style={{ marginBottom: "8px" }}><strong>"You"</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
              </ul>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                2. Contact Us
              </h3>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                If you have any questions about these Terms of Service, You can contact us:
              </p>
              <ul style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginLeft: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                <li style={{ marginBottom: "8px" }}>By email: help@gigexecs.com</li>
                <li style={{ marginBottom: "8px" }}>By visiting our website: www.gigexecs.com</li>
              </ul>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                3. Acknowledgment
              </h3>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                These are the Terms of Service governing the use of this Service and the agreement that operates between You and the Company. These Terms of Service set out the rights and obligations of all users regarding the use of the Service.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms of Service. These Terms of Service apply to all visitors, users, and others who access or use the Service.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                By accessing or using the Service You agree to be bound by these Terms of Service. If You disagree with any part of these Terms of Service then You may not access the Service.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                You represent that you are over the age of majority according to the laws of your country or the Country, whichever is higher. The Company or Operator does not permit those under that age to use the Service.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company or Operator. Our Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your personal information when You use the Application or Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                4. Purpose of GigExecs
              </h3>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The GigExecs platform is as an online on-demand marketplace where highly experienced and senior professionals ("Professionals") collaborate with "Clients" on project-based tasks, typically completed over short term periods instead of full-time employment. At GigExecs, our role is strictly facilitative; we do not directly engage in your negotiations or supervise the provision of services by users to their clients, nor are we party to any agreements you may enter into with other users.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                You are exclusively accountable for the content you publish on GigExecs and for your agreements with other users, including the vetting process and adherence to the terms of those agreements.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                5. Governing Law
              </h3>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The laws of the United States of America, excluding its conflicts of law rules, shall govern these Terms and Your use of the Service. Your use of the Application or Website may also be subject to other local, state, national, or international laws.
              </p>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                5.1 For European Union (EU) Users
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident.
              </p>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                5.2 United States Legal Compliance
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                6. User Accounts
              </h3>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                6.1 Account Creation
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                When You create an account with Us, You must provide Us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than You without appropriate authorisation, or a name that is otherwise offensive, vulgar or obscene.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                7. Content
              </h3>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                7.1 Your Right to Post Content
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Our Service allows You to post Content. You are responsible for the Content that You post to the Service, including its legality, reliability, and appropriateness.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                By posting Content to the Service, You grant Us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of Your rights to any Content You submit, post, or display on or through the Service and You are responsible for protecting those rights. You agree that this license includes the right for Us to make Your Content available to other users of the Service, who may also use Your Content subject to these Terms.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                8. Orders of Services
              </h3>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                By placing an Order for Services through the platform, You warrant that You are legally capable of entering into binding contracts.
              </p>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                8.1 Position of GigExecs in Services
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The role of GigExecs.com is strictly of a facilitator between users of our platform, more specifically "Professionals and "Clients". We are, therefore, not a party to any agreement between both, which limits Our liabilities in any disputes between them.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                9. Disclaimer of Warranties and Limitation of Liability
              </h3>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                9.1 Limitation of Liability
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                To the maximum extent permitted by applicable law, in no event shall the Company or Operator or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or Operator or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                10. Intellectual Property of the Service
              </h3>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The Service and its original content (excluding Content provided by You or other users), features, and functionality are and will remain the exclusive property of the Company or Operator and its licensors.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Company.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 20, 
                fontWeight: 600,
                marginBottom: "16px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                11. Changes to these Terms of Service
              </h3>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Application or Website and the Service.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TermsAndConditions 