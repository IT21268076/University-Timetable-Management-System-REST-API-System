// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  credits: {
    type: Number,
    required: true
  },
  faculty: {
    // type: String
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming 'User' model exists for faculty
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
