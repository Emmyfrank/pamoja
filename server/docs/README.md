# Pamoja Health API Documentation

This folder contains the API documentation for the Pamoja Health backend.

## Documentation Access

The API documentation is available via Swagger UI at:

- **Development**: http://localhost:4000/api-docs
- **Production**: https://api.pamoja.health/api-docs

## Documentation Structure

- `swagger.yaml` - OpenAPI 3.0 specification file
- `README.md` - This file with documentation information

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /anonymous-session` - Generate anonymous session
- `GET /me` - Get current user information (requires authentication)

### Chat (`/api/v1/chat`)
- `POST /` - Send a message to the chatbot
- `GET /` - Get conversation history
- `DELETE /` - Clear conversation history (requires authentication)

### Community (`/api/v1/community`)
- Community questions and discussions endpoints

### Learning Materials (`/api/v1/learning-materials`)
- Educational content management endpoints

### Suggestions (`/api/v1/suggestions`)
- User feedback and suggestions endpoints

### Testimonials (`/api/v1/testimonials`)
- User testimonials endpoints

### Admin (`/api/v1/admin`)
- Administrative endpoints (Admin only)
  - `GET /stats` - Get site statistics
  - `GET /dashboard` - Get dashboard analytics
  - `GET /users` - Get all users
  - `GET /suggestions` - Get all suggestions
  - Analytics endpoints for various metrics

### WhatsApp (`/api/v1/whatsapp`)
- WhatsApp integration endpoints

### Moderation (`/api/v1/moderation`)
- Content moderation endpoints

## Authentication

Most endpoints require authentication using JWT Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

Tokens are obtained from the `/api/v1/auth/login` endpoint.

## Documentation Updates

The Swagger documentation is generated from JSDoc comments in the controller files. To update documentation:

1. Add or update JSDoc comments in controller files using Swagger/OpenAPI format
2. The documentation will automatically update when the server restarts

## Swagger Configuration

The Swagger configuration is in `server/utils/swaggerOptions.js`. It includes:
- API information and metadata
- Server configurations
- Tag definitions
- Component schemas
- Security schemes

