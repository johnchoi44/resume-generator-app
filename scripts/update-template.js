/**
 * Script to update the Word template to use fmt: prefix for description fields
 * This enables the MarkdownModule to process bold/italic formatting
 */

const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

const templatePath = path.join(__dirname, '..', 'templates', 'Choi_Resume_template_working.docx');
const backupPath = path.join(__dirname, '..', 'templates', 'Choi_Resume_template_working.backup.docx');

console.log('📄 Updating Word template for markdown formatting...\n');

try {
  // Create backup
  console.log('Creating backup:', backupPath);
  fs.copyFileSync(templatePath, backupPath);
  console.log('✓ Backup created\n');

  // Load template
  console.log('Loading template:', templatePath);
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  console.log('✓ Template loaded\n');

  // Get document.xml
  const docXml = zip.file('word/document.xml');
  if (!docXml) {
    throw new Error('Could not find word/document.xml in template');
  }

  let xmlContent = docXml.asText();
  console.log('✓ Extracted document.xml\n');

  // Update placeholders - change <<description>> to <<fmt:description>>
  // But only for description arrays in loops, not other fields
  let changes = 0;

  // Pattern: <<description>> or << description >> (with optional spaces)
  // We need to be careful to only change description placeholders, not other fields
  const originalContent = xmlContent;

  xmlContent = xmlContent.replace(/&lt;&lt;\s*description\s*&gt;&gt;/gi, (match) => {
    changes++;
    return match.replace('description', 'fmt:description');
  });

  // Also handle if the template uses actual << >> characters
  xmlContent = xmlContent.replace(/<<\s*description\s*>>/gi, (match) => {
    changes++;
    return match.replace('description', 'fmt:description');
  });

  console.log(`Found and updated ${changes} description placeholders\n`);

  if (changes === 0) {
    console.log('⚠️  Warning: No description placeholders found. Checking template structure...\n');

    // Search for any placeholders to help debug
    const placeholderMatches = xmlContent.match(/(&lt;&lt;|<<)[^>]+(>>|&gt;&gt;)/g);
    if (placeholderMatches) {
      console.log('Found these placeholders:', placeholderMatches.slice(0, 10));
    }
  }

  // Update the document.xml in the zip
  zip.file('word/document.xml', xmlContent);
  console.log('✓ Updated document.xml\n');

  // Generate new DOCX
  const newContent = zip.generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });

  // Write updated template
  fs.writeFileSync(templatePath, newContent);
  console.log('✓ Template updated successfully!\n');

  console.log('📋 Summary:');
  console.log(`  - Backup saved: ${path.basename(backupPath)}`);
  console.log(`  - Updated ${changes} description placeholders to use fmt: prefix`);
  console.log(`  - Template ready for markdown formatting`);

  if (changes === 0) {
    console.log('\n⚠️  Manual action required:');
    console.log('  Please open the template in Word and update description placeholders manually:');
    console.log('  Change: <<description>> → <<fmt:description>>');
  }

} catch (error) {
  console.error('❌ Error updating template:', error.message);

  // Restore backup if it exists
  if (fs.existsSync(backupPath)) {
    console.log('\nRestoring from backup...');
    fs.copyFileSync(backupPath, templatePath);
    console.log('✓ Template restored from backup');
  }

  process.exit(1);
}
