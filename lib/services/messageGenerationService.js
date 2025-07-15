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
        maxTokens: 500,
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
      userName = '',
      userHeadline = '',
      userAbout = '',
      sharedBackground = '',
      requestType = 'connection',
      tone = 'professional'
    } = context || {};

    // System prompt: Explicitly instruct the AI to speak as the user ("me")
    const systemPrompt = `
    You are a professional LinkedIn networking assistant. 
    Your task is to craft a ${tone} and personalized LinkedIn message written from **my** (the user's) perspective. 
    
    Always assume that I am initiating the message. Use any provided profile context to make it relevant and engaging. 
    Keep the tone human, authentic, and focused on connection — not sales or generic templates.
    
    🧠 Guidelines:
    - Write in first person (as me).
    - Message should sound like a real person, not an AI.
    - If no prior interaction exists, assume it’s a cold outreach.
    - Keep the message short (ideally under 300 characters) and polite.
    
    Use the following context to personalize the message if available.
    `;
    const coldSystemPrompt = `You are an expert LinkedIn networking assistant. Write a cold LinkedIn connection message under 200 characters, written from my (the user's) perspective. Make it concise, friendly, and personalized using any provided context, but assume minimal or no prior interaction. The message should be warm, professional, and encourage a connection.`;

    // Use coldSystemPrompt if chatHistory is empty
    const selectedSystemPrompt = (chatHistory && chatHistory.length === 0) ? coldSystemPrompt : systemPrompt;

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
      if (userName) userPrompt += `- Name: ${userName}\n`;
      if (userHeadline) userPrompt += `- Headline: ${userHeadline}\n`;
      if (userAbout) userPrompt += `- About: ${userAbout}\n`;
      userPrompt += '\n';
    }
    if (sharedBackground) {
      userPrompt += `Shared Background:\n- ${sharedBackground}\n\n`;
    }
    
    // Add chat history as context information, not as AI conversation
    if (chatHistory && chatHistory.length > 0) {
      userPrompt += `Previous Conversation (from oldest to most recent):\n`;
    
      chatHistory
        .filter(msg => msg.content && msg.content.trim() !== '')
        .forEach((msg, index) => {
          const sender = msg.role === 'user' ? 'Me' : 'Contact';
          const isLast = index === chatHistory.length - 1;
          const prefix = isLast ? `🔹 Most Recent - ${sender}` : `- ${sender}`;
          userPrompt += `${prefix}: ${msg.content}\n`;
        });
    
      userPrompt += `\nPlease ensure your reply naturally responds to the most recent message above.\n`;
    }
    userPrompt += `Request: I would like to ${requestType}.\nTone: ${tone}.`;

    //cold user prompt
    let coldUserPrompt = '';
    if(contactName || contactHeadline ){
      coldUserPrompt = `Target person:\n`;
      if (contactName) coldUserPrompt += `- Name: ${contactName}\n`;
      if (contactHeadline) coldUserPrompt += `- Headline: ${contactHeadline}\n`;
      coldUserPrompt += '\n';
    }

    if (userHeadline || userAbout) {
      coldUserPrompt += `My Profile:\n`;
      if (userName) coldUserPrompt += `- Name: ${userName}\n`;
      if (userHeadline) coldUserPrompt += `- Headline: ${userHeadline}\n`;

      coldUserPrompt += '\n';
    }
    
    // Cold messages don't include chat history since they're for first-time connections
    coldUserPrompt += `Request: I would like to send a cold connection request.\nTone: ${tone}.`;

    let selectedUserPrompt = (chatHistory && chatHistory.length === 0) ? coldUserPrompt : userPrompt;


    // Build messages array
    const messages = [
      { role: 'system', content: selectedSystemPrompt },
      { role: 'user', content: selectedUserPrompt }
    ];


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