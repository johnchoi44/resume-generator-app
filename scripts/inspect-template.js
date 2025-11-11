/**
 * Script to inspect the Word template structure
 * Helps identify all placeholders and their context
 */

const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

const templatePath = path.join(__dirname, '..', 'templates', 'Choi_Resume_template_working.docx');

console.log('📄 Inspecting Word template structure...\n');

try {
  // Load template
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);

  // Get document.xml
  const docXml = zip.file('word/document.xml');
  if (!docXml) {
    throw new Error('Could not find word/document.xml in template');
  }

  let xmlContent = docXml.asText();

  // Find all placeholders
  const placeholderRegex = /(&lt;&lt;|<<)([^>]+)(>>|&gt;&gt;)/g;
  const matches = [];
  let match;

  while ((match = placeholderRegex.exec(xmlContent)) !== null) {
    matches.push(match[2]);
  }

  console.log(`Found ${matches.length} placeholders:\n`);

  // Group by type
  const grouped = matches.reduce((acc, placeholder) => {
    const trimmed = placeholder.trim();
    if (!acc[trimmed]) {
      acc[trimmed] = 0;
    }
    acc[trimmed]++;
    return acc;
  }, {});

  Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .forEach(([placeholder, count]) => {
      console.log(`  ${placeholder.padEnd(30)} (${count} occurrences)`);
    });

  // Search specifically for description-related content
  console.log('\n\n🔍 Searching for description-related content:\n');

  if (xmlContent.includes('description')) {
    console.log('✓ Found "description" in template\n');

    // Find context around description
    const descRegex = /(.{100}description.{100})/gi;
    const descMatches = xmlContent.match(descRegex);

    if (descMatches) {
      console.log('Context samples:');
      descMatches.slice(0, 3).forEach((context, i) => {
        console.log(`\n${i + 1}. ${context.substring(0, 200)}...`);
      });
    }
  } else {
    console.log('✗ "description" not found as plain text\n');
    console.log('Checking for encoded versions...');

    // Check for various encodings
    if (xmlContent.includes('&lt;description&gt;')) {
      console.log('✓ Found as HTML entity: &lt;description&gt;');
    }
  }

  // Check for loop structures
  console.log('\n\n🔄 Loop structures:');
  const loopStarts = matches.filter(p => p.startsWith('#'));
  const loopEnds = matches.filter(p => p.startsWith('/'));

  console.log(`  Loop starts: ${loopStarts.join(', ')}`);
  console.log(`  Loop ends: ${loopEnds.join(', ')}`);

} catch (error) {
  console.error('❌ Error inspecting template:', error.message);
  process.exit(1);
}
