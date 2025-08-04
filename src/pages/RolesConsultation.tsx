import React, { useState } from "react"

const RolesConsultation = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]) // All items start expanded

  const toggleAccordion = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "url('/background/Background.svg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      zIndex: 1
    }}>
      {/* Consultant Section */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px"
      }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: 700,
          fontFamily: "Open Sans, sans-serif",
          lineHeight: "44px",
          margin: 0,
          color: "white"
        }}>
          Consultant
        </h2>

        {/* Search Bar */}
        <div style={{
          width: "100%",
          height: "64px",
          background: "white",
          borderRadius: "20px",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.0151 19.0678C14.0151 19.6781 13.6148 20.4784 13.1046 20.7886L11.694 21.699C10.3834 22.5094 8.56254 21.5989 8.56254 19.9782V14.6258C8.56254 13.9154 8.16236 13.005 7.75217 12.5048L3.91039 8.46294C3.40015 7.95271 3 7.05231 3 6.44203V4.12096C3 2.91041 3.91044 2 5.02094 2H18.367C19.4775 2 20.388 2.91041 20.388 4.02091V6.24193C20.388 7.0523 19.8778 8.06277 19.3775 8.563" stroke="#013957" strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.0151 19.0678C14.0151 19.6781 13.6148 20.4784 13.1046 20.7886L11.694 21.699C10.3834 22.5094 8.56254 21.5989 8.56254 19.9782V14.6258C8.56254 13.9154 8.16236 13.005 7.75217 12.5048L3.91039 8.46294C3.40015 7.95271 3 7.05231 3 6.44203V4.12096C3 2.91041 3.91044 2 5.02094 2H18.367C19.4775 2 20.388 2.91041 20.388 4.02091V6.24193C20.388 7.0523 19.8778 8.06277 19.3775 8.563" stroke="black" strokeOpacity="0.2" strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.764 16.5162C17.5321 16.5162 18.9654 15.0829 18.9654 13.3147C18.9654 11.5466 17.5321 10.1133 15.764 10.1133C13.9959 10.1133 12.5625 11.5466 12.5625 13.3147C12.5625 15.0829 13.9959 16.5162 15.764 16.5162Z" stroke="#013957" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.764 16.5162C17.5321 16.5162 18.9654 15.0829 18.9654 13.3147C18.9654 11.5466 17.5321 10.1133 15.764 10.1133C13.9959 10.1133 12.5625 11.5466 12.5625 13.3147C12.5625 15.0829 13.9959 16.5162 15.764 16.5162Z" stroke="black" strokeOpacity="0.2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.5669 17.1176L18.5664 16.1172" stroke="#013957" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.5669 17.1176L18.5664 16.1172" stroke="black" strokeOpacity="0.2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search for help..." 
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontFamily: "Open Sans, sans-serif",
              background: "transparent"
            }}
          />
        </div>

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
              What qualifications do I need to become a consultant on GigExecs?
            </h3>
            {expandedItems.includes(0) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                You need minimum 15 years of professional experience in your field, a proven track record of successful projects, and expertise in your domain. We also look for strong communication skills, problem-solving abilities, and a commitment to delivering high-quality work.
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
              How do I set my rates as a consultant?
            </h3>
            {expandedItems.includes(1) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Set rates based on your expertise, market demand, and project complexity. Consider your experience level, the value you provide, and industry standards. Start with competitive rates and adjust based on client feedback and project success.
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
              What types of projects can I work on as a consultant?
            </h3>
            {expandedItems.includes(2) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                You can work on strategic consulting, process optimization, technology implementation, business transformation, and specialized advisory projects. The platform offers diverse opportunities across industries and project types.
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
              How do I communicate effectively with clients?
            </h3>
            {expandedItems.includes(3) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Maintain clear, professional communication through regular updates, detailed project plans, and transparent progress reports. Use the platform's messaging tools and schedule regular check-ins to ensure alignment and address any concerns promptly.
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

        {/* FAQ Accordion 5 */}
        <div style={{
          width: "100%",
          background: "white",
          borderRadius: "20px",
          padding: "32px 40px",
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          cursor: "pointer"
        }} onClick={() => toggleAccordion(4)}>
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
              What should I include in my consultant profile?
            </h3>
            {expandedItems.includes(4) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Include your professional summary, key achievements, relevant certifications, industry expertise, and examples of successful projects. Highlight your unique value proposition and the specific problems you solve for clients.
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
                transform: expandedItems.includes(4) ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            >
              <path d="M8 9L14 15L20 9" stroke="#013957" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 9L14 15L20 9" stroke="black" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* FAQ Accordion 6 */}
        <div style={{
          width: "100%",
          background: "white",
          borderRadius: "20px",
          padding: "32px 40px",
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          cursor: "pointer"
        }} onClick={() => toggleAccordion(5)}>
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
              Can I work on multiple projects simultaneously?
            </h3>
            {expandedItems.includes(5) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                You can take on multiple projects simultaneously, but ensure you can deliver quality work within agreed timelines. Be transparent with clients about your availability and avoid overcommitting to maintain professional standards.
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
                transform: expandedItems.includes(5) ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            >
              <path d="M8 9L14 15L20 9" stroke="#013957" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 9L14 15L20 9" stroke="black" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* FAQ Accordion 7 */}
        <div style={{
          width: "100%",
          background: "white",
          borderRadius: "20px",
          padding: "32px 40px",
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          cursor: "pointer"
        }} onClick={() => toggleAccordion(6)}>
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
              How can I build long-term relationships with clients as a consultant?
            </h3>
            {expandedItems.includes(6) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Deliver exceptional results, maintain open communication, provide value beyond expectations, and follow up after project completion. Build trust through reliability, expertise, and consistent quality. Consider offering ongoing support or additional services.
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
                transform: expandedItems.includes(6) ? 'rotate(180deg)' : 'rotate(0deg)',
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
  )
}

export default RolesConsultation 