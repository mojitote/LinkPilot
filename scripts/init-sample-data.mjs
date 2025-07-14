// init-sample-data.mjs
// Script to initialize sample data with correct message roles

import { connectToDatabase } from '../lib/db.js';

async function initSampleData() {
  try {
    const { db } = await connectToDatabase();
    
    // Clear existing sample data
    await db.collection('user_profiles').deleteMany({ ownerId: 'sample-user-123' });
    await db.collection('contacts').deleteMany({ ownerId: 'sample-user-123' });
    await db.collection('messages').deleteMany({ ownerId: 'sample-user-123' });

    // Create sample user profile
    const userProfile = {
      ownerId: 'sample-user-123',
      linkedin_id: 'sample-user',
      name: 'John Doe',
      headline: 'Software Engineer at Tech Corp',
      education: {
        positions: ['BSc Computer Science'],
        institutions: ['University of Technology'],
        dates: ['2018-2022']
      },
      experience: {
        positions: ['Software Engineer', 'Junior Developer'],
        institutions: ['Tech Corp', 'Startup Inc'],
        dates: ['2022-Present', '2020-2022']
      },
      avatarUrl: 'https://via.placeholder.com/150',
      linkedinUrl: 'https://linkedin.com/in/sample-user',
      updatedAt: new Date()
    };

    await db.collection('user_profiles').insertOne(userProfile);

    // Create sample contacts
    const contacts = [
      {
        ownerId: 'sample-user-123',
        linkedin_id: 'contact-1',
        name: 'Sarah Johnson',
        headline: 'Product Manager at Innovation Labs',
        education: {
          positions: ['MBA Business Administration'],
          institutions: ['Business School'],
          dates: ['2019-2021']
        },
        experience: {
          positions: ['Product Manager', 'Business Analyst'],
          institutions: ['Innovation Labs', 'Consulting Co'],
          dates: ['2021-Present', '2017-2021']
        },
        avatarUrl: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=SJ',
        linkedinUrl: 'https://linkedin.com/in/sarah-johnson',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 'sample-user-123',
        linkedin_id: 'contact-2',
        name: 'Mike Chen',
        headline: 'Senior Developer at Big Tech',
        education: {
          positions: ['MS Computer Science'],
          institutions: ['Engineering University'],
          dates: ['2016-2018']
        },
        experience: {
          positions: ['Senior Developer', 'Software Engineer'],
          institutions: ['Big Tech', 'Medium Corp'],
          dates: ['2018-Present', '2015-2018']
        },
        avatarUrl: 'https://via.placeholder.com/150/059669/FFFFFF?text=MC',
        linkedinUrl: 'https://linkedin.com/in/mike-chen',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('contacts').insertMany(contacts);

    // Create sample messages with correct roles
    const messages = [
      // Contact 1 conversation
      {
        ownerId: 'sample-user-123',
        contactId: 'contact-1',
        role: 'user', // My reachout message
        content: "Hi Sarah! I came across your profile and was impressed by your work at Innovation Labs. I'm also passionate about product development and would love to connect and learn from your experience.",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        ownerId: 'sample-user-123',
        contactId: 'contact-1',
        role: 'contact', // Sarah's reply
        content: "Hi John! Thanks for reaching out. I'd be happy to connect and share insights about product development. What specific areas are you most interested in?",
        createdAt: new Date(Date.now() - 82800000), // 23 hours ago
        updatedAt: new Date(Date.now() - 82800000)
      },
      {
        ownerId: 'sample-user-123',
        contactId: 'contact-1',
        role: 'user', // My follow-up
        content: "Thanks Sarah! I'm particularly interested in user research and data-driven decision making. Would you be open to a quick coffee chat sometime next week?",
        createdAt: new Date(Date.now() - 79200000), // 22 hours ago
        updatedAt: new Date(Date.now() - 79200000)
      },
      
      // Contact 2 conversation
      {
        ownerId: 'sample-user-123',
        contactId: 'contact-2',
        role: 'user', // My reachout message
        content: "Hi Mike! I noticed we have similar backgrounds in software development. I'm currently working on some interesting projects and would love to connect and exchange ideas about modern development practices.",
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date(Date.now() - 172800000)
      },
      {
        ownerId: 'sample-user-123',
        contactId: 'contact-2',
        role: 'contact', // Mike's reply
        content: "Hey John! Absolutely, I'm always up for connecting with fellow developers. What kind of projects are you working on? I'm particularly interested in cloud architecture these days.",
        createdAt: new Date(Date.now() - 169200000), // 1.9 days ago
        updatedAt: new Date(Date.now() - 169200000)
      }
    ];

    await db.collection('messages').insertMany(messages);

    console.log('✅ Sample data initialized successfully!');
    console.log(`📊 Created:`);
    console.log(`   - 1 user profile`);
    console.log(`   - ${contacts.length} contacts`);
    console.log(`   - ${messages.length} messages`);
    
  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
  } finally {
    process.exit(0);
  }
}

initSampleData(); 