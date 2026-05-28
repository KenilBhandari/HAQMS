import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getDoctorReport } from '../controllers/reportControllers/getDoctorReport.controller.js';

const router = express.Router();

// GET /api/reports/doctor-stats
router.get('/doctor-stats', authenticate, getDoctorReport);

export default router;
