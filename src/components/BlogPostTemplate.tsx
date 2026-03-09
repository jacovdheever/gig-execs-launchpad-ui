/**
 * Reusable template for blog article pages.
 * Renders nav, PageMeta, JsonLd (breadcrumb + BlogPosting), H1, TL;DR, main content, CTA block, footer.
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PageMeta } from "@/components/PageMeta"
import { JsonLd } from "@/components/JsonLd"
import { breadcrumbSchema, blogPostingSchema } from "@/lib/schema"
import { formatBlogDate } from "@/lib/blogPosts"

export interface BlogPostTemplatePost {
  title: string
  slug: string
  metaDescription: string
  /** TL;DR: string for paragraph, or string[] for 3 bullets */
  tldr: string | string[]
  author: string
  datePublished: string
  dateModified: string
  image: string
}

interface BlogPostTemplateProps {
  post: BlogPostTemplatePost
  children: React.ReactNode
}

export function BlogPostTemplate({ post, children }: BlogPostTemplateProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const path = `/blog/${post.slug}`

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title={post.title}
        description={post.metaDescription}
        path={path}
        ogImage={post.image}
        ogType="article"
      />
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ]),
          blogPostingSchema({
            headline: post.title,
            description: post.metaDescription,
            datePublished: post.datePublished,
            dateModified: post.dateModified,
            author: post.author,
            url: path,
            image: post.image,
          }),
        ]}
      />

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a
                href="/"
                className="text-2xl font-extrabold text-slate-900 hover:text-[#0284C7] transition-colors cursor-pointer"
              >
                GigExecs
              </a>
            </div>
            <div className="hidden lg:flex items-center space-x-12">
              <a href="/" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">
                What is GigExecs
              </a>
              <a href="/clients" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">
                Clients
              </a>
              <a href="/professionals" className="text-[#1F2937] hover:text-[#0284C7] transition-colors">
                Professionals
              </a>
              <a href="/blog" className="text-[#0284C7] font-semibold">
                Blog
              </a>
            </div>
            <div className="flex items-center">
              <Button
                variant="outline"
                className="border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5] rounded-r-none border-r-0"
              >
                <a href="/auth/login" className="w-full h-full flex items-center justify-center">
                  Sign in
                </a>
              </Button>
              <Button className="bg-[#012E46] hover:bg-[#0284C7] text-white rounded-l-none">
                <a
                  href="/auth/register"
                  className="w-full h-full flex items-center justify-center text-white"
                >
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#F5F5F5]">
              <a
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors"
              >
                What is GigExecs
              </a>
              <a
                href="/clients"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors"
              >
                Clients
              </a>
              <a
                href="/professionals"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors"
              >
                Professionals
              </a>
              <a
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#1F2937] hover:text-[#0284C7] transition-colors font-semibold"
              >
                Blog
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <section className="py-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-[#6B7280] hover:text-[#0284C7] transition-colors">
                  Home
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 text-[#9CA3AF] mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <a href="/blog" className="text-[#6B7280] hover:text-[#0284C7] transition-colors">
                  Blog
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 text-[#9CA3AF] mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#1F2937] font-medium">{post.title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="text-lg font-semibold text-[#1F2937] mb-2">{post.author}</div>
            <div className="text-[#6B7280]">{formatBlogDate(post.datePublished)}</div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-12 leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* TL;DR Section */}
      <section className="py-6 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">TL;DR</h2>
            {Array.isArray(post.tldr) ? (
              <ul className="text-[#6B7280] leading-relaxed space-y-2 list-disc list-inside">
                {post.tldr.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[#6B7280] leading-relaxed">{post.tldr}</p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">{children}</div>
        </div>
      </section>

      {/* Next Step CTA Block */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] text-center mb-10">
            Next step
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <a
              href="/clients"
              className="group block rounded-lg border border-border/50 bg-white px-6 py-6 transition-colors hover:bg-muted/30 hover:border-[#0284C7]/40 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Hiring senior expertise?
              </p>
              <p className="text-base text-[#1F2937] mb-3 leading-snug">
                Access vetted independent consultants for advisory, interim leadership, fractional
                roles, and project engagements.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-[#0284C7] group-hover:underline">
                Explore our offering for Clients →
              </span>
            </a>
            <a
              href="/professionals"
              className="group block rounded-lg border border-border/50 bg-white px-6 py-6 transition-colors hover:bg-muted/30 hover:border-[#0284C7]/40 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Are you a senior professional?
              </p>
              <p className="text-base text-[#1F2937] mb-3 leading-snug">
                Join a premium network built on credibility and meaningful flexible work.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-[#0284C7] group-hover:underline">
                Explore Professionals →
              </span>
            </a>
          </div>
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
                <li>
                  <a href="/how-it-works" className="hover:text-white transition-colors">
                    How it works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li>
                  <a href="/help" className="hover:text-white transition-colors">
                    Help
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li>
                  <a href="/terms-and-conditions" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/data-privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
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
