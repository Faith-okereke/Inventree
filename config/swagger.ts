import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../package.json';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventree API',
      version,
      description: 'API documentation for the Inventree E-commerce and Inventory Management System.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.ts', './docs/*.yaml'],
};

export const swaggerSpec = swaggerJSDoc(options);