const express = require('express');
const cors = require('cors');
require('dotenv').config();
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🌟 NEW FIX: Serve the test.html directly from localhost
app.get('/', (req, res) => res.send('SmartATS Backend is Running successfully! 🚀'));

// Routes
app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 SmartATS Backend running dynamically on port ${PORT}`);
});