'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Experience } from '@/types/experience';
import Link from 'next/link';

interface TimelineProps {
  experiences: Experience[];
}

export function Timeline({ experiences }: TimelineProps) {
  const formatDate = (date: string | null) => {
    if (!date) return 'Present';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();

    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:left-8" />

      <div className="space-y-12">
        {experiences.map((experience, index) => (
          <div key={experience.id} className="relative pl-8 md:pl-20">
            {/* Timeline dot */}
            <div className="absolute left-[-4px] md:left-[28px] top-1 w-2 h-2 rounded-full bg-primary ring-4 ring-background" />

            <Card className="p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    {/* Company logo would go here if available */}
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{experience.role}</h3>
                      <div className="flex items-center gap-2">
                        {experience.companyUrl ? (
                          <a
                            href={experience.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {experience.company}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="font-medium">{experience.company}</span>
                        )}
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{experience.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground shrink-0">
                  <div>{formatDate(experience.startDate)} - {formatDate(experience.endDate)}</div>
                  <div className="text-xs mt-0.5">{calculateDuration(experience.startDate, experience.endDate)}</div>
                </div>
              </div>

              {/* Accomplishments */}
              <ul className="space-y-2 mb-4">
                {experience.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex gap-2 text-foreground/90">
                    <span className="text-primary mt-1.5 shrink-0">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Related projects */}
              {experience.projects.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Related Projects:</p>
                  <div className="flex gap-2">
                    {experience.projects.map((projectSlug) => (
                      <Link
                        key={projectSlug}
                        href={`/projects/${projectSlug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Project →
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
