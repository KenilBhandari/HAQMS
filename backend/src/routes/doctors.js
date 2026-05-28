import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getDoctors } from '../controllers/doctorControllers/getDoctors.controller.js';
import { getDoctorStats } from '../controllers/doctorControllers/getDoctorStats.controller.js';
import { getDoctorById } from '../controllers/doctorControllers/getDoctorById.controller.js';

const router = express.Router();

// GET /api/doctors
router.get('/', authenticate, getDoctors);

// GET /api/doctors/stats
router.get('/stats', authenticate, getDoctorStats);

// GET /api/doctors/:id
router.get('/:id', authenticate, getDoctorById);

export default router;
