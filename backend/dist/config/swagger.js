"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const package_json_1 = require("../package.json");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Inventree API',
            version: package_json_1.version,
            description: 'API documentation for the Inventree E-commerce and Inventory Management System.',
        },
        // Swagger UI renders tag groups in this order, so declaring them here
        // controls the sidebar order regardless of which file each path lives in.
        tags: [
            { name: 'Auth', description: 'Registration, login, and password reset' },
            { name: 'Users', description: 'User management (admin only)' },
            { name: 'Products', description: 'Product catalogue and inventory' },
            { name: 'Orders', description: 'Customer orders and fulfilment' },
        ],
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
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
