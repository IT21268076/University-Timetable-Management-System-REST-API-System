const { createCourse } = require('../../src/Services/courseService');
const {sendEmailNotificationToAdmins} = require('../../src/Services/notificationService');

// Mocking the Course model and sendEmailNotificationToAdmins function
jest.mock('../../src/Models/Course', () => {
  return jest.fn().mockImplementation(() => {
    return {
      save: jest.fn()
    };
  });
});

describe('createCourse', () => {
    it('should create a new course', async () => {
        const courseData = {
          name: 'Test Course',
          description: 'This is a test course'
        };
    
        const courseInstance = {
          name: courseData.name,
          save: jest.fn().mockResolvedValue(courseData)
        };
    
        const Course = require('../../src/Models/Course'); // Importing the mocked Course class
        Course.mockImplementationOnce(() => {
          return courseInstance;
        });
    
        const createdCourse = await createCourse(courseData);
    
        expect(Course).toHaveBeenCalledWith(courseData); // Check if Course constructor was called with correct data
        expect(courseInstance.save).toHaveBeenCalled(); // Check if save method of courseInstance was called
        expect(createdCourse).toEqual(courseInstance); // Check if createdCourse matches the course instance
      });
  
    it('should throw an error if course creation fails', async () => {
      const courseData = {
        name: 'Test Course',
        description: 'This is a test course'
      };
  
      const errorMessage = 'Error creating course';
  
      const Course = require('../../src/Models/Course');
      Course.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });
  
      await expect(createCourse(courseData)).rejects.toThrow(errorMessage); // Check if createCourse function throws an error with correct message
    });

    it('should throw an error if course creation fails', async () => {
      const courseData = {
        name: 'Test Course',
        description: 'This is a test course'
      };

      const errorMessage = 'Error creating course';

      const Course = require('../../src/Models/Course');
      Course.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      await expect(createCourse(courseData)).rejects.toThrow(errorMessage); // Check if createCourse function throws an error with correct message
    });


    it('should create a new course with long description', async () => {
        const courseData = {
          name: 'Test Course',
          description: 'This is a test course with a long description'.repeat(100)
        };

        const courseInstance = {
          name: courseData.name,
          save: jest.fn().mockResolvedValue(courseData)
        };

        const Course = require('../../src/Models/Course'); // Importing the mocked Course class
        Course.mockImplementationOnce(() => {
          return courseInstance;
        });

        const createdCourse = await createCourse(courseData);

        expect(Course).toHaveBeenCalledWith(courseData); // Check if Course constructor was called with correct data
        expect(courseInstance.save).toHaveBeenCalled(); // Check if save method of courseInstance was called
        expect(createdCourse).toEqual(courseInstance); // Check if createdCourse matches the course instance
      });


    it('should not throw an error if course name is missing', async () => {
      const courseData = {
        description: 'This is a test course'
      };

      await expect(createCourse(courseData)).resolves.not.toThrow(); // Check if createCourse function does not throw an error
    });

    it('should create a new course with empty name and description', async () => {
      const courseData = {
        description: 'This is a test course'
      };

      await expect(createCourse(courseData)).resolves.toBeTruthy();
    });
  });