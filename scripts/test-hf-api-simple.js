/**
 * Simple Hugging Face API Test
 * Allows manual API key input for testing
 */

import fetch from 'node-fetch';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const MODEL_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function testHuggingFaceAPI() {
  console.log('🧪 Simple Hugging Face API Test\n');
  
  // Ask for API key
  const apiKey = await askQuestion('Enter your Hugging Face API key (or press Enter to skip): ');
  
  if (!apiKey || apiKey.trim() === '') {
    console.log('⏭️  Skipping API test');
    rl.close();
    return;
  }

  console.log('\n🔗 Testing connection to Hugging Face API...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const response1 = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      rl.close();
      return;
    }

    // Test 2: LinkedIn message generation
    console.log('2. Testing LinkedIn message generation...');
    
    const linkedInPrompt = `Generate a LinkedIn connection message for John Doe who works at Google as a software engineer. Keep it professional and under 300 characters.`;

    const response2 = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: linkedInPrompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9
        }
      })
    });

    if (response2.ok) {
      const data2 = await response2.json();
      console.log(`   Generated LinkedIn message:`);
      console.log(`   "${data2[0]?.generated_text || 'No response'}"`);
      console.log(`   ✅ LinkedIn message generation successful!\n`);
    } else {
      const errorText = await response2.text();
      console.log(`   ❌ LinkedIn message generation failed: ${errorText}\n`);
    }

    console.log('🎉 API test completed successfully!');
    console.log('\n💡 Your API key is working correctly.');
    console.log('   You can now add it to your .env file:');
    console.log(`   HF_API_KEY=${apiKey}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify your API key is correct');
    console.log('   3. Check if you have sufficient API credits');
  } finally {
    rl.close();
  }
}

// Run the test
testHuggingFaceAPI(); 