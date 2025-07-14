/**
 * Test script for contact loading functionality after login
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testContactLoading() {
  try {
    console.log('🧪 Testing contact loading after login...');
    
    // First, test getting contacts (should work if user is authenticated)
    console.log('📥 Fetching contacts from API...');
    
    const response = await axios.get(`${API_BASE_URL}/api/contact`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Contacts loaded successfully!');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', JSON.stringify(response.data, null, 2));

    // Check if contacts array exists and has data
    if (response.data && response.data.data && response.data.data.contacts) {
      const contacts = response.data.data.contacts;
      console.log(`📊 Found ${contacts.length} contacts in database`);
      
      if (contacts.length > 0) {
        console.log('📋 Contact details:');
        contacts.forEach((contact, index) => {
          console.log(`  ${index + 1}. ${contact.name} (${contact.linkedin_id})`);
        });
      }
    } else {
      console.log('📝 No contacts found in database');
    }

    return response.data;
  } catch (error) {
    console.error('❌ Contact loading failed:');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('🔐 Authentication required - user not logged in');
      }
    } else if (error.request) {
      console.error('🌐 Network error:', error.message);
    } else {
      console.error('💥 Error:', error.message);
    }
    
    throw error;
  }
}

async function testUserProfile() {
  try {
    console.log('\n🧪 Testing user profile loading...');
    
    const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ User profile loaded successfully!');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('❌ User profile loading failed:');
    
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
    console.log('🚀 Starting contact loading tests...\n');
    
    // Test user profile first
    await testUserProfile();
    
    // Test contact loading
    await testContactLoading();
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n💡 If you see contacts in the API response but not in the frontend,');
    console.log('   the issue is likely in the frontend loading logic.');
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