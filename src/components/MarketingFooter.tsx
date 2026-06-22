import { Link } from 'react-router-dom'

export function MarketingFooter() {
  return (
    <footer className="bg-[#012E46] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-2xl font-bold text-[#FACC15] mb-4">GigExecs</div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-xs">
              A premium network of experienced professionals shaping the present and future of work.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-4">Network</h3>
            <ul className="space-y-2 text-sm text-[#9CA3AF]">
              <li><Link to="/clients" className="hover:text-white transition-colors">Find Expertise</Link></li>
              <li><Link to="/professionals" className="hover:text-white transition-colors">Become an Expert</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">Vetting Standards</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-[#9CA3AF]">
              <li><Link to="/blog" className="hover:text-white transition-colors">Insights</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-[#9CA3AF]">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="mailto:help@gigexecs.com" className="hover:text-white transition-colors">Contact</a></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help &amp; Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-[#9CA3AF]">
              <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/data-privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[#1F2937]">
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#9CA3AF] mb-6">
            <a href="https://www.linkedin.com/company/gigexecs/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://www.facebook.com/p/GigExecscom-61555582934674/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
            <a href="https://x.com/GigExecs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
            <a href="https://www.instagram.com/gigexecs/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="mailto:help@gigexecs.com" className="hover:text-white transition-colors">Email</a>
          </div>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mb-4">
            Global Network | Experienced Professionals | Advisory, Consulting, Fractional &amp; Interim Opportunities
          </p>
          <p className="text-sm text-[#9CA3AF]">&copy; {new Date().getFullYear()} GigExecs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
