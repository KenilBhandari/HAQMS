const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getPatients } = require('../controllers/patientControllers/getPatients.controller');
const { getPatientById } = require('../controllers/patientControllers/getPatientById.controller');
const { createPatient } = require('../controllers/patientControllers/createPatient.controller');
const { deletePatient } = require('../controllers/patientControllers/deletePatient.controller');

const router = express.Router();

router.get('/', authenticate, getPatients);
router.get('/:id', authenticate, getPatientById);
router.post('/', authenticate, createPatient);
router.delete('/:id', authenticate, authorize(['ADMIN']), deletePatient);

module.exports = router;
