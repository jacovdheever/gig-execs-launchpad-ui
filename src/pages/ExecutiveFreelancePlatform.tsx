import React, { useEffect } from "react"
import Header from "../components/Header"

const ExecutiveFreelancePlatform = () => {
  useEffect(() => {
    // Update document title
    document.title = "A Freelance Platform for Experienced Executives & Consultants | GigExecs"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover GigExecs - the premier platform for experienced executives and consultants seeking high-value freelance opportunities. Connect with global clients and enjoy flexible work arrangements.')
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = 'Discover GigExecs - the premier platform for experienced executives and consultants seeking high-value freelance opportunities. Connect with global clients and enjoy flexible work arrangements.'
      document.head.appendChild(newMetaDescription)
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'GigExecs, Executive freelancing, Fractional executives, Consulting gigs, High-value freelance work, Flexible work for executives, Experienced professionals gig economy, Remote executive jobs, Freelance consulting opportunities, Alternative to traditional employment')
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = 'GigExecs, Executive freelancing, Fractional executives, Consulting gigs, High-value freelance work, Flexible work for executives, Experienced professionals gig economy, Remote executive jobs, Freelance consulting opportunities, Alternative to traditional employment'
      document.head.appendChild(newMetaKeywords)
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', 'A Freelance Platform for Experienced Executives & Consultants | GigExecs')
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.setAttribute('content', 'A Freelance Platform for Experienced Executives & Consultants | GigExecs')
      document.head.appendChild(newOgTitle)
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Discover GigExecs - the premier platform for experienced executives and consultants seeking high-value freelance opportunities.')
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.setAttribute('content', 'Discover GigExecs - the premier platform for experienced executives and consultants seeking high-value freelance opportunities.')
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
      twitterTitle.setAttribute('content', 'A Freelance Platform for Experienced Executives & Consultants | GigExecs')
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = 'A Freelance Platform for Experienced Executives & Consultants | GigExecs'
      document.head.appendChild(newTwitterTitle)
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Discover GigExecs - the premier platform for experienced executives and consultants seeking high-value freelance opportunities.')
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = 'Discover GigExecs - the premier platform for experienced executives and consultants seeking high-value freelance opportunities.'
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
            A Freelance Platform for Experienced Executives & Consultants
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
                March 25, 2024
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
            From Corporate Leadership to Executive Freelancing: The Story Behind GigExecs
          </h1>
          
          {/* Article Content */}
          <div style={{ color: "#012E46", fontSize: 16, lineHeight: "28px", fontFamily: "Montserrat, sans-serif" }}>
            
            <p style={{ marginBottom: "24px" }}>
            In a world where the gig economy is often associated with entry-level work and tech-based gigs, seasoned professionals have long been overlooked. That gap is what led to the creation of GigExecs—a platform designed specifically for experienced executives, consultants, and specialists seeking flexible, high-value opportunities.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              The Shift to Flexible Work
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              When the world went into lockdown in 2020, remote work became the norm. Like many others, I found myself searching for ways to stay globally connected while leveraging nearly two decades of corporate experience. My goal was clear: to mentor and coach entrepreneurs worldwide, helping them navigate business challenges while earning a sustainable income.
            </p>
            
            <p style={{ marginBottom: "24px" }}>
              Turning to online freelance marketplaces seemed like the logical step. I launched a gig titled "I will be your Investor, Coach, and Business Mentor", hoping to connect with ambitious business owners in need of strategic guidance. The response was overwhelming. Over 18 months, I worked with more than 60 entrepreneurs across multiple industries, helping them tackle funding challenges, growth strategies, and operational roadblocks.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              The Question That Changed Everything
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              During one of my many coaching sessions, a client asked me: "With your experience, why are you offering services on a gig platform?". It was a simple question but a powerful one. Most freelance marketplaces catered to younger professionals, offering low compensation rates and a heavy focus on tech-based services.
            </p>
            
            <p style={{ marginBottom: "24px" }}>
              There were few—if any—platforms built for executives, seasoned consultants, or industry experts who wanted to embrace flexible work without undervaluing their expertise.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              The Birth of GigExecs
            </h2>
            
            <p style={{ marginBottom: "16px" }}>
              That realization sparked the idea for GigExecs—a dedicated platform where experienced <a href="https://gigexecs.com/professionals" style={{ color: "#CC9B0A", fontWeight: 700, textDecoration: "none" }}>professionals</a> could:
            </p>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "8px", listStyleType: "disc" }}>Find project-based work or fractional executive roles</li>
              <li style={{ marginBottom: "8px", listStyleType: "disc" }}>Enjoy flexible work arrangements without traditional employment constraints</li>
              <li style={{ marginBottom: "8px", listStyleType: "disc" }}>Receive fair compensation that reflects their expertise</li>
              <li style={{ marginBottom: "8px", listStyleType: "disc" }}> <a href="https://gigexecs.com/clients" style={{ color: "#CC9B0A", fontWeight: 700, textDecoration: "none" }}>Connect with global clients</a> who value high-level experience without the complexity of traditional hiring</li>
            </ul>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              More Than a Platform—A Movement
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
            GigExecs isn’t just another marketplace; it’s a movement to redefine work for experienced professionals. Whether you’re an executive, consultant, or specialist looking for greater autonomy, GigExecs gives you the tools and opportunities to monetize your expertise and make an impact.
            The gig economy isn’t just for entry-level work anymore—it’s time for seasoned professionals to take their place in it. Welcome to the future of executive freelancing.
            </p>
            
            <p style={{ marginBottom: "32px" }}>
              The gig economy isn't just for entry-level work anymore—it's time for seasoned professionals to take their place in it. Welcome to the future of executive freelancing.
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
                  src="/images/BlogPage/BlogP7.png"
                  alt="AI robots article"
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
                  AI, Robots and the Future of Work: Buckle Up, Humans!
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                  Explore how AI and robotics are reshaping the workforce in 2025 and beyond, and discover strategies for professionals to adapt and thrive in the AI-driven future of work.
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | August 5, 2024</span>
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
                  <a href="/blog/ai-robots-buckle-up" style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
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

export default ExecutiveFreelancePlatform 