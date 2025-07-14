#!/usr/bin/env node

/**
 * Test URL Validation
 * 
 * This script tests the LinkedIn URL validation pattern to ensure it works correctly
 */

// Test the validation pattern
const linkedinUrlPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[^\/\s]+(\/.*)?$/;

// Test URLs
const testUrls = [
  'https://www.linkedin.com/in/silasyuan/',
  'https://linkedin.com/in/silasyuan/',
  'http://www.linkedin.com/in/silasyuan/',
  'http://linkedin.com/in/silasyuan/',
  'https://www.linkedin.com/in/silasyuan',
  'https://linkedin.com/in/silasyuan',
  'https://www.linkedin.com/in/silasyuan/details/',
  'https://www.linkedin.com/in/silasyuan?trk=profile',
  'https://www.linkedin.com/company/test',
  'https://www.facebook.com/in/test',
  'linkedin.com/in/silasyuan',
  'www.linkedin.com/in/silasyuan',
  ''
];

console.log('🧪 Testing LinkedIn URL Validation...\n');

testUrls.forEach((url, index) => {
  const isValid = linkedinUrlPattern.test(url);
  console.log(`${index + 1}. "${url}"`);
  console.log(`   Valid: ${isValid ? '✅' : '❌'}`);
  console.log('');
});

// Test the validation function
function validateData(data, schema) {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    if (value !== undefined && value !== null) {
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
      }
      
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
      
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data
  };
}

const validationSchema = {
  url: {
    required: true,
    type: 'string',
    pattern: linkedinUrlPattern
  }
};

console.log('🔍 Testing validation function...\n');

const testData = [
  { url: 'https://www.linkedin.com/in/silasyuan/' },
  { url: 'https://linkedin.com/in/silasyuan/' },
  { url: 'https://www.linkedin.com/in/silasyuan' },
  { url: 'https://www.facebook.com/in/test' },
  { url: '' },
  { url: null },
  { url: undefined }
];

testData.forEach((data, index) => {
  console.log(`${index + 1}. Testing:`, data);
  const result = validateData(data, validationSchema);
  console.log(`   Valid: ${result.isValid ? '✅' : '❌'}`);
  if (!result.isValid) {
    console.log(`   Errors:`, result.errors);
  }
  console.log('');
});

console.log('💡 Recommendations:');
console.log('1. The pattern should accept URLs with trailing slashes');
console.log('2. The pattern should accept URLs with query parameters');
console.log('3. The pattern should be more flexible for LinkedIn profile URLs'); 