const jwt = require('jsonwebtoken');
const User = require('../Models/User');

exports.login = async (username, password) => {
  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign(
  { userId: user._id, username: user.username, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);


    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};
