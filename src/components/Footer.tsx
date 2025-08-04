import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    heading: "How it works",
    links: [
      "How it works",
      "Pricing",
    ],
  },
  {
    heading: "About",
    links: [
      "About us",
    ],
  },
  {
    heading: "Help & Support",
    links: [
      "Help",
    ],
  },
];

const Footer = () => {
  const textAreaRef = useRef<HTMLDivElement>(null);
  const [circleSize, setCircleSize] = useState(420);

  useEffect(() => {
    if (textAreaRef.current) {
      setCircleSize(textAreaRef.current.offsetHeight);
    }
  }, []);

  return (
    <footer
      style={{
        background: "#012E46",
        color: "white",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: "64px 80px 0 80px",
          gap: 0,
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Circular Image */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
            height: circleSize,
            minWidth: circleSize,
          }}
        >
          <div
            style={{
              width: circleSize,
              height: circleSize,
              borderRadius: "50%",
              overflow: "hidden",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 0 #fff",
              transition: "width 0.2s, height 0.2s",
            }}
          >
            <img
              src="/images/Footer.png"
              alt="Business desk"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          {/* Decorative dots */}
          <div style={{ position: "absolute", left: 4, top: 10, width: 24, height: 24, background: "#4885AA", borderRadius: "50%" }} />
          <div style={{ position: "absolute", left: circleSize - 20, bottom: 20, width: 24, height: 24, background: "#CC9B0A", borderRadius: "50%" }} />
        </div>
        {/* Footer Columns */}
        <div
          ref={textAreaRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "flex-start",
            gap: 0,
            padding: "0 0 0 0",
          }}
        >
          {footerLinks.map((col, idx) => (
            <div
              key={col.heading}
              style={{
                flex: 1,
                minWidth: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 16,
                padding: "0 32px",
              }}
            >
              <div
                style={{
                  color: "white",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                  fontSize: 30,
                  wordWrap: "break-word",
                  marginBottom: 8,
                }}
              >
                {col.heading}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {col.links.map((link, i) => {
                  const linkStyle = {
                    color: "white",
                    fontSize: 14,
                    fontFamily: "Open Sans, sans-serif",
                    fontWeight: 400,
                    letterSpacing: 0.56,
                    wordWrap: "break-word" as const,
                    cursor: "pointer",
                    textDecoration: "none",
                  };

                  // Map specific links to routes
                  const getLinkComponent = (linkText: string) => {
                    switch (linkText) {
                      case "How it works":
                        return (
                          <Link to="/how-it-works" style={linkStyle}>
                            {linkText}
                          </Link>
                        );
                      case "Pricing":
                        return (
                          <Link to="/pricing" style={linkStyle}>
                            {linkText}
                          </Link>
                        );
                      case "About us":
                        return (
                          <Link to="/about" style={linkStyle}>
                            {linkText}
                          </Link>
                        );
                      case "Help":
                        return (
                          <Link to="/help" style={linkStyle}>
                            {linkText}
                          </Link>
                        );
                      default:
                        return (
                          <div style={linkStyle}>
                            {linkText}
                          </div>
                        );
                    }
                  };

                  return (
                    <div key={i}>
                      {getLinkComponent(link)}
                    </div>
                  );
                })}
            </div>
            </div>
          ))}
          </div>
          </div>
      {/* Bottom Row */}
      <div
        style={{
          width: "100%",
          maxWidth: 1600,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "48px 80px 32px 80px",
          marginTop: 24,
          border: 0,
          boxSizing: "border-box",
        }}
      >
        {/* Branding and legal links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span
            style={{
              color: "white",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: 29,
              wordWrap: "break-word",
            }}
          >
            GigExecs
          </span>
          <span style={{ color: "white", fontSize: 16, fontFamily: "Madera, sans-serif", fontWeight: 400, wordWrap: "break-word", opacity: 0.9 }}>|</span>
          <span style={{ color: "white", fontSize: 16, fontFamily: "Madera, sans-serif", fontWeight: 400, wordWrap: "break-word", opacity: 0.9 }}>© 2025 GigExecs. All rights reserved</span>
          <span style={{ color: "white", fontSize: 16, fontFamily: "Madera, sans-serif", fontWeight: 400, wordWrap: "break-word", opacity: 0.9 }}>|</span>
          <Link to="/data-privacy-policy" style={{ color: "white", fontSize: 16, fontFamily: "Madera, sans-serif", fontWeight: 400, wordWrap: "break-word", opacity: 0.9, textDecoration: "none" }}>
            Data Privacy Policy
          </Link>
          <span style={{ color: "white", fontSize: 16, fontFamily: "Madera, sans-serif", fontWeight: 400, wordWrap: "break-word", opacity: 0.9 }}>|</span>
          <Link to="/terms-and-conditions" style={{ color: "white", fontSize: 16, fontFamily: "Madera, sans-serif", fontWeight: 400, wordWrap: "break-word", opacity: 0.9, textDecoration: "none" }}>
            Terms and Conditions
          </Link>
        </div>
        {/* Social icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#" aria-label="Facebook" style={{ color: "white", fontSize: 32, opacity: 0.9 }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M21.333 16h-3.2v10.667h-4V16h-2.133v-3.2h2.133v-2.133c0-2.56 1.28-4.134 4.134-4.134h2.134v3.2h-1.28c-0.96 0-1.067 0.4-1.067 1.067v2h2.347L21.333 16z" fill="currentColor"/></svg>
          </a>
          <a href="#" aria-label="Twitter" style={{ color: "white", fontSize: 32, opacity: 0.9 }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M28.267 8.8c-0.8 0.347-1.6 0.533-2.56 0.64 0.96-0.56 1.6-1.333 1.92-2.347-0.8 0.48-1.707 0.8-2.56 1.067-0.8-0.8-1.92-1.28-3.2-1.28-2.56 0-4.48 2.027-4.48 4.48 0 0.347 0 0.693 0.08 0.96-3.68-0.16-6.827-1.92-8.96-4.48-0.4 0.693-0.64 1.387-0.64 2.24 0 1.493 0.8 2.773 2.027 3.52-0.693 0-1.387-0.16-2.027-0.48v0.08c0 2.027 1.493 3.68 3.52 4.08-0.347 0.08-0.693 0.16-1.067 0.16-0.267 0-0.533 0-0.8-0.08 0.533 1.707 2.133 2.987 4.08 2.987-1.493 1.173-3.36 1.867-5.387 1.867-0.347 0-0.693 0-1.04-0.08 1.92 1.28 4.134 2.027 6.507 2.027 7.787 0 12.053-6.453 12.053-12.053 0-0.16 0-0.32 0-0.48 0.8-0.56 1.6-1.333 2.133-2.133z" fill="currentColor"/></svg>
          </a>
          <a href="#" aria-label="LinkedIn" style={{ color: "white", fontSize: 32, opacity: 0.9 }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M8.8 12.267h4V24h-4V12.267zM10.8 8.8c1.28 0 2.133 0.96 2.133 2.133 0 1.067-0.853 2.027-2.133 2.027-1.28 0-2.133-0.96-2.133-2.027 0-1.173 0.853-2.133 2.133-2.133zM13.867 12.267h3.84v1.6h0.053c0.533-1.013 1.707-2.027 3.52-2.027 3.733 0 4.427 2.453 4.427 5.653V24h-4v-5.013c0-1.2-0.027-2.773-1.707-2.773-1.707 0-1.973 1.333-1.973 2.693V24h-4V12.267z" fill="currentColor"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;