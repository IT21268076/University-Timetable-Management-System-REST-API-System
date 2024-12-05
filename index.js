require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Sanitize request data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// Custom Middleware
const authMiddleware = require('./src/Middlewares/authMiddleware');
const authzMiddleware = require('./src/Middlewares/authzMiddleware');
const validationMiddleware = require('./src/Middlewares/validationMiddleware');
const errorMiddleware = require('./src/Middlewares/errorMiddleware');

// Routes
const courseRoutes = require('./src/Routes/courseRoutes');
const timetableRoutes = require('./src/Routes/timetableRoutes');
const bookingRoutes = require('./src/Routes/bookingRoutes');
const enrollmentRoutes = require('./src/Routes/enrollmentRoutes');
const notificationRoutes = require('./src/Routes/notificationRoutes');
const authRoutes = require('./src/Routes/authRoutes');
const userRoutes = require('./src/Routes/userRoutes');
const swaggerSetup = require('./swagger');

app.use('/api-docs', swaggerSetup);

// Apply Middleware to Relevant Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', validationMiddleware, userRoutes); // Apply validationMiddleware to userRoutes
app.use('/api', authMiddleware, courseRoutes); // Apply authMiddleware to courseRoutes
app.use('/api', authMiddleware, timetableRoutes); // Apply authMiddleware to timetableRoutes
app.use('/api', authMiddleware, bookingRoutes); // Apply authMiddleware to bookingRoutes
app.use('/api', authMiddleware, enrollmentRoutes); // Apply authMiddleware to enrollmentRoutes
app.use('/api', authMiddleware, notificationRoutes); // Apply authMiddleware to notificationRoutes


// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express app
module.exports = app;