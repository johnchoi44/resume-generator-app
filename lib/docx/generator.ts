import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { MarkdownModule } from './markdown-module';

export interface ResumeData {
  skills: Array<{
    category: string;
    items: string[];  // Array from BAML
  }>;
  experiences: Array<{
    position: string;
    company: string;
    location: string;
    date_from: string;
    date_to: string;
    description: string[];
  }>;
  projects: Array<{
    name: string;
    position?: string;
    date_from: string;
    date_to: string;
    description: string[];
  }>;
}

/**
 * Process resume data for template rendering
 * Converts skills array to pipe-separated string
 * Keeps markdown formatting in descriptions intact for MarkdownModule processing
 */
function processDataForTemplate(data: ResumeData): any {
  // Helper to strip markdown bold markers from skills
  const stripBold = (text: string) => text.replace(/\*\*/g, '');

  // Process skills to convert items array to pipe-separated string
  const processedSkills = data.skills?.map(skill => ({
    ...skill,
    items: Array.isArray(skill.items)
      ? skill.items.map(item => stripBold(item)).join(' | ')  // Strip ** and convert to " | " separated string
      : stripBold(skill.items)
  })) || [];

  return {
    ...data,
    skills: processedSkills,
    // Keep experiences and projects as-is - descriptions will be processed by MarkdownModule
  };
}

/**
 * Generate a DOCX resume using the Word template
 * This uses the same template and logic as the original generate.js
 */
export async function generateDocx(data: ResumeData): Promise<Buffer> {
  try {
    // Path to the working template
    const templatePath = path.join(
      process.cwd(),
      'templates',
      'Choi_Resume_template_working.docx'
    );

    console.log('📄 Loading Word template from:', templatePath);

    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    // Load template file
    const templateContent = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(templateContent);

    // Process data for template (skills conversion only, keep markdown in descriptions)
    const processedData = processDataForTemplate(data);

    // Initialize docxtemplater with custom delimiters and MarkdownModule
    const doc = new Docxtemplater(zip, {
      delimiters: {
        start: '<<',
        end: '>>'
      },
      paragraphLoop: true,  // Required for proper paragraph handling
      linebreaks: true,     // Required for line break handling
      modules: [new MarkdownModule()]  // Enable markdown formatting
    });

    console.log('✓ Template loaded successfully');
    console.log('✓ MarkdownModule attached for bold/italic formatting');

    // Render with processed data
    doc.render(processedData);

    console.log('✓ Template rendered with data');

    // Generate buffer
    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    });

    console.log('✓ DOCX buffer generated');

    return buffer;

  } catch (error) {
    console.error('❌ DOCX generation failed:', error);

    // Provide detailed error information
    if (error instanceof Error) {
      if ('properties' in error && (error as any).properties?.errors) {
        console.error('Template errors:', (error as any).properties.errors);
      }
    }

    throw error;
  }
}

/**
 * Get a filename for the resume
 */
export function getResumeFilename(targetRole?: string): string {
  const rolePart = targetRole
    ? `_${targetRole.replace(/\s+/g, '_')}`
    : '';
  const datePart = new Date().toISOString().split('T')[0];
  return `John_Choi_Resume${rolePart}_${datePart}.docx`;
}
