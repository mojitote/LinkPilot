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
import { MessageService } from '../../../lib/services/messageService.js';

// GET - 获取消息
async function getMessagesHandler(req, res) {
  const userId = req.user.id;
  const { contactId, page = 1, limit = 50 } = req.query;

  let result;
  
  if (contactId) {
    // 获取特定联系人的消息
    result = await MessageService.getMessagesByContact(
      contactId, 
      userId, 
      parseInt(page), 
      parseInt(limit)
    );
  } else {
    // 获取用户的所有消息
    result = await MessageService.getAllMessages(
      userId, 
      parseInt(page), 
      parseInt(limit)
    );
  }
  
  return res.status(200).json(
    ApiResponse.success(result, 'Messages fetched successfully')
  );
}

// POST - 添加新消息
async function addMessageHandler(req, res) {
  const { contactId, content, role } = req.body;
  const userId = req.user.id;

  const message = await MessageService.addMessage(
    { contactId, content, role },
    userId
  );
  
  return res.status(201).json(
    ApiResponse.success(message, 'Message added successfully')
  );
}

// PUT - 更新消息
async function updateMessageHandler(req, res) {
  const userId = req.user.id;
  const { messageId } = req.query;
  const updateData = req.body;

  const result = await MessageService.updateMessage(messageId, updateData, userId);
  
  return res.status(200).json(
    ApiResponse.success(result, 'Message updated successfully')
  );
}

// DELETE - 删除消息
async function deleteMessageHandler(req, res) {
  const userId = req.user.id;
  const { messageId } = req.query;

  await MessageService.deleteMessage(messageId, userId);
  
  return res.status(200).json(
    ApiResponse.success(null, 'Message deleted successfully')
  );
}

// 根据HTTP方法路由到不同的处理器
async function messageHandler(req, res) {
  switch (req.method) {
    case 'GET':
      return getMessagesHandler(req, res);
    case 'POST':
      return addMessageHandler(req, res);
    case 'PUT':
      return updateMessageHandler(req, res);
    case 'DELETE':
      return deleteMessageHandler(req, res);
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
)(messageHandler); 