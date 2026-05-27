const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getAppointments } = require('../controllers/appointmentControllers/getAppointments.controller');
const { createAppointment } = require('../controllers/appointmentControllers/createAppointment.controller');
const { updateAppointment } = require('../controllers/appointmentControllers/updateAppointment.controller');

const router = express.Router();

// GET /api/appointments
router.get('/', authenticate, getAppointments);

// POST /api/appointments
router.post('/', authenticate, createAppointment);

// PATCH /api/appointments
router.patch('/:id', authenticate, updateAppointment);

module.exports = router;
