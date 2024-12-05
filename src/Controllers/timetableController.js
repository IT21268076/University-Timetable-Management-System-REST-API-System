const timetableService = require('../Services/timetableService');

exports.createTimetableEntry = async (req, res) => {
  try {
    const timetableEntry = await timetableService.createTimetableEntry(req.body);
    res.status(201).json(timetableEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTimetableEntry = async (req, res) => {
  try {
    const updatedTimetableEntry = await timetableService.updateTimetableEntry(req.params.id, req.body);
    res.json(updatedTimetableEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTimetableEntry = async (req, res) => {
  try {
    await timetableService.deleteTimetableEntry(req.params.id);
    res.json({ message: 'Timetable entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTimetableForCourse = async (req, res) => {
  try {
    const timetableEntries = await timetableService.getTimetableForCourse(req.params.courseId);
    res.json(timetableEntries);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTimetableForDay = async (req, res) => {
  try {
    const timetableEntries = await timetableService.getTimetableForDay(req.params.day);
    res.json(timetableEntries);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const { startDate } = req.query;
    const timetable = await timetableService.getTimetableByDate(startDate);
    res.json(timetable);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addSessionToTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionData = req.body;

    console.log(sessionData)
    // Validate session data before adding
    await timetableService.validateSessionData(id, sessionData);

    const updatedTimetable = await timetableService.addSessionToTimetable(id, sessionData);
    res.json(updatedTimetable);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSessionInTimetable = async (req, res) => {
  try {
    const { timetableId, sessionId } = req.params;
    const { newData } = req.body;

    const result = await timetableService.updateSessionInTimetable(timetableId, sessionId, newData);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSessionFromTimetable = async (req, res) => {
  try {
    const { timetableId, sessionId } = req.params;

    const result = await timetableService.deleteSessionFromTimetable(timetableId, sessionId);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentTimetable = async (req, res) => {
  try {
    const timetable = await timetableService.getStudentTimetable(req.user._id); 
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable not found for the student' });
    }
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
