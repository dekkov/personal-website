// TypeScript types for Blog Post data model

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
