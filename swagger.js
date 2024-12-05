const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'University Timetable Management APIs',
      version: '1.0.0',
      description: 'University timetable mangement system apis',
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            // Define properties of the User model
            // For example:
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            // Add more properties as needed
          },
        },
        Booking: {
          type: 'object',
          properties: {
            roomId: {
              type: 'string',
              description: 'The ID of the room for the booking.',
            },
            resourceId: {
              type: 'string',
              description: 'The ID of the resource for the booking.',
            },
            // Add other attributes of the Booking model here
          },
        },
      },
    },
  },
  apis: ['./src/Routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs));

module.exports = router;