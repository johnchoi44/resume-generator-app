import { NextResponse } from 'next/server';
import { getMasterExperienceData } from '@/lib/db/experiences';

export const dynamic = 'force-dynamic';

/**
 * GET /api/experiences
 * Fetch all resume data for preview/debugging
 */
export async function GET(): Promise<NextResponse> {
  try {
    const masterData = await getMasterExperienceData();

    return NextResponse.json({
      success: true,
      data: {
        experiences: masterData.all_experiences,
        skills: masterData.all_skills,
        projects: masterData.all_projects,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to fetch experiences:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Failed to fetch data',
        },
      },
      { status: 500 }
    );
  }
}
