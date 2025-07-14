/**
 * OpenAI API Test Script
 * Tests the OpenAI API integration for message generation
 */

import dotenv from 'dotenv';
import path from 'path';
import { AIClient } from '../lib/utils/aiClient.js';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testOpenAIAPI() {
  console.log('🧪 Testing OpenAI API Integration...\n');

  // Check service status
  console.log('1. Checking AI service status...');
  const status = AIClient.getServiceStatus();
  console.log('   Status:', JSON.stringify(status, null, 2));
  console.log('');

  if (!status.configured) {
    console.error('❌ AI service not properly configured');
    console.log('💡 Please add your OpenAI API key to .env.local:');
    console.log('   OPENAI_API_KEY=your_openai_api_key_here');
    return;
  }

  // Test basic connection
  console.log('2. Testing basic connection...');
  const connectionTest = await AIClient.testConnection();
  console.log('   Result:', JSON.stringify(connectionTest, null, 2));
  console.log('');

  if (!connectionTest.success) {
    console.error('❌ Connection test failed');
    return;
  }

  // Test LinkedIn message generation
  console.log('3. Testing LinkedIn message generation...');
  
  const testCases = [
    {
      name: 'Professional connection',
      prompt: `Generate a LinkedIn connection message for John Doe who works at Google as a software engineer. Keep it professional and under 300 characters.`
    },
    {
      name: 'Shared background',
      prompt: `Generate a LinkedIn message for Sarah who works at Microsoft. We both attended Stanford University. Keep it friendly and under 300 characters.`
    },
    {
      name: 'Industry connection',
      prompt: `Generate a LinkedIn message for Alex who is a marketing manager at a tech startup. I want to discuss potential collaboration. Keep it professional and under 300 characters.`
    }
  ];

  for (const testCase of testCases) {
    console.log(`   Testing: ${testCase.name}`);
    console.log(`   Prompt: "${testCase.prompt}"`);
    
    try {
      const result = await AIClient.generateText(testCase.prompt, {
        maxTokens: 100,
        temperature: 0.7
      });
      
      console.log(`   Generated: "${result}"`);
      console.log(`   Length: ${result.length} characters`);
      console.log(`   ✅ Success\n`);
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}\n`);
    }
  }

  // Test with complex context
  console.log('4. Testing complex context generation...');
  
  const complexPrompt = `Generate a LinkedIn connection message with the following context:

Target Person:
- Name: Michael Chen
- Headline: Senior Product Manager at Apple
- Company: Apple
- About: Passionate about building user-centric products and leading cross-functional teams

Your Profile:
- Name: Jennifer Smith
- Headline: UX Designer
- About: Experienced designer focused on creating intuitive user experiences

Shared Background:
- Education: University of California, Berkeley

Your Request: I would like to connect and discuss potential collaboration opportunities

Generate a professional, personalized LinkedIn message that:
1. Addresses the target by their first name
2. References shared background if available
3. Incorporates your specific request
4. Stays within LinkedIn's 300 character limit
5. Maintains a professional yet friendly tone

Message:`;

  try {
    const result = await AIClient.generateText(complexPrompt, {
      maxTokens: 150,
      temperature: 0.7
    });
    
    console.log(`   Generated: "${result}"`);
    console.log(`   Length: ${result.length} characters`);
    console.log(`   ✅ Complex context generation successful!\n`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}\n`);
  }

  console.log('🎉 OpenAI API tests completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. If all tests passed, your OpenAI integration is working');
  console.log('   2. You can now use AI-powered message generation in your app');
  console.log('   3. Monitor your OpenAI usage and costs');
}

// Run the test
testOpenAIAPI().catch(console.error); 