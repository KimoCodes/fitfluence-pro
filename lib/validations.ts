import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

export const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  sessionType: z.enum(['one_on_one', 'group']),
  date: z.string().min(1),
  notes: z.string().max(500).optional()
});

export const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).optional()
});

export const checkoutSchema = z.object({
  slug: z.string().min(1)
});

export const adminProgramSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().min(0),
  badge: z.string().max(50).optional().or(z.literal('')),
  stripeProductId: z.string().max(120).optional().or(z.literal('')),
  stripePriceId: z.string().max(120).optional().or(z.literal('')),
  published: z.coerce.boolean().default(true),
  features: z.array(z.string().min(1)).min(1)
});

export const bookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'])
});

export const leadStatusSchema = z.object({
  status: z.enum(['NEW', 'NURTURING', 'CONVERTED', 'UNSUBSCRIBED'])
});
