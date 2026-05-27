const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getDoctors } = require('../controllers/doctorControllers/getDoctors.controller');
const { getDoctorStats } = require('../controllers/doctorControllers/getDoctorStats.controller');
const { getDoctorById } = require('../controllers/doctorControllers/getDoctorById.controller');

const router = express.Router();

// GET /api/doctors
router.get('/', authenticate, getDoctors);

// GET /api/doctors/stats
router.get('/stats', authenticate, getDoctorStats);

// GET /api/doctors/:id
router.get('/:id', authenticate, getDoctorById);

module.exports = router;
