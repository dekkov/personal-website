// 404 Not Found page

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <Card className="p-8 md:p-12 text-center">
          {/* 404 Visual */}
          <div className="mb-6">
            <h1 className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">404</h1>
            <div className="text-4xl mb-2">Page Not Found</div>
            <p className="text-foreground/70 text-lg">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4 mt-8">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">
                  <Search className="mr-2 h-4 w-4" />
                  View Projects
                </Link>
              </Button>
            </div>

            <Button asChild variant="ghost" size="sm">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Here are some helpful links instead:
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link href="/about" className="text-primary hover:underline">
                About
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/experience" className="text-primary hover:underline">
                Experience
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/contact" className="text-primary hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
