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
import { UserService } from '../../../lib/services/userService.js';

// GET - 获取用户profile
async function getUserProfileHandler(req, res) {
  const userId = req.user.id;

  try {
    const userProfile = await UserService.getUserProfile(userId);
    return res.status(200).json(
      ApiResponse.success(userProfile, 'User profile fetched successfully')
    );
  } catch (error) {
    if (error.statusCode === 404 || error.name === 'NotFoundError') {
      return res.status(404).json(
        ApiResponse.error('User profile not found', 404, 'PROFILE_NOT_FOUND')
      );
    }
    throw error;
  }
}

// POST - 创建用户profile
async function createProfileHandler(req, res) {
  const userId = req.user.id;
  const profileData = req.body; // Use req.body directly since we don't have validation middleware

  console.log('createProfileHandler - userId:', userId);
  console.log('createProfileHandler - profileData:', JSON.stringify(profileData, null, 2));

  const result = await UserService.createProfile(userId, profileData);
  
  return res.status(201).json(
    ApiResponse.success(result, 'User profile created successfully')
  );
}

// PUT - 更新现有用户profile
async function updateProfileHandler(req, res) {
  const userId = req.user.id;
  const profileData = req.body; // Use req.body directly since we don't have validation middleware

  const result = await UserService.updateProfile(userId, profileData);
  
  return res.status(200).json(
    ApiResponse.success(result, 'User profile updated successfully')
  );
}

// PATCH - 刷新LinkedIn数据
async function refreshLinkedInDataHandler(req, res) {
  const userId = req.user.id;

  const result = await UserService.refreshLinkedInData(userId);
  
  return res.status(200).json(
    ApiResponse.success(result, 'LinkedIn data refreshed successfully')
  );
}

// 根据HTTP方法路由到不同的处理器
async function profileHandler(req, res) {
  switch (req.method) {
    case 'GET':
      return getUserProfileHandler(req, res);
    case 'POST':
      return createProfileHandler(req, res);
    case 'PUT':
      return updateProfileHandler(req, res);
    case 'PATCH':
      return refreshLinkedInDataHandler(req, res);
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
  withMethod(['GET', 'POST', 'PUT', 'PATCH']) // 支持多种方法
)(profileHandler); 