import React, { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const BlogArticle = () => {
  useEffect(() => {
    // Update document title
    document.title = "Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth | GigExecs"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover the pros and cons of remote, hybrid, and in-office work models for career growth. Learn how to choose the best work environment for your professional development and success.')
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = 'Discover the pros and cons of remote, hybrid, and in-office work models for career growth. Learn how to choose the best work environment for your professional development and success.'
      document.head.appendChild(newMetaDescription)
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'Remote vs hybrid vs in-office work, Best work model for career growth, Does remote work hurt promotions?, Hybrid work and job opportunities, AI impact on remote jobs, Future of work flexibility, Freelancing vs full-time employment, How to succeed in a hybrid work environment, Career growth in remote jobs, Choosing the right work model')
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = 'Remote vs hybrid vs in-office work, Best work model for career growth, Does remote work hurt promotions?, Hybrid work and job opportunities, AI impact on remote jobs, Future of work flexibility, Freelancing vs full-time employment, How to succeed in a hybrid work environment, Career growth in remote jobs, Choosing the right work model'
      document.head.appendChild(newMetaKeywords)
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth | GigExecs')
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.setAttribute('content', 'Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth | GigExecs')
      document.head.appendChild(newOgTitle)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Discover the pros and cons of remote, hybrid, and in-office work models for career growth. Learn how to choose the best work environment for your professional development and success.')
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.setAttribute('content', 'Discover the pros and cons of remote, hybrid, and in-office work models for career growth. Learn how to choose the best work environment for your professional development and success.')
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

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) {
      ogUrl.setAttribute('content', window.location.href)
    } else {
      const newOgUrl = document.createElement('meta')
      newOgUrl.setAttribute('property', 'og:url')
      newOgUrl.setAttribute('content', window.location.href)
      document.head.appendChild(newOgUrl)
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
      twitterTitle.setAttribute('content', 'Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth | GigExecs')
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = 'Remote, Hybrid, or In-Office? Choosing the Best Work Model for Career Growth | GigExecs'
      document.head.appendChild(newTwitterTitle)
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Discover the pros and cons of remote, hybrid, and in-office work models for career growth. Learn how to choose the best work environment for your professional development and success.')
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = 'Discover the pros and cons of remote, hybrid, and in-office work models for career growth. Learn how to choose the best work environment for your professional development and success.'
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
      <div style={{ 
        display: "flex", 
        height: 32, 
        padding: "0 80px", 
        alignItems: "center", 
        gap: 16, 
        alignSelf: "stretch",
        marginTop: 20
      }}>
        <a href="/" style={{ 
          color: "#CC9B0A", 
          fontSize: 14, 
          fontFamily: "Montserrat, sans-serif", 
          fontWeight: 600,
          textDecoration: "none"
        }}>
          Home
        </a>
        <span style={{ 
          color: "#ffffff", 
          fontSize: 14, 
          fontFamily: "Montserrat, sans-serif", 
          fontWeight: 400,
          opacity: 0.7
        }}>
          {'>'}
        </span>
        <a href="/blog" style={{ 
          color: "#CC9B0A", 
          fontSize: 14, 
          fontFamily: "Montserrat, sans-serif", 
          fontWeight: 600,
          textDecoration: "none"
        }}>
          Blog
        </a>
        <span style={{ 
          color: "#ffffff", 
          fontSize: 14, 
          fontFamily: "Montserrat, sans-serif", 
          fontWeight: 400,
          opacity: 0.7
        }}>
          {'>'}
        </span>
        <span style={{ 
          color: "#ffffff", 
          fontSize: 14, 
          fontFamily: "Montserrat, sans-serif", 
          fontWeight: 400
        }}>
          Remote, Hybrid, or In-Office? Choosing the Right Work Model for Your Career
        </span>
      </div>
      
      {/* Article Container */}
      <section style={{ padding: "40px 80px", background: "transparent" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {/* Article Content */}
          <div style={{ 
            background: "#FFFFFF", 
            borderRadius: 24, 
            outline: '1px solid #E5E5E5', 
            outlineOffset: -1, 
            padding: "48px",
            marginBottom: "40px"
          }}>
            {/* Author Info */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "32px", gap: "16px" }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                background: "#012E46", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "white",
                fontSize: 18,
                fontWeight: 700
              }}>
                GE
              </div>
              <div>
                <div style={{ 
                  color: "#012E46", 
                  fontSize: 16, 
                  fontFamily: "Montserrat, sans-serif", 
                  fontWeight: 400 
                }}>
                  Nuno G. Rodrigues
                </div>
                <div style={{ 
                  color: "#999", 
                  fontSize: 14, 
                  fontFamily: "Montserrat, sans-serif", 
                  fontWeight: 400 
                }}>
                  May 6, 2024
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
              Remote, Hybrid, or In-Office? Choosing the Right Work Model for Your Career
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
                No One-Size-Fits-All Work Model
              </h2>
              
              <p style={{ marginBottom: "24px" }}>
                There is no perfect work model that applies universally. The decision to work remotely, in a hybrid setting, or fully in-office depends on various factors such as industry, job type, career ambitions, and corporate culture. With 23 years of experience across global markets—including 15 years in-office and 7 years remote (occasionally hybrid)—I've seen firsthand how different work models impact career growth, productivity, and job satisfaction.
              </p>
              
              <h2 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 700, 
                marginBottom: "16px",
                marginTop: "32px"
              }}>
                Career Growth & Office Visibility – Does It Matter?
              </h2>
              
              <p style={{ marginBottom: "24px" }}>
                If you aspire to climb the corporate ladder and reach senior management or C-suite levels, being visible in the office can play a significant role in career advancement. While technical performance is crucial, soft skills and building trust with decision-makers are equally important. If you can effectively establish strong relationships and leadership presence remotely, that's excellent. However, in most industries outside of tech and startups, remote workers often face challenges competing for promotions with in-office colleagues who have more face-to-face interactions with leadership.
              </p>
              
              <h2 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 700, 
                marginBottom: "16px",
                marginTop: "32px"
              }}>
                The Changing Workforce & New Generational Trends
              </h2>
              
              <p style={{ marginBottom: "24px" }}>
                The traditional career path—joining a company fresh out of university, working tirelessly in the office for 20–30 years, and reaching the top—has lost its appeal, particularly among younger generations. Corporate loyalty is also evolving. Companies invest in employee development, yet employees may leave for better opportunities elsewhere. Similarly, long-term employees are not immune to layoffs when economic downturns hit. This shift has made professionals rethink their approach to job security and work-life balance.
              </p>
              
              <h2 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 700, 
                marginBottom: "16px",
                marginTop: "32px"
              }}>
                The Future of Work: AI, Freelancing & Flexibility
              </h2>
              
              <p style={{ marginBottom: "24px" }}>
                The rapid advancement of artificial intelligence (AI) is transforming the workplace. AI is automating repetitive tasks, reducing the demand for certain roles while creating new opportunities that require specialized skills. A recent study highlights how AI is already reshaping industries, from finance to healthcare.
              </p>
              
              <p style={{ marginBottom: "24px" }}>
                To stay competitive, companies need flexible work models. A hybrid setup with a core senior team onsite ensures strategic leadership, while remote specialists—such as accountants, project managers, and IT professionals—can contribute effectively from anywhere.
              </p>
              
              <p style={{ marginBottom: "24px" }}>
                The rise of freelancing, independent contracting, and fractional work also allows businesses to tap into specialized talent without requiring full-time, in-office presence.
              </p>
              
              <h2 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 700, 
                marginBottom: "16px",
                marginTop: "32px"
              }}>
                Final Thoughts: How to Choose the Best Work Model
              </h2>
              
              <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>Embrace flexibility to attract top talent.</li>
                <li style={{ marginBottom: "8px" }}>Focus on skills and expertise rather than location.</li>
                <li style={{ marginBottom: "8px" }}>Invest in technology to enable seamless collaboration between remote and in-office teams.</li>
              </ul>
              
              <h2 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 700, 
                marginBottom: "16px",
                marginTop: "32px"
              }}>
                Advice for Employees
              </h2>
              
              <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>Consider your career goals and work-life balance when choosing a work model.</li>
                <li style={{ marginBottom: "8px" }}>Stay adaptable—early in your career, a hybrid or in-office presence may offer better networking opportunities.</li>
                <li style={{ marginBottom: "8px" }}>Keep an eye on industry trends, particularly the impact of AI on your field.</li>
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
                GigExecs is more than just another freelance platform. It's a movement to redefine what work looks like for experienced professionals. We're creating a space where seasoned executives, consultants, and specialists can leverage their expertise on their own terms, offering high-value services to clients who understand the value of experience.
              </p>
              
              <p style={{ marginBottom: "24px" }}>
                The gig economy is evolving beyond entry-level work and short-term projects. It's becoming a viable career path for experienced professionals who want autonomy, flexibility, and the opportunity to make a significant impact. At GigExecs, we're providing the tools, platform, and opportunities for these professionals to thrive in this new landscape.
              </p>
              
              <h2 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 700, 
                marginBottom: "16px",
                marginTop: "32px"
              }}>
                Final Thoughts: How to Choose the Best Work Model
              </h2>
              
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 700, 
                marginBottom: "12px",
                marginTop: "24px"
              }}>
                Advice for Employers
              </h3>
              
              <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px", listStyleType: "disc" }}>Embrace flexibility to attract top talent.</li>
                <li style={{ marginBottom: "8px", listStyleType: "disc" }}>Focus on skills and expertise rather than location.</li>
                <li style={{ marginBottom: "8px", listStyleType: "disc" }}>Invest in technology to enable seamless collaboration between remote and in-office teams.</li>
              </ul>
              
              <h3 style={{ 
                color: "#012E46", 
                fontSize: 18, 
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 700, 
                marginBottom: "12px",
                marginTop: "24px"
              }}>
                Advice for Employees
              </h3>
              
              <ul style={{ marginBottom: "32px", paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px", listStyleType: "disc" }}>Consider your career goals and work-life balance when choosing a work model.</li>
                <li style={{ marginBottom: "8px", listStyleType: "disc" }}>Stay adaptable—early in your career, a hybrid or in-office presence may offer better networking opportunities.</li>
                <li style={{ marginBottom: "8px", listStyleType: "disc" }}>Keep an eye on industry trends, particularly the impact of AI on your field.</li>
              </ul>
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
          
          {/* Related Articles Section */}
          <div style={{ marginTop: "40px" }}>
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

export default BlogArticle 