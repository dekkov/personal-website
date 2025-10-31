// Zod validation schemas

import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z
    .string()
    .email('Invalid email address')
    .max(255),
  company: z
    .string()
    .max(100)
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long'),
  honeypot: z.string().optional(), // Bot trap
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Slug validation for MDX files (prevents path traversal)
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
  .min(1, 'Slug too short')
  .max(100, 'Slug too long');

// Analytics tracking validation
export const trackingEventSchema = z.object({
  event: z.enum([
    'page_view',
    'resume_download',
    'contact_form_submit',
    'project_view',
    'blog_post_view',
    'external_link_click',
  ]),
  properties: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
});
