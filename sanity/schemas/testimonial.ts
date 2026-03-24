import { defineField, defineType } from 'sanity';

export const testimonialSchema = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Client name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'result', title: 'Result', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 5, validation: (rule) => rule.required() })
  ]
});
