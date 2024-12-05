// authzMiddleware.js
module.exports = function(allowedRoles) {
    return function(req, res, next) {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: `Forbidden: ${req.user.role} has no access to this` });
      }
      next();
    };
  };
  