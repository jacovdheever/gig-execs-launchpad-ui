import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { X } from "lucide-react"

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Function to determine if a link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/pricing";
    }
    return location.pathname.startsWith(path);
  };

  // Function to get link styling based on active state
  const getLinkStyle = (path: string) => ({
    color: isActive(path) ? "#CC9B0A" : "white",
    fontSize: 14,
    fontFamily: "Open Sans, sans-serif",
    fontWeight: isActive(path) ? 600 : 400,
    letterSpacing: 0.56,
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  });

  // Custom hamburger menu icon
  const HamburgerIcon = () => (
    <div className="flex flex-col gap-1.5">
      <div className="w-6 h-0.5 bg-white"></div>
      <div className="w-3 h-0.5 bg-white"></div>
      <div className="w-6 h-0.5 bg-white"></div>
    </div>
  );

  return (
    <header className="w-full bg-[#012E46] overflow-hidden sticky top-0 z-50">
      <div className="w-full px-4 sm:px-8 lg:px-32 py-3 lg:py-4 bg-[#012E46] flex justify-between items-center">
        {/* Mobile Menu Button - Left Side */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <HamburgerIcon />}
        </button>

        {/* Logo - Centered on Mobile, Left on Desktop */}
        <Link to="/" className="text-decoration-none flex-1 lg:flex-none flex justify-center lg:justify-start">
          <div className="w-32 sm:w-36 lg:w-[145px] h-8 sm:h-9 lg:h-[38px] flex items-center">
            <div className="text-white text-xl sm:text-2xl lg:text-[29px] font-extrabold font-montserrat">
              GigExecs
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex w-[572px] justify-between items-center">
          <Link to="/" className="text-decoration-none">
            <div style={getLinkStyle("/")} className="flex flex-col justify-center">
              What is GigExecs
            </div>
          </Link>
          <Link to="/clients" className="text-decoration-none">
            <div style={getLinkStyle("/clients")} className="flex flex-col justify-center">
              Clients
            </div>
          </Link>
          <Link to="/professionals" className="text-decoration-none">
            <div style={getLinkStyle("/professionals")} className="flex flex-col justify-center">
              Professionals
            </div>
          </Link>
          <Link to="/blog" className="text-decoration-none">
            <div style={getLinkStyle("/blog")} className="flex flex-col justify-center">
              Blog
            </div>
          </Link>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <a 
            href="https://gigexecs.com/login" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-decoration-none"
          >
            <div className="h-10 px-8 sm:px-12 py-2 bg-[#4885AA] flex justify-center items-center gap-2 cursor-pointer rounded">
              <div className="text-center text-white text-sm sm:text-base font-bold font-montserrat">
                Sign in
              </div>
            </div>
          </a>
          <a 
            href="https://gigexecs.com/signup" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-decoration-none"
          >
            <div className="h-10 px-8 sm:px-12 py-2 bg-[#CC9B0A] flex justify-center items-center gap-2 cursor-pointer rounded">
              <div className="text-center text-white text-sm sm:text-base font-bold font-montserrat">
                Join
              </div>
            </div>
          </a>
        </div>

        {/* Invisible spacer for mobile to keep logo centered */}
        <div className="lg:hidden w-10"></div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#012E46] border-t border-gray-700">
          <div className="px-4 py-6 space-y-4">
            <Link 
              to="/" 
              className="block text-white hover:text-[#CC9B0A] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              What is GigExecs
            </Link>
            <Link 
              to="/clients" 
              className="block text-white hover:text-[#CC9B0A] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Clients
            </Link>
            <Link 
              to="/professionals" 
              className="block text-white hover:text-[#CC9B0A] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Professionals
            </Link>
            <Link 
              to="/blog" 
              className="block text-white hover:text-[#CC9B0A] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="pt-4 space-y-3">
              <a 
                href="https://gigexecs.com/login" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center py-3 px-6 bg-[#4885AA] text-white font-bold rounded"
              >
                Sign in
              </a>
              <a 
                href="https://gigexecs.com/signup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center py-3 px-6 bg-[#CC9B0A] text-white font-bold rounded"
              >
                Join
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header