/**
 * Message Repository Layer
 * Handles all database operations for messages
 */

import { connectToDatabase } from '../db.js';
import { AppError } from '../utils/apiResponse.js';
import { ObjectId } from 'mongodb';

export class MessageRepository {
  /**
   * Create a new message
   */
  static async create(messageData) {
    try {
      const { db } = await connectToDatabase();
      
      const message = {
        ...messageData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('messages').insertOne(message);
      message._id = result.insertedId;

      return message;
    } catch (error) {
      throw new AppError('Failed to create message', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Find messages by criteria
   */
  static async find(criteria, options = {}) {
    try {
      const { db } = await connectToDatabase();
      
      const {
        sort = { createdAt: 1 },
        skip = 0,
        limit = 50,
        projection = {}
      } = options;

      const messages = await db.collection('messages')
        .find(criteria, { projection })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();

      return messages;
    } catch (error) {
      throw new AppError('Failed to find messages', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Count messages by criteria
   */
  static async count(criteria) {
    try {
      const { db } = await connectToDatabase();
      return await db.collection('messages').countDocuments(criteria);
    } catch (error) {
      throw new AppError('Failed to count messages', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Find one message by criteria
   */
  static async findOne(criteria, projection = {}) {
    try {
      const { db } = await connectToDatabase();
      return await db.collection('messages').findOne(criteria, { projection });
    } catch (error) {
      throw new AppError('Failed to find message', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Update a message
   */
  static async updateOne(criteria, updateData) {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('messages').updateOne(
        criteria,
        {
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );

      return result;
    } catch (error) {
      throw new AppError('Failed to update message', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Delete a message
   */
  static async deleteOne(criteria) {
    try {
      const { db } = await connectToDatabase();
      return await db.collection('messages').deleteOne(criteria);
    } catch (error) {
      throw new AppError('Failed to delete message', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Get distinct values for a field
   */
  static async distinct(field, criteria) {
    try {
      const { db } = await connectToDatabase();
      return await db.collection('messages').distinct(field, criteria);
    } catch (error) {
      throw new AppError('Failed to get distinct values', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Get sample messages
   */
  static async findSampleMessages() {
    try {
      const { db } = await connectToDatabase();
      
      const messages = await db.collection('messages')
        .find({ ownerId: 'sample-user-123' })
        .sort({ createdAt: 1 })
        .toArray();

      return messages;
    } catch (error) {
      throw new AppError('Failed to fetch sample messages', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Find messages between a user and a specific contact
   */
  static async findByContact(userId, contactId) {
    try {
      const { db } = await connectToDatabase();
      
      const messages = await db.collection('messages')
        .find({
          $or: [
            { ownerId: userId, contactId: contactId },
            { ownerId: contactId, contactId: userId }
          ]
        })
        .sort({ createdAt: 1 })
        .toArray();

      return messages;
    } catch (error) {
      throw new AppError('Failed to fetch messages by contact', 500, 'DATABASE_ERROR');
    }
  }
} 