# SHPE Project — Prometeo

A platform for SHPE members to find scholarships, internships, career paths, peer help, and connect with the community.

## Features

- Scholarship finder (GPA & graduation level filters, direct apply links)
- Internship board
- Career path planner with AI roadmap
- Peer help requests
- Member directory
- Events board
- Onboarding flow for students and non-students
- Email/password + GitHub + Google sign-in

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (for the database)
- An `AUTH_SECRET` (generate with `openssl rand -base64 32`)

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/CarlosTho/shpeproject.git
cd shpeproject
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

| Variable | Where to get it |
|---|---|
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `AUTH_URL` | `http://localhost:3000` for local dev |
| `DATABASE_URL` | Supabase → Project Settings → Database → Transaction pooler URI (port 6543) |
| `DIRECT_URL` | Supabase → same page → Session pooler URI (port 5432) |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub → Settings → Developer settings → OAuth Apps → New OAuth App. Callback: `http://localhost:3000/api/auth/callback/github` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client. Callback: `http://localhost:3000/api/auth/callback/google` |

> OAuth providers are optional — email/password sign-in works without them.

### 4. Push the database schema

```bash
npm run db:push
```

### 5. Seed the database (optional)

Adds sample scholarships and directory members:

```bash
npm run db:seed
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run lint` | Run ESLint |

## Tech Stack

- [Next.js 16](https://nextjs.org) — framework
- [Prisma](https://prisma.io) — ORM
- [Supabase](https://supabase.com) — PostgreSQL database
- [NextAuth v5](https://authjs.dev) — authentication
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [OpenAI](https://openai.com) — AI career roadmap generation
