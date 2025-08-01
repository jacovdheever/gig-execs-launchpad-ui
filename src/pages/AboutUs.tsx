import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <div style={{
      background: `url('/background/BlogBackground.svg') center center / cover no-repeat`,
      minHeight: "100vh"
    }}> 
      <Header />
      
      {/* Main Content */}
      <main
        style={{
          width: "100%",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "40px 40px",
          position: "relative",
        }}
      >
        {/* Breadcrumbs */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "0px",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <a href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "120%",
                color: "#CC9B0A",
                cursor: "pointer",
              }}
            >
              Home
            </span>
          </a>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "120%",
              color: "#FFFFFF",
            }}
          >
            &gt;
          </span>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "120%",
              color: "#FFFFFF",
            }}
          >
            About Us
          </span>
        </div>

        {/* Page Heading */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "0px",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "2px",
              gap: 10,
              width: 24,
              height: 24,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                position: "relative",
              }}
            >
              {/* Three colored dots */}
              <div
                style={{
                  position: "absolute",
                  left: "43.79%",
                  right: "18.85%",
                  top: "14.41%",
                  bottom: "48.23%",
                  background: "#4885AA",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "18.86%",
                  right: "58.02%",
                  top: "53.58%",
                  bottom: "23.29%",
                  background: "#CC9B0A",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "56.28%",
                  right: "24.21%",
                  top: "66.03%",
                  bottom: "14.45%",
                  background: "#FFFFFF",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
          
          {/* Title */}
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: 40,
              lineHeight: "120%",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            About GigExecs – The Freelance Marketplace for Experienced Professionals
          </h1>
        </div>

        {/* Introduction Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 32,
          }}
        >
          {/* Sub-heading */}
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: 18,
              lineHeight: "120%",
              color: "#CC9B0A",
              margin: 0,
            }}
          >
            The Story Behind GigExecs - The Premium Freelance Marketplace
          </h2>
          
          {/* Description paragraphs */}
          <div
            style={{
              fontFamily: "Open Sans, sans-serif",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: "normal",
              color: "#FFFFFF",
              maxWidth: 1280,
            }}
          >
            <p style={{ marginBottom: 12 }}>
            At GigExecs, we connect businesses, startups, and enterprises with a curated network of highly experienced freelancers, senior consultants, and interim executives. Whether you need specialist skills for a high-impact project or fractional leadership to drive change, GigExecs ensures you get access to top-tier professionals with the experience to deliver results. We’re not a generic freelance platform. Our focus is senior talent with at least 15 years of proven industry experience in strategy, operations, technology, marketing, finance, and executive leadership across various industries.
            </p>


            <h2 style={{
              fontFamily: "Montserrat, sans-serif",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: 18,
              lineHeight: "120%",
              color: "#CC9B0A",
              margin: 0,
            }}>
              <strong>Our Mission – Empowering Businesses with Proven Expertise</strong>
            </h2>
            <h2>
            At GigExecs, our mission is to help businesses thrive by providing on-demand access to the best senior talent globally. We believe experience matters, especially when tackling complex challenges, entering new markets, or delivering critical projects. By using technology to simplify the way businesses access their skills and expertise, we are fostering a global community where experience is valued, ageism is challenged, and impactful work is executed.
            </h2>
          </div>
        </div>

{/* Introduction Section */}
<div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 16,
          }}
        >


        </div>
        
        <div>
        <h2 style={{
              fontFamily: "Montserrat, sans-serif",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: 18,
              lineHeight: "120%",
              color: "#CC9B0A",
              marginBottom: 16,
            }}>
              <strong>Meet the Team</strong>
            </h2>
            
            </div>
        {/* Team Cards Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: "0px",
            gap: 24,
            width: "100%",
            maxWidth: 1280,
          }}
        >
          {/* Nuno G. Rodrigues Card 1 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "32px 40px",
              gap: 24,
              width: 628,
              height: 606,
              background: "#FFFFFF",
              borderRadius: 24,
            }}
          >
            {/* Profile Image */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                background: "url('/images/AboutUs/Nuno.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            
            {/* Name and Title */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0px",
                width: 548,
                height: 39,
              }}
            >
              <div
                style={{
                  width: 177,
                  height: 22,
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 700,
                  fontSize: 18,
                  lineHeight: "120%",
                  color: "#CC9B0A",
                  textAlign: "center",
                }}
              >
                Nuno G. Rodrigues
              </div>
              <div
                style={{
                  width: 548,
                  height: 17,
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: "120%",
                  textAlign: "center",
                  color: "#012E46",
                }}
              >
                Co-Founder, Chief Executive Officer
              </div>
            </div>
            
            {/* Divider */}
            <div
              style={{
                width: 548,
                height: 0,
                opacity: 0.3,
                border: "1px solid #012E46",
              }}
            />
            
            {/* Biography */}
            <div
              style={{
                width: 548,
                height: 153,
                fontFamily: "Montserrat, sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "120%",
                color: "#012E46",
                textAlign: "left",
              }}
            >
              With over 20 years of international experience, Nuno has held senior and executive roles in commercial, financial, and strategic leadership across blue-chip companies, mid-tier firms, and startups. He has originated and led deals exceeding $1 billion and has mentored over 60 entrepreneurs worldwide. Holding an MBA from London Business School, he brings a deep understanding of business growth and innovation.
              <br /><br />
              Outside of work, he's a dedicated husband and father of four, passionate about sports, great food, and building businesses that make an impact.
            </div>
            
            {/* Social Media Links */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "4px 0px",
                gap: 16,
                width: 548,
                height: 32,
              }}
            >
              {/* X (Twitter) Icon */}
              <a href="https://x.com/NunoG_Rodrigues" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_826_68838)">
                      <path d="M18.3173 2.06024H21.6747L14.3414 10.498L23 21.9398H16.1968L10.8956 15.004L4.7992 21.9398H1.44177L9.30522 12.9277L1 2.06024H7.97992L12.7952 8.42169L18.3173 2.06024ZM17.1245 19.9076H18.9799L6.96386 3.95984H4.93173L17.1245 19.9076Z" fill="#012E46"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_826_68838">
                        <rect width="22" height="19.8795" fill="white" transform="translate(1 2.06024)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </a>
              
              {/* LinkedIn Icon */}
              <a href="https://www.linkedin.com/in/nuno-g-rodrigues-210a59/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.99417 23V8.15664H1.27824V23H5.99417ZM3.63682 6.12881C5.28134 6.12881 6.30499 4.98901 6.30499 3.56465C6.27435 2.10816 5.28141 1 3.66802 1C2.05489 1 1 2.10818 1 3.56465C1 4.98908 2.02339 6.12881 3.60603 6.12881H3.63667H3.63682ZM8.60443 23H13.3204V14.7107C13.3204 14.2671 13.351 13.8239 13.4755 13.5068C13.8165 12.6205 14.5924 11.7024 15.8952 11.7024C17.6017 11.7024 18.2844 13.0636 18.2844 15.059V22.9999H23V14.4888C23 9.92955 20.6734 7.80816 17.5706 7.80816C15.0266 7.80816 13.9095 9.29584 13.289 10.3091H13.3205V8.15633H8.60453C8.66642 9.54915 8.60453 22.9997 8.60453 22.9997L8.60443 23Z" fill="#012E46"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Jaco Card 2 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "32px 40px",
              gap: 24,
              width: 628,
              height: 606,
              background: "#FFFFFF",
              borderRadius: 24,
            }}
          >
            {/* Profile Image */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                background: "url('/images/AboutUs/Jaco.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            
            {/* Name and Title */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0px",
                width: 548,
                height: 39,
              }}
            >
              <div
                style={{
                  width: 200,
                  height: 22,
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 700,
                  fontSize: 18,
                  lineHeight: "120%",
                  color: "#CC9B0A",
                  textAlign: "center",
                }}
              >
                Jaco van den Heever
              </div>
              <div
                style={{
                  width: 548,
                  height: 17,
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: "120%",
                  textAlign: "center",
                  color: "#012E46",
                }}
              >
                Co-Founder, Chief Experience Officer
              </div>
            </div>
            
            {/* Divider */}
            <div
              style={{
                width: 548,
                height: 0,
                opacity: 0.3,
                border: "1px solid #012E46",
              }}
            />
            
            {/* Biography */}
            <div
              style={{
                width: 548,
                height: 153,
                fontFamily: "Montserrat, sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "120%",
                color: "#012E46",
                textAlign: "left",
              }}
            >
              With 19 years of professional experience across multiple industries and continents, Jaco has held senior leadership roles in design, IT, and product management for multinational blue-chips, mid-tier companies, and startups. He holds an MBA from Wits Business School and is a Certified Experience Architect (CXA), bringing a strong blend of strategic thinking and user-centered design expertise.
              <br /><br />
              Outside of work, he is a devoted husband and father of three, passionate about cooking, football, and family time. He finds fulfilment in making a difference through charity work and helping others thrive.
            </div>
            
            {/* Social Media Links */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "4px 0px",
                gap: 16,
                width: 548,
                height: 32,
              }}
            >
              {/* X (Twitter) Icon */}
              <a href="https://x.com/jacovdh" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_826_68838)">
                      <path d="M18.3173 2.06024H21.6747L14.3414 10.498L23 21.9398H16.1968L10.8956 15.004L4.7992 21.9398H1.44177L9.30522 12.9277L1 2.06024H7.97992L12.7952 8.42169L18.3173 2.06024ZM17.1245 19.9076H18.9799L6.96386 3.95984H4.93173L17.1245 19.9076Z" fill="#012E46"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_826_68838">
                        <rect width="22" height="19.8795" fill="white" transform="translate(1 2.06024)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </a>
              
              {/* LinkedIn Icon */}
              <a href="https://www.linkedin.com/in/jacovdh/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.99417 23V8.15664H1.27824V23H5.99417ZM3.63682 6.12881C5.28134 6.12881 6.30499 4.98901 6.30499 3.56465C6.27435 2.10816 5.28141 1 3.66802 1C2.05489 1 1 2.10818 1 3.56465C1 4.98908 2.02339 6.12881 3.60603 6.12881H3.63667H3.63682ZM8.60443 23H13.3204V14.7107C13.3204 14.2671 13.351 13.8239 13.4755 13.5068C13.8165 12.6205 14.5924 11.7024 15.8952 11.7024C17.6017 11.7024 18.2844 13.0636 18.2844 15.059V22.9999H23V14.4888C23 9.92955 20.6734 7.80816 17.5706 7.80816C15.0266 7.80816 13.9095 9.29584 13.289 10.3091H13.3205V8.15633H8.60453C8.66642 9.54915 8.60453 22.9997 8.60453 22.9997L8.60443 23Z" fill="#012E46"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs; 