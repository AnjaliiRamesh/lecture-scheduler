const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',        // References the Course model
      required: true
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',          // References the User model
      required: true
    },
    date: {
      type: Date,           // Stores a proper date value
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// This is the CLASH DETECTION magic 
// It ensures no instructor can have two lectures on the same date
lectureSchema.index({ instructor: 1, date: 1 }, { unique: true });

const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;