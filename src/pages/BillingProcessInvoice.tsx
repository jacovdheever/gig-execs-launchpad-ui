import React, { useState } from "react"

const BillingProcessInvoice = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([0, 1, 2, 3]) // All items start expanded
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(true) // Track welcome banner visibility

  const toggleAccordion = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  const dismissWelcomeBanner = () => {
    setShowWelcomeBanner(false)
  }

  return (
    <>
      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <div style={{
          width: "100%",
          height: "224px",
          background: "url('/images/Help/WelcomeBanner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "24px",
            height: "24px",
            cursor: "pointer"
          }} onClick={dismissWelcomeBanner}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="#013957" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div style={{
            position: "absolute",
            left: "99px",
            top: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "268px"
          }}>
            <h3 style={{
              fontSize: "20px",
              fontWeight: 700,
              fontFamily: "Open Sans, sans-serif",
              lineHeight: "27px",
              margin: 0,
              color: "#013957"
            }}>
              Hi Amy, welcome to our help and support service!
            </h3>
            <p style={{
              fontSize: "14px",
              fontWeight: 400,
              fontFamily: "Open Sans, sans-serif",
              lineHeight: "19px",
              letterSpacing: "0.04em",
              margin: 0,
              color: "#013957"
            }}>
              Please give us your feedback so that we can improve our support service.
            </p>
            <button style={{
              width: "268px",
              height: "52px",
              background: "#CC9B0A",
              borderRadius: "2px",
              border: "none",
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "Open Sans, sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              Rate Our Service
            </button>
          </div>
        </div>
      )}

      {/* Billing Process & Invoicing Section */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px"
      }}>
        <h2 style={{
          color: "white",
          fontSize: "30px",
          fontWeight: 700,
          fontFamily: "Montserrat, sans-serif",
          letterSpacing: "0.04em",
          margin: 0
        }}>
          Billing Process & Invoicing
        </h2>

        {/* Search Bar */}
        <div style={{
          width: "100%",
          height: "40px",
          background: "white",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: "8px"
        }}>
          <input 
            type="text"
            placeholder="Search our collection of frequently asked questions and other helpful resources..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 400,
              lineHeight: "25px",
              letterSpacing: "0.04em",
              opacity: 0.3
            }}
          />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.0151 19.0678C14.0151 19.6781 13.6148 20.4784 13.1046 20.7886L11.694 21.699C10.3834 22.5094 8.56254 21.5989 8.56254 19.9782V14.6258C8.56254 13.9154 8.16236 13.005 7.75217 12.5048L3.91039 8.46294C3.40015 7.95271 3 7.05231 3 6.44203V4.12096C3 2.91041 3.91044 2 5.02094 2H18.367C19.4775 2 20.388 2.91041 20.388 4.02091V6.24193C20.388 7.0523 19.8778 8.06277 19.3775 8.563" stroke="#013957" strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.0151 19.0678C14.0151 19.6781 13.6148 20.4784 13.1046 20.7886L11.694 21.699C10.3834 22.5094 8.56254 21.5989 8.56254 19.9782V14.6258C8.56254 13.9154 8.16236 13.005 7.75217 12.5048L3.91039 8.46294C3.40015 7.95271 3 7.05231 3 6.44203V4.12096C3 2.91041 3.91044 2 5.02094 2H18.367C19.4775 2 20.388 2.91041 20.388 4.02091V6.24193C20.388 7.0523 19.8778 8.06277 19.3775 8.563" stroke="black" strokeOpacity="0.2" strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.764 16.5162C17.5321 16.5162 18.9654 15.0829 18.9654 13.3147C18.9654 11.5466 17.5321 10.1133 15.764 10.1133C13.9959 10.1133 12.5625 11.5466 12.5625 13.3147C12.5625 15.0829 13.9959 16.5162 15.764 16.5162Z" stroke="#013957" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.764 16.5162C17.5321 16.5162 18.9654 15.0829 18.9654 13.3147C18.9654 11.5466 17.5321 10.1133 15.764 10.1133C13.9959 10.1133 12.5625 11.5466 12.5625 13.3147C12.5625 15.0829 13.9959 16.5162 15.764 16.5162Z" stroke="black" strokeOpacity="0.2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.5669 17.1176L18.5664 16.1172" stroke="#013957" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.5669 17.1176L18.5664 16.1172" stroke="black" strokeOpacity="0.2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* FAQ Accordions */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          {/* FAQ Accordion 1 */}
          <div style={{
            width: "100%",
            background: "white",
            borderRadius: "20px",
            padding: "32px 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            cursor: "pointer"
          }} onClick={() => toggleAccordion(0)}>
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <h3 style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0,
                color: "#1A1A1A"
              }}>
                How does the billing process work on the platform?
              </h3>
              {expandedItems.includes(0) && (
                <p style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  fontFamily: "Open Sans, sans-serif",
                  lineHeight: "22px",
                  margin: 0
                }}>
                  The billing process involves charging clients for services rendered by freelancers or consultants. Clients are billed based on the agreed-upon terms and payment schedule for each project.
                </p>
              )}
            </div>
            <div style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease"
            }}>
              <svg 
                width="27" 
                height="24" 
                viewBox="0 0 27 24" 
                fill="none" 
                style={{
                  transform: expandedItems.includes(0) ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M8 9L14 15L20 9" stroke="#013957" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 9L14 15L20 9" stroke="black" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* FAQ Accordion 2 */}
          <div style={{
            width: "100%",
            background: "white",
            borderRadius: "20px",
            padding: "32px 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            cursor: "pointer"
          }} onClick={() => toggleAccordion(1)}>
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <h3 style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0,
                color: "#1A1A1A"
              }}>
                When will I receive invoices for services rendered?
              </h3>
              {expandedItems.includes(1) && (
                <p style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  fontFamily: "Open Sans, sans-serif",
                  lineHeight: "22px",
                  margin: 0
                }}>
                  Invoices are typically generated upon project completion or at agreed-upon milestones. You'll receive invoices via email or can access them directly on your account dashboard.
                </p>
              )}
            </div>
            <div style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease"
            }}>
              <svg 
                width="27" 
                height="24" 
                viewBox="0 0 27 24" 
                fill="none" 
                style={{
                  transform: expandedItems.includes(1) ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M8 9L14 15L20 9" stroke="#013957" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 9L14 15L20 9" stroke="black" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* FAQ Accordion 3 */}
          <div style={{
            width: "100%",
            background: "white",
            borderRadius: "20px",
            padding: "32px 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            cursor: "pointer"
          }} onClick={() => toggleAccordion(2)}>
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <h3 style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0,
                color: "#1A1A1A"
              }}>
                How do I view and download invoices for my records?
              </h3>
              {expandedItems.includes(2) && (
                <p style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  fontFamily: "Open Sans, sans-serif",
                  lineHeight: "22px",
                  margin: 0
                }}>
                  You can view and download invoices from your account dashboard under the "Billing" or "Invoices" section. Simply click on the invoice you wish to download for a detailed
                </p>
              )}
            </div>
            <div style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease"
            }}>
              <svg 
                width="27" 
                height="24" 
                viewBox="0 0 27 24" 
                fill="none" 
                style={{
                  transform: expandedItems.includes(2) ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M8 9L14 15L20 9" stroke="#013957" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 9L14 15L20 9" stroke="black" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* FAQ Accordion 4 */}
          <div style={{
            width: "100%",
            background: "white",
            borderRadius: "20px",
            padding: "32px 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            cursor: "pointer"
          }} onClick={() => toggleAccordion(3)}>
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <h3 style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0,
                color: "#1A1A1A"
              }}>
                What should I do if I have questions or concerns about an invoice?
              </h3>
              {expandedItems.includes(3) && (
                <p style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  fontFamily: "Open Sans, sans-serif",
                  lineHeight: "22px",
                  margin: 0
                }}>
                  If you have any questions or concerns about an invoice, please reach out to our billing support team for assistance. We're here to help resolve any billing-related issues promptly.
                </p>
              )}
            </div>
            <div style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease"
            }}>
              <svg 
                width="27" 
                height="24" 
                viewBox="0 0 27 24" 
                fill="none" 
                style={{
                  transform: expandedItems.includes(3) ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M8 9L14 15L20 9" stroke="#013957" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 9L14 15L20 9" stroke="black" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
  </>
  )
}

export default BillingProcessInvoice 