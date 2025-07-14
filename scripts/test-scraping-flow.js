#!/usr/bin/env node

/**
 * Test script to verify scraping flow with manual input fallback
 */

const testUrls = [
  'https://linkedin.com/in/silasyuan', // This should work
  'https://linkedin.com/in/nonexistent-profile-12345', // This should fail
  'https://linkedin.com/in/test-user-456', // This should fail
];

async function testScrapingFlow() {
  console.log('🧪 Testing Scraping Flow with Manual Input Fallback\n');
  
  for (const url of testUrls) {
    console.log(`\n📋 Testing URL: ${url}`);
    console.log('─'.repeat(50));
    
    try {
      const response = await fetch('http://localhost:3000/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if needed
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({ url })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ API Response Status:', response.status);
        console.log('📊 Response Data:');
        console.log('  - Success:', result.success);
        console.log('  - Message:', result.message);
        console.log('  - Partial Data:', result.data?.partial || false);
        console.log('  - Error:', result.data?.error || 'None');
        console.log('  - LinkedIn ID:', result.data?.linkedinId || 'None');
        console.log('  - Name:', result.data?.name || 'Empty');
        console.log('  - Headline:', result.data?.headline || 'Empty');
        
        if (result.data?.partial) {
          console.log('⚠️  Partial data returned - user should see manual input form');
        } else {
          console.log('🎉 Full data scraped successfully');
        }
      } else {
        console.log('❌ API Error:', response.status);
        console.log('Error Details:', result);
      }
      
    } catch (error) {
      console.log('❌ Network Error:', error.message);
    }
  }
  
  console.log('\n\n🎯 Test Summary:');
  console.log('1. Valid profiles should return full data');
  console.log('2. Invalid/non-existent profiles should return partial data with error');
  console.log('3. Frontend should show manual input form for partial data');
  console.log('4. Users can always choose to input data manually');
}

// Run the test
testScrapingFlow().catch(console.error); 