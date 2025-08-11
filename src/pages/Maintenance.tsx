import { useState, useEffect } from 'react'

export default function Maintenance() {
  const [dots, setDots] = useState('')

  // Animated loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Logo/Brand */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              GigExecs
            </h1>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto rounded-full"></div>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            GigExecs is upgrading!
          </h2>

          {/* Subheading */}
          <h3 className="text-xl md:text-2xl text-[#FFD700] font-semibold">
            We're moving to our new platform to serve you better.
          </h3>

          {/* Main Paragraph */}
          <p className="text-lg md:text-xl text-white leading-relaxed max-w-3xl mx-auto">
            Our team is hard at work migrating from our current system to our new, custom-built platform. 
            This upgrade will bring you a faster, more secure, and more powerful experience. 
            We expect to be back online within the next few days.
          </p>

          {/* Appreciation Note */}
          <p className="text-base md:text-lg text-gray-300 italic">
            We appreciate your patience and can't wait to welcome you back!
          </p>

          {/* Animated Loading Dots */}
          <div className="mt-12">
            <div className="inline-flex items-center space-x-1 bg-[#FFD700] bg-opacity-20 px-6 py-3 rounded-full">
              <span className="text-[#FFD700] font-mono text-lg">
                Working on it{dots}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-[#FFD700] h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">Migration in progress...</p>
          </div>

          {/* Contact Info */}
          <div className="mt-16 pt-8 border-t border-gray-600">
            <p className="text-gray-400 text-sm">
              Need to reach us? Contact us at{' '}
              <a 
                href="mailto:support@gigexecs.com" 
                className="text-[#FFD700] hover:text-white transition-colors"
              >
                support@gigexecs.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
