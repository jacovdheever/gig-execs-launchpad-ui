import { BlogPostTemplate } from "@/components/BlogPostTemplate"
import { getPostByLink } from "@/lib/blogPosts"

const LINK = "/blog/why-we-built-gigexecs-and-why-the-timing-is-right"

export default function BlogArticle17() {
  const blogPost = getPostByLink(LINK)
  if (!blogPost) return null

  const post = {
    title: blogPost.title,
    slug: "why-we-built-gigexecs-and-why-the-timing-is-right",
    metaDescription: blogPost.description,
    tldr: [
      "GigExecs was built to give senior professionals access to high-quality flexible work—advisory, interim, fractional, projects.",
      "The biggest challenge remains connecting with clients and HR leaders open to new ways of working; we’re bootstrapping and building trust.",
      "Demand for interim and fractional senior talent is growing; experience is an asset, not a liability.",
    ],
    author: blogPost.author,
    datePublished: blogPost.date,
    dateModified: blogPost.date,
    image: blogPost.image,
  }

  return (
    <BlogPostTemplate post={post}>
      <p className="text-lg text-[#1F2937] leading-relaxed mb-6">
        Jaco and I started this journey in late 2023 trying to solve a problem for ourselves, and for millions
        of other senior professionals like us: wouldn’t it be fantastic if there was an online platform
        exclusively for experienced professionals, where we could access high-quality global opportunities for
        flexible work? By flexible work, I mean everything except full-time employment—advisory roles, interim
        mandates, fractional leadership, short-term projects, and so on.
      </p>

      <h2 className="text-2xl font-bold text-[#1F2937] mt-10 mb-4">Why We Built GigExecs</h2>
      <p className="text-[#6B7280] leading-relaxed mb-6">
        With a lot of sweat, blood, and tears, we launched our beta version in mid-2024. The feedback from the
        market was great. We’ve vetted and onboarded remarkable senior professionals from all over the world,
        which for us is a clear sign that our community was and is ready for a solution like GigExecs. You can
        read more about <a href="/about" className="text-[#0284C7] hover:underline">our story</a> on the About
        page.
      </p>

      <h2 className="text-2xl font-bold text-[#1F2937] mt-10 mb-4">The Challenge: Clients and Trust</h2>
      <p className="text-[#6B7280] leading-relaxed mb-6">
        No surprise: our biggest challenge to date has been on the clients side—in particular, connecting
        directly with business leaders and HR departments who are open to new ways of working. That requires
        relationship-building and trust, which takes time and money. It’s a challenge for us because we
        continue to bootstrap and fund GigExecs ourselves.
      </p>
      <p className="text-[#6B7280] leading-relaxed mb-6">
        At the same time, we still see many HR leaders preferring to work with established, expensive
        recruitment brands they’ve always known, instead of embracing newer, more efficient ways to access
        experienced talent. I understand that—change doesn’t happen overnight; it’s a process. That’s also why
        we’re looking for local partners in different countries: experienced professionals who share our
        mission and want to become GigExecs Ambassadors, helping us grow our premium community and spread the
        word within their trusted networks.
      </p>

      <h2 className="text-2xl font-bold text-[#1F2937] mt-10 mb-4">The World of Work Is Moving Our Way</h2>
      <p className="text-[#6B7280] leading-relaxed mb-6">
        The encouraging part: despite the AI boom, the world of work is actually moving in our direction.
        Across industries, leading global companies are increasingly turning to fractional, interim, and
        project-based senior professionals to fill critical gaps and drive transformation.{" "}
        <a
          href="https://www.robertwalters.de/en/insights/hiring-advice/blog/interim-management-indispensable.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0284C7] hover:underline"
        >
          Research from Robert Walters
        </a>{" "}
        points to strong demand for interim management in Europe.{" "}
        <a
          href="https://www.mbopartners.com/state-of-independence/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0284C7] hover:underline"
        >
          MBO Partners’ State of Independence
        </a>{" "}
        highlights the growth of independent work in the US. This shift isn’t just a trend—it’s a
        transformation.
      </p>
      <p className="text-[#6B7280] leading-relaxed mb-6">
        Companies are realising that senior expertise doesn’t always need to come in a full-time package.
        They’re buying outcomes, not hours—and often at a fraction of the cost of a permanent hire. For
        senior professionals, this means opportunity: new sources of income and flexibility, while keeping
        careers alive, meaningful, and relevant until later in life. If you want to see how{" "}
        <a href="/how-it-works" className="text-[#0284C7] hover:underline">
          vetting and matching work on GigExecs
        </a>
        , we’ve laid it out clearly—we’re a premium network and platform, not a recruitment agency.
      </p>

      <h2 className="text-2xl font-bold text-[#1F2937] mt-10 mb-4">Experience Is an Asset, Not a Liability</h2>
      <p className="text-[#6B7280] leading-relaxed mb-6">
        As we move into 2026, I encourage every one of you to see your experience as your edge. Keep your
        profile sharp, stay visible, and remain open to opportunities beyond the traditional job model.
        Experience needs to be celebrated—it’s an asset, not a liability.
      </p>
    </BlogPostTemplate>
  )
}
