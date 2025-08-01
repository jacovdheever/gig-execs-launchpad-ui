import React, { useEffect } from "react"
import Header from "../components/Header"

const MasterMentalClarity = () => {
  useEffect(() => {
    // Update document title
    document.title = "Master Mental Clarity: Management Strategies for High Performers Who Give It Their All | GigExecs"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover proven stress management strategies for high performers to prevent burnout, maintain mental clarity, and thrive in their careers without sacrificing well-being.')
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = 'Discover proven stress management strategies for high performers to prevent burnout, maintain mental clarity, and thrive in their careers without sacrificing well-being.'
      document.head.appendChild(newMetaDescription)
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'stress management, high performers, burnout prevention, self-care, emotional strength, gratitude, work-life balance, executive stress, GigExecs, thriving at work, stress relief tips, productivity strategies, work stress, personal well-being, career success')
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = 'stress management, high performers, burnout prevention, self-care, emotional strength, gratitude, work-life balance, executive stress, GigExecs, thriving at work, stress relief tips, productivity strategies, work stress, personal well-being, career success'
      document.head.appendChild(newMetaKeywords)
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Master Mental Clarity: Management Strategies for High Performers Who Give It Their All | GigExecs')
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.setAttribute('content', 'Master Mental Clarity: Management Strategies for High Performers Who Give It Their All | GigExecs')
      document.head.appendChild(newOgTitle)
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Discover proven stress management strategies for high performers to prevent burnout, maintain mental clarity, and thrive in their careers without sacrificing well-being.')
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.setAttribute('content', 'Discover proven stress management strategies for high performers to prevent burnout, maintain mental clarity, and thrive in their careers without sacrificing well-being.')
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
      twitterTitle.setAttribute('content', 'Master Mental Clarity: Management Strategies for High Performers Who Give It Their All | GigExecs')
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = 'Master Mental Clarity: Management Strategies for High Performers Who Give It Their All | GigExecs'
      document.head.appendChild(newTwitterTitle)
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Discover proven stress management strategies for high performers to prevent burnout, maintain mental clarity, and thrive in their careers without sacrificing well-being.')
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = 'Discover proven stress management strategies for high performers to prevent burnout, maintain mental clarity, and thrive in their careers without sacrificing well-being.'
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
            Master Mental Clarity: Management Strategies for High Performers Who Give It Their All
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
              Master Mental Clarity: Management Strategies for High Performers Who Give It Their All
            </h1>
          
          {/* Article Content */}
          <div style={{ color: "#012E46", fontSize: 16, lineHeight: "28px", fontFamily: "Montserrat, sans-serif" }}>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              Feeling the Weight of It All? You're Not Alone.
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              High performers often juggle multiple responsibilities, push for impactful results, and maintain an appearance of strength. You may have dedicated years to your career, building your reputation, but at what cost to your personal well-being? This article isn't just for executives or parents—it's for anyone who has been so committed to creating value for others that they've neglected their own needs.
            </p>
        
            
            <p style={{ marginBottom: "24px" }}>
              If you're feeling stretched too thin, like no matter how hard you work, you're never truly "there," you're not alone. The good news? Success doesn't have to come at the expense of your health or happiness.
              The key to long-term success lies in stress management, not as a battle to overcome but as a signal to realign and thrive.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              Proven Stress Management Strategies to Reclaim Your Energy
            </h2>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Prioritize Self-Care—It's Non-Negotiable
            </h3>
            
            <p style={{ marginBottom: "24px" }}>
              Let's face it: you can't pour from an empty cup. Self-care for high performers isn't indulgence; it's a necessity.
              Simple actions like a 20-minute walk or a few mindful minutes each day can recharge both your body and mind.
            </p>
            
            <p style={{ marginBottom: "24px", fontStyle: "italic" }}>
              Pro Tip: Schedule self-care like an important business meeting. No cancellations allowed.
            </p>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Embrace Gratitude—Shift Your Mindset, Rewire Your Brain
            </h3>
            
            <p style={{ marginBottom: "24px" }}>
              Gratitude isn't just "nice to have"—it's science-backed. Taking a moment each day to reflect on three things you're grateful for can transform your outlook on challenges.
            </p>
            
            <p style={{ marginBottom: "24px" }}>
              This practice shifts your focus from stressors to the things that are fueling you.
            </p>
            
            <p style={{ marginBottom: "24px", fontStyle: "italic" }}>
              Pro Tip: Use a simple journal or your phone to jot down your gratitude notes every morning.
            </p>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Stop Fighting Stress—Start Learning From It
            </h3>
            
            <p style={{ marginBottom: "24px" }}>
              Stress isn't the enemy—it's a guide. It shows you areas where you might be misaligned or overcommitted.
              Instead of resisting, ask yourself: What is this stress teaching me? Is it prompting you to set boundaries? To ask for help?
              When you embrace stress as a tool for growth, you can use it to make more informed decisions rather than just trying to overcome it.
            </p>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Build Emotional Strength—Drop the "Tough Guy" Act
            </h3>
            
            <p style={{ marginBottom: "24px" }}>
              Suppressing your emotions doesn't make you stronger—it makes you brittle.
              True strength lies in acknowledging and expressing your feelings.
              Whether it's through journaling, coaching, or talking to trusted peers, finding a safe space for your emotions helps you process and move forward.
            </p>
            
            <p style={{ marginBottom: "24px", fontStyle: "italic" }}>
              Pro Tip: Find a confidant—someone who can hold space for your challenges without judgment.
            </p>
            
            <h3 style={{ 
              color: "#012E46", 
              fontSize: 16, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "24px"
            }}>
              Plug Into Community—You Don't Have to Do This Alone
            </h3>
            
            <p style={{ marginBottom: "24px" }}>
              High performers often feel they must do it all themselves. But no one is meant to go it alone.
              Surround yourself with like-minded professionals who understand your journey and can offer support, accountability, and wisdom.
            </p>
            
            <p style={{ marginBottom: "24px", fontStyle: "italic" }}>
              Pro Tip: Join a platform like <a href="https://www.gigexecs.com" style={{ color: "#CC9B0A", fontWeight: 700, textDecoration: "none" }}>GigExecs</a>, where you're not just a user but part of a community focused on growth and balance.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              The GigExecs Difference: More Than a Platform
            </h2>
            
            <p style={{ marginBottom: "24px" }}>
              At GigExecs, we understand that managing stress and thriving in your career requires more than individual effort.
              It's about connection, alignment, and a shared commitment to being your best self. Whether you're an executive, creative professional, or someone striving for work-life balance, you're part of a tribe that values not just your achievements, but who you are as a person.
              This isn't just a platform—it's a movement. Together, we can redefine what it means to succeed without sacrificing well-being.
            </p>
            
            <h2 style={{ 
              color: "#012E46", 
              fontSize: 18, 
              fontFamily: "Montserrat, sans-serif", 
              fontWeight: 700, 
              marginBottom: "16px",
              marginTop: "32px"
            }}>
              Ready to Thrive? Start With These Steps
            </h2>
            
            <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Reframe Your Day: Begin with gratitude and end with reflection.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Ask for Help: Stress signals where you need support—lean on your community.
              </li>
              <li style={{ marginBottom: "12px", listStyleType: "disc" }}>
                Take Action Today: What's one small action you can take right now to recharge?
              </li>
            </ul>
            
            <p style={{ marginBottom: "24px" }}>
              Create a life where success doesn't come at a cost. Manage stress effectively, prioritize your well-being, and thrive without burning out.
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
                  src="/images/BlogPage/BlogP6.png"
                  alt="Building the future article"
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
                  Building the Future of Flexible Work for Senior Professionals
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                  Discover how GigExecs is building the future of flexible work for senior professionals, connecting experienced talent with businesses worldwide through innovative work models.
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | February 17, 2024</span>
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
                  <a href="/blog/building-the-future" style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
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

export default MasterMentalClarity 