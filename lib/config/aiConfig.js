/**
 * AI Service Configuration
 * Hugging Face API configuration for message generation
 */

export const AI_CONFIG = {
  get apiKey() { return process.env.HF_API_KEY; },
  get model() { return process.env.HF_MODEL || "meta-llama/Llama-3-8B-Instruct"; },
  get provider() { return process.env.HF_PROVIDER || "auto"; }, // 支持 groq、together、fireworks 等
};

export function isAIConfigured() {
  return AI_CONFIG.apiKey && AI_CONFIG.apiKey.trim() !== "";
}

/**
 * Get AI configuration
 */
export function getAIConfig() {
  return AI_CONFIG;
} 