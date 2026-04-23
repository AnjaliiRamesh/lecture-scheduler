// 1. Load environment variables from .env file
require('dotenv').config();


// 2. Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 3. Create the Express application
const app = express();

// 4. Middlewares — these run on every request
app.use(cors());            // Allow React frontend to talk to this server
app.use(express.json());    // Allow server to understand JSON data

// 5. Test route — just to confirm server is working
app.get('/', (req, res) => {
  res.send('Lecture Scheduler API is running!');
});

// 6. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:', error.message);
  });

// 7. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});