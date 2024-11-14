const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const animalImageRoutes = require('./routes/animalImageRoutes');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration for multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      `${process.env.Front_end_CROS}`||"https://animaldetection.vercel.app",  // Production URL
      'http://localhost:3000',              // Localhost URL
      'http://localhost:5000',              // Another possible local dev URL
      // Add other frontend URLs here as needed
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Use CORS with the specific configuration
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/data', animalImageRoutes);

// Root route
app.get('/', (req, res) => {
  res.send("Animal Detection Backend");
});

// Connect to the database
connectDB();

module.exports = app;
