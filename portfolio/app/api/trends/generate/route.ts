import { NextRequest, NextResponse } from 'next/server';
import { fetchAllFeeds } from '@/lib/rss-aggregator';
import { generateAllSummaries } from '@/lib/ai-summarizer';
import { createTrend } from '@/lib/trends-db';
import { verifyAdminAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import type { TrendCategory } from '@/types/trend';

// POST /api/trends/generate - Generate new trend summaries from RSS feeds (admin only)
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  // Apply rate limiting (5 requests per hour - expensive operation)
  const rateLimitError = await checkRateLimit(request, 'aiGeneration');
  if (rateLimitError) return rateLimitError;

  try {
    const body = await request.json();
    const daysBack = body.daysBack || 1;
    const categoriesToGenerate: TrendCategory[] = body.categories || [
      'agents',
      'business',
      'tools',
    ];

    // Step 1: Fetch RSS feeds
    console.log('Fetching RSS feeds...');
    const allArticles = await fetchAllFeeds(daysBack);

    // Filter to requested categories
    const articlesToSummarize: Record<string, any> = {};
    for (const category of categoriesToGenerate) {
      if (allArticles[category] && allArticles[category].length > 0) {
        articlesToSummarize[category] = allArticles[category];
      }
    }

    if (Object.keys(articlesToSummarize).length === 0) {
      return NextResponse.json(
        {
          message: 'No articles found for the specified categories and date range',
          articlesFound: allArticles,
        },
        { status: 200 }
      );
    }

    // Step 2: Generate AI summaries
    console.log('Generating AI summaries...');
    const summaries = await generateAllSummaries(articlesToSummarize);

    if (summaries.length === 0) {
      return NextResponse.json(
        {
          message: 'Failed to generate summaries',
          articlesFound: articlesToSummarize,
        },
        { status: 500 }
      );
    }

    // Step 3: Save to database as drafts for review
    console.log('Saving summaries to database...');
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
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${createdTrends.length} trend summaries`,
      trends: createdTrends,
      stats: {
        totalArticlesProcessed: Object.values(articlesToSummarize).flat().length,
        categoriesProcessed: Object.keys(articlesToSummarize),
      },
    });
  } catch (error) {
    console.error('Error generating trends:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate trends',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
