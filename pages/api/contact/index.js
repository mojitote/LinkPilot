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
import { ContactService } from '../../../lib/services/contactService.js';

// GET - 获取用户的所有联系人
async function getContactsHandler(req, res) {
  const userId = req.user.id;
  const { page = 1, limit = 50, search } = req.query;

  const result = await ContactService.getContacts(
    userId, 
    parseInt(page), 
    parseInt(limit),
    search
  );
  
  return res.status(200).json(
    ApiResponse.success(result, 'Contacts fetched successfully')
  );
}

// POST - 创建新联系人
async function createContactHandler(req, res) {
  const userId = req.user.id;
  const contactData = req.body;

  const contact = await ContactService.createContact(userId, contactData);
  
  return res.status(201).json(
    ApiResponse.success(contact, 'Contact created successfully')
  );
}

// PUT - 更新联系人
async function updateContactHandler(req, res) {
  const userId = req.user.id;
  const { contactId } = req.query;
  const updateData = req.body;

  const contact = await ContactService.updateContact(userId, contactId, updateData);
  
  return res.status(200).json(
    ApiResponse.success(contact, 'Contact updated successfully')
  );
}

// DELETE - 删除联系人
async function deleteContactHandler(req, res) {
  const userId = req.user.id;
  const { contactId } = req.query;

  await ContactService.deleteContact(userId, contactId);
  
  return res.status(200).json(
    ApiResponse.success(null, 'Contact deleted successfully')
  );
}

// 根据HTTP方法路由到不同的处理器
async function contactHandler(req, res) {
  switch (req.method) {
    case 'GET':
      return getContactsHandler(req, res);
    case 'POST':
      return createContactHandler(req, res);
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

// 应用中间件链
export default composeMiddleware(
  withErrorHandling,        // 全局错误处理
  withLogging,             // 请求/响应日志
  withCORS,               // CORS处理
  withAuth,               // 认证
  withMethod(['GET', 'POST', 'PUT', 'DELETE']) // 支持多种方法
)(contactHandler); 