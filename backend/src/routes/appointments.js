import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getAppointments } from '../controllers/appointmentControllers/getAppointments.controller.js';
import { createAppointment } from '../controllers/appointmentControllers/createAppointment.controller.js';
import { updateAppointment } from '../controllers/appointmentControllers/updateAppointment.controller.js';

const router = express.Router();

// GET /api/appointments
router.get('/', authenticate, getAppointments);

// POST /api/appointments
router.post('/', authenticate, authorize(['RECEPTIONIST', 'ADMIN', 'DOCTOR']), createAppointment);

// PATCH /api/appointments
router.patch('/:id', authenticate, authorize(['DOCTOR', 'ADMIN']), updateAppointment);

export default router;
