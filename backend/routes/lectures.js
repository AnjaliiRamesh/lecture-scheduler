const express = require('express');
const router = express.Router();
const Lecture = require('../models/Lecture');
const { protect, adminOnly } = require('../middleware/auth');

// ─────────────────────────────────────────
// CREATE LECTURE — POST /api/lectures
// Admin only
// ─────────────────────────────────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { course, instructor, date, title, description } = req.body;

    // ── CLASH DETECTION ──────────────────
    // Convert the incoming date to a full day range
    // This handles cases where time part differs but date is same
    const lectureDate = new Date(date);

    // Start of the day: 00:00:00
    const startOfDay = new Date(lectureDate);
    startOfDay.setHours(0, 0, 0, 0);

    // End of the day: 23:59:59
    const endOfDay = new Date(lectureDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if instructor already has a lecture on this date
    const existingLecture = await Lecture.findOne({
      instructor,
      date: {
        $gte: startOfDay,  // greater than or equal to start of day
        $lte: endOfDay     // less than or equal to end of day
      }
    });

    // If a lecture exists → clash detected!
    if (existingLecture) {
      return res.status(400).json({
        message: 'Schedule clash! This instructor already has a lecture on this date.'
      });
    }
    // ── END CLASH DETECTION ──────────────

    // No clash → create the lecture
    const lecture = await Lecture.create({
      course,
      instructor,
      date: lectureDate,
      title,
      description
    });

    // Populate course and instructor details before sending response
    const populatedLecture = await Lecture.findById(lecture._id)
      .populate('course', 'name level')
      .populate('instructor', 'name email');

    res.status(201).json({
      message: 'Lecture scheduled successfully',
      lecture: populatedLecture
    });

  } catch (error) {
    // Handle MongoDB unique index clash (second layer of protection)
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Schedule clash! This instructor already has a lecture on this date.'
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// GET ALL LECTURES — GET /api/lectures
// Admin only
// ─────────────────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .populate('course', 'name level image')
      .populate('instructor', 'name email')
      .sort({ date: 1 }); // Sort by date ascending

    res.status(200).json({
      message: 'Lectures fetched successfully',
      lectures
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// GET INSTRUCTOR LECTURES — GET /api/lectures/instructor/:id
// For instructor panel
// ─────────────────────────────────────────
router.get('/instructor/:id', protect, async (req, res) => {
  try {
    const lectures = await Lecture.find({ instructor: req.params.id })
      .populate('course', 'name level image description')
      .populate('instructor', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      message: 'Instructor lectures fetched successfully',
      lectures
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;