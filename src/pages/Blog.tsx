import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import BlogCard from '@/components/BlogCard'
import { PageMeta } from '@/components/PageMeta'
import { JsonLd } from '@/components/JsonLd'
import { TrustBlocks } from '@/components/TrustBlocks'
import { breadcrumbSchema, blogIndexSchema } from '@/lib/schema'
import { getBlogPostsNewestFirst, BLOG_CATEGORIES } from '@/lib/blogPosts'
import type { BlogCategory } from '@/lib/blogPosts'

const Blog = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null)

  const allPosts = useMemo(() => getBlogPostsNewestFirst(), [])
  const posts = useMemo(
    () =>
      selectedCategory
        ? allPosts.filter((p) => p.category === selectedCategory)
        : allPosts,
    [allPosts, selectedCategory]
  )

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="Insights on Independent Consulting & Flexible Work"
        description="Explore expert insights on independent consulting, senior professionals, interim leadership, fractional roles, and the future of flexible work."
        path="/blog"
      />
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogIndexSchema({
            name: "GigExecs Insights",
            description:
              "Expert insights on independent consulting, senior professionals, and flexible work models.",
          }),
        ]}
      />

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-extrabold text-slate-900 hover:text-[#0284C7] transition-colors cursor-pointer">
                GigExecs
              </a>
      </div>
      
            <div className="hidden lg:flex items-center space-x-12">
              <a href="/" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" className="text-[#0284C7] font-semibold">Blog</a>
            </div>

            <div className="flex items-center">
              <Button variant="outline" className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] rounded-r-none border-r-0">
                <a href="/auth/login" className="w-full h-full flex items-center justify-center">
                  Sign in
                </a>
              </Button>
              <Button className="bg-[#012E46] hover:bg-[#0284C7] text-white rounded-l-none">
                <a href="/auth/register" className="w-full h-full flex items-center justify-center text-white">
                  Join
                </a>
              </Button>
                </div>

            <div className="lg:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-[#1F2937] hover:text-[#0284C7] transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
                </div>
              </div>

          <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#F5F5F5]">
              <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">What is GigExecs</a>
              <a href="/clients" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Clients</a>
              <a href="/professionals" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors">Professionals</a>
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-[#0284C7] font-semibold">Blog</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-6 leading-tight">
              Insights for Independent Consultants & Senior Professionals
            </h1>
            <p className="text-lg sm:text-xl text-[#9CA3AF] mb-4 max-w-3xl mx-auto leading-relaxed">
              Expert insights on independent consulting, senior professionals, flexible engagement models, and the future of work.
            </p>
            <p className="text-base text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              GigExecs publishes insights for vetted independent consultants, senior professionals, and organizations navigating flexible engagement models. Our focus: credibility, longevity, and the evolving future of work.
            </p>
          </div>
        </div>
      </section>
      
      {/* Blog Posts Grid */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mt-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1F2937] mb-2">
              Latest insights
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Practical guidance on independent consulting, senior careers, and flexible work models.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-full transition-colors ${
                  selectedCategory === null
                    ? 'bg-[#0284C7] text-white'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                All
              </button>
              {BLOG_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#0284C7] text-white'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.link} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Internal Linking Strip */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Link
              to="/clients"
              className="group block rounded-lg border border-border/50 bg-muted/30 px-6 py-5 transition-colors hover:bg-muted/50 hover:border-[#0284C7]/40 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">Hiring senior expertise?</p>
              <p className="text-base text-[#1F2937] mb-3 leading-snug">
                Access vetted independent consultants for advisory, interim leadership, fractional roles, and project engagements.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-[#0284C7] group-hover:underline">
                Explore our offering for Clients →
              </span>
            </Link>
            <Link
              to="/professionals"
              className="group block rounded-lg border border-border/50 bg-muted/30 px-6 py-5 transition-colors hover:bg-muted/50 hover:border-[#0284C7]/40 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">Are you a senior professional?</p>
              <p className="text-base text-[#1F2937] mb-3 leading-snug">
                Join a premium network built on credibility and meaningful flexible work.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-[#0284C7] group-hover:underline">
                Explore Professionals →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* TrustBlocks - Blog variant */}
      <section className="py-12 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBlocks variant="blog" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#012E46] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <div className="text-2xl font-bold text-[#FACC15] mb-4">GigExecs</div>
              <p className="text-[#9CA3AF]">
                The premier community connecting top professionals and innovative companies.
              </p>
                 </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">How it works</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="/how-it-works" className="hover:text-white transition-colors">How it works</a></li>
              </ul>
                 </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
               </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="/help" className="hover:text-white transition-colors">Help</a></li>
              </ul>
             </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/data-privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
                 </div>
               </div>
          <div className="border-t border-[#1F2937] mt-8 pt-8 text-center text-[#9CA3AF]">
            <p>&copy; {new Date().getFullYear()} GigExecs. All rights reserved.</p>
         </div>
        </div>
      </footer>
    </div>
  )
}

export default Blog 
