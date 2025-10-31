// Projects page

import { getProjects } from '@/lib/mdx';
import { ProjectsClient } from '@/components/pages/ProjectsClient';

export const metadata = {
  title: 'Projects',
  description: 'Browse my portfolio of web development projects and case studies.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4">Projects</h1>
          <p className="text-body-large text-foreground/80 max-w-3xl">
            A collection of high-impact projects with measurable outcomes. Each showcases
            technical depth, problem-solving, and business value delivered.
          </p>
        </div>

        {/* Client-side filtering and search */}
        <ProjectsClient projects={projects} />
      </div>
    </div>
  );
}
