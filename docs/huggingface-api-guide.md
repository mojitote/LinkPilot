# Hugging Face API Integration Guide

## Overview

This guide explains how to integrate Hugging Face Inference API into the LinkPilot project for AI-powered message generation.

## What is Hugging Face?

Hugging Face is a leading platform for natural language processing (NLP) that provides:
- **Model Hub**: Thousands of pre-trained models
- **Inference API**: Cloud-based model inference service
- **Transformers Library**: Python library for local model usage

## Why Hugging Face for LinkPilot?

### Advantages
- **No Local GPU Required**: Cloud-based inference
- **Pay-per-use**: Only pay for what you use
- **Auto-scaling**: Handles traffic automatically
- **Easy Integration**: Simple REST API
- **High-quality Models**: Access to state-of-the-art models

### Model Choice: Zephyr-7B-Beta
We use `HuggingFaceH4/zephyr-7b-beta` because:
- **Performance**: High-quality text generation
- **Size**: 7B parameters (good balance of quality/speed)
- **Cost**: Reasonable pricing for inference
- **Specialization**: Good at conversational and professional text

## Setup Process

### 1. Create Hugging Face Account

1. Visit [https://huggingface.co/](https://huggingface.co/)
2. Click "Sign Up"
3. Complete registration and verify email

### 2. Get API Key

1. Login to Hugging Face
2. Click your avatar (top right)
3. Select "Settings"
4. Navigate to "Access Tokens" (left sidebar)
5. Click "New token"
6. Fill in details:
   - **Name**: `LinkPilot` (or any name you prefer)
   - **Role**: `Read` (sufficient for inference)
7. Click "Generate token"
8. **Important**: Copy the token immediately (starts with `hf_`)

### 3. Configure Environment

Create or update your `.env` file:

```bash
# Hugging Face API
HF_API_KEY=hf_your_actual_token_here
```

### 4. Test Configuration

Run the test script:

```bash
node scripts/test-hf-api-simple.js
```

## API Usage

### Basic Request Format

```javascript
const response = await fetch(
  "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: "Your prompt here",
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9
      }
    })
  }
);
```

### Parameters Explained

| Parameter | Description | Recommended Value |
|-----------|-------------|-------------------|
| `max_new_tokens` | Maximum tokens to generate | 150 (for LinkedIn messages) |
| `temperature` | Creativity level (0-1) | 0.7 (balanced) |
| `do_sample` | Enable sampling | true |
| `top_p` | Nucleus sampling threshold | 0.9 |

### Response Format

```json
[
  {
    "generated_text": "Hi John, I enjoyed reading about your work..."
  }
]
```

## Integration in LinkPilot

### Message Generation Service

The `MessageGenerationService` uses Hugging Face API:

```javascript
// lib/services/messageGenerationService.js
static async callAIService(context) {
  // Build prompt with context
  const aiPrompt = this.buildPrompt(context);
  
  // Call Hugging Face API
  const response = await fetch(MODEL_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: aiPrompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9
      }
    })
  });
  
  // Process response
  const data = await response.json();
  return data[0].generated_text;
}
```

### Context Building

The service builds rich context for better message generation:

1. **Target Information**: Contact's name, headline, company, about
2. **User Profile**: Your name, headline, about
3. **Shared Background**: Education, work experience overlap
4. **Chat History**: Previous conversation context
5. **User Prompt**: Specific request or tone

### Error Handling

The service includes fallback mechanisms:

```javascript
try {
  // Try Hugging Face API
  return await this.callHuggingFaceAPI(prompt);
} catch (error) {
  console.error('AI service failed:', error);
  // Fallback to smart placeholder
  return this.generateSmartPlaceholder(context);
}
```

## Testing

### Manual Testing

```bash
# Test with manual API key input
node scripts/test-hf-api-simple.js

# Test with environment variables
node scripts/test-huggingface-api.js
```

### Integration Testing

```bash
# Test message generation endpoint
node scripts/test-message-generation.js
```

## Cost Considerations

### Pricing (as of 2024)
- **Free Tier**: Limited requests per month
- **Paid Tier**: Pay per request
- **Model**: Zephyr-7B-Beta is relatively cost-effective

### Optimization Tips
1. **Cache Responses**: Store generated messages
2. **Batch Requests**: Group similar prompts
3. **Fallback Logic**: Use simpler generation when API fails
4. **Rate Limiting**: Implement request throttling

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check API key is correct
   - Verify key has proper permissions

2. **429 Rate Limited**
   - Implement request throttling
   - Check usage limits

3. **503 Service Unavailable**
   - Model might be loading
   - Retry after a few seconds

4. **Invalid Response Format**
   - Check API documentation
   - Verify model endpoint

### Debug Steps

1. Test API key manually
2. Check network connectivity
3. Verify environment variables
4. Review API response format
5. Check Hugging Face status page

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for configuration
3. **Rotate keys** periodically
4. **Monitor usage** for unusual activity
5. **Implement rate limiting** to prevent abuse

## Alternative Models

If Zephyr-7B-Beta doesn't meet your needs:

- `microsoft/DialoGPT-medium` - Good for conversations
- `gpt2` - Smaller, faster model
- `EleutherAI/gpt-neo-125M` - Lightweight option

## Next Steps

1. Get your Hugging Face API key
2. Add it to your `.env` file
3. Test the connection
4. Start using AI-powered message generation

For more information, visit the [Hugging Face documentation](https://huggingface.co/docs). 