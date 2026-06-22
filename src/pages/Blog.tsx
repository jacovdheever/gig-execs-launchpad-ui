import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import BlogCard from '@/components/BlogCard'
import { PageMeta } from '@/components/PageMeta'
import { MarketingNav } from '@/components/MarketingNav'
import { MarketingFooter } from '@/components/MarketingFooter'
import { JsonLd } from '@/components/JsonLd'
import { TrustBlocks } from '@/components/TrustBlocks'
import { breadcrumbSchema, blogIndexSchema } from '@/lib/schema'
import { getBlogPostsNewestFirst, BLOG_CATEGORIES } from '@/lib/blogPosts'
import type { BlogCategory } from '@/lib/blogPosts'

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null)

  const allPosts = useMemo(() => getBlogPostsNewestFirst(), [])
  const posts = useMemo(
    () =>
      selectedCategory
        ? allPosts.filter((p) => p.category === selectedCategory)
        : allPosts,
    [allPosts, selectedCategory]
  )
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
      <MarketingNav />

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
      <MarketingFooter />
    </div>
  )
}

export default Blog 
