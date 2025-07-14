import { 
  composeMiddleware, 
  withAuth, 
  withMethod, 
  withLogging, 
  withErrorHandling,
  withCORS
} from '../../../lib/middleware/apiMiddleware.js';
import { ApiResponse } from '../../../lib/utils/apiResponse.js';
import { MessageGenerationService } from '../../../lib/services/messageGenerationService.js';

// POST - Generate message content
async function generateMessageHandler(req, res) {
  const userId = req.user.id;
  const { contactId, context } = req.body;

  try {
    // Validate required fields
    if (!contactId) {
      return res.status(400).json(
        ApiResponse.error('Contact ID is required', 400, 'VALIDATION_ERROR')
      );
    }

    // Generate message using AI service
    const result = await MessageGenerationService.generateMessage(contactId, userId, context);

    return res.status(200).json(
      ApiResponse.success(result, 'Message generated successfully')
    );
  } catch (error) {
    console.error('Message generation error:', error);
    
    if (error.statusCode) {
      return res.status(error.statusCode).json(
        ApiResponse.error(error.message, error.statusCode, error.errorCode)
      );
    }
    
    return res.status(500).json(
      ApiResponse.error('Failed to generate message', 500, 'GENERATION_ERROR')
    );
  }
}

// Route based on HTTP method
async function generateHandler(req, res) {
  switch (req.method) {
    case 'POST':
      return generateMessageHandler(req, res);
    default:
      return res.status(405).json(
        ApiResponse.error('Method not allowed', 405, 'METHOD_NOT_ALLOWED')
      );
  }
}

// Apply middleware chain
export default composeMiddleware(
  withErrorHandling,        // Global error handling
  withLogging,             // Request/response logging
  withCORS,               // CORS handling
  withAuth,               // Authentication
  withMethod(['POST'])    // Only support POST method
)(generateHandler); 