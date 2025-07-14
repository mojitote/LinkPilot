# OpenAI API Integration Guide

## Overview

This guide explains how to integrate OpenAI API into the LinkPilot project for AI-powered message generation, providing a more reliable and feature-rich alternative to Hugging Face.

## Why OpenAI API?

### Advantages
- **Reliability**: High uptime and consistent performance
- **Speed**: Fast response times with global CDN
- **Features**: Advanced models with better understanding
- **Support**: Excellent documentation and community support
- **Free Tier**: $5 credit for new users
- **Streaming**: Support for real-time text generation

### Models Available
- **gpt-3.5-turbo**: Fast, cost-effective, good for most use cases
- **gpt-4**: More advanced, better reasoning, higher cost
- **gpt-4-turbo**: Latest model with improved performance

## Setup Process

### 1. Get OpenAI API Key

1. Visit [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

### 2. Configure Environment

Add to your `.env.local` file:

```bash
# AI Service Configuration
AI_PROVIDER=openai
OPENAI_API_KEY=sk_your_actual_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

### 3. Test Configuration

```bash
node scripts/test-openai-api.js
```

## API Usage

### Basic Request Format

```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a professional LinkedIn networking assistant.'
      },
      {
        role: 'user',
        content: 'Your prompt here'
      }
    ],
    max_tokens: 150,
    temperature: 0.7
  })
});
```

### Parameters Explained

| Parameter | Description | Recommended Value |
|-----------|-------------|-------------------|
| `model` | AI model to use | `gpt-3.5-turbo` |
| `max_tokens` | Maximum tokens to generate | 150 (for LinkedIn messages) |
| `temperature` | Creativity level (0-2) | 0.7 (balanced) |
| `stream` | Enable streaming | false (for our use case) |

### Response Format

```json
{
  "choices": [
    {
      "message": {
        "content": "Hi John, I enjoyed reading about your work..."
      }
    }
  ]
}
```

## Integration in LinkPilot

### Unified AI Service

The project now uses a unified `AIService` that supports both OpenAI and Hugging Face:

```javascript
// lib/services/aiService.js
import { AIService } from './aiService.js';

// Generate text with OpenAI
const result = await AIService.generateText(prompt, {
  maxTokens: 150,
  temperature: 0.7
});
```

### Message Generation Service

Updated to use the unified service:

```javascript
// lib/services/messageGenerationService.js
static async callAIService(context) {
  const aiPrompt = this.buildPrompt(context);
  
  // Use unified AI service
  const generatedMessage = await AIService.generateText(aiPrompt, {
    maxTokens: 150,
    temperature: 0.7
  });
  
  return generatedMessage;
}
```

### Configuration Management

```javascript
// lib/config/aiConfig.js
export const AI_CONFIG = {
  provider: process.env.AI_PROVIDER || 'openai',
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: 150,
    temperature: 0.7,
  }
};
```

## Testing

### Manual Testing

```bash
# Test OpenAI integration
node scripts/test-openai-api.js

# Test AI service status
curl -X GET http://localhost:3000/api/ai/status \
  -H "Authorization: Bearer your_token"

# Test AI connection
curl -X POST http://localhost:3000/api/ai/status \
  -H "Authorization: Bearer your_token"
```

### Integration Testing

```bash
# Test message generation endpoint
node scripts/test-message-generation.js
```

## Cost Considerations

### Pricing (as of 2024)
- **gpt-3.5-turbo**: $0.0015 per 1K input tokens, $0.002 per 1K output tokens
- **gpt-4**: $0.03 per 1K input tokens, $0.06 per 1K output tokens
- **Free Tier**: $5 credit for new users

### Cost Optimization
1. **Use gpt-3.5-turbo**: Best balance of cost and quality
2. **Limit max_tokens**: Set appropriate limits
3. **Cache responses**: Store generated messages
4. **Monitor usage**: Track API calls and costs

### Example Cost Calculation
- LinkedIn message: ~50 tokens
- Cost per message: ~$0.0001 (very affordable)
- 1000 messages: ~$0.10

## Error Handling

### Common Errors

1. **401 Unauthorized**
   - Check API key is correct
   - Verify key has proper permissions

2. **429 Rate Limited**
   - Implement request throttling
   - Check usage limits

3. **400 Bad Request**
   - Check request format
   - Verify model name

4. **500 Internal Server Error**
   - Retry after a few seconds
   - Check OpenAI status page

### Fallback Strategy

```javascript
try {
  // Try OpenAI first
  return await AIService.generateText(prompt);
} catch (error) {
  console.error('OpenAI failed:', error);
  
  // Fallback to Hugging Face
  if (AI_CONFIG.huggingface.apiKey) {
    return await AIService.generateWithHuggingFace(prompt);
  }
  
  // Final fallback to placeholder
  return this.generateSmartPlaceholder(context);
}
```

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for configuration
3. **Rotate keys** periodically
4. **Monitor usage** for unusual activity
5. **Implement rate limiting** to prevent abuse
6. **Use least privilege** - only request necessary permissions

## Migration from Hugging Face

### Step-by-Step Migration

1. **Get OpenAI API key**
2. **Update environment variables**:
   ```bash
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk_your_key
   ```
3. **Test the integration**:
   ```bash
   node scripts/test-openai-api.js
   ```
4. **Update your application** (already done in this guide)
5. **Monitor performance** and costs

### Benefits of Migration

- **Reliability**: No more 404 errors or service outages
- **Performance**: Faster response times
- **Features**: Better model understanding and capabilities
- **Support**: Better documentation and community support
- **Cost**: Predictable pricing with free tier

## Next Steps

1. Get your OpenAI API key
2. Add it to your `.env.local` file
3. Test the integration
4. Start using AI-powered message generation
5. Monitor usage and costs

For more information, visit the [OpenAI API documentation](https://platform.openai.com/docs). 