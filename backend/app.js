const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const animalImageRoutes = require('./routes/animalImageRoutes');
const path = require('path')
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/data', animalImageRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/',(req,res)=>{
res.send("Animal Detection BACkEnd ")
})
connectDB();
module.exports = app;
