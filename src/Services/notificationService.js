// // // services/notificationService.js

// // const Notification = require('../Models/Notification');

// // exports.createNotification = async (notificationData) => {
// //   try {
// //     const notification = new Notification(notificationData);
// //     await notification.save();
// //     return notification;
// //   } catch (error) {
// //     throw new Error('Failed to create notification');
// //   }
// // };

// // exports.getNotificationsForUser = async (userId) => {
// //   try {
// //     const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
// //     return notifications;
// //   } catch (error) {
// //     throw new Error('Failed to fetch notifications');
// //   }
// // };

// // exports.markNotificationAsRead = async (notificationId) => {
// //   try {
// //     const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
// //     return notification;
// //   } catch (error) {
// //     throw new Error('Failed to mark notification as read');
// //   }
// // };

const User = require('../Models/User');
const nodemailer = require('nodemailer');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'timetablemana@gmail.com',
    pass: 'urmt lhpd sjth coou'
  }
});

// Function to send email notification to all users
const sendEmailNotificationToAllUsers = async (subject, text) => {
  try {
    // Retrieve all users from the database
    const users = await User.find({}, 'email');

    // Extract email addresses from user objects
    const emailList = users.map(user => user.email);

    // Create email options
    const mailOptions = {
      from: 'timetablemana@gmail.com',
      to: emailList.join(', '), // Join all email addresses with commas
      subject,
      text
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent to all users successfully');
  } catch (error) {
    console.error('Error sending email notification to all users:', error);
  }
};

const sendEmailNotificationToAdmins = async (subject, text) => {
    try {
      // Retrieve admin users from the database
      const admins = await User.find({ role: 'Admin' }, 'email');
  
      // Extract email addresses from admin user objects
      const adminEmails = admins.map(admin => admin.email);
  
      // Create email options
      const mailOptions = {
        from: 'timetablemana@gmail.com',
        to: adminEmails.join(', '), // Join all admin email addresses with commas
        subject,
        text
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent to admins successfully');
    } catch (error) {
      console.error('Error sending email notification to admins:', error);
    }
  };

  const sendEmailNotificationToStudents = async (subject, text) => {
    try {
      // Retrieve admin users from the database
      const students = await User.find({ role: 'Student' }, 'email');
  
      // Extract email addresses from admin user objects
      const studentEmails = students.map(students => students.email);
  
      // Create email options
      const mailOptions = {
        from: 'timetablemana@gmail.com',
        to: studentEmails.join(', '), // Join all admin email addresses with commas
        subject,
        text
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent to students successfully');
    } catch (error) {
      console.error('Error sending email notification to students:', error);
    }
  };

  const sendEmailNotificationToFaculty = async (subject, text) => {
    try {
      // Retrieve admin users from the database
      const faculty = await User.find({ role: 'Faculty' }, 'email');
  
      // Extract email addresses from admin user objects
      const facultyEmails = faculty.map(faculty => faculty.email);
  
      // Create email options
      const mailOptions = {
        from: 'timetablemana@gmail.com',
        to: facultyEmails.join(', '), // Join all admin email addresses with commas
        subject,
        text
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent to faculty successfully');
    } catch (error) {
      console.error('Error sending email notification to faculty:', error);
    }
  };

module.exports = {transporter, sendEmailNotificationToAllUsers, sendEmailNotificationToAdmins, sendEmailNotificationToFaculty, sendEmailNotificationToStudents};