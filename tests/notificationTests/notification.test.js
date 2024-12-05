const User = require('../../src/Models/User');
const {transporter, sendEmailNotificationToAdmins, sendEmailNotificationToAllUsers} = require('../../src/Services/notificationService');

describe('sendEmailNotificationToAllUsers', () => {

  // Function sends email notification to all users successfully
  it('should send email notification to all users successfully', async () => {
    console.log = jest.fn();
    // Mock User.find() to return an array of user objects
    const mockUsers = [{ email: 'user1@example.com' }, { email: 'user2@example.com' }];
    User.find = jest.fn().mockResolvedValue(mockUsers);

    // Mock transporter.sendMail() to return a resolved promise
    transporter.sendMail = jest.fn().mockResolvedValue();

    // Call the function
    await sendEmailNotificationToAllUsers('Test Subject', 'Test Text');

    // Check that User.find() was called with the correct arguments
    expect(User.find).toHaveBeenCalledWith({}, 'email');

    // Check that transporter.sendMail() was called with the correct arguments
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: 'timetablemana@gmail.com',
      to: 'user1@example.com, user2@example.com',
      subject: 'Test Subject',
      text: 'Test Text'
    });

    // Check that the console log message was printed
    expect(console.log).toHaveBeenCalledWith('Email notification sent to all users successfully');
  });

  // Function throws an error when there is an issue with retrieving users from the database
  it('should throw an error when there is an issue with retrieving users from the database', async () => {
    // Mock User.find() to throw an error
    const mockError = new Error('Database error');
    User.find = jest.fn().mockRejectedValue(mockError);

    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Call the function
    await sendEmailNotificationToAllUsers('Test Subject', 'Test Text');

    // Check that User.find() was called with the correct arguments
    expect(User.find).toHaveBeenCalledWith({}, 'email');

    // Check that the console error message was printed
    expect(console.error).toHaveBeenCalledWith('Error sending email notification to all users:', mockError);
  });
});
