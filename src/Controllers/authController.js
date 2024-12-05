const authService = require('../Services/authService');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
