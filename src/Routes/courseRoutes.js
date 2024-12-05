const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/courseController.js');
const authzMiddleware = require('../Middlewares/authzMiddleware');

router.post('/courses', authzMiddleware(['Admin', 'Faculty']), courseController.createCourse);
router.put('/courses/:id', authzMiddleware(['Admin', 'Faculty']), courseController.updateCourse);
router.delete('/courses/:id', authzMiddleware(['Admin', 'Faculty']), courseController.deleteCourse);
router.get('/courses', authzMiddleware(['Admin', 'Faculty']), courseController.getAllCourses);
router.get('/courses/:id', authzMiddleware(['Admin', 'Faculty']), courseController.getCourseById);
// Assign faculty to a course
router.put('/courses/:code/assign-faculty', authzMiddleware(['Admin']), courseController.assignFacultyToCourseByCode);

module.exports = router;
