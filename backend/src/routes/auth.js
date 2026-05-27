const express = require('express');
const limiter = require('../utils/rateLimiter');
const router = express.Router();
const { registerController } = require('../controllers/authControllers/register.controller');
const { loginController } = require('../controllers/authControllers/login.controller');
const { authController } = require('../controllers/authControllers/auth.controller');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', limiter, registerController);

// POST /api/auth/login
router.post('/login', limiter, loginController);

// GET /api/auth/me
router.get('/me', authenticate, authController);

module.exports = router;
