import { NextRequest, NextResponse } from 'next/server';
import { generateCustomizedResume } from '@/lib/baml/generate-resume';
import { generateOptimizedResume } from '@/lib/baml/generate-scored-resume';
import { getMasterExperienceData } from '@/lib/db/experiences';

export interface GenerateResumeRequest {
  keywords?: string[];
  jobDescription?: string;
  targetRole?: string;
  format?: 'pdf' | 'docx';
  fitToOnePage?: boolean; // New parameter for 1-page optimization
}

export interface GenerateResumeResponse {
  success: boolean;
  data?: {
    resumeData: any;
    generationTime: number;
    metadata?: {
      estimatedPages: number;
      estimatedLines: number;
      totalBulletPoints: number;
      removedItems: any[];
      breakdown: any;
      experienceCount: number;
      projectCount: number;
      skillCount: number;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

export const dynamic = 'force-dynamic';

/**
 * POST /api/generate-resume
 * Generate a customized resume based on user input
 */
export async function POST(request: NextRequest): Promise<NextResponse<GenerateResumeResponse>> {
  const startTime = Date.now();

  try {
    // Parse request body
    const body: GenerateResumeRequest = await request.json();
    const { keywords, jobDescription, targetRole, format = 'pdf', fitToOnePage = false } = body;

    // Validate input
    if (!keywords?.length && !jobDescription && !targetRole) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Please provide at least one of: keywords, job description, or target role',
          },
        },
        { status: 400 }
      );
    }

    console.log('📝 Resume generation request:', {
      keywords: keywords?.length || 0,
      hasJobDescription: !!jobDescription,
      targetRole,
      format,
      fitToOnePage,
    });

    // Fetch master data from MongoDB
    console.log('📚 Fetching master experience data...');
    const masterData = await getMasterExperienceData();

    console.log('📊 Master data loaded:', {
      experiences: masterData.all_experiences.length,
      skills: masterData.all_skills.length,
      projects: masterData.all_projects.length,
    });

    // Use optimized generation if fitToOnePage is enabled, otherwise use traditional method
    if (fitToOnePage) {
      // Use new optimization approach with scoring
      const result = await generateOptimizedResume(
        {
          keywords,
          jobDescription,
          targetRole,
        },
        masterData,
        true // fitToOnePage enabled
      );

      const generationTime = Date.now() - startTime;

      console.log('✅ Optimized resume generated successfully:', {
        generationTime: `${generationTime}ms`,
        selectedExperiences: result.resumeData.experiences.length,
        selectedProjects: result.resumeData.projects.length,
        selectedSkills: result.resumeData.skills.length,
        estimatedPages: result.metrics.estimatedPages.toFixed(2),
        removedItems: result.removedItems.length,
      });

      // Return response with metadata
      return NextResponse.json({
        success: true,
        data: {
          resumeData: result.resumeData,
          generationTime,
          metadata: {
            estimatedPages: result.metrics.estimatedPages,
            estimatedLines: result.metrics.estimatedLines,
            totalBulletPoints: result.metrics.totalBulletPoints,
            removedItems: result.removedItems,
            breakdown: result.metrics.breakdown,
            experienceCount: result.metrics.experienceCount,
            projectCount: result.metrics.projectCount,
            skillCount: result.metrics.skillCategoryCount,
          },
        },
      });
    } else {
      // Use traditional generation method
      const resumeData = await generateCustomizedResume(
        {
          keywords,
          jobDescription,
          targetRole,
        },
        masterData
      );

      const generationTime = Date.now() - startTime;

      console.log('✅ Resume generated successfully:', {
        generationTime: `${generationTime}ms`,
        selectedExperiences: resumeData.experiences.length,
        selectedProjects: resumeData.projects.length,
        selectedSkills: resumeData.skills.length,
      });

      // Return response
      return NextResponse.json({
        success: true,
        data: {
          resumeData,
          generationTime,
        },
      });
    }

  } catch (error) {
    const generationTime = Date.now() - startTime;
    console.error('❌ Resume generation failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate-resume
 * Returns API information
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'Resume Generator API',
    version: '1.0.0',
    endpoints: {
      'POST /api/generate-resume': 'Generate a customized resume',
      'GET /api/experiences': 'Get all resume experiences',
    },
  });
}
