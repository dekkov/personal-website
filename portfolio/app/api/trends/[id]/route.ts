import { NextRequest, NextResponse } from 'next/server';
import { getTrendById, updateTrend, deleteTrend } from '@/lib/trends-db';
import { verifyAdminAuth } from '@/lib/auth';

// GET /api/trends/[id] - Get a single trend by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const includeArchived = request.nextUrl.searchParams.get('includeArchived') === 'true';
    const trend = await getTrendById(params.id, includeArchived);

    if (!trend) {
      return NextResponse.json(
        { error: 'Trend not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(trend);
  } catch (error) {
    console.error('Error fetching trend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trend' },
      { status: 500 }
    );
  }
}

// PATCH /api/trends/[id] - Update a trend (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify admin authentication
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    // Prepare updates
    const updates: any = {};

    if (body.title) updates.title = body.title;
    if (body.summary) updates.summary = body.summary;
    if (body.keyPoints) updates.keyPoints = body.keyPoints;
    if (body.sources) updates.sources = body.sources;
    if (body.status) {
      updates.status = body.status;

      // Set publishedAt when status changes to published
      if (body.status === 'published' && !body.metadata?.publishedAt) {
        updates['metadata.publishedAt'] = new Date();
      }
    }
    if (body.tags) updates.tags = body.tags;
    if (body.category) updates.category = body.category;
    if (body.reviewedBy) updates['metadata.reviewedBy'] = body.reviewedBy;

    const trend = await updateTrend(params.id, updates);

    if (!trend) {
      return NextResponse.json(
        { error: 'Trend not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(trend);
  } catch (error) {
    console.error('Error updating trend:', error);
    return NextResponse.json(
      { error: 'Failed to update trend' },
      { status: 500 }
    );
  }
}

// DELETE /api/trends/[id] - Delete a trend (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify admin authentication
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const success = await deleteTrend(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Trend not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trend:', error);
    return NextResponse.json(
      { error: 'Failed to delete trend' },
      { status: 500 }
    );
  }
}
