const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');

// GET all universities
router.get('/', universityController.getAllUniversities);

// GET universities as CSV download
router.get('/download', universityController.downloadUniversitiesCSV);

module.exports = router; 