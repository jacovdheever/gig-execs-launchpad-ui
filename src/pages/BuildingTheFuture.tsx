import React, { useEffect } from "react"
import Header from "../components/Header"

const BuildingTheFuture = () => {
  useEffect(() => {
    // Update document title
    document.title = "Building the Future of Flexible Work for Senior Professionals | GigExecs"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover how GigExecs is building the future of flexible work for senior professionals, connecting experienced talent with businesses worldwide through innovative work models.')
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = 'Discover how GigExecs is building the future of flexible work for senior professionals, connecting experienced talent with businesses worldwide through innovative work models.'
      document.head.appendChild(newMetaDescription)
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'GigExecs platform for senior professionals, Flexible work for experienced executives, Consulting and freelancing for senior professionals, Fractional executive roles, Global talent marketplace for professionals, Overcoming ageism in the workplace, On-demand consulting for businesses, Senior professionals in the gig economy, Alternative career paths for executives, Future of work for experienced professionals')
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = 'GigExecs platform for senior professionals, Flexible work for experienced executives, Consulting and freelancing for senior professionals, Fractional executive roles, Global talent marketplace for professionals, Overcoming ageism in the workplace, On-demand consulting for businesses, Senior professionals in the gig economy, Alternative career paths for executives, Future of work for experienced professionals'
      document.head.appendChild(newMetaKeywords)
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Building the Future of Flexible Work for Senior Professionals | GigExecs')
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.setAttribute('content', 'Building the Future of Flexible Work for Senior Professionals | GigExecs')
      document.head.appendChild(newOgTitle)
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Discover how GigExecs is building the future of flexible work for senior professionals, connecting experienced talent with businesses worldwide through innovative work models.')
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.setAttribute('content', 'Discover how GigExecs is building the future of flexible work for senior professionals, connecting experienced talent with businesses worldwide through innovative work models.')
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
      twitterTitle.setAttribute('content', 'Building the Future of Flexible Work for Senior Professionals | GigExecs')
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = 'Building the Future of Flexible Work for Senior Professionals | GigExecs'
      document.head.appendChild(newTwitterTitle)
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Discover how GigExecs is building the future of flexible work for senior professionals, connecting experienced talent with businesses worldwide through innovative work models.')
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = 'Discover how GigExecs is building the future of flexible work for senior professionals, connecting experienced talent with businesses worldwide through innovative work models.'
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
            Building the Future of Flexible Work for Senior Professionals
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
              Building the Future of Flexible Work for Senior Professionals
            </h1>
          
          {/* Article Content */}
          <div style={{ color: "#012E46", fontSize: 16, lineHeight: "28px", fontFamily: "Montserrat, sans-serif" }}>
            
            <p style={{ marginBottom: "24px" }}>
              At GigExecs, we've been quietly working behind the scenes over the past few months to build something special. Since launching our Beta version, with limited resources and a bootstrapped approach, we're thrilled to share the progress we've made. Already, our platform boasts a growing network of highly experienced senior professionals from all corners of the globe—from the US to Asia, Europe to Africa. The diversity and depth of expertise across industries such as Energy, Finance, Media, Natural Resources, Marketing, and Engineering are nothing short of inspiring.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              GigExecs: The Go-To Platform for Senior Professionals and Businesses
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              Our mission is clear: GigExecs aims to be the <a href="https://www.gigexecs.com/leading-platform" style={{ color: "#CC9B0A", fontWeight: 700, textDecoration: "none" }}>leading platform</a> where senior professionals and businesses worldwide can connect through flexible work models. Whether it's independent advisory, consulting, fractional roles, freelancing, or other flexible engagements, GigExecs makes it easier for businesses and professionals to collaborate and thrive.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              Addressing the Need for Flexible Professional Solutions
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              As global life expectancy increases and careers extend into later years, the demand for flexible professional solutions has never been more urgent. Senior professionals want to remain financially and professionally active well into their 40s, 50s, and 60s. However, ageism remains a barrier, especially for those seeking full-time positions later in their careers. This is where GigExecs steps in. By offering flexible work models, we help bridge the gap between experienced professionals and businesses in need of their expertise.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              Unlocking Global Talent with GigExecs
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              Through GigExecs, businesses can tap into a <a href="https://www.gigexecs.com/global-talent-pool" style={{ color: "#CC9B0A", fontWeight: 700, textDecoration: "none" }}>global talent pool</a>, gaining access to high-impact, on-demand professionals who can deliver short-term, specialized work at a cost-effective rate. GigExecs is the solution for businesses seeking top-tier talent without the commitment of traditional, full-time hires.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              Exciting Updates Ahead for GigExecs
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              We're continuously working to enhance and expand the features of our Beta version, and we have many exciting improvements on the horizon. As we grow, we appreciate your support and invite you to stay tuned for further updates.
            </p>
            
            <p style={{ marginBottom: "24px", fontStyle: "italic", textAlign: "center" }}>
              Join us in shaping the future of flexible work for senior professionals worldwide!
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
                  src="/images/BlogPage/BlogP6.png"
                  alt="Challenge for 2025 article"
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
                  The 20% Challenge for 2025: Flexible Work for Seniors
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                  Discover the 20% challenge for businesses in 2025: converting senior roles to flexible work positions to unlock top talent, save costs, and drive innovation.
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | January 18, 2024</span>
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
                  <a href="/blog/challenge-for-2025" style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
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

export default BuildingTheFuture 