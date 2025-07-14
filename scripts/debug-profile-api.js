// debug-profile-api.js
// Script to debug the profile API issues

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectToDatabase } from '../lib/db.js';
import { UserService } from '../lib/services/userService.js';
import { UserRepository } from '../lib/repositories/userRepository.js';

async function debugProfileAPI() {
  console.log('🔍 Starting Profile API Debug...\n');

  try {
    // 1. Test database connection
    console.log('1️⃣ Testing database connection...');
    const { db } = await connectToDatabase();
    console.log('✅ Database connected successfully');
    console.log(`📊 Database name: ${db.databaseName}\n`);

    // 2. Test user repository methods
    console.log('2️⃣ Testing UserRepository methods...');
    
    const testUserId = 'test-user-123';
    
    // Check if user exists
    const userExists = await UserRepository.exists(testUserId);
    console.log(`📋 User exists (${testUserId}): ${userExists}`);
    
    if (userExists) {
      // Try to find user
      try {
        const user = await UserRepository.findById(testUserId);
        console.log('✅ User found:', user.name);
      } catch (error) {
        console.log('❌ Error finding user:', error.message);
      }
    }

    // 3. Test UserService createProfile method
    console.log('\n3️⃣ Testing UserService.createProfile...');
    
    const testProfileData = {
      name: 'Test User',
      headline: 'Software Engineer',
      about: 'Test user for debugging',
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
      // First, delete test user if exists
      try {
        await db.collection('users').deleteOne({ ownerId: testUserId });
        console.log('🗑️ Cleaned up existing test user');
      } catch (error) {
        // Ignore if user doesn't exist
      }

      // Try to create profile
      const result = await UserService.createProfile(testUserId, testProfileData);
      console.log('✅ Profile created successfully:', result.user.name);
      
      // Clean up
      await db.collection('users').deleteOne({ ownerId: testUserId });
      console.log('🗑️ Cleaned up test user');
      
    } catch (error) {
      console.log('❌ Error creating profile:', error.message);
      console.log('🔍 Error details:', {
        name: error.name,
        statusCode: error.statusCode,
        code: error.code,
        stack: error.stack
      });
    }

    // 4. Test database collections
    console.log('\n4️⃣ Checking database collections...');
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    // 5. Test users collection structure
    console.log('\n5️⃣ Testing users collection...');
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);

    if (userCount > 0) {
      const sampleUser = await usersCollection.findOne();
      console.log('📋 Sample user structure:');
      console.log(JSON.stringify(sampleUser, null, 2));
    }

    // 6. Test environment variables
    console.log('\n6️⃣ Checking environment variables...');
    console.log('🔧 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
    console.log('🔧 MONGODB_DB:', process.env.MONGODB_DB || 'linkpilot (default)');

  } catch (error) {
    console.error('❌ Debug failed:', error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  } finally {
    console.log('\n🏁 Debug completed');
    process.exit(0);
  }
}

debugProfileAPI(); 