import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.featured && (
            <Badge variant="secondary" className="shrink-0">
              Featured
            </Badge>
          )}
        </div>
        <p className="text-foreground/70 text-small">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-success text-small">
              {project.metrics[0].improvement} {project.metrics[0].label}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-muted-foreground text-small">
          {project.role}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="group/btn"
          asChild
          aria-label={`View details for ${project.title}`}
        >
          <Link href={`/projects/${project.slug}`}>
            View Details
            <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
