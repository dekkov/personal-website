'use client';

import { useState } from 'react';
import { contactFormSchema } from '@/lib/validation';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      message: formData.get('message'),
      honeypot: formData.get('honeypot'),
    };

    try {
      // Validate on client side
      const validated = contactFormSchema.parse(data);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
        if (result.details?.fieldErrors) {
          setErrors(result.details.fieldErrors);
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field (hidden from users) */}
      <input
        type="text"
        name="honeypot"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name *
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email *
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Company (optional) */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium mb-2">
          Company (optional)
        </label>
        <Input
          type="text"
          id="company"
          name="company"
          aria-invalid={!!errors.company}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-destructive">{errors.company}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-destructive">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full"
        size="lg"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>

      {/* Status Messages */}
      {status === 'success' && (
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-500/50 text-green-800 dark:text-green-200">
          <p className="font-medium">Thank you for your message!</p>
          <p className="text-sm mt-1">I'll get back to you as soon as possible.</p>
        </Card>
      )}

      {status === 'error' && !Object.keys(errors).length && (
        <Card className="p-4 bg-destructive/10 border-destructive/50 text-destructive">
          <p className="font-medium">Something went wrong.</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </Card>
      )}
    </form>
  );
}
