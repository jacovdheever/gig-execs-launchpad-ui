import React from "react"
import { Link, useLocation } from "react-router-dom"

const Header = () => {
  const location = useLocation();
  
  // Function to determine if a link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/pricing";
    }
    return location.pathname.startsWith(path);
  };

  // Function to get link styling based on active state
  const getLinkStyle = (path: string) => ({
    justifyContent: "center" as const,
    display: "flex" as const,
    flexDirection: "column" as const,
    color: isActive(path) ? "#CC9B0A" : "white",
    fontSize: 14,
    fontFamily: "Open Sans, sans-serif",
    fontWeight: isActive(path) ? 600 : 400,
    letterSpacing: 0.56,
    wordWrap: "break-word" as const,
    cursor: "pointer" as const,
    transition: "all 0.2s ease-in-out",
  });

  return (
    <header style={{ width: "100%", background: "#012E46", overflow: "hidden", position: "sticky", top: 0, zIndex: 1000 }}>
      <div
        data-cta="true"
        style={{
          width: "100%",
          height: "100%",
          paddingTop: 48,
          paddingBottom: 16,
          paddingLeft: 120,
          paddingRight: 120,
          background: "#012E46",
          overflow: "hidden",
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
        <div
          data-property-1="White"
          style={{ width: 145.14, height: 38.12, position: "relative" }}
        >
          <div
            style={{
              width: 145.14,
              height: 38.12,
              left: 0,
              top: 0,
              position: "absolute",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "white",
              fontSize: 29,
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
              wordWrap: "break-word",
            }}
          >
            GigExecs
          </div>
        </div>
        </Link>
        {/* Navigation Links */}
        <div
          style={{
            width: 572,
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={getLinkStyle("/")}>
            What is GigExecs
          </div>
          </Link>
          <Link to="/clients" style={{ textDecoration: "none" }}>
            <div style={getLinkStyle("/clients")}>
            Clients
          </div>
          </Link>
          <Link to="/professionals" style={{ textDecoration: "none" }}>
            <div style={getLinkStyle("/professionals")}>
            Professionals
          </div>
          </Link>
          <Link to="/blog" style={{ textDecoration: "none" }}>
            <div style={getLinkStyle("/blog")}>
            Blog
          </div>
          </Link>
        </div>
        {/* CTA Buttons */}
        <div
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            display: "flex",
          }}
        >
          <a href="https://gigexecs.com/login" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div
            style={{
              height: 40,
              paddingLeft: 48,
              paddingRight: 48,
              paddingTop: 8,
              paddingBottom: 8,
              background: "#4885AA",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              display: "flex",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "white",
                fontSize: 16,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                wordWrap: "break-word",
              }}
            >
              Sign in
            </div>
          </div>
          </a>
          <a href="https://gigexecs.com/signup" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div
            style={{
              height: 40,
              paddingLeft: 48,
              paddingRight: 48,
              paddingTop: 8,
              paddingBottom: 8,
              background: "#CC9B0A",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              display: "flex",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "white",
                fontSize: 16,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                wordWrap: "break-word",
              }}
            >
              Join
            </div>
          </div>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header