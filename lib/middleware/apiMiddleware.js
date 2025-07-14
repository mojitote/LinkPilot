/**
 * API Middleware System for Next.js Pages API
 * Provides reusable middleware for authentication, validation, error handling, etc.
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { ApiResponse, AppError } from '../utils/apiResponse.js';

/**
 * Compose multiple middleware functions
 * @param {...Function} middlewares - Middleware functions to compose
 * @returns {Function} Composed middleware function
 */
export function composeMiddleware(...middlewares) {
  return (handler) => {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, handler);
  };
}

/**
 * Authentication Middleware
 * Verifies user session and adds user info to request
 */
export function withAuth(handler) {
  return async (req, res) => {
    try {
      const session = await getServerSession(req, res, authOptions);
      
      if (!session) {
        return res.status(401).json(ApiResponse.unauthorized());
      }

      // Add user info to request
      req.user = session.user;
      req.session = session;
      
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json(ApiResponse.error('Authentication failed'));
    }
  };
}

/**
 * Method Validation Middleware
 * Ensures only specified HTTP methods are allowed
 */
export function withMethod(methods) {
  const allowedMethods = Array.isArray(methods) ? methods : [methods];
  
  return (handler) => {
    return async (req, res) => {
      if (!allowedMethods.includes(req.method)) {
        return res.status(405).json(
          ApiResponse.error(
            `Method ${req.method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
            405,
            'METHOD_NOT_ALLOWED'
          )
        );
      }
      
      return handler(req, res);
    };
  };
}

/**
 * Request Validation Middleware
 * Validates request body, query, or params against a schema
 */
export function withValidation(schema, location = 'body') {
  return (handler) => {
    return async (req, res) => {
      try {
        const data = req[location];
        
        if (!data) {
          return res.status(400).json(
            ApiResponse.error(
              `Missing ${location} data`,
              400,
              'VALIDATION_ERROR'
            )
          );
        }

        // Validate data against schema
        const validationResult = validateData(data, schema);
        
        if (!validationResult.isValid) {
          return res.status(400).json(
            ApiResponse.validationError(validationResult.errors)
          );
        }

        // Add validated data to request
        req.validatedData = validationResult.data;
        
        return handler(req, res);
      } catch (error) {
        console.error('Validation middleware error:', error);
        return res.status(500).json(ApiResponse.error('Validation failed'));
      }
    };
  };
}

/**
 * Rate Limiting Middleware
 * Basic in-memory rate limiting (in production, use Redis)
 */
export function withRateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  const requests = new Map();
  
  return (handler) => {
    return async (req, res) => {
      const clientId = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const now = Date.now();
      
      // Clean old entries
      for (const [key, timestamp] of requests.entries()) {
        if (now - timestamp > windowMs) {
          requests.delete(key);
        }
      }
      
      // Check rate limit
      const clientRequests = requests.get(clientId) || [];
      const recentRequests = clientRequests.filter(timestamp => now - timestamp < windowMs);
      
      if (recentRequests.length >= maxRequests) {
        return res.status(429).json(ApiResponse.rateLimitExceeded());
      }
      
      // Add current request
      recentRequests.push(now);
      requests.set(clientId, recentRequests);
      
      return handler(req, res);
    };
  };
}

/**
 * Logging Middleware
 * Logs request/response information
 */
export function withLogging(handler) {
  return async (req, res) => {
    const startTime = Date.now();
    const requestId = ApiResponse.generateRequestId();
    
    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);
    
    // Log request
    console.log({
      level: 'info',
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userId: req.user?.id || 'anonymous'
    });
    
    // Capture original send method
    const originalSend = res.send;
    
    // Override send to log response
    res.send = function(data) {
      const duration = Date.now() - startTime;
      
      console.log({
        level: 'info',
        timestamp: new Date().toISOString(),
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        userId: req.user?.id || 'anonymous'
      });
      
      return originalSend.call(this, data);
    };
    
    return handler(req, res);
  };
}

/**
 * Error Handling Middleware
 * Catches and formats all errors
 */
export function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json(
          ApiResponse.error(error.message, error.statusCode, error.errorCode)
        );
      }
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json(
          ApiResponse.validationError(error.details)
        );
      }
      
      // Handle database errors
      if (error.code === 11000) {
        return res.status(409).json(
          ApiResponse.error('Resource already exists', 409, 'DUPLICATE_ERROR')
        );
      }
      
      // Default error
      return res.status(500).json(
        ApiResponse.error('Internal server error')
      );
    }
  };
}

/**
 * CORS Middleware
 * Handles Cross-Origin Resource Sharing
 */
export function withCORS(handler) {
  return async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    return handler(req, res);
  };
}

/**
 * Simple validation function
 * In production, use a proper validation library like Joi or Zod
 */
function validateData(data, schema) {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    if (value !== undefined && value !== null) {
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
      }
      
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
      
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data
  };
}

/**
 * Common validation schemas
 */
export const validationSchemas = {
  linkedinUrl: {
    url: {
      required: true,
      type: 'string',
      pattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[^\/\s?]+(\/?.*)?$/
    }
  },
  
  messageContent: {
    content: {
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 1000
    },
    contactId: {
      required: true,
      type: 'string'
    },
    role: {
      required: false,
      type: 'string',
      enum: ['user', 'contact']
    }
  },
  
  userProfile: {
    name: {
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 100
    },
    email: {
      required: true,
      type: 'string',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    linkedinUrl: {
      required: false,
      type: 'string',
      pattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[^\/\s?]+(\/?.*)?$/
    }
  }
}; 