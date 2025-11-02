Build this following engineering best practices:
- Write all code to WCAG AA accessibility standards
- Create and use reusable components throughout
- Use semantic HTML and proper component architecture
- Avoid absolute positioning; use flexbox/grid layouts
- Build actual code components, not image SVGs
- Keep code clean, maintainable, and well-structured

I need you to build a complete application. Here's everything:
**PROJECT OVERVIEW:**
[# Goal & Audience

* **Primary goal:** Quickly convey your strengths, credibility, and impact so a recruiter/hiring manager wants to interview you.
* **Secondary goals:** Showcase code quality, problem-solving, writing/communication, and product sense; enable easy contact; be memorable.
* **Primary audience:** Tech recruiters (skim fast), hiring managers (evaluate depth), engineers (assess code), founders (assess versatility).

---

# Information Architecture (IA)

**Top‑level navigation:** Home • Projects • Experience • Blog/Notes • Open Source • About • Contact

* Optional: Talks • Writing • Playground • Resume (PDF) • Now

**Sitemap:**

* Home (hero, highlights, 2–3 flagship projects, credibility bar, latest note, CTA)
* Projects (filterable gallery, tags by tech/domain; case-study pages)
* Experience (timeline with impact bullets + logos)
* Blog/Notes (short notes + long-form posts; search)
* Open Source (repos, contributions, maintainership)
* About (bio, values, toolkit, hobbies, photo)
* Contact (email, calendar link, socials)

---

# Above‑the‑Fold Strategy (Home)

* **Headline:** Role + niche + value (e.g., “Software Engineer building fast, accessible web apps.”)
* **Subheadline:** Proof points: years, domains, stack, outcomes (metrics).
* **Primary CTA:** “View my work” → Projects. Secondary: “Download resume.”
* **Credibility strip:** Company logos, awards, certs, OSS highlights, press.
* **Quick highlights:** 3 cards (Flagship project, OSS impact, writing/thought leadership).

**Wireframe (mental):**

```
[Nav] [Logo] [Projects] [Experience] [Blog] [About] [Contact]
[Hero left: headline + subheadline + CTAs]
[Hero right: interactive graphic/screenshot carousel]
[Credibility bar]
[Featured projects (3 cards)]
[Latest note]
[Footer with social + contact]
```

---

# Projects Section (Most Important)

**Gallery view:**

* Card content: Title • one‑line impact • tags (tech, role, domain) • metric • thumbnail.
* Controls: Tag filters (tech/domain), sort by date/impact, search input.

**Case study template (detail page):**

1. **TL;DR**: 3–5 bullets with outcomes + metrics.
2. **Context**: Problem, users, constraints, your role (IC/lead), team size.
3. **Approach**: Architecture diagram, key decisions & tradeoffs.
4. **Implementation**: Selected code snippets (hidden by default, expandable), PRs.
5. **Results**: Before/after metrics, performance charts, user feedback.
6. **What I’d improve next**: Reflection and future work.
7. **Tech**: Stack, tools, libraries, infra, testing.
8. **Links**: Live demo, repo, article, slides.

**Metrics to highlight:** p95 latency, load time, revenue impact, DAU/MAU, conversion lift, error rate drop, build time, test coverage.

**Anti‑patterns:** Too many projects, no metrics, walls of text, dead links, confidential IP.

---

# Experience Section

* Reverse chronological timeline with company logo, role, dates.
* For each role: 3–5 impact bullets with measurable outcomes; team scope; notable tech.
* Optional: link relevant projects/case studies.

**Bullet pattern:**

* *Action* + *what* + *how* + *impact metric*.
  Example: “Redesigned caching layer using Redis cluster, cutting p95 API latency from 900ms → 180ms (−80%).”

---

# Blog/Notes

* Mix of quick notes (TILs, snippets) and essays (architecture, debugging stories, tradeoffs).
* Search, tags, pagination; RSS.
* **Goal:** Demonstrate clarity of thought and the ability to communicate.

---

# Open Source

* Highlight repos you maintain or contribute to; pin issues/PRs that show depth.
* Badges: Stars, downloads, contributors; CODEOWNERS, CI, coverage.
* Short write‑ups on “why” and “impact.”

---

# About

* Photo (professional but friendly), short narrative, principles/values, interests.
* “Toolbox”: languages, frameworks, platforms, testing, DevOps.
* Fun bit: hobby or quirky fact (humanizes you).

---

# Contact

* Email (copy‑to‑clipboard), Calendly link (optional), LinkedIn, GitHub, X.
* Short reassurance: “I reply within 48 hours.”

---

# UI/UX Design System

**Visual style:**

* Clean, modern, minimal. Plenty of whitespace. Rounded corners (8–16px radius). Soft shadows.
* **Color:** Neutral base + one accent (e.g., slate/stone + electric blue). Provide dark mode.
* **Typography:**

  * Headings: geometric sans (e.g., Inter, Sora).
  * Body: humanist sans (e.g., Inter) or system font stack.
  * Code: monospace (e.g., JetBrains Mono).
* **Spacing scale:** 4/8/12/16/24/32/48/64.
* **Grid:** 12‑column responsive; 1200px max content width.
* **Components:**

  * Nav bar: sticky; active state; keyboard‑navigable.
  * Cards: hover elevation; micro‑interaction on focus.
  * Tags/Chips: filterable with clear affordance.
  * Buttons: primary/secondary/tertiary; loading states.
  * Modals/Lightbox for images and code snippets.
  * Tabs/Accordion for case study sections.
  * Toasts for copy actions.

**Accessibility (WCAG 2.2 AA):**

* Color contrast ≥ 4.5:1; focus outlines; skip‑to‑content; semantic HTML; aria‑labels.
* Keyboard nav: Tab order, Esc to close modals, space/enter activation.
* Motion: Respect `prefers-reduced-motion`.

**Performance:**

* Lighthouse targets: 90+ across the board.
* Image optimization: next-gen formats, responsive `srcset`, lazy‑loading.
* JS budget: <150KB shipped on Home; defer non‑critical.
* Fonts: `display=swap`, preconnect, variable fonts; consider system stack.
* Caching/CDN: HTTP caching, immutable assets.

**SEO & Social:**

* Proper `<title>`, meta description, Open Graph/Twitter cards, canonical URLs, sitemap.xml, robots.txt.
* Structured data: Person, Article, Project (JSON‑LD) where relevant.

**Analytics & Feedback:**

* Privacy‑friendly analytics (e.g., Plausible). Track: project card clicks, resume downloads, contact clicks.
* Contact form → email + optional Slack/Discord webhook.

**Internationalization (optional):**

* If relevant, localized routes; `hreflang`; translation toggles.

---

# Recruiter‑First Details (High Leverage)

* **Skim mode:** TL;DR on every project and role.
* **Impact chips:** Visual tags like “−80% latency” or “+$1.2M ARR.”
* **Downloadable resume:** Updated PDF with matching design tokens.
* **Printable page styles:** CSS for clean printed case studies.
* **One‑click contact:** Prominent email; no captchas; auto‑copy button.
* **“Shortlist me” CTA:** Brief form (name, email, company) → sends you an email.

---

# Content Prompts (to help you write)

* **Hero:** “I’m a [role] who [solves X] for [users/domain] using [skills], delivering [outcome].”
* **Project TL;DR bullets:** “In [timeframe], I built [thing] that [solved problem], resulting in [metric]. My role: [IC/lead].”
* **Reflection:** “If I had 2 more weeks, I’d…”

---

# Tech Stack Recommendations

* **Framework:** Next.js, Astro, or Remix.
* **UI:** Tailwind CSS + Headless UI/shadcn/ui. Icon: Lucide.
* **Content:** MDX for case studies and notes.
* **Images:** Next/Image or Astro assets.
* **Deployment:** Vercel or Netlify; custom domain.
* **CI/CD:** GitHub Actions with lint/test/build.
* **Contact:** Serverless function + email provider (e.g., Resend) or Formspree.
* **Search:** Client‑side fuse.js or Algolia (if content heavy).

---

# Component Inventory (Build Checklist)

* Layout: Header, Footer, Grid, SEO component, Analytics wrapper.
* Home: Hero, CredibilityStrip, FeaturedProjects, LatestNote, CTASection.
* Projects: Filters, ProjectCard, SortControl, SearchInput, Pagination.
* Case Study: TLDR, RoleBox, MetricsStrip, Gallery, CodeTabs, Diagram, Reflection.
* Experience: Timeline, RoleCard.
* Blog: PostList, TagPills, Search, RSSLink.
* Open Source: RepoCard, ContributionList.
* About: Bio, Toolbox grid, Photo.
* Contact: EmailForm, CalendlyEmbed, SocialLinks.

---

# Microinteractions & Motion

* Subtle hover lifts on cards; springy button presses.
* Page transitions: fade/slide in; preserve scroll; disable on `prefers-reduced-motion`.
* “Copy email” → toast confirmation.

---

# Trust & Safety

* No dark patterns. Respect privacy. Minimal cookies.
* Clear licensing for code snippets; blur/redact confidential data.

---

# Launch Checklist

* 404 page; error boundaries.
* Favicons & PWA manifest (optional offline shell).
* Lighthouse/axe passes; link checker run.
* Custom domain + HTTPS; DNS records verified.
* Open Graph previews look great (validate on major links).

---

# Measurement & Iteration

* Define success: recruiter replies, interview invites, contact clicks.
* Run A/B on hero copy or project ordering.
* Review analytics monthly; prune old projects; keep “latest” fresh.

---

# Next Steps (Pick One Today)

1. Draft your hero headline + TL;DRs for 2 flagship projects.
2. Sketch the Projects gallery with tags you’ll support.
3. Choose stack (Next.js + Tailwind + MDX + Vercel) and scaffold repo.
4. Import resume bullets into Experience page and convert to impact metrics.
]


**ALL PAGES & DETAILED SPECIFICATIONS:**
[# 1) App Type & Purpose

**Type:** Personal portfolio web app (SWE-focused), optimized for recruiters and hiring managers.

**Purpose:** Quickly communicate your engineering strengths and impact, showcase high‑quality case studies with measurable outcomes, and provide a frictionless path for contact or interview requests.

**Primary problems solved:**

* Recruiters need to assess fit in seconds → clear, skimmable highlights and metrics.
* Hiring managers need depth → well-structured case studies with architecture and tradeoffs.
* You need a professional single source of truth → organized content, great performance, and SEO.

---

# 2) Core Features (5–7)

1. **Filterable Projects Gallery:** Cards with impact one‑liners, tech/domain tags, sorting, and quick previews.
2. **Case Study Pages:** TL;DR with metrics, context, architecture/diagrams, selected code snippets, results, and “what I’d improve.”
3. **Search & Tagging:** Site‑wide search over projects and notes; tag chips for tech, domain, and role.
4. **Contact & Resume Access:** Prominent email/contact form (with success toasts) and downloadable, style-matched PDF resume.
5. **Performance & Accessibility:** Lighthouse‑optimized images (lazy/responsive), JS budget, keyboard navigation, WCAG 2.2 AA.
6. **SEO & Social Sharing:** Structured data (JSON‑LD), Open Graph/Twitter cards, sitemap/robots; crisp link previews.
7. **Analytics & Feedback Loop:** Privacy-friendly analytics tracking project/detail clicks, resume downloads, and contact submissions.

---

# 3) User Flow (Main Journey)

1. **Landing (Home):** Visitor sees a concise hero (role + value), credibility logos, and 2–3 featured projects with clear CTAs.
2. **Explore Projects:** Uses filters/tags or search to find relevant work; opens a flagship project.
3. **Deep‑Dive Case Study:** Skims TL;DR with outcomes → expands architecture/code sections → reviews results and reflections.
4. **Validate Experience:** Jumps to Experience timeline for role scope, tech stack, and measurable impact bullets.
5. **Signal Thought Process:** Optionally opens a Blog/Notes post to gauge communication and product/architecture thinking.
6. **Convert:** Clicks **Contact** (form or direct email) and optionally downloads the resume; analytics log the conversion.
7. **Follow‑up (Optional):** Visitor shares a project link; rich social cards preview key metrics and visuals.

---

# 4) Page / Screen Structure

* **Home:** Hero with headline + proof points, credibility strip, featured projects, latest note, and primary CTA to Projects.
* **Projects (List):** Filterable, searchable grid of project cards; supports sort (recency/impact) and tag chips (tech/domain/role).
* **Project Detail (Case Study):** TL;DR metrics, context/role, architecture diagram, code tabs/snippets, results/metrics, reflections, links (demo/repo).
* **Experience:** Reverse‑chronological timeline with company logos, role, dates, and 3–5 quantified impact bullets per role.
* **Blog/Notes:** Mixed short notes and essays with tags and search; RSS link.
* **Post Detail:** Clean reading layout with code syntax highlighting and social share metadata.
* **Open Source:** Highlighted repos and contributions with concise impact summaries and badges (stars/downloads/CI status).
* **About:** Short narrative, values, skills/toolbox grid, and a friendly photo; links to socials.
* **Contact:** Email address with copy‑to‑clipboard, simple form (spam‑protected, no captchas if possible), optional calendar link.
* **Resume (PDF):** Hosted downloadable PDF styled to match site tokens.
* **404 / Error:** Helpful copy, links to Home and Projects.

---

# Notes on Implementation (Quick Reference)

* **Stack:** Next.js or Astro + Tailwind; MDX for projects/notes; deploy on Vercel/Netlify.
* **Components:** Hero, CredibilityStrip, ProjectCard, Filters, TLDR, MetricsStrip, CodeTabs, Timeline, TagPills, EmailForm.
* **Quality Bars:** Lighthouse ≥90, Core Web Vitals good, no console errors, robust dark mode, keyboard-friendly navigation.
]


**DESIGN SYSTEM:**
[# SWE Portfolio — Design Guide

A cohesive, accessible design system optimized for a modern SWE personal website. All choices meet or aim to meet WCAG 2.2 AA contrast.

---

## 1) Color Palette

> Use the same tokens in light and dark modes; swap background/foreground neutrals accordingly.

### Brand

* **Primary**: `#2563EB` (Blue 600)

  * Hover: `#1D4ED8` • Pressed: `#1E40AF` • On-primary text: `#FFFFFF`
* **Secondary**: `#14B8A6` (Teal 500)

  * Hover: `#0D9488` • Pressed: `#0F766E` • On-secondary text: `#FFFFFF`
* **Accent**: `#F59E0B` (Amber 500)

  * Hover: `#D97706` • Pressed: `#B45309` • On-accent text: `#111827`

### Neutrals (Light Mode)

* **BG/Base**: `#F8FAFC` (Slate 50)
* **Surface** (cards/modals): `#FFFFFF`
* **Border**: `#E2E8F0` (Slate 200)
* **Text/Primary**: `#0F172A` (Slate 900)
* **Text/Secondary**: `#334155` (Slate 700)
* **Text/Disabled**: `#94A3B8` (Slate 400)

### Neutrals (Dark Mode)

* **BG/Base**: `#0B1220` (near Slate 950)
* **Surface**: `#0F172A` (Slate 900)
* **Border**: `#1F2937` (Gray 800)
* **Text/Primary**: `#E5E7EB` (Gray 200)
* **Text/Secondary**: `#94A3B8` (Slate 400)
* **Text/Disabled**: `#475569` (Slate 600)

### Status

* **Success**: `#22C55E` (Green 500)

  * Background subtle: `#ECFDF5` • Border: `#86EFAC` • Text: `#166534`
* **Error**: `#EF4444` (Red 500)

  * Background subtle: `#FEF2F2` • Border: `#FCA5A5` • Text: `#7F1D1D`
* **Warning**: `#F59E0B` (Amber 500)

  * Background subtle: `#FFFBEB` • Border: `#FDE68A` • Text: `#78350F`
* **Info**: `#3B82F6` (Blue 500)

  * Background subtle: `#EFF6FF` • Border: `#93C5FD` • Text: `#1E3A8A`

---

## 2) Typography

**Font Families**

* **Heading**: *Sora*, fallback `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial`
* **Body**: *Inter*, same fallbacks as above
* **Monospace (code)**: *JetBrains Mono*, fallback `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

**Font Sizes & Line Heights**

* **h1**: 40px / 48px (2.5rem / 3rem) • weight 700
* **h2**: 32px / 40px (2rem / 2.5rem) • weight 700
* **h3**: 24px / 32px (1.5rem / 2rem) • weight 600
* **h4**: 20px / 28px (1.25rem / 1.75rem) • weight 600
* **Body/Large**: 18px / 28px (1.125rem / 1.75rem) • weight 400/500
* **Body/Default**: 16px / 24px (1rem / 1.5rem) • weight 400
* **Small**: 14px / 20px (0.875rem / 1.25rem) • weight 400/500
* **Caption/Meta**: 12px / 16px (0.75rem / 1rem) • weight 400
* **Code**: 14–16px / 20–24px depending on context • weight 400/500

**Additional Type Rules**

* Paragraph spacing: 0.75 × font size.
* Max text line length: 60–75ch for readability.
* Heading hierarchy strictly sequential (no skipping levels for style).

---

## 3) Spacing System

**Base unit:** 4px. Use multiples for consistent rhythm.

| Token | px |
| ----- | -- |
| `0`   | 0  |
| `xxs` | 2  |
| `xs`  | 4  |
| `sm`  | 8  |
| `md`  | 12 |
| `lg`  | 16 |
| `xl`  | 24 |
| `2xl` | 32 |
| `3xl` | 40 |
| `4xl` | 48 |
| `5xl` | 64 |
| `6xl` | 80 |

Guidelines: Section vertical padding = `5xl` (desktop), `3xl` (mobile). Card internal padding = `xl`.

---

## 4) Component Styles

### Buttons

* **Primary (filled)**

  * BG: Primary `#2563EB` → hover `#1D4ED8` → pressed `#1E40AF`
  * Text: `#FFFFFF`
  * Border: none; Focus ring: 2px `#93C5FD` (outside) with 2px offset
* **Secondary (outline)**

  * BG: transparent • Border: 1.5px `#CBD5E1` (light) / `#334155` (dark)
  * Text: Primary text color; Hover: subtle surface `rgba(37,99,235,0.05)` (light) / `rgba(148,163,184,0.1)` (dark)
* **Ghost (tertiary)**

  * BG: transparent; Text: Primary; Hover: `rgba(15,23,42,0.05)` (light) / `rgba(148,163,184,0.1)` (dark)
* **Destructive**

  * BG: Error `#EF4444` → hover `#DC2626`; Text: `#FFFFFF`

**Sizes**

* Small: 28–32px height • 10–12px x‑padding • 14px text
* Medium: 40px height • 16px x‑padding • 16px text
* Large: 48px height • 20px x‑padding • 18px text

**Shape**

* Radius: 9999px for pill by default; square option uses `md` radius.

**States**

* Disabled: reduce opacity to 0.5; disable pointer; keep contrast for legibility.

### Inputs (text, email, textarea, selects)

* Height: 44px (single‑line); Padding: 12px x 14px; Text: 16px
* BG: Surface; Text: Primary; Placeholder: Secondary at 0.7 opacity
* Border: 1px `#CBD5E1` (light) / `#334155` (dark); Radius: `lg` (8px)
* Focus: 1px border `#2563EB` + 2px outer ring `#93C5FD`; Shadow: none
* Error: Border `#EF4444`, help text in error color; Success variant uses success color
* Disabled: BG `#F1F5F9` (light) / `#111827` (dark), text `#94A3B8`, no shadow

### Cards

* BG: Surface (`#FFFFFF` light / `#0F172A` dark)
* Border: 1px `#E2E8F0` (light) / `#1F2937` (dark) or none on elevated cards
* Radius: `xl` (12px)
* Padding: `xl` (24px)
* Shadow (elevated): Elevation 2 (see below)
* Header: title (h4), optional subtitle; Footer: action row (buttons/links)

### Border Radius Standards

* **xs**: 4px (chips, tags)
* **sm**: 6px (inputs)
* **md**: 8px (buttons default, small cards)
* **lg**: 12px (cards, modals)
* **xl**: 16px (drawers, large modals)
* **full**: 9999px (pills, avatars)

### Shadows / Elevation

Use neutral, subtle shadows. All `rgba(0,0,0,0.x)` for light; reduce opacity and spread in dark mode.

* **E0 (flat)**: none
* **E1**: 0 1px 2px rgba(0,0,0,0.06)
* **E2**: 0 4px 8px rgba(0,0,0,0.08)
* **E3**: 0 10px 16px rgba(0,0,0,0.10)
* **E4**: 0 16px 24px rgba(0,0,0,0.12)
* **E5**: 0 24px 40px rgba(0,0,0,0.14)

---

## 5) Layout Grid

* **Container Max‑Width**: 1200px (content) / 1440px (full‑bleed hero/media)
* **Grid Columns**: 12 on desktop; 6 on tablet; 4 on mobile
* **Gutters**: 24px desktop, 16px tablet, 12px mobile
* **Section Vertical Rhythm**: 80px (desktop), 56px (tablet), 40px (mobile)
* **Responsive Breakpoints**

  * **xs**: <480px
  * **sm**: ≥480px
  * **md**: ≥768px
  * **lg**: ≥1024px
  * **xl**: ≥1280px
  * **2xl**: ≥1536px

**Layout Patterns**

* **Header**: sticky, 64px height, translucent background with blur on scroll
* **Sidebars**: 280px default; collapse below `lg`
* **Cards Grid**: 3‑col at `lg` (repeat(3, 1fr)), 2‑col at `md`, 1‑col at `sm`

---

## Accessibility & Contrast Notes

* Primary on white (#2563EB on #FFFFFF) contrast ≈ 4.5:1+ at 16px (meets AA); ensure button text is #FFFFFF.
* Maintain a minimum touch target of 44×44px for all interactive elements.
* Provide focus styles that are visible on both light and dark backgrounds.

---

## Implementation Hints (Optional)

* **Tailwind tokens**: map colors to `--color-primary`, `--color-secondary`, etc., and switch at `[data-theme="dark"]`.
* **Iconography**: Lucide for line icons; stroke width 1.5–2.0.
* **Motion**: 150–200ms ease‑out for hovers; 250ms for modals; respect `prefers-reduced-motion`.
]

Build out all pages as separate page components with full functionality, content, and styling according to the design system. Make this a complete, working prototype.
