const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,    // We'll store the image file path as text
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,   // This is a MongoDB ID
      ref: 'User',                            // It references the User model
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;