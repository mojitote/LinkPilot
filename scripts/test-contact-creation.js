/**
 * Test script for contact creation functionality
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testContactCreation() {
  try {
    console.log('🧪 Testing contact creation...');
    
    // Test data for contact creation
    const contactData = {
      name: 'John Doe',
      headline: 'Software Engineer at Tech Corp',
      linkedinId: 'johndoe123',
      about: 'Experienced software engineer with 5+ years in web development',
      linkedinUrl: 'https://linkedin.com/in/johndoe123'
    };

    console.log('📝 Contact data:', contactData);

    // Make API call to create contact
    const response = await axios.post(`${API_BASE_URL}/api/contact`, contactData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Contact created successfully!');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('❌ Contact creation failed:');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Data:', JSON.stringify(error.response.data, null, 2));
      console.error('🔍 Headers:', error.response.headers);
    } else if (error.request) {
      console.error('🌐 Network error:', error.message);
    } else {
      console.error('💥 Error:', error.message);
    }
    
    throw error;
  }
}

async function testGetContacts() {
  try {
    console.log('\n🧪 Testing contact retrieval...');
    
    const response = await axios.get(`${API_BASE_URL}/api/contact`, {
      withCredentials: true
    });

    console.log('✅ Contacts retrieved successfully!');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('❌ Contact retrieval failed:');
    
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
    console.log('🚀 Starting contact API tests...\n');
    
    // Test contact creation
    await testContactCreation();
    
    // Test contact retrieval
    await testGetContacts();
    
    console.log('\n🎉 All tests completed successfully!');
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
main(); 