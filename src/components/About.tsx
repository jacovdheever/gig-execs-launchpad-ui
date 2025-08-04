import React from "react"

const CheckIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 19, minHeight: 19 }}>
    <path d="M17.9502 1.68921V18.2888H1.38477V1.68921H17.9502Z" stroke="white" strokeWidth="1.4"/>
    <path d="M5.68457 9.91126L8.88446 12.5412L13.6846 6.98901" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const AboutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 24, minHeight: 24 }}>
    <path d="M14.9921 3.45825C12.5171 3.45825 10.5088 5.46659 10.5088 7.94159C10.5088 10.4166 12.5171 12.4249 14.9921 12.4249C17.4671 12.4249 19.4755 10.4166 19.4755 7.94159C19.4755 5.46659 17.4671 3.45825 14.9921 3.45825Z" fill="#4885AA"/>
    <path d="M7.30137 12.8594C5.77637 12.8594 4.52637 14.101 4.52637 15.6344C4.52637 17.1677 5.76803 18.4094 7.30137 18.4094C8.82637 18.4094 10.0764 17.1677 10.0764 15.6344C10.0764 14.101 8.82637 12.8594 7.30137 12.8594Z" fill="#CC9B0A"/>
    <path d="M15.8485 15.8477C14.5568 15.8477 13.5068 16.8977 13.5068 18.1893C13.5068 19.481 14.5568 20.531 15.8485 20.531C17.1402 20.531 18.1902 19.481 18.1902 18.1893C18.1902 16.8977 17.1402 15.8477 15.8485 15.8477Z" fill="white"/>
  </svg>
);

const leftColumnFeatures = [
  "Transparent and Easy pricing",
  "Access to jobs and freelancers ",
  "User Friendly platform "
];
const rightColumnFeatures = [
  "Manage your jobs and roles ",
  "Give and receive feedback and ratings"
];

const About = () => {
  return (
    <div style={{ paddingLeft: 80, paddingRight: 80 }}>
      <section style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 32, marginTop: 24 }}>
        <div style={{ alignSelf: "stretch", justifyContent: "flex-start", alignItems: "center", gap: 40, display: "flex" }}>
          {/* About Icon to the left, 2px gap */}
          <AboutIcon />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width:0, height: 24, padding: 2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10 }}>
                <div style={{ width: 20, height: 20, opacity: 0 }} />
                <div style={{ width: 20, height: 20, opacity: 0 }} />
                <div style={{ width: 8.97, height: 8.97, background: "#4885AA", borderRadius: "50%" }} />
                <div style={{ width: 5.55, height: 5.55, background: "#CC9B0A", borderRadius: "50%" }} />
                <div style={{ width: 4.68, height: 4.68, background: "white", borderRadius: "50%" }} />
              </div>
              <div style={{ color: "white", fontSize: 40, fontFamily: "Montserrat, sans-serif", fontWeight: 600, lineHeight: "48px", wordWrap: "break-word" }}>
                About GigExecs
              </div>
            </div>
          </div>
        </div>
        <div style={{ alignSelf: "stretch", borderRadius: 24, justifyContent: "flex-start", alignItems: "flex-start", gap: 24, display: "flex" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: 16 }}>
            <div style={{ color: "#CC9B0A", fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "21.60px", wordWrap: "break-word" }}>
              Helping People Succeed
            </div>
            <div style={{ color: "white", fontSize: 16, fontFamily: "Open Sans, sans-serif", fontWeight: 400, wordWrap: "break-word" }}>
              GigExecs is an exclusive freelancing platform for senior professionals with a proven track record and at least 15 years of experience. We curate our network to maintain a high-quality ecosystem, ensuring the right skills meet the right opportunities.
            </div>
          </div>
        </div>
        {/* Features Card Layout */}
        <div style={{ width: "100%", height: "100%", padding: 32, background: "linear-gradient(136deg, rgba(255, 255, 255, 0.21) 0%, rgba(0, 0, 0, 0.12) 50%, rgba(255, 255, 255, 0.21) 100%)", borderRadius: 24, outline: "1px rgba(255, 255, 255, 0.30) solid", outlineOffset: -1, backdropFilter: "blur(5px)", justifyContent: "flex-start", alignItems: "flex-start", gap: 24, display: "inline-flex" }}>
          {/* Left: Headings */}
          <div style={{ flex: "1 1 0", display: "inline-flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: 8 }}>
            <div style={{ alignSelf: "stretch", color: "#CC9B0A", fontSize: 20, fontFamily: "Open Sans, sans-serif", fontWeight: 400, lineHeight: "24px", wordWrap: "break-word" }}>
              Embrace the Future of Work
            </div>
            <div style={{ alignSelf: "stretch", color: "white", fontSize: 20, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "24px", wordWrap: "break-word" }}>
              It’s free to Join
            </div>
          </div>
          {/* Middle: First 3 features */}
          <div style={{ flex: "1 1 0", display: "inline-flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: 16 }}>
            {leftColumnFeatures.map((text, i) => (
              <div key={i} style={{ alignSelf: "stretch", paddingTop: 4, paddingBottom: 4, justifyContent: "flex-start", alignItems: "center", gap: 16, display: "inline-flex" }}>
                <CheckIcon />
                <div style={{ display: "flex", flexDirection: "column", color: "white", fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "16.80px", wordWrap: "break-word" }}>{text}</div>
              </div>
            ))}
          </div>
          {/* Right: Last 2 features + Sign Up */}
          <div style={{ flex: "1 1 0", display: "inline-flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: 16 }}>
            {rightColumnFeatures.map((text, i) => (
              <div key={i} style={{ alignSelf: "stretch", paddingTop: 4, paddingBottom: 4, justifyContent: "flex-start", alignItems: "center", gap: 16, display: "inline-flex" }}>
                <CheckIcon />
                <div style={{ display: "flex", flexDirection: "column", color: "white", fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "16.80px", wordWrap: "break-word" }}>{text}</div>
              </div>
            ))}
            <a href="https://gigexecs.com/signup" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ alignSelf: "stretch", height: 42, paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16, background: "#CC9B0A", justifyContent: "center", alignItems: "center", gap: 8, display: "inline-flex" }}>
              <div style={{ textAlign: "center", color: "white", fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "21.60px", wordWrap: "break-word" }}>
                Sign Up
              </div>
            </div>
            </a>
          </div>
        </div>
      </section>
      {/* Spacing-5 (20px) below the container */}
      <div style={{ height: 40 }} />
      {/* New section as provided, aligned left with 80px padding */}
      <div data-cta="false" data-heading="true" style={{ width: "100%", height: "100%", borderRadius: 24, justifyContent: "flex-start", alignItems: "center", gap: 24, display: "inline-flex" }}>
        <div style={{ flex: "1 1 0", display: "inline-flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: 24 }}>
          <div style={{ alignSelf: "stretch", color: "#CC9B0A", fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "21.60px", wordWrap: "break-word" }}>
            GigExecs: Connecting Elite Freelancers with Leading Businesses
          </div>
        </div>
      </div>
      {/* Spacing-4 (16px) below the new section */}
      <div style={{ height: 16 }} />
      {/* New horizontally split card section */}
      <div style={{ width: "100%", maxWidth: 1320, margin: "0 auto", display: "flex", borderRadius: 24, overflow: "hidden" }}>
        {/* Left: Image */}
        <img
          src="/images/BecomeAGigExec.png"
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
            Become a GigExec
          </div>
          <div style={{ alignSelf: "stretch" }}>
            <span style={{ color: "#012E46", fontSize: 16, fontFamily: "Open Sans, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>
              A GigExec is a seasoned professional with 15+ years of expertise, excelling in high-quality, project-based roles as an independent consultant, freelancer, or advisor. Typically in mid-to-late career, they bring deep knowledge and impact to every assignment. 
            </span>
            <span style={{ color: "#CC9B0A", fontSize: 16, fontFamily: "Open Sans, sans-serif", fontWeight: 400, textDecoration: "underline", lineHeight: "19.20px", wordWrap: "break-word" }}>
            <a href="https://gigexecs.com/signup" target="_blank" rel="noopener noreferrer" style={{ color: "#CC9B0A", textDecoration: "underline" }}>
              <span>&nbsp;Join GigExecs today!</span>
            </a>
            </span>
          </div>
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
            }}
          >
            <div style={{ textAlign: "center", color: "white", fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "21.60px", wordWrap: "break-word" }}>
              Learn more
            </div>
          </div>
        </div>
      </div>
      {/* Spacing-4 (16px) below the previous card */}
      <div style={{ height: 40
       }} />
      {/* New horizontally split card section: left text, right image */}
      <div style={{ width: "100%", maxWidth: 1320, margin: "0 auto", display: "flex", borderRadius: 24, overflow: "hidden" }}>
        {/* Left: Content */}
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
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 24,
          }}
        >
          
          <div style={{ alignSelf: "stretch", color: "#CC9B0A", fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "21.60px", wordWrap: "break-word" }}>
            Hire Experienced talent
          </div>
          <div style={{ alignSelf: "stretch", color: "#012E46", fontSize: 16, fontFamily: "Open Sans, sans-serif", fontWeight: 400, lineHeight: "19.20px", wordWrap: "break-word" }}>
            Post your project, business needs, or urgent requirements, and we’ll connect you with top freelance talent from around the world.
          </div>
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
            }}
          >
            <div style={{ textAlign: "center", color: "white", fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, lineHeight: "21.60px", wordWrap: "break-word" }}>
              Learn more
            </div>
          </div>
        </div>
        {/* Right: Image */}
        <img
          src="/images/HireExperiencedTalent.png"
          alt="Hire Experienced Talent"
          style={{ width: "50%", height: 452, objectFit: "cover", borderTopRightRadius: 24, borderBottomRightRadius: 24 }}
        />
      </div>
      {/* Spacing-5 (20px) below the new card */}
      <div style={{ height: 20 }} />
      <div style={{ width: '100%', color: 'white', fontSize: 18, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '21.60px', wordWrap: 'break-word' }}>
        How it works for:
      </div>
      {/* Spacing-4 (16px) below the heading */}
      <div style={{ height: 16 }} />
      <div style={{ width: '100%', display: 'flex', gap: 32, justifyContent: 'center' }}>
        {/* Left Column: Experienced Professionals */}
        <div style={{ width: '100%', maxWidth: 600, height: '100%', padding: 32, background: 'linear-gradient(136deg, rgba(255, 255, 255, 0.21) 0%, rgba(0, 0, 0, 0.12) 50%, rgba(255, 255, 255, 0.21) 100%)', borderRadius: 24, outline: '1px rgba(255, 255, 255, 0.30) solid', outlineOffset: -1, backdropFilter: 'blur(5px)', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 32, display: 'inline-flex' }}>
          <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex' }}>
            <div style={{ alignSelf: 'stretch', textAlign: 'center', color: 'white', fontSize: 18, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '21.60px', wordWrap: 'break-word' }}>Experienced Professionals</div>
            <div style={{ width: 'calc(100% - 48px)', height: 4, margin: '0 auto', background: 'linear-gradient(90deg, rgba(242, 199, 92, 0.20) 0%, #F2C75C 50%, rgba(242, 199, 92, 0.20) 100%)', borderRadius: 2 }}></div>
          </div>
          <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 41, display: 'inline-flex' }}>
            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, display: 'inline-flex' }}>
              {/* Icon 1 */}
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.12305 12.9357L11.5321 15.3548L16.3603 10.5166" stroke="white" stroke-width="1.44444" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.4917 3.38911C12.1815 2.79933 13.311 2.79933 14.0108 3.38911L15.5902 4.7486C15.8901 5.0085 16.4499 5.21843 16.8497 5.21843H18.5491C19.6087 5.21843 20.4784 6.0881 20.4784 7.1477V8.84706C20.4784 9.23692 20.6883 9.8067 20.9482 10.1066L22.3077 11.6859C22.8974 12.3757 22.8974 13.5053 22.3077 14.205L20.9482 15.7844C20.6883 16.0843 20.4784 16.6441 20.4784 17.0439V18.7433C20.4784 19.8029 19.6087 20.6726 18.5491 20.6726H16.8497C16.4599 20.6726 15.8901 20.8825 15.5902 21.1424L14.0108 22.5019C13.321 23.0917 12.1915 23.0917 11.4917 22.5019L9.91231 21.1424C9.61243 20.8825 9.05264 20.6726 8.65279 20.6726H6.92343C5.86383 20.6726 4.99416 19.8029 4.99416 18.7433V17.0339C4.99416 16.6441 4.78424 16.0843 4.53433 15.7844L3.18484 14.195C2.60505 13.5053 2.60505 12.3857 3.18484 11.6959L4.53433 10.1066C4.78424 9.8067 4.99416 9.24691 4.99416 8.85706V7.13771C4.99416 6.0781 5.86383 5.20843 6.92343 5.20843H8.65279C9.04264 5.20843 9.61243 4.99851 9.91231 4.73861L11.4917 3.38911Z" stroke="white" stroke-width="1.44444" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'inline-flex' }}>
                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '16.80px', wordWrap: 'break-word' }}>Sign up & get verified</div>
              </div>
            </div>
            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, display: 'inline-flex' }}>
              {/* Icon 2 */}
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.12305 12.9357L11.5321 15.3548L16.3603 10.5166" stroke="white" stroke-width="1.44444" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.4917 3.38911C12.1815 2.79933 13.311 2.79933 14.0108 3.38911L15.5902 4.7486C15.8901 5.0085 16.4499 5.21843 16.8497 5.21843H18.5491C19.6087 5.21843 20.4784 6.0881 20.4784 7.1477V8.84706C20.4784 9.23692 20.6883 9.8067 20.9482 10.1066L22.3077 11.6859C22.8974 12.3757 22.8974 13.5053 22.3077 14.205L20.9482 15.7844C20.6883 16.0843 20.4784 16.6441 20.4784 17.0439V18.7433C20.4784 19.8029 19.6087 20.6726 18.5491 20.6726H16.8497C16.4599 20.6726 15.8901 20.8825 15.5902 21.1424L14.0108 22.5019C13.321 23.0917 12.1915 23.0917 11.4917 22.5019L9.91231 21.1424C9.61243 20.8825 9.05264 20.6726 8.65279 20.6726H6.92343C5.86383 20.6726 4.99416 19.8029 4.99416 18.7433V17.0339C4.99416 16.6441 4.78424 16.0843 4.53433 15.7844L3.18484 14.195C2.60505 13.5053 2.60505 12.3857 3.18484 11.6959L4.53433 10.1066C4.78424 9.8067 4.99416 9.24691 4.99416 8.85706V7.13771C4.99416 6.0781 5.86383 5.20843 6.92343 5.20843H8.65279C9.04264 5.20843 9.61243 4.99851 9.91231 4.73861L11.4917 3.38911Z" stroke="white" stroke-width="1.44444" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'inline-flex' }}>
                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '16.80px', wordWrap: 'break-word' }}>Sign up & get verified</div>
              </div>
            </div>
          </div>
          <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 40, display: 'inline-flex' }}>
            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, display: 'inline-flex' }}>
              {/* Icon 3 */}
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M5.94092 19.8944C5.36879 19.8944 4.83417 19.6974 4.44962 19.3316C3.9619 18.872 3.72742 18.1779 3.81184 17.4276L4.15887 14.3887C4.22452 13.8166 4.57155 13.0569 4.97486 12.6442L12.6752 4.4937C14.5979 2.45841 16.6051 2.40214 18.6404 4.32488C20.6757 6.24762 20.732 8.25477 18.8092 10.2901L11.1089 18.4406C10.715 18.8626 9.98336 19.2566 9.41123 19.3504L6.39112 19.8662C6.23167 19.8756 6.09099 19.8944 5.94092 19.8944ZM15.6859 4.3155C14.9637 4.3155 14.3353 4.7657 13.6975 5.44101L5.99719 13.601C5.80961 13.7979 5.59389 14.2669 5.55637 14.5389L5.20934 17.5777C5.17182 17.8872 5.24686 18.1404 5.41568 18.2999C5.58451 18.4593 5.83775 18.5156 6.14726 18.4687L9.16737 17.9529C9.43937 17.906 9.88957 17.6621 10.0772 17.4651L17.7775 9.31462C18.9405 8.07657 19.3626 6.9323 17.665 5.33783C16.9146 4.61563 16.2675 4.3155 15.6859 4.3155Z" fill="white"/>
               <path d="M17.009 11.856C16.9903 11.856 16.9621 11.856 16.9434 11.856C14.0171 11.5652 11.6629 9.34237 11.2127 6.43481C11.1564 6.05026 11.419 5.69385 11.8036 5.62819C12.1881 5.57192 12.5445 5.83454 12.6102 6.21909C12.9666 8.48886 14.8049 10.2334 17.0934 10.4585C17.478 10.496 17.7594 10.843 17.7218 11.2275C17.675 11.584 17.3654 11.856 17.009 11.856Z" fill="white"/>
                <path d="M20.4415 22.924H3.55891C3.17436 22.924 2.85547 22.6051 2.85547 22.2205C2.85547 21.836 3.17436 21.5171 3.55891 21.5171H20.4415C20.8261 21.5171 21.145 21.836 21.145 22.2205C21.145 22.6051 20.8261 22.924 20.4415 22.924Z" fill="white"/>
              </svg>
              <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'inline-flex' }}>
                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '16.80px', wordWrap: 'break-word' }}>Sell your skills</div>
              </div>
            </div>
            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, display: 'inline-flex' }}>
              {/* Icon 4 */}
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22.9238H15C20 22.9238 22 20.9238 22 15.9238V9.92383C22 4.92383 20 2.92383 15 2.92383H9C4 2.92383 2 4.92383 2 9.92383V15.9238C2 20.9238 4 22.9238 9 22.9238Z"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M7.75 12.9237L10.58 15.7537L16.25 10.0938"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'inline-flex' }}>
                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '16.80px', wordWrap: 'break-word' }}>Get appointed</div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column: Clients */}
        <div style={{ width: '100%', maxWidth: 600, height: '100%', padding: 32, background: 'linear-gradient(136deg, rgba(255, 255, 255, 0.21) 0%, rgba(0, 0, 0, 0.12) 50%, rgba(255, 255, 255, 0.21) 100%)', borderRadius: 24, outline: '1px rgba(255, 255, 255, 0.30) solid', outlineOffset: -1, backdropFilter: 'blur(5px)', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 32, display: 'inline-flex' }}>
          <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex' }}>
            <div style={{ alignSelf: 'stretch', textAlign: 'center', color: 'white', fontSize: 18, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '21.60px', wordWrap: 'break-word' }}>Clients</div>
            <div style={{ width: 'calc(100% - 48px)', height: 4, margin: '0 auto', background: 'linear-gradient(90deg, rgba(242, 199, 92, 0.20) 0%, #F2C75C 50%, rgba(242, 199, 92, 0.20) 100%)', borderRadius: 2 }}></div>
          </div>
          <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 41, display: 'inline-flex' }}>
            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, display: 'inline-flex' }}>
              {/* Icon 1 */}
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.12305 12.9357L11.5321 15.3548L16.3603 10.5166" stroke="white" stroke-width="1.44444" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.4917 3.38911C12.1815 2.79933 13.311 2.79933 14.0108 3.38911L15.5902 4.7486C15.8901 5.0085 16.4499 5.21843 16.8497 5.21843H18.5491C19.6087 5.21843 20.4784 6.0881 20.4784 7.1477V8.84706C20.4784 9.23692 20.6883 9.8067 20.9482 10.1066L22.3077 11.6859C22.8974 12.3757 22.8974 13.5053 22.3077 14.205L20.9482 15.7844C20.6883 16.0843 20.4784 16.6441 20.4784 17.0439V18.7433C20.4784 19.8029 19.6087 20.6726 18.5491 20.6726H16.8497C16.4599 20.6726 15.8901 20.8825 15.5902 21.1424L14.0108 22.5019C13.321 23.0917 12.1915 23.0917 11.4917 22.5019L9.91231 21.1424C9.61243 20.8825 9.05264 20.6726 8.65279 20.6726H6.92343C5.86383 20.6726 4.99416 19.8029 4.99416 18.7433V17.0339C4.99416 16.6441 4.78424 16.0843 4.53433 15.7844L3.18484 14.195C2.60505 13.5053 2.60505 12.3857 3.18484 11.6959L4.53433 10.1066C4.78424 9.8067 4.99416 9.24691 4.99416 8.85706V7.13771C4.99416 6.0781 5.86383 5.20843 6.92343 5.20843H8.65279C9.04264 5.20843 9.61243 4.99851 9.91231 4.73861L11.4917 3.38911Z" stroke="white" stroke-width="1.44444" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'inline-flex' }}>
                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '16.80px', wordWrap: 'break-word' }}>Sign up & get verified</div>
              </div>
            </div>
            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, display: 'inline-flex' }}>
              {/* Icon 2 */}
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.25 10.9458H7.25C9.25 10.9458 10.25 9.9458 10.25 7.9458V5.9458C10.25 3.9458 9.25 2.9458 7.25 2.9458H5.25C3.25 2.9458 2.25 3.9458 2.25 5.9458V7.9458C2.25 9.9458 3.25 10.9458 5.25 10.9458Z"
    stroke="white"
    strokeWidth="1.3"
    strokeMiterlimit="10"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path d="M17.25 10.9458H19.25C21.25 10.9458 22.25 9.9458 22.25 7.9458V5.9458C22.25 3.9458 21.25 2.9458 19.25 2.9458H17.25C15.25 2.9458 14.25 3.9458 14.25 5.9458V7.9458C14.25 9.9458 15.25 10.9458 17.25 10.9458Z"
    stroke="white"
    strokeWidth="1.3"
    strokeMiterlimit="10"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path d="M17.25 22.9458H19.25C21.25 22.9458 22.25 21.9458 22.25 19.9458V17.9458C22.25 15.9458 21.25 14.9458 19.25 14.9458H17.25C15.25 14.9458 14.25 15.9458 14.25 17.9458V19.9458C14.25 21.9458 15.25 22.9458 17.25 22.9458Z"
    stroke="white"
    strokeWidth="1.3"
    strokeMiterlimit="10"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path d="M5.25 22.9458H7.25C9.25 22.9458 10.25 21.9458 10.25 19.9458V17.9458C10.25 15.9458 9.25 14.9458 7.25 14.9458H5.25C3.25 14.9458 2.25 15.9458 2.25 17.9458V19.9458C2.25 21.9458 3.25 22.9458 5.25 22.9458Z"
    stroke="white"
    strokeWidth="1.3"
    strokeMiterlimit="10"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
              <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'inline-flex' }}>
                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '16.80px', wordWrap: 'break-word' }}>Browse for talent</div>
              </div>
            </div>
          </div>
          <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 40, display: 'inline-flex' }}>
            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, display: 'inline-flex' }}>
              {/* Icon 3 */}
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M5.94092 19.8944C5.36879 19.8944 4.83417 19.6974 4.44962 19.3316C3.9619 18.872 3.72742 18.1779 3.81184 17.4276L4.15887 14.3887C4.22452 13.8166 4.57155 13.0569 4.97486 12.6442L12.6752 4.4937C14.5979 2.45841 16.6051 2.40214 18.6404 4.32488C20.6757 6.24762 20.732 8.25477 18.8092 10.2901L11.1089 18.4406C10.715 18.8626 9.98336 19.2566 9.41123 19.3504L6.39112 19.8662C6.23167 19.8756 6.09099 19.8944 5.94092 19.8944ZM15.6859 4.3155C14.9637 4.3155 14.3353 4.7657 13.6975 5.44101L5.99719 13.601C5.80961 13.7979 5.59389 14.2669 5.55637 14.5389L5.20934 17.5777C5.17182 17.8872 5.24686 18.1404 5.41568 18.2999C5.58451 18.4593 5.83775 18.5156 6.14726 18.4687L9.16737 17.9529C9.43937 17.906 9.88957 17.6621 10.0772 17.4651L17.7775 9.31462C18.9405 8.07657 19.3626 6.9323 17.665 5.33783C16.9146 4.61563 16.2675 4.3155 15.6859 4.3155Z" fill="white"/>
                <path d="M17.009 11.856C16.9903 11.856 16.9621 11.856 16.9434 11.856C14.0171 11.5652 11.6629 9.34237 11.2127 6.43481C11.1564 6.05026 11.419 5.69385 11.8036 5.62819C12.1881 5.57192 12.5445 5.83454 12.6102 6.21909C12.9666 8.48886 14.8049 10.2334 17.0934 10.4585C17.478 10.496 17.7594 10.843 17.7218 11.2275C17.675 11.584 17.3654 11.856 17.009 11.856Z" fill="white"/>
                <path d="M20.4415 22.924H3.55891C3.17436 22.924 2.85547 22.6051 2.85547 22.2205C2.85547 21.836 3.17436 21.5171 3.55891 21.5171H20.4415C20.8261 21.5171 21.145 21.836 21.145 22.2205C21.145 22.6051 20.8261 22.924 20.4415 22.924Z" fill="white"/>
              </svg>
              <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'inline-flex' }}>
                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '16.80px', wordWrap: 'break-word' }}>Post a Job</div>
              </div>
            </div>
            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, display: 'inline-flex' }}>
              {/* Icon 4 */}
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22.9238H15C20 22.9238 22 20.9238 22 15.9238V9.92383C22 4.92383 20 2.92383 15 2.92383H9C4 2.92383 2 4.92383 2 9.92383V15.9238C2 20.9238 4 22.9238 9 22.9238Z"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M7.75 12.9237L10.58 15.7537L16.25 10.0938"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'inline-flex' }}>
                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '16.80px', wordWrap: 'break-word' }}>Hire a Freelancer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <div style={{ height: 40 }} />
      
    </div>
  );
};

export default About; 