// logger.js

const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to error.log file
    new winston.transports.File({ filename: 'combined.log' }) // Log all levels to combined.log file
  ]
});

module.exports = logger;
