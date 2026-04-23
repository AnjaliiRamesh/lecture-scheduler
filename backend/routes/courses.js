const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// ─────────────────────────────────────────
// MULTER SETUP — handles image uploads
// ─────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in uploads folder
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp + original name
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// ─────────────────────────────────────────
// CREATE COURSE — POST /api/courses
// Admin only
// ─────────────────────────────────────────
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, level, description } = req.body;

    // Build image path if image was uploaded
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    // Create course in database
    const course = await Course.create({
      name,
      level,
      description,
      image,
      createdBy: req.user._id  // From protect middleware
    });

    res.status(201).json({
      message: 'Course created successfully',
      course
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// GET ALL COURSES — GET /api/courses
// ─────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('createdBy', 'name email'); // Fetch admin details

    res.status(200).json({
      message: 'Courses fetched successfully',
      courses
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// GET SINGLE COURSE — GET /api/courses/:id
// ─────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course fetched successfully',
      course
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;