/**
 * Script to update the Word template to use fmt: prefix for description items
 * Changes <<.>> to <<fmt:.>> within description loops
 */

const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

const templatePath = path.join(__dirname, '..', 'templates', 'Choi_Resume_template_working.docx');
const backupPath = path.join(__dirname, '..', 'templates', 'Choi_Resume_template_working.backup.docx');

console.log('📄 Updating Word template for markdown formatting...\n');

try {
  // Create backup if it doesn't exist
  if (!fs.existsSync(backupPath)) {
    console.log('Creating backup:', backupPath);
    fs.copyFileSync(templatePath, backupPath);
    console.log('✓ Backup created\n');
  } else {
    console.log('✓ Backup already exists\n');
  }

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

  // Strategy: Find sections between <<#description>> and <</ description>>
  // and within those sections, change <<.>> to <<fmt:.>>

  let changes = 0;
  const originalContent = xmlContent;

  // Method 1: Change all encoded <<.>> to <<fmt:.>>
  // These are the placeholders that display the current item in a loop
  const dotPattern = /&lt;&lt;\.&gt;&gt;/g;
  xmlContent = xmlContent.replace(dotPattern, (match) => {
    changes++;
    return '&lt;&lt;fmt:.&gt;&gt;';
  });

  // Method 2: Also handle if the template uses actual << >> characters (though less common)
  const dotPatternRaw = /<<\.>>/g;
  xmlContent = xmlContent.replace(dotPatternRaw, (match) => {
    changes++;
    return '<<fmt:.>>';
  });

  console.log(`✓ Updated ${changes} description item placeholders\n`);

  if (changes === 0) {
    console.log('⚠️  Warning: No description item placeholders found.\n');
    throw new Error('No placeholders updated - template may have different structure');
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
  console.log(`  - Updated ${changes} description item placeholders`);
  console.log(`  - Changed: <<.>> → <<fmt:.>>`);
  console.log(`  - Template ready for markdown formatting (bold/italic)`);
  console.log('\n✅ Done! The template will now process ** for bold text.');

} catch (error) {
  console.error('❌ Error updating template:', error.message);

  // Don't restore backup automatically - user might want to inspect
  console.log('\n💡 If needed, restore backup with:');
  console.log('   cp templates/Choi_Resume_template_working.backup.docx templates/Choi_Resume_template_working.docx');

  process.exit(1);
}
