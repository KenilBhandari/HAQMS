const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getQueue } = require('../controllers/queueControllers/getQueue.controller');
const { checkIn } = require('../controllers/queueControllers/checkIn.controller');
const { updateQueueToken } = require('../controllers/queueControllers/updateQueueToken.controller');

const router = express.Router();

router.get('/', authenticate, getQueue);
router.post('/checkin', authenticate, checkIn);
router.patch('/:id', authenticate, updateQueueToken);

module.exports = router;
