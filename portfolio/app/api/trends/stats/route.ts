import { NextResponse } from 'next/server';
import { getTrendsStats } from '@/lib/trends-db';

// GET /api/trends/stats - Get statistics about trends
export async function GET() {
  try {
    const stats = await getTrendsStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching trends stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends statistics' },
      { status: 500 }
    );
  }
}
