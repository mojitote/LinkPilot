// test-profile-api.js
// Script to test the actual profile API endpoint

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

async function testProfileAPI() {
  console.log('🧪 Testing Profile API Endpoints...\n');

  const testProfileData = {
    name: 'Test User',
    headline: 'Software Engineer',
    about: 'Test user for API debugging',
    avatarUrl: 'https://via.placeholder.com/150',
    linkedinUrl: 'https://linkedin.com/in/test-user',
    experience: {
      positions: ['Software Engineer'],
      institutions: ['Test Company'],
      dates: ['2020-Present']
    },
    education: {
      positions: ['Bachelor'],
      institutions: ['Test University'],
      dates: ['2016-2020']
    }
  };

  try {
    // Test 1: POST /api/user/profile (without auth)
    console.log('1️⃣ Testing POST /api/user/profile (without auth)...');
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testProfileData),
      });

      console.log(`📊 Status: ${response.status}`);
      console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log(`📄 Response: ${responseText}`);
      
      if (response.ok) {
        console.log('✅ POST request succeeded (unexpected - should require auth)');
      } else {
        console.log('✅ POST request failed as expected (auth required)');
      }
    } catch (error) {
      console.log('❌ POST request failed:', error.message);
    }

    // Test 2: GET /api/user/profile (without auth)
    console.log('\n2️⃣ Testing GET /api/user/profile (without auth)...');
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'GET',
      });

      console.log(`📊 Status: ${response.status}`);
      const responseText = await response.text();
      console.log(`📄 Response: ${responseText}`);
      
      if (response.ok) {
        console.log('✅ GET request succeeded (unexpected - should require auth)');
      } else {
        console.log('✅ GET request failed as expected (auth required)');
      }
    } catch (error) {
      console.log('❌ GET request failed:', error.message);
    }

    // Test 3: Check if server is running
    console.log('\n3️⃣ Testing server connectivity...');
    try {
      const response = await fetch('http://localhost:3000');
      console.log(`📊 Server status: ${response.status}`);
      if (response.ok) {
        console.log('✅ Server is running');
      } else {
        console.log('⚠️ Server responded but with non-200 status');
      }
    } catch (error) {
      console.log('❌ Server not accessible:', error.message);
      console.log('💡 Make sure to run: npm run dev');
    }

    // Test 4: Test with mock auth headers
    console.log('\n4️⃣ Testing with mock auth headers...');
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
        body: JSON.stringify(testProfileData),
      });

      console.log(`📊 Status: ${response.status}`);
      const responseText = await response.text();
      console.log(`📄 Response: ${responseText}`);
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('\n🏁 API testing completed');
    process.exit(0);
  }
}

testProfileAPI(); 