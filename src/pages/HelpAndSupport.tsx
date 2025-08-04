import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import RolesConsultation from "./RolesConsultation"
import RolesClient from "./RolesClient"
import BillingProcessInvoice from "./BillingProcessInvoice"
import BillingPaymentMethods from "./BillingPaymentMethods"
import BillingSubManagement from "./BillingSubManagement"
import BillingsRefundsandCredit from "./BillingsRefundsandCredit"
import Milestones from "./Milestones"
import Contracts from "./Contracts"
import Gigs from "./Gigs"
import Disputes from "./Disputes"

const HelpAndSupport = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([0, 1, 2, 3]) // All items start expanded
  const [expandedSidebarItems, setExpandedSidebarItems] = useState<string[]>(['Getting Started']) // Sidebar items start expanded
  const [activeSection, setActiveSection] = useState<string>('Getting Started') // Track active section
  const [activeSubItem, setActiveSubItem] = useState<string>('') // Track active sub-item
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(true) // Track welcome banner visibility
  const [shuffledArticles, setShuffledArticles] = useState<any[]>([])

  // Define all available articles
  const allArticles = [
    {
      id: 1,
      image: "/images/BlogPage/BlogP3.png",
      alt: "Navigating AI article",
      title: "Navigating the AI Revolution: Strategies for Snr Professionals",
      description: "The rise of AI is transforming industries, sparking both excitement and concern—especially for senior professionals. Will AI replace jobs, or...",
      author: "Nuno G. Rodrigues | July 14, 2024",
      link: "/blog/navigating-ai"
    },
    {
      id: 2,
      image: "/images/BlogPage/BlogP4.png",
      alt: "Big anomaly article",
      title: "The Big Anomaly of the Job Market: Older Talent",
      description: "The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a viable solution.",
      author: "Nuno G. Rodrigues | March 15, 2024",
      link: "/blog/big-anomaly"
    },
    {
      id: 3,
      image: "/images/BlogPage/BlogP5.png",
      alt: "Finding purpose article",
      title: "Finding Purpose in the Second Half of Life",
      description: "Discover how the gig economy empowers senior professionals to find purpose and make meaningful impact in the second half of life through flexible, purpose-driven opportunities.",
      author: "Nuno G. Rodrigues | March 8, 2024",
      link: "/blog/finding-purpose"
    },
    {
      id: 4,
      image: "/images/BlogPage/BlogP1.png",
      alt: "Building the future article",
      title: "Building the Future: How Senior Professionals Shape Tomorrow",
      description: "Explore how experienced professionals are leveraging their expertise to build innovative solutions and mentor the next generation in the evolving workplace.",
      author: "Nuno G. Rodrigues | June 20, 2024",
      link: "/blog/building-the-future"
    },
    {
      id: 5,
      image: "/images/BlogPage/BlogP2.png",
      alt: "AI robots buckle up article",
      title: "AI Robots, Buckle Up: The Future of Work is Here",
      description: "As AI and automation reshape industries, discover how senior professionals can adapt and thrive in this new technological landscape.",
      author: "Nuno G. Rodrigues | June 15, 2024",
      link: "/blog/ai-robots-buckle-up"
    },
    {
      id: 6,
      image: "/images/BlogPage/BlogP6.png",
      alt: "Executive freelance platform article",
      title: "The Executive Freelance Platform: A New Era of Work",
      description: "Discover how executive-level professionals are embracing freelance opportunities and creating new career paths in the modern economy.",
      author: "Nuno G. Rodrigues | May 30, 2024",
      link: "/blog/executive-freelance-platform"
    }
  ]

  // Shuffle function
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Randomize articles on component mount
  useEffect(() => {
    const shuffled = shuffleArray(allArticles)
    setShuffledArticles(shuffled.slice(0, 3)) // Take first 3 articles
  }, [])

  const toggleAccordion = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  const toggleSidebarItem = (itemName: string) => {
    setExpandedSidebarItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  const handleSectionClick = (sectionName: string) => {
    setActiveSection(sectionName)
    setActiveSubItem('')
  }

  const handleSubItemClick = (subItemName: string) => {
    setActiveSubItem(subItemName)
    setActiveSection('Roles') // Set parent section to Roles when sub-item is clicked
  }

  const dismissWelcomeBanner = () => {
    setShowWelcomeBanner(false)
  }

  useEffect(() => {
    // Update document title
    document.title = "Help & Support - GigExecs"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get help and support for using GigExecs platform. Find answers to frequently asked questions, learn about roles, billing, milestones, contracts, gigs, and dispute resolution.')
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'GigExecs help, support, FAQ, billing, milestones, contracts, gigs, disputes, platform assistance')
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Help & Support - GigExecs')
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Get help and support for using GigExecs platform. Find answers to frequently asked questions and platform assistance.')
    }
    
    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'Help & Support - GigExecs')
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Get help and support for using GigExecs platform. Find answers to frequently asked questions and platform assistance.')
    }
    
    return () => {
      document.title = "GigExecs - Executive Talent Platform"
    }
  }, [])

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "url('/background/BlogBackground.svg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      zIndex: 1
    }}>
      <Header />
      
      <main style={{
        flex: 1,
        padding: "20px 80px 20px 80px",
        maxWidth: 1320,
        margin: "0 auto",
        width: "100%",
        minHeight: "calc(100vh - 136px - 496px)", // Subtract header and footer heights
        position: "relative",
        zIndex: 2
      }}>
        {/* Breadcrumbs */}
        <div style={{ 
          display: "flex", 
          height: 32, 
          padding: "0px", 
          alignItems: "center", 
          gap: 16, 
          alignSelf: "stretch",
          marginTop: 20,
          marginBottom: "40px"
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
          <span style={{ 
            color: "#ffffff", 
            fontSize: 14, 
            fontFamily: "Montserrat, sans-serif", 
            fontWeight: 400
          }}>
            Help & Support
          </span>
        </div>

        {/* Page Title */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "48px"
        }}>
          <div style={{
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 24, minHeight: 24 }}>
              <path d="M14.9921 3.45825C12.5171 3.45825 10.5088 5.46659 10.5088 7.94159C10.5088 10.4166 12.5171 12.4249 14.9921 12.4249C17.4671 12.4249 19.4755 10.4166 19.4755 7.94159C19.4755 5.46659 17.4671 3.45825 14.9921 3.45825Z" fill="#4885AA"/>
              <path d="M7.30137 12.8594C5.77637 12.8594 4.52637 14.101 4.52637 15.6344C4.52637 17.1677 5.76803 18.4094 7.30137 18.4094C8.82637 18.4094 10.0764 17.1677 10.0764 15.6344C10.0764 14.101 8.82637 12.8594 7.30137 12.8594Z" fill="#CC9B0A"/>
              <path d="M15.8485 15.8477C14.5568 15.8477 13.5068 16.8977 13.5068 18.1893C13.5068 19.481 14.5568 20.531 15.8485 20.531C17.1402 20.531 18.1902 19.481 18.1902 18.1893C18.1902 16.8977 17.1402 15.8477 15.8485 15.8477Z" fill="white"/>
            </svg>
          </div>
          <h1 style={{
            color: "white",
            fontSize: "40px",
            fontWeight: 600,
            fontFamily: "Montserrat, sans-serif",
            margin: 0
          }}>
            Help Centre
          </h1>
        </div>

        {/* Main Content */}
        <div style={{
          display: "flex",
          gap: "44px",
          alignItems: "flex-start",
          minHeight: "calc(100vh - 300px)", // Ensure consistent height
          position: "relative",
          zIndex: 1
        }}>
          {/* Left Column - Help Center */}
          <div style={{
            width: "388px",
            background: "white",
            borderRadius: "20px",
            padding: "32px 40px 40px",
            display: "flex",
            flexDirection: "column",
            gap: "32px"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              <h2 style={{
                color: "#1B365D",
                fontSize: "18px",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "0.04em",
                margin: 0
              }}>
                Help Centre
              </h2>
              
              <div style={{
                width: "100%",
                height: "1px",
                background: "#E5E5E5"
              }}></div>

              {/* Help Menu Items */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                {/* Getting Started */}
                <div 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "46px",
                    padding: "0",
                    cursor: "pointer"
                  }}
                  onClick={() => handleSectionClick('Getting Started')}
                >
                  <span style={{
                    color: activeSection === 'Getting Started' ? "#CC9B0A" : "#1B365D",
                    fontSize: "16px",
                    fontWeight: 600,
                    fontFamily: "Open Sans, sans-serif",
                    flex: 1
                  }}>
                    Getting Started
                  </span>
                </div>
                
                <div style={{
                  width: "100%",
                  height: "1px",
                  background: "#E5E5E5"
                }}></div>

                {/* Roles Accordion */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}>
                  <div 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "46px",
                      padding: "0",
                      cursor: "pointer"
                    }}
                    onClick={() => toggleSidebarItem('Roles')}
                  >
                    <span style={{
                      color: activeSection === 'Roles' ? "#CC9B0A" : "#1B365D",
                      fontSize: "16px",
                      fontWeight: 600,
                      fontFamily: "Open Sans, sans-serif",
                      flex: 1
                    }}>
                      Roles
                    </span>
                    <svg 
                      width="27" 
                      height="24" 
                      viewBox="0 0 27 24" 
                      fill="none" 
                      style={{
                        transform: expandedSidebarItems.includes('Roles') ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <path d="M8 9L14 15L20 9" stroke="#013957" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 9L14 15L20 9" stroke="black" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  {expandedSidebarItems.includes('Roles') && (
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginLeft: "20px"
                    }}>
                      <div 
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "0",
                          cursor: "pointer"
                        }}
                        onClick={() => handleSubItemClick('Consultant')}
                      >
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="#013957"/>
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="black" fillOpacity="0.2"/>
                          <path d="M7.30234 13.3594C5.77734 13.3594 4.52734 14.601 4.52734 16.1344C4.52734 17.6677 5.76901 18.9094 7.30234 18.9094C8.82734 18.9094 10.0773 17.6677 10.0773 16.1344C10.0773 14.601 8.82734 13.3594 7.30234 13.3594Z" fill="#4885AA"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="#FFC20C"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="black" fillOpacity="0.2"/>
                        </svg>
                        <span style={{
                          color: activeSubItem === 'Consultant' ? "#CC9B0A" : "#1B365D",
                          fontSize: "14px",
                          fontWeight: 400,
                          fontFamily: "Open Sans, sans-serif",
                          flex: 1
                        }}>
                          Consultant
                        </span>
                      </div>
                      <div 
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "0",
                          cursor: "pointer"
                        }}
                        onClick={() => handleSubItemClick('Client')}
                      >
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="#013957"/>
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="black" fillOpacity="0.2"/>
                          <path d="M7.30234 13.3594C5.77734 13.3594 4.52734 14.601 4.52734 16.1344C4.52734 17.6677 5.76901 18.9094 7.30234 18.9094C8.82734 18.9094 10.0773 17.6677 10.0773 16.1344C10.0773 14.601 8.82734 13.3594 7.30234 13.3594Z" fill="#4885AA"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="#FFC20C"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="black" fillOpacity="0.2"/>
                        </svg>
                        <span style={{
                          color: activeSubItem === 'Client' ? "#CC9B0A" : "#1B365D",
                          fontSize: "14px",
                          fontWeight: 400,
                          fontFamily: "Open Sans, sans-serif",
                          flex: 1
                        }}>
                          Client
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{
                  width: "100%",
                  height: "1px",
                  background: "#E5E5E5"
                }}></div>

                {/* Billing Accordion */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}>
                  <div 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "46px",
                      padding: "0",
                      cursor: "pointer"
                    }}
                    onClick={() => toggleSidebarItem('Billing')}
                  >
                    <span style={{
                      color: "#1B365D",
                      fontSize: "16px",
                      fontWeight: 600,
                      fontFamily: "Open Sans, sans-serif",
                      flex: 1
                    }}>
                      Billing
                    </span>
                    <svg 
                      width="27" 
                      height="24" 
                      viewBox="0 0 27 24" 
                      fill="none" 
                      style={{
                        transform: expandedSidebarItems.includes('Billing') ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <path d="M8 9L14 15L20 9" stroke="#013957" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 9L14 15L20 9" stroke="black" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  {expandedSidebarItems.includes('Billing') && (
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginLeft: "20px"
                    }}>
                      <div 
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "0",
                          cursor: "pointer"
                        }}
                        onClick={() => handleSubItemClick('Billing Process & Invoicing')}
                      >
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="#013957"/>
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="black" fillOpacity="0.2"/>
                          <path d="M7.30234 13.3594C5.77734 13.3594 4.52734 14.601 4.52734 16.1344C4.52734 17.6677 5.76901 18.9094 7.30234 18.9094C8.82734 18.9094 10.0773 17.6677 10.0773 16.1344C10.0773 14.601 8.82734 13.3594 7.30234 13.3594Z" fill="#4885AA"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="#FFC20C"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="black" fillOpacity="0.2"/>
                        </svg>
                        <span style={{
                          color: activeSubItem === 'Billing Process & Invoicing' ? "#CC9B0A" : "#1B365D",
                          fontSize: "14px",
                          fontWeight: 400,
                          fontFamily: "Open Sans, sans-serif",
                          flex: 1
                        }}>
                          Billing Process & Invoicing
                        </span>
                      </div>
                      <div 
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "0",
                          cursor: "pointer"
                        }}
                        onClick={() => handleSubItemClick('Payment Methods')}
                      >
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="#013957"/>
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="black" fillOpacity="0.2"/>
                          <path d="M7.30234 13.3594C5.77734 13.3594 4.52734 14.601 4.52734 16.1344C4.52734 17.6677 5.76901 18.9094 7.30234 18.9094C8.82734 18.9094 10.0773 17.6677 10.0773 16.1344C10.0773 14.601 8.82734 13.3594 7.30234 13.3594Z" fill="#4885AA"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="#FFC20C"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="black" fillOpacity="0.2"/>
                        </svg>
                        <span style={{
                          color: activeSubItem === 'Payment Methods' ? "#CC9B0A" : "#1B365D",
                          fontSize: "14px",
                          fontWeight: 400,
                          fontFamily: "Open Sans, sans-serif",
                          flex: 1
                        }}>
                          Payment Methods
                        </span>
                      </div>
                      <div 
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "0",
                          cursor: "pointer"
                        }}
                        onClick={() => handleSubItemClick('Subscription Management')}
                      >
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="#013957"/>
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="black" fillOpacity="0.2"/>
                          <path d="M7.30234 13.3594C5.77734 13.3594 4.52734 14.601 4.52734 16.1344C4.52734 17.6677 5.76901 18.9094 7.30234 18.9094C8.82734 18.9094 10.0773 17.6677 10.0773 16.1344C10.0773 14.601 8.82734 13.3594 7.30234 13.3594Z" fill="#4885AA"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="#FFC20C"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="black" fillOpacity="0.2"/>
                        </svg>
                        <span style={{
                          color: activeSubItem === 'Subscription Management' ? "#CC9B0A" : "#1B365D",
                          fontSize: "14px",
                          fontWeight: 400,
                          fontFamily: "Open Sans, sans-serif",
                          flex: 1
                        }}>
                          Subscription Management
                        </span>
                      </div>
                      <div 
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "0",
                          cursor: "pointer"
                        }}
                        onClick={() => handleSubItemClick('Refunds and Credit')}
                      >
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="#013957"/>
                          <path d="M14.9911 3.95703C12.5161 3.95703 10.5078 5.96536 10.5078 8.44036C10.5078 10.9154 12.5161 12.9237 14.9911 12.9237C17.4661 12.9237 19.4745 10.9154 19.4745 8.44036C19.4745 5.96536 17.4661 3.95703 14.9911 3.95703Z" fill="black" fillOpacity="0.2"/>
                          <path d="M7.30234 13.3594C5.77734 13.3594 4.52734 14.601 4.52734 16.1344C4.52734 17.6677 5.76901 18.9094 7.30234 18.9094C8.82734 18.9094 10.0773 17.6677 10.0773 16.1344C10.0773 14.601 8.82734 13.3594 7.30234 13.3594Z" fill="#4885AA"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="#FFC20C"/>
                          <path d="M15.8495 16.3477C14.5578 16.3477 13.5078 17.3977 13.5078 18.6893C13.5078 19.981 14.5578 21.031 15.8495 21.031C17.1411 21.031 18.1911 19.981 18.1911 18.6893C18.1911 17.3977 17.1411 16.3477 15.8495 16.3477Z" fill="black" fillOpacity="0.2"/>
                        </svg>
                        <span style={{
                          color: activeSubItem === 'Refunds and Credit' ? "#CC9B0A" : "#1B365D",
                          fontSize: "14px",
                          fontWeight: 400,
                          fontFamily: "Open Sans, sans-serif",
                          flex: 1
                        }}>
                          Refunds and Credits
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{
                  width: "100%",
                  height: "1px",
                  background: "#E5E5E5"
                }}></div>

                <div 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "46px",
                    padding: "0",
                    cursor: "pointer"
                  }}
                  onClick={() => handleSubItemClick('Milestones')}
                >
                  <span style={{
                    color: activeSubItem === 'Milestones' ? "#CC9B0A" : "#1B365D",
                    fontSize: "16px",
                    fontWeight: 600,
                    fontFamily: "Open Sans, sans-serif",
                    flex: 1
                  }}>
                    Milestones
                  </span>
                </div>
                
                <div style={{
                  width: "100%",
                  height: "1px",
                  background: "#E5E5E5"
                }}></div>

                <div 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "46px",
                    padding: "0",
                    cursor: "pointer"
                  }}
                  onClick={() => handleSubItemClick('Contracts')}
                >
                  <span style={{
                    color: activeSubItem === 'Contracts' ? "#CC9B0A" : "#1B365D",
                    fontSize: "16px",
                    fontWeight: 600,
                    fontFamily: "Open Sans, sans-serif",
                    flex: 1
                  }}>
                    Contracts
                  </span>
                </div>
                
                <div style={{
                  width: "100%",
                  height: "1px",
                  background: "#E5E5E5"
                }}></div>

                <div 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "46px",
                    padding: "0",
                    cursor: "pointer"
                  }}
                  onClick={() => handleSubItemClick('Gigs')}
                >
                  <span style={{
                    color: activeSubItem === 'Gigs' ? "#CC9B0A" : "#1B365D",
                    fontSize: "16px",
                    fontWeight: 600,
                    fontFamily: "Open Sans, sans-serif",
                    flex: 1
                  }}>
                    Gigs
                  </span>
                </div>
                
                <div style={{
                  width: "100%",
                  height: "1px",
                  background: "#E5E5E5"
                }}></div>

                <div 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "46px",
                    padding: "0",
                    cursor: "pointer"
                  }}
                  onClick={() => handleSubItemClick('Disputes')}
                >
                  <span style={{
                    color: activeSubItem === 'Disputes' ? "#CC9B0A" : "#1B365D",
                    fontSize: "16px",
                    fontWeight: 600,
                    fontFamily: "Open Sans, sans-serif",
                    flex: 1
                  }}>
                    Disputes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content Area */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "40px"
          }}>
            {/* Conditional Content Rendering */}
            {activeSubItem === 'Consultant' ? (
              <RolesConsultation />
            ) : activeSubItem === 'Client' ? (
              <RolesClient />
            ) : activeSubItem === 'Billing Process & Invoicing' ? (
              <BillingProcessInvoice />
            ) : activeSubItem === 'Payment Methods' ? (
              <BillingPaymentMethods />
            ) : activeSubItem === 'Subscription Management' ? (
              <BillingSubManagement />
            ) : activeSubItem === 'Refunds and Credit' ? (
              <BillingsRefundsandCredit />
            ) : activeSubItem === 'Milestones' ? (
              <Milestones />
            ) : activeSubItem === 'Contracts' ? (
              <Contracts />
            ) : activeSubItem === 'Gigs' ? (
              <Gigs />
            ) : activeSubItem === 'Disputes' ? (
              <Disputes />
            ) : (
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

            {/* Getting Started Section */}
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
                Getting Started
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
                      margin: 0
                    }}>
                      What is Gigexecs?
                    </h3>
                    {expandedItems.includes(0) && (
                      <p style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        fontFamily: "Open Sans, sans-serif",
                        lineHeight: "22px",
                        margin: 0
                      }}>
                        GigExec is a job marketplace exclusively designed for highly experienced freelancers with at least 10 years of expertise. It provides access to a curated pool of seasoned professionals, ensuring clients receive top-tier quality and expertise for their projects
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
                      margin: 0
                    }}>
                      Understanding Gigs
                    </h3>
                    {expandedItems.includes(1) && (
                      <p style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        fontFamily: "Open Sans, sans-serif",
                        lineHeight: "22px",
                        margin: 0
                      }}>
                        The platform offers a wide range of job opportunities spanning industries such as consultancy, project management, technical expertise, creative services, and more. Clients can find professionals capable of handling diverse projects, from complex technical tasks to strategic consultancy assignments. Each job listing on GigExec is tailored to attract seasoned professionals, ensuring clients access top-tier talent for their projects.
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
                      margin: 0
                    }}>
                      Who are Clients?
                    </h3>
                    {expandedItems.includes(2) && (
                      <p style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        fontFamily: "Open Sans, sans-serif",
                        lineHeight: "22px",
                        margin: 0
                      }}>
                        Clients on GigExec are individuals, businesses, or organizations seeking highly experienced freelancers with at least 10 years of expertise to fulfill their project needs. These clients range from small businesses to large corporations and individuals requiring specialized services. They rely on GigExec to connect them with top-tier talent across various fields, ensuring effective project outcomes.
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
                      Who are Experienced Professionals?
                    </h3>
                    {expandedItems.includes(3) && (
                      <p style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        fontFamily: "Open Sans, sans-serif",
                        lineHeight: "22px",
                        margin: 0
                      }}>
                        A freelancer is a self-employed individual who provides services to clients on a project or contract basis. Freelancers work in a wide range of industries, including writing, design, programming, marketing, consulting, and more. They typically work remotely and can set their own schedules and rates. As independent contractors, freelancers are responsible for finding their own clients, negotiating contracts, and managing their own finances. They may work for multiple clients simultaneously or specialize in a particular niche. Freelancers are often highly skilled and experienced in their field, and they are able to offer flexible and customized services to meet their clients' needs. Freelancing offers many benefits, including the freedom to choose the projects you work on, the ability to set your own rates, and the flexibility to work from anywhere. However, it also requires a high degree of self-discipline, organization, and business savvy to succeed. Freelancers must be able to manage their time effectively, maintain a steady flow of work, and provide high-quality services that meet their clients' expectations.
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
        )}
      </div>
    </div>
  </main>

      {/* Related Articles Section */}
      <div style={{ 
        padding: "0 80px",
        maxWidth: 1320,
        margin: "20px auto 0 auto"
      }}>
        <h2 style={{ 
          color: "white", 
          fontSize: 24, 
          fontFamily: "Montserrat, sans-serif", 
          fontWeight: 700, 
          marginBottom: "32px"
        }}>
          Related Articles
        </h2>
        
        <div style={{ 
          display: "flex", 
          gap: 32, 
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          {shuffledArticles.map((article) => (
            <div key={article.id} style={{ 
              flex: "1 1 350px", 
              maxWidth: "400px",
              background: "rgba(0,0,0,0.1)", 
              borderRadius: 16, 
              overflow: "hidden", 
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)" 
            }}>
              <div style={{ position: "relative" }}>
                <img
                  src={article.image}
                  alt={article.alt}
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
                  {article.title}
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16 }}>
                  {article.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999", fontSize: 14 }}>{article.author}</span>
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
                  <a href={article.link} style={{ color: "#012E46", textDecoration: "none", fontWeight: 600, marginBottom: 16, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    Read More
                    <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 19.5676L16 11.5676L8 3.56763" stroke="#012E46" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default HelpAndSupport 