// controllers/notificationController.js

const notificationService = require('../Services/notificationService');

exports.createNotification = async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getNotificationsForUser = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsForUser(req.params.userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markNotificationAsRead(req.params.notificationId);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
