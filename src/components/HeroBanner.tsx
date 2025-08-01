import React from "react";

const HeroBanner = () => (
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
        <div style={{ alignSelf: 'stretch', textAlign: 'center', color: 'white', fontSize: 40, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '48px', wordWrap: 'break-word' }}>GigExecs: A Premier Global Community for Elite Freelance Professionals</div>
        <a href="https://gigexecs.com/signup" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div data-content="Icons & Text" data-hierarchy="Secondary" data-left-icon="false" data-right-icon="false" data-size="Large" data-state="Default" data-style="Filled" style={{ width: 302, paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16, background: '#CC9B0A', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex' }}>
            <div style={{ textAlign: 'center', color: 'white', fontSize: 18, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '21.60px', wordWrap: 'break-word' }}>Sign up for GigExecs Now</div>
          </div>
        </a>
      </div>
      <div style={{ height: 64 }} />
  </section>
);

export default HeroBanner; 