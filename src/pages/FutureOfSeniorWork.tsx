import React, { useEffect } from "react"
import Header from "../components/Header"

const FutureOfSeniorWork = () => {
  useEffect(() => {
    // Update document title
    document.title = "The Future of Senior Work: Flexibility and Freelance Opportunities | GigExecs"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore the future of senior work through flexible models, freelancing opportunities, and how experienced professionals can thrive in the evolving workforce landscape.')
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = 'Explore the future of senior work through flexible models, freelancing opportunities, and how experienced professionals can thrive in the evolving workforce landscape.'
      document.head.appendChild(newMetaDescription)
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'Flexible work for senior professionals, Freelancing after 50, Senior talent gig economy, Senior consulting opportunities, Project-based work for experienced professionals, Benefits of flexible work models, GigExecs senior talent platform, Navigating ageism in the workforce, Senior professionals and the future of work, Short-term contracts for experienced professionals')
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = 'Flexible work for senior professionals, Freelancing after 50, Senior talent gig economy, Senior consulting opportunities, Project-based work for experienced professionals, Benefits of flexible work models, GigExecs senior talent platform, Navigating ageism in the workforce, Senior professionals and the future of work, Short-term contracts for experienced professionals'
      document.head.appendChild(newMetaKeywords)
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', 'The Future of Senior Work: Flexibility and Freelance Opportunities | GigExecs')
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.setAttribute('content', 'The Future of Senior Work: Flexibility and Freelance Opportunities | GigExecs')
      document.head.appendChild(newOgTitle)
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Explore the future of senior work through flexible models, freelancing opportunities, and how experienced professionals can thrive in the evolving workforce landscape.')
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.setAttribute('content', 'Explore the future of senior work through flexible models, freelancing opportunities, and how experienced professionals can thrive in the evolving workforce landscape.')
      document.head.appendChild(newOgDescription)
    }
    
    const ogType = document.querySelector('meta[property="og:type"]')
    if (ogType) {
      ogType.setAttribute('content', 'article')
    } else {
      const newOgType = document.createElement('meta')
      newOgType.setAttribute('property', 'og:type')
      newOgType.setAttribute('content', 'article')
      document.head.appendChild(newOgType)
    }
    
    // Update Twitter Card tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]')
    if (twitterCard) {
      twitterCard.setAttribute('content', 'summary_large_image')
    } else {
      const newTwitterCard = document.createElement('meta')
      newTwitterCard.name = 'twitter:card'
      newTwitterCard.content = 'summary_large_image'
      document.head.appendChild(newTwitterCard)
    }
    
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'The Future of Senior Work: Flexibility and Freelance Opportunities | GigExecs')
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = 'The Future of Senior Work: Flexibility and Freelance Opportunities | GigExecs'
      document.head.appendChild(newTwitterTitle)
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Explore the future of senior work through flexible models, freelancing opportunities, and how experienced professionals can thrive in the evolving workforce landscape.')
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = 'Explore the future of senior work through flexible models, freelancing opportunities, and how experienced professionals can thrive in the evolving workforce landscape.'
      document.head.appendChild(newTwitterDescription)
    }
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = "GigExecs - Executive Talent Platform"
    }
  }, [])
  return (
    <div style={{
      background: `url('/background/BlogBackground.svg') center center no-repeat`,
      backgroundSize: "cover",
      minHeight: "100vh"
    }}>
      <Header />
      
      {/* Breadcrumbs */}
      <section style={{ padding: "20px 80px 0 80px" }}>
        <div style={{ 
          display: "flex", 
          height: 32, 
          padding: "0 80px", 
          alignItems: "center", 
          gap: 16, 
          alignSelf: "stretch",
          marginBottom: 20
        }}>
          <span style={{ 
            color: "#CC9B0A", 
            fontSize: 14, 
            fontFamily: "Montserrat, sans-serif", 
            fontWeight: 600 
          }}>
            Home
          </span>
          <span style={{ color: "white", fontSize: 14 }}>{'>'}</span>
          <a href="/blog" style={{ 
            color: "#CC9B0A", 
            fontSize: 14, 
            fontFamily: "Montserrat, sans-serif", 
            fontWeight: 600,
            textDecoration: "none",
            cursor: "pointer"
          }}>
            Blog
          </a>
          <span style={{ color: "white", fontSize: 14 }}>{'>'}</span>
          <span style={{ 
            color: "#ffffff", 
            fontSize: 14, 
            fontFamily: "Montserrat, sans-serif", 
            fontWeight: 400 
          }}>
            The Future of Senior Work: Flexibility and Freelance Opportunities
          </span>
        </div>
      </section>

      {/* Main Article Container */}
      <section style={{ padding: "0 80px 40px 80px" }}>
        <div style={{ 
          maxWidth: 1320, 
          margin: "0 auto",
          background: "#FFFFFF", 
          borderRadius: 24, 
          outline: '1px solid #E5E5E5', 
          outlineOffset: -1, 
          padding: "48px",
          marginBottom: "40px"
        }}>
          
          {/* Author Info */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
            <div style={{
              width: 48, 
              height: 48, 
              background: "#012E46", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              marginRight: 16,
              color: "white",
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif"
            }}>
              GE
            </div>
            <div>
              <div style={{ 
                color: "#012E46", 
                fontSize: 16, 
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 700 
              }}>
                Nuno G. Rodrigues
              </div>
              <div style={{ 
                color: "#666", 
                fontSize: 14, 
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 400 
              }}>
                March 15, 2024
              </div>
            </div>
          </div>

                      {/* Article Title */}
            <h1 style={{ 
              color: "#012E46", 
              fontSize: 20, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              lineHeight: "normal", 
              marginBottom: "32px",
              wordWrap: "break-word"
            }}>
              The Future of Senior Work: Flexibility and Freelance Opportunities
            </h1>
          
          {/* Article Content */}
          <div style={{ color: "#012E46", fontSize: 16, lineHeight: "28px", fontFamily: "Montserrat, sans-serif" }}>
            
            <p style={{ marginBottom: "normal" }}>
              The future of work is evolving, and it's time to rethink how we approach senior talent. The traditional 9-to-5 work structure is no longer the only way forward. As more professionals hit their 40s, 50s, and beyond, a flexible work model is not just desirable—it's essential.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              The Vision: Flexible Work for Senior Professionals
            </h2>
            
            <p style={{ marginBottom: "normal" }}>
              Here's the vision: Full-time employment will remain the standard for younger workers until their mid-to-late 30s. After that? It's time to transition to flexible work models—freelancing, short-term contracts, independent consulting, and project-based roles. This approach offers senior professionals the opportunity to work on their own terms, creating a work-life balance that truly fits.
            </p>
            
            <p style={{ marginBottom: "normal" }}>
              The best part? By offering senior-level expertise in flexible formats, companies can access high-caliber talent without long-term commitments.
            </p>
            
            <p style={{ marginBottom: "normal" }}>
              Senior professionals can continue their careers with meaningful work, and businesses can gain the expertise they need without breaking the bank. It's a true win-win.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              Why Flexible Work Models Are The Future for Senior Professionals
            </h2>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                More Freelance Opportunities, Less Hassle
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Smarter, Leaner Businesses
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Age Is Just a Number
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Preparing for the Future
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              More Freelance Opportunities, Less Hassle
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Flexible work arrangements, such as freelancing and consulting, enable businesses to hire senior professionals without the overhead costs of full-time employees.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                This opens the door to more opportunities for experienced talent and eliminates the excuse of "we can't afford that expertise."
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Smarter, Leaner Businesses
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Rather than committing to long-term employees, companies can access senior talent when they need it.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                This "just-in-time" approach to hiring ensures that businesses get the exact expertise they require without the added costs of full-time salaries.
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Age Is Just a Number
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                This model tackles ageism head-on. Senior professionals have years of experience, and with the flexibility to work on their own terms, they can continue to contribute to businesses well into their later years.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                It's not about age—it's about expertise.
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Preparing for the Future
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Flexible work arrangements help businesses and professionals adapt to changes in technology, automation, and economic shifts
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Whether dealing with AI advancements or market fluctuations, the ability to pivot quickly is key. Senior professionals with flexible work options can continue contributing effectively in this ever-changing landscape.
              </li>
            </ul>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              Challenges to Overcome
            </h2>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Income Instability
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Skill Gaps
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Navigating Tax Laws and Regulations
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Uncertainty with Short-Term Contracts
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Resistance to Change
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Income Instability
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Freelancing can sometimes mean an unpredictable income. To make this model sustainable, companies need to create well-paid flexible roles.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Additionally, performance bonuses can help provide financial stability for freelancers.
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Skill Gaps
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Some senior professionals may struggle to keep their skills sharp without structured programs. While self-learning is a good option, not everyone is adept at navigating online tutorials or staying on top of the latest industry trends.
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Navigating Tax Laws and Regulations
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Labor laws and tax regulations need to evolve to keep up with the growing gig economy. Misclassifying workers as independent contractors can lead to legal issues and create a lack of trust between businesses and freelancers.
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Uncertainty with Short-Term Contracts
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Short-term contracts can lead to uncertainty for some senior professionals.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                It will be important to create frameworks that provide stability within flexible work arrangements, ensuring that professionals feel secure in their positions.
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Resistance to Change
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Both businesses and professionals may be hesitant to adopt flexible work models. Overcoming this resistance will require clear communication of the benefits and how they can improve productivity and work-life balance.
              </li>
            </ul>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              How to Make Flexible Work for Senior Professionals a Reality
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              This shift away from traditional full-time employment isn't about eliminating jobs—it's about offering more options.
            </p>
            
            <p style={{ marginBottom: "24px" }}>
              Here's how we can make flexible work for senior professionals a widespread reality:
            </p>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Build the Bridge
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Mix and Match Work Models
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Spread the Word
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Policy Changes for Freelancers
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Build the Bridge
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Platforms like GigExecs are already helping businesses connect with senior-level professionals on flexible terms. These platforms enable companies to find highly experienced talent without the long-term commitment.
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Mix and Match Work Models
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Encourage hybrid models where professionals can combine part-time gigs with passion projects.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                This balance of stability and flexibility allows senior professionals to remain engaged while maintaining a sense of freedom.
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Spread the Word
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Educate companies on the benefits of hiring senior freelancers.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Highlight the advantages of accessing top-tier talent on a short-term basis, allowing businesses to fill gaps without the need for full-time employees.
              </li>
            </ul>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Policy Changes for Freelancers
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Push for policy reforms that make freelancing as secure as full-time employment.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                This includes portable benefits, fair tax treatment for freelancers, and protections for independent contractors.
              </li>
            </ul>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              Conclusion: Flexibility Is Key to the Future of Senior Work
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              The future of senior talent lies in flexibility. Moving away from full-time employment as the default model allows both businesses and professionals to thrive in a rapidly changing world. Businesses will become more agile, senior professionals will feel empowered to continue their careers, and the workforce will be ready to tackle the challenges ahead.
            </p>
            
            <p style={{ marginBottom: "24px", fontStyle: "italic", textAlign: "center" }}>
              Are you ready to embrace the future of flexible work for senior professionals?
            </p>
            
          </div>
          
          {/* Join Button */}
          <div style={{ textAlign: "right", marginTop: "40px" }}>
            <a href="https://gigexecs.com/signup" style={{
              padding: "12px 24px",
              background: "#CC9B0A",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out"
            }}>
              Join GigExecs Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      <section style={{ padding: "0 80px 40px 80px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <h2 style={{ 
            color: "white", 
            fontSize: 24, 
            fontFamily: "Montserrat, sans-serif", 
            fontWeight: 700, 
            marginBottom: "32px" 
          }}>
            Related
          </h2>
          
          <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
            {/* Related Article Card 1 */}
            <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="/images/BlogPage/BlogP3.png"
                  alt="Navigating AI article"
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ 
                height: 410,
                padding: "32px 32px",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
                alignSelf: "stretch",
                borderRadius: "0 0 24px 24px",
                background: "#FFF",
                display: "flex"
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#CC9B0A" }}>
                  Navigating the AI Revolution: Strategies for Senior Professionals
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                  The rise of AI is transforming industries, sparking both excitement and concern—especially for senior professionals. Will AI replace jobs, or can it be leveraged as an opportunity?
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | July 14, 2024</span>
                </div>
                <div style={{ 
                  display: "flex",
                  width: "334.486px",
                  height: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  borderTop: "1px solid #E5E5E5"
                }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a href="/blog/navigating-ai" style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    Read More
                    <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 19.5676L16 11.5676L8 3.56763" stroke="#012E46" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Related Article Card 2 */}
            <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="/images/BlogPage/BlogP4.png"
                  alt="Big anomaly article"
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ 
                height: 410,
                padding: "32px 32px",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
                alignSelf: "stretch",
                borderRadius: "0 0 24px 24px",
                background: "#FFF",
                display: "flex"
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#CC9B0A" }}>
                  The Big Anomaly of the Job Market: Older Talent
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                  The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a viable solution.
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | March 15, 2024</span>
                </div>
                <div style={{ 
                  display: "flex",
                  width: "334.486px",
                  height: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  borderTop: "1px solid #E5E5E5"
                }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a href="/blog/big-anomaly" style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    Read More
                    <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 19.5676L16 11.5676L8 3.56763" stroke="#012E46" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Related Article Card 3 */}
            <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="/images/BlogPage/BlogP5.png"
                  alt="Finding purpose article"
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ 
                height: 410,
                padding: "32px 32px",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
                alignSelf: "stretch",
                borderRadius: "0 0 24px 24px",
                background: "#FFF",
                display: "flex"
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#CC9B0A" }}>
                  Finding Purpose in the Second Half of Life
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                  Discover how the gig economy empowers senior professionals to find purpose and make meaningful impact in the second half of life through flexible, purpose-driven opportunities.
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | March 8, 2024</span>
                </div>
                <div style={{ 
                  display: "flex",
                  width: "334.486px",
                  height: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  borderTop: "1px solid #E5E5E5"
                }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a href="/blog/finding-purpose" style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    Read More
                    <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 19.5676L16 11.5676L8 3.56763" stroke="#012E46" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
  
      </section>
      
      {/* Limited Footer */}
      <footer style={{
        background: "#012E46",
        color: "white",
        width: "100%",
        height: "56px",
        padding: "0 80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 32
      }}>
        {/* GigExecs Logo */}
        <div style={{
          color: "white",
          fontSize: 24,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 800,
          letterSpacing: "0.5px"
        }}>
          GigExecs
        </div>
        
        {/* Separator */}
        <span style={{ color: "white", opacity: 0.7 }}>|</span>
        
        {/* Copyright */}
        <span style={{ 
          color: "white", 
          fontSize: 14, 
          fontFamily: "Montserrat, sans-serif", 
          fontWeight: 400 
        }}>
          Copyright notice
        </span>
        
        {/* Separator */}
        <span style={{ color: "white", opacity: 0.7 }}>|</span>
        
        {/* Data Privacy Policy */}
        <a href="/data-privacy-policy" style={{
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: 14,
          fontFamily: "Open Sans, sans-serif",
          fontWeight: 400,
          textDecoration: "none"
        }}>
          Data Privacy Policy
        </a>
        
        {/* Separator */}
        <div style={{
          width: 1,
          height: 20,
          background: "rgba(255, 255, 255, 0.3)"
        }}></div>
        
        {/* Terms and Conditions */}
        <a href="/terms-and-conditions" style={{
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: 14,
          fontFamily: "Open Sans, sans-serif",
          fontWeight: 400,
          textDecoration: "none"
        }}>
          Terms and Conditions
        </a>
      </footer>
    </div>
  )
}

export default FutureOfSeniorWork 