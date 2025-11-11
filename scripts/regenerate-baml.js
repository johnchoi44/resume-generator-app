#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Regenerating BAML client...');

try {
  // Remove existing baml_client directory
  if (fs.existsSync('baml_client')) {
    console.log('🗑️  Removing existing baml_client directory...');
    fs.rmSync('baml_client', { recursive: true, force: true });
  }

  // Generate BAML client
  console.log('⚡ Generating BAML client...');
  execSync('npx baml-cli generate', { stdio: 'inherit' });

  // Check for nested structure and fix it
  const nestedPath = path.join('baml_src', 'baml_client', 'baml_client');
  if (fs.existsSync(nestedPath)) {
    console.log('🔧 Fixing nested directory structure...');
    
    // Move files to correct location
    fs.renameSync(nestedPath, 'baml_client');
    
    // Clean up empty directory
    fs.rmSync(path.join('baml_src', 'baml_client'), { recursive: true, force: true });
  }

  console.log('✅ BAML client regenerated successfully!');
  console.log('📁 Client files are available in ./baml_client/');

} catch (error) {
  console.error('❌ Error regenerating BAML client:', error.message);
  process.exit(1);
} 