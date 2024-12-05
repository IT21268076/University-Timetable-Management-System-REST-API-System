// authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get the token from the request header
  const token = req.headers.authorization;
 
  // Check if token is provided
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the token
  try {
    
    const decodedPayload = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    req.user = decodedPayload;
    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
