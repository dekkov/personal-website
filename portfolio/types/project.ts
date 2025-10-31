// TypeScript types for Project data model

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
