import assert from 'assert';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { AIClient } from '../lib/utils/aiClient.js';

describe('AIClient (Hugging Face Llama-3.1-8B-Instruct)', function () {
  this.timeout(20000); // API may be slow

  it('should generate a short professional greeting', async function () {
    const prompt = 'Generate a short professional greeting.';
    const result = await AIClient.generateText(prompt, { maxTokens: 50 });
    assert.ok(result && typeof result === 'string' && result.length > 0, 'Should return a non-empty string');
    console.log('AI Output:', result);
  });

  it('should generate a LinkedIn connection message', async function () {
    const prompt = 'Write a LinkedIn connection message for a software engineer at Google.';
    const result = await AIClient.generateText(prompt, { maxTokens: 100 });
    assert.ok(result && typeof result === 'string' && result.length > 0, 'Should return a non-empty string');
    console.log('AI Output:', result);
  });
}); 