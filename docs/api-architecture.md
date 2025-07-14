# LinkPilot API Architecture

## Overview

LinkPilot follows a clean, layered architecture with clear separation of concerns:

```
┌─────────────────┐
│   API Routes    │  ← HTTP endpoints with middleware
├─────────────────┤
│   Services      │  ← Business logic layer
├─────────────────┤
│  Repositories   │  ← Data access layer
├─────────────────┤
│   Database      │  ← MongoDB
└─────────────────┘
```

## API Endpoints

### User Management
- `GET/POST/PUT/PATCH /api/user/profile` - User profile operations
- `GET /api/user/sample-data` - Get sample data for demo
- `POST /api/user/scrape` - Scrape LinkedIn profile

### Contact Management
- `GET/POST/PUT/DELETE /api/contact` - Unified contact operations
  - GET: List contacts with pagination and search
  - POST: Create new contact
  - PUT: Update contact
  - DELETE: Delete contact

### Message Management
- `GET/POST/PUT/DELETE /api/message` - Unified message operations
  - GET: Get messages (all or by contact)
  - POST: Add new message
  - PUT: Update message
  - DELETE: Delete message

## Architecture Layers

### 1. API Routes Layer (`pages/api/`)
- **Purpose**: HTTP request handling and response formatting
- **Responsibilities**:
  - HTTP method validation
  - Request/response formatting
  - Middleware composition
  - Error handling

**Key Features**:
- Unified middleware chain for all endpoints
- Consistent error responses
- Input validation
- Authentication
- CORS handling
- Rate limiting
- Logging

### 2. Service Layer (`lib/services/`)
- **Purpose**: Business logic implementation
- **Responsibilities**:
  - Business rules validation
  - Data transformation
  - Cross-repository operations
  - External service integration

**Services**:
- `UserService`: User profile management
- `ContactService`: Contact CRUD operations
- `MessageService`: Message management
- `ScraperService`: LinkedIn data scraping

### 3. Repository Layer (`lib/repositories/`)
- **Purpose**: Data access abstraction
- **Responsibilities**:
  - Database operations
  - Query optimization
  - Data mapping
  - Connection management

**Repositories**:
- `UserRepository`: User data operations
- `ContactRepository`: Contact data operations
- `MessageRepository`: Message data operations

### 4. Utilities Layer (`lib/utils/`)
- **Purpose**: Shared utilities and helpers
- **Components**:
  - `ApiResponse`: Standardized API response formatting
  - `apiMiddleware`: Middleware composition utilities

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  linkedinProfile: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Contacts Collection
```javascript
{
  _id: ObjectId,
  ownerId: String,
  linkedin_id: String,
  name: String,
  headline: String,
  avatarUrl: String,
  about: String,
  experience: Array,
  education: Array,
  scrapedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  ownerId: String,
  contactId: String, // LinkedIn ID of the contact
  content: String,
  role: String, // 'user' or 'contact'
  createdAt: Date,
  updatedAt: Date
}
```

## Middleware Chain

All API endpoints use a consistent middleware chain:

```javascript
composeMiddleware(
  withErrorHandling,        // Global error handling
  withLogging,             // Request/response logging
  withCORS,               // CORS handling
  withAuth,               // Authentication
  withMethod(['GET', 'POST', 'PUT', 'DELETE']) // Method validation
)(handler)
```

## Error Handling

### Standardized Error Responses
```javascript
{
  success: false,
  error: {
    message: "Error description",
    code: "ERROR_CODE",
    status: 400
  }
}
```

### Error Types
- `AppError`: General application errors
- `NotFoundError`: Resource not found
- `ValidationError`: Input validation errors
- `AuthenticationError`: Authentication failures

## Security Features

1. **Authentication**: NextAuth.js integration
2. **Authorization**: User-based access control
3. **Input Validation**: Joi schema validation
4. **Rate Limiting**: Request rate limiting
5. **CORS**: Cross-origin resource sharing
6. **Error Sanitization**: Safe error messages

## Performance Optimizations

1. **Database Indexing**: Compound indexes on frequently queried fields
2. **Connection Pooling**: MongoDB connection reuse
3. **Pagination**: Efficient data pagination
4. **Caching**: Response caching where appropriate
5. **Query Optimization**: Efficient database queries

## Development Guidelines

### Adding New Endpoints
1. Create route file in `pages/api/`
2. Implement service method in `lib/services/`
3. Add repository methods if needed
4. Update validation schemas
5. Add tests

### Code Standards
- Use ES6+ features
- Follow consistent naming conventions
- Add comprehensive error handling
- Include JSDoc comments
- Write unit tests

### Database Operations
- Always use repositories for data access
- Implement proper error handling
- Use transactions for multi-document operations
- Optimize queries with proper indexing

## Removed Legacy Code

The following redundant endpoints were removed:
- `pages/api/message/fetch.js` → Replaced by `/api/message` GET
- `pages/api/message/save.js` → Replaced by `/api/message` POST
- `pages/api/message/generate.js` → Removed (unused)
- `pages/api/contact/fetch-all.js` → Replaced by `/api/contact` GET
- `pages/api/contact/save.js` → Replaced by `/api/contact` POST

## Benefits of This Architecture

1. **Maintainability**: Clear separation of concerns
2. **Scalability**: Modular design allows easy scaling
3. **Testability**: Each layer can be tested independently
4. **Consistency**: Standardized patterns across all endpoints
5. **Security**: Built-in security features
6. **Performance**: Optimized database operations
7. **Developer Experience**: Clear structure and documentation 