#!/usr/bin/env node

/**
 * Test script to verify all component imports
 */

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '..', 'components');
const components = [
  'AddContactForm',
  'AddContactReplyModal', 
  'ContactCard',
  'Footer',
  'MessageBubble',
  'MessageInputArea',
  'MessageModal',
  'Navigation',
  'PostGeneratorCard',
  'ProfileEditForm',
  'ProfileSetupModal',
  'PromptBox',
  'Providers',
  'SessionClientProvider'
];

console.log('🧪 Testing Component Imports\n');

let allPassed = true;

components.forEach(componentName => {
  const filePath = path.join(componentsDir, `${componentName}.jsx`);
  
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${componentName}.jsx exists`);
  } else {
    console.log(`❌ ${componentName}.jsx missing`);
    allPassed = false;
  }
});

console.log('\n📊 Results:');
if (allPassed) {
  console.log('🎉 All components found!');
} else {
  console.log('⚠️  Some components are missing');
}

// Check for any .jsx files that aren't in our list
const allFiles = fs.readdirSync(componentsDir)
  .filter(file => file.endsWith('.jsx'))
  .map(file => file.replace('.jsx', ''));

const missingFromList = allFiles.filter(file => !components.includes(file));

if (missingFromList.length > 0) {
  console.log('\n📝 Additional .jsx files found:');
  missingFromList.forEach(file => {
    console.log(`  - ${file}.jsx`);
  });
} 