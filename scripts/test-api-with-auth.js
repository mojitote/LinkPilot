// test-api-with-auth.js
// Script to test API with authentication

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

async function testAPIWithAuth() {
  console.log('🧪 Testing API with Authentication...\n');

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
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server connectivity...');
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
      return;
    }

    // Test 2: Test GET /api/user/profile (should require auth)
    console.log('\n2️⃣ Testing GET /api/user/profile (should require auth)...');
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📊 Status: ${response.status}`);
      const responseText = await response.text();
      console.log(`📄 Response: ${responseText}`);
      
      if (response.status === 401) {
        console.log('✅ GET request correctly requires authentication');
      } else {
        console.log('⚠️ Unexpected response for unauthenticated request');
      }
    } catch (error) {
      console.log('❌ GET request failed:', error.message);
    }

    // Test 3: Test POST /api/user/profile (should require auth)
    console.log('\n3️⃣ Testing POST /api/user/profile (should require auth)...');
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testProfileData),
      });

      console.log(`📊 Status: ${response.status}`);
      const responseText = await response.text();
      console.log(`📄 Response: ${responseText}`);
      
      if (response.status === 401) {
        console.log('✅ POST request correctly requires authentication');
      } else {
        console.log('⚠️ Unexpected response for unauthenticated request');
      }
    } catch (error) {
      console.log('❌ POST request failed:', error.message);
    }

    // Test 4: Test with mock session cookie
    console.log('\n4️⃣ Testing with mock session cookie...');
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'next-auth.session-token=mock-token',
        },
        body: JSON.stringify(testProfileData),
      });

      console.log(`📊 Status: ${response.status}`);
      const responseText = await response.text();
      console.log(`📄 Response: ${responseText}`);
    } catch (error) {
      console.log('❌ Request with mock cookie failed:', error.message);
    }

    // Test 5: Check NextAuth configuration
    console.log('\n5️⃣ Checking NextAuth configuration...');
    console.log('🔧 GITHUB_ID:', process.env.GITHUB_ID ? '✅ Set' : '❌ Not set');
    console.log('🔧 GITHUB_SECRET:', process.env.GITHUB_SECRET ? '✅ Set' : '❌ Not set');
    console.log('🔧 NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not set');
    console.log('🔧 NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'http://localhost:3000');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('\n🏁 API testing completed');
    console.log('\n💡 To test with real authentication:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Sign in with GitHub');
    console.log('3. Then try the profile creation from the UI');
    process.exit(0);
  }
}

testAPIWithAuth(); 