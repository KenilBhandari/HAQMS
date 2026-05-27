const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getAppointments } = require('../controllers/appointmentControllers/getAppointments.controller');
const { createAppointment } = require('../controllers/appointmentControllers/createAppointment.controller');
const { updateAppointment } = require('../controllers/appointmentControllers/updateAppointment.controller');

const router = express.Router();

router.get('/', authenticate, getAppointments);
router.post('/', authenticate, createAppointment);
router.patch('/:id', authenticate, updateAppointment);

module.exports = router;
