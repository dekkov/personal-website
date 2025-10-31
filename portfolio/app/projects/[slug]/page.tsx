// Project detail page

import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { BackButton } from '@/components/BackButton';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      publishedTime: project.publishedAt,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen container mx-auto px-4 py-16 max-w-4xl">
      <BackButton fallbackUrl="/projects" label="Back to Projects" />

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div>
            <strong>Role:</strong> {project.role}
          </div>
          <div>
            <strong>Duration:</strong> {project.duration}
          </div>
          <div>
            <strong>Team Size:</strong> {project.teamSize}
          </div>
        </div>
      </header>

      {/* TL;DR Section */}
      {project.tldr && project.tldr.length > 0 && (
        <section className="mb-12 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">TL;DR</h2>
          <ul className="space-y-2">
            {project.tldr.map((point: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Impact Metrics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {project.metrics.map((metric: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-2">{metric.label}</div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-2xl font-bold text-blue-600">
                    {metric.improvement}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.before} → {metric.after}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MDX Content */}
      <section className="mdx-content mb-12">
        <MDXRemote source={project.content} />
      </section>

      {/* Links */}
      {(project.liveUrl || project.repoUrl) && (
        <section className="flex gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Live Project
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Code
            </a>
          )}
        </section>
      )}
    </article>
  );
}
