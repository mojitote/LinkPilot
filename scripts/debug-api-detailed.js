// debug-api-detailed.js
// Detailed API debugging script

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

async function debugAPIDetailed() {
  console.log('🔍 Detailed API Debug...\n');

  const testProfileData = {
    name: 'Test User',
    headline: 'Software Engineer',
    about: 'Test user for detailed debugging',
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
    // Test 1: Check server and database
    console.log('1️⃣ Testing server and database connection...');
    const serverResponse = await fetch('http://localhost:3000');
    console.log(`📊 Server status: ${serverResponse.status}`);
    
    if (!serverResponse.ok) {
      console.log('❌ Server not accessible');
      return;
    }
    console.log('✅ Server is running');

    // Test 2: Test database directly
    console.log('\n2️⃣ Testing database connection directly...');
    try {
      const { connectToDatabase } = await import('../lib/db.js');
      const { db } = await connectToDatabase();
      console.log('✅ Database connected successfully');
      
      // Check collections
      const collections = await db.listCollections().toArray();
      console.log('📚 Collections:', collections.map(c => c.name));
      
      // Check users collection
      const userCount = await db.collection('users').countDocuments();
      console.log(`📊 Users in database: ${userCount}`);
      
    } catch (error) {
      console.log('❌ Database connection failed:', error.message);
      return;
    }

    // Test 3: Test API without auth (should fail)
    console.log('\n3️⃣ Testing API without authentication...');
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

    // Test 4: Test with credentials but no session
    console.log('\n4️⃣ Testing with credentials but no session...');
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

    // Test 5: Check environment variables
    console.log('\n5️⃣ Checking environment variables...');
    console.log('🔧 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
    console.log('🔧 NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'http://localhost:3000');
    console.log('🔧 NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not set');
    console.log('🔧 GITHUB_ID:', process.env.GITHUB_ID ? '✅ Set' : '❌ Not set');
    console.log('🔧 GITHUB_SECRET:', process.env.GITHUB_SECRET ? '✅ Set' : '❌ Not set');

    // Test 6: Test user service directly
    console.log('\n6️⃣ Testing UserService directly...');
    try {
      const { UserService } = await import('../lib/services/userService.js');
      const { UserRepository } = await import('../lib/repositories/userRepository.js');
      
      const testUserId = 'test-user-direct-123';
      
      // Clean up first
      try {
        await UserRepository.delete(testUserId);
        console.log('🗑️ Cleaned up existing test user');
      } catch (error) {
        // Ignore if user doesn't exist
      }
      
      // Test creation
      const result = await UserService.createProfile(testUserId, testProfileData);
      console.log('✅ UserService.createProfile succeeded:', result.user.name);
      
      // Clean up
      await UserRepository.delete(testUserId);
      console.log('🗑️ Cleaned up test user');
      
    } catch (error) {
      console.log('❌ UserService test failed:', error.message);
      console.log('🔍 Error details:', {
        name: error.name,
        statusCode: error.statusCode,
        code: error.code,
        stack: error.stack
      });
    }

  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    console.log('\n🏁 Detailed debug completed');
    console.log('\n💡 Next steps:');
    console.log('1. Check the server logs for detailed error messages');
    console.log('2. Open browser console to see client-side errors');
    console.log('3. Try the profile creation from the UI again');
    process.exit(0);
  }
}

debugAPIDetailed(); 