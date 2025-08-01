import React, { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const DataPrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Data Privacy Policy | GigExecs"
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'GigExecs Data Privacy Policy - Learn how we protect and handle your personal information in accordance with data protection regulations.')
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
          <span style={{ color: "white", fontSize: 14 }}>Data Privacy Policy</span>
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
              Data Privacy Policy
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
                Last Updated: 9th of April 2024
              </h2>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "24px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service, and tells You about Your privacy rights and how the law protects You.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Please read this Privacy Policy carefully before using Our Service.
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
                Interpretation
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
                Definitions
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                For the purposes of this Privacy Policy:
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
                <li style={{ marginBottom: "8px" }}><strong>"Website"</strong> refers to GigExecs.com, accessible from www.gigexecs.com.</li>
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
                3. Collecting and Using Your Personal Data
              </h3>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Types of Data Collected
              </h4>
              <h5 style={{ 
                color: "#012E46", 
                fontSize: 16, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Personal Data
              </h5>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
              </p>
              <ul style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginLeft: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                <li style={{ marginBottom: "8px" }}>Email address</li>
                <li style={{ marginBottom: "8px" }}>First name and last name</li>
                <li style={{ marginBottom: "8px" }}>Phone number</li>
                <li style={{ marginBottom: "8px" }}>Address, State, Province, ZIP/Postal code, City</li>
                <li style={{ marginBottom: "8px" }}>Bank account information</li>
                <li style={{ marginBottom: "8px" }}>Credit card number and expiration date</li>
              </ul>
              <h5 style={{ 
                color: "#012E46", 
                fontSize: 16, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Usage Data
              </h5>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Usage Data is collected automatically when using the Service.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Information from Third-Party Social Media Services
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The Company or Operator may allow You to create an account and log in to use the Service through the following Third-party Social Media Services. These Third-party Social Media Services, may include, but is not limited to:
              </p>
              <ul style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginLeft: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                <li style={{ marginBottom: "8px" }}>Google</li>
                <li style={{ marginBottom: "8px" }}>Facebook</li>
                <li style={{ marginBottom: "8px" }}>Twitter</li>
                <li style={{ marginBottom: "8px" }}>Linkedin</li>
              </ul>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Tracking Technologies and Cookies
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyse Our Service. The technologies We use may include:
              </p>
              <ul style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginLeft: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                <li style={{ marginBottom: "8px" }}><strong>"Cookies or Browser Cookies."</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Web Beacons."</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company or Operator, for example, to count users who have visited those pages or opened an email and for other related application or website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li>
              </ul>
              <h5 style={{ 
                color: "#012E46", 
                fontSize: 16, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Types of Cookies We Use
              </h5>
              <ul style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginLeft: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                <li style={{ marginBottom: "8px" }}><strong>"Necessary / Essential Cookies"</strong><br />
                Type: Session Cookies<br />
                Administered by: Us<br />
                Purpose: These Cookies are essential to provide You with services available through the Application or Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Cookies Policy / Notice Acceptance Cookies"</strong><br />
                Type: Persistent Cookies<br />
                Administered by: Us<br />
                Purpose: These Cookies identify if users have accepted the use of cookies on the Application or Website.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Functionality Cookies"</strong><br />
                Type: Persistent Cookies<br />
                Administered by: Us<br />
                Purpose: These Cookies allow us to remember choices You make when You use the Application or Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Application or Website.</li>
                <li style={{ marginBottom: "8px" }}><strong>"Tracking and Performance Cookies"</strong><br />
                Type: Persistent Cookies<br />
                Administered by: Third-Parties<br />
                Purpose: These Cookies are used to track information about traffic to the Application or Website and how users use the Application or Website. The information gathered via these Cookies may directly or indirectly identify you as an individual visitor. This is because the information collected is typically linked to a pseudonymous identifier associated with the device you use to access the Application or Website. We may also use these Cookies to test new pages, features or new functionality of the Application or Website to see how our users react to them.</li>
              </ul>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Use of Your Personal Data
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The Company may use Personal Data for the following purposes:
              </p>
              <ul style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginLeft: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                <li style={{ marginBottom: "8px" }}><strong>"To provide and maintain our Service"</strong>, including to monitor the usage of our Service.</li>
                <li style={{ marginBottom: "8px" }}><strong>"To manage Your Account:"</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
                <li style={{ marginBottom: "8px" }}><strong>"For the performance of a contract:"</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
                <li style={{ marginBottom: "8px" }}><strong>"To contact You:"</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
                <li style={{ marginBottom: "8px" }}><strong>"To provide You"</strong> with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</li>
                <li style={{ marginBottom: "8px" }}><strong>"To manage Your requests:"</strong> To attend and manage Your requests to Us.</li>
                <li style={{ marginBottom: "8px" }}><strong>"To deliver targeted advertising to You":</strong> We may use Your information to develop and display content and advertising (and work with third-party vendors who do so) tailored to Your interests and/or location and to measure its effectiveness.</li>
                <li style={{ marginBottom: "8px" }}><strong>"For business transfers:"</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganisation, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</li>
                <li style={{ marginBottom: "8px" }}><strong>"For other purposes":</strong> We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</li>
              </ul>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Retention of Your Personal Data
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The Company or Operator will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The Company or Operator will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                When Your Personal Data is no longer required by law or rights or obligations by Us or You, We will delete the Personal Data. In most cases, Personal Data will be deleted upon termination or expiry of the agreement between You and the Company or upon Your written request.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Transfer of Your Personal Data
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Your information, including Personal Data, is processed at the Company's operating office(s) and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers (i.e. Cloud) located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from Your jurisdiction.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organisation or a country unless there are adequate controls in place including the security of Your data and other personal information.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Delete Your Personal Data
              </h4>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You - help@gigexecs.com.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Our Service may give You the ability to delete certain information about You from within the Service.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.
              </p>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Disclosure of Your Personal Data
              </h4>
              <h5 style={{ 
                color: "#012E46", 
                fontSize: 16, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Business Transactions
              </h5>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.
              </p>
              <h5 style={{ 
                color: "#012E46", 
                fontSize: 16, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Law enforcement
              </h5>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).
              </p>
              <h5 style={{ 
                color: "#012E46", 
                fontSize: 16, 
                fontWeight: 600,
                marginBottom: "12px",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Other legal requirements
              </h5>
              <p style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                The Company or Operator may disclose Your Personal Data in the good faith belief that such action is necessary to:
              </p>
              <ul style={{ 
                fontSize: 16, 
                lineHeight: "24px",
                marginLeft: "24px",
                marginBottom: "16px",
                fontFamily: "Open Sans, sans-serif"
              }}>
                <li style={{ marginBottom: "8px" }}>Comply with a legal obligation</li>
                <li style={{ marginBottom: "8px" }}>Protect and defend the rights or property of the Company</li>
                <li style={{ marginBottom: "8px" }}>Prevent or investigate possible wrongdoing in connection with the Service</li>
                <li style={{ marginBottom: "8px" }}>Protect the personal safety of Users of the Service or the public</li>
                <li style={{ marginBottom: "8px" }}>Protect against legal liability</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DataPrivacyPolicy 