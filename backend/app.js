const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const animalImageRoutes = require('./routes/animalImageRoutes');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'https://animaldetection.vercel.app', // Frontend URL
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
