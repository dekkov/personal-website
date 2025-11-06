/**
 * Standalone script to generate AI trend summaries
 *
 * Usage:
 *   npm run generate-trends
 *   npm run generate-trends -- --days=2 --categories=agents,business
 *
 * Or trigger via API:
 *   curl -X POST http://localhost:3000/api/trends/generate \
 *     -H "Content-Type: application/json" \
 *     -d '{"daysBack": 1, "categories": ["agents", "business", "tools"]}'
 *
 * Note: Environment variables are loaded via tsx --env-file flags
 */

import { fetchAllFeeds } from '../lib/rss-aggregator';
import { generateAllSummaries } from '../lib/ai-summarizer';
import { createTrend } from '../lib/trends-db';
import type { TrendCategory } from '../types/trend';

async function main() {
  console.log('🚀 Starting AI Trends Generation...\n');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const daysBack = parseInt(args.find((arg) => arg.startsWith('--days='))?.split('=')[1] || '1');
  const categoriesArg = args.find((arg) => arg.startsWith('--categories='))?.split('=')[1];
  const categories: TrendCategory[] = categoriesArg
    ? (categoriesArg.split(',') as TrendCategory[])
    : ['agents', 'business', 'tools'];

  console.log(`📅 Fetching articles from the last ${daysBack} day(s)`);
  console.log(`📂 Categories: ${categories.join(', ')}\n`);

  try {
    // Step 1: Fetch RSS feeds
    console.log('📡 Step 1/3: Fetching RSS feeds...');
    const allArticles = await fetchAllFeeds(daysBack);

    // Filter to requested categories
    const articlesToSummarize: Record<string, any> = {};
    let totalArticles = 0;

    for (const category of categories) {
      if (allArticles[category] && allArticles[category].length > 0) {
        articlesToSummarize[category] = allArticles[category];
        totalArticles += allArticles[category].length;
        console.log(`  ✓ ${category}: ${allArticles[category].length} articles`);
      } else {
        console.log(`  ⚠ ${category}: No articles found`);
      }
    }

    if (Object.keys(articlesToSummarize).length === 0) {
      console.log('\n❌ No articles found for the specified categories and date range');
      process.exit(0);
    }

    console.log(`\n  Total: ${totalArticles} articles\n`);

    // Step 2: Generate AI summaries
    console.log('🤖 Step 2/3: Generating AI summaries...');
    const summaries = await generateAllSummaries(articlesToSummarize);

    if (summaries.length === 0) {
      console.log('\n❌ Failed to generate summaries');
      process.exit(1);
    }

    console.log(`  ✓ Generated ${summaries.length} summaries\n`);

    // Step 3: Save to database
    console.log('💾 Step 3/3: Saving to database...');
    const createdTrends = [];

    for (const { category, summary, articles } of summaries) {
      const trend = await createTrend({
        date: new Date(),
        category,
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

      createdTrends.push(trend);
      console.log(`  ✓ Saved: ${category} - "${summary.title}"`);
    }

    console.log('\n✅ Success! Generated and saved trend summaries:');
    console.log(`   - ${createdTrends.length} new summaries`);
    console.log(`   - Status: pending_review`);
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
