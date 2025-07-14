/**
 * Unified API Response Handler
 * Provides consistent response format across all API endpoints
 */

export class ApiResponse {
  static success(data, message = "Operation successful") {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
  }

  static error(message, statusCode = 500, errorCode = "INTERNAL_ERROR", details = null) {
    return {
      success: false,
      error: {
        code: errorCode,
        message,
        details
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
  }

  static validationError(errors) {
    return this.error(
      "Validation failed",
      400,
      "VALIDATION_ERROR",
      errors
    );
  }

  static notFound(resource = "Resource") {
    return this.error(
      `${resource} not found`,
      404,
      "NOT_FOUND"
    );
  }

  static unauthorized() {
    return this.error(
      "Unauthorized",
      401,
      "UNAUTHORIZED"
    );
  }

  static forbidden() {
    return this.error(
      "Forbidden",
      403,
      "FORBIDDEN"
    );
  }

  static rateLimitExceeded() {
    return this.error(
      "Rate limit exceeded",
      429,
      "RATE_LIMIT_EXCEEDED"
    );
  }

  static generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, "VALIDATION_ERROR");
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
} 