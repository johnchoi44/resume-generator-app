/**
 * Test script to verify markdown formatting in DOCX generation
 * Creates a test resume with bold text using ** symbols
 */

import fs from 'fs';
import path from 'path';
import { generateDocx, ResumeData } from '../lib/docx/generator';

async function testMarkdownFormatting() {
  console.log('🧪 Testing markdown formatting in DOCX generation...\n');

  try {
    // Create test data with markdown formatting
    const testData: ResumeData = {
      skills: [
        {
          category: 'Programming Languages',
          items: ['Python', 'JavaScript', 'TypeScript', 'Java']
        },
        {
          category: 'Frameworks & Tools',
          items: ['React', 'Node.js', 'Next.js', 'MongoDB']
        }
      ],
      experiences: [
        {
          position: 'Senior Software Engineer',
          company: 'Tech Company',
          location: 'San Francisco, CA',
          date_from: 'Jan 2022',
          date_to: 'Present',
          description: [
            'Led development of **high-performance** microservices using **Node.js** and **TypeScript**',
            'Implemented **CI/CD pipelines** resulting in **50% faster** deployment times',
            'Mentored **5 junior developers** on *best practices* and ***code quality***'
          ]
        },
        {
          position: 'Software Engineer',
          company: 'Startup Inc',
          location: 'Remote',
          date_from: 'Jun 2020',
          date_to: 'Dec 2021',
          description: [
            'Built **RESTful APIs** serving **1M+ requests** per day',
            'Optimized database queries improving performance by **80%**',
            'Collaborated with *product team* to define ***technical requirements***'
          ]
        }
      ],
      projects: [
        {
          name: 'AI Resume Generator',
          position: 'Full Stack Developer',
          date_from: 'Sep 2023',
          date_to: 'Present',
          description: [
            'Developed **AI-powered** resume generator using **BAML** and **Gemini API**',
            'Implemented **markdown-to-DOCX** conversion with *rich text formatting*',
            'Created ***reusable template system*** for document generation'
          ]
        }
      ]
    };

    console.log('📝 Test data prepared with markdown formatting:');
    console.log('  - Bold text: **text**');
    console.log('  - Italic text: *text*');
    console.log('  - Bold+Italic: ***text***\n');

    // Generate DOCX
    console.log('🔄 Generating DOCX...');
    const buffer = await generateDocx(testData);

    // Save test file
    const outputPath = path.join(__dirname, '..', 'test-output-markdown.docx');
    fs.writeFileSync(outputPath, buffer);

    console.log('\n✅ Success! Test DOCX generated');
    console.log(`📄 Output: ${outputPath}`);
    console.log('\n📋 Next steps:');
    console.log('  1. Open the generated DOCX file');
    console.log('  2. Verify that text within ** symbols appears in bold');
    console.log('  3. Check that text within * symbols appears in italic');
    console.log('  4. Confirm that *** creates bold+italic text');
    console.log('\n💡 If bold formatting doesn\'t appear:');
    console.log('  - Ensure the template was updated correctly');
    console.log('  - Check that MarkdownModule is properly integrated');
    console.log('  - Review console output for any errors');

  } catch (error) {
    console.error('\n❌ Test failed:', (error as Error).message);
    console.error('\nError details:', error);
    process.exit(1);
  }
}

testMarkdownFormatting();
