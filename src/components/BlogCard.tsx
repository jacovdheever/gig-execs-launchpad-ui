import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const BlogCard = ({ blogNumber }: { blogNumber: number }) => {
  // Blog data mapping - this is our single source of truth
  const blogData: Record<number, {
    image: string
    alt: string
    title: string
    description: string
    author: string
    date: string
    link: string
  }> = {
    1: {
      image: "/images/blog/Blog1.png",
      alt: "Remote, Hybrid, or In-Office work models",
      title: "Remote, Hybrid, or In-Office? Choosing the Right Work Model for Your Career.",
      description: "Is remote work the future, or is hybrid the best balance? Discover insights from 23 years of global experience on how work models impact career growth, flexibility, and the evolving job market. Read on to make the right choice for your career!",
      author: "Nuno G. Rodrigues",
      date: "March 15, 2024",
      link: "/blog/remote-hybrid-in-office"
    },
    2: {
      image: "/images/blog/Blog2.png",
      alt: "Corporate Leadership to Executive Freelancing",
      title: "From Corporate Leadership to Executive Freelancing: The Story Behind GigExecs",
      description: "This article updates readers on GigExecs' progress since launching its Beta version, showcasing a growing network of senior professionals from diverse industries globally. GigExecs' mission is to provide flexible work opportunities..",
      author: "Nuno G. Rodrigues",
      date: "May 6, 2024",
      link: "/blog/corporate-leadership-executive-freelancing"
    },
    3: {
      image: "/images/blog/Blog3.png",
      alt: "AI Revolution Strategies for Experienced Professionals",
      title: "Navigating the AI Revolution: Strategies for Senior Professionals",
      description: "The rise of AI is transforming industries, sparking both excitement and concern—especially for senior professionals. Will AI replace jobs, or can it be leveraged as an opportunity? In this article, we explore four key strategies to stay competitive in an AI-driven job market",
      author: "Nuno G. Rodrigues",
      date: "June 10, 2024",
      link: "/blog/ai-revolution-senior-professionals"
    },
    4: {
      image: "/images/blog/Blog4.png",
      alt: "Experience is Ageless - Job Market Anomaly",
      title: "The Big Anomaly of the Job Market: Older Talent",
      description: "The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a solution, offering flexible, high-quality opportunities for experienced individuals to stay active and financially stable without the stress of traditional job hunting.",
      author: "Nuno G. Rodrigues",
      date: "June 10, 2024",
      link: "/blog/job-market-anomaly-older-talent"
    },
    5: {
      image: "/images/blog/Blog5.png",
      alt: "Finding Purpose in the Second Half of Life",
      title: "Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals",
      description: "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…",
      author: "GigExecs Insider",
      date: "July 15, 2024",
      link: "/blog/finding-purpose-second-half-life"
    },
    6: {
      image: "/images/blog/Blog6.png",
      alt: "Building the Future of Flexible Work",
      title: "Building the Future of Flexible Work for Senior Professionals",
      description: "This article updates readers on GigExecs' progress since launching its Beta version, showcasing a growing network of senior professionals from diverse industries globally. GigExecs' mission is to provide flexible work opportunities, offering solutions to the challenges posed by longer careers and ageism.",
      author: "GigExecs Insider",
      date: "September 13, 2024",
      link: "/blog/building-future-flexible-work"
    },
    7: {
      image: "/images/blog/Blog7.png",
      alt: "AI, Robots, and the Future of Work",
      title: "AI, Robots, and the Future of Work: Buckle Up, Humans!",
      description: "AI is reshaping work by automating tasks, creating new fields, and driving the rise of flexible, project-based roles. Professionals must adapt by embracing human skills like creativity and emotional intelligence to stay relevant in an evolving landscape.",
      author: "GigExecs Insider",
      date: "January 21, 2025",
      link: "/blog/ai-robots-future-work-2025"
    },
    8: {
      image: "/images/blog/Blog8.png",
      alt: "The Future of Senior Work: Flexibility and Freelance",
      title: "The Future of Senior Work: Flexibility and Freelance Opportunities",
      description: "The article advocates for flexible work models for senior professionals, moving beyond traditional full-time roles. It highlights freelancing and short-term contracts as beneficial for both businesses and professionals, offering expertise without long-term commitments.",
      author: "Nuno G. Rodrigues",
      date: "March 25, 2024",
      link: "/blog/future-senior-work-flexibility-freelance"
    },
    9: {
      image: "/images/blog/Blog9.png",
      alt: "The 20% Challenge for 2025: Flexible Work",
      title: "The 20% Challenge for 2025: Flexible Work for Senior Professionals",
      description: "The article advocates for businesses to convert 20% of senior full-time roles to flexible positions by 2025. This shift benefits companies with cost savings, access to specialized talent, and agility, while providing senior professionals with opportunities for meaningful work and better work-life balance.",
      author: "Nuno G. Rodrigues",
      date: "March 25, 2024",
      link: "/blog/20-percent-challenge-flexible-work-2025"
    },
    10: {
      image: "/images/blog/Blog10.png",
      alt: "Master Mental Clarity: Stress Management Strategies",
      title: "Master Mental Clarity: Management Strategies for High Performers Who Give It Their All",
      description: "High performers can prevent burnout by prioritizing self-care, practicing gratitude, learning from stress, expressing emotions, and building a supportive community. GigExecs helps professionals thrive while maintaining balance.",
      author: "Nuno G. Rodrigues",
      date: "March 25, 2024",
      link: "/blog/master-mental-clarity-stress-management-high-performers"
    }
  }

  const blog = blogData[blogNumber]

  if (!blog) {
    return null
  }

  return (
    <Card className="bg-white hover:shadow-lg transition-shadow duration-300 p-0">
      <div className="h-48 rounded-t-lg overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.alt} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl leading-tight">
          <a href={blog.link} className="hover:text-[#0284C7] transition-colors">
            {blog.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-[#9CA3AF] leading-relaxed">
          {blog.description}
        </CardDescription>
        <div className="text-sm text-[#6B7280]">
          {blog.author} | {blog.date}
        </div>
        <a href={blog.link} className="inline-flex items-center text-[#0284C7] hover:text-[#012E46] font-medium transition-colors ml-auto">
          Read More →
        </a>
      </CardContent>
    </Card>
  )
}

export default BlogCard
