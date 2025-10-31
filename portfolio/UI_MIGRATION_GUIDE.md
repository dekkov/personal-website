# UI Migration Guide - Next.js Portfolio

This guide outlines how to complete the UI migration from the design specification to your Next.js backend.

## ✅ What's Been Completed

1. **Backend Infrastructure** (100% Complete)
   - All API routes (`/api/contact`, `/api/track`, `/api/download-resume`)
   - MDX content processing with syntax highlighting
   - Email integration with Resend
   - Analytics with Vercel
   - TypeScript types for all data models
   - Sitemap and robots.txt generation

2. **Design System** (100% Complete)
   - Global CSS with design tokens
   - Color palette (light/dark mode variables)
   - Typography scale (Sora for headings, Inter for body)
   - Spacing system (4px base unit)
   - Elevation/shadow system
   - Utility classes for containers, text styles
   - Accessibility focus styles (WCAG 2.2 AA)

3. **Dependencies Installed**
   - Radix UI components (@radix-ui/react-*)
   - Framer Motion (for animations)
   - Class Variance Authority (for component variants)

## 🚧 What Needs to Be Built

### Phase 1: Core UI Components (Priority 1)

Create these reusable components in `components/ui/`:

#### 1. Button Component (`components/ui/button.tsx`)
```typescript
'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
        secondary: "border-1.5 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800",
        ghost: "text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
        destructive: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

#### 2. Card Component (`components/ui/card.tsx`)
```typescript
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-6 elevation-2",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-600 dark:text-slate-400", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}
```

#### 3. Badge Component (`components/ui/badge.tsx`)
```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        secondary: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        outline: "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
```

### Phase 2: Layout Components (Priority 2)

#### 4. Header/Navigation (`components/layout/Header.tsx`)
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Projects', href: '/projects' },
  { name: 'Experience', href: '/experience' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
      <nav className="container-content py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white">
            Your Name
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-slate-600 dark:text-slate-400"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Button size="sm">Download Resume</Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
```

#### 5. Footer (`components/layout/Footer.tsx`)
```typescript
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-slate-900">
      <div className="container-content py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-2">Your Name</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Software Engineer building accessible web applications.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/projects" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600">
                Projects
              </Link>
              <Link href="/blog" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600">
                Blog
              </Link>
              <Link href="/contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600">
                Contact
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex gap-4">
              <a href="https://github.com" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">
                <Linkedin size={20} />
              </a>
              <a href="https://twitter.com" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="mailto:your@email.com" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-gray-800 text-center text-sm text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} Your Name. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

### Phase 3: Page Implementation (Priority 3)

#### Update Root Layout (`app/layout.tsx`)
```typescript
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  title: {
    default: 'Your Name - Software Engineer',
    template: '%s | Your Name',
  },
  description: 'Software Engineer building fast, accessible web applications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
```

## 📋 Remaining Tasks Checklist

- [ ] Create all UI components (Button, Card, Badge, Input, etc.)
- [ ] Build Header with mobile menu
- [ ] Build Footer with social links
- [ ] Rebuild Home page with Hero section
- [ ] Add CredibilityStrip component
- [ ] Build filterable Projects gallery
- [ ] Enhance Project detail pages with TL;DR section
- [ ] Build Experience timeline
- [ ] Add dark mode toggle
- [ ] Add search functionality for blog
- [ ] Test responsive design
- [ ] Run Lighthouse audit
- [ ] Test keyboard navigation

## 🎯 Next Steps

1. **Copy the UI components** from this guide into your `components/` folders
2. **Install missing icon library**: `npm install lucide-react`
3. **Update pages** one by one, starting with Home
4. **Test in browser**: `npm run dev`
5. **Iterate** on design and functionality

## 📚 Resources

- Design System: See `app/globals.css` for all tokens
- Backend API: All routes in `app/api/` are working
- Content: Add projects/blog posts in `content/` folders
- Types: All TypeScript types defined in `types/` folder

The backend is 100% complete. Focus on building the UI components and pages to match the design specification!
