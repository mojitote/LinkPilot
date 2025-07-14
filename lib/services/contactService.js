/**
 * Contact Service Layer
 * Handles all contact-related business logic
 */

import { ContactRepository } from '../repositories/contactRepository.js';
import { ScraperService } from './scraperService.js';
import { AppError, NotFoundError } from '../utils/apiResponse.js';

export class ContactService {


  /**
   * Get user's contacts with pagination and search
   */
  static async getContacts(userId, page = 1, limit = 20, search = null) {
    try {
      const skip = (page - 1) * limit;
      
      let criteria = { ownerId: userId };
      
      // Add search functionality
      if (search) {
        criteria.$or = [
          { name: { $regex: search, $options: 'i' } },
          { headline: { $regex: search, $options: 'i' } },
          { about: { $regex: search, $options: 'i' } }
        ];
      }

      const contacts = await ContactRepository.find(criteria, {
        sort: { createdAt: -1 },
        skip,
        limit
      });

      const total = await ContactRepository.count(criteria);

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
      throw new AppError('Failed to fetch contacts', 500, 'SERVICE_ERROR');
    }
  }

  /**
   * Create a new contact
   */
  static async createContact(userId, contactData) {
    try {
      // If URL is provided, scrape the profile first
      let scrapedData = null;
      if (contactData.url) {
        try {
          scrapedData = await ScraperService.scrapeProfile(contactData.url);
        } catch (error) {
          throw new AppError(`Failed to scrape LinkedIn profile: ${error.message}`, 400, 'SCRAPER_ERROR');
        }
      }

      // Use scraped data or provided data
      const finalContactData = scrapedData || contactData;

      // Check if contact already exists
      const existingContact = await ContactRepository.findByLinkedInId(
        finalContactData.linkedinId, 
        userId
      );

      if (existingContact) {
        throw new AppError('Contact already exists', 400, 'CONTACT_EXISTS');
      }

      const contact = await ContactRepository.create({
        linkedin_id: finalContactData.linkedinId,
        name: finalContactData.name,
        headline: finalContactData.headline,
        avatarUrl: finalContactData.avatarUrl,
        about: finalContactData.about,
        experience: finalContactData.experience,
        education: finalContactData.education,
        linkedinUrl: contactData.url || null,
        scrapedAt: finalContactData.scrapedAt,
        ownerId: userId
      });

      return contact;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create contact', 500, 'SERVICE_ERROR');
    }
  }

  /**
   * Get contact by ID
   */
  static async getContactById(contactId, userId) {
    try {
      const contact = await ContactRepository.findById(contactId, userId);
      
      if (!contact) {
        throw new NotFoundError('Contact');
      }

      return contact;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to fetch contact', 500, 'SERVICE_ERROR');
    }
  }

  /**
   * Update contact
   */
  static async updateContact(userId, contactId, updateData) {
    try {
      const contact = await ContactRepository.update(contactId, userId, updateData);
      
      if (!contact) {
        throw new NotFoundError('Contact');
      }

      return contact;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to update contact', 500, 'SERVICE_ERROR');
    }
  }

  /**
   * Delete contact
   */
  static async deleteContact(userId, contactId) {
    try {
      const result = await ContactRepository.delete(contactId, userId);
      
      if (!result) {
        throw new NotFoundError('Contact');
      }

      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to delete contact', 500, 'SERVICE_ERROR');
    }
  }

  /**
   * Refresh contact's LinkedIn data
   */
  static async refreshContactData(contactId, userId) {
    try {
      // 获取联系人信息
      const contact = await ContactRepository.findById(contactId, userId);
      
      if (!contact) {
        throw new NotFoundError('Contact');
      }
      
      if (!contact.linkedin_id) {
        throw new AppError('No LinkedIn ID found for contact', 400, 'MISSING_LINKEDIN_ID');
      }

      // Refresh LinkedIn data
      const scrapedData = await ScraperService.scrapeProfile(
        `https://linkedin.com/in/${contact.linkedin_id}`
      );

      // Update contact data
      const updatedContact = await ContactRepository.update(contactId, userId, {
        name: scrapedData.name,
        headline: scrapedData.headline,
        avatarUrl: scrapedData.avatarUrl,
        about: scrapedData.about,
        experience: scrapedData.experience,
        education: scrapedData.education,
        scrapedAt: scrapedData.scrapedAt
      });

      return { success: true, contact: updatedContact, scrapedData };
    } catch (error) {
      if (error instanceof AppError || error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to refresh contact data', 500, 'SCRAPER_ERROR');
    }
  }
} 