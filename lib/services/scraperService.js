/**
 * Scraper Service Layer
 * Handles all LinkedIn scraping business logic
 */

import { AppError } from '../utils/apiResponse.js';

export class ScraperService {
  /**
   * Scrape LinkedIn profile
   */
  static async scrapeProfile(url) {
    try {
      // Validate LinkedIn URL
      if (!url || !url.includes('linkedin.com/in/')) {
        throw new AppError('Invalid LinkedIn URL', 400, 'INVALID_URL');
      }

      // Extract LinkedIn ID from URL
      const linkedinId = url.split('/in/')[1]?.split('/')[0] || '';

      // Call scraper API
      const scraperResponse = await fetch(
        `${process.env.SCRAPER_API_URL || 'http://localhost:8000'}/scrape`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            url: url,
            type: 'profile'
          }),
        }
      );

      if (!scraperResponse.ok) {
        const errorData = await scraperResponse.json();
        console.error('Scraper API error:', errorData);
        
        // Return partial data for manual completion
        return {
          linkedinId: linkedinId,
          name: '',
          headline: '',
          avatarUrl: '',
          about: '',
          experience: { positions: [], institutions: [], dates: [] },
          education: { positions: [], institutions: [], dates: [] },
          scrapedAt: new Date(),
          error: errorData.detail || 'Failed to scrape profile',
          partial: true
        };
      }

      const profileData = await scraperResponse.json();

      // Check if scraping returned an error
      if (profileData.error) {
        console.error('Scraper returned error:', profileData.error);
        return {
          linkedinId: linkedinId,
          name: '',
          headline: '',
          avatarUrl: '',
          about: '',
          experience: { positions: [], institutions: [], dates: [] },
          education: { positions: [], institutions: [], dates: [] },
          scrapedAt: new Date(),
          error: profileData.error,
          partial: true
        };
      }

      return {
        linkedinId: profileData.linkedin_id || linkedinId,
        name: profileData.name || '',
        headline: profileData.headline || '',
        avatarUrl: profileData.avatar_url || '',
        about: profileData.about || '',
        experience: profileData.experience || { positions: [], institutions: [], dates: [] },
        education: profileData.education || { positions: [], institutions: [], dates: [] },
        scrapedAt: new Date(profileData.scraped_at) || new Date(),
        partial: false
      };
    } catch (error) {
      console.error('Scraper service error:', error);
      
      // Extract LinkedIn ID from URL for partial data
      const linkedinId = url.split('/in/')[1]?.split('/')[0] || '';
      
      if (error instanceof AppError) {
        // Return partial data with error
        return {
          linkedinId: linkedinId,
          name: '',
          headline: '',
          avatarUrl: '',
          about: '',
          experience: { positions: [], institutions: [], dates: [] },
          education: { positions: [], institutions: [], dates: [] },
          scrapedAt: new Date(),
          error: error.message,
          partial: true
        };
      }
      
      // Return partial data for unknown errors
      return {
        linkedinId: linkedinId,
        name: '',
        headline: '',
        avatarUrl: '',
        about: '',
        experience: { positions: [], institutions: [], dates: [] },
        education: { positions: [], institutions: [], dates: [] },
        scrapedAt: new Date(),
        error: 'Failed to scrape profile. Please try again or enter information manually.',
        partial: true
      };
    }
  }

  /**
   * Scrape LinkedIn company
   */
  static async scrapeCompany(url) {
    try {
      // Validate LinkedIn URL
      if (!url || !url.includes('linkedin.com/company/')) {
        throw new AppError('Invalid LinkedIn company URL', 400, 'INVALID_URL');
      }

      // Extract LinkedIn ID from URL
      const linkedinId = url.split('/company/')[1]?.split('/')[0] || '';

      // Call scraper API
      const scraperResponse = await fetch(
        `${process.env.SCRAPER_API_URL || 'http://localhost:8000'}/scrape`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            url: url,
            type: 'company'
          }),
        }
      );

      if (!scraperResponse.ok) {
        const errorData = await scraperResponse.json();
        console.error('Scraper API error:', errorData);
        
        // Return partial data for manual completion
        return {
          linkedinId: linkedinId,
          name: '',
          description: '',
          size: '',
          founded: '',
          website: '',
          scrapedAt: new Date(),
          error: errorData.detail || 'Failed to scrape company',
          partial: true
        };
      }

      const companyData = await scraperResponse.json();

      // Check if scraping returned an error
      if (companyData.error) {
        console.error('Scraper returned error:', companyData.error);
        return {
          linkedinId: linkedinId,
          name: '',
          description: '',
          size: '',
          founded: '',
          website: '',
          scrapedAt: new Date(),
          error: companyData.error,
          partial: true
        };
      }

      return {
        linkedinId: companyData.linkedin_id || linkedinId,
        name: companyData.name || '',
        description: companyData.description || '',
        size: companyData.size || '',
        founded: companyData.founded || '',
        website: companyData.website || '',
        scrapedAt: new Date(companyData.scraped_at) || new Date(),
        partial: false
      };
    } catch (error) {
      console.error('Scraper service error:', error);
      
      // Extract LinkedIn ID from URL for partial data
      const linkedinId = url.split('/company/')[1]?.split('/')[0] || '';
      
      if (error instanceof AppError) {
        // Return partial data with error
        return {
          linkedinId: linkedinId,
          name: '',
          description: '',
          size: '',
          founded: '',
          website: '',
          scrapedAt: new Date(),
          error: error.message,
          partial: true
        };
      }
      
      // Return partial data for unknown errors
      return {
        linkedinId: linkedinId,
        name: '',
        description: '',
        size: '',
        founded: '',
        website: '',
        scrapedAt: new Date(),
        error: 'Failed to scrape company. Please try again or enter information manually.',
        partial: true
      };
    }
  }
} 