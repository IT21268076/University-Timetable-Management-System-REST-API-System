// routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/notifications', notificationController.createNotification);
router.get('/notifications/:userId', notificationController.getNotificationsForUser);
router.put('/notifications/:notificationId', notificationController.markNotificationAsRead);

module.exports = router;
