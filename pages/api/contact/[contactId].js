import { 
  composeMiddleware, 
  withAuth, 
  withMethod, 
  withValidation, 
  withLogging, 
  withErrorHandling,
  withCORS
} from '../../../lib/middleware/apiMiddleware.js';
import { ApiResponse } from '../../../lib/utils/apiResponse.js';
import { ContactService } from '../../../lib/services/contactService.js';

// GET - Get specific contact
async function getContactHandler(req, res) {
  const userId = req.user.id;
  const { contactId } = req.query;

  const contact = await ContactService.getContactById(contactId, userId);
  
  return res.status(200).json(
    ApiResponse.success(contact, 'Contact fetched successfully')
  );
}

// PUT - Update specific contact
async function updateContactHandler(req, res) {
  const userId = req.user.id;
  const { contactId } = req.query;
  const updateData = req.body;

  const contact = await ContactService.updateContact(userId, contactId, updateData);
  
  return res.status(200).json(
    ApiResponse.success(contact, 'Contact updated successfully')
  );
}

// DELETE - Delete specific contact
async function deleteContactHandler(req, res) {
  const userId = req.user.id;
  const { contactId } = req.query;

  await ContactService.deleteContact(userId, contactId);
  
  return res.status(200).json(
    ApiResponse.success(null, 'Contact deleted successfully')
  );
}

// Route handler based on HTTP method
async function contactHandler(req, res) {
  switch (req.method) {
    case 'GET':
      return getContactHandler(req, res);
    case 'PUT':
      return updateContactHandler(req, res);
    case 'DELETE':
      return deleteContactHandler(req, res);
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
  withMethod(['GET', 'PUT', 'DELETE']) // Supported methods
)(contactHandler); 