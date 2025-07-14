#!/usr/bin/env node

/**
 * Test script to validate LinkedIn URL regex patterns
 */

// Test URLs
const testUrls = [
  "https://www.linkedin.com/in/silasyuan/",
  "https://www.linkedin.com/in/silasyuan",
  "https://www.linkedin.com/in/silasyuan/?originalSubdomain=us",
  "https://linkedin.com/in/silasyuan/",
  "https://www.linkedin.com/in/silasyuan/details/experience/",
  "https://www.linkedin.com/in/silasyuan/details/education/",
  "https://www.linkedin.com/company/microsoft/",
  "https://google.com/in/silasyuan/",
  "",
  "not-a-url"
];

// Old regex (too strict)
const oldRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[^\/\s]+(\/.*)?$/;

// New regex (more flexible)
const newRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[^\/\s?]+(\/?.*)?$/;

console.log("LinkedIn URL Regex Test");
console.log("=" .repeat(50));

console.log("\nTesting OLD regex (too strict):");
testUrls.forEach((url, index) => {
  const isValid = oldRegex.test(url);
  console.log(`${index + 1}. ${url} -> ${isValid ? '✓ VALID' : '✗ INVALID'}`);
});

console.log("\nTesting NEW regex (more flexible):");
testUrls.forEach((url, index) => {
  const isValid = newRegex.test(url);
  console.log(`${index + 1}. ${url} -> ${isValid ? '✓ VALID' : '✗ INVALID'}`);
});

console.log("\n" + "=" .repeat(50));
console.log("Test completed!"); 