/* ==========================================================================
   NUMERIQ GLOBAL — BLOG DATA STORE
   Single source of truth for every blog post. Both the homepage's featured
   grid (assets/js/insights-featured.js) and the full Insights page
   (assets/js/insights-page.js) read this same array — add a post here and
   it appears in both places automatically, sorted by `publishedAt`.

   category must be one of the five canonical categories used by the
   Insights page filter: "Accounting", "Financial Reporting",
   "Planning & Forecasting", "Business Finance", "CFO Insights".
   ========================================================================== */

window.NUMERIQ_BLOGS = [
  {
    id: "understanding-your-cash-flow",
    title: "Understanding Your Cash Flow: What Business Owners Should Actually Watch",
    excerpt:
      "Cash flow can tell you things that a profit and loss statement cannot. Here are the key areas business owners should monitor to understand where cash is coming from, where it is going, and what it means for the business.",
    category: "Planning & Forecasting",
    cover: "/assets/images/insights/blog-1.webp",
    author: {
      name: "Muhammad Talha",
      role: "Co-Founder & Financial Operations Lead",
      avatar: "/assets/images/about/talha-avatar.webp",
    },
    publishedAt: "2026-08-25",
    readTime: "7 min read",
  },
  {
    id: "financial-insights-for-better-business-decisions",
    title: "Financial Insights for Better Business Decisions",
    excerpt:
      "The numbers your business generates every day hold more than a record of what happened, they hold a map of what to do next.",
    category: "Business Finance",
    cover: "/assets/images/insights/blog-2.webp",
    author: {
      name: "Muhammad Mateen",
      role: "Co-Founder & Technical Accounting Lead",
      avatar: "/assets/images/about/mateen-avatar.webp",
    },
    publishedAt: "2026-08-20",
    readTime: "6 min read",
  },
  {
    id: "what-your-profit-and-loss-statement-is-really-telling-you",
    title: "What Your Profit & Loss Statement Is Really Telling You",
    excerpt:
      "A P&L is more than a pass or fail on profitability. Read correctly, it points to exactly where your margins are being won or lost.",
    category: "Financial Reporting",
    cover: "/assets/images/insights/blog-3.webp",
    author: {
      name: "Muhammad Mateen",
      role: "Co-Founder & Technical Accounting Lead",
      avatar: "/assets/images/about/mateen-avatar.webp",
    },
    publishedAt: "2026-08-16",
    readTime: "5 min read",
  },
  {
    id: "cash-flow-forecasting-for-growing-businesses",
    title: "Cash Flow Forecasting for Growing Businesses",
    excerpt:
      "Growth can strain cash faster than it builds profit. Here's how to build a forecast that keeps you ahead of it.",
    category: "Planning & Forecasting",
    cover: "/assets/images/insights/blog-4.webp",
    author: {
      name: "Muhammad Talha",
      role: "Co-Founder & Financial Operations Lead",
      avatar: "/assets/images/about/talha-avatar.webp",
    },
    publishedAt: "2026-08-12",
    readTime: "5 min read",
  },
  {
    id: "when-to-hire-a-fractional-cfo",
    title: "When to Hire a Fractional CFO",
    excerpt:
      "Full-time CFO expertise, without the full-time cost, here's how to know when your business is ready.",
    category: "CFO Insights",
    cover: "/assets/images/insights/when-to-hire-a-fractional-cfo.webp",
    author: {
      name: "Muhammad Mateen",
      role: "Co-Founder & Technical Accounting Lead",
      avatar: "/assets/images/about/mateen-avatar.webp",
    },
    publishedAt: "2026-07-28",
    readTime: "4 min read",
  },
  {
    id: "how-to-prepare-your-books-for-year-end",
    title: "How to Prepare Your Books for Year-End",
    excerpt:
      "A calm year-end starts months earlier. Here's the groundwork that makes closing the books a formality, not a scramble.",
    category: "Accounting",
    cover: "/assets/images/insights/how-to-prepare-your-books-for-year-end.webp",
    author: {
      name: "Muhammad Talha",
      role: "Co-Founder & Financial Operations Lead",
      avatar: "/assets/images/about/talha-avatar.webp",
    },
    publishedAt: "2026-07-20",
    readTime: "4 min read",
  },
  {
    id: "closing-the-books-a-monthly-checklist",
    title: "Closing the Books: A Monthly Checklist",
    excerpt:
      "A clean monthly close is the foundation every good financial decision is built on. Here's the checklist we run internally.",
    category: "Accounting",
    cover: "/assets/images/insights/closing-the-books-a-monthly-checklist.webp",
    author: {
      name: "Muhammad Talha",
      role: "Co-Founder & Financial Operations Lead",
      avatar: "/assets/images/about/talha-avatar.webp",
    },
    publishedAt: "2026-07-15",
    readTime: "5 min read",
  },
];