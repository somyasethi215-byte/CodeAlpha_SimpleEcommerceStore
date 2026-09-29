// middleware/requireAuth.js
// Blocks a request unless the user has an active session.

module.exports = function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'You must be logged in to do that.' });
  }
  next();
};
