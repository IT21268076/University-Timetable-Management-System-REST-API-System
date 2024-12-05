const EnrollmentService = require('../../src/Services/enrollmentService');
const Enrollment = require('../../src/Models/Enrollment');
const Timetable = require('../../src/Models/Timetable');

describe('Enrollment Service Integration Tests', () => {
  // Test case for enrolling a student in a course
  it('should enroll a student in a course', async () => {
    // Mock data for enrollment
    const enrollmentData = {
      courseId: '617f1a9df55ab31e6cb80411',
      studentId: '617f1a9df55ab31e6cb80412'
    };

    // Perform enrollment
    const enrollment = await EnrollmentService.enrollInCourse(enrollmentData);

    // Validate enrollment
    expect(enrollment).toBeDefined();
    expect(enrollment.courseId).toBe(enrollmentData.courseId);
    expect(enrollment.studentId).toBe(enrollmentData.studentId);
  },15000);

  // Test case for getting timetable for a student
  it('should get timetable for a student', async () => {
    // Mock student ID
    const studentId = '617f1a9df55ab31e6cb80412';

    // Get timetable for the student
    const timetable = await EnrollmentService.getStudentTimetable(studentId);

    // Validate timetable
    expect(timetable).toBeDefined();
    expect(Array.isArray(timetable)).toBe(true);
  },15000);

  // Test case for getting enrolled students for a course
  it('should get enrolled students for a course', async () => {
    // Mock course ID
    const courseId = '617f1a9df55ab31e6cb80411';

    // Get enrolled students for the course
    const enrolledStudents = await EnrollmentService.getEnrolledStudentsForCourse(courseId);

    // Validate enrolled students
    expect(enrolledStudents).toBeDefined();
    expect(Array.isArray(enrolledStudents)).toBe(true);
  },15000);
});
