#!/usr/bin/env node

/**
 * Test script using axios to avoid Node.js fetch issues
 */

import https from 'https';
import http from 'http';

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

console.log("API Call Simulation Test (with Node.js http module)");
console.log("=" .repeat(60));

console.log(`Test URL: ${testUrl}`);
console.log(`Request body:`, JSON.stringify(requestBody, null, 2));

// Test validation
const isValid = validateLinkedInUrl(requestBody.url);
console.log(`\nValidation result: ${isValid ? '✓ VALID' : '✗ INVALID'}`);

if (!isValid) {
  console.log("❌ This would cause a 400 Bad Request");
} else {
  console.log("✅ This should pass validation");
  
  // Simulate the actual API call to FastAPI using Node.js http module
  console.log("\nSimulating FastAPI call with Node.js http module...");
  
  const fastApiUrl = "http://localhost:8000/scrape";
  const fastApiBody = JSON.stringify({
    url: requestBody.url,
    type: "profile"
  });
  
  console.log(`FastAPI URL: ${fastApiUrl}`);
  console.log(`FastAPI body:`, fastApiBody);
  
  // Parse URL
  const url = new URL(fastApiUrl);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(fastApiBody)
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`\nFastAPI Response Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log(`FastAPI Response:`, JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log(`FastAPI Response (raw):`, data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error(`FastAPI Error:`, error.message);
  });
  
  req.write(fastApiBody);
  req.end();
} 