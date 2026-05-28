import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getQueue } from '../controllers/queueControllers/getQueue.controller.js';
import { checkIn } from '../controllers/queueControllers/checkIn.controller.js';
import { updateQueueToken } from '../controllers/queueControllers/updateQueueToken.controller.js';

const router = express.Router();

// GET /api/queue
router.get('/', authenticate, getQueue);

// POST /api/queue/checkin
router.post('/checkin', authenticate, authorize(['RECEPTIONIST', 'ADMIN', 'DOCTOR']), checkIn);

// PATCH /api/queue/:id
router.patch('/:id', authenticate, authorize(['DOCTOR', 'ADMIN']), updateQueueToken);

export default router;
