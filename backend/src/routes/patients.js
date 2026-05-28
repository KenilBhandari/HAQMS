import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getPatients } from '../controllers/patientControllers/getPatients.controller.js';
import { getPatientById } from '../controllers/patientControllers/getPatientById.controller.js';
import { createPatient } from '../controllers/patientControllers/createPatient.controller.js';
import { deletePatient } from '../controllers/patientControllers/deletePatient.controller.js';

const router = express.Router();

// GET /api/patients
router.get('/', authenticate, getPatients);

// GET /api/patients/:id
router.get('/:id', authenticate, getPatientById);

// POST /api/patients
router.post('/', authenticate, authorize(['RECEPTIONIST', 'ADMIN']), createPatient);

// DELETE /api/patients/:id
router.delete('/:id', authenticate, authorize(['ADMIN']), deletePatient);

export default router;
