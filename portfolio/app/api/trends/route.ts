import { NextRequest, NextResponse } from 'next/server';
import { getTrends, createTrend } from '@/lib/trends-db';
import { verifyAdminAuth } from '@/lib/auth';
import type { TrendCategory, TrendStatus } from '@/types/trend';

// GET /api/trends - List trends with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Sanitize pagination parameters to prevent NaN
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20') || 20));
    const category = searchParams.get('category') as TrendCategory | null;
    const status = searchParams.get('status') as TrendStatus | null;
    const includeArchived = searchParams.get('includeArchived') === 'true';

    // Validate and parse dates
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    const startDateStr = searchParams.get('startDate');
    if (startDateStr) {
      const parsed = new Date(startDateStr);
      if (!isNaN(parsed.getTime())) {
        startDate = parsed;
      }
    }

    const endDateStr = searchParams.get('endDate');
    if (endDateStr) {
      const parsed = new Date(endDateStr);
      if (!isNaN(parsed.getTime())) {
        endDate = parsed;
      }
    }

    const { trends, total } = await getTrends({
      page,
      limit,
      category: category || undefined,
      status: status || undefined,
      startDate,
      endDate,
      includeArchived,
    });

    return NextResponse.json({
      trends,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}

// POST /api/trends - Create a new trend (admin only)
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.date || !body.category || !body.title || !body.summary) {
      return NextResponse.json(
        { error: 'Missing required fields: date, category, title, summary' },
        { status: 400 }
      );
    }

    const trend = await createTrend({
      date: new Date(body.date),
      category: body.category,
      title: body.title,
      summary: body.summary,
      keyPoints: body.keyPoints || [],
      sources: body.sources || [],
      status: body.status || 'draft',
      tags: body.tags || [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(trend, { status: 201 });
  } catch (error) {
    console.error('Error creating trend:', error);
    return NextResponse.json(
      { error: 'Failed to create trend' },
      { status: 500 }
    );
  }
}
