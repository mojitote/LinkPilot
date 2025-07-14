/**
 * Message Service Layer
 * Handles all message-related business logic
 */

import { MessageRepository } from '../repositories/messageRepository.js';
import { ContactRepository } from '../repositories/contactRepository.js';
import { AppError, NotFoundError } from '../utils/apiResponse.js';
import { ObjectId } from 'mongodb';

export class MessageService {
  /**
   * Add a new message
   */
  static async addMessage(messageData, userId) {
    try {
      // Validate that contact exists
      const contact = await ContactRepository.findByLinkedInId(
        messageData.contactId,
        userId
      );

      if (!contact) {
        throw new NotFoundError('Contact');
      }

      const message = await MessageRepository.create({
        ownerId: userId,
        contactId: messageData.contactId,
        content: messageData.content,
        role: messageData.role || 'user' // 'user' or 'contact'
      });

      return message;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to add message', 500, 'SERVICE_ERROR');
    }
  }

  /**
   * Get messages for a specific contact
   */
  static async getMessagesByContact(contactId, userId, page = 1, limit = 50) {
    try {
      // Validate that contact exists
      const contact = await ContactRepository.findByLinkedInId(
        contactId,
        userId
      );

      if (!contact) {
        throw new NotFoundError('Contact');
      }

      const skip = (page - 1) * limit;
      
      const messages = await MessageRepository.find(
        { 
          ownerId: userId,
          contactId: contactId
        },
        {
          sort: { createdAt: 1 }, // Oldest first for chat
          skip,
          limit
        }
      );

      const total = await MessageRepository.count({ 
        ownerId: userId,
        contactId: contactId
      });

      return {
        messages,
        contact,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to fetch messages', 500, 'SERVICE_ERROR');
    }
  }

  /**
   * Get all messages for a user
   */
  static async getAllMessages(userId, page = 1, limit = 50) {
    try {
      const skip = (page - 1) * limit;
      
      const messages = await MessageRepository.find(
        { ownerId: userId },
        {
          sort: { createdAt: -1 },
          skip,
          limit
        }
      );

      const total = await MessageRepository.count({ ownerId: userId });

      return {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new AppError('Failed to fetch messages', 500, 'SERVICE_ERROR');
    }
  }

  /**
   * Update a message
   */
  static async updateMessage(messageId, updateData, userId) {
    try {
      const result = await MessageRepository.updateOne(
        { 
          _id: new ObjectId(messageId),
          ownerId: userId
        },
        updateData
      );

      if (result.matchedCount === 0) {
        throw new NotFoundError('Message');
      }

      return { success: true, modifiedCount: result.modifiedCount };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to update message', 500, 'SERVICE_ERROR');
    }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(messageId, userId) {
    try {
      const result = await MessageRepository.deleteOne({
        _id: new ObjectId(messageId),
        ownerId: userId
      });

      if (result.deletedCount === 0) {
        throw new NotFoundError('Message');
      }

      return { success: true, deletedCount: result.deletedCount };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to delete message', 500, 'SERVICE_ERROR');
    }
  }

  /**
   * Get message statistics for a user
   */
  static async getMessageStats(userId) {
    try {
      const totalMessages = await MessageRepository.count({ ownerId: userId });
      const userMessages = await MessageRepository.count({ 
        ownerId: userId,
        role: 'user'
      });
      const contactMessages = await MessageRepository.count({ 
        ownerId: userId,
        role: 'contact'
      });
      const uniqueContacts = await MessageRepository.distinct('contactId', { ownerId: userId });

      return {
        totalMessages,
        userMessages,
        contactMessages,
        uniqueContacts: uniqueContacts.length,
        averageMessagesPerContact: uniqueContacts.length > 0 
          ? Math.round(totalMessages / uniqueContacts.length) 
          : 0
      };
    } catch (error) {
      throw new AppError('Failed to fetch message statistics', 500, 'SERVICE_ERROR');
    }
  }
} 