const Booking = require('../Models/Booking');
const logger = require('../logger');

exports.createBooking = async (bookingData) => {
  try {
    logger.info('craeteBookiing - Function entered');
    // Check for conflicts with existing room bookings
    const existingBookings = await Booking.find({
      roomId: bookingData.roomId,
      startTime: { $lt: bookingData.endTime },
      endTime: { $gt: bookingData.startTime }
    });
    
    if (existingBookings.length > 0) {
      throw new Error('Scheduling conflict: Room is already booked for this time slot');
    }

    // Create the new booking
    const booking = new Booking(bookingData);
    await booking.save();

    logger.info('createBooking - Function completed successfully');
    return booking;
  } catch (error) {
    logger.error(`createBooking - Error: ${error.message}`);
    throw new Error(error.message);
  }
};

exports.updateBooking = async (bookingId, newData) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check for conflicts with existing room bookings
    const existingBookings = await Booking.find({
      roomId: newData.roomId,
      startTime: { $lt: newData.endTime },
      endTime: { $gt: newData.startTime },
      _id: { $ne: bookingId } // Exclude the current booking from the query
    });

    if (existingBookings.length > 0) {
      throw new Error('Scheduling conflict: Room is already booked for this time slot');
    }

    Object.assign(booking, newData);
    await booking.save();
    return booking;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteBooking = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    await booking.remove();
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllBookings = async () => {
  try {
    const bookings = await Booking.find();
    return bookings;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createBooking = async (bookingData) => {
  try {
    // Check for overlapping bookings for rooms
    const overlappingRoomBooking = await Booking.findOne({
      room: bookingData.room,
      $or: [
        { startTime: { $lt: bookingData.endTime }, endTime: { $gt: bookingData.startTime } },
        { startTime: { $gte: bookingData.startTime, $lt: bookingData.endTime } },
        { endTime: { $gt: bookingData.startTime, $lte: bookingData.endTime } }
      ]
    });

    if (overlappingRoomBooking) {
      throw new Error('Room is already booked during the specified time range.');
    }

    // Check for overlapping bookings for resources
    const overlappingResourceBooking = await Booking.findOne({
      resource: bookingData.resource,
      $or: [
        { startTime: { $lt: bookingData.endTime }, endTime: { $gt: bookingData.startTime } },
        { startTime: { $gte: bookingData.startTime, $lt: bookingData.endTime } },
        { endTime: { $gt: bookingData.startTime, $lte: bookingData.endTime } }
      ]
    });

    if (overlappingResourceBooking) {
      throw new Error('Resource is already booked during the specified time range.');
    }

    // Create the booking if no overlapping bookings
    const booking = new Booking(bookingData);
    await booking.save();
    return booking;
  } catch (error) {
    throw new Error(error.message);
  }
};