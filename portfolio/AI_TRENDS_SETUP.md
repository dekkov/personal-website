# AI Trends System - Setup & Usage Guide

An automated AI-powered system that aggregates, summarizes, and publishes daily AI trend summaries on your portfolio website.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The AI Trends system:
1. **Aggregates** RSS feeds from top AI/tech sources daily
2. **Summarizes** using Claude AI (or OpenAI as fallback)
3. **Stores** in MongoDB with automatic archival after 90 days
4. **Publishes** after manual review via admin dashboard

**Categories tracked:**
- 🤖 AI Agents & Automation
- 💼 Business Strategy & Adoption
- 🛠️ Tools & Infrastructure

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  RSS Feeds (20+ sources)                                     │
│  ├─ Anthropic, OpenAI, LangChain (Agents)                  │
│  ├─ TechCrunch, VentureBeat (Business)                     │
│  └─ Hugging Face, GitHub (Tools)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  AI Summarization (Claude Haiku)                            │
│  ├─ Extracts key insights                                   │
│  ├─ Generates 250-350 word summaries                       │
│  └─ Creates bullet point takeaways                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  MongoDB Atlas (Free Tier)                                   │
│  ├─ trends (active, last 90 days)                          │
│  └─ trends_archive (older entries)                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Your Portfolio                                              │
│  ├─ /admin/trends (Review & approve)                       │
│  └─ /trends (Public display)                                │
└─────────────────────────────────────────────────────────────┘
```

## ✅ Prerequisites

1. **MongoDB Atlas Account** (free tier sufficient)
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (M0 tier provides 512MB storage)

2. **Anthropic API Key** (recommended) OR **OpenAI API Key**
   - Anthropic: [console.anthropic.com](https://console.anthropic.com/)
   - OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

3. **Node.js** 18+ and npm

4. **Admin API Key** (REQUIRED for production)
   - Generate with: `openssl rand -hex 32`
   - Protects admin endpoints from unauthorized access

## 🔒 Security Features

The system includes multiple security layers:

1. **Authentication**: Admin endpoints require `ADMIN_API_KEY` header
2. **Rate Limiting**: Prevents API abuse (requires Upstash Redis - optional)
3. **Input Validation**: All API parameters are sanitized
4. **MongoDB Connection Pooling**: Prevents connection exhaustion
5. **Auto-Index Creation**: Ensures optimal database performance

### Production Security Checklist

Before deploying to production:

- ✅ Set strong `ADMIN_API_KEY` (minimum 32 characters)
- ✅ Configure Upstash Redis for rate limiting (optional but recommended)
- ✅ Whitelist only necessary IPs in MongoDB Atlas Network Access
- ✅ Enable MongoDB Atlas backup (automatic on free tier)
- ✅ Use environment variables for all secrets (never commit `.env`)
- ✅ Test authentication with: `curl -H "Authorization: Bearer your-key" ...`

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd portfolio
npm install
```

This will install:
- `mongodb` - Database driver
- `@anthropic-ai/sdk` - Claude AI SDK
- `rss-parser` - RSS feed parser
- `tsx` - TypeScript execution (dev dependency)

### Step 2: Configure MongoDB

1. Create a free MongoDB Atlas cluster:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Build a Database" → Choose "M0 Free"
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

2. Set up database access:
   - Go to "Database Access" → "Add New Database User"
   - Create a user with read/write permissions
   - Save the username and password

3. Set up network access:
   - Go to "Network Access" → "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP

4. Get your connection string:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password

### Step 3: Configure Environment Variables

Create or update `/portfolio/.env.local`:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=portfolio

# AI API Key (choose one or both for fallback)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
# OPENAI_API_KEY=sk-xxxxxxxxxxxxx  # Optional fallback

# Admin API Key (REQUIRED for production, optional for local dev)
# Generate with: openssl rand -hex 32
ADMIN_API_KEY=your-secure-random-api-key-here

# Optional: Rate limiting (requires Upstash Redis)
# UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
# UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx

# Existing variables (keep these)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=your-email@example.com
```

**Security Note**: The `ADMIN_API_KEY` is optional for local development but **REQUIRED for production**. Without it, admin endpoints (create, update, delete, generate) will be unprotected in production.

### Step 4: Initialize Database

Database indexes are created **automatically** on first use. No manual setup required!

The first time you:
- Fetch trends (`GET /api/trends`)
- Create a trend (`POST /api/trends`)
- Generate summaries (`POST /api/trends/generate`)

The system will automatically create optimal indexes for:
- Date-based queries
- Category and status filtering
- Text search
- Deduplication prevention

### Step 5: Generate Your First Trends

Generate your first trend summaries:

```bash
# Option 1: Via CLI script
npm run generate-trends

# Option 2: Via API (requires dev server running)
curl -X POST http://localhost:3000/api/trends/generate \
  -H "Content-Type: application/json" \
  -d '{"daysBack": 1, "categories": ["agents", "business", "tools"]}'

# In production (with ADMIN_API_KEY set):
curl -X POST https://your-site.com/api/trends/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-admin-api-key" \
  -d '{"daysBack": 1, "categories": ["agents", "business", "tools"]}'
```

**Note**: Admin endpoints require authentication in production when `ADMIN_API_KEY` is set.

### Step 6: Review & Publish

1. Open the admin dashboard: `http://localhost:3000/admin/trends`
2. Review the generated summaries
3. Click on a summary to view details
4. Click "Publish" to make it visible on the public page
5. View published trends at: `http://localhost:3000/trends`

## 📖 Usage

### Manual Generation

Generate new trend summaries manually:

```bash
# Generate for last 1 day (default)
npm run generate-trends

# Generate for last 2 days
npm run generate-trends -- --days=2

# Generate specific categories only
npm run generate-trends -- --categories=agents,business
```

### Automated Daily Generation (GitHub Actions)

The system includes a GitHub Actions workflow that runs daily at 9 AM UTC.

#### Enable Automation:

1. Add secrets to your GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `MONGODB_URI`
     - `MONGODB_DB_NAME`
     - `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`)
     - `NEXT_PUBLIC_SITE_URL`

2. The workflow will run automatically daily, or trigger manually:
   - Go to Actions tab → "Generate AI Trends" → "Run workflow"
   - Optionally customize days back and categories

### Admin Dashboard

Access: `/admin/trends`

**Features:**
- View all trends (pending, published, draft)
- Filter by status
- Generate new summaries with one click
- Review AI-generated content
- Edit before publishing
- Publish or delete trends

**Workflow:**
1. Click "🤖 Generate New Summaries"
2. Wait for generation to complete (~30-60 seconds)
3. Review pending summaries
4. Click on a summary to view full details
5. Click "✓ Publish" to make it public

### Public Page

Access: `/trends`

**Features:**
- Clean, readable display of published trends
- Filter by category (All, Agents, Business, Tools)
- Pagination (20 per page)
- Collapsible source links
- Responsive design

### Archival System

Old trends are automatically archived after 90 days to maintain database performance.

**Manual archival:**
```bash
curl -X POST http://localhost:3000/api/trends/archive \
  -H "Content-Type: application/json" \
  -d '{"daysOld": 90}'
```

**Restore archived trends:**
- Archived trends can be viewed by setting `?includeArchived=true` in API calls
- They remain searchable but don't appear on the public page by default

## 🎨 Customization

### Add New RSS Feeds

Edit `/portfolio/lib/rss-aggregator.ts`:

```typescript
export const RSS_FEEDS = {
  agents: [
    { url: 'https://your-feed.com/rss', name: 'Your Source' },
    // ... add more
  ],
  // ...
};
```

### Adjust Keywords Filter

Edit the `CATEGORY_KEYWORDS` in `/portfolio/lib/rss-aggregator.ts`:

```typescript
const CATEGORY_KEYWORDS = {
  agents: [
    'agent', 'agentic', 'autonomous',
    // ... add your keywords
  ],
};
```

### Customize Summary Length

Edit `/portfolio/lib/ai-summarizer.ts`:

```typescript
const prompt = `...
Generate a comprehensive summary (250-350 words)  // ← Change this
...`;
```

### Adjust Archival Period

Change the default 90 days in `/portfolio/lib/trends-db.ts`:

```typescript
export async function archiveOldTrends(daysOld = 90) {  // ← Change this
```

### Add More Categories

1. Update the type in `/portfolio/types/trend.ts`:
```typescript
export type TrendCategory = 'agents' | 'business' | 'tools' | 'research' | 'your-category';
```

2. Add RSS feeds in `/portfolio/lib/rss-aggregator.ts`
3. Add keywords in the `CATEGORY_KEYWORDS` object
4. Update UI labels in `/portfolio/app/trends/page.tsx`

## 🐛 Troubleshooting

### Error: "MongoDB connection failed"

**Solution:**
1. Check your `MONGODB_URI` in `.env.local`
2. Ensure your IP is whitelisted in MongoDB Atlas Network Access
3. Verify your database user credentials

### Error: "No articles found"

**Possible causes:**
- RSS feeds are down or changed URLs
- Date range too narrow (try `--days=2` or `--days=7`)
- Keywords too restrictive

**Solution:**
```bash
# Test RSS fetching directly
npm run generate-trends -- --days=7
```

### Error: "AI API key not configured"

**Solution:**
Add either `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` to `.env.local`

### Trends not appearing on public page

**Check:**
1. Are they published? Status must be "published" not "pending_review"
2. Open `/admin/trends` and check the status filter
3. Click a trend and ensure status shows "published" badge

### Performance issues with large datasets

**Solutions:**
1. Run archival to move old trends: `POST /api/trends/archive`
2. Reduce pagination limit in API calls
3. Consider upgrading MongoDB Atlas tier (still free alternatives available)

## 📊 Monitoring & Maintenance

### View Statistics

```bash
curl http://localhost:3000/api/trends/stats
```

Returns:
- Total active trends
- Total archived trends
- Breakdown by category
- Breakdown by status

### Regular Maintenance Tasks

**Weekly:**
- Review and publish pending summaries
- Check for dead RSS feeds

**Monthly:**
- Run archival for trends older than 90 days
- Review MongoDB storage usage

**As needed:**
- Update RSS feed sources
- Adjust keyword filters
- Customize summary prompts

## 🚀 Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add all environment variables to your hosting platform
2. Ensure MongoDB Atlas allows connections from your hosting provider's IPs
3. Update `NEXT_PUBLIC_SITE_URL` to your production URL
4. For Vercel Cron (requires Pro plan), add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/trends/generate",
    "schedule": "0 9 * * *"
  }]
}
```

5. Or continue using GitHub Actions (free)

## 💡 Cost Estimates

- **MongoDB Atlas**: Free (M0 tier, 512MB)
- **Anthropic Claude Haiku**: ~$0.03-0.05 per day (~$1-1.50/month)
- **OpenAI GPT-4o-mini**: ~$0.02-0.04 per day (~$0.60-1.20/month)
- **GitHub Actions**: Free (2,000 minutes/month)

**Total estimated cost: $1-2/month** 🎉

## 📚 API Reference

### GET /api/trends
List trends with pagination and filtering.

**Query params:**
- `page` (default: 1)
- `limit` (default: 20)
- `category` (agents|business|tools|research)
- `status` (draft|pending_review|published|archived)
- `startDate` (ISO date)
- `endDate` (ISO date)
- `includeArchived` (true|false)

### POST /api/trends/generate
Generate new trend summaries from RSS feeds.

**Body:**
```json
{
  "daysBack": 1,
  "categories": ["agents", "business", "tools"]
}
```

### GET /api/trends/[id]
Get a single trend by ID.

### PATCH /api/trends/[id]
Update a trend (status, title, summary, etc.).

### DELETE /api/trends/[id]
Delete a trend.

### POST /api/trends/archive
Archive old trends.

**Body:**
```json
{
  "daysOld": 90
}
```

### GET /api/trends/stats
Get statistics about trends.

---

## 🎉 You're All Set!

Your AI Trends system is ready to keep you (and your visitors) updated on the latest AI developments without the manual effort.

**Questions or issues?** Check the Troubleshooting section or review the inline code comments.

Happy trend tracking! 🚀
