const User = require('../Models/User');

exports.register = async (userData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ username: userData.username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Create new user
  const newUser = new User(userData);
  await newUser.save();

  return newUser;
};
