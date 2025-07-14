#!/usr/bin/env node

/**
 * Test script to simulate actual API calls
 */

const testUrl = "https://www.linkedin.com/in/silasyuan/";

// Simulate the validation logic from middleware
function validateLinkedInUrl(url) {
  const pattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[^\/\s?]+(\/?.*)?$/;
  return pattern.test(url);
}

// Simulate the request body
const requestBody = {
  url: testUrl
};

console.log("API Call Simulation Test");
console.log("=" .repeat(50));

console.log(`Test URL: ${testUrl}`);
console.log(`Request body:`, JSON.stringify(requestBody, null, 2));

// Test validation
const isValid = validateLinkedInUrl(requestBody.url);
console.log(`\nValidation result: ${isValid ? '✓ VALID' : '✗ INVALID'}`);

if (!isValid) {
  console.log("❌ This would cause a 400 Bad Request");
} else {
  console.log("✅ This should pass validation");
  
  // Simulate the actual API call to FastAPI
  console.log("\nSimulating FastAPI call...");
  
  const fastApiUrl = "http://localhost:8000/scrape";
  const fastApiBody = {
    url: requestBody.url,
    type: "profile"
  };
  
  console.log(`FastAPI URL: ${fastApiUrl}`);
  console.log(`FastAPI body:`, JSON.stringify(fastApiBody, null, 2));
  
  // Make actual HTTP request
  fetch(fastApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fastApiBody)
  })
  .then(response => {
    console.log(`\nFastAPI Response Status: ${response.status}`);
    return response.json();
  })
  .then(data => {
    console.log(`FastAPI Response:`, JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error(`FastAPI Error:`, error.message);
  });
} 