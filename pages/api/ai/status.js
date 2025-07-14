import { 
  composeMiddleware, 
  withAuth, 
  withMethod, 
  withLogging, 
  withErrorHandling,
  withCORS
} from '../../../lib/middleware/apiMiddleware.js';
import { ApiResponse } from '../../../lib/utils/apiResponse.js';
import { AIService } from '../../../lib/services/aiService.js';

// GET - Check AI service status
async function getAIStatusHandler(req, res) {
  try {
    const status = AIService.getServiceStatus();
    
    return res.status(200).json(
      ApiResponse.success(status, 'AI service status retrieved successfully')
    );
  } catch (error) {
    console.error('AI status check error:', error);
    return res.status(500).json(
      ApiResponse.error('Failed to check AI service status', 500, 'STATUS_CHECK_ERROR')
    );
  }
}

// POST - Test AI service connection
async function testAIConnectionHandler(req, res) {
  try {
    const testResult = await AIService.testConnection();
    
    return res.status(200).json(
      ApiResponse.success(testResult, 'AI service connection test completed')
    );
  } catch (error) {
    console.error('AI connection test error:', error);
    return res.status(500).json(
      ApiResponse.error('Failed to test AI service connection', 500, 'CONNECTION_TEST_ERROR')
    );
  }
}

// Route handler
async function aiStatusHandler(req, res) {
  switch (req.method) {
    case 'GET':
      return getAIStatusHandler(req, res);
    case 'POST':
      return testAIConnectionHandler(req, res);
    default:
      return res.status(405).json(
        ApiResponse.error('Method not allowed', 405, 'METHOD_NOT_ALLOWED')
      );
  }
}

// Apply middleware
export default composeMiddleware(
  withErrorHandling,
  withLogging,
  withCORS,
  withAuth,
  withMethod(['GET', 'POST'])
)(aiStatusHandler); 