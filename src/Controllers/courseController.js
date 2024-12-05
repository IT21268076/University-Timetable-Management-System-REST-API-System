const courseService = require('../Services/courseService');

exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const course = await courseService.createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (req.user.role !== 'Admin' && req.user._id.toString() !== course.faculty.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedCourse = await courseService.updateCourse(req.params.id, req.body);
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (req.user.role !== 'Admin' && req.user._id.toString() !== course.faculty.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await courseService.deleteCourse(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to assign faculty to a course by course code
exports.assignFacultyToCourseByCode = async (req, res) => {
  try {
    const { code } = req.params; // Extract the course code from the request parameters
    const { faculty } = req.body; // Extract the faculty ID from the request body

    // Call the service function to assign faculty to the course by code
    const assignedCourse = await courseService.assignFacultyToCourseByCode(code, faculty);

    res.json(assignedCourse); // Respond with the assigned course details
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};
