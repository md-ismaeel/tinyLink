# TinyLink - URL Shortener Setup Guide

## Quick Start

### Step 1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 2: Configure Environment Variables

1. Copy the example env file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

2. Add your Neon database connection string:
   - Get your `DATABASE_URL` from Neon dashboard
   - Replace the placeholder in `.env.local`

Example:
\`\`\`
DATABASE_URL=postgresql://username:password@ep-xxxxx.region.neon.tech/database?sslmode=require
\`\`\`

### Step 3: Initialize Database

Run the database migration script to create tables:

\`\`\`bash
npm run build
\`\`\`

Then execute the SQL script in your Neon dashboard or via psql:
- Open `scripts/01-init-schema.sql`
- Copy all SQL commands
- Run in Neon SQL Editor

Or use psql directly:
\`\`\`bash
psql "$DATABASE_URL" -f scripts/01-init-schema.sql
\`\`\`

### Step 4: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit: `http://localhost:3000`

## Features

- Create shortened URLs with auto-generated or custom short codes
- Track click counts and last accessed time for each link
- Copy short URLs to clipboard with one click
- View detailed statistics for each link
- Delete links when no longer needed
- Responsive design works on desktop and mobile

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── links/              # Link CRUD endpoints
│   │   └── redirect/           # Redirect with tracking
│   ├── code/[code]/            # Stats page
│   ├── page.tsx                # Dashboard
│   └── layout.tsx              # Root layout
├── components/
│   ├── link-form.tsx           # Create link form
│   └── links-table.tsx         # Links display table
├── lib/
│   ├── db.ts                   # Neon database client
│   └── utils.ts                # Utility functions
└── scripts/
    └── 01-init-schema.sql      # Database schema
\`\`\`

## API Endpoints

### Create Link
- `POST /api/links`
- Body: `{ originalUrl: string, customCode?: string }`
- Returns: Link object with short_code

### List All Links
- `GET /api/links`
- Returns: Array of all links

### Get Link Stats
- `GET /api/links/:code`
- Returns: Single link with statistics

### Delete Link
- `DELETE /api/links/:code`
- Returns: Success status

### Redirect (Auto-track clicks)
- `GET /:code`
- Redirects to original URL and increments click count

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel from https://vercel.com/dashboard
3. Add `DATABASE_URL` in Environment Variables
4. For production URLs, update `NEXT_PUBLIC_APP_URL` if needed

### Build and Start

\`\`\`bash
npm run build
npm run start
\`\`\`

## Troubleshooting

**"DATABASE_URL is not set"**
- Ensure `.env.local` exists with your database URL
- Restart dev server after adding env vars

**"Link not found" on redirect**
- Verify database tables were created via `01-init-schema.sql`
- Check the short code exists in database

**"Connection refused"**
- Verify Neon database connection string is correct
- Test connection with: `psql "$DATABASE_URL" -c "SELECT 1"`

## Tech Stack

- **Framework**: Next.js 16.0.3
- **Runtime**: React 19.2.0
- **Database**: Neon PostgreSQL
- **Styling**: Tailwind CSS 4.1.9
- **Database Client**: @neondatabase/serverless 1.0.2
