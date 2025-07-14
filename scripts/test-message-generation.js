/**
 * Test Message Generation API
 * Tests the complete message generation flow with authentication
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// Test data
const testContact = {
  name: 'John Doe',
  linkedin_id: 'john-doe-123',
  headline: 'Software Engineer at Tech Corp',
  about: 'Passionate about building scalable web applications',
  experience: {
    positions: [
      {
        company: 'Tech Corp',
        title: 'Software Engineer',
        duration: '2 years'
      }
    ]
  },
  education: {
    institutions: ['Stanford University']
  }
};

const testUserProfile = {
  name: 'Jane Smith',
  headline: 'Full Stack Developer',
  about: 'Experienced developer with expertise in React and Node.js',
  experience: {
    positions: [
      {
        company: 'Tech Corp',
        title: 'Full Stack Developer',
        duration: '3 years'
      }
    ]
  },
  education: {
    institutions: ['Stanford University']
  }
};

const testPrompt = 'I would like to connect and discuss potential collaboration opportunities';

async function testMessageGeneration() {
  console.log('🧪 Testing Message Generation API...\n');

  try {
    // Test 1: Generate message without authentication (should fail)
    console.log('1. Testing without authentication...');
    const response1 = await fetch(`${BASE_URL}/api/message/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: testContact,
        prompt: testPrompt,
        userProfile: testUserProfile
      })
    });

    console.log(`   Status: ${response1.status}`);
    const data1 = await response1.json();
    console.log(`   Response: ${JSON.stringify(data1, null, 2)}\n`);

    // Test 2: Generate message with authentication (should work)
    console.log('2. Testing with authentication...');
    const response2 = await fetch(`${BASE_URL}/api/message/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=test-session-token' // Mock session
      },
      body: JSON.stringify({
        contact: testContact,
        prompt: testPrompt,
        userProfile: testUserProfile
      })
    });

    console.log(`   Status: ${response2.status}`);
    const data2 = await response2.json();
    console.log(`   Response: ${JSON.stringify(data2, null, 2)}\n`);

    // Test 3: Test with different prompt types
    console.log('3. Testing different prompt types...');
    const prompts = [
      'Friendly',
      'Professional', 
      'Short & Sweet',
      'Mutual Interests'
    ];

    for (const prompt of prompts) {
      const response = await fetch(`${BASE_URL}/api/message/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'next-auth.session-token=test-session-token'
        },
        body: JSON.stringify({
          contact: testContact,
          prompt: prompt,
          userProfile: testUserProfile
        })
      });

      const data = await response.json();
      console.log(`   Prompt: "${prompt}"`);
      console.log(`   Status: ${response.status}`);
      if (data.success) {
        console.log(`   Generated: "${data.data.message}"`);
      } else {
        console.log(`   Error: ${data.error.message}`);
      }
      console.log('');
    }

    // Test 4: Test validation errors
    console.log('4. Testing validation errors...');
    
    // Missing contact
    const response4a = await fetch(`${BASE_URL}/api/message/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=test-session-token'
      },
      body: JSON.stringify({
        prompt: testPrompt,
        userProfile: testUserProfile
      })
    });

    console.log(`   Missing contact - Status: ${response4a.status}`);
    const data4a = await response4a.json();
    console.log(`   Response: ${JSON.stringify(data4a, null, 2)}\n`);

    // Missing prompt
    const response4b = await fetch(`${BASE_URL}/api/message/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=test-session-token'
      },
      body: JSON.stringify({
        contact: testContact,
        userProfile: testUserProfile
      })
    });

    console.log(`   Missing prompt - Status: ${response4b.status}`);
    const data4b = await response4b.json();
    console.log(`   Response: ${JSON.stringify(data4b, null, 2)}\n`);

    console.log('✅ Message generation tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMessageGeneration(); 