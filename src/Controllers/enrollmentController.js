const enrollmentService = require('../Services/enrollmentService');

exports.enrollInCourse = async (req, res) => {
  try {
    const enrollment = await enrollmentService.enrollInCourse(req.body);
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudentTimetable = async (req, res) => {
  try {
    const timetable = await enrollmentService.getStudentTimetable(req.user._id);
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getEnrolledStudentsForCourse = async (req, res) => {
  try {
    const enrolledStudents = await enrollmentService.getEnrolledStudentsForCourse(req.params.courseId);
    res.json(enrolledStudents);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getEnrolledStudentsForCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const enrolledStudents = await enrollmentService.getEnrolledStudentsForCourse(courseId);
    res.json(enrolledStudents);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.enrollStudentInCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.body.studentId;
    const userRole = req.user.role; 
    if (userRole !== 'Faculty' && userRole !== 'Admin') {
      return res.status(403).json({ error: `Forbidden: ${userRole} does not have access to this operation` });
    }
    const enrollment = await enrollmentService.enrollStudentInCourse(courseId, studentId);
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeStudentFromCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    const userRole = req.user.role;
    if (userRole !== 'Faculty' && userRole !== 'Admin') {
      return res.status(403).json({ error: `Forbidden: ${userRole} does not have access to this operation` });
    }
    await enrollmentService.removeStudentFromCourse(courseId, studentId);
    res.json({ message: 'Student removed from course successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};