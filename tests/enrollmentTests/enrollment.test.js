const { enrollInCourse } = require('../../src/Services/enrollmentService'); // Adjust the path accordingly
const  Enrollment  = require('../../src/Models/Enrollment'); // Import your models
const  Timetable  = require('../../src/Models/Timetable');

// Mocking the Enrollment and Timetable models
jest.mock('../../src/Models/Enrollment', () => ({
    find: jest.fn().mockResolvedValue([]), // Mock find to return an empty array
    create: jest.fn().mockResolvedValue({}), // Mock create to return an empty object
}));
jest.mock('../../src/Models/Timetable', () => ({
    find: jest.fn().mockResolvedValue([]), // Mock find to return an empty array
}));

describe('enrollInCourse', () => {
    it('should enroll a student in a course without conflicts', async () => {
      const enrollmentData = {
        studentId: 'someStudentId',
        courseId: 'someCourseId',
        day: 'Monday',
        time: '10:00',
      };

      const enrollmentInstance = {
        studentId: enrollmentData.studentId,
        courseId: enrollmentData.courseId,
        day: enrollmentData.day,
        time: enrollmentData.time,
        save: jest.fn().mockResolvedValue(enrollmentData),
        find: jest.fn().mockResolvedValue(enrollmentData),
      };

      Enrollment.mockImplementationOnce(() => {
        return enrollmentInstance;
      });
  
      const enrollment = await enrollInCourse(enrollmentData);
  
      expect(enrollmentInstance.find).toHaveBeenCalledWith({ studentId: enrollmentData.studentId });
      expect(Timetable.find).toHaveBeenCalledWith({
        courseId: { $in: [] }, // Mocking an empty array for courseId
        day: enrollmentData.day,
        time: enrollmentData.time,
      });
      expect(Enrollment.create).toHaveBeenCalledWith(enrollmentData);
      expect(enrollment).toEqual(enrollmentData);
    });
  
    it('should throw an error if there is a scheduling conflict', async () => {
      // Mock existing enrollments to return one enrollment
      const existingEnrollment = [{ courseId: 'conflictingCourseId' }];
      Enrollment.find.mockResolvedValue(existingEnrollment);
      // Mock conflicting timetable entries to return one entry
      Timetable.find.mockResolvedValue([{ courseId: 'conflictingCourseId' }]);
  
      const enrollmentData = {
        studentId: 'someStudentId',
        courseId: 'someCourseId',
        day: 'Monday',
        time: '10:00',
      };
  
      await expect(enrollInCourse(enrollmentData)).rejects.toThrow(
        'Scheduling conflict: Student is already enrolled in a course with a conflicting timetable entry'
      );
  
      expect(Enrollment.find).toHaveBeenCalledWith({ studentId: enrollmentData.studentId });
      expect(Timetable.find).toHaveBeenCalledWith({
        courseId: { $in: ['conflictingCourseId'] }, // Mocking the conflicting courseId
        day: enrollmentData.day,
        time: enrollmentData.time,
      });
      expect(Enrollment.create).not.toHaveBeenCalled();
    });
  });