import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com/dekkov', ariaLabel: 'Visit GitHub profile' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/hoangtran1', ariaLabel: 'Visit LinkedIn profile' },
    { icon: Mail, label: 'Email', href: 'mailto:trhoang220703@gmail.com', ariaLabel: 'Send email' }
  ];

  return (
    <footer className="bg-surface border-t border-border mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold mb-2 font-heading">Hoang Tran</h3>
            <p className="text-foreground/70 text-sm">
              Software Engineer building scalable, high-performance applications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-foreground/70 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-foreground/70 hover:text-primary transition-colors text-sm">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground/70 hover:text-primary transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-2">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary transition-colors"
                    aria-label={link.ariaLabel}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            <p className="text-foreground/70 text-sm mt-4">
              I reply within 48 hours.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-foreground/60 text-sm">
          <p>© {currentYear} Hoang Tran. Built with Next.js and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
