# Backend Implementation Plan - Personal Portfolio Website

**Date:** October 27, 2025
**Project:** Personal Portfolio Website
**Budget:** $0-5/month
**Deployment:** Vercel (Serverless/Managed)

---

## Executive Summary

This document outlines the complete backend implementation plan for a personal portfolio website. The architecture uses Next.js 14 with App Router, MDX for content management, and serverless API routes for dynamic features. The entire stack runs on free tiers with a total monthly cost of $0.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Data Models](#data-models)
5. [API Endpoints](#api-endpoints)
6. [Content Management Strategy](#content-management-strategy)
7. [Analytics Implementation](#analytics-implementation)
8. [Security & Performance](#security--performance)
9. [Implementation Phases](#implementation-phases)
10. [Deployment Strategy](#deployment-strategy)
11. [Cost Breakdown](#cost-breakdown)
12. [Future Enhancements](#future-enhancements)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                            │
│  React Components + Tailwind CSS + TypeScript                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS APP (Vercel Edge Network)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  App Router  │  │  API Routes  │  │  Middleware  │         │
│  │   (Pages)    │  │  (Serverless)│  │ (Rate Limit) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│   MDX Files  │    │    Resend    │    │ Vercel Analytics │
│   (Content)  │    │   (Email)    │    │   (Tracking)     │
│              │    │              │    │                  │
│ - Projects   │    │ 100 emails/  │    │ - Page views     │
│ - Blog Posts │    │   month      │    │ - Web Vitals     │
│ - Experience │    │   FREE       │    │ - Custom events  │
└──────────────┘    └──────────────┘    │   FREE           │
                                        └──────────────────┘
```

### Architecture Principles

1. **Serverless-First:** No server management, auto-scaling, pay-per-use
2. **Edge-Optimized:** Content cached globally via Vercel CDN
3. **Git-Based Content:** All content version controlled, no database needed
4. **Type-Safe:** TypeScript throughout for reliability
5. **Performance-Focused:** Target Lighthouse score 90+ across all metrics

---

## Technology Stack

### Core Framework

| Component | Technology | Version | Purpose | Cost |
|-----------|-----------|---------|---------|------|
| **Framework** | Next.js | 14.2+ | React framework with SSR/SSG | $0 |
| **Language** | TypeScript | 5.3+ | Type safety | $0 |
| **Runtime** | Node.js | 18+ | JavaScript runtime | $0 |
| **Package Manager** | pnpm | 8+ | Fast, efficient dependency management | $0 |

### Frontend (Already Implemented)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **UI Framework** | React 18 | Component architecture |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Icons** | Lucide React | Icon library |
| **Animations** | Framer Motion | Smooth transitions |

### Backend Services

| Component | Technology | Free Tier | Purpose |
|-----------|-----------|-----------|---------|
| **Hosting** | Vercel | Unlimited bandwidth* | Deployment & CDN |
| **Email** | Resend | 100 emails/month | Contact form delivery |
| **Analytics** | Vercel Analytics | 2,500 events/month | User tracking |
| **Search** | Fuse.js | Unlimited | Client-side fuzzy search |

*Fair use policy applies

### Content & Data

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Content Format** | MDX | Blog posts & case studies |
| **Frontmatter** | gray-matter | Metadata parsing |
| **MDX Processing** | next-mdx-remote | Server-side MDX rendering |
| **Syntax Highlighting** | rehype-pretty-code | Code block styling |
| **Static Data** | JSON files | Experience, skills, etc. |

### Development Tools

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Linting** | ESLint | Code quality |
| **Formatting** | Prettier | Code style |
| **Type Checking** | TypeScript | Compile-time checks |
| **Git Hooks** | Husky | Pre-commit validation |

---

## Project Structure

```
personal-portfolio/
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout with SEO
│   ├── page.tsx                     # Home page
│   ├── globals.css                  # Global styles
│   │
│   ├── projects/
│   │   ├── page.tsx                 # Projects gallery
│   │   ├── loading.tsx              # Loading skeleton
│   │   └── [slug]/
│   │       ├── page.tsx             # Dynamic project detail
│   │       └── opengraph-image.tsx  # Dynamic OG image
│   │
│   ├── blog/
│   │   ├── page.tsx                 # Blog list
│   │   ├── [slug]/
│   │   │   └── page.tsx             # Blog post detail
│   │   └── tag/
│   │       └── [tag]/
│   │           └── page.tsx         # Posts by tag
│   │
│   ├── experience/
│   │   └── page.tsx                 # Experience timeline
│   │
│   ├── about/
│   │   └── page.tsx                 # About page
│   │
│   ├── contact/
│   │   └── page.tsx                 # Contact page
│   │
│   ├── api/                         # API Routes (Serverless)
│   │   ├── contact/
│   │   │   └── route.ts             # POST /api/contact
│   │   ├── track/
│   │   │   └── route.ts             # POST /api/track
│   │   └── download-resume/
│   │       └── route.ts             # GET /api/download-resume
│   │
│   ├── sitemap.ts                   # Dynamic sitemap generation
│   ├── robots.ts                    # robots.txt generation
│   └── not-found.tsx                # 404 page
│
├── content/                          # Content files (MDX & JSON)
│   ├── projects/
│   │   ├── realtime-chat-app.mdx
│   │   ├── ecommerce-platform.mdx
│   │   └── data-visualization-tool.mdx
│   │
│   ├── blog/
│   │   ├── optimizing-react-performance.mdx
│   │   ├── understanding-closures.mdx
│   │   └── my-dev-setup-2024.mdx
│   │
│   └── data/
│       ├── experience.json          # Work experience
│       ├── skills.json              # Skills & tech stack
│       └── about.json               # About page content
│
├── components/                       # React components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   │
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── CredibilityStrip.tsx
│   │   └── FeaturedProjects.tsx
│   │
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectFilters.tsx
│   │   ├── TLDRSection.tsx
│   │   └── MetricsStrip.tsx
│   │
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── TagPills.tsx
│   │   └── BlogSearch.tsx
│   │
│   ├── contact/
│   │   ├── ContactForm.tsx
│   │   └── SocialLinks.tsx
│   │
│   ├── mdx/
│   │   ├── MDXComponents.tsx        # Custom MDX components
│   │   ├── CodeBlock.tsx
│   │   ├── MetricsCard.tsx
│   │   └── Callout.tsx
│   │
│   └── ui/                          # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Toast.tsx
│       └── Skeleton.tsx
│
├── lib/                             # Utilities & helpers
│   ├── mdx.ts                      # MDX parsing & processing
│   ├── analytics.ts                # Analytics tracking helpers
│   ├── email.ts                    # Email sending via Resend
│   ├── ratelimit.ts                # Rate limiting utility
│   ├── validation.ts               # Zod schemas
│   └── utils.ts                    # General utilities
│
├── types/                           # TypeScript type definitions
│   ├── project.ts
│   ├── blog.ts
│   ├── experience.ts
│   └── analytics.ts
│
├── public/                          # Static assets
│   ├── resume.pdf
│   ├── images/
│   │   ├── projects/
│   │   ├── blog/
│   │   └── about/
│   ├── favicon.ico
│   └── robots.txt
│
├── .env.local                       # Environment variables (gitignored)
├── .env.example                     # Example env vars
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies
└── README.md                        # Project documentation
```

---

## Data Models

### Project (MDX Frontmatter)

```typescript
// types/project.ts
export interface Project {
  // Metadata
  slug: string;                      // URL-friendly identifier
  title: string;                     // Project name
  description: string;               // One-liner impact statement

  // TL;DR Section
  tldr: string[];                    // 3-5 outcome bullets with metrics

  // Context
  role: string;                      // "Lead Engineer", "Solo Developer"
  teamSize: number;                  // Number of team members
  duration: string;                  // "3 months", "6 weeks"
  timeline: {
    start: string;                   // ISO date
    end: string | null;              // null if ongoing
  };

  // Categorization
  tags: string[];                    // ["React", "TypeScript", "WebSocket"]
  domain: string[];                  // ["E-commerce", "FinTech"]

  // Metrics
  metrics: Array<{
    label: string;                   // "Response Time"
    before: string;                  // "2.3s"
    after: string;                   // "450ms"
    improvement: string;             // "-80%"
  }>;

  // Links
  liveUrl?: string;                  // Production URL
  repoUrl?: string;                  // GitHub repository
  caseStudyUrl?: string;             // External case study

  // Media
  coverImage: string;                // Hero image path
  images: string[];                  // Gallery images

  // Display
  featured: boolean;                 // Show on homepage
  publishedAt: string;               // ISO date
  updatedAt?: string;                // ISO date
}
```

**Example MDX File:**

```mdx
---
slug: "realtime-chat-app"
title: "Real-Time Chat Application"
description: "Built a WebSocket-based chat platform serving 50K+ daily users with 99.9% uptime"
tldr:
  - "Reduced message latency from 800ms to 45ms using optimized WebSocket connections"
  - "Scaled to 50K+ concurrent users with horizontal scaling and Redis pub/sub"
  - "Achieved 99.9% uptime over 6 months with comprehensive error handling"
role: "Lead Engineer"
teamSize: 4
duration: "4 months"
timeline:
  start: "2024-01-15"
  end: "2024-05-15"
tags: ["React", "TypeScript", "WebSocket", "Redis", "Node.js"]
domain: ["Real-Time", "Social"]
metrics:
  - label: "Message Latency"
    before: "800ms"
    after: "45ms"
    improvement: "-94%"
  - label: "Concurrent Users"
    before: "5K"
    after: "50K"
    improvement: "+900%"
liveUrl: "https://chat.example.com"
repoUrl: "https://github.com/username/chat-app"
coverImage: "/images/projects/chat-app-hero.png"
images:
  - "/images/projects/chat-architecture.png"
  - "/images/projects/chat-metrics.png"
featured: true
publishedAt: "2024-06-01"
---

# Real-Time Chat Application

## Context

When I joined the team, the existing chat system struggled with...

[Full MDX content with sections: Context, Approach, Implementation, Results, Reflection]
```

---

### Blog Post (MDX Frontmatter)

```typescript
// types/blog.ts
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;                   // Short summary (160 chars)

  // Content
  content: string;                   // MDX content (populated at build)

  // Metadata
  publishedAt: string;               // ISO date
  updatedAt?: string;                // ISO date
  readingTime: number;               // Minutes (calculated)

  // Categorization
  tags: string[];                    // ["React", "Performance"]
  category: string;                  // "Tutorial", "Case Study", "Opinion"

  // Media
  coverImage?: string;               // Header image

  // SEO
  featured: boolean;                 // Highlight on blog page
  seoTitle?: string;                 // Override title for SEO
  seoDescription?: string;           // Override excerpt for SEO
}
```

---

### Experience (JSON)

```typescript
// types/experience.ts
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;                 // ISO date
  endDate: string | null;            // null if current
  logo: string;                      // Company logo path
  location: string;                  // "San Francisco, CA" or "Remote"

  // Impact
  bullets: string[];                 // 3-5 quantified impact statements

  // Tech
  technologies: string[];            // Tech stack used

  // Links
  projects: string[];                // Slugs of related projects
  companyUrl?: string;
}
```

**Example JSON:**

```json
{
  "id": "acme-corp-2023",
  "company": "Acme Corp",
  "role": "Senior Software Engineer",
  "startDate": "2023-01-15",
  "endDate": null,
  "logo": "/images/companies/acme-logo.png",
  "location": "San Francisco, CA",
  "bullets": [
    "Redesigned caching layer using Redis cluster, cutting p95 API latency from 900ms to 180ms (-80%)",
    "Led migration to microservices architecture serving 2M+ requests/day with 99.95% uptime",
    "Mentored 3 junior engineers, establishing code review practices and testing standards"
  ],
  "technologies": ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS"],
  "projects": ["realtime-chat-app", "ecommerce-platform"],
  "companyUrl": "https://acme.com"
}
```

---

## API Endpoints

### 1. Contact Form Submission

**Endpoint:** `POST /api/contact`

**Purpose:** Handle contact form submissions and send email notifications

**Request Body:**
```typescript
interface ContactRequest {
  name: string;              // Required, 2-100 chars
  email: string;             // Required, valid email
  company?: string;          // Optional, max 100 chars
  message: string;           // Required, 10-5000 chars
  honeypot?: string;         // Spam trap (should be empty)
}
```

**Response:**
```typescript
// Success (200)
{
  success: true,
  message: "Message sent successfully"
}

// Error (400)
{
  success: false,
  error: "Validation error",
  details: {
    email: "Invalid email format"
  }
}

// Error (429)
{
  success: false,
  error: "Too many requests. Please try again later."
}
```

**Implementation:**
```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { sendEmail } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  message: z.string().min(10).max(5000),
  honeypot: z.string().optional(),
});

// Rate limiter: 3 requests per 10 minutes per IP
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "10 m"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? '127.0.0.1';
    const { success: rateLimitSuccess } = await ratelimit.limit(ip);

    if (!rateLimitSuccess) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse and validate
    const body = await request.json();

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ success: true }); // Silent fail for bots
    }

    const data = contactSchema.parse(body);

    // Send email
    await sendEmail({
      to: process.env.CONTACT_EMAIL!,
      subject: `Portfolio Contact: ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.flatten() },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### 2. Custom Analytics Tracking

**Endpoint:** `POST /api/track`

**Purpose:** Track custom events (project clicks, resume downloads)

**Request Body:**
```typescript
interface TrackEventRequest {
  event: string;              // Event name
  properties?: Record<string, any>;  // Additional data
}
```

**Response:**
```typescript
// Success (200)
{
  success: true
}
```

**Implementation:**
```typescript
// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { track } from '@vercel/analytics/server';

export async function POST(request: NextRequest) {
  try {
    const { event, properties } = await request.json();

    // Track with Vercel Analytics
    await track(event, properties);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
```

---

### 3. Resume Download

**Endpoint:** `GET /api/download-resume`

**Purpose:** Serve resume PDF with download tracking

**Response:** PDF file with proper headers

**Implementation:**
```typescript
// app/api/download-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { track } from '@vercel/analytics/server';

export async function GET(request: NextRequest) {
  try {
    // Track download
    await track('resume_download', {
      referrer: request.headers.get('referer'),
    });

    // Read PDF file
    const filePath = join(process.cwd(), 'public', 'resume.pdf');
    const fileBuffer = readFileSync(filePath);

    // Return with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="YourName-Resume.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}
```

---

## Content Management Strategy

### Why Git-Based Content?

**Advantages:**
- ✅ Version control for all content changes
- ✅ No database setup or maintenance
- ✅ Content lives alongside code
- ✅ Can review content changes via pull requests
- ✅ Easy backup and migration
- ✅ Works offline
- ✅ Fast builds with static generation

**Trade-offs:**
- ❌ No web-based admin UI (must edit files)
- ❌ Requires Git knowledge
- ❌ Not suitable for non-technical editors

---

### Content Workflow

#### 1. Creating a New Blog Post

```bash
# Create new MDX file
touch content/blog/my-new-post.mdx
```

```mdx
---
slug: "my-new-post"
title: "My New Blog Post"
excerpt: "A short summary of what this post is about"
publishedAt: "2024-10-27"
tags: ["React", "TypeScript"]
category: "Tutorial"
featured: false
---

# My New Blog Post

Content goes here...
```

#### 2. Creating a New Project

```bash
# Create new project file
touch content/projects/my-new-project.mdx
```

```mdx
---
slug: "my-new-project"
title: "My New Project"
description: "Built X that solved Y resulting in Z"
tldr:
  - "Key outcome 1 with metrics"
  - "Key outcome 2 with metrics"
  - "Key outcome 3 with metrics"
role: "Lead Developer"
teamSize: 1
duration: "2 months"
timeline:
  start: "2024-08-01"
  end: "2024-10-01"
tags: ["Next.js", "TypeScript"]
domain: ["Web Development"]
metrics:
  - label: "Performance"
    before: "3s"
    after: "800ms"
    improvement: "-73%"
coverImage: "/images/projects/my-project.png"
featured: true
publishedAt: "2024-10-27"
---

# Project content...
```

#### 3. Updating Experience

Edit `content/data/experience.json`:

```json
[
  {
    "id": "company-2024",
    "company": "New Company",
    "role": "Senior Engineer",
    "startDate": "2024-01-15",
    "endDate": null,
    "logo": "/images/companies/new-company.png",
    "location": "Remote",
    "bullets": [
      "Impact statement 1 with metrics",
      "Impact statement 2 with metrics",
      "Impact statement 3 with metrics"
    ],
    "technologies": ["React", "Node.js"],
    "projects": ["relevant-project-slug"]
  }
]
```

---

### MDX Processing Pipeline

```typescript
// lib/mdx.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import readingTime from 'reading-time';
import rehypePrettyCode from 'rehype-pretty-code';

const contentDirectory = path.join(process.cwd(), 'content');

// Get all blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDir = path.join(contentDirectory, 'blog');
  const filenames = fs.readdirSync(postsDir);

  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith('.mdx'))
      .map(async (filename) => {
        const filePath = path.join(postsDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          ...data,
          content,
          readingTime: Math.ceil(readingTime(content).minutes),
        } as BlogPost;
      })
  );

  // Sort by date descending
  return posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Get single blog post
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(contentDirectory, 'blog', `${slug}.mdx`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Serialize MDX for rendering
    const mdxSource = await serialize(content, {
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              onVisitLine(node: any) {
                if (node.children.length === 0) {
                  node.children = [{ type: 'text', value: ' ' }];
                }
              },
            },
          ],
        ],
      },
    });

    return {
      ...data,
      content: mdxSource,
      readingTime: Math.ceil(readingTime(content).minutes),
    } as BlogPost;
  } catch {
    return null;
  }
}

// Similar functions for projects...
export async function getProjects(): Promise<Project[]> { /* ... */ }
export async function getProject(slug: string): Promise<Project | null> { /* ... */ }
```

---

## Analytics Implementation

### Vercel Analytics (Built-in)

**Installation:**
```bash
npm install @vercel/analytics
```

**Setup:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**What You Get (Free):**
- Page views
- Unique visitors
- Top pages
- Referrer sources
- Core Web Vitals (LCP, FID, CLS)
- Device breakdown

---

### Custom Event Tracking

**Client-side tracking:**
```typescript
// components/projects/ProjectCard.tsx
import { track } from '@vercel/analytics';

function ProjectCard({ project }: { project: Project }) {
  const handleClick = () => {
    track('project_clicked', {
      project: project.slug,
      title: project.title,
      featured: project.featured,
    });
  };

  return (
    <a href={`/projects/${project.slug}`} onClick={handleClick}>
      {/* Card content */}
    </a>
  );
}
```

**Resume download tracking:**
```typescript
// components/ResumeDownloadButton.tsx
import { track } from '@vercel/analytics';

function ResumeDownloadButton() {
  const handleDownload = async () => {
    track('resume_download', {
      source: 'header_button',
    });

    // Trigger download
    window.open('/api/download-resume', '_blank');
  };

  return <button onClick={handleDownload}>Download Resume</button>;
}
```

**Contact form tracking:**
```typescript
// components/contact/ContactForm.tsx
import { track } from '@vercel/analytics';

async function handleSubmit(data: ContactFormData) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.ok) {
    track('contact_form_submitted', {
      hasCompany: !!data.company,
    });
  }
}
```

---

### Analytics Dashboard Access

**Vercel Dashboard:**
1. Navigate to your project on Vercel
2. Click "Analytics" tab
3. View real-time and historical data

**Key Metrics to Monitor:**
- Total page views (monthly)
- Projects detail page views (which projects get most interest)
- Resume download count
- Contact form submissions
- Core Web Vitals scores
- Bounce rate on homepage

---

## Security & Performance

### Security Measures

#### 1. Rate Limiting

**Using Upstash Redis (Free Tier: 10K requests/day):**

```bash
npm install @upstash/redis @upstash/ratelimit
```

```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const contactRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '10 m'), // 3 requests per 10 min
  analytics: true,
});

export const generalRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per min
  analytics: true,
});
```

---

#### 2. Input Validation (Zod)

```typescript
// lib/validation.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z
    .string()
    .email('Invalid email address')
    .max(255),
  company: z
    .string()
    .max(100)
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long'),
  honeypot: z.string().optional(), // Bot trap
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

---

#### 3. Spam Protection

**Honeypot Field (Invisible to Users):**

```typescript
// components/contact/ContactForm.tsx
<input
  type="text"
  name="honeypot"
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
/>
```

**Server-side check:**
```typescript
// app/api/contact/route.ts
if (body.honeypot) {
  // Bot detected - silent success
  return NextResponse.json({ success: true });
}
```

**Optional: Cloudflare Turnstile (Invisible CAPTCHA):**
```bash
npm install @marsidev/react-turnstile
```

---

#### 4. Environment Variables Security

```bash
# .env.local (NEVER COMMIT THIS FILE)
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_EMAIL=your-email@example.com
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx
```

```bash
# .env.example (Commit this as template)
RESEND_API_KEY=your_api_key_here
CONTACT_EMAIL=your-email@example.com
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

---

### Performance Optimization

#### 1. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/images/projects/hero.png"
  alt="Project screenshot"
  width={1200}
  height={630}
  priority={featured} // Load immediately if featured
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Low-quality placeholder
/>
```

**Image formats:**
- WebP/AVIF for modern browsers (automatic)
- Responsive srcset (automatic)
- Lazy loading (default)

---

#### 2. Static Generation

```typescript
// app/projects/[slug]/page.tsx
export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// This page is generated at build time
export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug);
  return <ProjectDetail project={project} />;
}
```

---

#### 3. Bundle Size Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Bundle analyzer (run: ANALYZE=true npm run build)
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
        })
      );
    }
    return config;
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
};

module.exports = nextConfig;
```

---

#### 4. Caching Strategy

```typescript
// app/projects/page.tsx
export const revalidate = 3600; // Revalidate every hour

// app/blog/[slug]/page.tsx
export const revalidate = 86400; // Revalidate every 24 hours
```

**Cache headers:**
- Static assets: `Cache-Control: public, max-age=31536000, immutable`
- Dynamic pages: `Cache-Control: s-maxage=3600, stale-while-revalidate`

---

## Implementation Phases

### Phase 1: Foundation & Setup (Week 1)

**Goals:** Project structure, core dependencies, basic routing

**Tasks:**
1. ✅ Initialize Next.js 14 project with TypeScript
   ```bash
   npx create-next-app@latest portfolio --typescript --tailwind --app --eslint
   cd portfolio
   ```

2. ✅ Install dependencies
   ```bash
   npm install next-mdx-remote gray-matter reading-time
   npm install rehype-pretty-code shiki
   npm install @vercel/analytics
   npm install zod
   npm install lucide-react
   npm install framer-motion
   ```

3. ✅ Set up folder structure (as shown in Project Structure section)

4. ✅ Configure TypeScript & ESLint
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "target": "ES2020",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "forceConsistentCasingInFileNames": true,
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true,
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

5. ✅ Create basic layouts and pages (empty shells)

6. ✅ Set up Tailwind with design system tokens
   ```typescript
   // tailwind.config.ts
   import type { Config } from 'tailwindcss';

   const config: Config = {
     content: [
       './app/**/*.{js,ts,jsx,tsx,mdx}',
       './components/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {
         colors: {
           primary: {
             DEFAULT: '#2563EB',
             hover: '#1D4ED8',
             pressed: '#1E40AF',
           },
           secondary: {
             DEFAULT: '#14B8A6',
             hover: '#0D9488',
           },
           // ... rest of design system colors
         },
         fontFamily: {
           sans: ['Inter', 'system-ui', 'sans-serif'],
           heading: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
           mono: ['JetBrains Mono', 'monospace'],
         },
       },
     },
     plugins: [],
   };

   export default config;
   ```

**Deliverables:**
- ✅ Running Next.js app on localhost:3000
- ✅ All routes accessible (even if empty)
- ✅ Design system tokens configured
- ✅ TypeScript compilation without errors

---

### Phase 2: Content System (Week 2)

**Goals:** MDX processing, content rendering, data fetching

**Tasks:**
1. ✅ Create MDX utilities (`lib/mdx.ts`)
   - `getBlogPosts()`, `getBlogPost(slug)`
   - `getProjects()`, `getProject(slug)`
   - Reading time calculation
   - Frontmatter parsing

2. ✅ Set up MDX components
   ```typescript
   // components/mdx/MDXComponents.tsx
   import { MDXRemote } from 'next-mdx-remote/rsc';

   const components = {
     h1: (props) => <h1 className="text-4xl font-bold" {...props} />,
     h2: (props) => <h2 className="text-3xl font-bold mt-8" {...props} />,
     code: (props) => <CodeBlock {...props} />,
     // ... custom components
   };

   export function MDXContent({ source }) {
     return <MDXRemote source={source} components={components} />;
   }
   ```

3. ✅ Create sample content files
   - 3 sample projects in `content/projects/`
   - 3 sample blog posts in `content/blog/`
   - Experience data in `content/data/experience.json`

4. ✅ Build dynamic pages
   - `/projects/[slug]` with static generation
   - `/blog/[slug]` with MDX rendering
   - `/experience` pulling from JSON

5. ✅ Implement syntax highlighting
   ```typescript
   // MDX options with rehype-pretty-code
   const mdxOptions = {
     rehypePlugins: [
       [
         rehypePrettyCode,
         {
           theme: 'github-dark',
           keepBackground: false,
         },
       ],
     ],
   };
   ```

**Deliverables:**
- ✅ MDX content renders properly
- ✅ Code blocks have syntax highlighting
- ✅ Dynamic routes work for all projects/posts
- ✅ Static generation at build time

---

### Phase 3: API Routes & Features (Week 3)

**Goals:** Contact form, email delivery, analytics tracking

**Tasks:**
1. ✅ Set up Resend account
   - Sign up at resend.com
   - Verify email domain (or use onboarding@resend.dev for testing)
   - Get API key → add to `.env.local`

2. ✅ Create email utility
   ```typescript
   // lib/email.ts
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function sendEmail({
     to,
     subject,
     html,
   }: {
     to: string;
     subject: string;
     html: string;
   }) {
     return await resend.emails.send({
       from: 'Portfolio <onboarding@resend.dev>',
       to,
       subject,
       html,
     });
   }
   ```

3. ✅ Build `/api/contact` route (see API Endpoints section)

4. ✅ Create ContactForm component
   ```typescript
   // components/contact/ContactForm.tsx
   'use client';

   import { useState } from 'react';
   import { contactFormSchema } from '@/lib/validation';

   export function ContactForm() {
     const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       setStatus('loading');

       const formData = new FormData(e.currentTarget);
       const data = Object.fromEntries(formData);

       try {
         const validated = contactFormSchema.parse(data);

         const response = await fetch('/api/contact', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(validated),
         });

         if (response.ok) {
           setStatus('success');
         } else {
           setStatus('error');
         }
       } catch {
         setStatus('error');
       }
     };

     return (
       <form onSubmit={handleSubmit}>
         {/* Form fields */}
       </form>
     );
   }
   ```

5. ✅ Set up Vercel Analytics
   ```bash
   npm install @vercel/analytics
   ```

   ```typescript
   // app/layout.tsx
   import { Analytics } from '@vercel/analytics/react';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

6. ✅ Add custom event tracking
   - Project card clicks
   - Resume downloads
   - Contact form submissions

**Deliverables:**
- ✅ Working contact form
- ✅ Email delivery confirmed
- ✅ Analytics tracking on all pages
- ✅ Custom events logged

---

### Phase 4: UI Components (Week 4)

**Goals:** Complete all page components with styling

**Tasks:**
1. ✅ Build Home page components
   - Hero with headline + CTAs
   - CredibilityStrip with company logos
   - FeaturedProjects cards
   - LatestNote preview

2. ✅ Build Projects page components
   - ProjectCard with hover effects
   - Filters (tags, domain, sort)
   - Search input (client-side with Fuse.js)
   - Project detail page with TL;DR, metrics, etc.

3. ✅ Build Blog components
   - BlogCard
   - Tag filters
   - Blog post layout with table of contents
   - Related posts

4. ✅ Build Experience page
   - Timeline component
   - RoleCard with bullets and tech

5. ✅ Build About page
   - Bio section
   - Skills/Toolbox grid
   - Photo

6. ✅ Build shared components
   - Header/Navigation (sticky with blur effect)
   - Footer with social links
   - Button variants (primary, secondary, ghost)
   - Card with elevation
   - Toast notifications

**Deliverables:**
- ✅ All pages fully styled
- ✅ Responsive on mobile/tablet/desktop
- ✅ Smooth animations and transitions
- ✅ Dark mode support (optional)

---

### Phase 5: SEO & Optimization (Week 5)

**Goals:** Search engine optimization, performance tuning

**Tasks:**
1. ✅ Add metadata to all pages
   ```typescript
   // app/projects/[slug]/page.tsx
   export async function generateMetadata({ params }) {
     const project = await getProject(params.slug);

     return {
       title: `${project.title} | Your Name`,
       description: project.description,
       openGraph: {
         title: project.title,
         description: project.description,
         images: [project.coverImage],
         type: 'article',
       },
       twitter: {
         card: 'summary_large_image',
         title: project.title,
         description: project.description,
         images: [project.coverImage],
       },
     };
   }
   ```

2. ✅ Generate sitemap
   ```typescript
   // app/sitemap.ts
   import { getBlogPosts, getProjects } from '@/lib/mdx';

   export default async function sitemap() {
     const posts = await getBlogPosts();
     const projects = await getProjects();

     const postUrls = posts.map((post) => ({
       url: `https://yoursite.com/blog/${post.slug}`,
       lastModified: post.updatedAt || post.publishedAt,
     }));

     const projectUrls = projects.map((project) => ({
       url: `https://yoursite.com/projects/${project.slug}`,
       lastModified: project.updatedAt || project.publishedAt,
     }));

     return [
       { url: 'https://yoursite.com', lastModified: new Date() },
       ...postUrls,
       ...projectUrls,
     ];
   }
   ```

3. ✅ Generate robots.txt
   ```typescript
   // app/robots.ts
   export default function robots() {
     return {
       rules: {
         userAgent: '*',
         allow: '/',
       },
       sitemap: 'https://yoursite.com/sitemap.xml',
     };
   }
   ```

4. ✅ Add JSON-LD structured data
   ```typescript
   // app/projects/[slug]/page.tsx
   const jsonLd = {
     '@context': 'https://schema.org',
     '@type': 'Article',
     headline: project.title,
     description: project.description,
     image: project.coverImage,
     datePublished: project.publishedAt,
     author: {
       '@type': 'Person',
       name: 'Your Name',
     },
   };

   return (
     <>
       <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
       />
       {/* Page content */}
     </>
   );
   ```

5. ✅ Optimize images
   - Convert to WebP/AVIF
   - Add blur placeholders
   - Ensure proper sizing

6. ✅ Run Lighthouse audit
   - Target: 90+ on all metrics
   - Fix any issues

7. ✅ Test performance
   - Bundle size analysis
   - Unused code elimination
   - Critical CSS inlining

**Deliverables:**
- ✅ Lighthouse score 90+ on all pages
- ✅ Sitemap and robots.txt generated
- ✅ Social media previews working
- ✅ Structured data validated

---

### Phase 6: Deployment & Launch (Week 6)

**Goals:** Production deployment, monitoring, final checks

**Tasks:**
1. ✅ Set up Vercel account
   - Sign up at vercel.com
   - Connect GitHub repository

2. ✅ Configure environment variables on Vercel
   - Add all vars from `.env.local`
   - Resend API key
   - Contact email
   - Upstash Redis (if using)

3. ✅ Deploy to production
   ```bash
   git push origin main
   # Auto-deploys to Vercel
   ```

4. ✅ Set up custom domain
   - Add domain in Vercel dashboard
   - Update DNS records (A/CNAME)
   - Wait for SSL certificate (automatic)

5. ✅ Test production site
   - All pages load correctly
   - Contact form sends emails
   - Analytics tracking works
   - Images optimized
   - No console errors

6. ✅ Set up monitoring (optional)
   - Sentry for error tracking (free tier)
   - Vercel analytics dashboard

7. ✅ Create README with setup instructions

8. ✅ Final checks
   - Cross-browser testing (Chrome, Firefox, Safari)
   - Mobile responsiveness
   - Accessibility audit (axe DevTools)
   - Link checker

**Deliverables:**
- ✅ Live site on custom domain
- ✅ All features working in production
- ✅ Analytics dashboard accessible
- ✅ Documentation complete

---

## Deployment Strategy

### Vercel Deployment (Recommended)

**Why Vercel:**
- Built by Next.js creators (best integration)
- Automatic deployments on git push
- Global CDN with edge functions
- Zero-config SSL
- Preview deployments for pull requests
- Generous free tier

---

### Setup Steps

#### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

#### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js
5. Add environment variables:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
   - (Optional) `UPSTASH_REDIS_REST_URL`
   - (Optional) `UPSTASH_REDIS_REST_TOKEN`
6. Click "Deploy"

#### 3. Configure Domain
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain (e.g., `yourname.com`)
3. Add DNS records (provided by Vercel):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait 24-48 hours for DNS propagation
5. SSL certificate auto-generated

---

### Continuous Deployment

**Automatic deployments:**
- Push to `main` → production deployment
- Push to any branch → preview deployment
- Pull requests → unique preview URL

**Deployment workflow:**
```bash
# Make changes
git checkout -b feature/new-blog-post

# Create new content
echo "---
title: My New Post
---" > content/blog/new-post.mdx

# Commit and push
git add .
git commit -m "Add new blog post"
git push origin feature/new-blog-post

# Vercel creates preview: https://portfolio-abc123.vercel.app

# Merge to main
git checkout main
git merge feature/new-blog-post
git push origin main

# Auto-deploys to production: https://yourname.com
```

---

### Build Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optimized for serverless
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com', // If using Cloudinary
      },
    ],
  },

  // Redirects (optional)
  async redirects() {
    return [
      {
        source: '/resume',
        destination: '/api/download-resume',
        permanent: false,
      },
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

### Environment Variables

**Development (`.env.local`):**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_EMAIL=your-email@example.com
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production (Vercel Dashboard):**
- Add same variables in Project Settings → Environment Variables
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Other variables only available server-side

---

### Monitoring Production

**Vercel Dashboard:**
- Real-time logs: Deployments → Deployment → Logs
- Analytics: Analytics tab
- Performance metrics: Built-in Web Vitals

**Email notifications:**
- Deployment status (success/failure)
- Performance degradation alerts
- Error rate spikes

---

## Cost Breakdown

### Free Tier Limits

| Service | Free Tier | Overage Cost | Notes |
|---------|-----------|--------------|-------|
| **Vercel** | Unlimited hobby projects | N/A | Fair use policy |
| | 100GB bandwidth/month | $40/TB | Enough for 10K+ visitors |
| | 100 hours serverless execution | $0.60/hour | ~3K contact forms |
| **Resend** | 100 emails/month | $20/mo for 50K | Contact form only |
| | 1 verified domain | Included | Use your domain |
| **Vercel Analytics** | 2,500 events/month | $10/mo for 100K | Page views + custom |
| **Upstash Redis** | 10K requests/day | $0.20/100K | Rate limiting |
| | 256MB storage | Included | More than enough |
| **Domain** | N/A | $10-15/year | One-time annual |

---

### Cost Scenarios

**Scenario 1: Personal Portfolio (Expected)**
- 1,000 visitors/month
- 50 contact forms/month
- 5,000 page views/month

**Monthly Cost: $0**
- Vercel: Free (well under limits)
- Resend: Free (50 emails)
- Analytics: Free (5K events)
- Upstash: Free (rate limiting)

**Total: $0/month + $12/year domain = $1/month**

---

**Scenario 2: Popular Portfolio**
- 10,000 visitors/month
- 200 contact forms/month
- 50,000 page views/month

**Monthly Cost: ~$20**
- Vercel: Free (still under 100GB bandwidth)
- Resend: $20/mo (200 emails exceeds free tier)
- Analytics: Free (upgrade for advanced features)
- Upstash: Free

**Total: $20/month + domain**

---

**Scenario 3: Viral Post**
- 100,000 visitors/month (temporary spike)
- 500 contact forms
- 500,000 page views

**Monthly Cost: ~$60-80**
- Vercel: $40 (bandwidth overage)
- Resend: $20 (emails)
- Analytics: Free (or $10 for Pro)

**Note:** Vercel won't charge without warning - you'll get alerts

---

### Cost Optimization Tips

1. **Optimize images** → Reduce bandwidth usage
2. **Static generation** → Reduce serverless execution time
3. **Client-side search** → No search API costs
4. **Git-based content** → No database/CMS costs
5. **Cloudflare proxy** (optional) → Can reduce bandwidth (free tier)

---

## Future Enhancements

### Phase 7+ (Optional)

**Medium Priority:**
1. **Blog Comments** (via Giscus - free GitHub Discussions)
   - Cost: $0
   - Effort: 2-3 hours
   - Benefit: Engagement, SEO

2. **Newsletter Signup** (via Buttondown or ConvertKit)
   - Cost: $0-9/mo
   - Effort: 4-6 hours
   - Benefit: Audience building

3. **Search Optimization** (Algolia or Pagefind)
   - Cost: $0 (Pagefind) or $1/mo (Algolia)
   - Effort: 6-8 hours
   - Benefit: Better UX for large content

4. **Content Scheduling** (publish future posts automatically)
   - Cost: $0
   - Effort: 3-4 hours
   - Benefit: Content planning

**Low Priority:**
5. **Admin Dashboard** (Sanity CMS integration)
   - Cost: $0-19/mo
   - Effort: 16-24 hours
   - Benefit: Non-technical editing

6. **Advanced Analytics** (PostHog or Mixpanel)
   - Cost: $0-20/mo
   - Effort: 8-12 hours
   - Benefit: User behavior insights

7. **A/B Testing** (Vercel Edge Config)
   - Cost: $0
   - Effort: 6-8 hours
   - Benefit: Conversion optimization

8. **RSS Feed** (built-in Next.js)
   - Cost: $0
   - Effort: 2 hours
   - Benefit: Feed readers

---

## Appendix

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript

# Content
npm run new:post         # Scaffold new blog post (custom script)
npm run new:project      # Scaffold new project (custom script)

# Deployment
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
vercel env pull          # Pull env vars from Vercel

# Analysis
ANALYZE=true npm run build  # Bundle size analysis
```

---

### Key Files Reference

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, SEO, analytics |
| `lib/mdx.ts` | MDX processing utilities |
| `lib/email.ts` | Email sending via Resend |
| `app/api/contact/route.ts` | Contact form API |
| `components/mdx/MDXComponents.tsx` | Custom MDX components |
| `content/` | All content (MDX + JSON) |
| `.env.local` | Environment variables (gitignored) |
| `next.config.js` | Next.js configuration |

---

### Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- MDX: https://mdxjs.com
- Vercel: https://vercel.com/docs
- Resend: https://resend.com/docs
- Tailwind: https://tailwindcss.com/docs

**Tools:**
- Lighthouse: https://pagespeed.web.dev
- Open Graph Preview: https://www.opengraph.xyz
- Structured Data Test: https://search.google.com/test/rich-results

---

## Summary

This implementation plan provides a complete, production-ready backend for your personal portfolio website with:

✅ **$0-5/month** hosting (Vercel + Resend free tiers)
✅ **Git-based content** (no database needed)
✅ **Type-safe** (TypeScript throughout)
✅ **Fast** (static generation + edge CDN)
✅ **Secure** (rate limiting, validation, spam protection)
✅ **Analytics** (Vercel Analytics + custom events)
✅ **Contact form** (email delivery via Resend)
✅ **SEO optimized** (metadata, sitemap, structured data)
✅ **Maintainable** (MDX for content, clean architecture)

**Next Steps:**
1. Review this plan and ask any questions
2. Start Phase 1: Initialize Next.js project
3. Follow phases 1-6 sequentially
4. Deploy to production
5. Monitor analytics and iterate

**Estimated Timeline:** 6 weeks part-time (10-15 hours/week)

---

*Plan created: October 27, 2025*
*Last updated: October 27, 2025*
