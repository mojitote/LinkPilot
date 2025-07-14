/**
 * Environment Setup Helper
 * Helps configure environment variables for testing
 */

import fs from 'fs';
import path from 'path';

const envExamplePath = path.join(process.cwd(), 'env.example');
const envPath = path.join(process.cwd(), '.env');

console.log('🔧 Environment Setup Helper\n');

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
  
  // Read and check for HF_API_KEY
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('HF_API_KEY=')) {
    const hfKey = envContent.match(/HF_API_KEY=(.+)/)?.[1];
    if (hfKey && hfKey !== 'your_huggingface_api_key_here') {
      console.log('✅ HF_API_KEY is configured');
      console.log(`   Key: ${hfKey.substring(0, 10)}...`);
    } else {
      console.log('⚠️  HF_API_KEY is not set properly');
      console.log('   Please update your .env file with your actual API key');
    }
  } else {
    console.log('❌ HF_API_KEY not found in .env file');
  }
} else {
  console.log('❌ .env file not found');
  console.log('💡 Please create a .env file with the following content:');
  console.log('');
  console.log('NEXTAUTH_URL=http://localhost:3000');
  console.log('NEXTAUTH_SECRET=your_nextauth_secret_here');
  console.log('GITHUB_ID=your_github_client_id');
  console.log('GITHUB_SECRET=your_github_client_secret');
  console.log('SCRAPER_API_URL=http://localhost:8000');
  console.log('HF_API_KEY=your_huggingface_api_key_here');
  console.log('MONGODB_URI=your_mongodb_connection_string');
  console.log('');
}

console.log('\n📋 How to get your Hugging Face API key:');
console.log('1. Go to https://huggingface.co/');
console.log('2. Sign up or log in');
console.log('3. Click your avatar → Settings');
console.log('4. Go to "Access Tokens"');
console.log('5. Click "New token"');
console.log('6. Name it (e.g., "LinkPilot")');
console.log('7. Select "Read" permission');
console.log('8. Click "Generate token"');
console.log('9. Copy the token (starts with "hf_")');
console.log('10. Add it to your .env file as HF_API_KEY=hf_your_token_here');
console.log('');

console.log('🧪 After setting up your API key, run:');
console.log('   node scripts/test-huggingface-api.js'); 