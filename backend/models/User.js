
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,       
      required: true,     
      trim: true          // Removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,       
      trim: true,
      lowercase: true     
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'instructor'], // Only these two values allowed
      default: 'instructor'          // If not specified, defaults to instructor
    }
  },
  {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Model from the schema
const User = mongoose.model('User', userSchema);

// Export it so other files can use it
module.exports = User;