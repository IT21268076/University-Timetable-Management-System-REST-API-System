const Enrollment = require('../Models/Enrollment');
const Timetable = require('../Models/Timetable');

exports.enrollInCourse = async (enrollmentData) => {
  try {
    // Check for conflicts with existing student enrollments
    const existingEnrollments = await Enrollment.find({
      studentId: enrollmentData.studentId
    });

    // Assuming timetable entries are stored in Timetable model
    const conflictingTimetableEntries = await Timetable.find({
      courseId: { $in: existingEnrollments.map(enrollment => enrollment.courseId) },
      day: enrollmentData.day,
      time: enrollmentData.time
    });

    if (conflictingTimetableEntries.length > 0) {
      throw new Error('Scheduling conflict: Student is already enrolled in a course with a conflicting timetable entry');
    }

    // Enroll the student
    const enrollment = new Enrollment(enrollmentData);
    await enrollment.save();
    return enrollment;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getStudentTimetable = async (studentId) => {
  try {
    const enrollments = await Enrollment.find({ studentId: studentId });
    const courseIds = enrollments.map(enrollment => enrollment.courseId);
    const timetable = await Timetable.find({ courseId: { $in: courseIds } });
    return timetable;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getEnrolledStudentsForCourse = async (courseId) => {
  try {
    const enrolledStudents = await Enrollment.find({ course: courseId }).populate('student');
    return enrolledStudents;
  } catch (error) {
    throw new Error('Failed to fetch enrolled students for the course');
  }
};

exports.enrollStudentInCourse = async (courseId, studentId) => {
  try {
    const enrollment = new Enrollment({ course: courseId, student: studentId });
    await enrollment.save();
    return enrollment;
  } catch (error) {
    throw new Error('Failed to enroll student in the course');
  }
};

exports.removeStudentFromCourse = async (courseId, studentId) => {
  try {
    await Enrollment.findOneAndDelete({ course: courseId, student: studentId });
  } catch (error) {
    throw new Error('Failed to remove student from the course');
  }
};