const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Test API",
      version: "1.0.0",
      description: "API documentation for the Test API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            code: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            usernname: { type: 'string' },
            password: { type: 'string' },
          },
        },
        Company: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Company Name' },
            shortName: { type: 'string', example: 'Company Short Name' },
            businessEntity: { type: 'string', example: 'Company Business Entity' },
            address: { type: 'string', example: 'Company Address' },
            contract: {
              type: 'object',
              properties: {
                no: { type: 'string', example: 'Company Contract No' },
                issue_date: { type: 'string', format: 'date-time', example: '2023-01-01' },
              },
            },
            type: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['agent', 'contractor'],
              },
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
            },
            photos: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Photo Name' },
                  filepath: { type: 'string', example: 'Photo File Path' },
                  thumbpath: { type: 'string', example: 'Photo Thumbnail Path' },
                },
              },
            },
          },
        },
        Contact: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            lastName: { type: 'string', example: 'Smith' },
            firstName: { type: 'string', example: 'John' },
            middleName: { type: 'string', example: 'Robert' },
            phone: { type: 'string', example: '+1 (555) 123-4567' },
            email: { type: 'string', example: 'john.smith@example.com' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, "./routes/*.routes.js"),
  ],
};

module.exports = swaggerJsdoc(options);
