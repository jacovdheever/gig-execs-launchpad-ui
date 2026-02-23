/**
 * Blog posts data for the blog index.
 * Single source of truth for post metadata, ordering, and categories.
 */

export const BLOG_CATEGORIES = [
  "Independent Consulting",
  "Flexible Work Models",
  "Future of Work & AI",
  "Senior Careers & Longevity",
  "Career Decisions & Workstyle",
] as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]

export interface BlogPost {
  /** Legacy id 1–10 for BlogCard blogNumber prop */
  number: number
  image: string
  alt: string
  title: string
  description: string
  author: string
  /** ISO date string for reliable sorting */
  date: string
  link: string
  category: BlogCategory
}

/** Look up post by legacy blogNumber (1–10) for backward compatibility */
export function getPostByNumber(n: number): BlogPost | undefined {
  return blogPosts.find((p) => p.number === n)
}

export const blogPosts: BlogPost[] = [
  {
    number: 1,
    image: "/images/blog/Blog1.png",
    alt: "Remote, Hybrid, or In-Office work models",
    title: "Remote, Hybrid, or In-Office? Choosing the Right Work Model for Your Career.",
    description:
      "Is remote work the future, or is hybrid the best balance? Discover insights from 23 years of global experience on how work models impact career growth, flexibility, and the evolving job market. Read on to make the right choice for your career!",
    author: "Nuno G. Rodrigues",
    date: "2024-03-15",
    link: "/blog/remote-hybrid-in-office",
    category: "Career Decisions & Workstyle",
  },
  {
    number: 2,
    image: "/images/blog/Blog2.png",
    alt: "Corporate Leadership to Executive Freelancing",
    title: "From Corporate Leadership to Executive Freelancing: The Story Behind GigExecs",
    description:
      "This article updates readers on GigExecs' progress since launching its Beta version, showcasing a growing network of senior professionals from diverse industries globally. GigExecs' mission is to provide flexible work opportunities..",
    author: "Nuno G. Rodrigues",
    date: "2024-05-06",
    link: "/blog/corporate-leadership-executive-freelancing",
    category: "Independent Consulting",
  },
  {
    number: 3,
    image: "/images/blog/Blog3.png",
    alt: "AI Revolution Strategies for Experienced Professionals",
    title: "Navigating the AI Revolution: Strategies for Senior Professionals",
    description:
      "The rise of AI is transforming industries, sparking both excitement and concern—especially for senior professionals. Will AI replace jobs, or can it be leveraged as an opportunity? In this article, we explore four key strategies to stay competitive in an AI-driven job market",
    author: "Nuno G. Rodrigues",
    date: "2024-06-10",
    link: "/blog/ai-revolution-senior-professionals",
    category: "Future of Work & AI",
  },
  {
    number: 4,
    image: "/images/blog/Blog4.png",
    alt: "Experience is Ageless - Job Market Anomaly",
    title: "The Big Anomaly of the Job Market: Older Talent",
    description:
      "The article addresses the job security concerns of older professionals, emphasizing the difficulty of finding new work as they age. It proposes the gig economy as a solution, offering flexible, high-quality opportunities for experienced individuals to stay active and financially stable without the stress of traditional job hunting.",
    author: "Nuno G. Rodrigues",
    date: "2024-06-10",
    link: "/blog/job-market-anomaly-older-talent",
    category: "Senior Careers & Longevity",
  },
  {
    number: 5,
    image: "/images/blog/Blog5.png",
    alt: "Finding Purpose in the Second Half of Life",
    title: "Finding Purpose in the Second Half of Life: How the Gig Economy Empowers Senior Professionals",
    description:
      "Explore how gig work allows professionals to utilize their skills, mentor, consult, and engage in meaningful projects. It offers strategies for successfully navigating this shift, such as networking, continuous learning, and more…",
    author: "GigExecs Insider",
    date: "2024-07-15",
    link: "/blog/finding-purpose-second-half-life",
    category: "Senior Careers & Longevity",
  },
  {
    number: 6,
    image: "/images/blog/Blog6.png",
    alt: "Building the Future of Flexible Work",
    title: "Building the Future of Flexible Work for Senior Professionals",
    description:
      "This article updates readers on GigExecs' progress since launching its Beta version, showcasing a growing network of senior professionals from diverse industries globally. GigExecs' mission is to provide flexible work opportunities, offering solutions to the challenges posed by longer careers and ageism.",
    author: "GigExecs Insider",
    date: "2024-09-13",
    link: "/blog/building-future-flexible-work",
    category: "Flexible Work Models",
  },
  {
    number: 7,
    image: "/images/blog/Blog7.png",
    alt: "AI, Robots, and the Future of Work",
    title: "AI, Robots, and the Future of Work: Buckle Up, Humans!",
    description:
      "AI is reshaping work by automating tasks, creating new fields, and driving the rise of flexible, project-based roles. Professionals must adapt by embracing human skills like creativity and emotional intelligence to stay relevant in an evolving landscape.",
    author: "GigExecs Insider",
    date: "2025-01-21",
    link: "/blog/ai-robots-future-work-2025",
    category: "Future of Work & AI",
  },
  {
    number: 8,
    image: "/images/blog/Blog8.png",
    alt: "The Future of Senior Work: Flexibility and Freelance",
    title: "The Future of Senior Work: Flexibility and Freelance Opportunities",
    description:
      "The article advocates for flexible work models for senior professionals, moving beyond traditional full-time roles. It highlights freelancing and short-term contracts as beneficial for both businesses and professionals, offering expertise without long-term commitments.",
    author: "Nuno G. Rodrigues",
    date: "2024-03-25",
    link: "/blog/future-senior-work-flexibility-freelance",
    category: "Flexible Work Models",
  },
  {
    number: 9,
    image: "/images/blog/Blog9.png",
    alt: "The 20% Challenge for 2025: Flexible Work",
    title: "The 20% Challenge for 2025: Flexible Work for Senior Professionals",
    description:
      "The article advocates for businesses to convert 20% of senior full-time roles to flexible positions by 2025. This shift benefits companies with cost savings, access to specialized talent, and agility, while providing senior professionals with opportunities for meaningful work and better work-life balance.",
    author: "Nuno G. Rodrigues",
    date: "2024-03-25",
    link: "/blog/20-percent-challenge-flexible-work-2025",
    category: "Flexible Work Models",
  },
  {
    number: 10,
    image: "/images/blog/Blog10.png",
    alt: "Master Mental Clarity: Stress Management Strategies",
    title: "Master Mental Clarity: Management Strategies for High Performers Who Give It Their All",
    description:
      "High performers can prevent burnout by prioritizing self-care, practicing gratitude, learning from stress, expressing emotions, and building a supportive community. GigExecs helps professionals thrive while maintaining balance.",
    author: "Nuno G. Rodrigues",
    date: "2024-03-25",
    link: "/blog/master-mental-clarity-stress-management-high-performers",
    category: "Career Decisions & Workstyle",
  },
]

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

/** Format ISO date to display string (e.g. "March 15, 2024") */
export function formatBlogDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

/** Get posts sorted newest first */
export function getBlogPostsNewestFirst(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))
}
