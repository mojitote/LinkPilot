/**
 * Message Generation Service
 * Handles AI-powered LinkedIn message generation
 */

import { AIClient } from '../utils/aiClient.js';
import { MessageRepository } from '../repositories/messageRepository.js';
import { AppError } from '../utils/apiResponse.js';
import fs from 'fs';
import path from 'path';

export class MessageGenerationService {
  /**
   * Generate a LinkedIn connection message using AI
   */
  static async generateMessage(contactId, userId, context = {}) {
    try {
      // Get chat history for context
      const chatHistory = await this.getChatHistory(contactId, userId);

      // Build OpenAI-style messages array
      const { messages, systemPrompt, userPrompt } = this.buildMessages(context, chatHistory, userId);

      // Generate message using AI (Hugging Face Providers chatCompletion)
      const generated = await AIClient.generateChat(messages, {
        maxTokens: 150,
        temperature: 0.7
      });

      // Save prompt and result for testing/debugging
      this.saveGenerationDebug({
        contactId,
        userId,
        systemPrompt,
        userPrompt,
        chatHistory,
        messages,
        generated,
        context
      });

      return {
        success: true,
        message: generated,
        messages: messages
      };
    } catch (error) {
      console.error('Message generation failed:', error && error.stack ? error.stack : error);
      throw new AppError(
        `Failed to generate message: ${error.message}`,
        500,
        'MESSAGE_GENERATION_ERROR'
      );
    }
  }

  /**
   * Get chat history for context
   */
  static async getChatHistory(contactId, userId) {
    try {
      const messages = await MessageRepository.findByContact(contactId, userId);
      return messages.slice(-5); // Get last 5 messages for context
    } catch (error) {
      console.error('Failed to get chat history:', error);
      return [];
    }
  }

  /**
   * Build OpenAI-style messages array for chatCompletion
   * Ensures the AI always speaks as the user ("me"), not as the contact.
   * Returns { messages, systemPrompt, userPrompt } for debug saving.
   */
  static buildMessages(context, chatHistory = [], userId) {
    // Ensure all context fields are string (fallback to '')
    const {
      contactName = '',
      contactHeadline = '',
      contactCompany = '',
      contactAbout = '',
      userHeadline = '',
      userAbout = '',
      sharedBackground = '',
      requestType = 'connection',
      tone = 'professional'
    } = context || {};

    // System prompt: Explicitly instruct the AI to speak as the user ("me")
    const systemPrompt = `You are an expert LinkedIn networking assistant. Generate a ${tone}, personalized LinkedIn ${requestType} message. Always write from my (the user's) perspective, as if I am sending the message. Use the following context if available.`;

    // User prompt
    let userPrompt = '';
    if (contactName || contactHeadline || contactCompany) {
      userPrompt += `Target Person:\n`;
      if (contactName) userPrompt += `- Name: ${contactName}\n`;
      if (contactHeadline) userPrompt += `- Headline: ${contactHeadline}\n`;
      if (contactCompany) userPrompt += `- Company: ${contactCompany}\n`;
      if (contactAbout) userPrompt += `- About: ${contactAbout}\n`;
      userPrompt += '\n';
    }
    if (userHeadline || userAbout) {
      userPrompt += `My Profile:\n`;
      if (userHeadline) userPrompt += `- Headline: ${userHeadline}\n`;
      if (userAbout) userPrompt += `- About: ${userAbout}\n`;
      userPrompt += '\n';
    }
    if (sharedBackground) {
      userPrompt += `Shared Background:\n- ${sharedBackground}\n\n`;
    }
    userPrompt += `Request: I would like to ${requestType}.\nTone: ${tone}.`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    // Add chat history: contact's messages as 'user', my messages as 'assistant'
    // This is only for context, not to change the AI's speaking perspective
    chatHistory.filter(msg => msg.content && msg.content.trim() !== '').forEach(msg => {
      messages.push({
        role: msg.senderId === userId ? 'assistant' : 'user',
        content: msg.content
      });
    });

    return { messages, systemPrompt, userPrompt };
  }

  /**
   * Save prompt, chat history, and generated message for debugging/testing
   * Output file: tests/generated-messages/{timestamp}_{contactId}.json
   */
  static saveGenerationDebug({ contactId, userId, systemPrompt, userPrompt, chatHistory, messages, generated, context }) {
    try {
      const dir = path.join(process.cwd(), 'tests', 'generated-messages');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${timestamp}_${contactId}.json`;
      const filePath = path.join(dir, filename);
      const data = {
        contactId,
        userId,
        timestamp,
        context,
        systemPrompt,
        userPrompt,
        chatHistory,
        messages,
        generated
      };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      // Do not throw error, just log
      console.error('Failed to save generation debug file:', err);
    }
  }

  /**
   * Test AI service connection
   */
  static async testAIConnection() {
    return await AIClient.testConnection();
  }

  /**
   * Get AI service status
   */
  static getAIStatus() {
    return AIClient.getServiceStatus();
  }
} 