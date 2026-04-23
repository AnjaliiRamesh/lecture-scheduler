const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─────────────────────────────────────────
// REGISTER — POST /api/auth/register
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    // 1. Get data sent from frontend
    const { name, email, password, role } = req.body;

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Encrypt the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // 5. Send back success response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// LOGIN — POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    // 1. Get email and password from request
    const { email, password } = req.body;

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },   // Payload — data inside token
      process.env.JWT_SECRET,               // Secret key to sign it
      { expiresIn: '1d' }                   // Token expires in 1 day
    );

    // 5. Send token back to frontend
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;