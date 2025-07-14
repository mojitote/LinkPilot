/**
 * User Repository Layer
 * Handles all user-related database operations
 */

import { connectToDatabase } from '../db.js';
import { AppError, NotFoundError } from '../utils/apiResponse.js';

export class UserRepository {
  /**
   * Create new user
   */
  static async create(userData) {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('users').insertOne({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return await this.findById(userData.ownerId);
    } catch (error) {
      throw new AppError('Failed to create user', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Find user by ID
   */
  static async findById(userId) {
    try {
      const { db } = await connectToDatabase();
      
      const user = await db.collection('users').findOne({ ownerId: userId });

      if (!user) {
        throw new NotFoundError('User');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to fetch user', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Check if user exists
   */
  static async exists(userId) {
    try {
      const { db } = await connectToDatabase();
      
      const user = await db.collection('users').findOne({ ownerId: userId });
      return !!user;
    } catch (error) {
      throw new AppError('Failed to check user existence', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Update user
   */
  static async update(userId, updateData) {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('users').updateOne(
        { ownerId: userId },
        {
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new NotFoundError('User');
      }

      return await this.findById(userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to update user', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Delete user
   */
  static async delete(userId) {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('users').deleteOne({ ownerId: userId });

      if (result.deletedCount === 0) {
        throw new NotFoundError('User');
      }

      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to delete user', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Find sample user
   */
  static async findSampleUser() {
    try {
      const { db } = await connectToDatabase();
      
      const user = await db.collection('users').findOne({ ownerId: 'sample-user-123' });

      if (!user) {
        throw new NotFoundError('Sample user');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to fetch sample user', 500, 'DATABASE_ERROR');
    }
  }
} 