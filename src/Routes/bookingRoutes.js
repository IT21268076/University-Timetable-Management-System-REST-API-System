
/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Create a new booking with the provided roomId and resourceId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 description: The ID of the room for the booking.
 *               resourceId:
 *                 type: string
 *                 description: The ID of the resource for the booking.
 *     responses:
 *       201:
 *         description: Successfully created a new booking
 *       400:
 *         description: Bad request, invalid input data
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     description: Update an existing booking with the provided ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the booking to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 description: The new ID of the room for the booking.
 *               resourceId:
 *                 type: string
 *                 description: The new ID of the resource for the booking.
 *     responses:
 *       200:
 *         description: Successfully updated the booking
 *       400:
 *         description: Bad request, invalid input data
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

 /**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     description: Delete an existing booking with the provided ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the booking to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successfully deleted the booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

 /**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieve a list of all bookings
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController.js');
const authzMiddleware = require('../Middlewares/authzMiddleware');

router.post('/bookings', authzMiddleware(['Admin','Faculty']),bookingController.createBooking);
router.put('/bookings/:id', authzMiddleware(['Admin','Faculty']), bookingController.updateBooking);
router.delete('/bookings/:id', authzMiddleware(['Admin','Faculty']), bookingController.deleteBooking);
router.get('/bookings', authzMiddleware(['Admin','Faculty']), bookingController.getAllBookings);

module.exports = router;

