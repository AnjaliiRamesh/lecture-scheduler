const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// ─────────────────────────────────────────
// GET ALL INSTRUCTORS — GET /api/users/instructors
// Only admin can access this
// ─────────────────────────────────────────
router.get('/instructors', protect, adminOnly, async (req, res) => {
  try {
    // Find all users where role is instructor
    const instructors = await User.find({ role: 'instructor' }).select('-password');

    res.status(200).json({
      message: 'Instructors fetched successfully',
      instructors
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;