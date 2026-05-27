const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getDoctorStatsReport } = require('../controllers/reportControllers/getDoctorStatsReport.controller');

const router = express.Router();

router.get('/doctor-stats', authenticate, getDoctorStatsReport);

module.exports = router;
