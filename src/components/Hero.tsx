import React from "react"

const Hero = () => {
  return (
    <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[760px]">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          background:
            "linear-gradient(0deg, rgba(27, 54, 93, 0.4), rgba(27, 54, 93, 0.4)), url('/images/HeroPictureHome 1.png')",
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
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold font-montserrat leading-tight mb-4">
            <span className="text-[#012E46]">GigExecs: The</span>{" "}
            <span className="text-white">Premium</span>{" "}
            <span className="text-white">Freelance</span>{" "}
            <span className="text-white">Marketplace</span>{" "}
            <span className="text-[#012E46]">for</span>{" "}
            <span className="text-white">Experienced</span>{" "}
            <span className="text-[#012E46]">Professionals</span>
          </div>
          <div className="text-white text-sm sm:text-base md:text-lg lg:text-[18px] font-normal font-montserrat leading-relaxed mb-6">
            Connecting highly experienced freelancing professionals to global clients through a trusted and secure platform.
          </div>
          <a href="https://gigexecs.com/signup" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
            <div className="inline-flex items-center justify-center px-6 py-4 bg-[#CC9B0A] rounded-lg cursor-pointer hover:bg-[#B88A09] transition-colors">
              <div className="text-center text-white font-bold text-sm sm:text-base">
                Get Started
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
