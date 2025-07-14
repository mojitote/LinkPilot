import { 
  composeMiddleware, 
  withAuth, 
  withMethod, 
  withValidation, 
  withLogging, 
  withErrorHandling,
  withCORS,
  validationSchemas 
} from '../../../lib/middleware/apiMiddleware.js';
import { ApiResponse } from '../../../lib/utils/apiResponse.js';
import { ScraperService } from '../../../lib/services/scraperService.js';

// Business logic handler - clean and focused
async function scrapeProfileHandler(req, res) {
  const { url } = req.validatedData; // Data already validated by middleware
  const userId = req.user.id; // User already authenticated by middleware

  const result = await ScraperService.scrapeProfile(url);
  
  // Check if this is partial data (scraping failed)
  if (result.partial) {
    return res.status(200).json(
      ApiResponse.success(result, 'Partial data retrieved. Please complete manually.')
    );
  }
  
  return res.status(200).json(
    ApiResponse.success(result, 'Profile scraped successfully')
  );
}

// Apply middleware chain - handles all the boilerplate
export default composeMiddleware(
  withErrorHandling,        // Global error handling
  withLogging,             // Request/response logging
  withCORS,               // CORS handling
  withValidation(validationSchemas.linkedinUrl, 'body'), // Input validation
  withAuth,               // Authentication
  withMethod('POST')      // Method validation
)(scrapeProfileHandler); 