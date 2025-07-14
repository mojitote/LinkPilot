/**
 * OpenAI API Client
 * Handles all OpenAI API interactions for message generation
 */

import { InferenceClient } from "@huggingface/inference";
import { AppError } from "./apiResponse.js";
import { AI_CONFIG, isAIConfigured } from "../config/aiConfig.js";

export class AIClient {
  static getClient() {
    if (!isAIConfigured()) {
      throw new AppError("Hugging Face API key not configured", 500, "CONFIGURATION_ERROR");
    }
    return new InferenceClient(AI_CONFIG.apiKey);
  }

  /**
   * Generate chat completion using Hugging Face Inference Providers
   * @param {Array} messages - OpenAI style messages array
   * @param {Object} options - { provider, model, ... }
   * @returns {Promise<string>}
   */
  static async generateChat(messages, options = {}) {
    try {
      const client = AIClient.getClient();
      const provider = options.provider || AI_CONFIG.provider || "auto";
      const model = options.model || AI_CONFIG.model;
      const response = await client.chatCompletion({
        provider,
        model,
        messages,
        ...options,
      });
      if (
        response &&
        response.choices &&
        response.choices[0] &&
        response.choices[0].message &&
        response.choices[0].message.content
      ) {
        return response.choices[0].message.content;
      }
      throw new AppError("Unexpected Hugging Face API response", 500, "HF_API_ERROR");
    } catch (err) {
      throw new AppError(err.message || "Hugging Face API error", 500, "HF_API_ERROR");
    }
  }
} 