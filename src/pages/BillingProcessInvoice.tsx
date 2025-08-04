import React, { useState } from "react"

const BillingProcessInvoice = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([0, 1, 2, 3]) // All items start expanded

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
      {/* Billing Process & Invoicing Section */}
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
          Billing Process & Invoicing
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
              How does the billing process work on GigExecs?
            </h3>
            {expandedItems.includes(0) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                The billing process is straightforward: consultants submit invoices for completed work, clients review and approve them, and payments are processed through our secure platform. All transactions are protected and tracked for transparency.
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
              What information should be included in invoices?
            </h3>
            {expandedItems.includes(1) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Invoices should include project details, hours worked or deliverables completed, hourly rate or project fee, total amount due, payment terms, and consultant contact information. Clear descriptions help clients understand what they're paying for.
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
              How long does payment processing take?
            </h3>
            {expandedItems.includes(2) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                Payment processing typically takes 3-5 business days after client approval. The timeline depends on the payment method used and bank processing times. Consultants receive notifications when payments are processed and deposited.
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
              What if there's a dispute over an invoice?
            </h3>
            {expandedItems.includes(3) && (
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                fontFamily: "Open Sans, sans-serif",
                lineHeight: "22px",
                margin: 0
              }}>
                If there's a dispute, both parties should communicate directly first to resolve the issue. If unresolved, contact platform support for mediation. We review all documentation and work to find a fair resolution for both parties.
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
  )
}

export default BillingProcessInvoice 