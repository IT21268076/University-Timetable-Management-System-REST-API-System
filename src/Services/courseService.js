const Course = require('../Models/Course');
const { sendEmailNotificationToAllUsers, sendEmailNotificationToAdmins } = require('../Services/notificationService');
const logger = require('../logger');

exports.createCourse = async (courseData) => {
  try {
    logger.info('createCourse - Function entered');
    const course = new Course(courseData);
    await course.save();

    // Send email notification to all users for course creation
    // await sendEmailNotificationToAllUsers('New Course Created', `A new course "${course.name}" has been created.`);
    sendEmailNotificationToAdmins('New Course Created', `A new course "${course.name}" has been created.`);
    logger.info('createCourse - Course created successfully');
    return course;
  } catch (error) {
    logger.error(`createCourse - Error: ${error.message}`);
    throw new Error(error.message);
  }
};

exports.updateCourse = async (courseId, newData) => {
  try {
    logger.info('updateCourse - Function entered');
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    Object.assign(course, newData);
    await course.save();

    // Send email notification for course update
    await sendEmailNotification('Course Updated', `The course "${course.name}" has been updated.`);

    return course;
  } catch (error) {
    logger.error(`updateCourse - Error: ${error.message}`);
    throw new Error(error.message);
  }
};

exports.deleteCourse = async (courseId) => {
  try {
    logger.info('deleteCourse - Function entered');
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    await course.remove();

    // Send email notification for course deletion
    await sendEmailNotification('Course Deleted', `The course "${course.name}" has been deleted.`);

  } catch (error) {
    logger.error(`deleteCourse - Error: ${error.message}`);
    throw new Error(error.message);
  }
};

exports.getAllCourses = async () => {
  try {
    logger.info('getAllCourse - Function entered');
    const courses = await Course.find();
    return courses;
  } catch (error) {
    logger.error(`getAllCourse - Error: ${error.message}`);
    throw new Error(error.message);
  }
};

exports.getCourseById = async (courseId) => {
  try {
    logger.info('getCourseById - Function entered');
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    logger.info('getCourseById - Function completed successfully');
    return course;
  } catch (error) {
    logger.error(`getCourseById - Error: ${error.message}`);
    throw new Error(error.message);
  }
};

// Service function to assign faculty to a course by course code
exports.assignFacultyToCourseByCode = async (code, faculty) => {
  try {
    logger.info('assignFacultyToCourseByCode - Function entered');
    // Find the course by course code
    const course = await Course.findOne({ code });

    if (!course) {
      throw new Error('Course not found');
    }

    // Assign faculty to the course
    course.faculty = faculty;
    await course.save();

    // Send email notification for faculty assignment
    await sendEmailNotification('Faculty Assigned', `The faculty "${faculty}" has been assigned to the course "${course.name}".`);

    logger.info('assignFacultyToCourseByCode - Function completed successfully');
    return course; // Return the updated course details
  } catch (error) {
    logger.error(`assignFacultyToCourseByCode - Error: ${error.message}`);
    throw new Error(error.message); // Propagate errors
  }
};