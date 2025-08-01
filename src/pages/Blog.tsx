import React from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const Blog = () => {
  return (
    <div style={{
      background: `url('/background/BlogBackground.svg') center center / cover no-repeat`,
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
        <span style={{ 
          color: "#CC9B0A", 
          fontSize: 14, 
          fontFamily: "Montserrat, sans-serif", 
          fontWeight: 400,
          opacity: 0.7
        }}>
          Home
        </span>
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
          Blog
        </span>
      </div>
      
      {/* Page Intro / Hero Header */}
      <section style={{ paddingTop: 40, paddingBottom: 40, paddingLeft: 80, paddingRight: 80 }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ alignSelf: "stretch", justifyContent: "flex-start", alignItems: "center", gap: 40, display: "flex" }}>
            {/* About Icon to the left, 2px gap */}
            <div style={{ width: 24, height: 24, position: "relative" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 24, minHeight: 24 }}>
                <path d="M14.9921 3.45825C12.5171 3.45825 10.5088 5.46659 10.5088 7.94159C10.5088 10.4166 12.5171 12.4249 14.9921 12.4249C17.4671 12.4249 19.4755 10.4166 19.4755 7.94159C19.4755 5.46659 17.4671 3.45825 14.9921 3.45825Z" fill="#4885AA"/>
                <path d="M7.30137 12.8594C5.77637 12.8594 4.52637 14.101 4.52637 15.6344C4.52637 17.1677 5.76803 18.4094 7.30137 18.4094C8.82637 18.4094 10.0764 17.1677 10.0764 15.6344C10.0764 14.101 8.82637 12.8594 7.30137 12.8594Z" fill="#CC9B0A"/>
                <path d="M15.8485 15.8477C14.5568 15.8477 13.5068 16.8977 13.5068 18.1893C13.5068 19.481 14.5568 20.531 15.8485 20.531C17.1402 20.531 18.1902 19.481 18.1902 18.1893C18.1902 16.8977 17.1402 15.8477 15.8485 15.8477Z" fill="white"/>
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width:0, height: 24, padding: 2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, opacity: 0 }} />
                  <div style={{ width: 20, height: 20, opacity: 0 }} />
                  <div style={{ width: 8.97, height: 8.97, background: "#4885AA", borderRadius: "50%" }} />
                  <div style={{ width: 5.55, height: 5.55, background: "#CC9B0A", borderRadius: "50%" }} />
                  <div style={{ width: 4.68, height: 4.68, background: "white", borderRadius: "50%" }} />
                </div>
                <div style={{ 
                  color: "white", 
                  fontSize: 40, 
                  fontFamily: "Montserrat, sans-serif", 
                  fontWeight: 600, 
                  lineHeight: "120%", 
                  letterSpacing: "0%",
                  wordWrap: "break-word" 
                }}>
                  Freelancing Insights & Hiring Tips For Flexible Work Models
                  
                </div>
              </div>
            </div>
          </div>
          
          {/* Blog Description */}
          <div style={{ marginTop: 32, maxWidth: 1380 }}>
            <p style={{ 
              color: "white", 
              fontSize: 16, 
              fontFamily: "Open Sans, sans-serif", 
              fontWeight: 400, 
              lineHeight: "24px", 
              marginBottom: 24,
              opacity: 0.9
            }}>
              Whether you're a new or seasoned freelancer or a client looking to hire someone through flexible work models such as fractional roles, project-based work or freelance consulting, our blog is your go-to resource for thriving in the fast-paced world of the Gig economy. We offer expert tips, valuable insights, and actionable advice to help you build your brand, attract clients, set competitive rates, negotiate contracts, and manage your finances.
            </p>
            <p style={{ 
              color: "white", 
              fontSize: 16, 
              fontFamily: "Open Sans, sans-serif", 
              fontWeight: 400, 
              lineHeight: "24px",
              opacity: 0.9
            }}>
              With success stories from freelancers and clients, you'll gain inspiration and practical strategies to excel. From navigating the ups and downs of freelancing to leveraging the right tools and resources, we've got everything you need to succeed in this dynamic industry.
            </p>
          </div>
        </div>
      </section>
      
      {/* Blog Cards Grid Section */}
      <section style={{ padding: "40px 80px", background: "transparent" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>

          
          <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
            {/* Article Card 1 - Professional Development & Career Transition */}
            <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              {/* Article image with category tag */}
                             <div style={{ position: "relative" }}>
                 <img
                   src="/images/BlogPage/BlogP1.png"
                   alt="Professional development article"
                   style={{
                     width: "100%",
                     height: 200,
                     objectFit: "cover",
                     display: "block",
                   }}
                 />
               </div>
              {/* Article content area */}
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
                  Remote, Hybrid, or In-Office? Choosing the Right Work Mode
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                Is remote work the future, or is hybrid the best balance? Discover insights from 23 years of global experience on how work models impact career growth, flexibility, and the evolving job market...
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | July 15, 2024</span>
                </div>
                {/* Content separator */}
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
                                   <a href="/blog/article" style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  Read More
                  <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 19.5676L16 11.5676L8 3.56763" stroke="#012E46" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                 </div>
               </div>
             </div>

            {/* Article Card 2 - Technology & AI Impact */}
            <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              {/* Article image with category tag */}
                             <div style={{ position: "relative" }}>
                 <img
                   src="/images/BlogPage/BlogP2.png"
                   alt="AI and technology article"
                   style={{
                     width: "100%",
                     height: 200,
                     objectFit: "cover",
                     display: "block",
                   }}
                 />
               </div>
              {/* Article content area */}
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
                   This article updates readers on GigExecs' progress since launching its Beta version, showcasing a growing network of senior professionals from diverse…
                 </p>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | January 22, 2024</span>
                 </div>
                {/* Content separator */}
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

            {/* Article Card 3 - Work Models & Career Flexibility */}
            <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              {/* Article image */}
                               <img
                   src="/images/BlogPage/BlogP3.png"
                   alt="Work models comparison article"
                   style={{
                     width: "100%",
                     height: 200,
                     objectFit: "cover",
                     display: "block",
                   }}
                 />
              {/* Article content area */}
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
                   The rise of AI is transforming industries, sparking both excitement and concern—especially for senior professionals. Will AI replace jobs, or can it be leveraged as an opportunity?…
                </p>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | July 14, 2024</span>
                 </div>
                {/* Content separator */}
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
           </div>
           
           {/* Spacing-5 (20px) between rows */}
           <div style={{ height: 20 }} />
           
           {/* Second Row - 3 cards */}
           <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
             {/* Article Card 4 */}
             <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
               <div style={{ position: "relative" }}>
                 <img
                   src="/images/BlogPage/BlogP4.png"
                   alt="Career transition article"
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
                   The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a viable…
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
             
             {/* Article Card 5 */}
             <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
               <div style={{ position: "relative" }}>
                 <img
                   src="/images/BlogPage/BlogP5.png"
                   alt="Success story article"
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
                   Discover how the gig economy empowers senior professionals to find purpose and make meaningful impact in the second half of life through flexible, purpose-drive…
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
             
             {/* Article Card 6 */}
             <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
               <div style={{ position: "relative" }}>
                 <img
                   src="/images/BlogPage/BlogP6.png"
                   alt="Networking article"
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
                   Discover how GigExecs is building the future of flexible work for senior professionals, connecting experienced talent with businesses worldwide through innovative…
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
           </div>
           
           {/* Spacing-5 (20px) between rows */}
           <div style={{ height: 20 }} />
           
           {/* Third Row - 3 cards */}
           <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
             {/* Article Card 7 */}
             <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
               <div style={{ position: "relative" }}>
                 <img
                   src="/images/BlogPage/BlogP7.png"
                   alt="Financial planning article"
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
                   Explore how AI and robotics are reshaping the workforce in 2025 and beyond, and discover strategies for professionals to adapt and thrive in the AI-driven future of work…
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
             
             {/* Article Card 8 */}
             <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
               <div style={{ position: "relative" }}>
                 <img
                   src="/images/BlogPage/BlogP8.png"
                   alt="Client relations article"
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
                   Explore the future of senior work through flexible models, freelancing opportunities, and how experienced professionals can thrive in the evolving workforce landscape…
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
             
             {/* Article Card 9 */}
             <div style={{ flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
               <div style={{ position: "relative" }}>
                 <img
                   src="/images/BlogPage/BlogP9.png"
                   alt="Productivity article"
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
                   Discover the 20% challenge for businesses in 2025: converting senior roles to flexible work positions to unlock top talent, save costs, and drive innovation…
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
           
           {/* Spacing-5 (20px) between rows */}
           <div style={{ height: 20 }} />
           
           {/* Fourth Row - 1 card aligned left */}
           <div style={{ display: "flex", justifyContent: "flex-start" }}>
             {/* Article Card 10 */}
             <div style={{ width: "400px", background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
               <div style={{ position: "relative" }}>
                 <img
                   src="/images/BlogPage/BlogP10.png"
                   alt="Industry trends article"
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
                   Master Mental Clarity: Management Strategies for High Performers Who Give It Their All
                 </h3>
                 <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                   Discover proven stress management strategies for high performers to prevent burnout, maintain mental clarity...
                 </p>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <span style={{ color: "#999", fontSize: 14 }}>Nuno G. Rodrigues | November 23, 2024</span>
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
                   <a href="/blog/master-mental-clarity" style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
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
      
      {/* Blog Page Footer */}
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
        <div style={{
          width: 1,
          height: 20,
          background: "rgba(255, 255, 255, 0.3)"
        }}></div>
        
        {/* Copyright */}
        <span style={{
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: 14,
          fontFamily: "Open Sans, sans-serif",
          fontWeight: 400
        }}>
          Copyright notice
        </span>
        
        {/* Separator */}
        <div style={{
          width: 1,
          height: 20,
          background: "rgba(255, 255, 255, 0.3)"
        }}></div>
        
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

export default Blog 