// Contact page

import ContactForm from '@/components/contact/ContactForm';
import { Card } from '@/components/ui/card';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with me for project collaborations and opportunities.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4">Let's Work Together</h1>
          <p className="text-body-large text-foreground/80 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and opportunities.
            Fill out the form below and I'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card className="p-6 md:p-8">
              <ContactForm />
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <a
                  href="mailto:your-email@example.com"
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span className="text-sm">your-email@example.com</span>
                </a>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Connect Online</h2>
              <div className="space-y-3">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="text-sm">LinkedIn</span>
                </a>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="text-sm">Twitter</span>
                </a>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-sm text-foreground/80">
                I typically respond within 24-48 hours on business days.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
