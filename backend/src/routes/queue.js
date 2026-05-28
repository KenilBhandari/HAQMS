const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getQueue } = require('../controllers/queueControllers/getQueue.controller');
const { checkIn } = require('../controllers/queueControllers/checkIn.controller');
const { updateQueueToken } = require('../controllers/queueControllers/updateQueueToken.controller');

const router = express.Router();

// GET /api/queue
router.get('/', authenticate, getQueue);

// POST /api/queue/checkin
router.post('/checkin', authenticate, authorize(['RECEPTIONIST', 'ADMIN', 'DOCTOR']), checkIn);

// PATCH /api/queue/:id
router.patch('/:id', authenticate, authorize(['DOCTOR', 'ADMIN']), updateQueueToken);

module.exports = router;
