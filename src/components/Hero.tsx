import React from "react"

const Hero = () => {
  return (
    <section style={{ width: 1440, height: 760, position: "relative" }}>
      <div
        data-property-1="Homepage"
        style={{
          width: 1440,
          height: 760,
          left: 0,
          top: 0,
          position: "absolute",
          background:
            "linear-gradient(0deg, rgba(27, 54, 93, 0.4), rgba(27, 54, 93, 0.4)), url('/images/HeroPictureHome 1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        style={{
          width: 800,
          padding: 32,
          left: 80,
          top: 218.5,
          position: "absolute",
          background:
            "linear-gradient(136deg, rgba(255, 255, 255, 0.21) 0%, rgba(0, 0, 0, 0.12) 50%, rgba(255, 255, 255, 0.21) 100%)",
          borderRadius: 24,
          outline: "1px rgba(255, 255, 255, 0.30) solid",
          outlineOffset: -1,
          backdropFilter: "blur(5px)",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-end",
          gap: 32,
          display: "inline-flex",
        }}
      >
        <div
          style={{
            alignSelf: "stretch",
            color: "white",
            fontSize: 40,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            lineHeight: "48px",
            wordWrap: "break-word",
          }}
        >
          GigExecs: The Premier Freelance Hub for Top Professionals
        </div>
        <div
          style={{
            alignSelf: "stretch",
            color: "white",
            fontSize: 18,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 400,
            lineHeight: "21.60px",
            wordWrap: "break-word",
          }}
        >
          Connecting senior talent with high-quality global projects through a secure and trusted platform.
        </div>
        <a href="https://gigexecs.com/signup" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div
            data-content="Icons & Text"
            data-hierarchy="Secondary"
            data-left-icon="false"
            data-right-icon="false"
            data-size="Large"
            data-state="Default"
            data-style="Filled"
            style={{
              width: 302,
              height: "100%",
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 16,
              paddingBottom: 16,
              background: "#CC9B0A",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              display: "inline-flex",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 18,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                lineHeight: "21.60px",
                wordWrap: "break-word",
              }}
            >
              Join GigExecs
            </div>
          </div>
        </a>
      </div>
    </section>
  )
}

export default Hero
