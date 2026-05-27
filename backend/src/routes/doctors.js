const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getDoctors } = require('../controllers/doctorControllers/getDoctors.controller');
const { getDoctorStats } = require('../controllers/doctorControllers/getDoctorStats.controller');
const { getDoctorById } = require('../controllers/doctorControllers/getDoctorById.controller');

const router = express.Router();

router.get('/', authenticate, getDoctors);
router.get('/stats', authenticate, getDoctorStats);
router.get('/:id', authenticate, getDoctorById);

module.exports = router;
