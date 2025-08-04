import React, { useEffect } from "react"
import Header from "../components/Header"

const ChallengeFor2025 = () => {
  useEffect(() => {
    // Update document title
    document.title = "The 20% Challenge for 2025: Flexible Work for Senior Professionals | GigExecs"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover the 20% challenge for businesses in 2025: converting senior roles to flexible work positions to unlock top talent, save costs, and drive innovation.')
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = 'Discover the 20% challenge for businesses in 2025: converting senior roles to flexible work positions to unlock top talent, save costs, and drive innovation.'
      document.head.appendChild(newMetaDescription)
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'Flexible work for senior professionals, 20% challenge for businesses, Senior talent flexible roles, Future of work 2025, Benefits of flexible work models, Senior freelancing opportunities, Innovation through flexible work, Business cost savings through flexibility, Senior talent inclusivity in the workforce, Agile workforce strategies')
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = 'Flexible work for senior professionals, 20% challenge for businesses, Senior talent flexible roles, Future of work 2025, Benefits of flexible work models, Senior freelancing opportunities, Innovation through flexible work, Business cost savings through flexibility, Senior talent inclusivity in the workforce, Agile workforce strategies'
      document.head.appendChild(newMetaKeywords)
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', 'The 20% Challenge for 2025: Flexible Work for Senior Professionals | GigExecs')
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.setAttribute('content', 'The 20% Challenge for 2025: Flexible Work for Senior Professionals | GigExecs')
      document.head.appendChild(newOgTitle)
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Discover the 20% challenge for businesses in 2025: converting senior roles to flexible work positions to unlock top talent, save costs, and drive innovation.')
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.setAttribute('content', 'Discover the 20% challenge for businesses in 2025: converting senior roles to flexible work positions to unlock top talent, save costs, and drive innovation.')
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
      twitterTitle.setAttribute('content', 'The 20% Challenge for 2025: Flexible Work for Senior Professionals | GigExecs')
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = 'The 20% Challenge for 2025: Flexible Work for Senior Professionals | GigExecs'
      document.head.appendChild(newTwitterTitle)
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Discover the 20% challenge for businesses in 2025: converting senior roles to flexible work positions to unlock top talent, save costs, and drive innovation.')
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = 'Discover the 20% challenge for businesses in 2025: converting senior roles to flexible work positions to unlock top talent, save costs, and drive innovation.'
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
            The 20% Challenge for 2025: Flexible Work for Senior Professionals
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
              lineHeight: "120%", 
              marginBottom: "32px",
              wordWrap: "break-word"
            }}>
              The 20% Challenge for 2025: Flexible Work for Senior Professionals
            </h1>
          
          {/* Article Content */}
          <div style={{ color: "#012E46", fontSize: 16, lineHeight: "28px", fontFamily: "Montserrat, sans-serif" }}>
            
            <p style={{ marginBottom: "24px" }}>
              As we move into 2025, one thing is certain: uncertainty is the new norm. With AI evolving at a rapid pace and humans living longer, healthier lives, it's clear that the future of work must be redefined. Career trajectories, particularly for senior professionals, are no longer confined to traditional full-time roles. It's time to rethink how businesses approach workforce models—and that's where flexibility comes in.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              The 20% Challenge for Businesses in 2025
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              Here's my challenge to businesses of all sizes, from startups to global corporations: Convert up to 20% of your full-time senior roles into flexible work positions. Why take on this challenge? Let's break it down.
            </p>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Why Convert Senior Roles to Flexible Work?
            </h3>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Unlock Top Talent: Senior professionals with years of experience are seeking more than just full-time employment—they want flexibility. By offering flexible work options, businesses can tap into a growing pool of skilled, experienced professionals eager to contribute their expertise. This is your opportunity to leverage top-tier talent without long-term commitments.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Save Money: Flexible work roles eliminate the costs associated with full-time employment, such as healthcare benefits, retirement plans, and other overhead expenses. Businesses can access the same high-level talent without the financial strain, paying only for the expertise they need when they need it.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Fresh Perspectives and Innovation: Bringing in independent professionals with diverse backgrounds and new perspectives can revitalize teams. These experts are often more agile, driven, and ready to bring fresh ideas that challenge the status quo. This leads to innovative solutions that can fuel business growth and success.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                More Opportunities for Senior Talent: Converting full-time roles to flexible positions creates more opportunities for senior professionals to remain engaged in meaningful work well into their later years. This allows businesses to benefit from seasoned experts while empowering professionals to continue contributing to the workforce on their own terms.
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
              Benefits Beyond Cost Savings
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              This flexible work shift isn't just about saving money. It's also about creating a more inclusive, agile workforce that can thrive in an unpredictable future. By embracing flexibility, businesses can:
            </p>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Adapt Quickly: Companies become more nimble, able to pivot and adjust to changes in the market, technology, and industry trends.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Foster Inclusivity: Offering flexible work creates a more diverse workforce, welcoming experienced talent regardless of age, location, or life stage
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Enhance Employee Satisfaction: Flexibility empowers senior professionals to balance work with personal commitments, improving overall job satisfaction and retention.
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
              The Future of Senior Talent: Flexible Work Models
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              As we look ahead, it's clear that the future of work is no longer tied to traditional full-time employment. By adopting flexible work for senior professionals, companies stay competitive, save money, and access a wealth of expertise. For senior talent, it provides a chance to remain active, engaged, and financially stable for longer in their careers. The 20% Challenge isn't just about making a change—it's about leading the way to a more flexible, inclusive, and future-ready workforce. Are you in?
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
                  src="/images/BlogPage/BlogP2.png"
                  alt="Executive freelance platform article"
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
                  From Corporate Leadership to Executive Freelancing: The Story Behind GigExecs
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                  This article updates readers on GigExecs' progress since launching its Beta version, showcasing a growing network of senior professionals from diverse backgrounds.
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | January 22, 2024</span>
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
                  <a href="/blog/executive-freelance-platform" style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
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
            
            {/* Related Article Card 3 */}
            <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="/images/BlogPage/BlogP8.png"
                  alt="Future of senior work article"
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
                  The Future of Senior Work: Flexibility and Freelance
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                  Explore the future of senior work through flexible models, freelancing opportunities, and how experienced professionals can thrive in the evolving workforce landscape.
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | February 25, 2024</span>
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
                  <a href="/blog/future-of-senior-work" style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
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

export default ChallengeFor2025 