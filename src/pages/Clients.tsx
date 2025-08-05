import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Clients = () => {
  // Related Articles state and functions
  const [shuffledArticles, setShuffledArticles] = useState<any[]>([]);

  const allArticles = [
    {
      id: 1,
      title: "Finding Purpose in the Second Half of Life",
      description: "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking...",
      author: "GigExecs Insider | July 15, 2024",
      image: "/images/Blog1.png",
      alt: "Hourglass with blue sand",
      link: "#"
    },
    {
      id: 2,
      title: "Building the Future of Flexible Work for Senior Professionals",
      description: "Learn about our latest platform updates designed specifically for experienced professionals seeking flexible opportunities. Our growing network spans diverse industries globally.",
      author: "Nuno G. Rodrigues | March 15, 2024",
      image: "/images/Blog2.png",
      alt: "Megaphone",
      link: "#"
    },
    {
      id: 3,
      title: "Building the Future of Flexible Work for Senior Professionals",
      description: "Explore how our platform is revolutionizing the way experienced professionals connect with meaningful opportunities. We provide flexible work solutions and address ageism challenges.",
      author: "Nuno G. Rodrigues | June 8, 2024",
      image: "/images/Blog3.png",
      alt: "Man in blue suit speaking",
      link: "#"
    }
  ];

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setShuffledArticles(shuffleArray(allArticles));
  }, []);
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[760px]">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            background:
              "linear-gradient(0deg, rgba(27, 54, 93, 0.4), rgba(27, 54, 93, 0.4)), url('/images/ClientHero.png')",
          }}
        />
        <div className="absolute left-4 sm:left-8 md:left-16 lg:left-20 top-1/2 transform -translate-y-1/2 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl p-4 sm:p-6 md:p-8">
          <div
            className="p-4 sm:p-6 md:p-8 rounded-3xl backdrop-blur-sm border border-white/30"
            style={{
              background:
                "linear-gradient(136deg, rgba(255, 255, 255, 0.21) 0%, rgba(0, 0, 0, 0.12) 50%, rgba(255, 255, 255, 0.21) 100%)",
            }}
          >
            <div className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold font-montserrat leading-tight mb-4">
              Experienced Skills at your Fingertips with GigExecs
            </div>
            <div className="text-white text-sm sm:text-base md:text-lg lg:text-[18px] font-normal font-montserrat leading-relaxed mb-6">
              Reach out to experienced professionals to help solve your challenges and achieve your goals
            </div>
            <div className="inline-flex items-center justify-center px-6 py-4 bg-[#CC9B0A] rounded-lg cursor-pointer hover:bg-[#B88A09] transition-colors">
              <div className="text-center text-white font-bold text-sm sm:text-base">
                Get Started
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Post your job section */}
      <section style={{ padding: "20px 80px 20px 80px", background: "transparent" }}>
        <div style={{ width: "100%", maxWidth: 1320, margin: "0 auto", display: "flex", borderRadius: 24, overflow: "hidden" }}>
        {/* Left: Image */}
        <img
          src="/images/ClientsOldMan.png"
          alt="GigExecs professional"
          style={{ width: "50%", height: 452, objectFit: "cover", borderTopLeftRadius: 24, borderBottomLeftRadius: 24 }}
        />
        {/* Right: Content */}
        <div
          data-bullets-="false"
          data-cta="true"
          data-divider="false"
          style={{
            width: "50%",
            height: 452,
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 32,
            paddingBottom: 32,
            background: "white",
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 24,
          }}
        >
          <div style={{ alignSelf: "stretch", color: "#CC9B0A", fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "21.60px", wordWrap: "break-word" }}>
          Post your job and requirements, hire an experienced freelancer in a flash!
          </div>
          <div style={{ alignSelf: "stretch" }}>
            <span style={{ color: "#012E46", fontSize: 16, fontFamily: "Open Sans, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>
            We designed an easy process to enable you to match quickly the perfect expert to your project needs. Post your job and start receiving offers from skilled profession
            </span>
            <span style={{ color: "#CC9B0A", fontSize: 16, fontFamily: "Open Sans, sans-serif", fontWeight: 400, textDecoration: "underline", lineHeight: "19.20px", wordWrap: "break-word" }}>
            <a href="https://gigexecs.com/signup" target="_blank" rel="noopener noreferrer" style={{ color: "#CC9B0A", textDecoration: "underline" }}>
              
            </a>
            </span>
          </div>
          <a 
            href="https://gigexecs.com/signup" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ textDecoration: "none" }}
          >
            <div
              data-content="Icons & Text"
              data-hierarchy="Primary"
              data-left-icon="false"
              data-right-icon="false"
              data-size="Large"
              data-state="Default"
              data-style="Filled"
              style={{
                paddingLeft: 24,
                paddingRight: 24,
                paddingTop: 16,
                paddingBottom: 16,
                background: "#012E46",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                display: "inline-flex",
                cursor: "pointer",
              }}
            >
              <div style={{ textAlign: "center", color: "white", fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "21.60px", wordWrap: "break-word" }}>
                Create a New Gig
              </div>
            </div>
          </a>
        </div>
      </div>
      </section>

      {/* Spacing-5 (20px) between sections */}
      <div className="h-5" />

      {/* Related Articles Section */}
      <section style={{ padding: "20px 80px 20px 80px", background: "transparent" }}>
        <div style={{ 
          maxWidth: 1320,
          margin: "0 auto"
        }}>
        <h2 style={{ 
          color: "white", 
          fontSize: 24, 
          fontFamily: "Montserrat, sans-serif", 
          fontWeight: 700, 
          marginBottom: "32px"
        }}>
          Join a Community of Successful Businesses and Professionals
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
      </section>

      {/* How to Hire Section */}
      <section style={{ padding: "20px 80px 20px 80px", background: "transparent" }}>
        
      {/* Heading with same styling as homepage but in white */}
      <div style={{ marginBottom: 20 }}>
            <div style={{ color: "white", fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "21.60px", wordWrap: "break-word" }}>
            How to Hire an Experienced Professional in a few Easy Steps: 
            </div>
          </div>
        
        <div style={{ 
          width: '100%', 
          maxWidth: 1440, 
          height: '100%', 
          padding: 32, 
          background: 'linear-gradient(136deg, rgba(255, 255, 255, 0.21) 0%, rgba(0, 0, 0, 0.12) 50%, rgba(255, 255, 255, 0.21) 100%)', 
          borderRadius: 24, 
          outline: '1px rgba(255, 255, 255, 0.30) solid', 
          outlineOffset: -1, 
          backdropFilter: 'blur(5px)', 
          flexDirection: 'column', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start', 
          gap: 32, 
          display: 'inline-flex',
          margin: "0 auto"
        }}>
          


          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, marginBottom: 32, width: "100%" }}>
            {/* Step 1 */}
            <div style={{ textAlign: "center", padding: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.99805 12.4792L11.4071 14.8983L16.2353 10.0601" stroke="white" stroke-width="1.44444" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M11.3667 2.93281C12.0565 2.34303 13.186 2.34303 13.8858 2.93281L15.4652 4.2923C15.7651 4.55221 16.3249 4.76213 16.7247 4.76213H18.4241C19.4837 4.76213 20.3534 5.6318 20.3534 6.6914V8.39077C20.3534 8.78062 20.5633 9.35041 20.8232 9.65029L22.1827 11.2297C22.7724 11.9194 22.7724 13.049 22.1827 13.7487L20.8232 15.3281C20.5633 15.628 20.3534 16.1878 20.3534 16.5876V18.287C20.3534 19.3466 19.4837 20.2163 18.4241 20.2163H16.7247C16.3349 20.2163 15.7651 20.4262 15.4652 20.6861L13.8858 22.0456C13.196 22.6354 12.0665 22.6354 11.3667 22.0456L9.78731 20.6861C9.48743 20.4262 8.92764 20.2163 8.52779 20.2163H6.79843C5.73883 20.2163 4.86916 19.3466 4.86916 18.287V16.5776C4.86916 16.1878 4.65924 15.628 4.40933 15.3281L3.05984 13.7387C2.48005 13.049 2.48005 11.9294 3.05984 11.2396L4.40933 9.65029C4.65924 9.35041 4.86916 8.79062 4.86916 8.40076V6.68141C4.86916 5.6218 5.73883 4.75213 6.79843 4.75213H8.52779C8.91764 4.75213 9.48743 4.54221 9.78731 4.28231L11.3667 2.93281Z" stroke="white" stroke-width="1.44444" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Sign up & get verified</h3>
              <p style={{ color: "white", fontSize: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>Our validation process ensures platform quality.</p>
            </div>

            {/* Step 2 */}
            <div style={{ textAlign: "center", padding: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.81592 18.9596C6.24379 18.9596 5.70917 18.7626 5.32462 18.3968C4.8369 17.9372 4.60242 17.2431 4.68684 16.4928L5.03387 13.4539C5.09952 12.8818 5.44655 12.1221 5.84986 11.7094L13.5502 3.55889C15.4729 1.5236 17.4801 1.46732 19.5154 3.39006C21.5507 5.3128 21.607 7.31996 19.6842 9.35525L11.9839 17.5057C11.59 17.9278 10.8584 18.3217 10.2862 18.4156L7.26612 18.9314C7.10667 18.9408 6.96599 18.9596 6.81592 18.9596ZM16.5609 3.38068C15.8387 3.38068 15.2103 3.83089 14.5725 4.50619L6.87219 12.6662C6.68461 12.8631 6.46889 13.3321 6.43137 13.6041L6.08434 16.6429C6.04682 16.9524 6.12186 17.2056 6.29068 17.3651C6.45951 17.5245 6.71275 17.5808 7.02226 17.5339L10.0424 17.0181C10.3144 16.9712 10.7646 16.7273 10.9522 16.5303L18.6525 8.37981C19.8155 7.14175 20.2376 5.99749 18.54 4.40302C17.7896 3.68082 17.1425 3.38068 16.5609 3.38068Z" fill="white"/>
                  <path d="M17.884 10.9214C17.8653 10.9214 17.8371 10.9214 17.8184 10.9214C14.8921 10.6306 12.5379 8.4078 12.0877 5.50024C12.0314 5.11569 12.294 4.75928 12.6786 4.69362C13.0631 4.63735 13.4195 4.89997 13.4852 5.28452C13.8416 7.55429 15.6799 9.29882 17.9684 9.52392C18.353 9.56144 18.6344 9.90847 18.5968 10.293C18.55 10.6494 18.2404 10.9214 17.884 10.9214Z" fill="white"/>
                  <path d="M21.3165 21.9889H4.43391C4.04936 21.9889 3.73047 21.67 3.73047 21.2855C3.73047 20.9009 4.04936 20.582 4.43391 20.582H21.3165C21.7011 20.582 22.02 20.9009 22.02 21.2855C22.02 21.67 21.7011 21.9889 21.3165 21.9889Z" fill="white"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Browse Job Listings</h3>
              <p style={{ color: "white", fontSize: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>Browse job listings for your perfect opportunity</p>
            </div>

            {/* Step 3 */}
            <div style={{ textAlign: "center", padding: 8 }}>
              <div style={{ width: 40, height: 40,  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.125 10.489H7.125C9.125 10.489 10.125 9.48901 10.125 7.48901V5.48901C10.125 3.48901 9.125 2.48901 7.125 2.48901H5.125C3.125 2.48901 2.125 3.48901 2.125 5.48901V7.48901C2.125 9.48901 3.125 10.489 5.125 10.489Z" stroke="white" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17.125 10.489H19.125C21.125 10.489 22.125 9.48901 22.125 7.48901V5.48901C22.125 3.48901 21.125 2.48901 19.125 2.48901H17.125C15.125 2.48901 14.125 3.48901 14.125 5.48901V7.48901C14.125 9.48901 15.125 10.489 17.125 10.489Z" stroke="white" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17.125 22.489H19.125C21.125 22.489 22.125 21.489 22.125 19.489V17.489C22.125 15.489 21.125 14.489 19.125 14.489H17.125C15.125 14.489 14.125 15.489 14.125 17.489V19.489C14.125 21.489 15.125 22.489 17.125 22.489Z" stroke="white" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.125 22.489H7.125C9.125 22.489 10.125 21.489 10.125 19.489V17.489C10.125 15.489 9.125 14.489 7.125 14.489H5.125C3.125 14.489 2.125 15.489 2.125 17.489V19.489C2.125 21.489 3.125 22.489 5.125 22.489Z" stroke="white" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Narrow Down your Search</h3>
              <p style={{ color: "white", fontSize: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>Review project descriptions for required skills and experience</p>
            </div>

            {/* Step 4 */}
            <div style={{ textAlign: "center", padding: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.375 12.489C15.1364 12.489 17.375 10.2504 17.375 7.48901C17.375 4.72759 15.1364 2.48901 12.375 2.48901C9.61358 2.48901 7.375 4.72759 7.375 7.48901C7.375 10.2504 9.61358 12.489 12.375 12.489Z" stroke="white" stroke-width="1.39587" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.9651 22.489C20.9651 18.619 17.1151 15.489 12.3751 15.489C7.63516 15.489 3.78516 18.619 3.78516 22.489" stroke="white" stroke-width="1.39587" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Submit bid</h3>
              <p style={{ color: "white", fontSize: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>Submit a bid with a concise motivation, cost, and timeline.</p>
            </div>

            {/* Step 5 */}
            <div style={{ textAlign: "center", padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.625 22.9673C7.10872 22.9673 2.625 18.4836 2.625 12.9673C2.625 7.45101 7.10872 2.96729 12.625 2.96729C18.1413 2.96729 22.625 7.45101 22.625 12.9673C22.625 18.4836 18.1413 22.9673 12.625 22.9673ZM12.625 4.36263C7.88081 4.36263 4.02035 8.2231 4.02035 12.9673C4.02035 17.7115 7.88081 21.5719 12.625 21.5719C17.3692 21.5719 21.2297 17.7115 21.2297 12.9673C21.2297 8.2231 17.3692 4.36263 12.625 4.36263Z" fill="white"/>
                  <path d="M11.3035 16.2973C11.1175 16.2973 10.9407 16.2229 10.8105 16.0927L8.17791 13.4601C7.90814 13.1903 7.90814 12.7438 8.17791 12.4741C8.44768 12.2043 8.89419 12.2043 9.16396 12.4741L11.3035 14.6136L16.0849 9.83221C16.3547 9.56244 16.8012 9.56244 17.071 9.83221C17.3407 10.102 17.3407 10.5485 17.071 10.8183L11.7966 16.0927C11.6663 16.2229 11.4896 16.2973 11.3035 16.2973Z" fill="white"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Get Appointed</h3>
              <p style={{ color: "white", fontSize: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>Choose the best consultant by accepting their bid.</p>
            </div>

            {/* Step 6 */}
            <div style={{ textAlign: "center", padding: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.9633 22.9673C16.9122 22.9673 15.8052 22.7161 14.661 22.2324C13.5447 21.758 12.4191 21.1068 11.3215 20.3161C10.2331 19.5161 9.18193 18.6231 8.18658 17.6464C7.20053 16.651 6.30751 15.5998 5.51681 14.5208C4.71681 13.4045 4.07495 12.2882 3.61914 11.2091C3.13542 10.0557 2.89355 8.93938 2.89355 7.88822C2.89355 7.16263 3.02379 6.47426 3.27495 5.8324C3.53542 5.17194 3.95402 4.55798 4.52146 4.02775C5.23774 3.32077 6.05635 2.96729 6.93076 2.96729C7.29355 2.96729 7.66565 3.05101 7.98193 3.19984C8.34472 3.36729 8.65169 3.61845 8.87495 3.95333L11.0331 6.99519C11.2284 7.26496 11.3773 7.52542 11.4796 7.78589C11.6005 8.06496 11.6656 8.34403 11.6656 8.6138C11.6656 8.96729 11.5633 9.31147 11.368 9.63705C11.2284 9.88822 11.0145 10.158 10.7447 10.4278L10.1122 11.0882C10.1215 11.1161 10.1308 11.1347 10.1401 11.1533C10.2517 11.3487 10.4749 11.6836 10.9029 12.1859C11.3587 12.7068 11.7866 13.1812 12.2145 13.6184C12.7633 14.158 13.2191 14.5859 13.647 14.9394C14.1773 15.3859 14.5215 15.6091 14.7261 15.7115L14.7075 15.758L15.3866 15.0882C15.6749 14.7998 15.954 14.5859 16.2238 14.4464C16.7354 14.1301 17.3866 14.0743 18.0377 14.344C18.2796 14.4464 18.5401 14.5859 18.8191 14.7812L21.9075 16.9766C22.2517 17.2091 22.5029 17.5068 22.6517 17.8603C22.7912 18.2138 22.8563 18.5394 22.8563 18.865C22.8563 19.3115 22.754 19.758 22.5587 20.1766C22.3633 20.5952 22.1215 20.958 21.8145 21.2929C21.2843 21.8789 20.7075 22.2975 20.0377 22.5673C19.3959 22.8278 18.6982 22.9673 17.9633 22.9673ZM6.93076 4.36263C6.41914 4.36263 5.94472 4.58589 5.4889 5.0324C5.061 5.4324 4.76332 5.86961 4.57728 6.34403C4.38193 6.82775 4.2889 7.33938 4.2889 7.88822C4.2889 8.75333 4.49355 9.69287 4.90286 10.6603C5.32146 11.6464 5.90751 12.6696 6.65169 13.6929C7.39588 14.7161 8.24239 15.7115 9.17262 16.651C10.1029 17.5719 11.1075 18.4278 12.1401 19.1812C13.1447 19.9161 14.1773 20.5115 15.2005 20.9394C16.7912 21.6184 18.2796 21.7766 19.5075 21.265C19.9819 21.0696 20.4005 20.7719 20.7819 20.344C20.9959 20.1115 21.1633 19.8603 21.3029 19.5626C21.4145 19.3301 21.4703 19.0882 21.4703 18.8464C21.4703 18.6975 21.4424 18.5487 21.368 18.3812C21.3401 18.3254 21.2843 18.2231 21.1075 18.1022L18.0191 15.9068C17.8331 15.7766 17.6656 15.6836 17.5075 15.6184C17.3029 15.5347 17.2191 15.451 16.9029 15.6464C16.7168 15.7394 16.5494 15.8789 16.3633 16.065L15.6563 16.7626C15.2936 17.1161 14.7354 17.1998 14.3075 17.0417L14.0563 16.9301C13.6749 16.7254 13.2284 16.4091 12.7354 15.9905C12.2889 15.6091 11.8052 15.1626 11.2191 14.5859C10.7633 14.1208 10.3075 13.6278 9.83309 13.0789C9.39588 12.5673 9.0796 12.1301 8.88425 11.7673L8.77262 11.4882C8.71681 11.2743 8.69821 11.1533 8.69821 11.0231C8.69821 10.6882 8.81914 10.3905 9.05169 10.158L9.74937 9.4324C9.93541 9.24636 10.0749 9.06961 10.168 8.91147C10.2424 8.79054 10.2703 8.68822 10.2703 8.59519C10.2703 8.52077 10.2424 8.40915 10.1959 8.29752C10.1308 8.14868 10.0284 7.98124 9.89821 7.80449L7.74007 4.75333C7.64704 4.6231 7.53542 4.53008 7.39588 4.46496C7.24704 4.39984 7.0889 4.36263 6.93076 4.36263ZM14.7075 15.7673L14.5587 16.3998L14.8098 15.7487C14.7633 15.7394 14.7261 15.7487 14.7075 15.7673Z" fill="white"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Kick-off meeting</h3>
              <p style={{ color: "white", fontSize: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>Invite the freelancer to align on deliverables and expectations.</p>
            </div>

            {/* Step 7 */}
            <div style={{ textAlign: "center", padding: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_501_58227)">
                    <path d="M17.625 9.96729L12.875 14.7173L10.375 12.2173L6.625 15.9673" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.625 9.96729H17.625V12.9673" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <circle cx="12.125" cy="12.9673" r="9.35" stroke="white" stroke-width="1.3"/>
                  <defs>
                    <clipPath id="clip0_501_58227">
                      <rect width="12" height="12" fill="white" transform="translate(6.125 6.96729)"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Communicate the progress</h3>
              <p style={{ color: "white", fontSize: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>Maintain regular communication with the client on the job progress.</p>
            </div>

            {/* Step 8 */}
            <div style={{ textAlign: "center", padding: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.65407 21.5622C8.3936 21.5622 8.12382 21.4971 7.88196 21.3669C7.35173 21.0878 7.02616 20.5297 7.02616 19.9343V18.6135C4.21686 18.3251 2.375 16.2599 2.375 13.3018V7.72042C2.375 4.52042 4.52384 2.37158 7.72384 2.37158H17.0262C20.2262 2.37158 22.375 4.52042 22.375 7.72042V13.3018C22.375 16.5018 20.2262 18.6506 17.0262 18.6506H13.5192L9.55637 21.2926C9.2866 21.4693 8.97035 21.5622 8.65407 21.5622ZM7.72384 3.75762C5.32384 3.75762 3.77035 5.31111 3.77035 7.71111V13.2926C3.77035 15.6926 5.32384 17.2461 7.72384 17.2461C8.10523 17.2461 8.42151 17.5623 8.42151 17.9437V19.9251C8.42151 20.0461 8.49593 20.1019 8.54244 20.1298C8.58896 20.1577 8.68199 20.1856 8.78431 20.1205L12.9238 17.367C13.0355 17.2926 13.175 17.2461 13.3145 17.2461H17.0355C19.4355 17.2461 20.989 15.6926 20.989 13.2926V7.71111C20.989 5.31111 19.4355 3.75762 17.0355 3.75762H7.72384Z" fill="white"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Provide Feedback</h3>
              <p style={{ color: "white", fontSize: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>Share your review to support the consultant's growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose GigExecs Section */}
      <section style={{ padding: "20px 80px 20px 80px", background: "transparent" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: "white", fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "21.60px", wordWrap: "break-word" }}>
              Why Choose GigExecs?
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32, alignItems: "stretch" }}>
            {/* Card 1 - Top Left */}
            <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="/images/Card 1.png"
                  alt="Team collaboration"
                  style={{
                    width: "100%",
                    height: 248,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ 
                padding: "32px 32px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 24,
                alignSelf: "stretch",
                borderRadius: "0 0 16px 16px",
                background: "#FFF",
                display: "flex",
                flex: 1
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#CC9B0A", textAlign: "left" }}>
                  Access to a quality pool of experienced freelancers
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16, textAlign: "left" }}>
                  GigExecs runs a rigorous vetting process to ensure and protect the quality of our freelancers and clients. Our platform and processes were designed for simplicity and for user friendliness.
                </p>
              </div>
            </div>

            {/* Card 2 - Top Right */}
            <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="/images/Card 2.png"
                  alt="Handshake"
                  style={{
                    width: "100%",
                    height: 248,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ 
                padding: "32px 32px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 24,
                alignSelf: "stretch",
                borderRadius: "0 0 16px 16px",
                background: "#FFF",
                display: "flex",
                flex: 1
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#CC9B0A", textAlign: "left" }}>
                  Streamlined hiring process:
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16, textAlign: "left" }}>
                  Our platform matches the best available skills with our client's requirements. The hiring process for freelancers is simple, quick and safe.
                </p>
              </div>
            </div>

            {/* Card 3 - Bottom Left */}
            <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="/images/Card 3.png"
                  alt="Professional with briefcase"
                  style={{
                    width: "100%",
                    height: 248,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ 
                padding: "32px 32px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 24,
                alignSelf: "stretch",
                borderRadius: "0 0 16px 16px",
                background: "#FFF",
                display: "flex",
                flex: 1
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#CC9B0A", textAlign: "left" }}>
                  Age is Just a Number
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16, textAlign: "left" }}>
                  At GigExecs we welcome senior professionals in their 50s, 60s or 70s to join our platform to share their valuable skills and know-how with our clients; freelancing is a great alternative to stay financially active, in a less stressful lifestyle, whilst still engaged in interesting work later in our careers.
                </p>
              </div>
            </div>

            {/* Card 4 - Bottom Right */}
            <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="/images/Card 4.png"
                  alt="Secure payment"
                  style={{
                    width: "100%",
                    height: 248,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ 
                padding: "32px 32px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 24,
                alignSelf: "stretch",
                borderRadius: "0 0 16px 16px",
                background: "#FFF",
                display: "flex",
                flex: 1
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#CC9B0A", textAlign: "left" }}>
                  Secure and easy payment processes
                </h3>
                <p style={{ color: "#012E46", fontSize: 16, lineHeight: "24px", marginBottom: 16, textAlign: "left" }}>
                  GigExecs offers secure payment processing systems, enabling clients to make payments to freelancers using credit or debit cards as well as other mainstream digital payment methods. Our payment processes are convenient and streamlined to our users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HeroBanner */}
      <section
        style={{
          width: "1440px",
          minHeight: 424,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `url('/images/HeroBannerBottom.png') center/cover no-repeat`,
          position: "relative",
          padding: 80,
        }}
      >
        <div style={{ width: '100%', height: '100%', padding: 32, left: 0, top: 0, position: 'relative', background: 'linear-gradient(136deg, rgba(255, 255, 255, 0.21) 0%, rgba(0, 0, 0, 0.12) 50%, rgba(255, 255, 255, 0.21) 100%)', borderRadius: 24, outline: '1px rgba(255, 255, 255, 0.30) solid', outlineOffset: -1, backdropFilter: 'blur(5px)', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 32, display: 'inline-flex', margin: '0 auto' }}>
          <div style={{ alignSelf: 'stretch', textAlign: 'center', color: 'white', fontSize: 40, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '48px', wordWrap: 'break-word' }}>
            Need help but don't have time to post, browse, or monitor your project? We can assist with that too.
          </div>
          <div style={{ width: 302, paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16, background: '#CC9B0A', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex', cursor: 'pointer' }}>
            <div style={{ textAlign: 'center', color: 'white', fontSize: 18, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '21.60px', wordWrap: 'break-word' }}>
              Book a Call
            </div>
          </div>
        </div>
        <div style={{ height: 64 }} />
      </section>

      <Footer />
    </div>
  );
};

export default Clients; 