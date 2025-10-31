# Personal Portfolio Website

A modern, full-stack personal portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. Features MDX-based content management, serverless API routes, and comprehensive SEO optimization.

## Features

- ✅ **Next.js 14 with App Router** - Modern React framework with SSR/SSG
- ✅ **TypeScript** - Type-safe development
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **MDX Content** - Blog posts and project case studies
- ✅ **API Routes** - Contact form, analytics tracking, resume download
- ✅ **Vercel Analytics** - Built-in performance tracking
- ✅ **SEO Optimized** - Sitemap, robots.txt, metadata
- ✅ **Email Integration** - Contact form with Resend
- ✅ **Dark Mode Ready** - Theme support built-in

## Tech Stack

### Core
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 19** - UI library

### Content & Data
- **MDX** - Markdown with JSX for blog/projects
- **gray-matter** - Frontmatter parsing
- **next-mdx-remote** - Server-side MDX rendering
- **rehype-pretty-code** - Syntax highlighting

### Backend Services
- **Resend** - Email delivery (100 emails/month free)
- **Vercel Analytics** - User tracking
- **Upstash Redis** - Rate limiting (optional)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm
- Resend account (for contact form)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` with your values:
\`\`\`env
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_EMAIL=your-email@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
portfolio/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── contact/       # Contact form endpoint
│   │   ├── track/         # Analytics tracking
│   │   └── download-resume/
│   ├── blog/              # Blog pages
│   ├── projects/          # Project pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── contact/          # Contact form
│   └── ...
├── content/              # Content files
│   ├── projects/         # Project MDX files
│   ├── blog/            # Blog post MDX files
│   └── data/            # JSON data (experience, skills)
├── lib/                  # Utilities
│   ├── mdx.ts           # MDX processing
│   ├── email.ts         # Email sending
│   ├── validation.ts    # Zod schemas
│   └── utils.ts         # Helpers
├── types/               # TypeScript types
│   ├── project.ts
│   ├── blog.ts
│   └── experience.ts
└── public/              # Static assets
\`\`\`

## Content Management

### Adding a New Blog Post

1. Create a new MDX file in \`content/blog/\`:

\`\`\`mdx
---
slug: "my-post"
title: "My Blog Post"
excerpt: "A short description"
publishedAt: "2024-10-27"
tags: ["React", "TypeScript"]
category: "Tutorial"
featured: false
---

# My Blog Post

Your content here...
\`\`\`

2. The post will automatically appear on the blog page

### Adding a New Project

1. Create a new MDX file in \`content/projects/\`:

\`\`\`mdx
---
slug: "my-project"
title: "My Project"
description: "One-line impact statement"
tldr:
  - "Key outcome 1"
  - "Key outcome 2"
role: "Developer"
teamSize: 1
duration: "2 months"
timeline:
  start: "2024-08-01"
  end: "2024-10-01"
tags: ["Next.js", "TypeScript"]
domain: ["Web Development"]
metrics: []
featured: true
publishedAt: "2024-10-27"
---

# Project Details

Your project description...
\`\`\`

## API Routes

### POST /api/contact
Contact form submission with email delivery.

**Request:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "message": "Hello!"
}
\`\`\`

### POST /api/track
Custom analytics event tracking.

### GET /api/download-resume
Resume download with tracking.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables (Production)

Add these in Vercel dashboard:
- \`RESEND_API_KEY\`
- \`CONTACT_EMAIL\`
- \`NEXT_PUBLIC_SITE_URL\`

## Customization

### Update Personal Information

1. Edit \`app/layout.tsx\` for site metadata
2. Update content in \`app/page.tsx\` for homepage
3. Edit \`content/data/experience.json\` for work experience
4. Edit \`content/data/skills.json\` for skills

### Styling

- Colors: Edit \`tailwind.config.ts\`
- Global styles: Edit \`app/globals.css\`

## Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
\`\`\`

## Cost Breakdown

**Monthly Cost: $0-5**

- Vercel Hosting: Free
- Resend Email: Free (100 emails/month)
- Vercel Analytics: Free (2,500 events/month)
- Domain: ~$12/year

## Features to Add

- [ ] Blog search functionality
- [ ] Newsletter signup
- [ ] Comments (via Giscus)
- [ ] Dark mode toggle
- [ ] Resume PDF generation
- [ ] Open source contributions page

## License

MIT

## Support

For issues or questions, please [open an issue](https://github.com/yourusername/portfolio/issues).
