// TypeScript types for Experience data model

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
