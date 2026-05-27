const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getDoctorReport } = require('../controllers/reportControllers/getDoctorReport.controller');

const router = express.Router();

// GET /api/reports/doctor-stats
router.get('/doctor-stats', authenticate, getDoctorReport);

module.exports = router;
