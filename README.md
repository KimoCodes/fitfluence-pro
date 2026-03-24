# Fitfluence Pro

A conversion-focused fitness storefront and client portal built with Next.js App Router, Prisma, PostgreSQL, NextAuth, Stripe, Sanity, and Resend-ready email automation.

## What v2 now includes

- Sanity-backed program catalog with schemas for programs, testimonials, and site settings
- Real Stripe Checkout sessions driven by Sanity `stripePriceId` values
- Stripe webhook fulfillment that records transactions and unlocks purchases
- Lead magnet and booking email automation hooks via the Resend REST API
- Protected admin console for Sanity program CRUD plus lead, booking, and transaction operations
- Authenticated client dashboard with purchase-aware program access
- Prisma models for users, purchases, bookings, leads, and transactions
- SEO-ready responsive Next.js storefront

## Tech stack

- Next.js 14 App Router
- React 18
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth
- Stripe
- Sanity

## Local setup

1. Install dependencies
   npm install
2. Copy environment variables
   cp .env.example .env
3. Push the schema
   npx prisma db push
4. Start development server
   npm run dev

## Environment variables

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: NextAuth signing secret
- `NEXTAUTH_URL`: canonical auth URL
- `NEXT_PUBLIC_APP_URL`: public app base URL used in Stripe success/cancel URLs and emails
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret for `/api/webhooks/stripe`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity project id
- `NEXT_PUBLIC_SANITY_DATASET`: Sanity dataset
- `SANITY_API_TOKEN`: write-enabled Sanity token for admin CRUD
- `RESEND_API_KEY`: Resend API key for transactional emails
- `EMAIL_FROM`: sender identity for transactional email
- `ADMIN_EMAIL`: notification inbox for new leads, bookings, and purchases
- `LEAD_MAGNET_URL`: downloadable asset URL sent to new leads

## Stripe setup

1. Create real Stripe products and prices in Stripe.
2. Copy each live/test `price_...` id into the matching Sanity `program.stripePriceId`.
3. Point your Stripe webhook at `/api/webhooks/stripe`.
4. After checkout completes, the webhook will log the transaction and create a `Purchase` for any known user email.

## Sanity setup

Schemas live in [sanity/schemas/index.ts](/Applications/XAMPP/xamppfiles/htdocs/fitfluence-pro/sanity/schemas/index.ts).

Add them to your Sanity Studio schema config, then create:

- a `siteSettings` document for hero copy and benefits
- one or more `program` documents with real `stripePriceId` values
- optional `testimonial` documents to replace the fallback examples

## Admin access

- `/admin` is protected by NextAuth middleware and requires a user with Prisma role `ADMIN`.
- Promote an account by updating its `role` in the database after registration.
- Program CRUD writes to Sanity; lead/booking/transaction management reads and updates Prisma records.

## Production deployment

- Frontend: Vercel
- Database: Neon, Supabase, or Railway PostgreSQL
- Background/email workflows: Resend
- CMS: Sanity Studio
- Media: Cloudinary or Sanity assets

## Verification

- `npx prisma generate`
- `npx tsc --noEmit`
- `npm run build`
