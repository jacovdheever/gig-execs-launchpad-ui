import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { BlogPost } from '@/lib/blogPosts'
import { formatBlogDate, getPostByNumber } from '@/lib/blogPosts'

interface BlogCardProps {
  /** Preferred: pass full post object (used by Blog index) */
  post?: BlogPost
  /** Legacy: pass blogNumber 1–10 (used by BlogArticle pages, HelpAndSupport, etc.) */
  blogNumber?: number
}

const BlogCard = ({ post: postProp, blogNumber }: BlogCardProps) => {
  const post = postProp ?? (blogNumber != null ? getPostByNumber(blogNumber) : undefined)
  if (!post) return null
  return (
    <Card className="bg-white hover:shadow-lg transition-shadow duration-300 p-0">
      <div className="h-48 rounded-t-lg overflow-hidden">
        <img
          src={post.image}
          alt={post.alt}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground mb-2 w-fit">
          {post.category}
        </span>
        <CardTitle className="text-xl leading-tight">
          <a href={post.link} className="hover:text-[#0284C7] transition-colors">
            {post.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-[#9CA3AF] leading-relaxed">
          {post.description}
        </CardDescription>
        <div className="text-sm text-[#6B7280]">
          {post.author} | {formatBlogDate(post.date)}
        </div>
        <a href={post.link} className="inline-flex items-center text-[#0284C7] hover:text-[#012E46] font-medium transition-colors ml-auto">
          Read More →
        </a>
      </CardContent>
    </Card>
  )
}

export default BlogCard
