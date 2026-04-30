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

/** Look up post by legacy blogNumber (1–21) for backward compatibility */
export function getPostByNumber(n: number): BlogPost | undefined {
  return blogPosts.find((p) => p.number === n)
}

/** Look up post by link path (e.g. "/blog/your-network-needs-a-system-not-just-contacts") */
export function getPostByLink(link: string): BlogPost | undefined {
  return blogPosts.find((p) => p.link === link)
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
  {
    number: 11,
    image: "/images/blog/1741536170587.png",
    alt: "Senior professionals building a credible network system for independent consulting",
    title: "Your Network Needs a System (Not Just Old Contacts)",
    description:
      "Relationships still matter—but networks decay. Here's how senior professionals build repeatable deal flow using modern, credible systems.",
    author: "Nuno G. Rodrigues",
    date: "2026-01-01",
    link: "/blog/your-network-needs-a-system-not-just-contacts",
    category: "Independent Consulting",
  },
  {
    number: 12,
    image: "/images/blog/1756796368364.png",
    alt: "Senior professionals adapting to AI and flexible work models",
    title: "Work Is Changing Fast: How Senior Professionals Stay Relevant",
    description:
      "AI and flexible work are reshaping careers. A practical playbook for senior professionals to stay relevant, credible, and in demand.",
    author: "Nuno G. Rodrigues",
    date: "2026-01-08",
    link: "/blog/work-is-changing-fast-how-senior-professionals-stay-relevant",
    category: "Future of Work & AI",
  },
  {
    number: 13,
    image: "/images/blog/1746449160182.png",
    alt: "Experienced professionals navigating outdated hiring systems",
    title: "You're Not the Problem. The Hiring System Is Outdated.",
    description:
      "Age bias and rigid hiring cycles are real. Here's how experienced professionals can reframe value and find meaningful flexible engagements.",
    author: "Nuno G. Rodrigues",
    date: "2026-01-15",
    link: "/blog/youre-not-the-problem-the-hiring-system-is-outdated",
    category: "Senior Careers & Longevity",
  },
  {
    number: 14,
    image: "/images/blog/Blog5.png",
    alt: "The age of experience: senior professionals and flexible work",
    title: "The Age of Experience Is Here (If We Change the Rules)",
    description:
      "Experience isn't a liability—it's leverage. Two shifts unlock the future: how companies engage talent and how seniors position themselves.",
    author: "Nuno G. Rodrigues",
    date: "2026-01-22",
    link: "/blog/the-age-of-experience-is-here",
    category: "Senior Careers & Longevity",
  },
  {
    number: 15,
    image: "/images/blog/1746448473098.png",
    alt: "Interim and fractional leadership for senior talent",
    title: "From Corner Office to On-Demand: The New Shape of Senior Talent",
    description:
      "Interim and fractional leadership are becoming mainstream. Why companies win, why senior professionals win, and how to engage credibly.",
    author: "Nuno G. Rodrigues",
    date: "2026-01-29",
    link: "/blog/from-corner-office-to-on-demand-the-new-shape-of-senior-talent",
    category: "Flexible Work Models",
  },
  {
    number: 16,
    image: "/images/blog/1756796368364.png",
    alt: "Longer careers and flexible engagement models for senior professionals",
    title: "Work Until 70 (or 80)? Maybe. But Not the Old Way.",
    description:
      "Longer careers are becoming reality. The solution isn't 'more work'—it's better models: advisory, interim, fractional, and projects.",
    author: "Nuno G. Rodrigues",
    date: "2026-02-05",
    link: "/blog/work-until-70-or-80-maybe-but-not-the-old-way",
    category: "Senior Careers & Longevity",
  },
  {
    number: 17,
    image: "/images/blog/1762428718567.png",
    alt: "GigExecs founder story: premium network for senior professionals",
    title: "Why We Built GigExecs (and Why the Timing Is Right)",
    description:
      "We built GigExecs to make senior independent work credible and accessible. Here's the story—and why flexible talent models are accelerating.",
    author: "Nuno G. Rodrigues",
    date: "2026-02-12",
    link: "/blog/why-we-built-gigexecs-and-why-the-timing-is-right",
    category: "Independent Consulting",
  },
  {
    number: 18,
    image: "/images/blog/1767345197729.png",
    alt: "Future of work: senior professionals and AI-driven change",
    title: "The Future of Work Is Already Here: What Senior Professionals Do Next",
    description:
      "AI is reshaping teams and careers. Here's what changes—and a practical pathway into credible, flexible independent work.",
    author: "Nuno G. Rodrigues",
    date: "2026-02-26",
    link: "/blog/the-future-of-work-is-already-here-what-senior-professionals-do-next",
    category: "Future of Work & AI",
  },
  {
    number: 19,
    image: "/images/blog/1770294953463.png",
    alt: "Pre-flight checklist for senior independent professionals",
    title: "A \"Pre-Flight\" Checklist for Senior Independent Professionals",
    description:
      "Thinking about going independent? A practical 6-step checklist to clarify your niche, build runway, package outcomes, and launch credibly.",
    author: "Nuno G. Rodrigues",
    date: "2026-03-08",
    link: "/blog/pre-flight-checklist-for-senior-independent-professionals",
    category: "Independent Consulting",
  },
  {
    number: 20,
    image: "/images/blog/layoffs-workforce-cover.png",
    alt: "Boardroom meeting with in-person executives and remote participants on a virtual conference screen discussing workforce strategy",
    title: "Are Layoffs Quietly Redesigning the Corporate Workforce?",
    description:
      "Layoffs may be doing more than cutting costs. Why AI, leaner teams, and flexible expertise are reshaping how companies build the modern workforce.",
    author: "Nuno G. Rodrigues",
    date: "2026-03-12",
    link: "/blog/are-layoffs-quietly-redesigning-the-corporate-workforce",
    category: "Future of Work & AI",
  },
  {
    number: 21,
    image: "/images/blog/fractional-economy-senior-talent-costs-cover.png",
    alt: "Fractional economy: senior talent, flexible expertise, and real-world cost benchmarks",
    title: "The Fractional Economy: What Senior Talent Really Costs",
    description:
      "What do fractional leaders cost today? A practical look at senior talent rates in the US and Europe, and why companies pay for flexible expertise.",
    author: "Nuno G. Rodrigues",
    date: "2026-04-17",
    link: "/blog/fractional-economy-what-senior-talent-really-costs",
    category: "Flexible Work Models",
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
