/**
 * User Service Layer
 * Handles all user-related business logic
 */

import { UserRepository } from '../repositories/userRepository.js';
import { ContactRepository } from '../repositories/contactRepository.js';
import { MessageRepository } from '../repositories/messageRepository.js';
import { ScraperService } from './scraperService.js';
import { AppError } from '../utils/apiResponse.js';

export class UserService {
  /**
   * Create new user profile
   */
  static async createProfile(userId, profileData) {
    try {
      // check if user exists
      const userExists = await UserRepository.exists(userId);
      if (userExists) {
        throw new AppError('User profile already exists', 400, 'USER_ALREADY_EXISTS');
      }

      // Prepare user data
      const userData = {
        ownerId: userId,
        name: profileData.name ,
        about: profileData?.about,
        headline: profileData?.headline,
        avatarUrl: profileData?.avatarUrl,
        linkedinUrl: profileData.linkedinUrl,
        experience: profileData?.experience,
        education: profileData?.education,
        scrapedAt: profileData?.scrapedAt
      };

      // 创建新用户
      const user = await UserRepository.create(userData);

      return {
        user,
        message: 'User profile created successfully'
      };
    } catch (error) {
      console.error('UserService.createProfile error:', {
        error: error.message,
        stack: error.stack,
        userId,
        profileData: JSON.stringify(profileData, null, 2)
      });
      
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create user profile', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId) {
    return await UserRepository.findById(userId);
  }

  /**
   * Update user profile (existing user only)
   */
  static async updateProfile(userId, profileData) {
    const user = await UserRepository.update(userId, profileData);
    return { user, modifiedCount: 1 };
  }

  /**
   * Refresh user's LinkedIn data
   */
  static async refreshLinkedInData(userId) {
    try {
      // 获取用户当前的LinkedIn URL
      const user = await UserRepository.findById(userId);
      
      if (!user.linkedinUrl) {
        throw new AppError('No LinkedIn URL found for user', 400, 'MISSING_LINKEDIN_URL');
      }

      // Refresh LinkedIn data
      const scrapedData = await ScraperService.scrapeProfile(user.linkedinUrl);

      // Update user data
      const updatedUser = await UserRepository.update(userId, {
        headline: scrapedData.headline,
        avatarUrl: scrapedData.avatarUrl,
        about: scrapedData.about,
        experience: scrapedData.experience,
        education: scrapedData.education,
        scrapedAt: scrapedData.scrapedAt
      });

      return { success: true, user: updatedUser, scrapedData };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to refresh LinkedIn data', 500, 'SCRAPER_ERROR');
    }
  }

  /**
   * Get sample data for demo
   */
  static async getSampleData() {
    try {
      const user = await UserRepository.findSampleUser();
      const contacts = await ContactRepository.findSampleContacts();
      const messages = await MessageRepository.findSampleMessages();

      return {
        user,
        contacts,
        messages
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch sample data', 500, 'DATABASE_ERROR');
    }
  }
} 