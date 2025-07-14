// test-db.js
// Simple database connection test

import { connectToDatabase } from '../lib/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the project root
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('MongoDB DB:', process.env.MONGODB_DB || 'linkpilot');
    
    const { db } = await connectToDatabase();
    console.log('✅ Database connection successful');
    
    // Test collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
    // Test sample data
    const userProfile = await db.collection('user_profiles').findOne({
      ownerId: 'sample-user-123'
    });
    
    if (userProfile) {
      console.log('✅ Sample user profile found:', userProfile.name);
    } else {
      console.log('❌ Sample user profile not found');
    }
    
    const contacts = await db.collection('contacts').find({
      ownerId: 'sample-user-123'
    }).toArray();
    
    console.log('📞 Sample contacts found:', contacts.length);
    
    const messages = await db.collection('messages').find({
      ownerId: 'sample-user-123'
    }).toArray();
    
    console.log('💬 Sample messages found:', messages.length);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testDatabaseConnection(); 