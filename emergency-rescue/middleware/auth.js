const jwt = require('jsonwebtoken');

const authenticate = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ error: 'Unauthorized role' });
    }
    req.user = decoded; // { user_id, role }
    next();
  });
};

module.exports = authenticate;