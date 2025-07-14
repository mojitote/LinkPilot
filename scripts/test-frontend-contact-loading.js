/**
 * Test script to simulate frontend contact loading logic
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function simulateFrontendContactLoading() {
  try {
    console.log('🧪 Simulating frontend contact loading logic...');
    
    // Simulate the frontend fetch call
    const response = await axios.get(`${API_BASE_URL}/api/contact`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📄 Raw API response:', JSON.stringify(response.data, null, 2));

    // Simulate the frontend parsing logic
    const data = response.data;
    
    if (data && data.success && data.data && data.data.contacts) {
      console.log('✅ Frontend parsing successful!');
      console.log(`📊 Found ${data.data.contacts.length} contacts`);
      
      // Simulate setting contacts in store
      const contacts = data.data.contacts;
      console.log('📋 Contacts that would be set in store:');
      contacts.forEach((contact, index) => {
        console.log(`  ${index + 1}. ${contact.name} (${contact.linkedin_id})`);
        console.log(`     Headline: ${contact.headline}`);
        console.log(`     Created: ${contact.createdAt}`);
      });
      
      return contacts;
    } else {
      console.log('❌ Frontend parsing failed - unexpected response format');
      console.log('Expected format: { success: true, data: { contacts: [...] } }');
      console.log('Actual format:', Object.keys(data || {}));
      return null;
    }
  } catch (error) {
    console.error('❌ Frontend simulation failed:');
    
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
    console.log('🚀 Starting frontend contact loading simulation...\n');
    
    const contacts = await simulateFrontendContactLoading();
    
    if (contacts) {
      console.log('\n🎉 Frontend contact loading simulation successful!');
      console.log('💡 This means the frontend should now display contacts after login.');
    } else {
      console.log('\n⚠️  Frontend contact loading simulation failed.');
      console.log('💡 Check the API response format and frontend parsing logic.');
    }
  } catch (error) {
    console.error('\n💥 Simulation failed:', error.message);
    
    if (error.response && error.response.status === 401) {
      console.log('\n🔐 Please make sure you are logged in before running this test.');
    }
    
    process.exit(1);
  }
}

// Run the simulation
main(); 