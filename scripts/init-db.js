// 数据库初始化脚本
// 运行: node scripts/init-db.js

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'linkpilot';

if (!uri) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function initDatabase() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
    
    // 创建集合
    const collections = ['user_profiles', 'contacts', 'messages'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✓ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`- Collection already exists: ${collectionName}`);
        } else {
          console.error(`✗ Error creating collection ${collectionName}:`, error.message);
        }
      }
    }
    
    // 创建索引
    console.log('\nCreating indexes...');
    
    // user_profiles 索引
    try {
      await db.collection('user_profiles').createIndex({ "ownerId": 1 });
      console.log('✓ Created index on user_profiles.ownerId');
    } catch (error) {
      console.error('✗ Error creating user_profiles index:', error.message);
    }
    
    // contacts 索引
    try {
      await db.collection('contacts').createIndex({ "ownerId": 1 });
      console.log('✓ Created index on contacts.ownerId');
      
      await db.collection('contacts').createIndex({ "ownerId": 1, "linkedin_id": 1 });
      console.log('✓ Created compound index on contacts.ownerId + linkedin_id');
    } catch (error) {
      console.error('✗ Error creating contacts indexes:', error.message);
    }
    
    // messages 索引
    try {
      await db.collection('messages').createIndex({ "ownerId": 1, "contactId": 1 });
      console.log('✓ Created compound index on messages.ownerId + contactId');
      
      await db.collection('messages').createIndex({ "createdAt": 1 });
      console.log('✓ Created index on messages.createdAt');
    } catch (error) {
      console.error('✗ Error creating messages indexes:', error.message);
    }
    
    // 插入示例数据（可选）
    const insertSampleData = process.argv.includes('--sample-data');
    
    if (insertSampleData) {
      console.log('\nInserting sample data...');
      
      // 示例用户资料
      const sampleUserProfile = {
        ownerId: 'sample-user-123',
        linkedin_id: 'sample-linkedin-123',
        name: 'Sample User',
        headline: 'Software Engineer at Sample Corp',
        education: {
          positions: ['BSc Computer Science'],
          institutions: ['Sample University'],
          dates: ['2018-2022']
        },
        experience: {
          positions: ['Software Engineer', 'Junior Developer'],
          institutions: ['Sample Corp', 'Startup Inc'],
          dates: ['2022-Present', '2021-2022']
        },
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        linkedinUrl: 'https://linkedin.com/in/sample-user',
        updatedAt: new Date()
      };
      
      try {
        await db.collection('user_profiles').insertOne(sampleUserProfile);
        console.log('✓ Inserted sample user profile');
      } catch (error) {
        console.error('✗ Error inserting sample user profile:', error.message);
      }
      
      // 示例联系人
      const sampleContact = {
        ownerId: 'sample-user-123',
        linkedin_id: 'sample-contact-456',
        name: 'Sample Contact',
        headline: 'Product Manager at Tech Corp',
        education: {
          positions: ['MBA', 'BSc Business'],
          institutions: ['Business School', 'University'],
          dates: ['2020-2022', '2016-2020']
        },
        experience: {
          positions: ['Product Manager', 'Business Analyst'],
          institutions: ['Tech Corp', 'Analytics Inc'],
          dates: ['2022-Present', '2020-2022']
        },
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        linkedinUrl: 'https://linkedin.com/in/sample-contact',
        createdAt: new Date()
      };
      
      try {
        await db.collection('contacts').insertOne(sampleContact);
        console.log('✓ Inserted sample contact');
      } catch (error) {
        console.error('✗ Error inserting sample contact:', error.message);
      }
      
      // 示例消息
      const sampleMessages = [
        {
          contactId: 'sample-contact-456',
          ownerId: 'sample-user-123',
          role: 'ai',
          content: 'Hi Sample Contact! I noticed your impressive work at Tech Corp. Would love to connect and learn from your insights!',
          createdAt: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
          contactId: 'sample-contact-456',
          ownerId: 'sample-user-123',
          role: 'user',
          content: 'Thanks! I\'d be happy to connect.',
          createdAt: new Date()
        }
      ];
      
      try {
        await db.collection('messages').insertMany(sampleMessages);
        console.log('✓ Inserted sample messages');
      } catch (error) {
        console.error('✗ Error inserting sample messages:', error.message);
      }
    }
    
    console.log('\n✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
  }
}

// 运行初始化
initDatabase(); 