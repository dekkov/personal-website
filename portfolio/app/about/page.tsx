// About page

import { getSkills } from '@/lib/mdx';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'About',
  description: 'Learn more about my background, skills, and interests in software engineering.',
};

export default function AboutPage() {
  const skills = getSkills();

  const skillCategories = [
    { title: 'Languages', items: skills.languages, icon: '💻' },
    { title: 'Frontend', items: skills.frontend, icon: '🎨' },
    { title: 'Backend', items: skills.backend, icon: '⚙️' },
    { title: 'Tools & Platforms', items: skills.tools, icon: '🛠️' },
    { title: 'Practices', items: skills.practices, icon: '📋' },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-6">About Me</h1>

          {/* Bio */}
          <div className="prose prose-lg max-w-none text-foreground/90">
            <p className="text-body-large mb-4">
              I'm a software engineer passionate about building high-performance web applications
              that solve real problems and deliver measurable business value.
            </p>
            <p className="text-body-large mb-4">
              With expertise spanning full-stack development, I specialize in creating scalable
              architectures, optimizing performance, and leading technical initiatives. I believe
              in writing clean, maintainable code and using data-driven approaches to make
              technical decisions.
            </p>
            <p className="text-body-large mb-4">
              When I'm not coding, I enjoy staying up-to-date with the latest web technologies,
              contributing to open-source projects, and sharing knowledge with the developer
              community.
            </p>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((category) => (
              <Card key={category.title} className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Education</h2>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-2">Bachelor of Science in Computer Science</h3>
            <p className="text-foreground/70 mb-2">University Name</p>
            <p className="text-sm text-muted-foreground">Graduated 2020</p>
          </Card>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
              I'm always interested in hearing about new projects and opportunities.
              Whether you have a question or just want to say hi, feel free to reach out!
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
              >
                Get in Touch
              </a>
              <a
                href="/projects"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
              >
                View Projects
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
