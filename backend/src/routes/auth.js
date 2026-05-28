import express from 'express';
import limiter from '../utils/rateLimiter.js';
import { registerController } from '../controllers/authControllers/register.controller.js';
import { loginController } from '../controllers/authControllers/login.controller.js';
import { authController } from '../controllers/authControllers/auth.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { getUsers } from '../controllers/authControllers/getUsers.controller.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', limiter, authenticate, authorize(['ADMIN']), registerController);

// POST /api/auth/login
router.post('/login', limiter, loginController);

// GET /api/auth/users
router.get('/users', authenticate, authorize(['ADMIN']), getUsers);

// GET /api/auth/me
router.get('/me', authenticate, authController);

export default router;
