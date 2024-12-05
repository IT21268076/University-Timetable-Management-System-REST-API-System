// models/Timetable.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    required: true
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

const timetableSchema = new mongoose.Schema({
  startDate: { 
    type: Date, 
    required: true 
  },
  day: { 
    type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  sessions: [sessionSchema],
});


const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
