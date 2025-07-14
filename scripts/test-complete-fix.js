/**
 * Comprehensive test script to verify profile and contact loading fixes
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testCompleteFix() {
  try {
    console.log('🧪 Testing complete fix for profile and contact loading...\n');
    
    // Test 1: User Profile Loading
    console.log('📋 Test 1: User Profile Loading');
    console.log('=' .repeat(50));
    
    try {
      const profileResponse = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('✅ Profile API call successful');
      console.log('📊 Status:', profileResponse.status);
      
      const profileData = profileResponse.data;
      console.log('📄 Response format:', Object.keys(profileData));
      
      if (profileData.success && profileData.data) {
        console.log('✅ Profile found in database');
        console.log(`📋 User: ${profileData.data.name}`);
        console.log(`🔗 LinkedIn: ${profileData.data.linkedinUrl}`);
      } else if (profileData.error && profileData.error.code === 'PROFILE_NOT_FOUND') {
        console.log('📝 No profile found (expected for new users)');
      } else {
        console.log('❌ Unexpected profile response format');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('📝 Profile not found (404)');
      } else {
        console.log('❌ Profile API error:', error.message);
      }
    }
    
    // Test 2: Contact Loading
    console.log('\n📋 Test 2: Contact Loading');
    console.log('=' .repeat(50));
    
    try {
      const contactResponse = await axios.get(`${API_BASE_URL}/api/contact`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('✅ Contact API call successful');
      console.log('📊 Status:', contactResponse.status);
      
      const contactData = contactResponse.data;
      console.log('📄 Response format:', Object.keys(contactData));
      
      if (contactData.success && contactData.data && contactData.data.contacts) {
        console.log(`✅ Found ${contactData.data.contacts.length} contacts in database`);
        
        if (contactData.data.contacts.length > 0) {
          console.log('📋 Contact list:');
          contactData.data.contacts.forEach((contact, index) => {
            console.log(`  ${index + 1}. ${contact.name} (${contact.linkedin_id})`);
          });
        }
      } else {
        console.log('📝 No contacts found in database');
      }
    } catch (error) {
      console.log('❌ Contact API error:', error.message);
    }
    
    // Test 3: Frontend Parsing Simulation
    console.log('\n📋 Test 3: Frontend Parsing Simulation');
    console.log('=' .repeat(50));
    
    // Simulate profile parsing
    try {
      const profileRes = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      const profileData = profileRes.data;
      let profileLoaded = false;
      
      if (profileData && profileData.success && profileData.data) {
        console.log('✅ Frontend would set user profile');
        profileLoaded = true;
      } else if (profileData && profileData.error && profileData.error.code === 'PROFILE_NOT_FOUND') {
        console.log('📝 Frontend would show profile setup modal');
      } else {
        console.log('❌ Frontend would show unexpected response error');
      }
      
      // Simulate contact parsing
      const contactRes = await axios.get(`${API_BASE_URL}/api/contact`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      const contactData = contactRes.data;
      
      if (contactData && contactData.success && contactData.data && contactData.data.contacts) {
        console.log(`✅ Frontend would set ${contactData.data.contacts.length} contacts`);
      } else {
        console.log('📝 Frontend would have no contacts to set');
      }
      
      // Summary
      console.log('\n📋 Summary');
      console.log('=' .repeat(50));
      
      if (profileLoaded) {
        console.log('✅ User profile: LOADED');
      } else {
        console.log('📝 User profile: NEEDS SETUP');
      }
      
      if (contactData && contactData.success && contactData.data && contactData.data.contacts && contactData.data.contacts.length > 0) {
        console.log(`✅ Contacts: ${contactData.data.contacts.length} LOADED`);
      } else {
        console.log('📝 Contacts: NONE FOUND');
      }
      
      console.log('\n💡 Expected behavior after fix:');
      console.log('   - If profile is loaded: No setup modal should appear');
      console.log('   - If contacts are loaded: They should appear in the sidebar');
      console.log('   - If neither: Setup modal should appear for profile');
      
    } catch (error) {
      console.log('❌ Frontend simulation failed:', error.message);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    
    if (error.response && error.response.status === 401) {
      console.log('\n🔐 Please make sure you are logged in before running this test.');
    }
    
    process.exit(1);
  }
}

async function main() {
  try {
    await testCompleteFix();
    console.log('\n🎉 Complete fix test finished!');
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run the test
main(); 