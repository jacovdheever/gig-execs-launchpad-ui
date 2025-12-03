import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Pricing = () => {
  return (
    <div style={{
      background: `url('/background/PricingBackground.svg') center center / cover no-repeat`,
      minHeight: "100vh"
    }}> 
      <Header />
      
      {/* Main Content */}
      <main
        style={{
          width: "100%",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "40px 80px",
          position: "relative",
        }}
      >
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
            Pricing
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
            Flexible Pricing to Access World-Class Freelance Talent
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
              At GigExecs, we connect businesses with highly experienced professionals and senior freelancers across industries. Whether you need strategic leadership, specialized project expertise, or flexible contractor support, our transparent pricing ensures you get top talent without unnecessary overheads.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>Why Choose GigExecs Over Traditional Freelance Platforms?</strong>
            </p>
            <p>
              While general freelance platforms offer broad talent pools, GigExecs specializes in expert talent for leadership, transformation, and specialized projects. Our pricing is competitive for premium expertise, ensuring you access the right skills at the right time. Enterprises looking for strategic leadership on a flexible basis can benefit from tailored pricing structures that align with their specific needs—ensuring they get high-impact expertise without the long-term overhead. Explore what we can offer to Client Organizations.
            </p>
          </div>
        </div>

        {/* Pricing Cards Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            padding: "0px",
            gap: 24,
            width: "100%",
            maxWidth: 1280,
          }}
        >
          {/* Professionals Card */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "32px 40px",
              gap: 16,
              background: "linear-gradient(104.36deg, rgba(255, 255, 255, 0.21) 1.09%, rgba(0, 0, 0, 0.117) 50.13%, rgba(255, 255, 255, 0.21) 99.17%)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 24,
              backdropFilter: "blur(5px)",
            }}
          >
            {/* Image */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/Pricing/Professionals.png"
                alt="Professionals"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            
            {/* Title */}
            <h3
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: 20,
                lineHeight: "31px",
                textAlign: "center",
                letterSpacing: "0.04em",
                color: "#CC9B0A",
                margin: 0,
              }}
            >
              Professionals
            </h3>
            
            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
            
            {/* Registration */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                Registration
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: "49px",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                Free
              </div>
            </div>
            
            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
            
            {/* Bid for Projects */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                Bid for Projects
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: "49px",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                Free
              </div>
            </div>
            
            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
            
            {/* Commission */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                Commission
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: "49px",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                10%
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                on earned revenue
              </div>
            </div>
            
            {/* CTA Button */}
            <button
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px 24px",
                gap: 8,
                width: 302,
                height: 54,
                background: "#CC9B0A",
                borderRadius: 0,
                border: "none",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: 18,
                lineHeight: "120%",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              Get Started
            </button>
          </div>

          {/* Small and Medium Businesses Card */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "32px 40px",
              gap: 16,
              background: "linear-gradient(104.36deg, rgba(255, 255, 255, 0.21) 1.09%, rgba(0, 0, 0, 0.117) 50.13%, rgba(255, 255, 255, 0.21) 99.17%)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 24,
              backdropFilter: "blur(5px)",
            }}
          >
            {/* Image */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/Pricing/SmallMediumBusiness.png"
                alt="Small and Medium Businesses"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            
            {/* Title */}
            <h3
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: 20,
                lineHeight: "31px",
                textAlign: "center",
                letterSpacing: "0.04em",
                color: "#CC9B0A",
                margin: 0,
              }}
            >
              Small and Medium Businesses
            </h3>
            
            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
            
            {/* Registration */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                Registration
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: "49px",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                Free
              </div>
            </div>
            
            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
            
            {/* Post Projects */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                Post Projects
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: "49px",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                Free
              </div>
            </div>
            
            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
            
            {/* Service Fee */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                Service fee
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: "49px",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                10%
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                on amount invoiced by professionals
              </div>
            </div>
            
            {/* CTA Button */}
            <button
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px 24px",
                gap: 8,
                width: 302,
                height: 54,
                background: "#CC9B0A",
                borderRadius: 0,
                border: "none",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: 18,
                lineHeight: "120%",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              Get Started
            </button>
          </div>

          {/* Enterprise Card */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "32px 40px",
              gap: 16,
              background: "linear-gradient(104.36deg, rgba(255, 255, 255, 0.21) 1.09%, rgba(0, 0, 0, 0.117) 50.13%, rgba(255, 255, 255, 0.21) 99.17%)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 24,
              backdropFilter: "blur(5px)",
            }}
          >
            {/* Image */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/Pricing/Enterprise.png"
                alt="Enterprise"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            
            {/* Title */}
            <h3
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: 20,
                lineHeight: "31px",
                textAlign: "center",
                letterSpacing: "0.04em",
                color: "#CC9B0A",
                margin: 0,
              }}
            >
              Enterprise
            </h3>
            
            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
            
            {/* Registration */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                Registration
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: "49px",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                Free
              </div>
            </div>
            
            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
            
            {/* Post Projects */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                Post Projects
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: "49px",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                Free
              </div>
            </div>
            
            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
            
            {/* Fees */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                Fees
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: "49px",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                Customized
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "25px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                }}
              >
                to fit your needs
              </div>
            </div>
            
            {/* CTA Button */}
            <button
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px 24px",
                gap: 8,
                width: 302,
                height: 54,
                background: "#CC9B0A",
                borderRadius: 0,
                border: "none",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: 18,
                lineHeight: "120%",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              Book a Call
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing; 