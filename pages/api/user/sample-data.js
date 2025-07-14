import { 
  composeMiddleware, 
  withMethod, 
  withLogging, 
  withErrorHandling,
  withCORS 
} from '../../../lib/middleware/apiMiddleware.js';
import { ApiResponse } from '../../../lib/utils/apiResponse.js';
import { UserService } from '../../../lib/services/userService.js';

// Business logic handler - clean and focused
async function sampleDataHandler(req, res) {
  const sampleData = await UserService.getSampleData();
  
  // Organize messages by contact
  const messagesByContact = {};
  sampleData.messages.forEach(message => {
    if (!messagesByContact[message.contactId]) {
      messagesByContact[message.contactId] = [];
    }
    messagesByContact[message.contactId].push(message);
  });

  const responseData = {
    userProfile: sampleData.user,
    contacts: sampleData.contacts,
    messages: messagesByContact
  };

  return res.status(200).json(
    ApiResponse.success(responseData, 'Sample data fetched successfully')
  );
}

// Apply middleware chain - no auth needed for sample data
export default composeMiddleware(
  withErrorHandling,        // Global error handling
  withLogging,             // Request/response logging
  withCORS,               // CORS handling
  withMethod('GET')        // Method validation
)(sampleDataHandler); 