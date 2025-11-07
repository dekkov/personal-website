/**
 * Standalone script to generate daily AI trend summary
 *
 * Usage:
 *   npm run generate-trends
 *   npm run generate-trends -- --days=2
 *
 * Or trigger via API:
 *   curl -X POST http://localhost:3000/api/trends/generate \
 *     -H "Content-Type: application/json" \
 *     -d '{"daysBack": 1}'
 *
 * Note: Environment variables are loaded via tsx --env-file flags
 */

import { fetchTopAINews } from '../lib/rss-aggregator';
import { generateDailySummary } from '../lib/ai-summarizer';
import { createTrend } from '../lib/trends-db';

async function main() {
  console.log('🚀 Starting Daily AI Trends Generation...\n');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const daysBack = parseInt(args.find((arg) => arg.startsWith('--days='))?.split('=')[1] || '1');

  console.log(`📅 Fetching articles from the last ${daysBack} day(s)`);
  console.log(`📰 Source: TechCrunch AI\n`);

  try {
    // Step 1: Fetch top 5 AI news from TechCrunch
    console.log('📡 Step 1/3: Fetching top AI news...');
    const articles = await fetchTopAINews(5, daysBack);

    if (articles.length === 0) {
      console.log('\n❌ No articles found from TechCrunch AI');
      process.exit(0);
    }

    console.log(`  ✓ Found ${articles.length} articles\n`);

    // Step 2: Generate AI summary
    console.log('🤖 Step 2/3: Generating daily summary with Gemini...');
    const summary = await generateDailySummary(articles);

    console.log(`  ✓ Generated daily summary\n`);

    // Step 3: Save to database
    console.log('💾 Step 3/3: Saving to database...');
    const trend = await createTrend({
      date: new Date(),
      category: 'business',
      title: summary.title,
      summary: summary.summary,
      keyPoints: summary.keyPoints,
      sources: articles.map((article) => ({
        title: article.title,
        url: article.link,
        publishedAt: article.pubDate,
        feedSource: article.source,
      })),
      status: 'pending_review',
      tags: summary.tags,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`  ✓ Saved: "${summary.title}"\n`);

    console.log('✅ Success! Generated and saved daily trend summary:');
    console.log(`   - Status: pending_review`);
    console.log(`   - Articles: ${articles.length}`);
    console.log(`   - Review at: /admin/trends\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error generating trends:', error);
    if (error instanceof Error) {
      console.error('Details:', error.message);
    }
    process.exit(1);
  }
}

// Run the script
main();
