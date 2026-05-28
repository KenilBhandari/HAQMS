const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getPatients } = require('../controllers/patientControllers/getPatients.controller');
const { getPatientById } = require('../controllers/patientControllers/getPatientById.controller');
const { createPatient } = require('../controllers/patientControllers/createPatient.controller');
const { deletePatient } = require('../controllers/patientControllers/deletePatient.controller');

const router = express.Router();

// GET /api/patients
router.get('/', authenticate, getPatients);

// GET /api/patients/:id
router.get('/:id', authenticate, getPatientById);

// POST /api/patients
router.post('/', authenticate, authorize(['RECEPTIONIST', 'ADMIN']), createPatient);

// DELETE /api/patients/:id
router.delete('/:id', authenticate, authorize(['ADMIN']), deletePatient);

module.exports = router;
