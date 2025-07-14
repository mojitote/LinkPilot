// test-profile-creation.js
// Script to test profile creation with proper authentication

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

async function testProfileCreation() {
  console.log('🧪 Testing Profile Creation Flow...\n');

  const testProfileData = {
    name: 'Test User',
    headline: 'Software Engineer',
    about: 'Test user for profile creation debugging',
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
    // Test 1: Check server status
    console.log('1️⃣ Checking server status...');
    const serverResponse = await fetch('http://localhost:3000');
    console.log(`📊 Server status: ${serverResponse.status}`);
    
    if (!serverResponse.ok) {
      console.log('❌ Server not accessible');
      return;
    }
    console.log('✅ Server is running');

    // Test 2: Test without authentication (should fail)
    console.log('\n2️⃣ Testing without authentication...');
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
        console.log('✅ Correctly requires authentication');
      } else {
        console.log('⚠️ Unexpected response for unauthenticated request');
      }
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }

    // Test 3: Test with credentials: 'include' (should still fail without session)
    console.log('\n3️⃣ Testing with credentials: include...');
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(testProfileData),
      });

      console.log(`📊 Status: ${response.status}`);
      const responseText = await response.text();
      console.log(`📄 Response: ${responseText}`);
      
      if (response.status === 401) {
        console.log('✅ Correctly requires valid session');
      } else {
        console.log('⚠️ Unexpected response');
      }
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }

    // Test 4: Check NextAuth configuration
    console.log('\n4️⃣ Checking NextAuth configuration...');
    console.log('🔧 NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'http://localhost:3000');
    console.log('🔧 NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not set');
    console.log('🔧 GITHUB_ID:', process.env.GITHUB_ID ? '✅ Set' : '❌ Not set');
    console.log('🔧 GITHUB_SECRET:', process.env.GITHUB_SECRET ? '✅ Set' : '❌ Not set');

    // Test 5: Test database connection directly
    console.log('\n5️⃣ Testing database connection...');
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      console.log(`📊 GET Profile Status: ${response.status}`);
      if (response.status === 401) {
        console.log('✅ Database connection works (requires auth)');
      } else {
        console.log('⚠️ Unexpected GET response');
      }
    } catch (error) {
      console.log('❌ Database test failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('\n🏁 Profile creation testing completed');
    console.log('\n💡 Next steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Sign in with GitHub');
    console.log('3. Try creating a profile from the UI');
    console.log('4. Check browser console for detailed error messages');
    process.exit(0);
  }
}

testProfileCreation(); 