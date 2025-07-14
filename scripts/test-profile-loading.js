/**
 * Test script for user profile loading functionality
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testProfileLoading() {
  try {
    console.log('🧪 Testing user profile loading...');
    
    // Test getting user profile
    console.log('📥 Fetching user profile from API...');
    
    const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Profile loaded successfully!');
    console.log('📊 Response status:', response.status);
    console.log('📄 Raw response:', JSON.stringify(response.data, null, 2));

    // Simulate frontend parsing logic
    const data = response.data;
    
    if (data && data.success && data.data) {
      console.log('✅ Frontend parsing successful!');
      console.log('📋 User profile data:');
      console.log(`  Name: ${data.data.name}`);
      console.log(`  LinkedIn URL: ${data.data.linkedinUrl}`);
      console.log(`  Headline: ${data.data.headline}`);
      console.log(`  Created: ${data.data.createdAt}`);
      
      return data.data;
    } else if (data && data.error && data.error.code === 'PROFILE_NOT_FOUND') {
      console.log('📝 No user profile found in database');
      return null;
    } else {
      console.log('❌ Unexpected response format');
      console.log('Expected: { success: true, data: {...} } or { error: { code: "PROFILE_NOT_FOUND" } }');
      return null;
    }
  } catch (error) {
    console.error('❌ Profile loading failed:');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('🔐 Authentication required - user not logged in');
      } else if (error.response.status === 404) {
        console.error('📝 Profile not found');
      }
    } else if (error.request) {
      console.error('🌐 Network error:', error.message);
    } else {
      console.error('💥 Error:', error.message);
    }
    
    throw error;
  }
}

async function testProfileCreation() {
  try {
    console.log('\n🧪 Testing user profile creation...');
    
    const profileData = {
      name: 'Test User',
      linkedinUrl: 'https://linkedin.com/in/testuser',
      headline: 'Software Engineer',
      about: 'Test user profile for debugging'
    };

    console.log('📝 Profile data to create:', profileData);
    
    const response = await axios.post(`${API_BASE_URL}/api/user/profile`, profileData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Profile created successfully!');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('❌ Profile creation failed:');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('💥 Error:', error.message);
    }
    
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting user profile tests...\n');
    
    // First try to load existing profile
    const existingProfile = await testProfileLoading();
    
    if (existingProfile) {
      console.log('\n🎉 User profile found and loaded successfully!');
      console.log('💡 The frontend should now display the user profile correctly.');
    } else {
      console.log('\n📝 No user profile found.');
      console.log('💡 This means the user needs to set up their profile.');
      
      // Optionally create a test profile
      console.log('\n🔧 Would you like to create a test profile? (uncomment the line below)');
      // await testProfileCreation();
    }
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    
    if (error.response && error.response.status === 401) {
      console.log('\n🔐 Please make sure you are logged in before running this test.');
      console.log('   You can log in by visiting the app in your browser first.');
    }
    
    process.exit(1);
  }
}

// Run the tests
main(); 