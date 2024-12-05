const Timetable = require('../Models/Timetable');
const Enrollment = require('../Models/Enrollment');
const User = require('../Models/User');
const nodemailer = require('nodemailer');
const {transporter} = require('../Services/notificationService');

exports.createTimetableEntry = async (timetableData) => {
  try {
    logger.info('createTimetableEntry - Function entered');
    // Check for conflicts with existing timetable entries
    const existingEntries = await Timetable.find({
      courseId: timetableData.courseId,
      day: timetableData.day,
      time: timetableData.time
    });

    if (existingEntries.length > 0) {
      throw new Error('Scheduling conflict: Timetable entry already exists for this course, day, and time');
    }

    // Create the new timetable entry
    const timetableEntry = new Timetable(timetableData);
    await timetableEntry.save();

    logger.info('createTimetableEntry - Timetable created successfully');
    return timetableEntry;
  } catch (error) {
    logger.error(`createTimetableEntry - Error: ${error.message}`);
    throw new Error(error.message);
  }
};

exports.updateTimetableEntry = async (timetableId, newData) => {
  try {
    const timetableEntry = await Timetable.findById(timetableId);
    if (!timetableEntry) {
      throw new Error('Timetable entry not found');
    }

    // Check for conflicts with existing timetable entries
    const existingEntries = await Timetable.find({
      courseId: newData.courseId,
      day: newData.day,
      time: newData.time,
      _id: { $ne: timetableId } // Exclude the current timetable entry from the query
    });

    if (existingEntries.length > 0) {
      throw new Error('Scheduling conflict: Timetable entry already exists for this course, day, and time');
    }

    Object.assign(timetableEntry, newData);
    await timetableEntry.save();
    return timetableEntry;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteTimetableEntry = async (timetableId) => {
  try {
    const timetableEntry = await Timetable.findById(timetableId);
    if (!timetableEntry) {
      throw new Error('Timetable entry not found');
    }

    await timetableEntry.remove();
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getTimetableForCourse = async (courseId) => {
  try {
    const timetableEntries = await Timetable.find({ courseId: courseId });
    return timetableEntries;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getTimetableForDay = async (day) => {
  try {
    const timetableEntries = await Timetable.find({ day: day });
    return timetableEntries;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getTimetableByDate = async (startDate) => {
  try {
    const timetable = await Timetable.findOne({ startDate });
    return timetable;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addSessionToTimetable = async (timetableId, sessionData) => {
  try {
    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      throw new Error('Timetable not found');
    }

    timetable.sessions.push(sessionData);
    await timetable.save();

    // Notify students allocated to this timetable and course
    const users = await User.find({ courseId: timetable.courseId, role: 'Student' });
    const emailList = users.map(user => user.email);
    const subject = 'New Session Added';
    const text = `A new session has been added to the timetable for your course.`;
    emailList.forEach(async recipient => {
      await sendEmailNotification(subject, text, recipient);
    });

    logger.info('sessionadding - session added created successfully');
    return timetable;
  } catch (error) {
    logger.error(`sessionadding - Error: ${error.message}`);
    throw new Error(error.message);
  }
};

exports.updateSessionInTimetable = async (timetableId, sessionId, newData) => {
  try {
    // Find the timetable by ID
    const timetable = await Timetable.findById(timetableId);

    // Check if the timetable exists
    if (!timetable) {
      throw new Error('Timetable not found');
    }

    // Find the session within the timetable
    const session = timetable.sessions.find(session => session._id.toString() === sessionId);

    // Check if the session exists
    if (!session) {
      throw new Error('Session not found in timetable');
    }

    // Update the session data
    Object.assign(session, newData);

    // Save the updated timetable
    await timetable.save();

     // Notify students allocated to this timetable and course
     const users = await User.find({ courseId: timetable.courseId, role: 'Student' });
     const emailList = users.map(user => user.email);
     const subject = 'Session Updated';
     const text = `A session in the timetable for your course has been updated.`;
     emailList.forEach(async recipient => {
       await sendEmailNotification(subject, text, recipient);
     });

     logger.info('sessionupdating - session updated created successfully');
    return { message: 'Session updated successfully', session };
  } catch (error) {
    logger.error(`sessionupdating - Error: ${error.message}`);
    throw new Error(error.message);
  }
};

exports.deleteSessionFromTimetable = async (timetableId, sessionId) => {
  try {
    // Find the timetable by ID
    const timetable = await Timetable.findById(timetableId);

    // Check if the timetable exists
    if (!timetable) {
      throw new Error('Timetable not found');
    }

    // Filter out the session to be deleted
    timetable.sessions = timetable.sessions.filter(session => session._id.toString() !== sessionId);

    // Save the updated timetable
    await timetable.save();

    // Notify students allocated to this timetable and course
    const users = await User.find({ courseId: timetable.courseId, role: 'student' });
    const emailList = users.map(user => user.email);
    const subject = 'Session Deleted';
    const text = `A session has been deleted from the timetable for your course.`;
    emailList.forEach(async recipient => {
      await sendEmailNotification(subject, text, recipient);
    });


    return { message: 'Session deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to check if two time intervals overlap
function doSessionsOverlap(session1, session2) {
  const startTime1 = session1.startTime.toISOString();
  const startTime2 = new Date(session2.startTime).toISOString();

  const endTime1 = session1.endTime.toISOString();
  const endTime2 = new Date(session2.endTime).toISOString();

  console.log(startTime1)
  console.log(startTime2)
  console.log((startTime2 >= startTime1 && startTime2 <= endTime1) && (endTime2 >= startTime1 && endTime2 <= endTime1))
  return ((startTime2 >= startTime1 && startTime2 <= endTime1) && (endTime2 >= startTime1 && endTime2 <= endTime1));
}

// Function to check if two sessions have overlapping locations
function doLocationsOverlap(session1, session2) {
  return session1.location === session2.location;
}

// Function to validate session data and check for overlaps
exports.validateSessionData = async (timetableId, newSessionData) => {
  const timetable = await Timetable.findById(timetableId);
  if (!timetable) {
    throw new Error('Timetable not found');
  }

  // Check if the new session overlaps with any existing session in the timetable
  for (const existingSession of timetable.sessions) {
    if (doSessionsOverlap(existingSession, newSessionData) && doLocationsOverlap(existingSession, newSessionData)) {
      throw new Error('Session overlaps with existing session');
    }
  }
};

exports.getStudentTimetable = async (studentId) => {
  try {
    // Find the enrollment for the student
    const enrollment = await Enrollment.findOne({ student: studentId });
    if (!enrollment) {
      throw new Error('Student is not enrolled in any courses');
    }

    // Fetch the timetable associated with the enrollment
    const timetable = await Timetable.findOne({ course: enrollment.courseId });
    return timetable;
  } catch (error) {
    throw new Error('Failed to fetch timetable for the student');
  }
};


// Function to send email notification
const sendEmailNotification = async (subject, text, recipient) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: recipient,
    subject,
    text
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}