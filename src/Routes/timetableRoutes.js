const express = require('express');
const router = express.Router();
const timetableController = require('../Controllers/timetableController.js');

router.post('/timetables', timetableController.createTimetableEntry);
router.put('/timetables/:id', timetableController.updateTimetableEntry);
router.delete('/timetables/:id', timetableController.deleteTimetableEntry);
router.get('/timetables/course/:courseId', timetableController.getTimetableForCourse);
router.get('/timetables/day/:day', timetableController.getTimetableForDay);

// Route to get timetable by start date
router.get('/timetables', timetableController.getTimetable);

// Route to add session to timetable
router.post('/timetables/:id/sessions', timetableController.addSessionToTimetable);

// Route to update session in timetable
router.put('/timetables/:id/sessions/:sessionId', timetableController.updateSessionInTimetable);

// Route to delete session from timetable
router.delete('/timetables/:id/sessions/:sessionId', timetableController.deleteSessionFromTimetable);

router.get('timetables/student-timetable', timetableController.getStudentTimetable);


module.exports = router;
