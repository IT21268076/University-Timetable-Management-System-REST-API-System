// models/Faculty.js
const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  
});

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
