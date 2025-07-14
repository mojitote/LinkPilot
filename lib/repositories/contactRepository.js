/**
 * Contact Repository Layer
 * Handles all contact-related database operations
 */

import { connectToDatabase } from '../db.js';
import { AppError, NotFoundError } from '../utils/apiResponse.js';
import { ObjectId } from 'mongodb';

export class ContactRepository {
  /**
   * Create new contact
   */
  static async create(contactData) {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('contacts').insertOne({
        ...contactData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return await this.findById(result.insertedId, contactData.ownerId);
    } catch (error) {
      throw new AppError('Failed to create contact', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Find contacts by criteria
   */
  static async find(criteria, options = {}) {
    try {
      const { db } = await connectToDatabase();
      
      const {
        sort = { createdAt: -1 },
        skip = 0,
        limit = 50,
        projection = {}
      } = options;

      const contacts = await db.collection('contacts')
        .find(criteria, { projection })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();

      return contacts;
    } catch (error) {
      throw new AppError('Failed to find contacts', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Count contacts by criteria
   */
  static async count(criteria) {
    try {
      const { db } = await connectToDatabase();
      return await db.collection('contacts').countDocuments(criteria);
    } catch (error) {
      throw new AppError('Failed to count contacts', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Find contact by ID
   */
  static async findById(contactId, userId) {
    try {
      const { db } = await connectToDatabase();
      
      const contact = await db.collection('contacts').findOne({
        _id: new ObjectId(contactId),
        ownerId: userId
      });

      if (!contact) {
        throw new NotFoundError('Contact');
      }

      return contact;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to fetch contact', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Find contact by LinkedIn ID
   */
  static async findByLinkedInId(linkedinId, userId) {
    try {
      const { db } = await connectToDatabase();
      
      return await db.collection('contacts').findOne({
        linkedin_id: linkedinId,
        ownerId: userId
      });
    } catch (error) {
      throw new AppError('Failed to fetch contact by LinkedIn ID', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Get all contacts for a user with pagination
   */
  static async findByUserId(userId, page = 1, limit = 20) {
    try {
      const { db } = await connectToDatabase();
      
      const skip = (page - 1) * limit;
      
      const contacts = await db.collection('contacts')
        .find({ ownerId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('contacts')
        .countDocuments({ ownerId: userId });

      return {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new AppError('Failed to fetch contacts', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Update contact
   */
  static async update(contactId, userId, updateData) {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('contacts').updateOne(
        { 
          _id: new ObjectId(contactId),
          ownerId: userId
        },
        {
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new NotFoundError('Contact');
      }

      return await this.findById(contactId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to update contact', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Delete contact
   */
  static async delete(contactId, userId) {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('contacts').deleteOne({
        _id: new ObjectId(contactId),
        ownerId: userId
      });

      if (result.deletedCount === 0) {
        throw new NotFoundError('Contact');
      }

      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to delete contact', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Get sample contacts
   */
  static async findSampleContacts() {
    try {
      const { db } = await connectToDatabase();
      
      const contacts = await db.collection('contacts')
        .find({ ownerId: 'sample-user-123' })
        .sort({ createdAt: -1 })
        .toArray();

      return contacts;
    } catch (error) {
      throw new AppError('Failed to fetch sample contacts', 500, 'DATABASE_ERROR');
    }
  }
} 