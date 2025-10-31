// Experience page

import { getExperience } from '@/lib/mdx';
import { Timeline } from '@/components/shared/Timeline';
import { Experience } from '@/types/experience';

export const metadata = {
  title: 'Experience',
  description: 'My professional work experience and career journey.',
};

export default function ExperiencePage() {
  const experiences: Experience[] = getExperience();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4">Professional Experience</h1>
          <p className="text-body-large text-foreground/80 max-w-3xl">
            A track record of delivering high-impact solutions and leading technical initiatives.
            Each role showcases quantifiable results and continuous growth in software engineering.
          </p>
        </div>

        {/* Timeline */}
        <Timeline experiences={experiences} />
      </div>
    </div>
  );
}
