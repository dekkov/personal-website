import { NextRequest, NextResponse } from 'next/server';
import { archiveOldTrends } from '@/lib/trends-db';
import { verifyAdminAuth } from '@/lib/auth';

// POST /api/trends/archive - Archive trends older than specified days (admin only)
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const daysOld = body.daysOld || 90;

    const archivedCount = await archiveOldTrends(daysOld);

    return NextResponse.json({
      success: true,
      message: `Archived ${archivedCount} trends older than ${daysOld} days`,
      archivedCount,
    });
  } catch (error) {
    console.error('Error archiving trends:', error);
    return NextResponse.json(
      { error: 'Failed to archive trends' },
      { status: 500 }
    );
  }
}
