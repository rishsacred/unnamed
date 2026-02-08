# Verified Preparation Assistant

A production-grade Next.js application that generates preparation plans backed by verified sources. It uses Clerk for authentication, Prisma + Postgres for persistence, Tavily for web search, and OpenAI for plan synthesis.

## Architecture
- **Frontend**: Next.js App Router + Tailwind CSS for UI and layout.
- **Backend**: Next.js Route Handlers for plan generation, admin reporting, and secured APIs.
- **Auth**: Clerk with email/password and Google OAuth support.
- **Database**: PostgreSQL with Prisma ORM models for users, prompts, responses, citations, and admin logs.
- **Search**: Tavily API to fetch high-credibility sources.
- **LLM**: OpenAI API (configurable model) with strict citation enforcement.

## Getting started
1. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in the required keys.
3. Run Prisma migrations:
   ```bash
   npm run prisma:migrate
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Key routes
- `/`: Marketing landing page.
- `/dashboard`: Authenticated experience for submitting prompts and viewing past plans.
- `/admin`: Admin-only dashboard for users, prompts, and usage logs.

## Deployment checklist
- Provision a Postgres database (Supabase/Neon) and set `DATABASE_URL`.
- Configure Clerk OAuth (Google) and add production URLs.
- Set `TAVILY_API_KEY` and `OPENAI_API_KEY` in Vercel.
- Add admin emails to `ADMIN_EMAILS`.
- Run `prisma migrate deploy` on production.
