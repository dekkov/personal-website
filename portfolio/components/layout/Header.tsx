'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

const navItems = [
  { label: 'Home', value: '/' },
  { label: 'Projects', value: '/projects' },
  { label: 'Experience', value: '/experience' },
  { label: 'Blog', value: '/blog' },
  { label: 'About', value: '/about' },
  { label: 'Contact', value: '/contact' }
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-lg shadow-md'
          : 'bg-surface'
      }`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label="Go to homepage"
          >
            <span className="text-xl font-bold text-foreground font-heading">
              Hoang<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.value}
                href={item.value}
                className={`px-3 py-2 rounded-md transition-colors ${
                  pathname === item.value
                    ? 'text-primary font-medium'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                }`}
                aria-current={pathname === item.value ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-4 border-t border-border"
            role="menu"
          >
            {navItems.map((item) => (
              <Link
                key={item.value}
                href={item.value}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                  pathname === item.value
                    ? 'text-primary font-medium bg-muted'
                    : 'text-foreground hover:bg-muted'
                }`}
                role="menuitem"
                aria-current={pathname === item.value ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
