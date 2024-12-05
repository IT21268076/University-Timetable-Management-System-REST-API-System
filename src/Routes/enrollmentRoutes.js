const express = require('express');
const router = express.Router();
const enrollmentController = require('../Controllers/enrollmentController.js');
const authzMiddleware = require('../Middlewares/authzMiddleware');

router.post('/enrollments', authzMiddleware(['Admin', 'Faculty', 'Student']), enrollmentController.enrollInCourse);
router.get('/enrollments/timetable', authzMiddleware(['Admin', 'Faculty']), enrollmentController.getStudentTimetable);
router.get('/enrollments/course/:courseId', authzMiddleware(['Admin', 'Faculty']), enrollmentController.getEnrolledStudentsForCourse);
router.post('/enrollments/:courseId/students',  authzMiddleware(['Admin', 'Faculty']), enrollmentController.enrollStudentInCourse);
router.delete('/enrollments/:courseId/students/:studentId', authzMiddleware(['Admin', 'Faculty']), enrollmentController.removeStudentFromCourse);

module.exports = router;
