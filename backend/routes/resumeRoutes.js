const express = require('express');
const multer = require('multer');
const { uploadAndAnalyze } = require('../controllers/resumeController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Route to handle resume upload and AI processing
router.post('/analyze', upload.array('resumes', 20), uploadAndAnalyze);

module.exports = router;