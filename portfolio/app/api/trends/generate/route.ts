import { NextRequest, NextResponse } from 'next/server';
import { fetchTopAINews } from '@/lib/rss-aggregator';
import { generateDailySummary } from '@/lib/ai-summarizer';
import { createTrend } from '@/lib/trends-db';
import { verifyAdminAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

// POST /api/trends/generate - Generate daily AI news summary from TechCrunch (admin only)
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

    // Step 1: Fetch top 5 AI news from TechCrunch
    console.log('Fetching top AI news from TechCrunch...');
    const articles = await fetchTopAINews(5, daysBack);

    if (articles.length === 0) {
      return NextResponse.json(
        {
          message: 'No recent AI news found from TechCrunch',
          articlesFound: 0,
        },
        { status: 200 }
      );
    }

    // Step 2: Generate AI summary (ONE API call instead of 3!)
    console.log(`Generating daily summary from ${articles.length} articles...`);
    const summary = await generateDailySummary(articles);

    // Step 3: Save to database as draft for review
    console.log('Saving summary to database...');
    const trend = await createTrend({
      date: new Date(),
      category: 'business', // Default category for AI news
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

    return NextResponse.json({
      success: true,
      message: `Generated daily AI news summary from ${articles.length} TechCrunch articles`,
      trend,
      stats: {
        articlesProcessed: articles.length,
        source: 'TechCrunch AI',
      },
    });
  } catch (error) {
    console.error('Error generating daily summary:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate daily summary',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
