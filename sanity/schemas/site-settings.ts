import { defineField, defineType } from 'sanity';

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'heroEyebrow', title: 'Hero eyebrow', type: 'string' }),
    defineField({ name: 'heroTitle', title: 'Hero title', type: 'string' }),
    defineField({ name: 'heroDescription', title: 'Hero description', type: 'text', rows: 4 }),
    defineField({ name: 'benefits', title: 'Benefits', type: 'array', of: [{ type: 'string' }] })
  ]
});
