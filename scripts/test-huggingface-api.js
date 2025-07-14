/**
 * Hugging Face API Test Script
 * Tests the connection and functionality of Hugging Face Inference API
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const HF_API_KEY = process.env.HF_API_KEY;
const MODEL_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

// Test prompts for different scenarios
const testPrompts = [
  {
    name: "Simple greeting",
    prompt: "Hi, how are you today?",
    expected: "A friendly response"
  },
  {
    name: "LinkedIn connection",
    prompt: "Generate a professional LinkedIn connection message for someone named John who works at Google as a software engineer.",
    expected: "A professional LinkedIn message"
  },
  {
    name: "Business context",
    prompt: "Write a brief professional message to connect with a marketing manager at a tech company.",
    expected: "A business-focused message"
  }
];

async function testHuggingFaceConnection() {
  console.log('🧪 Testing Hugging Face API Connection...\n');

  // Check if API key is configured
  if (!HF_API_KEY) {
    console.error('❌ HF_API_KEY not found in environment variables');
    console.log('💡 Please add your Hugging Face API key to .env file:');
    console.log('   HF_API_KEY=your_api_key_here');
    return;
  }

  console.log('✅ API Key found in environment variables');
  console.log(`🔗 Model URL: ${MODEL_URL}\n`);

  try {
    // Test 1: Basic connection test
    console.log('1. Testing basic connection...');
    const response1 = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: "Hello, this is a test message.",
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
          do_sample: true
        }
      })
    });

    console.log(`   Status: ${response1.status}`);
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log(`   Response: ${JSON.stringify(data1, null, 2)}`);
      console.log('   ✅ Basic connection successful!\n');
    } else {
      const errorText = await response1.text();
      console.log(`   ❌ Connection failed: ${errorText}\n`);
      return;
    }

    // Test 2: Test different prompts
    console.log('2. Testing different prompt types...');
    
    for (const testCase of testPrompts) {
      console.log(`   Testing: ${testCase.name}`);
      console.log(`   Prompt: "${testCase.prompt}"`);
      
      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: testCase.prompt,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   Generated: "${data[0]?.generated_text || 'No response'}"`);
        console.log(`   ✅ Success\n`);
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Failed: ${errorText}\n`);
      }
    }

    // Test 3: Test with LinkedIn-specific context
    console.log('3. Testing LinkedIn message generation...');
    
    const linkedInPrompt = `Generate a LinkedIn connection message with the following context:

Target Person:
- Name: John Doe
- Headline: Software Engineer at Tech Corp
- Company: Tech Corp
- About: Passionate about building scalable web applications

Your Profile:
- Name: Jane Smith
- Headline: Full Stack Developer
- About: Experienced developer with expertise in React and Node.js

Shared Background:
- Education: Stanford University

Your Request: I would like to connect and discuss potential collaboration opportunities

Generate a professional, personalized LinkedIn message that:
1. Addresses the target by their first name
2. References shared background if available
3. Incorporates your specific request
4. Stays within LinkedIn's 300 character limit
5. Maintains a professional yet friendly tone

Message:`;

    const response3 = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: linkedInPrompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9
        }
      })
    });

    if (response3.ok) {
      const data3 = await response3.json();
      console.log(`   Generated LinkedIn message:`);
      console.log(`   "${data3[0]?.generated_text || 'No response'}"`);
      console.log(`   ✅ LinkedIn message generation successful!\n`);
    } else {
      const errorText = await response3.text();
      console.log(`   ❌ LinkedIn message generation failed: ${errorText}\n`);
    }

    // Test 4: Test error handling
    console.log('4. Testing error handling...');
    
    // Test with invalid API key
    const response4 = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid_key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: "Test message"
      })
    });

    console.log(`   Invalid API key - Status: ${response4.status}`);
    if (!response4.ok) {
      const errorText = await response4.text();
      console.log(`   Expected error: ${errorText}`);
      console.log('   ✅ Error handling working correctly\n');
    }

    console.log('🎉 All Hugging Face API tests completed!');
    console.log('\n💡 Next steps:');
    console.log('   1. If all tests passed, your API is working correctly');
    console.log('   2. You can now use this in your message generation service');
    console.log('   3. Make sure to handle rate limits and errors in production');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify your API key is correct');
    console.log('   3. Check if the model is available');
    console.log('   4. Ensure you have sufficient API credits');
  }
}

// Run the test
testHuggingFaceConnection(); 