import { groq } from 'next-sanity';
import { benefits, programs as fallbackPrograms, testimonials as fallbackTestimonials } from '@/lib/data';
import { sanityReadClient } from '@/lib/sanity';

export type ProgramContent = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  badge?: string;
  features: string[];
  stripePriceId?: string;
  stripeProductId?: string;
  published: boolean;
};

export type TestimonialContent = {
  _id: string;
  name: string;
  result: string;
  quote: string;
};

export type SiteSettingsContent = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  benefits?: string[];
};

const programsQuery = groq`*[_type == "program" && (!defined(published) || published == true)] | order(price asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  price,
  badge,
  features,
  stripePriceId,
  stripeProductId,
  published
}`;

const allProgramsAdminQuery = groq`*[_type == "program"] | order(_createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  description,
  price,
  badge,
  features,
  stripePriceId,
  stripeProductId,
  published
}`;

const testimonialQuery = groq`*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  name,
  result,
  quote
}`;

const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  heroEyebrow,
  heroTitle,
  heroDescription,
  benefits
}`;

function mapFallbackPrograms(): ProgramContent[] {
  return fallbackPrograms.map((program) => ({
    _id: program.slug,
    name: program.name,
    slug: program.slug,
    description: program.description,
    price: program.price,
    badge: program.badge,
    features: program.features,
    published: true
  }));
}

function mapFallbackTestimonials(): TestimonialContent[] {
  return fallbackTestimonials.map((item) => ({
    _id: item.name,
    ...item
  }));
}

export async function getPrograms() {
  try {
    const result = await sanityReadClient.fetch<ProgramContent[]>(programsQuery);
    return result?.length ? result : mapFallbackPrograms();
  } catch {
    return mapFallbackPrograms();
  }
}

export async function getAdminPrograms() {
  try {
    const result = await sanityReadClient.fetch<ProgramContent[]>(allProgramsAdminQuery);
    return result?.length ? result : mapFallbackPrograms();
  } catch {
    return mapFallbackPrograms();
  }
}

export async function getProgramBySlug(slug: string) {
  const programs = await getPrograms();
  return programs.find((program) => program.slug === slug) || null;
}

export async function getProgramsBySlugs(slugs: string[]) {
  if (!slugs.length) return [];
  const programs = await getPrograms();
  const wanted = new Set(slugs);
  return programs.filter((program) => wanted.has(program.slug));
}

export async function getTestimonials() {
  try {
    const result = await sanityReadClient.fetch<TestimonialContent[]>(testimonialQuery);
    return result?.length ? result : mapFallbackTestimonials();
  } catch {
    return mapFallbackTestimonials();
  }
}

export async function getSiteSettings() {
  try {
    const result = await sanityReadClient.fetch<SiteSettingsContent | null>(siteSettingsQuery);
    return result || {
      heroEyebrow: 'Trusted by busy clients across the USA',
      heroTitle: 'Build Your Dream Body Without Wasting Time.',
      heroDescription:
        'A premium fitness funnel and coaching platform designed to turn content viewers into committed clients with clear offers, fast checkout, and a secure client portal.',
      benefits
    };
  } catch {
    return {
      heroEyebrow: 'Trusted by busy clients across the USA',
      heroTitle: 'Build Your Dream Body Without Wasting Time.',
      heroDescription:
        'A premium fitness funnel and coaching platform designed to turn content viewers into committed clients with clear offers, fast checkout, and a secure client portal.',
      benefits
    };
  }
}
