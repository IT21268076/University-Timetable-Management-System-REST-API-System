const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in user
 *     description: Authenticate user with username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', authController.login);

module.exports = router;
