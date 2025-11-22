export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pamoja Health API",
      version: "1.0.0",
      description: `
        Comprehensive API documentation for Pamoja Health platform.
        
        ## Authentication
        Most endpoints require authentication using Bearer tokens. Include the token in the Authorization header:
        \`\`\`
        Authorization: Bearer <your-token>
        \`\`\`
        
        ## Base URL
        - Development: http://localhost:4000/api/v1
        - Production: https://api.pamoja.health/api/v1
      `,
      contact: {
        name: "Pamoja Health Support",
        email: "support@pamoja.health",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:4000/api/v1",
        description: "Development server",
      },
      {
        url: "https://api.pamoja.health/api/v1",
        description: "Production server",
      },
    ],
    tags: [
      { name: "Authentication", description: "User authentication and session management" },
      { name: "Chat", description: "AI chatbot and conversation management" },
      { name: "Community", description: "Community questions and discussions" },
      { name: "Learning Materials", description: "Educational content management" },
      { name: "Suggestions", description: "User feedback and suggestions" },
      { name: "Testimonials", description: "User testimonials" },
      { name: "Admin", description: "Administrative endpoints (Admin only)" },
      { name: "WhatsApp", description: "WhatsApp integration endpoints" },
      { name: "Moderation", description: "Content moderation endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token obtained from login endpoint",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", description: "User ID" },
            username: { type: "string", description: "Username" },
            isAnonymous: { type: "boolean", description: "Whether the user is anonymous" },
            role: { type: "string", enum: ["USER", "ADMIN"], description: "User role" },
            createdAt: { type: "string", format: "date-time", description: "Account creation date" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", description: "Error message" },
            error: { type: "string", description: "Error details" },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", description: "Success message" },
            data: { type: "object", description: "Response data" },
          },
        },
      },
    },
  },
  apis: [
    "./controllers/*.js",
    "./routes/*.js",
    "./docs/*.yaml",
  ],
};
