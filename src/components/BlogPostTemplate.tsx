/**
 * Reusable template for blog article pages.
 * Renders nav, PageMeta, JsonLd (breadcrumb + BlogPosting), H1, Key takeaways, main content, CTA block, footer.
 */

import { Button } from "@/components/ui/button"
import { PageMeta } from "@/components/PageMeta"
import { MarketingNav } from "@/components/MarketingNav"
import { MarketingFooter } from "@/components/MarketingFooter"
import { JsonLd } from "@/components/JsonLd"
import { breadcrumbSchema, blogPostingSchema } from "@/lib/schema"
import { formatBlogDate } from "@/lib/blogPosts"

export interface BlogPostTemplatePost {
  title: string
  slug: string
  metaDescription: string
  /** Key takeaways: string for paragraph, or string[] for bullets */
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
  const path = `/blog/${post.slug}`
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
      <MarketingNav />

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

      {/* Key takeaways */}
      <section className="py-6 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">Key takeaways</h2>
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
      <MarketingFooter />
    </div>
  )
}
