const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─────────────────────────────────────────
// PROTECT — checks if user is logged in
// ─────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    // 1. Check if token exists in request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 2. Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // 3. Verify the token is genuine and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user from the token's payload
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 5. Attach user to request object for next middleware/route
    req.user = user;

    // 6. Move to the next middleware or route handler
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ─────────────────────────────────────────
// ADMIN ONLY — checks if user is admin
// ─────────────────────────────────────────
const adminOnly = (req, res, next) => {
  // This runs AFTER protect middleware
  // So req.user is already available
  if (req.user && req.user.role === 'admin') {
    next(); // ✅ Is admin — continue
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { protect, adminOnly };