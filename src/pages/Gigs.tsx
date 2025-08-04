import React, { useState } from "react"

const Gigs = () => {
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
      {/* Gigs Section */}
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
          Gigs
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
              What is a gig on GigExecs?
            </h3>
            {expandedItems.includes(0) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                A gig is a specific project or task that clients post for consultants to bid on. It includes project details, requirements, timeline, and budget. Gigs can range from short-term tasks to long-term projects across various industries and skill sets.
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
              How do I create a gig as a client?
            </h3>
            {expandedItems.includes(1) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Navigate to the "Post a Gig" section, fill in project details including title, description, requirements, budget, and timeline. Be specific about deliverables and expectations to attract the right consultants for your project.
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
              How do I find gigs as a consultant?
            </h3>
            {expandedItems.includes(2) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Browse available gigs in your expertise area, use filters to narrow down opportunities, and submit proposals for projects that match your skills and interests. Set up alerts for new gigs in your preferred categories.
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
              What should I include in my gig proposal?
            </h3>
            {expandedItems.includes(3) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Include your approach to the project, relevant experience, timeline, deliverables, and pricing. Address the client's specific needs and explain how you'll solve their problem. Be clear about what you'll deliver and when.
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
              How do I evaluate gig proposals as a client?
            </h3>
            {expandedItems.includes(4) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Review consultant profiles, experience, and proposal quality. Consider their understanding of your project, proposed approach, timeline, and pricing. Check reviews and ratings from previous clients to assess reliability.
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
              Can I modify a gig after posting it?
            </h3>
            {expandedItems.includes(5) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Yes, you can edit gig details before receiving proposals. However, significant changes after proposals are submitted may require notifying consultants. Be transparent about any modifications to maintain trust and avoid confusion.
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
              What happens if a gig is cancelled?
            </h3>
            {expandedItems.includes(6) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                If a gig is cancelled before work begins, no charges apply. If work has started, compensation depends on the amount completed and platform policies. Both parties should communicate clearly about cancellation reasons and any partial payments.
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

export default Gigs 