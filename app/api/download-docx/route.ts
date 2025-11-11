import { NextRequest, NextResponse } from 'next/server';
import { generateDocx, getResumeFilename } from '@/lib/docx/generator';

export const dynamic = 'force-dynamic';

/**
 * POST /api/download-docx
 * Generate and download a DOCX resume using the Word template
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await request.json();
    const { resumeData, targetRole } = body;

    if (!resumeData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Resume data is required',
          },
        },
        { status: 400 }
      );
    }

    console.log('📝 Generating DOCX resume...');

    // Generate DOCX using Word template
    const docxBuffer = await generateDocx(resumeData);

    console.log('✅ DOCX generated successfully');

    // Generate filename
    const filename = getResumeFilename(targetRole);

    // Return the DOCX file
    return new NextResponse(docxBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': docxBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ DOCX download failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: error instanceof Error ? error.message : 'Failed to generate DOCX',
        },
      },
      { status: 500 }
    );
  }
}
