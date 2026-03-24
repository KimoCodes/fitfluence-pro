import { defineField, defineType } from 'sanity';

export const programSchema = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: 'price', title: 'Display price (USD)', type: 'number', validation: (rule) => rule.required().min(0) }),
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }], validation: (rule) => rule.required().min(1) }),
    defineField({ name: 'stripeProductId', title: 'Stripe product ID', type: 'string' }),
    defineField({ name: 'stripePriceId', title: 'Stripe price ID', type: 'string', description: 'Used for live Checkout sessions.' }),
    defineField({ name: 'published', title: 'Published', type: 'boolean', initialValue: true })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'slug.current'
    }
  }
});
