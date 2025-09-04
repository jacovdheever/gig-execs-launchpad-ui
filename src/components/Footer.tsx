import React from "react";
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
  return (
    <footer className="bg-[#012E46] text-white w-full flex flex-col items-center p-0 relative overflow-hidden">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row justify-start items-start p-8 lg:p-16 gap-8 lg:gap-0 relative">
        {/* Circular Image - Perfect circle with proper aspect ratio */}
        <div className="flex justify-center items-center relative z-10 mb-8 lg:mb-0">
          <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-lg">
            <img
              src="/images/Footer.png"
              alt="Business desk"
              className="w-full h-full object-cover object-center"
              style={{
                aspectRatio: '1 / 1',
                objectPosition: 'center',
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16">
          {/* Left Column */}
          <div className="flex-1">
            <div className="mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold font-montserrat mb-4">
                Ready to get started?
              </h3>
              <p className="text-base lg:text-lg font-open-sans leading-relaxed mb-6">
                Join thousands of professionals and businesses who trust GigExecs for their project needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://gigexecs.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#CC9B0A] text-white font-bold rounded-lg hover:bg-[#B88A09] transition-colors"
                >
                  Get Started
                </a>
                <a
                  href="https://gigexecs.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#012E46] transition-colors"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-16">
            {footerLinks.map((section, index) => (
              <div key={index} className="flex flex-col gap-4">
                <h4 className="text-lg font-bold font-montserrat text-[#CC9B0A]">
                  {section.heading}
                </h4>
                <div className="flex flex-col gap-2">
                  {section.links.map((link, linkIndex) => {
                    const getLinkComponent = (linkText: string) => {
                      switch (linkText.toLowerCase()) {
                        case "pricing":
                          return <Link to="/pricing" className="text-white hover:text-[#CC9B0A] transition-colors">{linkText}</Link>;
                        case "about us":
                          return <Link to="/about" className="text-white hover:text-[#CC9B0A] transition-colors">{linkText}</Link>;
                        case "help":
                          return <Link to="/help" className="text-white hover:text-[#CC9B0A] transition-colors">{linkText}</Link>;
                        default:
                          return <a href="#" className="text-white hover:text-[#CC9B0A] transition-colors">{linkText}</a>;
                      }
                    };

                    return (
                      <div key={linkIndex}>
                        {getLinkComponent(link)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full border-t border-gray-600 mt-8 lg:mt-16">
        <div className="max-w-6xl mx-auto px-8 lg:px-16 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-300">
            © {new Date().getFullYear()} GigExecs. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;