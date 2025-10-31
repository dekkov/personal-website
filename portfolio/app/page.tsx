// Home page

import { ArrowRight, Download, Code, Zap, Award, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { getFeaturedProjects, getBlogPosts } from '@/lib/mdx';
import Link from 'next/link';

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();
  const blogPosts = await getBlogPosts();
  const latestPost = blogPosts[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background to-muted/20" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary">
                Available for Full-Time/Internship • Graduating March/December 2026
              </Badge>
              <h1 id="hero-heading" className="mb-4">
                Software Engineer building scalable, high-performance applications
              </h1>
              <p className="text-body-large text-foreground/80 mb-6">
                Computer Science student at Oregon State University (GPA: 3.67).
                Specializing in full-stack development, cloud infrastructure, and system optimization.
                Software Developer at OSU's Center for Applied Systems and Software,
                building ETL pipelines and automated deployment systems.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Button
                  size="lg"
                  className="group"
                  aria-label="View all projects"
                  asChild
                >
                  <Link href="/projects">
                    View My Work
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  aria-label="Download resume as PDF"
                  asChild
                >
                  <a 
                    href="https://drive.google.com/file/d/1d2AZX-UKJI8chY3R0gdXG8TYRZ_0M9Vv/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    View Resume
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 text-foreground/70 text-small">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>3.67 GPA • Honor Roll</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjE0NzM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern software development workspace"
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Strip */}
      <section className="py-12 bg-muted/30 border-y border-border" aria-label="Technologies and skills">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground mb-6 text-small">
            Technologies I work with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['C#', '.NET 8', 'Python', 'TypeScript', 'Next.js', 'React', 'AWS', 'Docker', 'PostgreSQL', 'Redis', 'MongoDB'].map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 md:py-24" aria-labelledby="featured-projects-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="featured-projects-heading" className="mb-2">
                Featured Projects
              </h2>
              <p className="text-foreground/70">
                High-impact work with measurable outcomes
              </p>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:flex"
              aria-label="View all projects"
              asChild
            >
              <Link href="/projects">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              aria-label="View all projects"
              asChild
            >
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Note */}
      {latestPost && (
        <section className="py-16 bg-muted/20" aria-labelledby="latest-note-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="latest-note-heading" className="mb-8 text-center">
              Latest from the Blog
            </h2>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-semibold">{latestPost.title}</h3>
                  <Badge variant={latestPost.category === 'essay' ? 'default' : 'secondary'}>
                    {latestPost.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground text-small">
                  <time dateTime={latestPost.publishedAt}>
                    {new Date(latestPost.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                  <span>•</span>
                  <span>{latestPost.readingTime} min read</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-4">{latestPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {latestPost.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Read article: ${latestPost.title}`}
                    asChild
                  >
                    <Link href={`/blog/${latestPost.slug}`}>
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="text-center mt-8">
              <Button
                variant="outline"
                aria-label="View all blog posts"
                asChild
              >
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="mb-4">
            Let's Work Together
          </h2>
          <p className="text-body-large text-foreground/80 mb-8">
            I'm actively seeking full-time opportunities starting March 2026.
            Always interested in challenging projects and connecting with fellow engineers.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              aria-label="Get in touch"
              asChild
            >
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              aria-label="View work experience"
              asChild
            >
              <Link href="/experience">View Experience</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
